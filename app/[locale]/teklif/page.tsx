import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { PaymentSection } from "@/components/forms/PaymentSection";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { alternatesFor } from "@/i18n/metadata";
import type { LocaleParams } from "@/i18n/routing";

import { isPaymentEnabled } from "@/lib/payment";

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quotePage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/teklif", locale),
  };
}

/**
 * One page, two intents.
 *
 * When payment is off — which is the case until credentials and a corporate
 * identity both exist — everything below collapses to exactly the page this was
 * before: heading, note, quote form. No path chooser, no second heading, no
 * dangling "or". The quote flow underneath is untouched.
 */
export default async function TeklifPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tModules = await getTranslations({ locale, namespace: "modules" });
  const t = await getTranslations({ locale, namespace: "quotePage" });

  const paymentEnabled = isPaymentEnabled();

  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 md:py-24">
      <Reveal>
        <header className="max-w-2xl">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            {paymentEnabled ? t("titlePayment") : t("titleDefault")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
            {paymentEnabled ? t("bodyPayment") : t("bodyDefault")}
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            {tModules("pricingNote")}
          </p>
        </header>
      </Reveal>

      {paymentEnabled ? (
        <Reveal className="mt-10">
          <PathChooser
            path1Label={t("chooser.path1Label")}
            path1Title={t("chooser.path1Title")}
            path1Body={t("chooser.path1Body")}
            path2Label={t("chooser.path2Label")}
            path2Title={t("chooser.path2Title")}
            path2Body={t("chooser.path2Body")}
          />
        </Reveal>
      ) : null}

      {/* Renders nothing at all when payment is disabled — it gates itself too. */}
      <Reveal className="mt-12 md:mt-16">
        <PaymentSection />
      </Reveal>

      <Reveal className="mt-12 md:mt-16">
        <section id="teklif-iste" className="scroll-mt-24">
          {paymentEnabled ? (
            <div className="mb-8 border-t border-line pt-12 md:pt-16">
              <Eyebrow>{t("requestSection.eyebrow")}</Eyebrow>
              <h2 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
                {t("requestSection.title")}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
                {t("requestSection.body", { scaleNote: tModules("scaleNote") })}
              </p>
            </div>
          ) : null}
          <QuoteForm />
        </section>
      </Reveal>
    </main>
  );
}

/**
 * Names both paths side by side before either form appears, so a visitor knows
 * which one they are about to be in rather than discovering it at the submit button.
 */
function PathChooser({
  path1Label,
  path1Title,
  path1Body,
  path2Label,
  path2Title,
  path2Body,
}: {
  path1Label: string;
  path1Title: string;
  path1Body: string;
  path2Label: string;
  path2Title: string;
  path2Body: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PathCard
        href="#kart-ile-ode"
        label={path1Label}
        title={path1Title}
        body={path1Body}
      />
      <PathCard
        href="#teklif-iste"
        label={path2Label}
        title={path2Title}
        body={path2Body}
      />
    </div>
  );
}

type PathCardProps = {
  href: string;
  label: string;
  title: string;
  body: string;
};

function PathCard({ href, label, title, body }: PathCardProps) {
  return (
    <a
      href={href}
      className="flex flex-col gap-2 rounded-xl2 border border-line bg-surface p-6 transition-colors duration-150 hover:border-accent"
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
        {label}
      </span>
      <span className="font-serif text-xl">{title}</span>
      <span className="text-sm leading-relaxed text-ink-muted">{body}</span>
    </a>
  );
}
