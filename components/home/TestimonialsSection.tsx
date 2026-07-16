import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Two anonymous testimonials — consistent with the NDA brand promise.
 * The anonymity is not a weakness but a feature: the firm's own secrecy
 * is the best advertisement for its discretion.
 */
export function TestimonialsSection() {
  const t = useTranslations("home.testimonials");

  const items = [0, 1] as const;

  return (
    <section className="mx-auto max-w-content px-6 py-20 md:py-28">
      <Reveal>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          className="mb-12 md:mb-16"
        />
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((index) => (
          <Reveal key={index} delay={index * 0.1}>
            <figure className="flex h-full flex-col rounded-xl2 border border-line bg-surface p-8">
              {/* Decorative quote mark — accent doing exactly the decorative
                  job it is for, not carrying meaning. */}
              <Quote
                className="mb-6 h-6 w-6 shrink-0 text-accent"
                aria-hidden="true"
                strokeWidth={1.5}
              />

              <blockquote className="grow font-serif text-xl leading-relaxed text-ink md:text-2xl">
                &ldquo;{t(`items.${index}.quote`)}&rdquo;
              </blockquote>

              <figcaption className="mt-8 border-t border-line pt-6">
                <p className="font-mono text-sm text-ink">
                  {t(`items.${index}.role`)}
                </p>
                {/* The NDA note is functional, not decorative: it explains
                    the anonymity so the reader doesn't read evasiveness. */}
                <p className="mt-1 font-mono text-xs text-ink-muted">
                  {t(`items.${index}.note`)}
                </p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
