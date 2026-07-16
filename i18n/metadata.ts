import { getPathname } from "@/i18n/navigation";
import { routing, type AppLocale, type AppPathname } from "@/i18n/routing";

/**
 * The `alternates` block for one route: its own canonical, plus every locale the
 * same page exists in.
 *
 * Every page needs this, and each one would otherwise rebuild the same map by
 * hand — which is how one page ends up pointing its English canonical at the
 * Turkish URL and nobody notices for a year.
 *
 * Google only reads hreflang from three places: <head>, an HTTP header, or the
 * sitemap. It does *not* read the attribute off a link in the body, so the
 * language switcher cannot carry this signal however sensible that would look —
 * hence the tags here and the matching set in app/sitemap.ts.
 *
 * Paths stay relative; `metadataBase` in the locale layout makes them absolute.
 */
export function alternatesFor(href: AppPathname, locale: AppLocale) {
  return {
    canonical: getPathname({ href, locale }),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((alternate) => [alternate, getPathname({ href, locale: alternate })]),
      ),
      // Turkish is the source language, and a reader arriving with no language
      // signal is overwhelmingly Turkish.
      "x-default": getPathname({ href, locale: routing.defaultLocale }),
    },
  };
}
