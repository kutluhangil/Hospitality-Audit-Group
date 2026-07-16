/**
 * Wire contract for POST /api/teklif and the validation guarding it.
 *
 * Both the forms and the route handler import from here, so a rule can never end
 * up enforced on only one side. Nothing in this file may touch the DOM, browser
 * globals or Node APIs — it is loaded on the client and on the server.
 */

import type { ModuleCode } from "@/lib/modules-data";
import type { FieldError } from "@/lib/validation-messages";

/**
 * Exhaustive by construction: Record<ModuleCode, true> stops compiling the day a
 * module code is added or removed. Declared here rather than derived from
 * `modules` so the API route does not drag icon components in behind it.
 */
const MODULE_CODE_SET: Record<ModuleCode, true> = {
  A: true,
  B: true,
  C: true,
  D: true,
  E: true,
};

export function isModuleCode(value: unknown): value is ModuleCode {
  return typeof value === "string" && Object.hasOwn(MODULE_CODE_SET, value);
}

/** Select options live here so the form renders exactly what the server accepts. */
export const FACILITY_TYPES = [
  "Şehir Oteli",
  "Resort",
  "Butik",
  "Zincir",
] as const;
export const ROOM_COUNT_RANGES = [
  "1–50",
  "51–150",
  "151–300",
  "301–600",
  "600+",
] as const;

export type FacilityType = (typeof FACILITY_TYPES)[number];
export type RoomCountRange = (typeof ROOM_COUNT_RANGES)[number];

export type QuoteRequest = {
  type: "quote";
  adSoyad: string;
  email: string;
  telefon: string;
  tesisAdi: string;
  tesisTipi: FacilityType | "";
  odaSayisi: RoomCountRange | "";
  mesaj: string;
  /** May be empty: a quote without modules is a general enquiry. */
  selectedModules: readonly ModuleCode[];
  kvkkConsent: true;
};

export type ContactRequest = {
  type: "contact";
  ad: string;
  email: string;
  konu: string;
  mesaj: string;
  kvkkConsent: true;
};

export type TeklifRequest = QuoteRequest | ContactRequest;

export type QuoteField = keyof Omit<QuoteRequest, "type">;
export type ContactField = keyof Omit<ContactRequest, "type">;

export type ValidationResult<T, K extends string> =
  | { ok: true; value: T }
  | { ok: false; errors: Partial<Record<K, FieldError>> };

const MAX_NAME = 120;
const MAX_EMAIL = 160;
const MAX_PHONE = 40;
const MAX_SUBJECT = 160;
const MAX_MESSAGE = 4000;

// Deliberately permissive: the address is verified by replying to it, not by a
// regex. This only rejects input that cannot be an address at all.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[\d+()\s-]+$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Missing and non-string values collapse to "" so every rule below sees a string. */
function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

// The rules below return copy-free descriptors, never sentences. The `{label}`
// each message needs is supplied by whoever renders it: the form passes the
// field's own localized label, the route passes the source-language one.

function requiredError(value: string, max: number): FieldError | undefined {
  if (value.length === 0) return { code: "required" };
  return lengthError(value, max);
}

function lengthError(value: string, max: number): FieldError | undefined {
  if (value.length > max) return { code: "tooLong", params: { max } };
  return undefined;
}

function emailError(value: string): FieldError | undefined {
  const required = requiredError(value, MAX_EMAIL);
  if (required) return required;
  if (!EMAIL_PATTERN.test(value)) return { code: "emailInvalid" };
  return undefined;
}

function phoneError(value: string): FieldError | undefined {
  if (value.length === 0) return undefined;
  const length = lengthError(value, MAX_PHONE);
  if (length) return length;
  if (!PHONE_PATTERN.test(value)) return { code: "phoneInvalid" };
  return undefined;
}

/** Empty stays valid — the selects are optional; anything else must be an offered option. */
function optionError(
  value: string,
  options: readonly string[],
): FieldError | undefined {
  if (value.length === 0) return undefined;
  if (!options.includes(value)) {
    return { code: "optionInvalid", params: { value } };
  }
  return undefined;
}

function consentError(value: unknown): FieldError | undefined {
  if (value !== true) return { code: "consentQuoteKvkk" };
  return undefined;
}

function modulesError(value: unknown): FieldError | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return { code: "modulesNotList" };
  const invalid = value.filter((entry) => !isModuleCode(entry));
  if (invalid.length > 0) {
    return { code: "modulesInvalid", params: { invalid: invalid.join(", ") } };
  }
  return undefined;
}

function readModules(value: unknown): readonly ModuleCode[] {
  if (!Array.isArray(value)) return [];
  // Duplicates would double a module in the e-mail; the set collapses them.
  return [...new Set(value.filter(isModuleCode))];
}

/** Drops the undefined slots a Partial leaves behind. */
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

export function validateQuoteRequest(
  input: unknown,
): ValidationResult<QuoteRequest, QuoteField> {
  if (!isRecord(input)) {
    return { ok: false, errors: { adSoyad: { code: "invalidBody" } } };
  }

  const adSoyad = readString(input, "adSoyad");
  const email = readString(input, "email");
  const telefon = readString(input, "telefon");
  const tesisAdi = readString(input, "tesisAdi");
  const tesisTipi = readString(input, "tesisTipi");
  const odaSayisi = readString(input, "odaSayisi");
  const mesaj = readString(input, "mesaj");

  const errors = collect<QuoteField>([
    ["adSoyad", requiredError(adSoyad, MAX_NAME)],
    ["email", emailError(email)],
    ["telefon", phoneError(telefon)],
    ["tesisAdi", requiredError(tesisAdi, MAX_NAME)],
    ["tesisTipi", optionError(tesisTipi, FACILITY_TYPES)],
    ["odaSayisi", optionError(odaSayisi, ROOM_COUNT_RANGES)],
    ["mesaj", lengthError(mesaj, MAX_MESSAGE)],
    ["selectedModules", modulesError(input.selectedModules)],
    ["kvkkConsent", consentError(input.kvkkConsent)],
  ]);

  if (hasAny(errors)) return { ok: false, errors };

  return {
    ok: true,
    value: {
      type: "quote",
      adSoyad,
      email,
      telefon,
      tesisAdi,
      // Narrowed by optionError above: either "" or one of the offered options.
      tesisTipi: tesisTipi as FacilityType | "",
      odaSayisi: odaSayisi as RoomCountRange | "",
      mesaj,
      selectedModules: readModules(input.selectedModules),
      kvkkConsent: true,
    },
  };
}

export function validateContactRequest(
  input: unknown,
): ValidationResult<ContactRequest, ContactField> {
  if (!isRecord(input)) {
    return { ok: false, errors: { ad: { code: "invalidBody" } } };
  }

  const ad = readString(input, "ad");
  const email = readString(input, "email");
  const konu = readString(input, "konu");
  const mesaj = readString(input, "mesaj");

  const errors = collect<ContactField>([
    ["ad", requiredError(ad, MAX_NAME)],
    ["email", emailError(email)],
    ["konu", requiredError(konu, MAX_SUBJECT)],
    ["mesaj", requiredError(mesaj, MAX_MESSAGE)],
    ["kvkkConsent", consentError(input.kvkkConsent)],
  ]);

  if (hasAny(errors)) return { ok: false, errors };

  return {
    ok: true,
    value: { type: "contact", ad, email, konu, mesaj, kvkkConsent: true },
  };
}

/**
 * Route-side entry point: picks the validator from the `type` discriminator that
 * /teklif and /iletisim both send.
 */
export function validateTeklifRequest(
  input: unknown,
): ValidationResult<TeklifRequest, string> {
  if (!isRecord(input)) {
    return { ok: false, errors: { type: { code: "invalidBody" } } };
  }

  if (input.type === "contact") return validateContactRequest(input);
  if (input.type === "quote") return validateQuoteRequest(input);

  return {
    ok: false,
    errors: {
      type: {
        code: "unknownType",
        params: { type: JSON.stringify(input.type) },
      },
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
 * The honeypot is a field no human sees, so any value at all means a bot. Read
 * straight off the raw body: it is checked before validation, on input that has
 * not been proven to be a request yet.
 */
export function hasHoneypotValue(input: unknown): boolean {
  return isRecord(input) && readString(input, "website").length > 0;
}

export const HONEYPOT_FIELD = "website";

/** `HAG-` + base36 millisecond clock, e.g. HAG-M9X2K1QP. */
export function createReference(): string {
  return `HAG-${Date.now().toString(36).toUpperCase()}`;
}

export type TeklifResponse =
  { ok: true; ref: string } | { ok: false; error: string };

const GENERIC_FAILURE = "Talebiniz iletilemedi. Lütfen tekrar deneyin.";

/** Narrows the untyped fetch body the forms get back into the response contract. */
export function parseTeklifResponse(body: unknown): TeklifResponse {
  if (isRecord(body)) {
    if (body.ok === true && typeof body.ref === "string") {
      return { ok: true, ref: body.ref };
    }
    if (typeof body.error === "string" && body.error.length > 0) {
      return { ok: false, error: body.error };
    }
  }
  return { ok: false, error: GENERIC_FAILURE };
}
