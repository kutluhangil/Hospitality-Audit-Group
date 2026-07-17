"use client";

import { useReducedMotion } from "framer-motion";
import type { AnimationItem } from "lottie-web";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

/**
 * The animated house mark: the column capital with the branching audit spark,
 * the same figure the logo carries, brought to life. It takes the terminal's old
 * slot as the hero's single signature motion — so it stays the one looping
 * element on the page, and it holds still under reduced-motion.
 *
 * The 2160² Lottie is fetched by `path` rather than bundled, so its ~785 kB stay
 * out of the JS payload and load as a cacheable static asset. lottie-web reaches
 * for `document` on import, so both the library and the load happen client-side.
 */
export function HeroMark() {
  const t = useTranslations("home.heroMark");
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    let anim: AnimationItem | undefined;
    let cancelled = false;

    import("lottie-web").then((mod) => {
      if (cancelled || !containerRef.current) {
        return;
      }

      anim = mod.default.loadAnimation({
        container: node,
        renderer: "svg",
        loop: !reduceMotion,
        autoplay: !reduceMotion,
        path: "/animations/hag-mark.json",
      });

      if (reduceMotion) {
        // Hold on a frame where the spark is fully open, not mid-collapse.
        anim.addEventListener("DOMLoaded", () => anim?.goToAndStop(40, true));
      }
    });

    return () => {
      cancelled = true;
      anim?.destroy();
    };
  }, [reduceMotion]);

  return (
    <div
      role="img"
      aria-label={t("srLabel")}
      className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl2 border border-terminal-ink/10 bg-terminal-bg p-6 shadow-sm sm:p-10"
    >
      <div
        ref={containerRef}
        aria-hidden="true"
        className="aspect-square w-full max-w-xs"
      />
    </div>
  );
}
