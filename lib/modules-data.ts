import {
  ConciergeBell,
  UtensilsCrossed,
  Waves,
  Radar,
  BedDouble,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

/**
 * Module lettering follows the field guides, not the original brief.
 *
 * The guides are internally cross-referenced — D.2.3 reads "Kat Hizmetleri
 * (Modül E)" and D's scope line reads "Ön Büro, F&B, Wellness, HK" — so E is
 * Housekeeping and 360° covers A+B+C+E. Personel Eğitimi has no letter and no
 * guide: it is training, not an audit, and it feeds off D.4.1 (TNA).
 */
export type ModuleCode = "A" | "B" | "C" | "D" | "E";

/** Everything the cart can hold: the five audit modules plus the training service. */
export type CartItemId = ModuleCode | "EGITIM";

/**
 * The slug is a closed set rather than a string: `/moduller/${slug}` has to be
 * assignable to a known route in i18n/routing.ts, and only literals can be
 * checked against it. A new module means a new entry in both places.
 */
export type ModuleSlug =
  | "on-buro"
  | "yiyecek-icecek"
  | "wellness-rekreasyon"
  | "kat-hizmetleri"
  | "360-tam-denetim";

/**
 * Structure only. The title, the summary and the scope list are copy, and copy
 * lives under the `modules` namespace in messages/*.json keyed by `code` — so a
 * module reads as "Front Office" under /en without this file knowing that
 * locales exist. lib/module-records.ts is the exception, and says why.
 */
export type AuditModule = {
  code: ModuleCode;
  slug: ModuleSlug;
  icon: keyof typeof moduleIcons;
  /** TL, VAT included. Single source of truth — no component may hardcode a price. */
  price: number;
  featured?: boolean;
  /** Set on D: the modules its scope already covers. */
  includes?: readonly ModuleCode[];
};

export const modules: readonly AuditModule[] = [
  {
    code: "A",
    slug: "on-buro",
    icon: "ConciergeBell",
    price: 15_000,
  },
  {
    code: "B",
    slug: "yiyecek-icecek",
    icon: "UtensilsCrossed",
    price: 15_000,
  },
  {
    code: "C",
    slug: "wellness-rekreasyon",
    icon: "Waves",
    price: 15_000,
  },
  {
    code: "E",
    slug: "kat-hizmetleri",
    icon: "BedDouble",
    price: 15_000,
  },
  {
    code: "D",
    slug: "360-tam-denetim",
    icon: "Radar",
    price: 50_000,
    featured: true,
    includes: ["A", "B", "C", "E"],
  },
] as const;

/**
 * Not a module: no letter, no field guide. It is the training service the audit
 * feeds into, and it is bought separately — including alongside D.
 */
export const trainingService = {
  id: "EGITIM" as const,
  slug: "personel-egitimi",
  icon: "GraduationCap",
  price: 15_000,
} as const;

/** Kept apart from the data so the module list stays serialisable. */
export const moduleIcons = {
  ConciergeBell,
  UtensilsCrossed,
  Waves,
  Radar,
  BedDouble,
  GraduationCap,
} satisfies Record<string, LucideIcon>;

/** Display order: the four single modules, then the package, then training. */
export const CATALOGUE_ORDER: readonly CartItemId[] = [
  "A",
  "B",
  "C",
  "E",
  "D",
  "EGITIM",
] as const;

export function getModule(code: string): AuditModule | undefined {
  return modules.find((entry) => entry.code === code);
}

export function priceOf(id: CartItemId): number {
  if (id === "EGITIM") return trainingService.price;
  const entry = getModule(id);
  if (!entry) {
    throw new Error(
      `Unknown cart item: ${id}. Expected one of ${CATALOGUE_ORDER.join(", ")}.`,
    );
  }
  return entry.price;
}

/** The package module and the modules it absorbs. Drives the cart's only smart behaviour. */
export const PACKAGE_MODULE: ModuleCode = "D";
export const PACKAGE_COVERS: readonly ModuleCode[] = [
  "A",
  "B",
  "C",
  "E",
] as const;

export const VAT_RATE = 0.2;
