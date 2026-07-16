import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { CartButton } from "@/components/modules/CartButton";
import { PriceTag } from "@/components/modules/PriceTag";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { criteriaCount } from "@/lib/audit-criteria";
import {
  moduleIcons,
  type AuditModule,
  type CartItemId,
} from "@/lib/modules-data";

/**
 * Structure only. The title, the summary and the scope list are read from the
 * `modules` namespace keyed by `id`, so the card renders in whatever language
 * the page is in without the catalogue knowing that locales exist.
 */
type CatalogueEntry = {
  id: CartItemId;
  icon: keyof typeof moduleIcons;
  price: number;
  /** Absent for the training service, which has no letter. */
  code?: string;
  /** Absent for the training service, which has no field guide to link to. */
  href?: AppPathname;
  featured?: boolean;
};

export function toCatalogueEntry(module: AuditModule): CatalogueEntry {
  return {
    id: module.code,
    code: module.code,
    icon: module.icon,
    price: module.price,
    href: `/moduller/${module.slug}`,
    featured: module.featured,
  };
}

export function ModuleCard({ entry }: { entry: CatalogueEntry }) {
  const t = useTranslations("catalogue");
  const tModules = useTranslations("modules");
  const Icon = moduleIcons[entry.icon];
  const count = entry.code ? criteriaCount(entry.code as never) : 0;
  const scope = tModules.raw(`${entry.id}.scope`) as readonly string[];

  return (
    <Card
      as="article"
      tone={entry.featured ? "accent" : "surface"}
      className="flex h-full flex-col gap-5"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          {entry.code ? `${t("moduleLabel")} ${entry.code}` : t("extraLabel")}
        </span>
        {entry.featured ? (
          <span className="shrink-0 rounded-xl2 border border-accent px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent-strong">
            {t("featured")}
          </span>
        ) : null}
      </div>

      {/*
        The icon carries the card whether or not artwork exists — the set is
        incomplete, and a grid where one card is illustrated and the rest are not
        would read as broken rather than as varied.
      */}
      <Icon
        className="size-7 text-accent"
        strokeWidth={1.5}
        aria-hidden="true"
      />

      <div>
        <h3 className="font-serif text-2xl">{tModules(`${entry.id}.title`)}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {tModules(`${entry.id}.summary`)}
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {scope.map((item) => (
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
          {t("allCriteria", { count })}
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
