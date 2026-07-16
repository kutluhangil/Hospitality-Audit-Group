"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { useFormatPrice } from "@/lib/use-format-price";
import { totalsFor } from "@/lib/cart-math";
import { useQuoteCart } from "@/lib/quote-cart";

/**
 * Mobile-only sticky bottom bar.
 *
 * Shown on sm and below when at least one item is in the cart. It gives the
 * user a persistent action target without requiring them to scroll past the
 * module grid to find the selection summary at the bottom of the page.
 * On md+ the full ModulesSelectionSummary in the page body is sufficient.
 */
export function MobileCartBar() {
  const { selected, hydrated } = useQuoteCart();
  const fmt = useFormatPrice();
  const t = useTranslations("modulesPage.mobileCartBar");

  // Hidden until hydrated to avoid a flash of wrong state.
  if (!hydrated || selected.length === 0) return null;

  const { total } = totalsFor(selected);
  const count = selected.length;

  return (
    // lg:hidden keeps it off desktop where the page-body summary is visible.
    <div
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden border-t border-line bg-bg/95 backdrop-blur-md px-4 py-3 safe-area-inset-bottom"
      role="complementary"
      aria-label={t("label")}
    >
      <div className="mx-auto flex max-w-content items-center justify-between gap-3">
        {/* Item count + gross total */}
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
            {t("itemCount", { count })}
          </p>
          <p className="mt-0.5 font-mono text-base text-ink">
            {fmt(total)}
          </p>
        </div>

        {/* Touch target ≥ 44px per Apple HIG */}
        <Button href="/teklif" variant="accent" size="md" className="shrink-0">
          {t("cta")}
        </Button>
      </div>
    </div>
  );
}
