import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ClearCartOnSuccess } from "@/components/forms/BillingForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { alternatesFor } from "@/i18n/metadata";
import type { LocaleParams } from "@/i18n/routing";
import { formatPrice } from "@/lib/cart-math";
import {
  isPaymentEnabled,
  verifyOutcome,
  type PaymentOutcome,
} from "@/lib/payment";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "paymentResultPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/odeme/sonuc", locale),
    // A one-shot transactional page tied to a signed token; there is nothing here
    // for a crawler, and it must never surface in a search result.
    robots: { index: false, follow: false },
  };
}

/** The paymentResultPage translator, threaded to each panel below. */
type PaymentResultT = Awaited<ReturnType<typeof getTranslations>>;

/**
 * Rich-text tags shared by the panels: <b> for the one in-sentence emphasis, and
 * <mail> for the support address. The email is bound as a value too, since the
 * copy reads "<mail>{email}</mail>" — the tag renders the link, the placeholder
 * fills the visible address.
 */
const richTags = {
  b: (chunks: React.ReactNode) => (
    <strong className="text-ink">{chunks}</strong>
  ),
  mail: (chunks: React.ReactNode) => (
    <a
      href={`mailto:${siteConfig.contact.email}`}
      className="text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-accent-strong-hover"
    >
      {chunks}
    </a>
  ),
  email: siteConfig.contact.email,
};

type Props = {
  params: Promise<LocaleParams>;
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
export default async function OdemeSonucPage({ params, searchParams }: Props) {
  // The page belongs to a feature that does not exist when payment is off.
  if (!isPaymentEnabled()) notFound();

  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "paymentResultPage" });

  const query = await searchParams;
  const token = query.d;
  const outcome = typeof token === "string" ? verifyOutcome(token) : null;

  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 md:py-24">
      <Reveal>
        <header className="max-w-2xl">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            {t("title")}
          </h1>
        </header>
      </Reveal>

      <Reveal className="mt-10 md:mt-12">
        <OutcomePanel outcome={outcome} t={t} />
      </Reveal>
    </main>
  );
}

function OutcomePanel({
  outcome,
  t,
}: {
  outcome: PaymentOutcome | null;
  t: PaymentResultT;
}) {
  if (outcome === null) return <UnreadablePanel t={t} />;
  if (outcome.status === "success")
    return <SuccessPanel outcome={outcome} t={t} />;
  if (outcome.status === "failure")
    return <FailurePanel outcome={outcome} t={t} />;
  return <UnknownPanel outcome={outcome} t={t} />;
}

/** Mono reference line, matching the quote flow's `TALEP ALINDI — REF:`. */
function ReferenceLine({
  label,
  reference,
}: {
  label: string;
  reference: string;
}) {
  return (
    <p className="font-mono text-sm text-accent-strong md:text-base">
      {label}
      {reference ? ` — REF: ${reference}` : null}
    </p>
  );
}

function SupportLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-base leading-relaxed text-ink-muted">{children}</p>
  );
}

function SuccessPanel({
  outcome,
  t,
}: {
  outcome: PaymentOutcome;
  t: PaymentResultT;
}) {
  return (
    <Card tone="soft" role="status" className="p-8 md:p-10">
      {/* Reached only behind a verified provider outcome — the one place the cart
          may be emptied, because this is the one place we know money moved. */}
      <ClearCartOnSuccess />
      <ReferenceLine
        label={t("success.label")}
        reference={outcome.reference}
      />
      {outcome.paidAmount !== null ? (
        <p className="mt-3 font-mono text-sm tabular-nums text-ink-muted">
          {t("success.collected", { amount: formatPrice(outcome.paidAmount) })}
        </p>
      ) : null}
      <SupportLine>{t("success.body")}</SupportLine>
    </Card>
  );
}

function FailurePanel({
  outcome,
  t,
}: {
  outcome: PaymentOutcome;
  t: PaymentResultT;
}) {
  return (
    <Card role="alert" className="border-accent p-8 md:p-10">
      <ReferenceLine label={t("failure.label")} reference={outcome.reference} />
      <SupportLine>
        {/* The provider's own reason, or nothing. Never a guess about why a bank
            declined a card we cannot see. */}
        {outcome.failureReason
          ? t("failure.reason", { reason: outcome.failureReason })
          : t("failure.genericBody")}
      </SupportLine>
      <SupportLine>{t("failure.standingBody")}</SupportLine>
      <div className="mt-6">
        <Button href="/teklif" size="lg">
          {t("failure.back")}
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
function UnknownPanel({
  outcome,
  t,
}: {
  outcome: PaymentOutcome;
  t: PaymentResultT;
}) {
  return (
    <Card role="alert" className="border-accent p-8 md:p-10">
      <ReferenceLine
        label={t("unknown.label")}
        reference={outcome.reference}
      />
      <SupportLine>{t.rich("unknown.body1", richTags)}</SupportLine>
      <SupportLine>{t.rich("unknown.body2", richTags)}</SupportLine>
    </Card>
  );
}

/** No token, an expired one, or one we did not sign. */
function UnreadablePanel({ t }: { t: PaymentResultT }) {
  return (
    <Card role="alert" className="border-accent p-8 md:p-10">
      <p className="font-mono text-sm text-accent-strong md:text-base">
        {t("unreadable.label")}
      </p>
      <SupportLine>{t("unreadable.body1")}</SupportLine>
      <SupportLine>{t.rich("unreadable.body2", richTags)}</SupportLine>
      <div className="mt-6">
        <Button href="/teklif" size="lg" variant="ghost">
          {t("unreadable.back")}
        </Button>
      </div>
    </Card>
  );
}
