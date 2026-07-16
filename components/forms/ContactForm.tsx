"use client";

import { useState, type FormEvent } from "react";

import {
  CheckboxField,
  FormError,
  HoneypotField,
  TextField,
  TextareaField,
} from "@/components/forms/fields";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import {
  parseTeklifResponse,
  validateContactRequest,
  type ContactField,
} from "@/lib/quote-schema";

type Values = {
  ad: string;
  email: string;
  konu: string;
  mesaj: string;
};

const EMPTY_VALUES: Values = { ad: "", email: "", konu: "", mesaj: "" };

type Status = "idle" | "submitting" | "success";

const NETWORK_FAILURE =
  "Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.";

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>(
    {},
  );
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function update<K extends keyof Values>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Same validator as the route: one rule set, two callers.
    const result = validateContactRequest({ ...values, kvkkConsent: consent });

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
    } catch (error) {
      console.error("Contact submission failed:", error);
      setSubmitError(NETWORK_FAILURE);
      setStatus("idle");
    }
  }

  if (status === "success" && reference !== null) {
    return (
      <Card tone="soft" role="status" className="p-8">
        <p className="font-mono text-sm text-accent-strong md:text-base">
          MESAJ ALINDI — REF: {reference}
        </p>
        <p className="mt-4 text-base text-ink-muted">
          48 saat içinde dönüş yapıyoruz.
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <TextField
        id="ad"
        label="Ad"
        required
        autoComplete="name"
        value={values.ad}
        error={errors.ad}
        onChange={(event) => update("ad", event.target.value)}
      />
      <TextField
        id="email"
        label="E-posta"
        type="email"
        required
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={(event) => update("email", event.target.value)}
      />
      <TextField
        id="konu"
        label="Konu"
        required
        value={values.konu}
        error={errors.konu}
        onChange={(event) => update("konu", event.target.value)}
      />
      <TextareaField
        id="mesaj"
        label="Mesaj"
        required
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
        {status === "submitting" ? "Gönderiliyor…" : "Mesajı Gönder"}
      </Button>
    </form>
  );
}
