import {
  ConciergeBell,
  UtensilsCrossed,
  Waves,
  Radar,
  BedDouble,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

/**
 * Module lettering follows the field guides, not the original brief.
 *
 * The guides are internally cross-referenced — D.2.3 reads "Kat Hizmetleri
 * (Modül E)" and D's scope line reads "Ön Büro, F&B, Wellness, HK" — so E is
 * Housekeeping and 360° covers A+B+C+E. Personel Eğitimi has no letter and no
 * guide: it is training, not an audit, and it feeds off D.4.1 (TNA).
 */
export type ModuleCode = "A" | "B" | "C" | "D" | "E";

/** Everything the cart can hold: the five audit modules plus the training service. */
export type CartItemId = ModuleCode | "EGITIM";

/**
 * The slug is a closed set rather than a string: `/moduller/${slug}` has to be
 * assignable to a known route in i18n/routing.ts, and only literals can be
 * checked against it. A new module means a new entry in both places.
 */
export type ModuleSlug =
  | "on-buro"
  | "yiyecek-icecek"
  | "wellness-rekreasyon"
  | "kat-hizmetleri"
  | "360-tam-denetim";

export type AuditModule = {
  code: ModuleCode;
  slug: ModuleSlug;
  title: string;
  summary: string;
  scope: readonly string[];
  icon: keyof typeof moduleIcons;
  /** TL, VAT included. Single source of truth — no component may hardcode a price. */
  price: number;
  featured?: boolean;
  /** Set on D: the modules its scope already covers. */
  includes?: readonly ModuleCode[];
};

export const modules: readonly AuditModule[] = [
  {
    code: "A",
    slug: "on-buro",
    title: "Ön Büro",
    summary:
      "Misafir ilk teması, karşılama hızı, veri giriş doğruluğu ve finansal güvence parametrelerinin denetimi.",
    scope: [
      "Karşılama ve valet standartları",
      "Check-in protokolü ve upsell performansı",
      "KVKK onayı ve CRM veri doğruluğu",
      "Kriz yönetimi ve check-out süreci",
    ],
    icon: "ConciergeBell",
    price: 15_000,
  },
  {
    code: "B",
    slug: "yiyecek-icecek",
    title: "Yiyecek & İçecek (F&B)",
    summary:
      "Gastronomi kalite güvencesi, reçete sadakati, hız, hijyen (HACCP) ve kayıp/kaçak kontrolü.",
    scope: [
      "Restoran & à la carte servis akışı ve hız",
      "Menü hakimiyeti ve çapraz satış",
      "Bar reçete sadakati ve porsiyon güvenliği",
      "Finansal kaçak (shrinkage) ve oda servisi",
    ],
    icon: "UtensilsCrossed",
    price: 15_000,
  },
  {
    code: "C",
    slug: "wellness-rekreasyon",
    title: "Wellness & Rekreasyon",
    summary:
      "SPA, havuz, plaj ve fitness alanlarında lüks hizmet standartları, mikrobiyolojik hijyen, mutlak güvenlik ve gelir kaldıraçları.",
    scope: [
      "SPA resepsiyon ve randevu sadakati",
      "Terapist uzmanlığı, iletişim ve upsell",
      "Islak alanlar ve fitness güvenliği",
      "Havuz kimyasalları, plaj ve can güvenliği",
    ],
    icon: "Waves",
    price: 15_000,
  },
  {
    code: "E",
    slug: "kat-hizmetleri",
    title: "Kat Hizmetleri & Oda İçi",
    summary:
      "Duyusal ilk etki, tekstil, derin mikrobiyolojik hijyen ve kör nokta donanım çalışma performansları.",
    scope: [
      "Duyusal ilk etki ve iklimlendirme",
      "Yatak düzeni ve tekstil kalitesi",
      "Banyo sterilizasyonu ve detay hijyeni",
      "Balkon/teras ve oda içi mutfak (kitchenette)",
    ],
    icon: "BedDouble",
    price: 15_000,
  },
  {
    code: "D",
    slug: "360-tam-denetim",
    title: "360° Tam Denetim",
    summary:
      "Departmanlar arası sinerji, kurumsal iletişim, eğitim ihtiyaç analizi ve yönetim kurulu SWOT yol haritası.",
    scope: [
      "A + B + C + E modüllerinin tamamı",
      "Departmanlar arası iletişim ve vardiya sinerjisi",
      "PMS/POS/CRM finansal mutabakat",
      "Kriz simülasyonu, TNA ve yönetim kurulu SWOT",
    ],
    icon: "Radar",
    price: 50_000,
    featured: true,
    includes: ["A", "B", "C", "E"],
  },
] as const;

/**
 * Not a module: no letter, no field guide. It is the training service the audit
 * feeds into, and it is bought separately — including alongside D.
 */
export const trainingService = {
  id: "EGITIM" as const,
  slug: "personel-egitimi",
  title: "Personel Eğitimi",
  summary:
    "Denetim bulgularından beslenen, departman bazlı ve ölçülebilir yerinde eğitim programları.",
  scope: [
    "Ön büro & F&B & kat hizmetleri programları",
    "Rol canlandırma atölyeleri",
    "Ön/son test ölçümü",
    "Takip denetimiyle doğrulama",
  ],
  icon: "GraduationCap",
  price: 15_000,
} as const;

/** Kept apart from the data so the module list stays serialisable. */
export const moduleIcons = {
  ConciergeBell,
  UtensilsCrossed,
  Waves,
  Radar,
  BedDouble,
  GraduationCap,
} satisfies Record<string, LucideIcon>;

/** Display order: the four single modules, then the package, then training. */
export const CATALOGUE_ORDER: readonly CartItemId[] = ["A", "B", "C", "E", "D", "EGITIM"] as const;

export function getModule(code: string): AuditModule | undefined {
  return modules.find((entry) => entry.code === code);
}

export function priceOf(id: CartItemId): number {
  if (id === "EGITIM") return trainingService.price;
  const entry = getModule(id);
  if (!entry) {
    throw new Error(`Unknown cart item: ${id}. Expected one of ${CATALOGUE_ORDER.join(", ")}.`);
  }
  return entry.price;
}

export function titleOf(id: CartItemId): string {
  if (id === "EGITIM") return trainingService.title;
  const entry = getModule(id);
  if (!entry) {
    throw new Error(`Unknown cart item: ${id}. Expected one of ${CATALOGUE_ORDER.join(", ")}.`);
  }
  return entry.title;
}

/** The package module and the modules it absorbs. Drives the cart's only smart behaviour. */
export const PACKAGE_MODULE: ModuleCode = "D";
export const PACKAGE_COVERS: readonly ModuleCode[] = ["A", "B", "C", "E"] as const;

export const VAT_RATE = 0.2;
export const PRICING_NOTE = "FİYATLAR KDV DAHİLDİR";
export const SCALE_NOTE =
  "Listelenen fiyatlar standart ölçekli tesisler içindir. Farklı ölçekteki tesisler için teklif alın.";
