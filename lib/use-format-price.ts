import { useLocale } from "next-intl";

import { formatPrice } from "@/lib/cart-math";

/**
 * `formatPrice` bound to the reader's locale.
 *
 * Only the separators move; the currency is always TRY, because the price is
 * always TRY. Turkish reads "₺15.000"; English reads "TRY 15,000" — the code
 * spelled out rather than the sign, which is what Intl picks and the right call
 * for a reader who should not have to guess which lira they are looking at.
 *
 * Components call this rather than `formatPrice` directly: the raw function
 * defaults to tr-TR, so a component that forgets the locale silently prints
 * Turkish separators on an English page. This makes the locale impossible to
 * leave out.
 *
 * No "use client" here on purpose — next-intl's useLocale resolves in server
 * components too, so a server-rendered price tag can use this without dragging
 * its caller across the client boundary.
 */
export function useFormatPrice(): (amount: number) => string {
  const locale = useLocale();
  return (amount: number) => formatPrice(amount, locale);
}
