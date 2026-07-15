import { EvidenceBadge, evidenceIcon } from "@/components/criteria/EvidenceBadge";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { criteriaCount, evidenceBreakdown, evidenceTypeCount, thresholds } from "@/lib/audit-criteria";
import { EVIDENCE_CATEGORIES } from "@/lib/criteria/types";
import type { ModuleCode } from "@/lib/modules-data";

/**
 * Every number here is counted from the methodology at build time rather than
 * written by hand, so the claim on the page cannot drift away from the criteria
 * behind it. If a criterion changes, this section changes with it.
 */
export function EvidenceShowcase({
  module,
  className,
}: {
  module?: ModuleCode;
  className?: string;
}) {
  const breakdown = evidenceBreakdown(module);
  const total = criteriaCount(module);
  const types = evidenceTypeCount(module);
  const bounds = thresholds(module).length;
  const busiest = breakdown[0]?.count ?? 1;

  return (
    <section className={className}>
      <Reveal>
        <SectionHeading
          eyebrow="KANITSIZ İDDİA YOK"
          title="Nasıl kanıtlarız?"
          description="Denetim raporundaki her satır bir kanıt türüne bağlıdır. “Servis yavaştı” bir izlenimdir; kronometreyle ölçülmüş 6 dakika 20 saniye ise bir bulgudur."
        />
      </Reveal>

      <Reveal className="mt-10">
        <dl className="grid grid-cols-3 gap-4 border-y border-line py-6">
          {[
            { term: "kriter", value: total },
            { term: "kanıt türü", value: types },
            { term: "ölçülebilir eşik", value: bounds },
          ].map((stat) => (
            <div key={stat.term}>
              <dd className="font-mono text-3xl text-ink md:text-4xl">{stat.value}</dd>
              <dt className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
                {stat.term}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>

      <ul className="mt-8 space-y-2.5">
        {breakdown.map((entry, index) => {
          const meta = EVIDENCE_CATEGORIES[entry.category];
          const Icon = evidenceIcon(entry.category);
          return (
            <Reveal key={entry.category} delay={Math.min(index, 6) * 0.03}>
              <li className="flex items-center gap-3">
                <Icon
                  size={15}
                  strokeWidth={1.75}
                  className="shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span className="w-40 shrink-0 truncate font-mono text-xs uppercase tracking-[0.12em] text-ink md:w-52">
                  {meta.title}
                </span>
                {/* Proportional rule: the bar is the number, drawn. */}
                <span className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-bg-soft sm:block">
                  <span
                    className="block h-full rounded-full bg-accent/60"
                    style={{ width: `${(entry.count / busiest) * 100}%` }}
                  />
                </span>
                <span className="ml-auto shrink-0 font-mono text-xs tabular-nums text-ink-muted sm:ml-0 sm:w-10 sm:text-right">
                  {entry.count}
                </span>
              </li>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

/** Compact variant for a module page header: the methods this module leans on. */
export function EvidenceSummary({ module }: { module: ModuleCode }) {
  const breakdown = evidenceBreakdown(module).slice(0, 5);

  return (
    <ul className="flex flex-wrap gap-2">
      {breakdown.map((entry) => (
        <li key={entry.category}>
          <EvidenceBadge
            category={entry.category}
            label={`${EVIDENCE_CATEGORIES[entry.category].title} · ${entry.count}`}
          />
        </li>
      ))}
    </ul>
  );
}
