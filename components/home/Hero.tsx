import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

import { AuditTerminal } from "./AuditTerminal";

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <section className="mx-auto max-w-content px-6 pb-16 pt-16 md:pb-24 md:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>

          <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {t("title")}
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg">
            {t("body")}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/moduller" variant="accent" size="lg">
              {t("ctaPrimary")}
            </Button>
            <Button href="/surec" variant="ghost" size="lg">
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>

        <AuditTerminal />
      </div>
    </section>
  );
}
