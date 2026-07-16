import { CriterionCard } from "@/components/criteria/CriterionCard";
import { Reveal } from "@/components/ui/Reveal";
import type { CriteriaGroup } from "@/lib/criteria/types";

/** Staggering past a handful of cards reads as a queue, not as arrival. */
const MAX_STAGGERED = 6;
const STAGGER_STEP = 0.04;

function CriteriaGroupBlock({ group }: { group: CriteriaGroup }) {
  return (
    <section
      className="scroll-mt-24"
      id={`grup-${group.code.replace(/\.$/, "")}`}
    >
      <Reveal>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tracking-[0.12em] text-accent-strong">
            {group.code}
          </span>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>
        <h3 className="mt-3 font-serif text-2xl leading-snug md:text-3xl">
          {group.title}
        </h3>
        {group.intro ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted md:text-base">
            {group.intro}
          </p>
        ) : null}
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {group.criteria.map((criterion, index) => (
          <Reveal
            key={criterion.code}
            delay={Math.min(index, MAX_STAGGERED) * STAGGER_STEP}
            className="h-full"
          >
            <CriterionCard criterion={criterion} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function CriteriaSection({
  groups,
}: {
  groups: readonly CriteriaGroup[];
}) {
  return (
    <div className="space-y-16 md:space-y-20">
      {groups.map((group) => (
        <CriteriaGroupBlock key={group.code} group={group} />
      ))}
    </div>
  );
}
