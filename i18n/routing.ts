import { defineRouting } from "next-intl/routing";

/**
 * Routing contract for the two locales. Turkish is the source language; English
 * is a second surface over the same content, not a separate site.
 */

export const locales = ["tr", "en"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "tr";

/**
 * Internal pathname (the Turkish one, which is what the folders under
 * `app/[locale]` are actually named) → the URL each locale shows.
 *
 * Every entry keeps the same `{tr, en}` shape on purpose: scripts/check-links.mjs
 * reads this map with a regex rather than a transpiler, exactly as it already
 * reads `routes` from lib/site-config.ts.
 *
 * Three rules are encoded here:
 *
 * 1. Module pages are listed one by one instead of as `/moduller/[slug]`, because
 *    the slug itself is translated (`/en/modules/front-office`, not
 *    `/en/modules/on-buro`). The rewrite target stays the Turkish slug, so
 *    `generateStaticParams` and `lib/modules-data.ts` keep one set of slugs.
 * 2. Legal pages keep their Turkish slug in English. KVKK is the name of a
 *    Turkish statute — translating it would cost the search term and gain nothing.
 * 3. `/hizmetler/*` and `/odeme/sonuc` also keep the Turkish slug: the spec's
 *    translation table (6.2) does not name them, and minting an English URL that
 *    the spec never approved would be a decision made by accident.
 */
export const pathnames = {
  "/": { tr: "/", en: "/" },
  "/hizmetler/gizli-musteri-denetimi": {
    tr: "/hizmetler/gizli-musteri-denetimi",
    en: "/hizmetler/gizli-musteri-denetimi",
  },
  "/hizmetler/personel-egitimi": {
    tr: "/hizmetler/personel-egitimi",
    en: "/hizmetler/personel-egitimi",
  },
  "/moduller": { tr: "/moduller", en: "/modules" },
  "/moduller/on-buro": { tr: "/moduller/on-buro", en: "/modules/front-office" },
  "/moduller/yiyecek-icecek": { tr: "/moduller/yiyecek-icecek", en: "/modules/food-beverage" },
  "/moduller/wellness-rekreasyon": {
    tr: "/moduller/wellness-rekreasyon",
    en: "/modules/wellness-recreation",
  },
  "/moduller/kat-hizmetleri": { tr: "/moduller/kat-hizmetleri", en: "/modules/housekeeping" },
  "/moduller/360-tam-denetim": { tr: "/moduller/360-tam-denetim", en: "/modules/360-full-audit" },
  "/surec": { tr: "/surec", en: "/process" },
  "/biz-kimiz": { tr: "/biz-kimiz", en: "/about-us" },
  "/iletisim": { tr: "/iletisim", en: "/contact" },
  "/teklif": { tr: "/teklif", en: "/quote" },
  "/odeme/sonuc": { tr: "/odeme/sonuc", en: "/odeme/sonuc" },
  "/kvkk": { tr: "/kvkk", en: "/kvkk" },
  "/gizlilik-politikasi": { tr: "/gizlilik-politikasi", en: "/gizlilik-politikasi" },
  "/mesafeli-satis-sozlesmesi": {
    tr: "/mesafeli-satis-sozlesmesi",
    en: "/mesafeli-satis-sozlesmesi",
  },
  "/on-bilgilendirme": { tr: "/on-bilgilendirme", en: "/on-bilgilendirme" },
  "/iptal-iade": { tr: "/iptal-iade", en: "/iptal-iade" },
} as const;

/**
 * Every internal route the app can link to. Link hrefs are typed against this,
 * so a typo in an href is a build error rather than a 404 someone finds later.
 */
export type AppPathname = keyof typeof pathnames;

/** What every page under app/[locale] receives. Next 16 resolves params async. */
export type LocaleParams = { locale: AppLocale };

export const routing = defineRouting({
  locales,
  defaultLocale,
  // The prefix is always visible, including for Turkish: /tr and /en are then the
  // only two shapes a crawler ever sees, and neither one is a redirect of the other.
  localePrefix: "always",
  pathnames,
});
