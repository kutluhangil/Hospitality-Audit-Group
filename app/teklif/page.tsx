import type { Metadata } from "next";

import { PaymentSection } from "@/components/forms/PaymentSection";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { PRICING_NOTE, SCALE_NOTE } from "@/lib/modules-data";
import { isPaymentEnabled } from "@/lib/payment";

export const metadata: Metadata = {
  title: "Teklif Talebi",
  description:
    "Seçtiğiniz denetim modülleri için teklif talebi oluşturun. Ön bulgular 48 saat içinde paylaşılır.",
};

/**
 * One page, two intents.
 *
 * When payment is off — which is the case until credentials and a corporate
 * identity both exist — everything below collapses to exactly the page this was
 * before: heading, note, quote form. No path chooser, no second heading, no
 * dangling "or". The quote flow underneath is untouched.
 */
export default function TeklifPage() {
  const paymentEnabled = isPaymentEnabled();

  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 md:py-24">
      <Reveal>
        <header className="max-w-2xl">
          <Eyebrow>TEKLİF TALEBİ</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            {paymentEnabled ? "Nasıl ilerlemek istersiniz?" : "Teklifinizi birlikte kuralım."}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
            {paymentEnabled
              ? "İki yol var: listelenen fiyatı kabul edip kartla ödeyebilir ya da tesisinizin ölçeğine göre teklif isteyebilirsiniz."
              : "Seçtiğiniz modüller aşağıda listelenir. Modül seçmeden de gönderebilirsiniz — genel görüşme talebi olarak değerlendiririz."}
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            {PRICING_NOTE}
          </p>
        </header>
      </Reveal>

      {paymentEnabled ? (
        <Reveal className="mt-10">
          <PathChooser />
        </Reveal>
      ) : null}

      {/* Renders nothing at all when payment is disabled — it gates itself too. */}
      <Reveal className="mt-12 md:mt-16">
        <PaymentSection />
      </Reveal>

      <Reveal className="mt-12 md:mt-16">
        <section id="teklif-iste" className="scroll-mt-24">
          {paymentEnabled ? (
            <div className="mb-8 border-t border-line pt-12 md:pt-16">
              <Eyebrow>YOL 2 — TEKLİF İSTE</Eyebrow>
              <h2 className="mt-3 font-serif text-2xl leading-tight md:text-3xl">
                Tesisinizin ölçeğine göre fiyat isteyin.
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
                {SCALE_NOTE} Bu yolda ödeme alınmaz ve fatura bilgisi istenmez — önce konuşur, sonra
                fiyatlarız.
              </p>
            </div>
          ) : null}
          <QuoteForm />
        </section>
      </Reveal>
    </main>
  );
}

/**
 * Names both paths side by side before either form appears, so a visitor knows
 * which one they are about to be in rather than discovering it at the submit button.
 */
function PathChooser() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <PathCard
        href="#kart-ile-ode"
        label="YOL 1"
        title="Kart ile öde"
        body="Listelenen fiyatı kabul edin, ödemeyi şimdi tamamlayın."
      />
      <PathCard
        href="#teklif-iste"
        label="YOL 2"
        title="Teklif iste"
        body="Ölçeğinize göre fiyat konuşalım. Ödeme yok, fatura bilgisi yok."
      />
    </div>
  );
}

type PathCardProps = {
  href: string;
  label: string;
  title: string;
  body: string;
};

function PathCard({ href, label, title, body }: PathCardProps) {
  return (
    <a
      href={href}
      className="flex flex-col gap-2 rounded-xl2 border border-line bg-surface p-6 transition-colors duration-150 hover:border-accent"
    >
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">{label}</span>
      <span className="font-serif text-xl">{title}</span>
      <span className="text-sm leading-relaxed text-ink-muted">{body}</span>
    </a>
  );
}
