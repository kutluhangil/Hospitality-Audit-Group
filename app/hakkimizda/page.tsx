import type { Metadata } from "next";

import { ClosingCta } from "@/components/services/ClosingCta";
import { MonoRibbon } from "@/components/services/MonoRibbon";
import { PageHero } from "@/components/services/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Otelciliği yönetmiş profesyonellerden oluşan bağımsız bir denetim ekibi: tarafsızlık, gizlilik ve ölçülebilirlik ilkeleriyle çalışıyoruz.",
};

export default function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="HAKKIMIZDA"
        title="Otelciliği yönetenler, şimdi ölçüyor."
        lede="Denetim ekibimiz, bugün ölçtüğü departmanları bir zamanlar yönetmiş profesyonellerden oluşuyor."
      />

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <div className="max-w-2xl space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
            <p>
              Denetçilerimiz bu sektörde yöneticilik yapmış isimlerden oluşuyor. Ön büro şefliğinden
              genel müdürlüğe, F&amp;B direktörlüğünden kat hizmetleri yönetimine kadar; bugün
              ölçtükleri süreçleri bir zamanlar kendileri kurdu, kendileri işletti. Bir check-in&apos;in
              neden uzadığını ya da bir reçetenin nerede sapmaya başladığını dışarıdan tahmin
              etmiyorlar; içeriden biliyorlar.
            </p>
            <p>
              Tarafsız kalabilmek için sahanın dışında duruyoruz. Denetçilerimiz aktif olarak
              otelcilikte çalışmıyor; denetlediğimiz tesislerle danışmanlık, tedarik ya da temsil
              ilişkimiz yok. Raporun kimseyi memnun etme görevi de yok — bulgular, rahatsız
              ettiğinde bile aynı cümlelerle yazılır. Bir denetim şirketinin satabileceği tek şey,
              söylediğine güvenilmesidir.
            </p>
            <p>
              Bu yüzden yorum değil ölçüm sunuyoruz. &quot;Servis yavaştı&quot; bir izlenimdir; servisin kaç
              dakika sürdüğü, standarttan ne kadar saptığı ve bu sapmanın neye mal olduğu ise bir
              bulgudur. Her cümlenin arkasına zaman damgalı bir kayıt, standart bir kontrol listesi
              ve ikinci bir denetçinin teyidini koyarız. Toplantıda tartışılan şey bizim fikrimiz
              değil, sizin rakamınız olsun.
            </p>
          </div>
        </Reveal>

        <Reveal className="mt-16">
          <MonoRibbon>TARAFSIZLIK · GİZLİLİK · ÖLÇÜLEBİLİRLİK</MonoRibbon>
        </Reveal>
      </section>

      <section className="border-y border-line bg-bg-soft">
        <div className="mx-auto max-w-content px-6 py-20 md:py-24">
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
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 py-20 md:py-24">
        <Reveal>
          <ClosingCta
            title="Tesisinizin gerçek fotoğrafını çekelim."
            description="İhtiyacınız olan modülleri seçin, yatırımınızı doğrudan öncelikli alanlarınıza yönlendirin."
          >
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
