import type { ReactNode } from "react";

type ClosingCtaProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

/** Page-closing panel. Stays on bg-soft so the home page terminal keeps its weight. */
export function ClosingCta({ title, description, children }: ClosingCtaProps) {
  return (
    <div className="rounded-xl2 bg-bg-soft px-6 py-12 text-center md:px-12 md:py-16">
      <h2 className="mx-auto max-w-2xl font-serif text-2xl md:text-3xl">{title}</h2>
      {description ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  );
}
