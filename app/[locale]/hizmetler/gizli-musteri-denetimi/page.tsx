import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ClosingCta } from "@/components/services/ClosingCta";
import { DefinitionCard } from "@/components/services/DefinitionCard";
import { ModuleQuickLinks } from "@/components/services/ModuleQuickLinks";
import { PageHero } from "@/components/services/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { alternatesFor } from "@/i18n/metadata";
import type { LocaleParams } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auditServicePage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/hizmetler/gizli-musteri-denetimi", locale),
  };
}

/** Copy for all three lists lives under auditServicePage; order is the journey's. */
const MEASUREMENT_KEYS = [
  "welcome",
  "frontOffice",
  "housekeeping",
  "checkout",
] as const;
const REVENUE_KEYS = ["service", "bar"] as const;
const DELIVERABLE_KEYS = ["swot", "roi", "scorecard"] as const;

export default async function MysteryShopperAuditPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "auditServicePage" });

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow={t("scopeEyebrow")}
            title={t("scopeTitle")}
            description={t("scopeDescription")}
          />
        </Reveal>
        <Reveal className="mt-12">
          <ul className="grid gap-4 md:grid-cols-2">
            {MEASUREMENT_KEYS.map((key) => (
              <li key={key}>
                <DefinitionCard
                  title={t(`measurements.${key}.title`)}
                  description={t(`measurements.${key}.description`)}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-20 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow={t("revenueEyebrow")}
              title={t("revenueTitle")}
              description={t("revenueDescription")}
            />
          </Reveal>
          <Reveal className="mt-12">
            <ul className="grid gap-4 md:grid-cols-2">
              {REVENUE_KEYS.map((key) => (
                <li key={key}>
                  <DefinitionCard
                    title={t(`revenue.${key}.title`)}
                    description={t(`revenue.${key}.description`)}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow={t("deliverablesEyebrow")}
            title={t("deliverablesTitle")}
            description={t("deliverablesDescription")}
          />
        </Reveal>
        <Reveal className="mt-12">
          <ul className="grid gap-4 md:grid-cols-3">
            {DELIVERABLE_KEYS.map((key, index) => (
              <li key={key}>
                <DefinitionCard
                  label={`${t("deliverableLabel")} ${String(index + 1).padStart(2, "0")}`}
                  title={t(`deliverables.${key}.title`)}
                  description={t(`deliverables.${key}.description`)}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="mx-auto max-w-content px-6 pb-24">
        <Reveal>
          <SectionHeading
            eyebrow={t("relatedEyebrow")}
            title={t("relatedTitle")}
            description={t("relatedDescription")}
          />
        </Reveal>
        <Reveal className="mt-10">
          {/* The four single audit modules. Not D — that is the package, and it
              belongs on /moduller next to its own price, not in a list of parts. */}
          <ModuleQuickLinks codes={["A", "B", "C", "E"]} />
        </Reveal>
        <Reveal className="mt-16">
          <ClosingCta title={t("closingTitle")}>
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
