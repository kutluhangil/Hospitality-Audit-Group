import type { Metadata } from "next";

import { ClosingCta } from "@/components/services/ClosingCta";
import { DefinitionCard } from "@/components/services/DefinitionCard";
import { Faq, type FaqItem } from "@/components/services/Faq";
import { PageHero } from "@/components/services/PageHero";
import { ProcessStep, type ProcessStepData } from "@/components/services/ProcessStep";
import { TrustBox } from "@/components/services/TrustBox";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Süreç",
  description:
    "Keşiften dönüşüme dört adımlık denetim sürecimiz, kanıt standardımız ve sık sorulan sorular: NDA, ziyaret süresi, rapor teslimi ve KVKK uyumu.",
};

const steps: readonly ProcessStepData[] = [
  {
    number: "01",
    name: "KEŞİF",
    summary: "İhtiyaç görüşmesi, NDA imzası, modül seçimi.",
    detail: [
      "Tesis ölçeği, misafir segmenti ve vaat edilen marka standardının tespiti",
      "Karşılıklı NDA imzası",
      "Denetlenecek modüllerin ve ziyaret takviminin belirlenmesi",
      "Denetçi profilinin gerçek misafir profilinize göre seçilmesi",
    ],
  },
  {
    number: "02",
    name: "SAHA",
    summary: "Habersiz gizli müşteri ziyareti; standart kontrol listeleriyle kanıt toplama.",
    detail: [
      "Gerçek rezervasyon, gerçek misafir profiliyle giriş",
      "Modüle göre 1–3 gece konaklama",
      "Zaman damgalı gözlem kayıtlarının tutulması",
      "Departman bazlı standart kontrol listelerinin doldurulması",
    ],
  },
  {
    number: "03",
    name: "RAPOR",
    summary: "SWOT + ROI analizi; gelir kaçağı ve gelişim alanları net rakamlarla.",
    detail: [
      "Saha ziyareti sonrası 48 saat içinde ön bulgu paylaşımı",
      "10 iş günü içinde tam SWOT raporu",
      "Gelir kaçağı kalemleri ve departman karnesi",
      "Yönetim kuruluna sunuma hazır format",
    ],
  },
  {
    number: "04",
    name: "DÖNÜŞÜM",
    summary: "Departman bazlı personel eğitimi ve takip denetimi.",
    detail: [
      "Raporda çıkan gelişim alanlarına göre program kurgusu",
      "Yerinde eğitim, atölye ve rol canlandırma",
      "Ön/son test ile gelişimin ölçülmesi",
      "Takip denetimiyle kalıcılığın doğrulanması",
    ],
  },
];

const evidenceStandards = [
  {
    label: "KANIT 01",
    title: "Zaman damgalı gözlem kayıtları",
    description:
      "Her gözlem, gerçekleştiği saatle birlikte kayda geçer. Süre iddiaları — check-in, talep karşılama, servis — hatırlanan değil ölçülen değerlerdir.",
  },
  {
    label: "KANIT 02",
    title: "Standart kontrol listeleri",
    description:
      "Tüm denetçiler aynı listeyi kullanır. Bulgular tesisler ve ziyaretler arasında karşılaştırılabilir kalır, denetçinin kişisel beğenisine bağlı olmaz.",
  },
  {
    label: "KANIT 03",
    title: "Çift denetçi doğrulaması",
    description:
      "Rapora giren kritik bulgular ikinci bir denetçi tarafından teyit edilir. Tek kişinin izlenimi, tek başına kanıt sayılmaz.",
  },
] as const;

const faqItems: readonly FaqItem[] = [
  {
    question: "Denetçileriniz kim?",
    answer:
      "Sektörde üst düzey yöneticilik yapmış, aktif olarak otelcilikte çalışmayan profesyoneller.",
  },
  {
    question: "Ziyaret ne kadar sürer?",
    answer: "Modüle göre 1–3 gece konaklama.",
  },
  {
    question: "Personel anlayabilir mi?",
    answer: "Denetçiler gerçek misafir profiliyle, gerçek rezervasyonla gelir.",
  },
  {
    question: "Rapor ne zaman teslim edilir?",
    answer: "Ön bulgular 48 saat, tam SWOT raporu 10 iş günü.",
  },
  {
    question: "Verilerimiz güvende mi?",
    answer: "%100 KVKK uyumu + karşılıklı NDA.",
  },
];

export default function ProcessPage() {
  return (
    <main>
      <PageHero
        eyebrow="SÜREÇ"
        title="Keşiften dönüşüme, dört adım."
        lede="Denetim bir izlenim değil, tekrarlanabilir bir prosedürdür. Her adımın çıktısı bir sonrakinin girdisidir."
      />

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          {steps.map((step) => (
            <ProcessStep key={step.number} step={step} />
          ))}
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-20 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="METODOLOJİ"
              title="Kanıt Standardımız"
              description="Rapordaki her cümlenin arkasında, tekrar üretilebilir bir kayıt vardır."
            />
          </Reveal>
          <Reveal className="mt-12">
            <ul className="grid gap-4 md:grid-cols-3">
              {evidenceStandards.map((item) => (
                <li key={item.title}>
                  <DefinitionCard
                    label={item.label}
                    title={item.title}
                    description={item.description}
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <TrustBox title="KVKK uyumu ve karşılıklı NDA">
            <p>
              Denetim süreci karşılıklı bir gizlilik sözleşmesiyle başlar. Tesisinizin adı, bulgular
              ve raporun tamamı yalnızca sizinle paylaşılır; referans olarak kullanılmaz.
            </p>
            <p>
              Sahada toplanan veriler %100 KVKK uyumlu şekilde işlenir. Kayıtlar denetimin amacıyla
              sınırlı tutulur, personelin kimliğini hedef alan bir değerlendirme üretilmez —
              ölçülen kişi değil, süreçtir.
            </p>
          </TrustBox>
        </Reveal>
      </section>

      <section className="mx-auto max-w-content px-6 pb-24">
        <Reveal>
          <SectionHeading eyebrow="SSS" title="Sık sorulan sorular" />
        </Reveal>
        <Reveal className="mt-10">
          <Faq items={faqItems} />
        </Reveal>
        <Reveal className="mt-16">
          <ClosingCta title="Tesisinizin gerçek fotoğrafını çekelim.">
            <Button href="/moduller" size="lg">
              Teklif Alın
            </Button>
            <Button href="/hizmetler/gizli-musteri-denetimi" variant="ghost" size="lg">
              Denetim Hizmetini İnceleyin
            </Button>
          </ClosingCta>
        </Reveal>
      </section>
    </main>
  );
}
