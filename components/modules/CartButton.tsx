"use client";

import { Button } from "@/components/ui/Button";
import { isRedundant } from "@/lib/cart-math";
import { PACKAGE_MODULE, titleOf, type CartItemId } from "@/lib/modules-data";
import { useQuoteCart } from "@/lib/quote-cart";

/**
 * The one place the cart's add/remove affordance is decided, because it has
 * three states that are easy to get subtly wrong in each copy:
 *
 *   not hydrated  — the server rendered an empty cart, so selection is unknown.
 *                   Render the neutral label, disabled, or the first client
 *                   paint contradicts the server HTML.
 *   redundant     — the 360° package already covers this module. Selling it
 *                   twice is wrong, so the control is disabled and says why.
 *   selected      — toggles back off.
 */
export function CartButton({
  id,
  size = "md",
  className,
}: {
  id: CartItemId;
  size?: "md" | "lg";
  className?: string;
}) {
  const { has, toggle, hydrated, selected } = useQuoteCart();

  const covered = hydrated && isRedundant(id, selected);
  const inCart = hydrated && has(id);
  const title = titleOf(id);

  if (covered) {
    return (
      <Button
        variant="ghost"
        size={size}
        className={className}
        disabled
        aria-label={`${title}, ${titleOf(PACKAGE_MODULE)} paketine dahil`}
      >
        {titleOf(PACKAGE_MODULE)} paketine dahil
      </Button>
    );
  }

  return (
    <Button
      variant={inCart ? "ghost" : "accent"}
      size={size}
      className={className}
      onClick={() => toggle(id)}
      disabled={!hydrated}
      aria-pressed={inCart}
      aria-label={inCart ? `${title} modülünü sepetten çıkar` : `${title} modülünü sepete ekle`}
    >
      {inCart ? "Sepette ✓" : "Sepete Ekle"}
    </Button>
  );
}
