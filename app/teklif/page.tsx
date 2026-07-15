import type { Metadata } from "next";

import { QuoteForm } from "@/components/forms/QuoteForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PRICING_NOTE } from "@/lib/modules-data";

export const metadata: Metadata = {
  title: "Teklif Talebi",
  description:
    "Seçtiğiniz denetim modülleri için teklif talebi oluşturun. Ön bulgular 48 saat içinde paylaşılır.",
};

export default function TeklifPage() {
  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 md:py-24">
      <Reveal>
        <header className="max-w-2xl">
          <Eyebrow>TEKLİF TALEBİ</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            Teklifinizi birlikte kuralım.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
            Seçtiğiniz modüller aşağıda listelenir. Modül seçmeden de gönderebilirsiniz — genel
            görüşme talebi olarak değerlendiririz.
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            {PRICING_NOTE}
          </p>
        </header>
      </Reveal>

      <Reveal className="mt-12 md:mt-16">
        <QuoteForm />
      </Reveal>
    </main>
  );
}
