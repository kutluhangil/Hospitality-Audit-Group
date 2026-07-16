"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

// Mount detection without an effect, mirroring lib/quote-cart.ts: the server and
// the hydration pass read `false`, every pass after it reads `true`. The theme is
// unknown until then, so rendering Sun or Moon early would be a hydration
// mismatch.
const subscribeToNothing = () => () => {};
const getMounted = () => true;
const getServerMounted = () => false;

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getMounted,
    getServerMounted,
  );
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      // Kept theme-independent so the label does not change under the user
      // mid-interaction, and so it is stable before mount.
      aria-label={t("toggle")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        "inline-flex h-11 w-11 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl2 border border-line",
        "text-ink transition-colors duration-150 hover:bg-bg-soft",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {mounted ? (
        isDark ? (
          <Sun size={16} aria-hidden="true" />
        ) : (
          <Moon size={16} aria-hidden="true" />
        )
      ) : (
        // Same footprint as the icons, so the header does not reflow on mount.
        <span className="block h-4 w-4" />
      )}
    </button>
  );
}
