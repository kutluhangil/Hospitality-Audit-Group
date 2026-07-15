import { formatPrice } from "@/lib/cart-math";
import { PRICING_NOTE } from "@/lib/modules-data";

/**
 * Prices are listed VAT-inclusive, so the note says so rather than leaving a
 * hotel's finance desk to work out which number they are looking at.
 */
export function PriceTag({
  amount,
  size = "md",
  className,
}: {
  amount: number;
  size?: "md" | "lg";
  className?: string;
}) {
  return (
    <p className={className}>
      <span
        className={[
          "font-mono tabular-nums text-ink",
          size === "lg" ? "text-4xl md:text-5xl" : "text-2xl",
        ].join(" ")}
      >
        {formatPrice(amount)}
      </span>
      <span className="mt-1.5 block font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink-muted">
        {PRICING_NOTE}
      </span>
    </p>
  );
}
