import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";

/** The destinations. Their copy lives under `home.services`, keyed by `key`. */
const SERVICES = [
  { key: "mysteryShopping", href: "/hizmetler/gizli-musteri-denetimi" },
  { key: "staffTraining", href: "/hizmetler/personel-egitimi" },
] as const;

export function ServicesOverview() {
  const t = useTranslations("home.services");

  return (
    <section className="mx-auto max-w-content px-6 py-20 md:py-28">
      <div className="grid gap-6 md:grid-cols-2">
        {SERVICES.map((service, index) => (
          <Reveal key={service.href} delay={index * 0.08}>
            {/* The whole card is the link, so the title carries the accessible name
                and no extra call-to-action copy has to be invented. */}
            <Card
              as={Link}
              href={service.href}
              className="group flex h-full flex-col p-8 transition-colors duration-150 hover:border-accent"
            >
              <h2 className="font-serif text-2xl md:text-3xl">
                {t(`${service.key}.title`)}
              </h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-ink-muted">
                {t(`${service.key}.description`)}
              </p>
              <ArrowRight
                className="mt-8 h-5 w-5 text-accent transition-colors duration-150"
                aria-hidden="true"
              />
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
