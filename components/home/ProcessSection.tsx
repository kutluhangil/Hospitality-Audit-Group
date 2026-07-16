import { useTranslations } from "next-intl";

import { Reveal } from "@/components/ui/Reveal";

/**
 * Numbering is meaningful here: the audit runs in this order. The number is a
 * number in every language, so it stays in code; only the wording is looked up.
 */
const STEPS = [
  { number: "01", key: "discovery" },
  { number: "02", key: "field" },
  { number: "03", key: "report" },
  { number: "04", key: "transformation" },
] as const;

export function ProcessSection() {
  const t = useTranslations("home.process");

  return (
    <section className="border-y border-line bg-bg-soft">
      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, index) => (
            // Reveal renders a div, so it sits inside the li rather than around it.
            <li key={step.number}>
              <Reveal
                delay={index * 0.08}
                className="border-t border-accent pt-5"
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                  <span className="text-accent-strong">{step.number}</span>{" "}
                  {t(`${step.key}.title`)}
                </p>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">
                  {t(`${step.key}.description`)}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
