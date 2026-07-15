import type { Metadata } from "next";

import { ClosingCta } from "@/components/services/ClosingCta";
import { DefinitionCard } from "@/components/services/DefinitionCard";
import { ModuleQuickLinks } from "@/components/services/ModuleQuickLinks";
import { PageHero } from "@/components/services/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Gizli Müşteri ile Otel Denetimi",
  description:
    "Rezervasyondan check-out'a misafir deneyimi döngüsünün tamamını habersiz ve tarafsız ölçüyoruz: karşılama, ön büro, kat hizmetleri, F&B ve gelir kaçağı denetimi.",
};

const measurements = [
  {
    title: "Karşılama ve İlk İzlenim",
    description: "rezervasyon doğruluğu, valet/bellboy hızı, check-in protokol uyumu",
  },
  {
    title: "Ön Büro Verimliliği",
    description: "problem çözme refleksleri, upselling süreç yönetimi",
  },
  {
    title: "Kat Hizmetleri Hassasiyeti",
    description: "oda hijyeni, buklet düzeni, talep karşılama süresi",
  },
  {
    title: "Check-Out ve Uğurlama",
    description: "doğru faturalandırma, loyalty yönlendirme, uğurlama nezaketi",
  },
] as const;

const revenueChecks = [
  {
    title: "Gastronomi & Servis",
    description:
      "Restoran, à la carte ve oda servisinde servis akışı, sunum kalitesi, servis hızı ve menü tavsiye satış becerisi ölçülür.",
  },
  {
    title: "Bar & Reçete Güvencesi",
    description:
      "Bar operasyonunda reçete gramajı ve porsiyon kontrolü denetlenir; standarttan sapmalar ve gelir koruma süreçlerindeki boşluklar rakamla raporlanır.",
  },
] as const;

const deliverables = [
  {
    label: "ÇIKTI 01",
    title: "Yönetim kuruluna hazır SWOT raporu",
    description:
      "Sahada toplanan kanıtlar; güçlü yönler, zayıf yönler, fırsatlar ve tehditler başlıkları altında, sunuma hazır biçimde derlenir.",
  },
  {
    label: "ÇIKTI 02",
    title: "ROI analizi",
    description:
      "Tespit edilen gelir kaçağı kalemleri ve önerilen iyileştirmelerin getirisi, denetim yatırımının karşısına konur.",
  },
  {
    label: "ÇIKTI 03",
    title: "Departman karnesi",
    description:
      "Her departman, denetlenen standartlar üzerinden ayrı ayrı puanlanır; gelişim alanları departman bazında adreslenir.",
  },
] as const;

export default function MysteryShopperAuditPage() {
  return (
    <main>
      <PageHero
        eyebrow="GİZLİ MÜŞTERİ DENETİMİ"
        title="Gizli Müşteri ile Otel Denetimi"
        lede="Rezervasyondan check-out'a, misafir deneyimi döngüsünün tamamını habersiz ve tarafsız ölçeriz."
      />

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="DENETİM KAPSAMI"
            title="Neyi ölçeriz"
            description="Misafir yolculuğunun her teması, standart kontrol listeleriyle ve zaman damgalı kayıtlarla ölçülür."
          />
        </Reveal>
        <Reveal className="mt-12">
          <ul className="grid gap-4 md:grid-cols-2">
            {measurements.map((item) => (
              <li key={item.title}>
                <DefinitionCard title={item.title} description={item.description} />
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-20 md:py-24">
          <Reveal>
            <SectionHeading
              eyebrow="MODÜL B"
              title="F&B ve Gelir Kaçağı"
              description="Yiyecek ve içecek operasyonu, hem misafir deneyiminin hem de gelir kaybının en yoğun yaşandığı alandır."
            />
          </Reveal>
          <Reveal className="mt-12">
            <ul className="grid gap-4 md:grid-cols-2">
              {revenueChecks.map((item) => (
                <li key={item.title}>
                  <DefinitionCard title={item.title} description={item.description} />
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <SectionHeading
            eyebrow="TESLİMAT"
            title="Çıktınız"
            description="Denetim, izlenim değil belge üretir. Sahadan dönen her bulgu üç çıktıda toplanır."
          />
        </Reveal>
        <Reveal className="mt-12">
          <ul className="grid gap-4 md:grid-cols-3">
            {deliverables.map((item) => (
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
      </section>

      <section className="mx-auto max-w-content px-6 pb-24">
        <Reveal>
          <SectionHeading
            eyebrow="İLGİLİ MODÜLLER"
            title="Denetimi modül modül kurun"
            description="İhtiyacınız olan modülleri özgürce seçin, yatırımınızı doğrudan öncelikli alanlarınıza yönlendirin."
          />
        </Reveal>
        <Reveal className="mt-10">
          <ModuleQuickLinks codes={["A", "B", "C", "D"]} />
        </Reveal>
        <Reveal className="mt-16">
          <ClosingCta title="Tesisinizin gerçek fotoğrafını çekelim.">
            <Button href="/moduller" size="lg">
              Teklif Alın
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
