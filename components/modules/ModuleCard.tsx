import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CartButton } from "@/components/modules/CartButton";
import { PriceTag } from "@/components/modules/PriceTag";
import { Card } from "@/components/ui/Card";
import { criteriaCount } from "@/lib/audit-criteria";
import { moduleIcons, type AuditModule, type CartItemId } from "@/lib/modules-data";

type CatalogueEntry = {
  id: CartItemId;
  title: string;
  summary: string;
  scope: readonly string[];
  icon: keyof typeof moduleIcons;
  price: number;
  /** Absent for the training service, which has no letter. */
  code?: string;
  /** Absent for the training service, which has no field guide to link to. */
  href?: string;
  featured?: boolean;
};

export function toCatalogueEntry(module: AuditModule): CatalogueEntry {
  return {
    id: module.code,
    code: module.code,
    title: module.title,
    summary: module.summary,
    scope: module.scope,
    icon: module.icon,
    price: module.price,
    href: `/moduller/${module.slug}`,
    featured: module.featured,
  };
}

export function ModuleCard({ entry }: { entry: CatalogueEntry }) {
  const Icon = moduleIcons[entry.icon];
  const count = entry.code ? criteriaCount(entry.code as never) : 0;

  return (
    <Card
      as="article"
      tone={entry.featured ? "accent" : "surface"}
      className="flex h-full flex-col gap-5"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          {entry.code ? `MODÜL ${entry.code}` : "EK HİZMET"}
        </span>
        {entry.featured ? (
          <span className="shrink-0 rounded-xl2 border border-accent px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent-strong">
            En kapsamlı
          </span>
        ) : null}
      </div>

      <Icon className="size-7 text-accent" strokeWidth={1.5} aria-hidden="true" />

      <div>
        <h3 className="font-serif text-2xl">{entry.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{entry.summary}</p>
      </div>

      <ul className="flex flex-col gap-2">
        {entry.scope.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-ink">
            <span className="text-accent" aria-hidden="true">
              ✓
            </span>
            {item}
          </li>
        ))}
      </ul>

      {entry.href ? (
        <Link
          href={entry.href}
          className="group inline-flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-accent-strong underline-offset-4 hover:underline"
        >
          {count} kriterin tamamı
          <ArrowRight
            size={13}
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}

      {/* Pushed to the bottom so cards in a row align on their price and button. */}
      <div className="mt-auto flex flex-col gap-4 border-t border-line pt-5">
        <PriceTag amount={entry.price} />
        <CartButton id={entry.id} />
      </div>
    </Card>
  );
}
