"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { PACKAGE_MODULE } from "@/lib/modules-data";
import { useQuoteCart } from "@/lib/quote-cart";
import { useFormatPrice } from "@/lib/use-format-price";

/**
 * The cart's only smart behaviour: once every module the 360° package covers is
 * selected individually, say so. It suggests and never swaps on its own —
 * silently rewriting someone's basket is not helpfulness.
 */
export function PackageOfferBanner({ className }: { className?: string }) {
  const t = useTranslations("packageOffer");
  const tModules = useTranslations("modules");
  const formatPrice = useFormatPrice();
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
              <Sparkles
                size={18}
                className="mt-0.5 shrink-0 text-accent"
                aria-hidden="true"
              />
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent-strong">
                  {t("eyebrow", {
                    package: tModules(`${PACKAGE_MODULE}.title`),
                  })}
                </p>
                {/* Rich text rather than concatenation: which figure the sentence
                    leads with, and where the dash falls, is the translator's call. */}
                <p className="mt-1.5 text-sm leading-relaxed text-ink md:text-base">
                  {t.rich("body", {
                    count: offer.replaces.length,
                    separate: formatPrice(offer.separateTotal),
                    packageTotal: formatPrice(offer.packageTotal),
                    saving: formatPrice(offer.saving),
                    old: (chunks) => (
                      <span className="whitespace-nowrap text-ink-muted line-through">
                        {chunks}
                      </span>
                    ),
                    new: (chunks) => (
                      <span className="whitespace-nowrap font-medium">
                        {chunks}
                      </span>
                    ),
                    save: (chunks) => (
                      <strong className="font-medium">{chunks}</strong>
                    ),
                  })}
                </p>
              </div>
            </div>
            <Button className="shrink-0" onClick={switchToPackage}>
              {t("cta")}
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
