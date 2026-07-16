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
/**
 * The evidence taxonomy: which method proves a criterion, and which icon draws
 * it. Structure only — the title and the description a reader sees live under
 * the `evidence` namespace in messages, keyed by the same key. A stopwatch
 * measures seconds whatever the reader speaks; only its name changes.
 */
export const EVIDENCE_CATEGORIES = {
  kronometre: { icon: "Timer" },
  gozlem: { icon: "Eye" },
  sesKaydi: { icon: "Mic" },
  davranis: { icon: "Users" },
  fotograf: { icon: "Camera" },
  fizikselTest: { icon: "Hand" },
  hijyenTesti: { icon: "FlaskConical" },
  simulasyon: { icon: "Siren" },
  sistemAnalizi: { icon: "MonitorCheck" },
  finansal: { icon: "Receipt" },
  evrak: { icon: "FileCheck" },
  raporlama: { icon: "ClipboardList" },
  sahaHaritalama: { icon: "Map" },
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
