import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CriteriaSection } from "@/components/criteria/CriteriaSection";
import { EvidenceSummary } from "@/components/criteria/EvidenceShowcase";
import { PerspectiveBlock } from "@/components/criteria/PerspectiveBlock";
import { CartButton } from "@/components/modules/CartButton";
import { PriceTag } from "@/components/modules/PriceTag";
import { PageHero } from "@/components/services/PageHero";
import { Button } from "@/components/ui/Button";
import { PaperFigure } from "@/components/ui/PaperFigure";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { alternatesFor } from "@/i18n/metadata";
import { routing, type AppLocale } from "@/i18n/routing";
import { criteriaCount, getCriteria, thresholds } from "@/lib/audit-criteria";
import { illustrationFor } from "@/lib/illustrations";
import { modules, SCALE_NOTE } from "@/lib/modules-data";

type ModuleParams = { locale: AppLocale; slug: string };

/**
 * Every module in every locale. The slug stays Turkish in both: the English URL
 * (/en/modules/front-office) is a rewrite declared in i18n/routing.ts, so this
 * segment only ever sees the internal slug.
 */
export function generateStaticParams(): ModuleParams[] {
  return routing.locales.flatMap((locale) =>
    modules.map((entry) => ({ locale, slug: entry.slug })),
  );
}

function moduleFor(slug: string) {
  return modules.find((entry) => entry.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ModuleParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const auditModule = moduleFor(slug);
  if (!auditModule) return {};

  return {
    title: `Modül ${auditModule.code} — ${auditModule.title}`,
    description: `${auditModule.summary} ${criteriaCount(auditModule.code)} kriter, her biri bir kanıt türüne bağlı.`,
    // The canonical has to be the URL this locale actually serves, not the
    // internal path — otherwise the English page declares a Turkish canonical
    // and asks to be dropped from the index.
    alternates: alternatesFor(`/moduller/${auditModule.slug}`, locale),
  };
}

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<ModuleParams>;
}) {
  const { slug } = await params;
  const auditModule = moduleFor(slug);
  if (!auditModule) notFound();

  const criteria = getCriteria(auditModule.code);
  if (!criteria) {
    // Every module is transcribed; a missing entry is a data bug, not a 404.
    throw new Error(
      `Module ${auditModule.code} has no transcribed criteria in lib/criteria/.`,
    );
  }

  const count = criteriaCount(auditModule.code);
  const bounds = thresholds(auditModule.code);
  // Optional: not every module has artwork yet, and the layout must not depend on it.
  const illustration = illustrationFor(auditModule.code);

  return (
    <main>
      <PageHero
        eyebrow={`MODÜL ${auditModule.code}`}
        title={auditModule.title}
        lede={criteria.subtitle}
      />

      <section className="mx-auto max-w-content px-6 pb-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <Reveal>
            <div className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <p className="max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
                  {criteria.intro}
                </p>
                <div className="mt-6">
                  <EvidenceSummary module={auditModule.code} />
                </div>
              </div>
              {illustration ? (
                <PaperFigure
                  src={illustration.src}
                  alt={illustration.alt}
                  priority
                  sizes="(min-width: 640px) 13rem, 60vw"
                  className="w-40 justify-self-start sm:w-52"
                />
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex flex-col gap-4 rounded-xl2 border border-line bg-bg-soft p-6 lg:w-72">
              <PriceTag amount={auditModule.price} />
              <CartButton id={auditModule.code} size="lg" />
              <Button href="/teklif" variant="ghost" size="lg">
                Özel Teklif İsteyin
              </Button>
              <p className="text-xs leading-relaxed text-ink-muted">
                {SCALE_NOTE}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {criteria.perspectives?.length ? (
        <section className="border-y border-line bg-bg-soft">
          <div className="mx-auto max-w-content px-6 py-16 md:py-20">
            <Reveal>
              <SectionHeading
                eyebrow="NEDEN ÖNEMLİ"
                title="Bu departman kimin gözünde ne ifade ediyor?"
                description="Aşağıdaki değerlendirmeler saha kılavuzumuzun giriş bölümünden alınmıştır — denetimi tasarlayan bakış açısı."
              />
            </Reveal>
            <div className="mt-10">
              <PerspectiveBlock perspectives={criteria.perspectives} />
            </div>
          </div>
        </section>
      ) : null}

      {bounds.length > 0 ? (
        <section className="mx-auto max-w-content px-6 py-16 md:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="ÖLÇÜLEBİLİR EŞİKLER"
              title="Tartışmayı bitiren rakamlar"
              description="Bu modüldeki kriterlerin bir kısmı net bir sınıra bağlıdır. Sınır ya geçilir ya geçilmez; yorum payı yoktur."
            />
          </Reveal>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bounds.map((criterion, index) => (
              <Reveal key={criterion.code} delay={Math.min(index, 6) * 0.03}>
                <li className="flex items-baseline gap-3 rounded-xl2 border border-line bg-surface px-4 py-3">
                  <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-ink-muted">
                    {criterion.code}
                  </span>
                  <span className="font-mono text-sm text-accent-strong">
                    {criterion.threshold}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mx-auto max-w-content px-6 py-16 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow={`${count} KRİTER`}
            title="Denetim şeması"
            description="Sahada her kritere Evet / Hayır / Uygulanamaz olarak karar verilir ve karar bir kanıta bağlanır. Aşağıda o şemanın tamamı yer alıyor."
          />
        </Reveal>
        <div className="mt-12">
          <CriteriaSection groups={criteria.groups} />
        </div>
      </section>

      <section className="border-t border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-16 md:py-20">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl">
                  Modül {auditModule.code} ile başlayalım.
                </h2>
                <p className="mt-2 text-ink-muted">{SCALE_NOTE}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-3">
                <CartButton id={auditModule.code} size="lg" />
                <Button href="/moduller" variant="ghost" size="lg">
                  Tüm Modüller
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
