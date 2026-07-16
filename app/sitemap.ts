import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { routes, siteConfig } from "@/lib/site-config";

/** Absolute URL of one internal route in one locale, e.g. /en/modules/front-office. */
function urlFor(href: (typeof routes)[number], locale: (typeof routing.locales)[number]) {
  return new URL(getPathname({ href, locale }), siteConfig.url).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Every entry shares one timestamp: the whole site ships as a single build.
  const lastModified = new Date();

  return routes.flatMap((route): MetadataRoute.Sitemap =>
    routing.locales.map((locale) => ({
      url: urlFor(route, locale),
      lastModified,
      changeFrequency: "monthly",
      priority: route === "/" ? 1 : 0.7,
      alternates: {
        // Each locale's entry lists every locale, itself included — that is what
        // the spec means by hreflang on every page. x-default points at Turkish:
        // it is the source language, and the audience with no language signal is
        // overwhelmingly Turkish.
        languages: {
          ...Object.fromEntries(
            routing.locales.map((alternate) => [alternate, urlFor(route, alternate)]),
          ),
          "x-default": urlFor(route, routing.defaultLocale),
        },
      },
    })),
  );
}
