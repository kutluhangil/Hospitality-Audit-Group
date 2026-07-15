import type { Metadata } from "next";

import { ModuleCard } from "@/components/modules/ModuleCard";
import { ModulesSelectionSummary } from "@/components/modules/ModulesSelectionSummary";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { modules } from "@/lib/modules-data";

export const metadata: Metadata = {
  title: "Modüler Hizmet Mimarisi",
  description:
    "Konaklama, F&B, wellness, 360° tam denetim ve personel eğitimi modülleri. İhtiyacınız olan modülleri seçin, teklifinizi oluşturun.",
};

export default function ModulesPage() {
  return (
    <main className="mx-auto max-w-content px-6 py-16 md:py-24">
      <Reveal>
        <header className="max-w-2xl">
          <Eyebrow>MODÜLER HİZMET MİMARİSİ</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] tracking-tight md:text-5xl">
            Denetiminizi modül modül kurun.
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink-muted md:text-lg">
            İhtiyacınız olan modülleri özgürce seçin, yatırımınızı doğrudan öncelikli alanlarınıza
            yönlendirin.
          </p>
        </header>
      </Reveal>

      <Reveal className="mt-14">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard key={module.code} module={module} />
          ))}
        </div>
      </Reveal>

      <Reveal className="mt-16">
        <ModulesSelectionSummary />
      </Reveal>

      <Reveal className="mt-16">
        <Card tone="surface" className="flex flex-col gap-4 md:p-8">
          <Eyebrow tone="muted">KVKK %100 UYUM · KARŞILIKLI NDA</Eyebrow>
          <h2 className="font-serif text-2xl">Denetim verisi tesisinize aittir.</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-ink-muted md:text-base">
            Her çalışma karşılıklı gizlilik sözleşmesiyle başlar. Denetim sırasında toplanan tüm
            gözlem kayıtları ve raporlar KVKK kapsamında işlenir; yalnızca tesis yönetimiyle
            paylaşılır, üçüncü taraflara aktarılmaz. Referanslarımız da bu nedenle anonimdir.
          </p>
        </Card>
      </Reveal>
    </main>
  );
}
