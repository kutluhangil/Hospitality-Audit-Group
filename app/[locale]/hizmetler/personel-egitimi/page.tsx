import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { ClosingCta } from "@/components/services/ClosingCta";
import { DefinitionCard } from "@/components/services/DefinitionCard";
import { ModuleQuickLinks } from "@/components/services/ModuleQuickLinks";
import { MonoRibbon } from "@/components/services/MonoRibbon";
import { PageHero } from "@/components/services/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { LocaleParams } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Personel Eğitimi",
  description:
    "Denetim bulgularından beslenen, departman bazlı ve ölçülebilir yerinde eğitim programları: ön büro, F&B, kat hizmetleri ve vardiya yönetimi.",
};

const programmes = [
  {
    label: "PROGRAM 01",
    title: "Ön Büro Mükemmelliği",
    description: "check-in hızı, şikâyet yönetimi, upselling teknikleri",
  },
  {
    label: "PROGRAM 02",
    title: "F&B Servis Standartları",
    description: "servis akışı, menü tavsiye satışı, reçete disiplini",
  },
  {
    label: "PROGRAM 03",
    title: "Kat Hizmetleri Kalite Sistemi",
    description: "hijyen standartları, oda kontrol listeleri",
  },
  {
    label: "PROGRAM 04",
    title: "Liderlik & Vardiya Yönetimi",
    description: "süpervizör ve müdür seviyesi",
  },
] as const;

export default async function StaffTrainingPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <PageHero
        eyebrow="PERSONEL EĞİTİMİ"
        title="Denetimden Eğitime: Ölçülen Gelişir."
        lede="Denetimde tespit edilen gelişim alanlarını, departman bazlı ve ölçülebilir eğitim programlarına çeviririz."
      />

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="KAPANIŞ DÖNGÜSÜ"
            title="Denetim ve eğitim aynı döngünün iki yarısıdır"
          />
        </Reveal>
        <Reveal className="mt-6">
          <div className="max-w-2xl space-y-5 text-base leading-relaxed text-ink-muted md:text-lg">
            <p>
              Eğitim programlarımız denetim bulgularından beslenir: sahada
              ölçülen sapma, doğrudan o sapmayı kapatacak içeriği belirler.
              Genel geçer bir müfredat değil, tesisinizin kendi raporundan çıkan
              bir program alırsınız.
            </p>
            <p>
              Eğitimi bağımsız olarak da satın alabilirsiniz. Denetim
              yaptırmamış tesislerde program, ön test sonuçlarına göre
              kurgulanır; sonuç yine ölçümle doğrulanır.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-20 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="PROGRAMLAR"
              title="Departman bazlı eğitim programları"
              description="Her program, denetimde ölçülen standartların birebir karşılığıdır."
            />
          </Reveal>
          <Reveal className="mt-12">
            <ul className="grid gap-4 md:grid-cols-2">
              {programmes.map((programme) => (
                <li key={programme.title}>
                  <DefinitionCard
                    label={programme.label}
                    title={programme.title}
                    description={programme.description}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="mt-10">
            <MonoRibbon>
              YERİNDE EĞİTİM · ATÖLYE · ROL CANLANDIRMA · ÖLÇÜM: ÖN/SON TEST +
              TAKİP DENETİMİ
            </MonoRibbon>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="İLGİLİ MODÜL"
            title="Eğitimi teklifinize ekleyin"
            description="Personel eğitimi, modül mimarisinde E koduyla yer alır; tek başına ya da denetim modüllerinin devamı olarak seçilebilir."
          />
        </Reveal>
        <Reveal className="mt-10">
          <ModuleQuickLinks codes={["E"]} />
        </Reveal>
        <Reveal className="mt-16">
          <ClosingCta title="Ölçtüğünüz her sapma, kapatılabilir bir gelişim alanıdır.">
            <Button href="/moduller" size="lg">
              Teklif Alın
            </Button>
            <Button
              href="/hizmetler/gizli-musteri-denetimi"
              variant="ghost"
              size="lg"
            >
              Denetim Hizmetini İnceleyin
            </Button>
          </ClosingCta>
        </Reveal>
      </section>
    </main>
  );
}
