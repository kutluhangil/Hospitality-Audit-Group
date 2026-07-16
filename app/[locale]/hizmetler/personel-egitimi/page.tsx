import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ClosingCta } from "@/components/services/ClosingCta";
import { DefinitionCard } from "@/components/services/DefinitionCard";
import { MonoRibbon } from "@/components/services/MonoRibbon";
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
  const t = await getTranslations({ locale, namespace: "trainingPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/hizmetler/personel-egitimi", locale),
  };
}

/** Numbering is positional; the copy lives under trainingPage.programmes. */
const PROGRAMME_KEYS = [
  "frontOffice",
  "fnb",
  "housekeeping",
  "leadership",
] as const;

export default async function StaffTrainingPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "trainingPage" });

  return (
    <main>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} lede={t("lede")} />

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <SectionHeading eyebrow={t("loopEyebrow")} title={t("loopTitle")} />
        </Reveal>
        <Reveal className="mt-6">
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-muted md:text-lg">
            <p>{t("loopBody1")}</p>
            <p>{t("loopBody2")}</p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-20 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow={t("programmesEyebrow")}
              title={t("programmesTitle")}
              description={t("programmesDescription")}
            />
          </Reveal>
          <Reveal className="mt-12">
            <ul className="grid gap-4 md:grid-cols-2">
              {PROGRAMME_KEYS.map((key, index) => (
                <li key={key}>
                  <DefinitionCard
                    label={`${t("programmeLabel")} ${String(index + 1).padStart(2, "0")}`}
                    title={t(`programmes.${key}.title`)}
                    description={t(`programmes.${key}.description`)}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-10">
            <MonoRibbon>
              YERİNDE EĞİTİM · ATÖLYE · ROL CANLANDIRMA · ÖLÇÜM: ÖN/SON TEST +
              TAKİP DENETİMİ
            </MonoRibbon>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          {/*
            Training carries no module letter, and pointing this block at one was
            how it ended up showing the Housekeeping card and calling it training.
            It is a catalogue line of its own, so the link goes to the catalogue.
          */}
          <SectionHeading
            eyebrow={t("relatedEyebrow")}
            title={t("relatedTitle")}
            description={t("relatedDescription")}
          />
        </Reveal>
        <Reveal className="mt-10">
          <Button href="/moduller" size="lg">
            {t("relatedCta")}
          </Button>
        </Reveal>
        <Reveal className="mt-16">
          <ClosingCta title={t("closingTitle")}>
            <Button href="/moduller" size="lg">
              {t("closingCtaPrimary")}
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
