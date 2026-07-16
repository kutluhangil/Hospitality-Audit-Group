import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCTA() {
  const t = useTranslations("home.finalCta");

  return (
    <section className="mx-auto max-w-content px-6 pb-20 md:pb-28">
      <Reveal>
        {/* Dark in both themes: the closing note belongs to the field, not the report. */}
        <div className="rounded-xl2 bg-terminal-bg px-6 py-16 text-center md:px-12 md:py-20">
          <h2 className="mx-auto max-w-2xl font-serif text-3xl leading-tight text-terminal-ink md:text-4xl lg:text-5xl">
            {t("title")}
          </h2>
          <div className="mt-10">
            <Button href="/moduller" variant="accent" size="lg">
              {t("cta")}
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
