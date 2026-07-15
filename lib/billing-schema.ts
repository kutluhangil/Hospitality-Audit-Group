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
  | { ok: false; errors: Partial<Record<K, string>> };

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

function readRecord(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key];
  return isRecord(value) ? value : {};
}

function lengthError(label: string, value: string, max: number): string | undefined {
  if (value.length > max) return `${label} en fazla ${max} karakter olabilir.`;
  return undefined;
}

function requiredError(label: string, value: string, max: number): string | undefined {
  if (value.length === 0) return `${label} zorunludur.`;
  return lengthError(label, value, max);
}

function emailError(value: string): string | undefined {
  const required = requiredError("E-posta", value, MAX_EMAIL);
  if (required) return required;
  if (!EMAIL_PATTERN.test(value)) {
    return "E-posta geçerli bir e-posta adresi olmalıdır (ör. ad@tesisiniz.com). Fatura bu adrese gönderilir.";
  }
  return undefined;
}

/** Required here, unlike the quote form: an invoice needs a reachable buyer. */
function phoneError(value: string): string | undefined {
  const required = requiredError("Telefon", value, MAX_PHONE);
  if (required) return required;
  if (!PHONE_PATTERN.test(value)) {
    return "Telefon yalnızca rakam, boşluk ve + ( ) - karakterlerini içerebilir.";
  }
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

  const eleventh = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0) % 10;
  return eleventh === digits[10];
}

function vergiNoError(value: string): string | undefined {
  const required = requiredError("Vergi No", value, 32);
  if (required) return required;
  if (!isValidVergiNo(value)) {
    return `Vergi No tam olarak 10 rakam olmalıdır. Girilen değer ${digitsOnly(value).length} rakam içeriyor.`;
  }
  return undefined;
}

function tcKimlikNoError(value: string): string | undefined {
  const required = requiredError("TC Kimlik No", value, 32);
  if (required) return required;
  if (!/^\d{11}$/.test(value)) {
    return `TC Kimlik No tam olarak 11 rakam olmalıdır. Girilen değer ${digitsOnly(value).length} rakam içeriyor.`;
  }
  if (!isValidTcKimlikNo(value)) {
    return "TC Kimlik No doğrulanamadı. Rakamlarda bir hata var — lütfen kontrol edip tekrar girin.";
  }
  return undefined;
}

function postCodeError(value: string): string | undefined {
  const required = requiredError("Posta Kodu", value, 16);
  if (required) return required;
  if (!POSTCODE_PATTERN.test(value)) {
    return "Posta Kodu 5 rakam olmalıdır (ör. 34394).";
  }
  return undefined;
}

// ── Consents ────────────────────────────────────────────────────────────────

/**
 * Each consent is checked separately and named in its own message. A single
 * "onayları kabul edin" would leave the buyer hunting for which box they missed,
 * and these three are not interchangeable: two of them are the contract itself.
 */
function consentError(value: unknown, message: string): string | undefined {
  return value === true ? undefined : message;
}

const CONSENT_MESSAGES = {
  mesafeliSatisOnay: "Ödemeye geçmek için Mesafeli Satış Sözleşmesi'ni onaylamanız gerekir.",
  onBilgilendirmeOnay: "Ödemeye geçmek için Ön Bilgilendirme Formu'nu onaylamanız gerekir.",
  kvkkConsent: "Ödemeye geçmek için KVKK Aydınlatma Metni onayı gereklidir.",
} as const;

// ── Basket ──────────────────────────────────────────────────────────────────

function readItems(value: unknown): readonly CartItemId[] {
  if (!Array.isArray(value)) return [];
  const unique = [...new Set(value.filter(isCartItemId))];
  // Catalogue order, so the invoice lines never depend on click order.
  return CATALOGUE_ORDER.filter((id) => unique.includes(id));
}

function itemsError(value: unknown): string | undefined {
  if (!Array.isArray(value)) {
    return "Seçili hizmetler bir liste olarak gönderilmelidir.";
  }

  const invalid = value.filter((entry) => !isCartItemId(entry));
  if (invalid.length > 0) {
    return `Seçili hizmetler yalnızca ${CATALOGUE_ORDER.join(", ")} kodlarını içerebilir. Geçersiz: ${invalid.join(", ")}.`;
  }

  const items = readItems(value);
  if (items.length === 0) {
    return "Ödeme yapabilmek için en az bir hizmet seçmelisiniz.";
  }

  // Selling the same audit twice is wrong even when the buyer asks for it, and a
  // hand-edited request is the only way to get here — the catalogue disables it.
  const redundant = items.filter((id) => isRedundant(id, items));
  if (redundant.length > 0) {
    return `${redundant.join(", ")} zaten 360° Tam Denetim kapsamında. Aynı hizmet iki kez faturalanamaz — sepetinizi güncelleyin.`;
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
  entries: readonly (readonly [K, string | undefined])[],
): Partial<Record<K, string>> {
  const errors: Partial<Record<K, string>> = {};
  for (const [key, message] of entries) {
    if (message !== undefined) errors[key] = message;
  }
  return errors;
}

function hasAny<K extends string>(errors: Partial<Record<K, string>>): boolean {
  return Object.keys(errors).length > 0;
}

function isInvoiceType(value: unknown): value is InvoiceType {
  return value === "kurumsal" || value === "bireysel";
}

export function validateBillingRequest(
  input: unknown,
): ValidationResult<BillingRequest, BillingField> {
  if (!isRecord(input)) {
    return { ok: false, errors: { faturaTipi: "Geçersiz istek gövdesi: JSON nesnesi bekleniyor." } };
  }

  const faturaTipi = input.faturaTipi;
  if (!isInvoiceType(faturaTipi)) {
    return {
      ok: false,
      errors: {
        faturaTipi: `Fatura tipi ${JSON.stringify(faturaTipi)} tanınmıyor. "kurumsal" veya "bireysel" bekleniyor.`,
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
    ["ulke", requiredError("Ülke", ulke, MAX_CITY)],
    ["il", requiredError("İl", il, MAX_CITY)],
    ["ilce", requiredError("İlçe", ilce, MAX_CITY)],
    ["acikAdres", requiredError("Açık Adres", acikAdres, MAX_ADDRESS)],
    ["postaKodu", postCodeError(postaKodu)],
    ["email", emailError(email)],
    ["telefon", phoneError(telefon)],
    ["selectedItems", itemsError(input.selectedItems)],
    ["mesafeliSatisOnay", consentError(input.mesafeliSatisOnay, CONSENT_MESSAGES.mesafeliSatisOnay)],
    ["onBilgilendirmeOnay", consentError(input.onBilgilendirmeOnay, CONSENT_MESSAGES.onBilgilendirmeOnay)],
    ["kvkkConsent", consentError(input.kvkkConsent, CONSENT_MESSAGES.kvkkConsent)],
  ] as const satisfies readonly (readonly [BillingField, string | undefined])[];

  const adres: BillingAddress = { ulke, il, ilce, acikAdres, postaKodu };
  const selectedItems = readItems(input.selectedItems);

  if (faturaTipi === "kurumsal") {
    const ticaretUnvani = readString(input, "ticaretUnvani");
    const vergiDairesi = readString(input, "vergiDairesi");
    const vergiNo = readString(input, "vergiNo");

    const errors = collect<BillingField>([
      ...shared,
      ["ticaretUnvani", requiredError("Ticaret Unvanı", ticaretUnvani, MAX_TRADE_NAME)],
      ["vergiDairesi", requiredError("Vergi Dairesi", vergiDairesi, MAX_TAX_OFFICE)],
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
    ["adSoyad", requiredError("Ad Soyad", adSoyad, MAX_NAME)],
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

export function formatValidationErrors(errors: Partial<Record<string, string>>): string {
  return Object.values(errors)
    .filter((message): message is string => typeof message === "string")
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
  | { ok: true; redirectUrl: string; ref: string }
  | { ok: false; error: string };

const GENERIC_FAILURE = "Ödeme başlatılamadı. Lütfen tekrar deneyin.";

/** Narrows the untyped fetch body the form gets back into the response contract. */
export function parsePaymentInitResponse(body: unknown): PaymentInitResponse {
  if (isRecord(body)) {
    if (body.ok === true && typeof body.redirectUrl === "string" && typeof body.ref === "string") {
      return { ok: true, redirectUrl: body.redirectUrl, ref: body.ref };
    }
    if (typeof body.error === "string" && body.error.length > 0) {
      return { ok: false, error: body.error };
    }
  }
  return { ok: false, error: GENERIC_FAILURE };
}
