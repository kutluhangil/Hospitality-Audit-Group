/**
 * Single source of truth for navigation, contact details and metadata
 * defaults. Pages import from here rather than repeating strings.
 */

export const siteConfig = {
  name: "Hospitality Audit Group",
  shortName: "HAG",
  tagline: "Marka Güvencesi ve Operasyonel Kaldıraç.",
  description:
    "Otellere gizli müşteri ziyaretiyle denetim ve personel eğitimi hizmeti sunan, modüler ve ölçülebilir bir denetim mimarisi.",
  url: "https://hospitalityauditgroup.com",
  locale: "tr_TR",
  contact: {
    email: "corporate@hospitalityauditgroup.com",
    phone: "+90 (212) 000 00 00",
    phoneHref: "+902120000000",
    hours: "Hafta içi 09:00 – 18:00",
  },
} as const;

export type NavLink = {
  label: string;
  href: string;
  children?: readonly NavLink[];
};

export const mainNav: readonly NavLink[] = [
  {
    label: "Hizmetler",
    href: "/hizmetler/gizli-musteri-denetimi",
    children: [
      { label: "Gizli Müşteri Denetimi", href: "/hizmetler/gizli-musteri-denetimi" },
      { label: "Personel Eğitimi", href: "/hizmetler/personel-egitimi" },
    ],
  },
  { label: "Modüller", href: "/moduller" },
  { label: "Süreç", href: "/surec" },
  { label: "Biz Kimiz", href: "/biz-kimiz" },
  { label: "İletişim", href: "/iletisim" },
] as const;

export const footerNav = {
  hizmetler: [
    { label: "Gizli Müşteri Denetimi", href: "/hizmetler/gizli-musteri-denetimi" },
    { label: "Personel Eğitimi", href: "/hizmetler/personel-egitimi" },
    { label: "Modüller", href: "/moduller" },
  ],
  kurumsal: [
    { label: "Süreç", href: "/surec" },
    { label: "Biz Kimiz", href: "/biz-kimiz" },
  ],
  /**
   * Contract texts. Separated from `kurumsal` because these are not marketing
   * pages: distance-selling rules require them to be reachable from every page,
   * so the footer is the one place that guarantees it.
   */
  hukuki: [
    { label: "Mesafeli Satış Sözleşmesi", href: "/mesafeli-satis-sozlesmesi" },
    { label: "Ön Bilgilendirme Formu", href: "/on-bilgilendirme" },
    { label: "İptal & İade Politikası", href: "/iptal-iade" },
    { label: "KVKK Aydınlatma Metni", href: "/kvkk" },
    { label: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
  ],
} as const;

/**
 * Every static route. Consumed by sitemap.ts and the link checker, so an entry
 * here that has no page is a live 404 — add the route when the page lands, not
 * before.
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
] as const;

/**
 * `/odeme/sonuc` is deliberately absent.
 *
 * It is not a page in the sense this list means: it renders the outcome of one
 * specific payment, carried in a signed `?d=` token, and calls notFound() when
 * the card path is disabled. Listing it would put a permanent 404 in the sitemap
 * and the link checker. It is also `robots: noindex` for the same reason — there
 * is nothing there for anyone who did not just come back from 3-D Secure.
 */
