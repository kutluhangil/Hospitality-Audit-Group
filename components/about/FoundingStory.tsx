import { useTranslations } from "next-intl";

import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/lib/company-data";

/**
 * PLACEHOLDER NARRATIVE.
 *
 * Written to give the page its real shape and voice, not because any of it is
 * known to be true. The dates, the city and the framing all come from
 * lib/company-data.ts and must be replaced before launch. The registry block
 * and the facility profiles are handled differently — those are not invented at
 * all, they simply do not render until they are real.
 */
export function FoundingStory() {
  const t = useTranslations("aboutPage.story");

  return (
    <Reveal>
      <div className="max-w-2xl space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
        {/* The city and the year are placeholders in company-data, so they are
            interpolated rather than written into the copy — replacing them must
            not mean rewriting the paragraph in two languages. */}
        <p>{t("p1", { city: company.merkez, year: company.kurulusYili })}</p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
        <p>{t("p4")}</p>
      </div>
    </Reveal>
  );
}
