import { useTranslations } from "next-intl";

import { Reveal } from "@/components/ui/Reveal";

/**
 * The figures are part of the copy, not separate from it: Turkish writes %100
 * and English writes 100%, and "4 modül" pluralises differently from
 * "4 modules". Splitting the number from its unit would only move that problem.
 */
const STATS = ["modules", "turnaround", "compliance"] as const;

export function StatsSection() {
  const t = useTranslations("home.stats");

  return (
    <section className="mx-auto max-w-content px-6 py-20 md:py-28">
      <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8">
        {STATS.map((key, index) => (
          // Reveal renders a div, which is a valid grouping child of dl.
          <Reveal key={key} delay={index * 0.08}>
            <dt className="font-mono text-4xl text-ink">{t(`${key}.value`)}</dt>
            <dd className="mt-3 text-base leading-relaxed text-ink-muted">
              {t(`${key}.description`)}
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
