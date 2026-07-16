import { getTranslations } from "next-intl/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";

import { routing } from "@/i18n/routing";
import { recordTitleOf } from "@/lib/module-records";
import { getModule } from "@/lib/modules-data";
import {
  createReference,
  formatValidationErrors,
  hasHoneypotValue,
  validateTeklifRequest,
  type ContactRequest,
  type QuoteRequest,
  type TeklifRequest,
} from "@/lib/quote-schema";
import { siteConfig } from "@/lib/site-config";
import { resolveFieldError, type FieldError } from "@/lib/validation-messages";

/**
 * The label key each field carries into `{label}`. The guard always answers in
 * the source language, so it reuses the quote form's own labels — which is also
 * why a contact e-mail reads "Kurumsal E-posta", exactly as before this file
 * stopped hard-coding its sentences.
 */
const FIELD_LABEL_KEY: Record<string, string> = {
  adSoyad: "quote.fullName",
  email: "quote.email",
  telefon: "quote.phone",
  tesisAdi: "quote.facilityName",
  tesisTipi: "quote.facilityType",
  odaSayisi: "quote.roomCount",
  mesaj: "quote.message",
  ad: "contact.name",
  konu: "contact.subject",
};

/** Turns validation descriptors back into the Turkish sentence the guard returns. */
async function formatGuardError(
  errors: Partial<Record<string, FieldError>>,
): Promise<string> {
  const locale = routing.defaultLocale;
  const tValidation = await getTranslations({
    locale,
    namespace: "forms.validation",
  });
  const tForms = await getTranslations({ locale, namespace: "forms" });

  return formatValidationErrors(errors, (field, error) => {
    const labelKey = FIELD_LABEL_KEY[field];
    return resolveFieldError(
      tValidation,
      error,
      labelKey ? tForms(labelKey) : undefined,
    );
  });
}

// The Resend SDK depends on Node APIs and will not run on the edge runtime.
export const runtime = "nodejs";

/**
 * Resend's shared testing sender, used until a verified domain exists. Override
 * with MAIL_FROM once DNS is set up — the API rejects unverified senders.
 */
const DEFAULT_SENDER = "Hospitality Audit Group <onboarding@resend.dev>";

const EMPTY_VALUE = "—";

/** Shown to the visitor. The real cause goes to the server log, not the browser. */
const DELIVERY_FAILURE =
  `Talebiniz şu anda iletilemedi. Lütfen birkaç dakika sonra tekrar deneyin ` +
  `veya doğrudan ${siteConfig.contact.email} adresine yazın.`;

function formatModuleCodes(selected: readonly string[]): string {
  return selected.length > 0 ? selected.join(", ") : "genel görüşme";
}

function formatModuleLines(selected: readonly string[]): string {
  if (selected.length === 0) {
    return "Modül seçilmedi — genel görüşme talebi.";
  }
  // Turkish regardless of the locale the form was submitted from: this mail is
  // read by the team, and it has to match the contract and the invoice.
  return selected
    .map((code) => {
      const known = getModule(code);
      return `  ${code} — ${known ? recordTitleOf(known.code) : "bilinmeyen modül"}`;
    })
    .join("\n");
}

function subjectFor(request: TeklifRequest): string {
  if (request.type === "contact") {
    return `Yeni İletişim Mesajı — ${request.konu}`;
  }
  return `Yeni Teklif Talebi — ${request.tesisAdi} [${formatModuleCodes(request.selectedModules)}]`;
}

function quoteBody(request: QuoteRequest, ref: string): string {
  return [
    `Referans: ${ref}`,
    "",
    `Ad Soyad: ${request.adSoyad}`,
    `Kurumsal E-posta: ${request.email}`,
    `Telefon: ${request.telefon || EMPTY_VALUE}`,
    `Tesis Adı: ${request.tesisAdi}`,
    `Tesis Tipi: ${request.tesisTipi || EMPTY_VALUE}`,
    `Oda Sayısı: ${request.odaSayisi || EMPTY_VALUE}`,
    `KVKK onayı: verildi`,
    "",
    "Seçili modüller:",
    formatModuleLines(request.selectedModules),
    "",
    "Mesaj:",
    request.mesaj || EMPTY_VALUE,
  ].join("\n");
}

function contactBody(request: ContactRequest, ref: string): string {
  return [
    `Referans: ${ref}`,
    "",
    `Ad: ${request.ad}`,
    `E-posta: ${request.email}`,
    `Konu: ${request.konu}`,
    `KVKK onayı: verildi`,
    "",
    "Mesaj:",
    request.mesaj,
  ].join("\n");
}

function bodyFor(request: TeklifRequest, ref: string): string {
  return request.type === "contact"
    ? contactBody(request, ref)
    : quoteBody(request, ref);
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error("[api/teklif] Request body was not valid JSON:", error);
    return NextResponse.json(
      { error: "İstek gövdesi geçerli bir JSON değil." },
      { status: 400 },
    );
  }

  const ref = createReference();

  // A filled honeypot means a bot. Answer exactly as if it succeeded so the bot
  // learns nothing from the difference, and send neither mail nor log noise.
  if (hasHoneypotValue(body)) {
    return NextResponse.json({ ok: true, ref });
  }

  const result = validateTeklifRequest(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: await formatGuardError(result.errors) },
      { status: 400 },
    );
  }

  const payload = result.value;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Deliberate fallback the blueprint requires: with no mail credentials the
    // form still has to work for local development and demos. This swallows
    // nothing — the whole payload reaches the server log and the visitor gets a
    // real reference.
    console.log(
      `[api/teklif] RESEND_API_KEY is not set — no e-mail sent, logging payload instead. ref=${ref}`,
      payload,
    );
    return NextResponse.json({ ok: true, ref });
  }

  const recipient = process.env.CONTACT_EMAIL;
  if (!recipient) {
    console.error(
      "[api/teklif] RESEND_API_KEY is set but CONTACT_EMAIL is empty, so there is no recipient. " +
        "Set CONTACT_EMAIL, or unset RESEND_API_KEY to fall back to logging.",
    );
    return NextResponse.json({ error: DELIVERY_FAILURE }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: process.env.MAIL_FROM ?? DEFAULT_SENDER,
      to: recipient,
      // Lets the team answer the enquiry straight from the notification.
      replyTo: payload.email,
      subject: subjectFor(payload),
      text: bodyFor(payload, ref),
    });

    if (error) {
      console.error(
        `[api/teklif] Resend rejected the message (ref=${ref}):`,
        error,
      );
      return NextResponse.json({ error: DELIVERY_FAILURE }, { status: 500 });
    }

    console.log(
      `[api/teklif] Sent ${payload.type} request ref=${ref} as e-mail ${data?.id}.`,
    );
  } catch (error) {
    console.error(
      `[api/teklif] Resend threw while sending (ref=${ref}):`,
      error,
    );
    return NextResponse.json({ error: DELIVERY_FAILURE }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ref });
}
