import type { AppLocale, AppPathname } from "@/i18n/routing";

/**
 * Single source of truth for navigation, contact details and metadata
 * defaults. Pages import from here rather than repeating strings.
 *
 * Hrefs here are the internal (Turkish) pathnames. The locale-aware Link in
 * i18n/navigation.ts turns them into whatever the active locale shows, so this
 * file stays free of locale knowledge.
 */

/**
 * The locale-independent half of the site's identity.
 *
 * The brand name is not translated (it is the company's registered name in
 * every market), and an email address and a phone number are the same digits
 * whatever the reader speaks. Everything that *is* language-dependent — the
 * tagline, the description, the opening hours — lives under the `site` namespace
 * in messages/*.json instead, so that nothing here has to know about locales.
 */
export const siteConfig = {
  name: "Hospitality Audit Group",
  shortName: "HAG",
  url: "https://hospitalityauditgroup.com",
  contact: {
    email: "corporate@hospitalityauditgroup.com",
    phone: "+90 (212) 000 00 00",
    phoneHref: "+902120000000",
  },
} as const;

/** What each locale calls itself in an `og:locale` tag. */
export const ogLocales = {
  tr: "tr_TR",
  en: "en_US",
} as const satisfies Record<AppLocale, string>;

/**
 * A destination. `labelKey` names an entry under the `nav` namespace in
 * messages/*.json rather than carrying the text itself — the label is the one
 * part of a link that differs per locale, and keeping it here would pin the
 * navigation to Turkish.
 */
export type NavLink = {
  labelKey: string;
  href: AppPathname;
  children?: readonly NavLink[];
};

export const mainNav: readonly NavLink[] = [
  {
    labelKey: "services",
    href: "/hizmetler/gizli-musteri-denetimi",
    children: [
      {
        labelKey: "mysteryShopping",
        href: "/hizmetler/gizli-musteri-denetimi",
      },
      { labelKey: "staffTraining", href: "/hizmetler/personel-egitimi" },
    ],
  },
  { labelKey: "modules", href: "/moduller" },
  { labelKey: "process", href: "/surec" },
  { labelKey: "aboutUs", href: "/biz-kimiz" },
  { labelKey: "contact", href: "/iletisim" },
] as const;

export const footerNav = {
  hizmetler: [
    { labelKey: "mysteryShopping", href: "/hizmetler/gizli-musteri-denetimi" },
    { labelKey: "staffTraining", href: "/hizmetler/personel-egitimi" },
    { labelKey: "modules", href: "/moduller" },
  ],
  kurumsal: [
    { labelKey: "process", href: "/surec" },
    { labelKey: "aboutUs", href: "/biz-kimiz" },
  ],
  /**
   * Contract texts. Separated from `kurumsal` because these are not marketing
   * pages: distance-selling rules require them to be reachable from every page,
   * so the footer is the one place that guarantees it.
   */
  hukuki: [
    { labelKey: "distanceSales", href: "/mesafeli-satis-sozlesmesi" },
    { labelKey: "preInfo", href: "/on-bilgilendirme" },
    { labelKey: "cancellation", href: "/iptal-iade" },
    { labelKey: "kvkk", href: "/kvkk" },
    { labelKey: "privacy", href: "/gizlilik-politikasi" },
  ],
} as const satisfies Record<string, readonly NavLink[]>;

/**
 * Every static route, once — not once per locale. Consumed by sitemap.ts and the
 * link checker, both of which expand this list across the locales through the
 * pathnames map in i18n/routing.ts. An entry here that has no page is a live
 * 404 — add the route when the page lands, not before.
 *
 * `satisfies` rather than an annotation: the literal types are what makes the
 * expansion in sitemap.ts type-check, and membership of AppPathname is what
 * guarantees every route has a URL in both locales.
 */
export const routes = [
  "/",
  "/hizmetler/gizli-musteri-denetimi",
  "/hizmetler/personel-egitimi",
  "/moduller",
  "/moduller/on-buro",
  "/moduller/yiyecek-icecek",
  "/moduller/wellness-rekreasyon",
  "/moduller/kat-hizmetleri",
  "/moduller/360-tam-denetim",
  "/surec",
  "/biz-kimiz",
  "/iletisim",
  "/teklif",
  "/kvkk",
  "/gizlilik-politikasi",
  "/mesafeli-satis-sozlesmesi",
  "/on-bilgilendirme",
  "/iptal-iade",
] as const satisfies readonly AppPathname[];

/**
 * `/odeme/sonuc` is deliberately absent.
 *
 * It is not a page in the sense this list means: it renders the outcome of one
 * specific payment, carried in a signed `?d=` token, and calls notFound() when
 * the card path is disabled. Listing it would put a permanent 404 in the sitemap
 * and the link checker. It is also `robots: noindex` for the same reason — there
 * is nothing there for anyone who did not just come back from 3-D Secure.
 */
