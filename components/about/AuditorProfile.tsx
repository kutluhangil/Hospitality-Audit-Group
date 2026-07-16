import { useTranslations } from "next-intl";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { company } from "@/lib/company-data";

/**
 * PLACEHOLDER FIGURES — the headcount and the average seniority come from
 * lib/company-data.ts and are stand-ins. The past roles are real in kind (the
 * team is drawn from ex-managers) but the exact mix must be confirmed.
 *
 * No names, no portraits, ever. That is not an omission to be filled in later:
 * a recognised auditor cannot audit.
 */
export function AuditorProfile() {
  const t = useTranslations("aboutPage.auditors");

  return (
    <div>
      <Reveal>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />
      </Reveal>

      <Reveal className="mt-10">
        <dl className="grid grid-cols-2 gap-6 border-y border-line py-6 sm:max-w-md">
          <div>
            <dd className="font-mono text-4xl text-ink">
              {company.denetciSayisi}
            </dd>
            <dt className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
              {t("countLabel")}
            </dt>
          </div>
          <div>
            <dd className="font-mono text-4xl text-ink">
              {t("seniorityValue", { years: company.ortalamaKidemYil })}
            </dd>
            <dt className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
              {t("seniorityLabel")}
            </dt>
          </div>
        </dl>
      </Reveal>

      <Reveal className="mt-8">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-muted">
          {t("rolesLabel")}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {(t.raw("roles") as readonly string[]).map((role) => (
            <li
              key={role}
              className="rounded-xl2 border border-line bg-surface px-3.5 py-2 text-sm text-ink"
            >
              {role}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}
