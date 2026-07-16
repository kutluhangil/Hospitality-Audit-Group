"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Link } from "@/i18n/navigation";
import { useQuoteCart } from "@/lib/quote-cart";

const badgeClasses =
  "inline-flex h-9 shrink-0 items-center rounded-xl2 bg-accent-strong px-3 text-sm font-medium text-accent-strong-ink transition-colors duration-150 hover:bg-accent-strong-hover";

export function QuoteCartBadge() {
  const { selected, hydrated } = useQuoteCart();
  const reduceMotion = useReducedMotion();

  // Until the cart has been read from localStorage the count is unknown; showing
  // a placeholder would contradict the server HTML on first paint.
  if (!hydrated || selected.length === 0) return null;

  const label = `Teklif (${selected.length})`;

  return (
    <Link href="/teklif" className={badgeClasses}>
      {reduceMotion ? (
        label
      ) : (
        // Re-keying on the count remounts the span, replaying the pop each time a
        // module is added or removed.
        <motion.span
          key={selected.length}
          initial={{ scale: 0.82 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {label}
        </motion.span>
      )}
    </Link>
  );
}
