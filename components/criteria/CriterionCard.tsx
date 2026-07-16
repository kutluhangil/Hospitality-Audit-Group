import { EvidenceBadge } from "@/components/criteria/EvidenceBadge";
import type { Criterion } from "@/lib/criteria/types";

/**
 * One criterion, as a card rather than a table row.
 *
 * The field guides lay these out as a four-column table (Kod | Kriter | Durum |
 * Kanıt Türü). A table cannot survive 375px, and the Durum column — E / H / NA —
 * is the auditor's tick box, meaningless to a reader deciding whether to buy.
 * So the row becomes a card, the status column is dropped and explained once at
 * the top of the list, and the threshold is lifted out of the sentence because
 * it is the part that proves the method is measurable.
 */
export function CriterionCard({ criterion }: { criterion: Criterion }) {
  return (
    <article
      className={[
        "group relative flex h-full flex-col rounded-xl2 border border-line bg-surface p-5",
        "transition-colors duration-150 hover:border-accent/40",
      ].join(" ")}
    >
      <header className="flex items-start justify-between gap-3">
        <span className="font-mono text-xs tracking-[0.12em] text-accent-strong">
          {criterion.code}
        </span>
        <EvidenceBadge
          category={criterion.evidence}
          label={criterion.evidenceLabel}
        />
      </header>

      {/*
        Selecting the methodology is discouraged, not prevented — text sent to a
        browser cannot be protected. This stops casual copying and nothing more.
        Scoped to the criterion sentence so the code, badge and threshold stay
        selectable, and screen readers are unaffected either way.
      */}
      <p className="mt-3 flex-1 select-none text-[0.9375rem] leading-relaxed text-ink">
        {criterion.text}
      </p>

      {criterion.threshold ? (
        <p className="mt-4 flex items-baseline gap-2 border-t border-line pt-3 font-mono text-xs">
          <span className="uppercase tracking-[0.16em] text-ink-muted">
            Eşik
          </span>
          <span className="text-accent-strong">{criterion.threshold}</span>
        </p>
      ) : null}
    </article>
  );
}
