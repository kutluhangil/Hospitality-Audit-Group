import { MODULE_A } from "@/lib/criteria/module-a";
import { MODULE_B } from "@/lib/criteria/module-b";
import { MODULE_C } from "@/lib/criteria/module-c";
import { MODULE_D } from "@/lib/criteria/module-d";
import { MODULE_E } from "@/lib/criteria/module-e";
import type {
  Criterion,
  EvidenceCategory,
  ModuleCriteria,
} from "@/lib/criteria/types";
import type { ModuleCode } from "@/lib/modules-data";

export * from "@/lib/criteria/types";

/**
 * The methodology, transcribed from the 2026 field guides. Each module lives in
 * its own file so it can be reviewed against its source document.
 */
export const auditCriteria: readonly ModuleCriteria[] = [
  MODULE_A,
  MODULE_B,
  MODULE_C,
  MODULE_D,
  MODULE_E,
] as const;

export function getCriteria(module: ModuleCode): ModuleCriteria | undefined {
  return auditCriteria.find((entry) => entry.module === module);
}

function select(module?: ModuleCode): readonly ModuleCriteria[] {
  return module
    ? auditCriteria.filter((entry) => entry.module === module)
    : auditCriteria;
}

export function allCriteria(module?: ModuleCode): Criterion[] {
  return select(module).flatMap((entry) =>
    entry.groups.flatMap((group) => group.criteria),
  );
}

export function criteriaCount(module?: ModuleCode): number {
  return allCriteria(module).length;
}

/**
 * Criteria per evidence category. The "how we prove it" section renders from
 * this rather than from hand-written numbers, so the claim cannot drift away
 * from the methodology behind it.
 */
export function evidenceBreakdown(
  module?: ModuleCode,
): { category: EvidenceCategory; count: number }[] {
  const tally = new Map<EvidenceCategory, number>();

  for (const criterion of allCriteria(module)) {
    tally.set(criterion.evidence, (tally.get(criterion.evidence) ?? 0) + 1);
  }

  return [...tally.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

export function evidenceTypeCount(module?: ModuleCode): number {
  return new Set(allCriteria(module).map((criterion) => criterion.evidence))
    .size;
}

/** Every criterion that states a measurable bound — the methodology's spine. */
export function thresholds(module?: ModuleCode): Criterion[] {
  return allCriteria(module).filter(
    (criterion) => criterion.threshold !== undefined,
  );
}
