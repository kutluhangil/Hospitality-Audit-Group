/**
 * Company facts, in one place, because most of them are not yet true.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  PLACEHOLDER CONTENT — DO NOT PUBLISH AS-IS                         │
 * │  The founding narrative and the figures below are a stand-in so the │
 * │  page can be designed and reviewed. Replace them with the real      │
 * │  thing and set `isPlaceholder` to false before launch.              │
 * │  See docs/senin-yapacaklarin.md, section 1.2.                            │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * Two categories of fact are treated differently on purpose:
 *
 *   Narrative and figures  — placeholder values, marked. They render, because
 *                            the page needs to be seen, and `isPlaceholder`
 *                            surfaces a warning outside production.
 *
 *   Registry identifiers   — NOT invented, left null. A ticaret sicil, MERSİS
 *                            or vergi number is a state registry ID that ends up
 *                            on invoices and contracts; a made-up one is not
 *                            marketing copy, it is a false record. Any section
 *                            that needs one simply does not render until it is
 *                            filled in.
 *
 *   Audit history          — NOT invented, left empty. No audit has been sold
 *                            yet, so there are no facility profiles, no case
 *                            studies and no testimonials. Sections that would
 *                            display them do not render.
 */

export type FacilityProfile = {
  /** No names: the NDA promise applies to the site itself. */
  descriptor: string;
  rooms: number;
  city: string;
  modules: readonly string[];
  nights: number;
};

export const company = {
  /** Flip to false only when everything marked PLACEHOLDER below is real. */
  isPlaceholder: true,

  // ── Narrative figures — PLACEHOLDER ────────────────────────────────────
  kurulusYili: 2021, // PLACEHOLDER
  merkez: "İstanbul", // PLACEHOLDER
  denetciSayisi: 12, // PLACEHOLDER
  ortalamaKidemYil: 14, // PLACEHOLDER

  /** Past roles the audit team is drawn from. PLACEHOLDER — replace with the real mix. */
  // Auditor roles are copy, not registry data — they live under
  // aboutPage.auditors.roles in messages/ so they read in the page's language.

  // ── Registry identifiers — NOT INVENTED. null until real. ──────────────
  ticaretUnvani: null as string | null,
  ticaretSicilNo: null as string | null,
  mersisNo: null as string | null,
  vergiDairesi: null as string | null,
  vergiNo: null as string | null,
  merkezAdres: null as string | null,
  kepAdresi: null as string | null,
  etbisNo: null as string | null,

  // ── Audit history — NOT INVENTED. Empty until real. ────────────────────
  tesisProfilleri: [] as readonly FacilityProfile[],
} as const;

/**
 * True when every identifier an e-commerce seller must publish is present.
 * The corporate block, the invoice footer and the distance-selling contract all
 * gate on this — an incomplete seller identity must not reach a buyer.
 */
export function hasCorporateIdentity(): boolean {
  return Boolean(
    company.ticaretUnvani &&
    company.ticaretSicilNo &&
    company.mersisNo &&
    company.vergiDairesi &&
    company.vergiNo &&
    company.merkezAdres,
  );
}

export function hasFacilityProfiles(): boolean {
  return company.tesisProfilleri.length > 0;
}
