import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { AuditorProfile } from "@/components/about/AuditorProfile";
import { CorporateIdentity } from "@/components/about/CorporateIdentity";
import { FoundingStory } from "@/components/about/FoundingStory";
import { EvidenceShowcase } from "@/components/criteria/EvidenceShowcase";
import { ClosingCta } from "@/components/services/ClosingCta";
import { MonoRibbon } from "@/components/services/MonoRibbon";
import { PageHero } from "@/components/services/PageHero";
import { Button } from "@/components/ui/Button";
import { PaperFigure } from "@/components/ui/PaperFigure";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { alternatesFor } from "@/i18n/metadata";
import type { LocaleParams } from "@/i18n/routing";

// generateMetadata rather than a static object: the canonical has to name the
// URL this locale serves, and only the request knows which locale that is.
export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/biz-kimiz", locale),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="mx-auto max-w-content px-6 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start">
          <FoundingStory />
          <Reveal delay={0.08}>
            <PaperFigure
              src="/images/biz-kimiz-hero.png"
              alt={t("heroImageAlt")}
              sizes="(min-width: 1024px) 20rem, 70vw"
              className="w-56 justify-self-start lg:w-80"
            />
          </Reveal>
        </div>
        <Reveal className="mt-14">
          <MonoRibbon>{t("ribbon")}</MonoRibbon>
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-16 md:py-20">
          <AuditorProfile />
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-16 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow={t("anonymity.eyebrow")}
            title={t("anonymity.title")}
            description={t("anonymity.description")}
          />
        </Reveal>
        <Reveal className="mt-10">
          <blockquote className="max-w-2xl border-l-2 border-accent pl-6 font-serif text-2xl leading-snug md:text-3xl">
            {t("anonymity.quote")}
          </blockquote>
        </Reveal>
        <Reveal className="mt-10">
          <p className="max-w-2xl text-base leading-relaxed text-ink-muted">
            {t("anonymity.body")}
          </p>
        </Reveal>
      </section>

      <section className="border-t border-line">
        <EvidenceShowcase className="mx-auto max-w-content px-6 py-16 md:py-20" />
      </section>

      {/* Renders only once every registry identifier in company-data.ts is real. */}
      <section className="mx-auto max-w-content px-6 pb-16 md:pb-20">
        <CorporateIdentity />
      </section>

      <section className="mx-auto max-w-content px-6 pb-20 md:pb-28">
        <Reveal>
          <ClosingCta
            title={t("closingTitle")}
            description={t("closingDescription")}
          >
            <Button href="/moduller" size="lg">
              {t("closingCtaPrimary")}
            </Button>
            <Button href="/surec" variant="ghost" size="lg">
              {t("closingCtaSecondary")}
            </Button>
          </ClosingCta>
        </Reveal>
      </section>
    </main>
  );
}
