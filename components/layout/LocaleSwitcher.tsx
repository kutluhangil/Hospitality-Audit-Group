"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale, type AppPathname } from "@/i18n/routing";

/**
 * TR / EN, as text. No flag icons: a language is not a country, and a Union Jack
 * would stand for the wrong thing entirely for the reader this serves — a
 * foreign owner or chain operator whose hotel is in Turkey.
 *
 * Each entry is a real Link rather than a router push, so the other locale's URL
 * is in the markup: a crawler can follow it, and it opens in a new tab like any
 * other link. `usePathname` from i18n/navigation returns the *internal* pathname
 * (/moduller even when the URL reads /en/modules), which is exactly what Link
 * wants — so the reader lands on the same page in the other language rather than
 * being dropped on the home page.
 *
 * Deliberately no `hreflang` here: Google reads that from <head>, an HTTP header
 * or the sitemap, never off a body link. i18n/metadata.ts carries the real
 * signal. An attribute here would look like SEO and do nothing.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const active = useLocale() as AppLocale;
  const t = useTranslations("localeSwitcher");
  // Cast: the catch-all route can produce a pathname that is not in `pathnames`.
  // On a 404 the switcher still renders, and the other locale's 404 is the
  // honest destination for it.
  const pathname = usePathname() as AppPathname;

  return (
    <nav aria-label={t("label")} className={className}>
      <ul className="flex items-center">
        {routing.locales.map((locale, index) => {
          const current = locale === active;

          return (
            <li key={locale} className="flex items-center">
              {index > 0 && (
                <span aria-hidden="true" className="px-1 text-line-strong">
                  /
                </span>
              )}
              <Link
                href={pathname}
                locale={locale}
                // The active one is the current page, not a destination. Marking
                // it tells a screen reader why the link goes nowhere new.
                aria-current={current ? "true" : undefined}
                className={[
                  // 44px tall on mobile to clear the touch-target minimum, 36px on sm+
                  "inline-flex h-11 min-w-11 sm:h-9 sm:min-w-9 items-center justify-center rounded-xl2 px-1",
                  "font-mono text-xs tracking-wide transition-colors duration-150",
                  current
                    ? "text-accent-strong"
                    : "text-ink-muted hover:text-ink",
                ].join(" ")}
              >
                <span className="sr-only">{t(`${locale}Full`)}</span>
                <span aria-hidden="true">{t(locale)}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
