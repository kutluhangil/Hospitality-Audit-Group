import { Reveal } from "@/components/ui/Reveal";

/** Numbering is meaningful here: the audit runs in this order. */
const STEPS = [
  {
    number: "01",
    title: "KEŞİF",
    description: "İhtiyaç görüşmesi, NDA imzası, modül seçimi.",
  },
  {
    number: "02",
    title: "SAHA",
    description: "Habersiz gizli müşteri ziyareti; standart kontrol listeleriyle kanıt toplama.",
  },
  {
    number: "03",
    title: "RAPOR",
    description: "SWOT + ROI analizi; gelir kaçağı ve gelişim alanları net rakamlarla.",
  },
  {
    number: "04",
    title: "DÖNÜŞÜM",
    description: "Departman bazlı personel eğitimi ve takip denetimi.",
  },
] as const;

export function ProcessSection() {
  return (
    <section className="border-y border-line bg-bg-soft">
      <div className="mx-auto max-w-content px-6 py-20 md:py-28">
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {STEPS.map((step, index) => (
            // Reveal renders a div, so it sits inside the li rather than around it.
            <li key={step.number}>
              <Reveal delay={index * 0.08} className="border-t border-accent pt-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                  <span className="text-accent-strong">{step.number}</span> {step.title}
                </p>
                <p className="mt-3 text-base leading-relaxed text-ink-muted">{step.description}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
