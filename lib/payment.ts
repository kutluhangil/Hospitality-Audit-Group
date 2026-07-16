import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import type { BillingRequest } from "@/lib/billing-schema";
import { hasCorporateIdentity } from "@/lib/company-data";
import { RECORD_CATEGORY, recordTitleOf } from "@/lib/module-records";
import { priceOf, type CartItemId } from "@/lib/modules-data";

/**
 * The payment provider boundary. iyzico exists only inside this file.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  PAYMENT HAS NO FALLBACK. THIS IS DELIBERATE AND IT IS NOT A BUG.        │
 * │                                                                          │
 * │  /api/teklif logs the payload and answers 200 when RESEND_API_KEY is     │
 * │  missing, because a quote that only reaches a log costs nobody anything  │
 * │  and the site has to stay usable in a demo.                              │
 * │                                                                          │
 * │  This path does not get that. With no credentials the feature does not   │
 * │  exist: no button, no form, no route, no session. It NEVER answers with  │
 * │  a success it did not get from the provider, and it never invents one to │
 * │  keep a demo pretty. Money must never be ambiguous — an unverified       │
 * │  "ödeme alındı" is a lie told to someone about their own bank account.   │
 * │                                                                          │
 * │  Every caller in this module enforces that rule. Do not add a branch     │
 * │  that returns success without a verified provider response.              │
 * └──────────────────────────────────────────────────────────────────────────┘
 *
 * Node-only by construction: `node:crypto` at the top of this file means a
 * client bundle that imports it fails to build rather than shipping the secret.
 * Client code talks to the payment path through `lib/billing-schema.ts` instead.
 */

/** Thrown when the provider is unreachable, rejects us, or answers in a shape we cannot trust. */
export class PaymentError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "PaymentError";
  }
}

type PaymentConfig = {
  apiKey: string;
  secretKey: string;
  baseUrl: string;
};

/** Reads credentials, or null when any one of them is missing. Never partially configured. */
function readConfig(): PaymentConfig | null {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const baseUrl = process.env.IYZICO_BASE_URL;

  if (!apiKey || !secretKey || !baseUrl) return null;

  // A trailing slash here would produce "//payment/..." and break the signature,
  // which is computed over the path.
  return { apiKey, secretKey, baseUrl: baseUrl.replace(/\/+$/, "") };
}

function requireConfig(): PaymentConfig {
  const config = readConfig();
  if (!config) {
    throw new PaymentError(
      "Payment was invoked while disabled. IYZICO_API_KEY, IYZICO_SECRET_KEY and " +
        "IYZICO_BASE_URL must all be set, and lib/company-data.ts must carry a complete " +
        "corporate identity. Callers must check isPaymentEnabled() first.",
    );
  }
  return config;
}

/**
 * Whether the card path exists at all.
 *
 * Two conditions, both non-negotiable:
 *
 *   Credentials — without them there is nobody to charge the card, so an enabled
 *                 button could only ever lie.
 *
 *   Identity    — a seller that cannot publish its own ticaret unvanı, MERSİS and
 *                 vergi numbers must not take a card. That is the law (Mesafeli
 *                 Sözleşmeler Yönetmeliği: the buyer must be told who they are
 *                 contracting with before they pay), and it is also the honest
 *                 default: the distance-selling contract the buyer is asked to
 *                 accept cannot name its own party.
 */
export function isPaymentEnabled(): boolean {
  return readConfig() !== null && hasCorporateIdentity();
}

// ── Wire helpers ────────────────────────────────────────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  source: Record<string, unknown>,
  key: string,
): string | null {
  const value = source[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

/**
 * iyzico compares amounts as strings and rejects a mismatch between `price` and
 * the sum of the basket lines. Prices in `modules-data` are whole TL, so two
 * decimals is exact — no float drift is possible here.
 */
function toProviderAmount(tl: number): string {
  return tl.toFixed(2);
}

/**
 * iyzico's IYZWSv2 authorization.
 *
 * UNVERIFIED — reconstructed from the documented scheme, never exercised against
 * a live merchant account. The random key must be echoed in `x-iyzi-rnd` and is
 * part of the signed payload, so it is generated once and used twice.
 */
function authHeaders(
  config: PaymentConfig,
  uriPath: string,
  body: string,
): Record<string, string> {
  const randomKey = `${Date.now()}${randomBytes(8).toString("hex")}`;
  const signature = createHmac("sha256", config.secretKey)
    .update(randomKey + uriPath + body)
    .digest("hex");

  const authorization = Buffer.from(
    `apiKey:${config.apiKey}&randomKey:${randomKey}&signature:${signature}`,
  ).toString("base64");

  return {
    Authorization: `IYZWSv2 ${authorization}`,
    "x-iyzi-rnd": randomKey,
    "Content-Type": "application/json",
  };
}

const PROVIDER_TIMEOUT_MS = 20_000;

/** Every provider call goes through here, so timeouts and shape checks cannot be forgotten. */
async function callProvider(
  uriPath: string,
  payload: unknown,
): Promise<Record<string, unknown>> {
  const config = requireConfig();
  const body = JSON.stringify(payload);

  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}${uriPath}`, {
      method: "POST",
      headers: authHeaders(config, uriPath, body),
      body,
      signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
    });
  } catch (error) {
    throw new PaymentError(`Payment provider unreachable at ${uriPath}.`, {
      cause: error,
    });
  }

  const text = await response.text();

  if (!response.ok) {
    throw new PaymentError(
      `Payment provider answered ${response.status} for ${uriPath}. Body: ${text.slice(0, 500)}`,
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new PaymentError(
      `Payment provider answered ${uriPath} with a non-JSON body: ${text.slice(0, 500)}`,
      { cause: error },
    );
  }

  if (!isRecord(parsed)) {
    throw new PaymentError(
      `Payment provider answered ${uriPath} with ${typeof parsed}, expected a JSON object.`,
    );
  }

  // iyzico reports business failures inside a 200. Treat them as the errors they are.
  if (parsed.status !== "success") {
    const code = readString(parsed, "errorCode") ?? "—";
    const message = readString(parsed, "errorMessage") ?? "—";
    throw new PaymentError(
      `Payment provider rejected ${uriPath}. status=${String(parsed.status)} ` +
        `errorCode=${code} errorMessage=${message}`,
    );
  }

  return parsed;
}

// ── Starting a payment ──────────────────────────────────────────────────────

export type PaymentSessionInput = {
  /** Our own order reference. Doubles as the provider's conversation and basket id. */
  reference: string;
  /**
   * Gross TL total. Recomputed by the caller from the catalogue — a total that
   * arrived in a request body must never reach this function.
   */
  amount: number;
  items: readonly CartItemId[];
  billing: BillingRequest;
  /** The buyer's address, for the provider's fraud checks. */
  ip: string;
  /** Origin the buyer is on, so the 3-D return lands back on the same deployment. */
  origin: string;
};

export type PaymentSession = {
  /** The provider's handle on this attempt. Needed again to resolve the callback. */
  providerToken: string;
  /** Where the browser must go to enter card details and pass 3-D Secure. */
  redirectUrl: string;
};

/** iyzico models every buyer as a person, even when the invoice is corporate. */
function buyerNames(billing: BillingRequest): {
  name: string;
  surname: string;
} {
  if (billing.faturaTipi === "bireysel") {
    const parts = billing.adSoyad.split(/\s+/);
    const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const name = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0];
    return { name, surname };
  }

  // A company has no forename. Both required fields carry the trade name rather
  // than splitting it into a nonsense surname ("… A.Ş." is not anybody's family name).
  return { name: billing.ticaretUnvani, surname: billing.ticaretUnvani };
}

/**
 * UNVERIFIED — iyzico documents `identityNumber` as an 11-digit TCKN. A corporate
 * buyer has a 10-digit VKN instead, and which value this field wants for kurumsal
 * invoices cannot be settled without a merchant account to test against.
 */
function buyerIdentityNumber(billing: BillingRequest): string {
  return billing.faturaTipi === "bireysel"
    ? billing.tcKimlikNo
    : billing.vergiNo;
}

function contactNameOf(billing: BillingRequest): string {
  return billing.faturaTipi === "bireysel"
    ? billing.adSoyad
    : billing.ticaretUnvani;
}

function addressOf(billing: BillingRequest) {
  const { adres } = billing;
  return {
    contactName: contactNameOf(billing),
    city: adres.il,
    country: adres.ulke,
    address: `${adres.acikAdres} ${adres.ilce}`.trim(),
    zipCode: adres.postaKodu,
  };
}

const CHECKOUT_INITIALIZE_PATH =
  "/payment/iyzipos/checkoutform/initialize/auth/ecom";
const CHECKOUT_RETRIEVE_PATH = "/payment/iyzipos/checkoutform/auth/ecom/detail";

/**
 * Opens a payment attempt and returns where to send the browser.
 *
 * Nothing is charged here — the buyer enters their card on the provider's page
 * and the outcome only becomes real in `resolveCallback`.
 */
export async function createPaymentSession(
  input: PaymentSessionInput,
): Promise<PaymentSession> {
  const { name, surname } = buyerNames(input.billing);
  const address = addressOf(input.billing);
  const amount = toProviderAmount(input.amount);

  const payload = {
    locale: "tr",
    conversationId: input.reference,
    price: amount,
    // No installments are offered, so there is no commission to add on top.
    paidPrice: amount,
    currency: "TRY",
    basketId: input.reference,
    paymentGroup: "PRODUCT",
    callbackUrl: `${input.origin}/api/odeme/callback`,
    enabledInstallments: [1],
    buyer: {
      id: input.reference,
      name,
      surname,
      gsmNumber: input.billing.telefon,
      email: input.billing.email,
      identityNumber: buyerIdentityNumber(input.billing),
      registrationAddress: address.address,
      ip: input.ip,
      city: address.city,
      country: address.country,
      zipCode: address.zipCode,
    },
    // An audit is delivered on site, but there is nothing to ship. The provider
    // requires both blocks regardless, so both carry the invoice address.
    shippingAddress: address,
    billingAddress: address,
    basketItems: input.items.map((id) => ({
      id,
      name: recordTitleOf(id),
      category1: RECORD_CATEGORY,
      itemType: "VIRTUAL",
      price: toProviderAmount(priceOf(id)),
    })),
  };

  const response = await callProvider(CHECKOUT_INITIALIZE_PATH, payload);

  const providerToken = readString(response, "token");
  const redirectUrl = readString(response, "paymentPageUrl");

  if (!providerToken || !redirectUrl) {
    throw new PaymentError(
      `Payment provider accepted ${CHECKOUT_INITIALIZE_PATH} but returned no usable session: ` +
        `token=${String(response.token)} paymentPageUrl=${String(response.paymentPageUrl)}`,
    );
  }

  return { providerToken, redirectUrl };
}

// ── Resolving the 3-D return ────────────────────────────────────────────────

export type PaymentOutcome = {
  /**
   * `unknown` is not a hedge. It means the provider could not be asked, so the
   * money may or may not have moved — and saying either would be a guess.
   */
  status: "success" | "failure" | "unknown";
  reference: string;
  /** The provider's payment id, for reconciliation. Null unless it paid. */
  providerPaymentId: string | null;
  /** Gross TL actually charged, as the provider reports it. */
  paidAmount: number | null;
  /** Provider-supplied reason, for the failure copy. Never invented. */
  failureReason: string | null;
};

/**
 * Verifies the signature iyzico puts on a retrieved payment.
 *
 * UNVERIFIED — the field set and their order come from the documented scheme and
 * have never been checked against a real response. If the order is wrong every
 * payment resolves as tampered, which is loud and safe; the opposite mistake
 * (accepting an unsigned result) is the one that cannot be allowed, so the
 * signature is required rather than checked-when-present.
 */
function verifyRetrieveSignature(
  config: PaymentConfig,
  response: Record<string, unknown>,
): boolean {
  const claimed = readString(response, "signature");
  if (!claimed) return false;

  const fields = [
    "paymentId",
    "currency",
    "basketId",
    "conversationId",
    "paidPrice",
    "price",
    "token",
  ];
  const payload = fields
    .map((field) => readString(response, field) ?? "")
    .join("");

  const expected = createHmac("sha256", config.secretKey)
    .update(payload)
    .digest("hex");

  const claimedBytes = Buffer.from(claimed, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");
  // timingSafeEqual throws on a length mismatch, which is itself a failed match.
  if (claimedBytes.length !== expectedBytes.length) return false;
  return timingSafeEqual(claimedBytes, expectedBytes);
}

function parseAmount(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Turns the provider's 3-D return into an outcome we are willing to show.
 *
 * The callback body is treated as nothing but a claim that *something happened*.
 * Its own `status` field is never read: anyone can POST that form. The token in
 * it is used to ask the provider directly what the payment did, and that answer
 * is only accepted once its signature verifies.
 */
export async function resolveCallback(form: FormData): Promise<PaymentOutcome> {
  const config = requireConfig();

  const token = form.get("token");
  if (typeof token !== "string" || token.length === 0) {
    throw new PaymentError(
      "Payment callback carried no token, so the attempt cannot be identified. " +
        `Received fields: ${[...form.keys()].join(", ") || "none"}.`,
    );
  }

  const response = await callProvider(CHECKOUT_RETRIEVE_PATH, {
    locale: "tr",
    token,
  });

  if (!verifyRetrieveSignature(config, response)) {
    throw new PaymentError(
      "Payment provider's response failed signature verification and will not be trusted. " +
        `token=${token.slice(0, 12)}… conversationId=${String(response.conversationId)}`,
    );
  }

  const reference = readString(response, "conversationId") ?? "";
  const paymentStatus = readString(response, "paymentStatus");

  if (paymentStatus !== "SUCCESS") {
    return {
      status: "failure",
      reference,
      providerPaymentId: null,
      paidAmount: null,
      failureReason: readString(response, "errorMessage"),
    };
  }

  return {
    status: "success",
    reference,
    providerPaymentId: readString(response, "paymentId"),
    paidAmount: parseAmount(readString(response, "paidPrice")),
    failureReason: null,
  };
}

// ── Carrying the outcome to the result page ─────────────────────────────────

/**
 * The result page has no database to look the order up in, so the outcome travels
 * in the URL — and a URL is something the buyer can edit. Signing it is what stops
 * `?d=success` from being a thing anyone can type. The page renders "ödeme alındı"
 * only for a payload this key produced.
 */
const OUTCOME_MAX_AGE_MS = 60 * 60 * 1000;

type OutcomeClaim = PaymentOutcome & { iat: number };

function outcomeSignature(config: PaymentConfig, body: string): string {
  return createHmac("sha256", config.secretKey)
    .update(body)
    .digest("base64url");
}

export function signOutcome(outcome: PaymentOutcome): string {
  const config = requireConfig();
  const claim: OutcomeClaim = { ...outcome, iat: Date.now() };
  const body = Buffer.from(JSON.stringify(claim), "utf8").toString("base64url");
  return `${body}.${outcomeSignature(config, body)}`;
}

/** Returns null for anything that is not a fresh, untampered outcome we signed. */
export function verifyOutcome(token: string): PaymentOutcome | null {
  const config = readConfig();
  if (!config) return null;

  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const body = token.slice(0, separator);
  const claimed = token.slice(separator + 1);
  const expected = outcomeSignature(config, body);

  const claimedBytes = Buffer.from(claimed, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");
  if (claimedBytes.length !== expectedBytes.length) return null;
  if (!timingSafeEqual(claimedBytes, expectedBytes)) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    // Signed but unreadable means our own encoding changed, not an attack.
    return null;
  }

  if (!isRecord(parsed)) return null;

  const { iat, status } = parsed;
  if (typeof iat !== "number" || Date.now() - iat > OUTCOME_MAX_AGE_MS)
    return null;
  if (status !== "success" && status !== "failure" && status !== "unknown")
    return null;

  return {
    status,
    reference: readString(parsed, "reference") ?? "",
    providerPaymentId: readString(parsed, "providerPaymentId"),
    paidAmount:
      typeof parsed.paidAmount === "number" ? parsed.paidAmount : null,
    failureReason: readString(parsed, "failureReason"),
  };
}
