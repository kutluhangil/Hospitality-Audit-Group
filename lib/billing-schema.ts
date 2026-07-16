/**
 * Wire contract for POST /api/odeme and the validation guarding it.
 *
 * Modelled on `lib/quote-schema.ts`, and for the same reason: the form and the
 * route handler import from here, so a rule cannot end up enforced on only one
 * side. Nothing in this file may touch the DOM, browser globals or Node APIs —
 * it is loaded on the client and on the server.
 *
 * The provider lives behind `lib/payment.ts` and is not mentioned here. This file
 * describes what a Turkish invoice needs, which is true regardless of who takes
 * the card.
 */

import { totalsFor, isRedundant, type CartTotals } from "@/lib/cart-math";
import { CATALOGUE_ORDER, type CartItemId } from "@/lib/modules-data";
import type { FieldError } from "@/lib/validation-messages";

/** Same trick as quote-schema: this stops compiling the day the catalogue changes. */
const CART_ITEM_SET: Record<CartItemId, true> = {
  A: true,
  B: true,
  C: true,
  D: true,
  E: true,
  EGITIM: true,
};

export function isCartItemId(value: unknown): value is CartItemId {
  return typeof value === "string" && Object.hasOwn(CART_ITEM_SET, value);
}

export const INVOICE_TYPES = ["kurumsal", "bireysel"] as const;
export type InvoiceType = (typeof INVOICE_TYPES)[number];

export type BillingAddress = {
  ulke: string;
  il: string;
  ilce: string;
  acikAdres: string;
  postaKodu: string;
};

type BillingCommon = {
  adres: BillingAddress;
  email: string;
  telefon: string;
  /** What is being bought. The price is NOT here — see `billingTotals`. */
  selectedItems: readonly CartItemId[];
  mesafeliSatisOnay: true;
  onBilgilendirmeOnay: true;
  kvkkConsent: true;
};

export type CorporateBilling = BillingCommon & {
  faturaTipi: "kurumsal";
  ticaretUnvani: string;
  vergiDairesi: string;
  vergiNo: string;
};

export type IndividualBilling = BillingCommon & {
  faturaTipi: "bireysel";
  adSoyad: string;
  tcKimlikNo: string;
};

export type BillingRequest = CorporateBilling | IndividualBilling;

/**
 * Error keys are flat even though the address nests, because the form renders one
 * input per key and none of the address field names collide with a top-level one.
 */
export type BillingField =
  | "faturaTipi"
  | "ticaretUnvani"
  | "vergiDairesi"
  | "vergiNo"
  | "adSoyad"
  | "tcKimlikNo"
  | "ulke"
  | "il"
  | "ilce"
  | "acikAdres"
  | "postaKodu"
  | "email"
  | "telefon"
  | "selectedItems"
  | "mesafeliSatisOnay"
  | "onBilgilendirmeOnay"
  | "kvkkConsent";

export type ValidationResult<T, K extends string> =
  | { ok: true; value: T }
  | { ok: false; errors: Partial<Record<K, FieldError>> };

const MAX_NAME = 120;
const MAX_TRADE_NAME = 200;
const MAX_EMAIL = 160;
const MAX_PHONE = 40;
const MAX_TAX_OFFICE = 120;
const MAX_ADDRESS = 500;
const MAX_CITY = 80;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[\d+()\s-]+$/;
const POSTCODE_PATTERN = /^\d{5}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function readRecord(
  source: Record<string, unknown>,
  key: string,
): Record<string, unknown> {
  const value = source[key];
  return isRecord(value) ? value : {};
}

// Every rule below returns a copy-free descriptor, never a sentence. The `{label}`
// a message needs is supplied by whoever renders it: the form passes the field's
// own localized label, the route passes the source-language one.

function lengthError(value: string, max: number): FieldError | undefined {
  if (value.length > max) return { code: "tooLong", params: { max } };
  return undefined;
}

function requiredError(value: string, max: number): FieldError | undefined {
  if (value.length === 0) return { code: "required" };
  return lengthError(value, max);
}

function emailError(value: string): FieldError | undefined {
  const required = requiredError(value, MAX_EMAIL);
  if (required) return required;
  if (!EMAIL_PATTERN.test(value)) return { code: "emailInvalidBilling" };
  return undefined;
}

/** Required here, unlike the quote form: an invoice needs a reachable buyer. */
function phoneError(value: string): FieldError | undefined {
  const required = requiredError(value, MAX_PHONE);
  if (required) return required;
  if (!PHONE_PATTERN.test(value)) return { code: "phoneInvalid" };
  return undefined;
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

// ── Turkish identifiers ─────────────────────────────────────────────────────

/**
 * Vergi kimlik numarası: exactly 10 digits.
 *
 * Length only, on purpose. A VKN check digit exists but is not universally
 * applied across every issued number, and rejecting a real customer's real tax
 * number is worse than accepting a typo the accountant will catch on the invoice.
 * The TCKN below is different: its checksum is mandatory and exact.
 */
export function isValidVergiNo(value: string): boolean {
  return /^\d{10}$/.test(value);
}

/**
 * TC kimlik numarası: 11 digits plus the two check digits the state defines.
 *
 * The length check alone is not enough. Every second person mistypes a digit, and
 * a wrong TCKN does not bounce — it lands on an invoice, where it is a false
 * record attached to somebody's name. The checksum catches every single-digit
 * typo and every adjacent transposition, which is exactly the failure mode here.
 *
 *   d10 = ((d1+d3+d5+d7+d9) * 7 - (d2+d4+d6+d8)) mod 10
 *   d11 = (d1 + … + d10) mod 10
 */
export function isValidTcKimlikNo(value: string): boolean {
  if (!/^\d{11}$/.test(value)) return false;

  const digits = [...value].map(Number);
  // The first digit is never 0: the number would not be 11 digits long.
  if (digits[0] === 0) return false;

  let odd = 0;
  let even = 0;
  for (let index = 0; index < 9; index += 1) {
    if (index % 2 === 0) odd += digits[index];
    else even += digits[index];
  }

  const tenth = (odd * 7 - even) % 10;
  if (tenth !== digits[9]) return false;

  const eleventh =
    digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;
  return eleventh === digits[10];
}

function vergiNoError(value: string): FieldError | undefined {
  const required = requiredError(value, 32);
  if (required) return required;
  if (!isValidVergiNo(value)) {
    return { code: "vergiNoInvalid", params: { count: digitsOnly(value).length } };
  }
  return undefined;
}

function tcKimlikNoError(value: string): FieldError | undefined {
  const required = requiredError(value, 32);
  if (required) return required;
  if (!/^\d{11}$/.test(value)) {
    return {
      code: "tcKimlikNoWrongLength",
      params: { count: digitsOnly(value).length },
    };
  }
  if (!isValidTcKimlikNo(value)) return { code: "tcKimlikNoInvalid" };
  return undefined;
}

function postCodeError(value: string): FieldError | undefined {
  const required = requiredError(value, 16);
  if (required) return required;
  if (!POSTCODE_PATTERN.test(value)) return { code: "postCodeInvalid" };
  return undefined;
}

// ── Consents ────────────────────────────────────────────────────────────────

/**
 * Each consent is checked separately and named in its own message. A single
 * "onayları kabul edin" would leave the buyer hunting for which box they missed,
 * and these three are not interchangeable: two of them are the contract itself.
 */
function consentError(value: unknown, code: string): FieldError | undefined {
  return value === true ? undefined : { code };
}

const CONSENT_CODES = {
  mesafeliSatisOnay: "consentMesafeli",
  onBilgilendirmeOnay: "consentOnBilgilendirme",
  kvkkConsent: "consentBillingKvkk",
} as const;

// ── Basket ──────────────────────────────────────────────────────────────────

function readItems(value: unknown): readonly CartItemId[] {
  if (!Array.isArray(value)) return [];
  const unique = [...new Set(value.filter(isCartItemId))];
  // Catalogue order, so the invoice lines never depend on click order.
  return CATALOGUE_ORDER.filter((id) => unique.includes(id));
}

function itemsError(value: unknown): FieldError | undefined {
  if (!Array.isArray(value)) return { code: "itemsNotList" };

  const invalid = value.filter((entry) => !isCartItemId(entry));
  if (invalid.length > 0) {
    return {
      code: "itemsInvalid",
      params: { codes: CATALOGUE_ORDER.join(", "), invalid: invalid.join(", ") },
    };
  }

  const items = readItems(value);
  if (items.length === 0) return { code: "itemsEmpty" };

  // Selling the same audit twice is wrong even when the buyer asks for it, and a
  // hand-edited request is the only way to get here — the catalogue disables it.
  const redundant = items.filter((id) => isRedundant(id, items));
  if (redundant.length > 0) {
    return { code: "itemsRedundant", params: { redundant: redundant.join(", ") } };
  }

  return undefined;
}

/**
 * THE ONLY TOTAL THAT MAY BE CHARGED.
 *
 * Derived from the validated basket and the catalogue, never read from the
 * request. `BillingRequest` deliberately has no price field at all: a number that
 * arrives in a request body is a number the buyer can edit, and the one place
 * that must not be negotiable in a browser devtools panel is the amount.
 *
 * The client calls this too — but only to display it. The server calls it again
 * before it opens a payment, and that second call is the authority.
 */
export function billingTotals(items: readonly CartItemId[]): CartTotals {
  return totalsFor(items);
}

// ── Validation ──────────────────────────────────────────────────────────────

function collect<K extends string>(
  entries: readonly (readonly [K, FieldError | undefined])[],
): Partial<Record<K, FieldError>> {
  const errors: Partial<Record<K, FieldError>> = {};
  for (const [key, error] of entries) {
    if (error !== undefined) errors[key] = error;
  }
  return errors;
}

function hasAny<K extends string>(
  errors: Partial<Record<K, FieldError>>,
): boolean {
  return Object.keys(errors).length > 0;
}

function isInvoiceType(value: unknown): value is InvoiceType {
  return value === "kurumsal" || value === "bireysel";
}

export function validateBillingRequest(
  input: unknown,
): ValidationResult<BillingRequest, BillingField> {
  if (!isRecord(input)) {
    return { ok: false, errors: { faturaTipi: { code: "invalidBody" } } };
  }

  const faturaTipi = input.faturaTipi;
  if (!isInvoiceType(faturaTipi)) {
    return {
      ok: false,
      errors: {
        faturaTipi: {
          code: "unknownInvoiceType",
          params: { type: JSON.stringify(faturaTipi) },
        },
      },
    };
  }

  const adresInput = readRecord(input, "adres");
  const ulke = readString(adresInput, "ulke");
  const il = readString(adresInput, "il");
  const ilce = readString(adresInput, "ilce");
  const acikAdres = readString(adresInput, "acikAdres");
  const postaKodu = readString(adresInput, "postaKodu");

  const email = readString(input, "email");
  const telefon = readString(input, "telefon");

  const shared = [
    ["ulke", requiredError(ulke, MAX_CITY)],
    ["il", requiredError(il, MAX_CITY)],
    ["ilce", requiredError(ilce, MAX_CITY)],
    ["acikAdres", requiredError(acikAdres, MAX_ADDRESS)],
    ["postaKodu", postCodeError(postaKodu)],
    ["email", emailError(email)],
    ["telefon", phoneError(telefon)],
    ["selectedItems", itemsError(input.selectedItems)],
    [
      "mesafeliSatisOnay",
      consentError(input.mesafeliSatisOnay, CONSENT_CODES.mesafeliSatisOnay),
    ],
    [
      "onBilgilendirmeOnay",
      consentError(input.onBilgilendirmeOnay, CONSENT_CODES.onBilgilendirmeOnay),
    ],
    ["kvkkConsent", consentError(input.kvkkConsent, CONSENT_CODES.kvkkConsent)],
  ] as const satisfies readonly (readonly [
    BillingField,
    FieldError | undefined,
  ])[];

  const adres: BillingAddress = { ulke, il, ilce, acikAdres, postaKodu };
  const selectedItems = readItems(input.selectedItems);

  if (faturaTipi === "kurumsal") {
    const ticaretUnvani = readString(input, "ticaretUnvani");
    const vergiDairesi = readString(input, "vergiDairesi");
    const vergiNo = readString(input, "vergiNo");

    const errors = collect<BillingField>([
      ...shared,
      ["ticaretUnvani", requiredError(ticaretUnvani, MAX_TRADE_NAME)],
      ["vergiDairesi", requiredError(vergiDairesi, MAX_TAX_OFFICE)],
      ["vergiNo", vergiNoError(vergiNo)],
    ]);

    if (hasAny(errors)) return { ok: false, errors };

    return {
      ok: true,
      value: {
        faturaTipi,
        ticaretUnvani,
        vergiDairesi,
        vergiNo,
        adres,
        email,
        telefon,
        selectedItems,
        mesafeliSatisOnay: true,
        onBilgilendirmeOnay: true,
        kvkkConsent: true,
      },
    };
  }

  const adSoyad = readString(input, "adSoyad");
  const tcKimlikNo = readString(input, "tcKimlikNo");

  const errors = collect<BillingField>([
    ...shared,
    ["adSoyad", requiredError(adSoyad, MAX_NAME)],
    ["tcKimlikNo", tcKimlikNoError(tcKimlikNo)],
  ]);

  if (hasAny(errors)) return { ok: false, errors };

  return {
    ok: true,
    value: {
      faturaTipi,
      adSoyad,
      tcKimlikNo,
      adres,
      email,
      telefon,
      selectedItems,
      mesafeliSatisOnay: true,
      onBilgilendirmeOnay: true,
      kvkkConsent: true,
    },
  };
}

/**
 * Flattens field errors into the single actionable sentence the route returns.
 *
 * The copy no longer lives here, so the caller passes a `resolve` that turns each
 * descriptor into a sentence — the route builds one from a source-language
 * translator, keeping the guard's response in Turkish.
 */
export function formatValidationErrors(
  errors: Partial<Record<string, FieldError>>,
  resolve: (field: string, error: FieldError) => string,
): string {
  return Object.entries(errors)
    .filter((entry): entry is [string, FieldError] => entry[1] !== undefined)
    .map(([field, error]) => resolve(field, error))
    .join(" ");
}

/**
 * `SIP-` + base36 clock + random suffix. An order reference is an identifier, not
 * a secret — but unlike a quote reference it becomes the provider's basketId, so
 * two orders opened in the same millisecond must not collide.
 */
export function createOrderReference(): string {
  const clock = Date.now().toString(36).toUpperCase();
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SIP-${clock}${suffix}`;
}

export type PaymentInitResponse =
  { ok: true; redirectUrl: string; ref: string } | { ok: false; error: string };

const GENERIC_FAILURE = "Ödeme başlatılamadı. Lütfen tekrar deneyin.";

/** Narrows the untyped fetch body the form gets back into the response contract. */
export function parsePaymentInitResponse(body: unknown): PaymentInitResponse {
  if (isRecord(body)) {
    if (
      body.ok === true &&
      typeof body.redirectUrl === "string" &&
      typeof body.ref === "string"
    ) {
      return { ok: true, redirectUrl: body.redirectUrl, ref: body.ref };
    }
    if (typeof body.error === "string" && body.error.length > 0) {
      return { ok: false, error: body.error };
    }
  }
  return { ok: false, error: GENERIC_FAILURE };
}
