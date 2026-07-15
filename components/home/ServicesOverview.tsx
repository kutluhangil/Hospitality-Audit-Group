import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

const SERVICES = [
  {
    title: "Gizli Müşteri ile Otel Denetimi",
    description:
      "Rezervasyondan check-out'a, misafir deneyimi döngüsünün tamamını habersiz ve tarafsız ölçeriz.",
    href: "/hizmetler/gizli-musteri-denetimi",
  },
  {
    title: "Personel Eğitimi",
    description:
      "Denetimde tespit edilen gelişim alanlarını, departman bazlı ve ölçülebilir eğitim programlarına çeviririz.",
    href: "/hizmetler/personel-egitimi",
  },
] as const;

export function ServicesOverview() {
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
              <h2 className="font-serif text-2xl md:text-3xl">{service.title}</h2>
              <p className="mt-4 flex-1 text-base leading-relaxed text-ink-muted">
                {service.description}
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
