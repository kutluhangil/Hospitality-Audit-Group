import type { CriteriaGroup, Criterion, ModuleCriteria, Perspective } from "@/lib/criteria/types";

/**
 * Overlays translated text onto the methodology.
 *
 * The field guides are Turkish, and lib/criteria/module-*.ts holds them
 * verbatim. Only the prose is language-dependent: a criterion code is "A.2.2" in
 * every language, "Kronometre" resolves to the same icon and the same tally
 * whatever the reader speaks, and four minutes is four minutes. So the structure
 * stays in TypeScript and only the text layer is looked up.
 *
 * Lookups fall back to Turkish. A missing translation shows the source string
 * rather than an empty page — half-translated beats broken, and the gap is
 * visible to anyone reading it, which is how it gets found.
 */

/** Keyed by criterion or group code, e.g. "A.2.2" or "A.2.". */
export type CriteriaMessages = Record<
  string,
  { text?: string; title?: string; intro?: string; threshold?: string; role?: string; body?: string }
>;

function translateCriterion(criterion: Criterion, messages: CriteriaMessages): Criterion {
  const entry = messages[criterion.code];
  if (!entry) return criterion;

  return {
    ...criterion,
    text: entry.text ?? criterion.text,
    // The bound itself never changes; only its wording does ("4 dakika" → "4 minutes").
    threshold: criterion.threshold === undefined ? undefined : (entry.threshold ?? criterion.threshold),
  };
}

function translateGroup(group: CriteriaGroup, messages: CriteriaMessages): CriteriaGroup {
  const entry = messages[group.code];

  return {
    ...group,
    title: entry?.title ?? group.title,
    intro: group.intro === undefined ? undefined : (entry?.intro ?? group.intro),
    criteria: group.criteria.map((criterion) => translateCriterion(criterion, messages)),
  };
}

/** Perspectives are keyed by module code plus their index: "C.perspective.0". */
function translatePerspectives(
  module: string,
  perspectives: readonly Perspective[] | undefined,
  messages: CriteriaMessages,
): readonly Perspective[] | undefined {
  if (!perspectives) return undefined;

  return perspectives.map((perspective, index) => {
    const entry = messages[`${module}.perspective.${index}`];
    if (!entry) return perspective;
    return { role: entry.role ?? perspective.role, body: entry.body ?? perspective.body };
  });
}

export function translateModule(
  criteria: ModuleCriteria,
  messages: CriteriaMessages | undefined,
): ModuleCriteria {
  // No messages means Turkish, the source language — nothing to overlay.
  if (!messages) return criteria;

  const entry = messages[criteria.module];

  return {
    ...criteria,
    subtitle: entry?.title ?? criteria.subtitle,
    intro: entry?.intro ?? criteria.intro,
    perspectives: translatePerspectives(criteria.module, criteria.perspectives, messages),
    groups: criteria.groups.map((group) => translateGroup(group, messages)),
  };
}

/**
 * Reports what is still untranslated, so a gap is a number someone can act on
 * rather than something noticed by a reader. Used by the i18n coverage test.
 */
export function missingKeys(criteria: ModuleCriteria, messages: CriteriaMessages): string[] {
  const missing: string[] = [];

  if (!messages[criteria.module]?.title) missing.push(`${criteria.module} (subtitle)`);
  if (!messages[criteria.module]?.intro) missing.push(`${criteria.module} (intro)`);

  criteria.perspectives?.forEach((_, index) => {
    const key = `${criteria.module}.perspective.${index}`;
    if (!messages[key]?.body) missing.push(key);
  });

  for (const group of criteria.groups) {
    if (!messages[group.code]?.title) missing.push(group.code);
    if (group.intro && !messages[group.code]?.intro) missing.push(`${group.code} (intro)`);

    for (const criterion of group.criteria) {
      if (!messages[criterion.code]?.text) missing.push(criterion.code);
      if (criterion.threshold && !messages[criterion.code]?.threshold) {
        missing.push(`${criterion.code} (threshold)`);
      }
    }
  }

  return missing;
}
