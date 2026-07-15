"use client";

import { formatPrice } from "@/lib/cart-math";
import { getModule, priceOf, titleOf, type CartItemId } from "@/lib/modules-data";
import { useQuoteCart } from "@/lib/quote-cart";

/** The training service has no letter; the modules do. */
function labelFor(id: CartItemId): string {
  const entry = getModule(id);
  return entry ? `MODÜL ${entry.code}` : "EK HİZMET";
}

export function CartLines({ removable = true }: { removable?: boolean }) {
  const { selected, remove } = useQuoteCart();

  return (
    <ul className="flex flex-col gap-2">
      {selected.map((id) => (
        <li
          key={id}
          className="flex items-center justify-between gap-4 rounded-xl2 border border-line bg-surface px-4 py-3"
        >
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
              {labelFor(id)}
            </span>
            <span className="truncate text-sm">{titleOf(id)}</span>
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
                aria-label={`${titleOf(id)} seçimden çıkar`}
              >
                Çıkar
              </button>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Prices are listed VAT-inclusive, so the net line is derived from the gross
 * total rather than stored. Showing the split anyway: a hotel's finance desk
 * needs the VAT figure, and hiding it invites a phone call.
 */
export function CartTotals() {
  const { totals } = useQuoteCart();

  return (
    <dl className="flex flex-col gap-2 border-t border-line pt-4 font-mono text-sm">
      <div className="flex justify-between text-ink-muted">
        <dt>Ara toplam (KDV hariç)</dt>
        <dd className="tabular-nums">{formatPrice(totals.net)}</dd>
      </div>
      <div className="flex justify-between text-ink-muted">
        <dt>KDV %20</dt>
        <dd className="tabular-nums">{formatPrice(totals.vat)}</dd>
      </div>
      <div className="mt-1 flex justify-between border-t border-line pt-3 text-base text-ink">
        <dt className="uppercase tracking-[0.12em]">Genel toplam</dt>
        <dd className="tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
