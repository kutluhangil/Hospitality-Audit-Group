"use client";

import { useState, type FormEvent } from "react";

import {
  CheckboxField,
  FormError,
  HoneypotField,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/navigation";
import { getModule } from "@/lib/modules-data";
import { useQuoteCart } from "@/lib/quote-cart";
import {
  FACILITY_TYPES,
  ROOM_COUNT_RANGES,
  parseTeklifResponse,
  validateQuoteRequest,
  type QuoteField,
} from "@/lib/quote-schema";

type Values = {
  adSoyad: string;
  email: string;
  telefon: string;
  tesisAdi: string;
  tesisTipi: string;
  odaSayisi: string;
  mesaj: string;
};

const EMPTY_VALUES: Values = {
  adSoyad: "",
  email: "",
  telefon: "",
  tesisAdi: "",
  tesisTipi: "",
  odaSayisi: "",
  mesaj: "",
};

type Status = "idle" | "submitting" | "success";

const NETWORK_FAILURE = "Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.";

export function QuoteForm() {
  const { selected, hydrated, remove, clear } = useQuoteCart();

  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<QuoteField, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function update<K extends keyof Values>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // The same validator the route runs, so the two verdicts cannot disagree.
    const result = validateQuoteRequest({
      ...values,
      selectedModules: selected,
      kvkkConsent: consent,
    });

    if (!result.ok) {
      setErrors(result.errors);
      setSubmitError(null);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/teklif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.value, website: honeypot }),
      });
      const parsed = parseTeklifResponse(await response.json());

      if (!parsed.ok) {
        setSubmitError(parsed.error);
        setStatus("idle");
        return;
      }

      setReference(parsed.ref);
      setStatus("success");
      // Only once the request is safely accepted — a failed send must keep the
      // basket intact so the visitor can retry without re-picking modules.
      clear();
    } catch (error) {
      console.error("Quote submission failed:", error);
      setSubmitError(NETWORK_FAILURE);
      setStatus("idle");
    }
  }

  if (status === "success" && reference !== null) {
    return (
      <Card tone="soft" role="status" className="p-8 md:p-10">
        <p className="font-mono text-sm text-accent-strong md:text-base">
          TALEP ALINDI — REF: {reference}
        </p>
        <p className="mt-4 text-base text-ink-muted">48 saat içinde dönüş yapıyoruz.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
      <aside>
        <Eyebrow>SEÇİLİ MODÜLLER</Eyebrow>
        {/* Cart-derived markup stays out of the server HTML: it would contradict
            the first client paint the moment localStorage says otherwise. */}
        {hydrated ? (
          selected.length === 0 ? (
            <div className="mt-4">
              <p className="text-sm text-ink-muted">Henüz modül seçmediniz</p>
              <Link
                href="/moduller"
                className="mt-2 inline-block text-sm text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-accent-strong-hover"
              >
                Modülleri inceleyin
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {selected.map((code) => {
                const auditModule = getModule(code);
                return (
                  <li
                    key={code}
                    className="flex items-start justify-between gap-4 rounded-xl2 border border-line bg-surface p-4"
                  >
                    <div>
                      <span className="font-mono text-xs tracking-[0.2em] text-ink-muted">
                        MODÜL-{code}
                      </span>
                      <p className="mt-1 font-serif text-lg leading-snug">{auditModule?.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(code)}
                      aria-label={`${auditModule?.title ?? code} modülünü çıkar`}
                      className="shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted transition-colors duration-150 hover:text-accent-strong"
                    >
                      Çıkar
                    </button>
                  </li>
                );
              })}
            </ul>
          )
        ) : null}
      </aside>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <TextField
            id="adSoyad"
            label="Ad Soyad"
            required
            autoComplete="name"
            value={values.adSoyad}
            error={errors.adSoyad}
            onChange={(event) => update("adSoyad", event.target.value)}
          />
          <TextField
            id="email"
            label="Kurumsal E-posta"
            type="email"
            required
            autoComplete="email"
            value={values.email}
            error={errors.email}
            onChange={(event) => update("email", event.target.value)}
          />
          <TextField
            id="telefon"
            label="Telefon"
            type="tel"
            autoComplete="tel"
            value={values.telefon}
            error={errors.telefon}
            onChange={(event) => update("telefon", event.target.value)}
          />
          <TextField
            id="tesisAdi"
            label="Tesis Adı"
            required
            autoComplete="organization"
            value={values.tesisAdi}
            error={errors.tesisAdi}
            onChange={(event) => update("tesisAdi", event.target.value)}
          />
          <SelectField
            id="tesisTipi"
            label="Tesis Tipi"
            options={FACILITY_TYPES}
            placeholder="Seçiniz"
            value={values.tesisTipi}
            error={errors.tesisTipi}
            onChange={(event) => update("tesisTipi", event.target.value)}
          />
          <SelectField
            id="odaSayisi"
            label="Oda Sayısı"
            options={ROOM_COUNT_RANGES}
            placeholder="Seçiniz"
            value={values.odaSayisi}
            error={errors.odaSayisi}
            onChange={(event) => update("odaSayisi", event.target.value)}
          />
        </div>

        <TextareaField
          id="mesaj"
          label="Mesaj"
          value={values.mesaj}
          error={errors.mesaj}
          onChange={(event) => update("mesaj", event.target.value)}
        />

        <HoneypotField value={honeypot} onValueChange={setHoneypot} />

        <CheckboxField
          id="kvkkConsent"
          required
          checked={consent}
          error={errors.kvkkConsent}
          onChange={(event) => setConsent(event.target.checked)}
        >
          Kişisel verilerimin{" "}
          <Link
            href="/kvkk"
            className="text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-accent-strong-hover"
          >
            KVKK Aydınlatma Metni
          </Link>{" "}
          kapsamında işlenmesini kabul ediyorum.
        </CheckboxField>

        {submitError ? <FormError message={submitError} /> : null}

        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Gönderiliyor…" : "Teklif Talebi Gönder"}
        </Button>
      </form>
    </div>
  );
}
