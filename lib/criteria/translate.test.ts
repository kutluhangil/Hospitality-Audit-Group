import { describe, expect, it } from "vitest";

import { missingKeys, translateModule, type CriteriaMessages } from "@/lib/criteria/translate";
import type { ModuleCriteria } from "@/lib/criteria/types";

const SOURCE: ModuleCriteria = {
  module: "A",
  subtitle: "Ön Büro Operasyonel Kalite Kontrol Listesi",
  intro: "Misafir ilk temas, karşılama hızı.",
  perspectives: [{ role: "Bir Otel Sahibinin Gözünden", body: "Kaynak metin." }],
  groups: [
    {
      code: "A.1.",
      title: "Karşılama ve Valet Standartları",
      intro: "Grup açıklaması.",
      criteria: [
        {
          code: "A.1.1",
          text: "Araç kapıya yanaştığı an ilk 60 saniye içinde karşılama yapıldı mı?",
          evidenceLabel: "Zaman Sayacı",
          evidence: "kronometre",
          threshold: "60 saniye",
        },
        {
          code: "A.1.2",
          text: "Vale ekibi göz teması kurdu mu?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
      ],
    },
  ],
};

describe("translateModule", () => {
  it("returns the source untouched when there are no messages", () => {
    expect(translateModule(SOURCE, undefined)).toEqual(SOURCE);
  });

  it("overlays text, titles, intros and perspectives", () => {
    const messages: CriteriaMessages = {
      A: { title: "Front Office Operational Quality Checklist", intro: "First contact." },
      "A.perspective.0": { role: "From the owner's chair", body: "Translated." },
      "A.1.": { title: "Greeting and valet standards", intro: "Group note." },
      "A.1.1": { text: "Was the guest greeted within 60 seconds?", threshold: "60 seconds" },
    };

    const result = translateModule(SOURCE, messages);

    expect(result.subtitle).toBe("Front Office Operational Quality Checklist");
    expect(result.intro).toBe("First contact.");
    expect(result.perspectives?.[0]).toEqual({ role: "From the owner's chair", body: "Translated." });
    expect(result.groups[0].title).toBe("Greeting and valet standards");
    expect(result.groups[0].intro).toBe("Group note.");
    expect(result.groups[0].criteria[0].text).toBe("Was the guest greeted within 60 seconds?");
    expect(result.groups[0].criteria[0].threshold).toBe("60 seconds");
  });

  it("falls back to Turkish for anything untranslated", () => {
    // Half-translated must render, not break: the gap shows in the source
    // language, which is how a missing string gets noticed and fixed.
    const result = translateModule(SOURCE, { "A.1.1": { text: "Only this one." } });

    expect(result.groups[0].criteria[0].text).toBe("Only this one.");
    expect(result.groups[0].criteria[1].text).toBe("Vale ekibi göz teması kurdu mu?");
    expect(result.groups[0].title).toBe("Karşılama ve Valet Standartları");
    expect(result.subtitle).toBe(SOURCE.subtitle);
  });

  it("never translates the structure", () => {
    const result = translateModule(SOURCE, {
      "A.1.1": { text: "Translated." },
    });

    // Codes cross-reference between guides and evidence drives icons and tallies.
    // Both must survive translation untouched.
    expect(result.groups[0].criteria[0].code).toBe("A.1.1");
    expect(result.groups[0].criteria[0].evidence).toBe("kronometre");
    expect(result.groups[0].criteria[0].evidenceLabel).toBe("Zaman Sayacı");
    expect(result.groups[0].code).toBe("A.1.");
    expect(result.module).toBe("A");
  });

  it("does not invent a threshold where the source has none", () => {
    const result = translateModule(SOURCE, { "A.1.2": { threshold: "should be ignored" } });
    expect(result.groups[0].criteria[1].threshold).toBeUndefined();
  });
});

describe("missingKeys", () => {
  it("lists everything absent", () => {
    const missing = missingKeys(SOURCE, {});
    expect(missing).toContain("A (subtitle)");
    expect(missing).toContain("A (intro)");
    expect(missing).toContain("A.perspective.0");
    expect(missing).toContain("A.1.");
    expect(missing).toContain("A.1.1");
    expect(missing).toContain("A.1.1 (threshold)");
    expect(missing).toContain("A.1.2");
  });

  it("is empty for a complete translation", () => {
    const complete: CriteriaMessages = {
      A: { title: "t", intro: "i" },
      "A.perspective.0": { role: "r", body: "b" },
      "A.1.": { title: "t", intro: "i" },
      "A.1.1": { text: "t", threshold: "60 seconds" },
      "A.1.2": { text: "t" },
    };
    expect(missingKeys(SOURCE, complete)).toEqual([]);
  });

  it("does not demand a threshold the source never had", () => {
    const messages: CriteriaMessages = {
      A: { title: "t", intro: "i" },
      "A.perspective.0": { role: "r", body: "b" },
      "A.1.": { title: "t", intro: "i" },
      "A.1.1": { text: "t", threshold: "60 seconds" },
      "A.1.2": { text: "t" },
    };
    expect(missingKeys(SOURCE, messages)).not.toContain("A.1.2 (threshold)");
  });
});
