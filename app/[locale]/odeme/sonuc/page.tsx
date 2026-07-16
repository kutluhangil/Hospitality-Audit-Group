import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClearCartOnSuccess } from "@/components/forms/BillingForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { formatPrice } from "@/lib/cart-math";
import { isPaymentEnabled, verifyOutcome, type PaymentOutcome } from "@/lib/payment";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Ödeme Sonucu",
  description: "Kart ödemenizin sonucu ve sipariş referansınız.",
  // A one-shot transactional page tied to a signed token; there is nothing here
  // for a crawler, and it must never surface in a search result.
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * The 3-D return, as the buyer sees it.
 *
 * Everything on this page is driven by `verifyOutcome`, which only accepts a
 * token our own callback signed. The query string is public and editable, so
 * without that check `?d=success` would be a receipt anyone could mint. An
 * unverified token is not treated as a failure either — it is reported as what it
 * is: a result we cannot read.
 */
export default async function OdemeSonucPage({ searchParams }: Props) {
  // The page belongs to a feature that does not exist when payment is off.
  if (!isPaymentEnabled()) notFound();

  const params = await searchParams;
  const token = params.d;
  const outcome = typeof token === "string" ? verifyOutcome(token) : null;

  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 md:py-24">
      <Reveal>
        <header className="max-w-2xl">
          <Eyebrow>ÖDEME</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            Ödeme sonucu
          </h1>
        </header>
      </Reveal>

      <Reveal className="mt-10 md:mt-12">
        <OutcomePanel outcome={outcome} />
      </Reveal>
    </main>
  );
}

function OutcomePanel({ outcome }: { outcome: PaymentOutcome | null }) {
  if (outcome === null) return <UnreadablePanel />;
  if (outcome.status === "success") return <SuccessPanel outcome={outcome} />;
  if (outcome.status === "failure") return <FailurePanel outcome={outcome} />;
  return <UnknownPanel outcome={outcome} />;
}

/** Mono reference line, matching the quote flow's `TALEP ALINDI — REF:`. */
function ReferenceLine({ label, reference }: { label: string; reference: string }) {
  return (
    <p className="font-mono text-sm text-accent-strong md:text-base">
      {label}
      {reference ? ` — REF: ${reference}` : null}
    </p>
  );
}

function SupportLine({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-base leading-relaxed text-ink-muted">{children}</p>;
}

function ContactLink() {
  return (
    <a
      href={`mailto:${siteConfig.contact.email}`}
      className="text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-accent-strong-hover"
    >
      {siteConfig.contact.email}
    </a>
  );
}

function SuccessPanel({ outcome }: { outcome: PaymentOutcome }) {
  return (
    <Card tone="soft" role="status" className="p-8 md:p-10">
      {/* Reached only behind a verified provider outcome — the one place the cart
          may be emptied, because this is the one place we know money moved. */}
      <ClearCartOnSuccess />
      <ReferenceLine label="ÖDEME ALINDI" reference={outcome.reference} />
      {outcome.paidAmount !== null ? (
        <p className="mt-3 font-mono text-sm tabular-nums text-ink-muted">
          TAHSİL EDİLEN: {formatPrice(outcome.paidAmount)}
        </p>
      ) : null}
      <SupportLine>
        Faturanız ve denetim takvimi teklifiniz 48 saat içinde e-posta adresinize iletilir. Bu
        referansı saklayın.
      </SupportLine>
    </Card>
  );
}

function FailurePanel({ outcome }: { outcome: PaymentOutcome }) {
  return (
    <Card role="alert" className="border-accent p-8 md:p-10">
      <ReferenceLine label="ÖDEME ALINMADI" reference={outcome.reference} />
      <SupportLine>
        {/* The provider's own reason, or nothing. Never a guess about why a bank
            declined a card we cannot see. */}
        {outcome.failureReason
          ? `Ödeme kuruluşunun bildirdiği sebep: ${outcome.failureReason}`
          : "Ödeme tamamlanamadı. Kartınızdan çekim yapılmadı."}
      </SupportLine>
      <SupportLine>
        Seçiminiz duruyor — tekrar deneyebilir veya teklif formundan ilerleyebilirsiniz.
      </SupportLine>
      <div className="mt-6">
        <Button href="/teklif" size="lg">
          Teklif Sayfasına Dön
        </Button>
      </div>
    </Card>
  );
}

/**
 * The provider could not be asked, or its answer did not verify. Saying "başarılı"
 * or "başarısız" here would be a guess about the buyer's bank account, so this
 * panel says exactly what is known: nothing, yet.
 */
function UnknownPanel({ outcome }: { outcome: PaymentOutcome }) {
  return (
    <Card role="alert" className="border-accent p-8 md:p-10">
      <ReferenceLine label="ÖDEME DURUMU DOĞRULANAMADI" reference={outcome.reference} />
      <SupportLine>
        Ödemenizin sonucunu ödeme kuruluşundan teyit edemedik. Kartınızdan çekim yapılmış olabilir —
        bu yüzden lütfen <strong className="text-ink">tekrar ödeme denemeyin.</strong>
      </SupportLine>
      <SupportLine>
        Bu referansla <ContactLink /> adresine yazın; durumu sizin için kontrol edip aynı gün
        dönelim.
      </SupportLine>
    </Card>
  );
}

/** No token, an expired one, or one we did not sign. */
function UnreadablePanel() {
  return (
    <Card role="alert" className="border-accent p-8 md:p-10">
      <p className="font-mono text-sm text-accent-strong md:text-base">ÖDEME SONUCU OKUNAMADI</p>
      <SupportLine>
        Bu sayfa bir ödeme dönüşüne ait geçerli bir sonuç taşımıyor. Bağlantının süresi dolmuş
        olabilir.
      </SupportLine>
      <SupportLine>
        Bir ödeme yaptıysanız durumu buradan göremeyiz — <ContactLink /> adresine yazın.
      </SupportLine>
      <div className="mt-6">
        <Button href="/teklif" size="lg" variant="ghost">
          Teklif Sayfasına Dön
        </Button>
      </div>
    </Card>
  );
}
