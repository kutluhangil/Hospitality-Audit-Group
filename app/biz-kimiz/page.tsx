import type { Metadata } from "next";

import { AuditorProfile } from "@/components/about/AuditorProfile";
import { CorporateIdentity } from "@/components/about/CorporateIdentity";
import { FoundingStory } from "@/components/about/FoundingStory";
import { EvidenceShowcase } from "@/components/criteria/EvidenceShowcase";
import { ClosingCta } from "@/components/services/ClosingCta";
import { MonoRibbon } from "@/components/services/MonoRibbon";
import { PageHero } from "@/components/services/PageHero";
import { Button } from "@/components/ui/Button";
import { PaperFigure } from "@/components/ui/PaperFigure";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Biz Kimiz",
  description:
    "Otelciliği yönetmiş profesyonellerden kurulu bağımsız bir denetim ekibi. Tarafsızlık, gizlilik ve ölçülebilirlik ilkeleriyle, misafirin gözünden ölçüyoruz.",
  alternates: { canonical: "/biz-kimiz" },
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="BİZ KİMİZ"
        title="Otelciliği yönetenler, şimdi ölçüyor."
        lede="Denetim ekibimiz, bugün ölçtüğü departmanları bir zamanlar yönetmiş profesyonellerden oluşuyor."
      />

      <section className="mx-auto max-w-content px-6 py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-start">
          <FoundingStory />
          <Reveal delay={0.08}>
            <PaperFigure
              src="/images/biz-kimiz-hero.png"
              alt="Üst üste dizilmiş rapor sayfalarının soyut çizimi; sayfalardan birinde tek bir terracotta satır işaretli."
              sizes="(min-width: 1024px) 20rem, 70vw"
              className="w-56 justify-self-start lg:w-80"
            />
          </Reveal>
        </div>
        <Reveal className="mt-14">
          <MonoRibbon>TARAFSIZLIK · GİZLİLİK · ÖLÇÜLEBİLİRLİK</MonoRibbon>
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-16 md:py-20">
          <AuditorProfile />
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-16 md:py-20">
        <Reveal>
          <SectionHeading
            eyebrow="ANONİMLİK"
            title="Neden burada kimsenin fotoğrafı yok?"
            description="Bu sayfada isim, unvan ve portre bulamayacaksınız. Bir gizli müşteri şirketi için anonimlik bir eksiklik değil, işin ön koşuludur: tanınan bir denetçi, denetleyemez."
          />
        </Reveal>
        <Reveal className="mt-10">
          <blockquote className="max-w-2xl border-l-2 border-accent pl-6 font-serif text-2xl leading-snug md:text-3xl">
            Denetçilerimizin yüzünü göremezsiniz. Misafirleriniz de göremiyor.
          </blockquote>
        </Reveal>
        <Reveal className="mt-10">
          <p className="max-w-2xl text-base leading-relaxed text-ink-muted">
            Aynı ilke referanslarımız için de geçerli. Hangi tesisi denetlediğimizi, ne bulduğumuzu
            ve raporda ne yazdığını üçüncü bir tarafa anlatmayız — sizinkini de anlatmayacağız. Bu
            yüzden bu sitede müşteri logosu ya da isimli referans göremezsiniz. Gizlilik, satarken
            de geçerli olmayan bir vaat değildir.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-line">
        <EvidenceShowcase className="mx-auto max-w-content px-6 py-16 md:py-20" />
      </section>

      {/* Renders only once every registry identifier in company-data.ts is real. */}
      <section className="mx-auto max-w-content px-6 pb-16 md:pb-20">
        <CorporateIdentity />
      </section>

      <section className="mx-auto max-w-content px-6 pb-20 md:pb-28">
        <Reveal>
          <ClosingCta
            title="Tesisinizin gerçek fotoğrafını çekelim."
            description="İhtiyacınız olan modülleri seçin, yatırımınızı doğrudan öncelikli alanlarınıza yönlendirin."
          >
            <Button href="/moduller" size="lg">
              Modülleri İnceleyin
            </Button>
            <Button href="/surec" variant="ghost" size="lg">
              Sürecimizi İnceleyin
            </Button>
          </ClosingCta>
        </Reveal>
      </section>
    </main>
  );
}
