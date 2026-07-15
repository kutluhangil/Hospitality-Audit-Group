"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/cart-math";
import { PACKAGE_MODULE, titleOf } from "@/lib/modules-data";
import { useQuoteCart } from "@/lib/quote-cart";

/**
 * The cart's only smart behaviour: once every module the 360° package covers is
 * selected individually, say so. It suggests and never swaps on its own —
 * silently rewriting someone's basket is not helpfulness.
 */
export function PackageOfferBanner({ className }: { className?: string }) {
  const { offer, switchToPackage, hydrated } = useQuoteCart();
  const reduceMotion = useReducedMotion();

  // Selection is unknown until localStorage is read; rendering the banner before
  // that would make the first client paint contradict the server HTML.
  const visible = hydrated && offer !== null;

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          key="package-offer"
          className={className}
          initial={reduceMotion ? false : { opacity: 0, height: 0 }}
          animate={reduceMotion ? {} : { opacity: 1, height: "auto" }}
          exit={reduceMotion ? {} : { opacity: 0, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div
            role="status"
            className="flex flex-col gap-4 rounded-xl2 border border-accent bg-surface p-5 sm:flex-row sm:items-center sm:justify-between md:p-6"
          >
            <div className="flex items-start gap-3">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent-strong">
                  {titleOf(PACKAGE_MODULE)} paketi
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink md:text-base">
                  Seçtiğiniz {offer.replaces.length} modülün tamamı bu paketin kapsamında.{" "}
                  <span className="whitespace-nowrap text-ink-muted line-through">
                    {formatPrice(offer.separateTotal)}
                  </span>{" "}
                  yerine{" "}
                  <span className="whitespace-nowrap font-medium">
                    {formatPrice(offer.packageTotal)}
                  </span>{" "}
                  — <strong className="font-medium">{formatPrice(offer.saving)} tasarruf.</strong>
                </p>
              </div>
            </div>
            <Button className="shrink-0" onClick={switchToPackage}>
              Pakete Geç
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
