import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ClosingCta } from "@/components/services/ClosingCta";
import { DefinitionCard } from "@/components/services/DefinitionCard";
import { Faq, type FaqItem } from "@/components/services/Faq";
import { PageHero } from "@/components/services/PageHero";
import {
  ProcessStep,
  type ProcessStepData,
} from "@/components/services/ProcessStep";
import { TrustBox } from "@/components/services/TrustBox";
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
  const t = await getTranslations({ locale, namespace: "processPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/surec", locale),
  };
}

/** Order and numbering are the audit's, not the language's. Copy: processPage.steps. */
const STEP_KEYS = ["discovery", "field", "report", "transformation"] as const;

/** Three evidence cards, numbered in the order they are read. Copy: processPage.evidence. */
const EVIDENCE_KEYS = ["timestamps", "checklists", "secondAuditor"] as const;

const FAQ_KEYS = [
  "auditors",
  "duration",
  "detection",
  "delivery",
  "dataSafety",
] as const;

export default async function ProcessPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "processPage" });

  const steps: readonly ProcessStepData[] = STEP_KEYS.map((key, index) => ({
    // The step number is positional, so it is derived rather than stored twice.
    number: String(index + 1).padStart(2, "0"),
    name: t(`steps.${key}.name`),
    summary: t(`steps.${key}.summary`),
    detail: t.raw(`steps.${key}.detail`) as readonly string[],
  }));

  const faqItems: readonly FaqItem[] = FAQ_KEYS.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          {steps.map((step) => (
            <ProcessStep key={step.number} step={step} />
          ))}
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-20 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow={t("evidenceEyebrow")}
              title={t("evidenceTitle")}
              description={t("evidenceDescription")}
            />
          </Reveal>
          <Reveal className="mt-12">
            <ul className="grid gap-4 md:grid-cols-3">
              {EVIDENCE_KEYS.map((key, index) => (
                <li key={key}>
                  <DefinitionCard
                    label={`${t("evidenceLabel")} ${String(index + 1).padStart(2, "0")}`}
                    title={t(`evidence.${key}.title`)}
                    description={t(`evidence.${key}.description`)}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <TrustBox title={t("trustTitle")}>
            <p>{t("trustBody1")}</p>
            <p>{t("trustBody2")}</p>
          </TrustBox>
        </Reveal>
      </section>

      <section className="mx-auto max-w-content px-6 pb-24">
        <Reveal>
          <SectionHeading eyebrow={t("faqEyebrow")} title={t("faqTitle")} />
        </Reveal>
        <Reveal className="mt-10">
          <Faq items={faqItems} />
        </Reveal>
        <Reveal className="mt-16">
          <ClosingCta title={t("closingTitle")}>
            <Button href="/moduller" size="lg">
              {t("closingCta")}
            </Button>
            <Button
              href="/hizmetler/gizli-musteri-denetimi"
              variant="ghost"
              size="lg"
            >
              {t("closingCtaSecondary")}
            </Button>
          </ClosingCta>
        </Reveal>
      </section>
    </main>
  );
}
