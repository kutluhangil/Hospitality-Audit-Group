"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

import { CheckboxField, FormError, TextField, TextareaField } from "@/components/forms/fields";
import { CartLines, CartTotals } from "@/components/modules/CartLines";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatPrice } from "@/lib/cart-math";
import {
  parsePaymentInitResponse,
  validateBillingRequest,
  type BillingField,
  type InvoiceType,
} from "@/lib/billing-schema";
import { clearItems, useQuoteCart } from "@/lib/quote-cart";

/**
 * The payment path's client surface.
 *
 * It imports from `lib/billing-schema.ts` and never from `lib/payment.ts` — the
 * schema is isomorphic, the provider module is Node-only, and that separation is
 * what keeps the API secret out of this bundle.
 */

type Values = {
  ticaretUnvani: string;
  vergiDairesi: string;
  vergiNo: string;
  adSoyad: string;
  tcKimlikNo: string;
  ulke: string;
  il: string;
  ilce: string;
  acikAdres: string;
  postaKodu: string;
  email: string;
  telefon: string;
};

const EMPTY_VALUES: Values = {
  ticaretUnvani: "",
  vergiDairesi: "",
  vergiNo: "",
  adSoyad: "",
  tcKimlikNo: "",
  // The one prefilled field: the service is sold and invoiced in Turkey.
  ulke: "Türkiye",
  il: "",
  ilce: "",
  acikAdres: "",
  postaKodu: "",
  email: "",
  telefon: "",
};

type Consents = {
  mesafeliSatisOnay: boolean;
  onBilgilendirmeOnay: boolean;
  kvkkConsent: boolean;
};

const EMPTY_CONSENTS: Consents = {
  mesafeliSatisOnay: false,
  onBilgilendirmeOnay: false,
  kvkkConsent: false,
};

type Status = "idle" | "submitting" | "redirecting";

const NETWORK_FAILURE = "Sunucuya ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.";

const legalLinkClasses =
  "text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-accent-strong-hover";

const invoiceTypeLabels: Record<InvoiceType, string> = {
  kurumsal: "Kurumsal",
  bireysel: "Bireysel",
};

export function BillingForm() {
  const { selected, hydrated, totals } = useQuoteCart();

  const [faturaTipi, setFaturaTipi] = useState<InvoiceType>("kurumsal");
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [consents, setConsents] = useState<Consents>(EMPTY_CONSENTS);
  const [errors, setErrors] = useState<Partial<Record<BillingField, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof Values>(key: K, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function updateConsent<K extends keyof Consents>(key: K, value: boolean) {
    setConsents((current) => ({ ...current, [key]: value }));
  }

  /**
   * Only the fields the chosen invoice type actually has. Sending both sets would
   * ask the server to validate a company's TC kimlik number.
   */
  function payload() {
    const identity =
      faturaTipi === "kurumsal"
        ? {
            faturaTipi,
            ticaretUnvani: values.ticaretUnvani,
            vergiDairesi: values.vergiDairesi,
            vergiNo: values.vergiNo,
          }
        : { faturaTipi, adSoyad: values.adSoyad, tcKimlikNo: values.tcKimlikNo };

    return {
      ...identity,
      adres: {
        ulke: values.ulke,
        il: values.il,
        ilce: values.ilce,
        acikAdres: values.acikAdres,
        postaKodu: values.postaKodu,
      },
      email: values.email,
      telefon: values.telefon,
      selectedItems: selected,
      ...consents,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // The same validator the route runs, so the two verdicts cannot disagree.
    const result = validateBillingRequest(payload());
    if (!result.ok) {
      setErrors(result.errors);
      setSubmitError(null);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/odeme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // No total travels with this. The server prices the basket itself.
        body: JSON.stringify(result.value),
      });
      const parsed = parsePaymentInitResponse(await response.json());

      if (!parsed.ok) {
        setSubmitError(parsed.error);
        setStatus("idle");
        return;
      }

      // The cart is deliberately NOT cleared here. Nothing has been paid yet —
      // the buyer has not even seen the card page. It is cleared on the result
      // page, and only against an outcome the provider signed.
      setStatus("redirecting");
      window.location.assign(parsed.redirectUrl);
    } catch (error) {
      console.error("Payment initialisation failed:", error);
      setSubmitError(NETWORK_FAILURE);
      setStatus("idle");
    }
  }

  if (!hydrated) {
    // The basket is unknown until localStorage is read, and this form is a
    // function of the basket. An empty state here would flash the wrong answer.
    return <p className="text-sm text-ink-muted">Seçiminiz yükleniyor…</p>;
  }

  if (selected.length === 0) {
    return (
      <div>
        <p className="text-sm text-ink-muted">
          Ödeme yapabilmek için önce bir hizmet seçmelisiniz.
        </p>
        <Link href="/moduller" className={`mt-2 inline-block text-sm ${legalLinkClasses}`}>
          Modülleri inceleyin
        </Link>
      </div>
    );
  }

  const busy = status !== "idle";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <Card tone="soft" className="flex flex-col gap-5">
        <h3 className="font-serif text-xl">Ödenecek tutar</h3>
        <CartLines removable={false} />
        <CartTotals />
      </Card>

      <fieldset className="flex flex-col gap-3">
        <legend className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          Fatura Tipi
          <span aria-hidden="true" className="text-accent-strong">
            {" *"}
          </span>
        </legend>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          {(Object.keys(invoiceTypeLabels) as InvoiceType[]).map((type) => (
            // min-h-11 keeps the touch target at the 44px floor.
            <label
              key={type}
              className={`flex min-h-11 flex-1 cursor-pointer items-center gap-3 rounded-xl2 border px-4 py-3 text-sm transition-colors duration-150 ${
                faturaTipi === type ? "border-accent bg-surface" : "border-line hover:bg-bg-soft"
              }`}
            >
              <input
                type="radio"
                name="faturaTipi"
                value={type}
                checked={faturaTipi === type}
                onChange={() => setFaturaTipi(type)}
                className="h-4 w-4 shrink-0 accent-accent-strong"
              />
              {invoiceTypeLabels[type]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        {faturaTipi === "kurumsal" ? (
          <>
            {/* The field primitives own their own styling and take no className,
                so the grid span belongs to a wrapper rather than to the field. */}
            <div className="sm:col-span-2">
              <TextField
                id="ticaretUnvani"
                label="Ticaret Unvanı"
                required
                autoComplete="organization"
                value={values.ticaretUnvani}
                error={errors.ticaretUnvani}
                onChange={(event) => update("ticaretUnvani", event.target.value)}
              />
            </div>
            <TextField
              id="vergiDairesi"
              label="Vergi Dairesi"
              required
              value={values.vergiDairesi}
              error={errors.vergiDairesi}
              onChange={(event) => update("vergiDairesi", event.target.value)}
            />
            <TextField
              id="vergiNo"
              label="Vergi No"
              required
              inputMode="numeric"
              maxLength={10}
              value={values.vergiNo}
              error={errors.vergiNo}
              onChange={(event) => update("vergiNo", event.target.value)}
            />
          </>
        ) : (
          <>
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
              id="tcKimlikNo"
              label="TC Kimlik No"
              required
              inputMode="numeric"
              maxLength={11}
              value={values.tcKimlikNo}
              error={errors.tcKimlikNo}
              onChange={(event) => update("tcKimlikNo", event.target.value)}
            />
          </>
        )}

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
          id="telefon"
          label="Telefon"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          value={values.telefon}
          error={errors.telefon}
          onChange={(event) => update("telefon", event.target.value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          id="ulke"
          label="Ülke"
          required
          autoComplete="country-name"
          value={values.ulke}
          error={errors.ulke}
          onChange={(event) => update("ulke", event.target.value)}
        />
        <TextField
          id="il"
          label="İl"
          required
          autoComplete="address-level1"
          value={values.il}
          error={errors.il}
          onChange={(event) => update("il", event.target.value)}
        />
        <TextField
          id="ilce"
          label="İlçe"
          required
          autoComplete="address-level2"
          value={values.ilce}
          error={errors.ilce}
          onChange={(event) => update("ilce", event.target.value)}
        />
        <TextField
          id="postaKodu"
          label="Posta Kodu"
          required
          inputMode="numeric"
          maxLength={5}
          autoComplete="postal-code"
          value={values.postaKodu}
          error={errors.postaKodu}
          onChange={(event) => update("postaKodu", event.target.value)}
        />
        <div className="sm:col-span-2">
          <TextareaField
            id="acikAdres"
            label="Açık Adres"
            required
            rows={3}
            autoComplete="street-address"
            value={values.acikAdres}
            error={errors.acikAdres}
            onChange={(event) => update("acikAdres", event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <CheckboxField
          id="mesafeliSatisOnay"
          required
          checked={consents.mesafeliSatisOnay}
          error={errors.mesafeliSatisOnay}
          onChange={(event) => updateConsent("mesafeliSatisOnay", event.target.checked)}
        >
          <Link href="/mesafeli-satis-sozlesmesi" className={legalLinkClasses}>
            Mesafeli Satış Sözleşmesi
          </Link>
          {"'ni okudum ve onaylıyorum."}
        </CheckboxField>

        <CheckboxField
          id="onBilgilendirmeOnay"
          required
          checked={consents.onBilgilendirmeOnay}
          error={errors.onBilgilendirmeOnay}
          onChange={(event) => updateConsent("onBilgilendirmeOnay", event.target.checked)}
        >
          <Link href="/on-bilgilendirme" className={legalLinkClasses}>
            Ön Bilgilendirme Formu
          </Link>
          {"'nu okudum ve onaylıyorum."}
        </CheckboxField>

        <CheckboxField
          id="kvkkConsent"
          required
          checked={consents.kvkkConsent}
          error={errors.kvkkConsent}
          onChange={(event) => updateConsent("kvkkConsent", event.target.checked)}
        >
          Kişisel verilerimin{" "}
          <Link href="/kvkk" className={legalLinkClasses}>
            KVKK Aydınlatma Metni
          </Link>{" "}
          kapsamında işlenmesini kabul ediyorum.
        </CheckboxField>
      </div>

      {submitError ? <FormError message={submitError} /> : null}

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          size="lg"
          disabled={busy}
          className="disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Yönlendiriliyor…" : `${formatPrice(totals.total)} Öde`}
        </Button>
        <p className="text-xs leading-relaxed text-ink-muted">
          Kart bilgileriniz bu sitede saklanmaz. Ödeme adımı, 3D Secure doğrulaması için bankanızın
          ve ödeme kuruluşunun sayfasında tamamlanır.
        </p>
      </div>
    </form>
  );
}

/**
 * Empties the basket on the result page.
 *
 * It lives here rather than in the result page because it is the other half of
 * one rule that the form above states: the cart survives the hand-off to the
 * provider, because a buyer who abandons or fails the card page must not lose
 * their selection. The only thing that may empty it is proof that the money
 * actually moved — a provider outcome that verified, which is what the result
 * page checks before rendering this.
 */
export function ClearCartOnSuccess() {
  useEffect(() => {
    // Writes to the external store, not to React state — no render loop.
    clearItems();
  }, []);

  return null;
}
