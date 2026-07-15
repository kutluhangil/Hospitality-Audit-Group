import type { Metadata } from "next";

import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { ModulesTeaser } from "@/components/home/ModulesTeaser";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { StatsSection } from "@/components/home/StatsSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  // Absolute: the layout's template would otherwise append the site name twice.
  title: { absolute: `${siteConfig.name} — ${siteConfig.tagline}` },
  description:
    "Sektör kıdemli denetçilerimiz tesisinize misafir olarak gelir; marka standardı ile sahadaki gerçek arasındaki boşluğu ölçer, gelir kaçaklarını rakamlarla raporlar.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <ServicesOverview />
      <ProcessSection />
      <StatsSection />
      <ModulesTeaser />
      <FinalCTA />
    </main>
  );
}
