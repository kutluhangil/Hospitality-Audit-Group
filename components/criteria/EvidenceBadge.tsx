import {
  Timer,
  Eye,
  Mic,
  Users,
  Camera,
  Hand,
  FlaskConical,
  Siren,
  MonitorCheck,
  Receipt,
  FileCheck,
  ClipboardList,
  Map,
  type LucideIcon,
} from "lucide-react";

import { EVIDENCE_CATEGORIES, type EvidenceCategory } from "@/lib/criteria/types";

/**
 * Resolved here rather than in the data file so the criteria stay plain data —
 * they are imported by server components that have no business pulling icon
 * components into their bundle.
 */
const ICONS: Record<EvidenceCategory, LucideIcon> = {
  kronometre: Timer,
  gozlem: Eye,
  sesKaydi: Mic,
  davranis: Users,
  fotograf: Camera,
  fizikselTest: Hand,
  hijyenTesti: FlaskConical,
  simulasyon: Siren,
  sistemAnalizi: MonitorCheck,
  finansal: Receipt,
  evrak: FileCheck,
  raporlama: ClipboardList,
  sahaHaritalama: Map,
};

export function evidenceIcon(category: EvidenceCategory): LucideIcon {
  return ICONS[category];
}

type EvidenceBadgeProps = {
  category: EvidenceCategory;
  /**
   * The guide's own wording. Shown instead of the canonical title because it is
   * the more precise term — "Kronometre & Isı" says more than "Kronometre".
   */
  label: string;
  className?: string;
};

export function EvidenceBadge({ category, label, className }: EvidenceBadgeProps) {
  const Icon = ICONS[category];
  const canonical = EVIDENCE_CATEGORIES[category].title;

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-bg-soft px-2.5 py-1",
        "font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-muted",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      // The visible label is the guide's phrasing; the canonical category is what
      // the site counts by, so it belongs in the accessible name too.
      title={canonical === label ? label : `${label} — ${canonical}`}
    >
      <Icon size={12} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
      {label}
    </span>
  );
}
