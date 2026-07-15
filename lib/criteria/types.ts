import type { ModuleCode } from "@/lib/modules-data";

/**
 * The audit methodology's shared vocabulary.
 *
 * The field guides label each criterion with an evidence type, but they do it in
 * free text and the same method surfaces under several names — "UV Işık Testi",
 * "UV Light Testi", "UV & Gözlem" and "Koku & UV Testi" are one method. So each
 * criterion carries both:
 *   - `evidenceLabel`  the guide's exact wording, preserved verbatim
 *   - `evidence`       the canonical category, used for icons and counts
 * Statistics on the site derive from `evidence`; `evidenceLabel` is what the
 * reader sees beside the criterion.
 */
export const EVIDENCE_CATEGORIES = {
  kronometre: {
    title: "Kronometre",
    description: "Süre ölçümü. Bir standardın kaç saniyede karşılandığı sayılır.",
    icon: "Timer",
  },
  gozlem: {
    title: "Gözlem",
    description: "Denetçinin gerçek misafir olarak, yerinde ve habersiz gözlemi.",
    icon: "Eye",
  },
  sesKaydi: {
    title: "Ses Kaydı",
    description: "Konuşma içeriği ve diksiyon kaydı; upsell ve şikâyet yönetimi burada ölçülür.",
    icon: "Mic",
  },
  davranis: {
    title: "Davranış Analizi",
    description: "Personelin refleksi: nezaket protokolü, inisiyatif alma, kriz anındaki tutum.",
    icon: "Users",
  },
  fotograf: {
    title: "Fotoğraf Kanıtı",
    description: "Makro ve detay fotoğraf. Hijyen bulgularının tartışmasız kanıtı.",
    icon: "Camera",
  },
  fizikselTest: {
    title: "Fiziksel Test",
    description: "Dokunma, mukavemet ve donanım çalışma testi.",
    icon: "Hand",
  },
  hijyenTesti: {
    title: "Hijyen & Kimyasal Test",
    description: "UV ışık, koku, swab ve kit ölçümü. Gözle görünmeyeni ölçer.",
    icon: "FlaskConical",
  },
  simulasyon: {
    title: "Simülasyon",
    description: "Kurgulanmış şikâyet veya kriz senaryosu. Tepki süresi ve zinciri ölçülür.",
    icon: "Siren",
  },
  sistemAnalizi: {
    title: "Sistem Analizi",
    description: "PMS, POS ve CRM ekran/log incelemesi. Departmanlar arası veri akışı burada görünür.",
    icon: "MonitorCheck",
  },
  finansal: {
    title: "Finansal Analiz",
    description: "Adisyon, folyo ve fatura eşleme. Gelir kaçağı bu kalemde çıkar.",
    icon: "Receipt",
  },
  evrak: {
    title: "Evrak & Sicil",
    description: "Belge, sertifika, sicil ve arşiv kontrolü.",
    icon: "FileCheck",
  },
  raporlama: {
    title: "Raporlama Çıktısı",
    description: "Denetim verisinin yönetim kuruluna sunulabilir analize dönüştürülmesi.",
    icon: "ClipboardList",
  },
  sahaHaritalama: {
    title: "Saha Haritalama",
    description: "Dış alanın ölçülü taranması: plaj, havuz çevresi, emniyet şeritleri.",
    icon: "Map",
  },
} as const;

export type EvidenceCategory = keyof typeof EVIDENCE_CATEGORIES;

export type Criterion = {
  /** Guide code, e.g. "A.2.2". Stable — never renumber; the guides cross-reference these. */
  code: string;
  text: string;
  /** The guide's own wording for the evidence type. */
  evidenceLabel: string;
  evidence: EvidenceCategory;
  /**
   * The measurable bound the criterion turns on ("4 dakika", "pH 7.2 – 7.6").
   * These carry the methodology's claim to be measurable, so they are surfaced
   * separately instead of staying buried in the sentence.
   */
  threshold?: string;
};

export type CriteriaGroup = {
  code: string;
  title: string;
  /** Set when the guide introduces the group with a summary line. */
  intro?: string;
  criteria: readonly Criterion[];
};

/** The owner/manager narratives the guides open with. Quoted, not paraphrased. */
export type Perspective = {
  role: string;
  body: string;
};

export type ModuleCriteria = {
  module: ModuleCode;
  /** The guide's own subtitle for the module. */
  subtitle: string;
  intro: string;
  perspectives?: readonly Perspective[];
  groups: readonly CriteriaGroup[];
};
