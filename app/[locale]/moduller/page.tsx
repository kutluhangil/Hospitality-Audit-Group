import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ModuleCard, toCatalogueEntry } from "@/components/modules/ModuleCard";
import { ModulesSelectionSummary } from "@/components/modules/ModulesSelectionSummary";
import { PackageOfferBanner } from "@/components/modules/PackageOfferBanner";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { alternatesFor } from "@/i18n/metadata";
import type { LocaleParams } from "@/i18n/routing";
import { criteriaCount } from "@/lib/audit-criteria";
import { modules, trainingService } from "@/lib/modules-data";

// generateMetadata rather than a static object: the canonical has to name the
// URL this locale serves (/en/modules, not /moduller).
export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "modulesPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/moduller", locale),
  };
}

/**
 * The training service sits in the same grid but is not a module: no letter, no
 * field guide, and the package does not absorb it.
 */
const TRAINING_ENTRY = {
  id: trainingService.id,
  icon: trainingService.icon,
  price: trainingService.price,
} as const;

export default async function ModulesPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ModulesPageBody />;
}

function ModulesPageBody() {
  const t = useTranslations("modulesPage");
  const tModules = useTranslations("modules");
  const total = criteriaCount();

  return (
    <main className="mx-auto max-w-content px-6 py-16 md:py-24">
      <Reveal>
        <header className="max-w-2xl">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
            {t("body", { total })}
          </p>
          <p className="mt-3 text-sm text-ink-muted">{tModules("scaleNote")}</p>
        </header>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => (
          <Reveal
            key={module.code}
            delay={Math.min(index, 5) * 0.04}
            className="h-full"
          >
            <ModuleCard entry={toCatalogueEntry(module)} />
          </Reveal>
        ))}
        <Reveal delay={0.2} className="h-full">
          <ModuleCard entry={TRAINING_ENTRY} />
        </Reveal>
      </div>

      <PackageOfferBanner className="mt-10" />

      <Reveal className="mt-16">
        <ModulesSelectionSummary />
      </Reveal>

      <Reveal className="mt-16">
        <Card tone="surface" className="flex flex-col gap-4 md:p-8">
          <Eyebrow tone="muted">KVKK %100 UYUM · KARŞILIKLI NDA</Eyebrow>
          <h2 className="font-serif text-2xl">
            Denetim verisi tesisinize aittir.
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-muted md:text-base">
            Her çalışma karşılıklı gizlilik sözleşmesiyle başlar. Denetim
            sırasında toplanan tüm gözlem kayıtları ve raporlar KVKK kapsamında
            işlenir; yalnızca tesis yönetimiyle paylaşılır, üçüncü taraflara
            aktarılmaz.
          </p>
        </Card>
      </Reveal>
    </main>
  );
}
