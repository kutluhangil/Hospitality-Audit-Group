import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import {
  LegalLink,
  LegalList,
  LegalPage,
  LegalSection,
} from "@/components/legal/LegalPage";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { LocaleParams } from "@/i18n/routing";
import { company, hasCorporateIdentity } from "@/lib/company-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "İptal & İade Politikası",
  description:
    "Denetim ziyareti öncesi iptal koşulları, tarih belirlendikten sonra uygulanan kesinti basamakları, ziyaret başladıktan sonra iade yapılamamasının sebebi, iade süresi ve mücbir sebep hâlleri.",
};

/**
 * Same registry identifiers the contract and the pre-sale form name, read from
 * the same source. None of them are invented: they are null in company-data
 * until the real values exist.
 */
const sellerFields: readonly (readonly [string, string | null])[] = [
  ["Unvan", company.ticaretUnvani],
  ["Adres", company.merkezAdres],
  ["Ticaret Sicil No", company.ticaretSicilNo],
  ["MERSİS No", company.mersisNo],
  ["Vergi Dairesi", company.vergiDairesi],
  ["Vergi No", company.vergiNo],
];

function knownSellerFields(): readonly string[] {
  return sellerFields
    .filter((field): field is readonly [string, string] => field[1] !== null)
    .map(([label, value]) => `${label}: ${value}`);
}

const sellerContact: readonly string[] = [
  `Telefon: ${siteConfig.contact.phone}`,
  `E-posta: ${siteConfig.contact.email}`,
  `Web sitesi: ${siteConfig.url}`,
];

function SellerIdentity() {
  const known = knownSellerFields();

  return (
    <>
      {known.length > 0 ? <LegalList items={known} /> : null}
      <LegalList items={sellerContact} />
      {hasCorporateIdentity() ? null : (
        <Card tone="accent" className="border-2">
          <Eyebrow>Satıcı bilgileri tamamlanmadı</Eyebrow>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Satıcının ticaret unvanı, merkez adresi, ticaret sicil numarası,
            MERSİS numarası ve vergi dairesi/numarası bu metinde henüz yer
            almamaktadır. Bu bilgiler resmî sicil kayıtlarıdır; uydurulmamış,
            boş bırakılmıştır. Metin, satış yoluna açılmadan önce gerçek sicil
            bilgileriyle tamamlanacaktır.
          </p>
        </Card>
      )}
    </>
  );
}

/**
 * PLACEHOLDER LADDER. The cut-offs and percentages below are a reasonable
 * starting point, not a decision: they were chosen to track the real cost the
 * cancellation lands on (auditor assignment, hotel booking, travel), which is
 * the only defensible basis for a deduction. The owner sets the final figures,
 * and a deduction that exceeds the actual loss is disputable.
 */
const cancellationLadder = [
  "Denetim tarihi henüz belirlenmemişken: kesinti yok — tahsil edilen tutarın tamamı iade edilir.",
  "Ziyarete 15 gün ve daha uzun süre kala: kesinti yok — tutarın tamamı iade edilir.",
  "Ziyarete 8–14 gün kala: %25 kesinti — tutarın %75'i iade edilir.",
  "Ziyarete 3–7 gün kala: %50 kesinti — tutarın %50'si iade edilir.",
  "Ziyarete 48 saatten az kala: iade yapılmaz — denetçi ataması, konaklama rezervasyonu ve seyahat masrafları bu aşamada geri alınamaz durumdadır.",
  "Denetçi tesise giriş yaptıktan sonra: iade yapılmaz — hizmetin ifası başlamıştır.",
] as const;

const forceMajeureEvents = [
  "Doğal afet, yangın, sel, deprem",
  "Salgın hastalık ve buna bağlı seyahat veya konaklama kısıtlamaları",
  "Resmî makamların kararıyla tesisin veya ulaşımın kapatılması",
  "Savaş, seferberlik, terör olayları ve genel grev",
  "Tarafların kontrolü dışında kalan ve ziyareti fiilen imkânsız kılan benzer hâller",
] as const;

export default async function IptalIadePage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tSite = await getTranslations({ locale, namespace: "site" });

  return (
    <LegalPage title="İptal & İade Politikası" updated="16 Temmuz 2026">
      <LegalSection title="1. Kapsam">
        <p>
          Bu politika, {siteConfig.url} adresi üzerinden kart ile satın alınan
          denetim ve eğitim hizmetlerinin iptali ile bedel iadesine ilişkin
          koşulları düzenler.{" "}
          <LegalLink href="/mesafeli-satis-sozlesmesi">
            Mesafeli Satış Sözleşmesi
          </LegalLink>{" "}
          ve{" "}
          <LegalLink href="/on-bilgilendirme">Ön Bilgilendirme Formu</LegalLink>{" "}
          ile birlikte uygulanır ve bu metinlerin ayrılmaz parçasıdır.
        </p>
        <p>
          Teklif yoluyla ilerleyen ve karttan tahsilat yapılmayan taleplerde bu
          politika uygulanmaz; bu tür işlerin koşulları tarafların imzaladığı
          ayrı sözleşmede belirlenir.
        </p>
      </LegalSection>

      <LegalSection title="2. İptalin Dayandığı Ölçüt: Denetim Tarihi">
        <p>
          Bu hizmette iade koşullarını belirleyen şey, siparişin üzerinden geçen
          süre değil <strong>denetim ziyaretine kalan süredir</strong>. Sebebi
          somuttur: satın alma anında satıcı tarafında bir maliyet doğmaz, ancak
          ziyaret takvime alındığı anda bir denetçi o tarihe ayrılır, tesiste
          konaklama rezerve edilir ve seyahat planlanır. Ziyaret tarihi
          yaklaştıkça bu masraflar geri alınamaz hâle gelir.
        </p>
        <p>
          İptal talebi,{" "}
          <LegalLink href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </LegalLink>{" "}
          adresine yazılı olarak iletilir. Aşağıdaki basamakların uygulanmasında{" "}
          <strong>talebin bu adrese ulaştığı an</strong> esas alınır.
        </p>
      </LegalSection>

      <LegalSection title="3. İptal Basamakları">
        <Card tone="accent" className="border-2">
          <Eyebrow>
            Oranlar taslaktır — işletme sahibi tarafından belirlenecek
          </Eyebrow>
          <p className="mt-3 text-base leading-relaxed text-ink">
            Aşağıdaki gün aralıkları ve kesinti oranları bir{" "}
            <strong>öneridir</strong>, karar değildir. Yayına almadan önce
            işletme sahibi tarafından gerçek denetçi ve seyahat maliyetlerine
            göre belirlenmeli, hukuk danışmanınca teyit edilmelidir. Fiili
            zararı aşan bir kesinti, alıcı tarafından itiraza açıktır.
          </p>
        </Card>
        <LegalList items={cancellationLadder} />
        <p>
          Kesinti oranı, siparişin tamamı üzerinden değil, iptal edilen hizmet
          kalemleri üzerinden hesaplanır. Kısmi iptal hâlinde iptal edilmeyen
          kalemler yürürlükte kalır.
        </p>
      </LegalSection>

      <LegalSection title="4. Ziyaret Başladıktan Sonra İade Yapılmaz">
        <p>
          Denetçinin tesise misafir sıfatıyla giriş (check-in) yapmasıyla
          hizmetin ifası başlamış sayılır.{" "}
          <strong>Bu andan itibaren iptal ve iade mümkün değildir.</strong>
        </p>
        <p>
          Bunun sebebi hizmetin doğasıdır: ziyaret başladığı anda ölçüm
          yapılmış, denetçi kaynağı ve seyahat maliyeti harcanmış olur ve
          yapılan gözlem geri alınamaz. Mesafeli Sözleşmeler
          Yönetmeliği&apos;nin 15. maddesi de, alıcının onayı ile ifasına
          başlanan hizmetlerde cayma hakkının kullanılamayacağını düzenler.
          Alıcı, ödeme adımında ifanın cayma süresi içinde başlamasına açıkça
          onay verir.
        </p>
        <p>
          Raporun bulgularından memnun olunmaması bir iade sebebi değildir;
          denetim, sonucu önceden taahhüt edilen bir hizmet değil, ölçüm
          hizmetidir. Ancak raporun sipariş edilen modülleri kapsamaması,
          kriterlerin eksik ölçülmesi veya bulguların kanıta bağlanmaması
          hâlinde alıcı ayıplı ifa hükümlerine başvurabilir; bu durumda
          öncelikle ziyaret ücretsiz olarak yenilenir.
        </p>
      </LegalSection>

      <LegalSection title="5. Erteleme — İptale Alternatif">
        <p>
          Denetim tarihinin iptal yerine ertelenmesi tercih edilebilir. Ziyarete{" "}
          <strong>7 günden fazla süre</strong> kala talep edilen ilk erteleme
          kesintisiz yapılır ve yeni tarih taraflarca mutabakatla belirlenir.
          Sonraki erteleme talepleri, o an geçerli olan iptal basamağına göre
          değerlendirilir.
        </p>
        <p>
          Erteleme süresi de bu bölümde bir taslaktır; işletme sahibi tarafından
          belirlenecektir.
        </p>
      </LegalSection>

      <LegalSection title="6. İade Süresi ve Yöntemi">
        <p>
          İade, <strong>ödemenin yapıldığı kartın kendisine</strong> yapılır.
          Nakit, havale veya başka bir hesaba iade yapılamaz; bu, kart
          kuruluşlarının kuralıdır ve satıcının tercihi değildir.
        </p>
        <LegalList
          items={[
            "İade tutarı, iptal talebinin ulaşmasından itibaren en geç on dört gün içinde ödeme kuruluşuna iletilir.",
            "Tutarın kart ekstresine yansıma süresi bankanıza bağlıdır ve iadenin gönderilmesinden sonra iki ile üç haftayı bulabilir. Bu süre satıcının kontrolünde değildir.",
            "İade edilen tutar, KDV dahil olarak tahsil edilen tutarın ilgili oranına karşılık gelir; iadeden ayrıca bir kesinti veya işlem masrafı düşülmez.",
            "Fatura düzenlenmişse iadeye ilişkin iade faturası veya gerekli belge, alıcının siparişte belirttiği e-posta adresine iletilir.",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Mücbir Sebep">
        <p>
          Aşağıdaki hâllerden birinin ziyaretin gerçekleştirilmesini engellemesi
          durumunda hiçbir taraf temerrüde düşmüş sayılmaz ve iptal basamakları
          uygulanmaz:
        </p>
        <LegalList items={forceMajeureEvents} />
        <p>
          Mücbir sebep hâlinde ziyaret öncelikle kesintisiz olarak ertelenir.
          Engelin ortadan kalkmaması veya taraflarca yeni bir tarihte mutabık
          kalınamaması hâlinde sözleşme sona erer ve tahsil edilen tutarın
          tamamı, hiçbir kesinti yapılmaksızın 6. bölümdeki usulle iade edilir.
        </p>
        <p>
          Mücbir sebep, ziyaret başladıktan sonra ortaya çıkarsa hizmetin ifa
          edilen kısmı bakımından iade yapılmaz; ifa edilemeyen kısım için
          taraflar mutabakatla çözüm belirler.
        </p>
      </LegalSection>

      <LegalSection title="8. Satıcı Bilgileri ve Başvuru">
        <SellerIdentity />
        <p>
          İptal, iade ve erteleme talepleriniz ile bu politikaya ilişkin
          itirazlarınızı{" "}
          <LegalLink href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </LegalLink>{" "}
          adresine veya {siteConfig.contact.phone} numarasına ({tSite("hours")})
          iletebilirsiniz. Uyuşmazlık hâlinde başvurulabilecek merciler{" "}
          <LegalLink href="/mesafeli-satis-sozlesmesi">
            Mesafeli Satış Sözleşmesi
          </LegalLink>
          &apos;nin 8. maddesinde belirtilmiştir.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
