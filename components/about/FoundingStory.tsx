import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/lib/company-data";

/**
 * PLACEHOLDER NARRATIVE.
 *
 * Written to give the page its real shape and voice, not because any of it is
 * known to be true. The dates, the city and the framing all come from
 * lib/company-data.ts and must be replaced before launch. The registry block
 * and the facility profiles are handled differently — those are not invented at
 * all, they simply do not render until they are real.
 */
export function FoundingStory() {
  return (
    <Reveal>
      <div className="max-w-2xl space-y-6 text-base leading-relaxed text-ink-muted md:text-lg">
        <p>
          {company.merkez}&apos;da, {company.kurulusYili} yılında, aynı sorunu yıllarca içeriden
          görmüş birkaç otelcinin masasında başladı. Hepsi kendi tesisinde marka standardını
          yazmış, eğitimini vermiş, denetimini kurmuştu. Ve hepsi aynı şeyi biliyordu: o standardın
          gece iki buçukta, resepsiyonda, kimse bakmıyorken ne hâle geldiğini kimse ölçmüyordu.
        </p>
        <p>
          İç denetim bunu yakalayamıyor. Personel kendisini kimin, ne zaman izlediğini bilir; müdür
          lobiye indiğinde operasyon zaten toparlanmıştır. Departman müdürleri de kendi
          departmanlarını tarafsız değerlendiremez — kimse kendi sınavını okuyamaz. Geriye tek
          bakış açısı kalıyor: misafirin gözü. Ölçülmeyen tek yer de tam olarak orası.
        </p>
        <p>
          Bunun üzerine masanın tarafını değiştirdik. Bugün tesislere yönetici olarak değil, misafir
          olarak giriyoruz. Gerçek rezervasyonla geliyor, gerçek gece konaklıyor, gerçek fatura
          ödüyoruz. Kimse bizi beklemiyor, kimse bizim için hazırlanmıyor. Gördüğümüz şey,
          misafirinizin gördüğü şey.
        </p>
        <p>
          Bir denetim şirketinin satabileceği tek şey, söylediğine güvenilmesidir. Bu yüzden hiçbir
          tesisle danışmanlık, tedarik ya da temsil ilişkimiz yok — bulguyu yazan elin, o bulgudan
          çıkar sağlaması mümkün olmasın diye. Raporun kimseyi memnun etme görevi de yok. Rahatsız
          ettiğinde bile aynı cümlelerle yazılır.
        </p>
      </div>
    </Reveal>
  );
}
