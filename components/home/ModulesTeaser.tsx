import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Link } from "@/i18n/navigation";
import { modules, moduleIcons } from "@/lib/modules-data";

export function ModulesTeaser() {
  return (
    <section className="border-y border-line bg-bg-soft">
      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module, index) => {
            const Icon = moduleIcons[module.icon];

            return (
              <li key={module.code}>
                <Reveal delay={index * 0.06} className="h-full">
                  <Card tone={module.featured ? "accent" : "surface"} className="h-full">
                    <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                      MODUL-{module.code}
                    </p>
                    <h2 className="mt-2 font-serif text-xl">{module.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">{module.summary}</p>
                  </Card>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal className="mt-10">
          <Link
            href="/moduller"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent-strong transition-colors duration-150 hover:text-accent-strong-hover"
          >
            Tüm modülleri inceleyin →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
