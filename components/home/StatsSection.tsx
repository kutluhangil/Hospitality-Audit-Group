import { Reveal } from "@/components/ui/Reveal";

const STATS = [
  { value: "4 modül", description: "ihtiyaca göre seçilebilir denetim mimarisi" },
  { value: "48 saat", description: "saha ziyareti sonrası ön bulgu paylaşımı" },
  { value: "%100", description: "KVKK uyumlu veri toplama ve kanıt analizi" },
] as const;

export function StatsSection() {
  return (
    <section className="mx-auto max-w-content px-6 py-20 md:py-28">
      <dl className="grid gap-10 sm:grid-cols-3 sm:gap-8">
        {STATS.map((stat, index) => (
          // Reveal renders a div, which is a valid grouping child of dl.
          <Reveal key={stat.value} delay={index * 0.08}>
            <dt className="font-mono text-4xl text-ink">{stat.value}</dt>
            <dd className="mt-3 text-base leading-relaxed text-ink-muted">{stat.description}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
