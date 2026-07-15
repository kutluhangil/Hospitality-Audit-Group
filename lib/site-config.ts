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
  { label: "Hakkımızda", href: "/hakkimizda" },
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
    { label: "Hakkımızda", href: "/hakkimizda" },
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
  "/surec",
  "/hakkimizda",
  "/iletisim",
  "/teklif",
  "/kvkk",
  "/gizlilik-politikasi",
] as const;
