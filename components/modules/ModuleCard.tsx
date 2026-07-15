"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useQuoteCart } from "@/lib/quote-cart";
import { moduleIcons, PRICING_NOTE, type AuditModule } from "@/lib/modules-data";

type ModuleCardProps = {
  module: AuditModule;
};

export function ModuleCard({ module }: ModuleCardProps) {
  const { has, toggle, hydrated } = useQuoteCart();
  const Icon = moduleIcons[module.icon];

  // The server renders an empty cart, so the selected state is unknowable until
  // localStorage has been read. Deriving the label from `selected` before that
  // would make the first client paint contradict the server HTML.
  const inCart = hydrated && has(module.code);

  return (
    <Card
      as="article"
      tone={module.featured ? "accent" : "surface"}
      className="flex flex-col gap-5"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          MODÜL {module.code}
        </span>
        {module.featured ? (
          <span className="rounded-xl2 border border-accent px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent-strong">
            En kapsamlı
          </span>
        ) : null}
      </div>

      <Icon className="size-7 text-accent" strokeWidth={1.5} aria-hidden="true" />

      <div>
        <h3 className="font-serif text-2xl">{module.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{module.summary}</p>
      </div>

      <ul className="flex flex-col gap-2">
        {module.scope.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-ink">
            <span className="text-accent" aria-hidden="true">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      {/* Pushes the price note and button to the bottom so cards in a row align. */}
      <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink-muted">
          {PRICING_NOTE}
        </p>
        <Button
          variant={inCart ? "ghost" : "accent"}
          onClick={() => toggle(module.code)}
          disabled={!hydrated}
          aria-pressed={inCart}
          aria-label={`${module.title} modülünü teklif sepetine ekle`}
        >
          {inCart ? "Sepette ✓" : "Sepete Ekle"}
        </Button>
      </div>
    </Card>
  );
}
