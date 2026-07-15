import {
  PACKAGE_COVERS,
  PACKAGE_MODULE,
  VAT_RATE,
  priceOf,
  type CartItemId,
  type ModuleCode,
} from "@/lib/modules-data";

/**
 * Cart arithmetic, kept pure so it can be reasoned about and tested without a
 * browser. Money is the one thing on this site that must not be approximately
 * right.
 */

export type CartTotals = {
  /** Sum of list prices. Prices are VAT-inclusive, so this is the gross total. */
  total: number;
  /** Gross total less VAT. Derived, never stored. */
  net: number;
  vat: number;
};

/**
 * Prices are quoted VAT-inclusive, so the split is derived by dividing the
 * gross total once, at the end. Splitting each line and summing would let
 * per-line rounding drift into a total that does not match the list prices the
 * buyer just read.
 */
export function totalsFor(items: readonly CartItemId[]): CartTotals {
  const total = items.reduce((sum, id) => sum + priceOf(id), 0);
  const net = Math.round(total / (1 + VAT_RATE));
  return { total, net, vat: total - net };
}

/** Formats TL for display. Locale only moves the separators; the currency is always TL. */
export function formatPrice(amount: number, locale = "tr-TR"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Modules already covered by the package, when the package is in the cart. */
export function coveredByPackage(items: readonly CartItemId[]): readonly ModuleCode[] {
  return items.includes(PACKAGE_MODULE) ? PACKAGE_COVERS : [];
}

/** A module the package already covers must not be sold again alongside it. */
export function isRedundant(id: CartItemId, items: readonly CartItemId[]): boolean {
  return coveredByPackage(items).includes(id as ModuleCode);
}

export type PackageOffer = {
  /** The individual modules that would be swapped out. */
  replaces: readonly ModuleCode[];
  /** What those modules cost separately. */
  separateTotal: number;
  packageTotal: number;
  saving: number;
};

/**
 * The cart's only smart behaviour: when every module the package covers is
 * selected individually, point out that the package is cheaper. It suggests —
 * it never swaps on its own.
 */
export function packageOffer(items: readonly CartItemId[]): PackageOffer | null {
  if (items.includes(PACKAGE_MODULE)) return null;
  if (!PACKAGE_COVERS.every((code) => items.includes(code))) return null;

  const separateTotal = PACKAGE_COVERS.reduce((sum, code) => sum + priceOf(code), 0);
  const packageTotal = priceOf(PACKAGE_MODULE);
  const saving = separateTotal - packageTotal;

  // A package that costs more than its parts is a pricing bug, not an offer.
  if (saving <= 0) return null;

  return { replaces: PACKAGE_COVERS, separateTotal, packageTotal, saving };
}

/** Applies the offer: the covered modules leave, the package arrives, everything else stays. */
export function applyPackage(items: readonly CartItemId[]): CartItemId[] {
  const kept = items.filter((id) => !PACKAGE_COVERS.includes(id as ModuleCode));
  return kept.includes(PACKAGE_MODULE) ? kept : [...kept, PACKAGE_MODULE];
}
