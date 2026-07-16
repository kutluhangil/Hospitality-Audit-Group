"use client";

import { useTranslations } from "next-intl";

import {
  getModule,
  priceOf,
  VAT_RATE,
  type CartItemId,
} from "@/lib/modules-data";
import { useQuoteCart } from "@/lib/quote-cart";
import { useFormatPrice } from "@/lib/use-format-price";

export function CartLines({ removable = true }: { removable?: boolean }) {
  const t = useTranslations("cart");
  const tCatalogue = useTranslations("catalogue");
  const tModules = useTranslations("modules");
  const formatPrice = useFormatPrice();
  const { selected, remove } = useQuoteCart();

  /** The training service has no letter; the modules do. */
  function labelFor(id: CartItemId): string {
    const entry = getModule(id);
    return entry
      ? `${tCatalogue("moduleLabel")} ${entry.code}`
      : tCatalogue("extraLabel");
  }

  return (
    <ul className="flex flex-col gap-2">
      {selected.map((id) => {
        const title = tModules(`${id}.title`);

        return (
          <li
            key={id}
            className="flex items-center justify-between gap-4 rounded-xl2 border border-line bg-surface px-4 py-3"
          >
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
                {labelFor(id)}
              </span>
              <span className="truncate text-sm">{title}</span>
            </span>
            <span className="flex shrink-0 items-center gap-4">
              <span className="font-mono text-sm tabular-nums text-ink-muted">
                {formatPrice(priceOf(id))}
              </span>
              {removable ? (
                <button
                  type="button"
                  onClick={() => remove(id)}
                  className="text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
                  aria-label={t("removeLineAria", { title })}
                >
                  {t("remove")}
                </button>
              ) : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Prices are listed VAT-inclusive, so the net line is derived from the gross
 * total rather than stored. Showing the split anyway: a hotel's finance desk
 * needs the VAT figure, and hiding it invites a phone call.
 */
export function CartTotals() {
  const t = useTranslations("cart");
  const formatPrice = useFormatPrice();
  const { totals } = useQuoteCart();

  return (
    <dl className="flex flex-col gap-2 border-t border-line pt-4 font-mono text-sm">
      <div className="flex justify-between text-ink-muted">
        <dt>{t("subtotal")}</dt>
        <dd className="tabular-nums">{formatPrice(totals.net)}</dd>
      </div>
      <div className="flex justify-between text-ink-muted">
        {/* The rate comes from the same constant the arithmetic uses, so the
            label cannot claim 20% while the total was worked out at something else. */}
        <dt>{t("vat", { rate: VAT_RATE * 100 })}</dt>
        <dd className="tabular-nums">{formatPrice(totals.vat)}</dd>
      </div>
      <div className="mt-1 flex justify-between border-t border-line pt-3 text-base text-ink">
        <dt className="uppercase tracking-[0.12em]">{t("total")}</dt>
        <dd className="tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
