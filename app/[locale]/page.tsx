import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { EvidenceShowcase } from "@/components/criteria/EvidenceShowcase";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { ModulesTeaser } from "@/components/home/ModulesTeaser";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { alternatesFor } from "@/i18n/metadata";
import type { LocaleParams } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

// generateMetadata rather than a static object: the canonical has to name the
// URL this locale serves (/tr or /en), not the unprefixed root.
export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const tSite = await getTranslations({ locale, namespace: "site" });
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    // Absolute: the layout's template would otherwise append the site name twice.
    title: { absolute: `${siteConfig.name} — ${tSite("tagline")}` },
    description: t("metaDescription"),
    alternates: alternatesFor("/", locale),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <TrustStrip />
      <ServicesOverview />
      <ProcessSection />
      <StatsSection />
      <ModulesTeaser />
      <TestimonialsSection />
      <EvidenceShowcase className="mx-auto max-w-content px-6 py-20 md:py-28" />
      <FinalCTA />
    </main>
  );
}
