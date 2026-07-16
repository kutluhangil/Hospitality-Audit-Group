import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { LegalLink, LegalList, LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { LocaleParams } from "@/i18n/routing";
import { company, hasCorporateIdentity } from "@/lib/company-data";
import { VAT_RATE } from "@/lib/modules-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Mesafeli Satış Sözleşmesi",
  description:
    "Hospitality Audit Group denetim hizmetlerinin site üzerinden kart ile satın alınmasına ilişkin mesafeli satış sözleşmesi: taraflar, hizmet bedeli, ifa şekli, cayma hakkı ve uyuşmazlık çözümü.",
};

/**
 * The identifiers a distance-selling contract must name. Every one of them is a
 * state registry number that ends up on an invoice, so none were invented: they
 * are null in company-data until the real values exist, and the block below says
 * so out loud rather than printing a plausible-looking fiction.
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

/** Contact details that do exist today; they are true regardless of the registry gap. */
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
            SATICI&apos;nın ticaret unvanı, merkez adresi, ticaret sicil numarası, MERSİS numarası ve
            vergi dairesi/numarası bu metinde henüz yer almamaktadır. Bu bilgiler resmî sicil
            kayıtlarıdır; uydurulmamış, boş bırakılmıştır. Sözleşme, satış yoluna açılmadan önce
            gerçek sicil bilgileriyle tamamlanacaktır.
          </p>
        </Card>
      )}
    </>
  );
}

const buyerUndertakings = [
  "Sözleşme konusu hizmetin temel nitelikleri, satış bedeli, ödeme şekli, ifa koşulları ve cayma hakkına ilişkin ön bilgileri satın alma işleminden önce okuduğunu ve bilgi sahibi olduğunu",
  "Bu bilgileri elektronik ortamda teyit ettiğini ve sonrasında ödeme işlemine başladığını",
  "Sipariş sırasında verdiği fatura, iletişim ve adres bilgilerinin doğru ve eksiksiz olduğunu; hatalı bilgiden doğan gecikme ve masrafların kendisine ait olacağını",
  "Denetim ziyaretinin gizli müşteri yöntemiyle yapıldığını; ziyaretin tarihini, denetçinin kimliğini veya ziyaretin varlığını tesis personeline duyurmayacağını",
  "Tesis personeline yapılacak duyurunun denetimin ölçüm değerini ortadan kaldıracağını ve bu hâlde hizmetin ifa edilmiş sayılacağını",
  "Denetim ziyaretinin gerçekleştirilebilmesi için gerekli konaklama/rezervasyon koşullarını mutabık kalınan takvimde sağlayacağını",
] as const;

const generalTerms = [
  "SATICI, sözleşme konusu hizmeti eksiksiz, siparişte belirtilen niteliklere uygun ve mevzuatın gerektirdiği belgelerle birlikte ifa etmeyi kabul eder.",
  "Sözleşme konusu hizmetin ifası için bu sözleşmenin elektronik ortamda onaylanmış ve bedelin ALICI'nın tercih ettiği ödeme yöntemiyle tahsil edilmiş olması gerekir.",
  "Bedelin herhangi bir sebeple ödenmemesi veya banka kayıtlarında iptal edilmesi hâlinde SATICI, hizmeti ifa yükümlülüğünden kurtulmuş sayılır.",
  "SATICI, sipariş konusu hizmetin ifasının imkânsızlaştığı hâllerde durumu öğrendiği tarihten itibaren üç gün içinde ALICI'ya yazılı olarak bildirir ve tahsil edilen tutarın tamamını en geç bildirimden itibaren on dört gün içinde iade eder.",
] as const;

export default async function MesafeliSatisSozlesmesiPage({ params }: { params: Promise<LocaleParams> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage title="Mesafeli Satış Sözleşmesi" updated="16 Temmuz 2026">
      <LegalSection title="1. Taraflar">
        <p>
          İşbu Mesafeli Satış Sözleşmesi (&quot;Sözleşme&quot;), aşağıda bilgileri yer alan SATICI
          ile ALICI arasında, aşağıda belirtilen hüküm ve şartlar çerçevesinde elektronik ortamda
          kurulmuştur.
        </p>
        <p>
          <strong>SATICI</strong>
        </p>
        <SellerIdentity />
        <p>
          <strong>ALICI</strong>
        </p>
        <p>
          Sipariş sırasında fatura ve iletişim bilgilerini beyan eden gerçek veya tüzel kişidir.
          ALICI&apos;nın beyan ettiği bilgiler, sipariş kaydında ve düzenlenen faturada yer alır ve
          bu Sözleşme&apos;nin ayrılmaz parçasıdır.
        </p>
      </LegalSection>

      <LegalSection title="2. Sözleşmenin Konusu">
        <p>
          İşbu Sözleşme&apos;nin konusu, ALICI&apos;nın {siteConfig.url} adresindeki web sitesi
          üzerinden elektronik ortamda siparişini verdiği, aşağıda nitelikleri ve satış bedeli
          belirtilen denetim ve/veya eğitim hizmetinin satışı ile ifasına ilişkin olarak tarafların
          hak ve yükümlülüklerinin belirlenmesidir.
        </p>
        <p>
          Sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
          Yönetmeliği hükümleri dikkate alınarak hazırlanmıştır. Bu hükümlerin ALICI&apos;ya
          uygulanabilirliği bakımından aşağıda 9. maddedeki açıklama saklıdır.
        </p>
      </LegalSection>

      <LegalSection title="3. Sözleşme Konusu Hizmet ve Bedeli">
        <p>
          Sözleşme konusu hizmet, ALICI&apos;nın belirttiği tesiste, önceden haber verilmeksizin
          gerçekleştirilen gizli müşteri denetim ziyareti ve bu ziyaretin ardından teslim edilen
          denetim raporudur. Hizmetin kapsamı, ALICI&apos;nın siparişinde seçtiği modüller ile
          sınırlıdır. Modüllerin kapsamı ve kriterleri{" "}
          <LegalLink href="/moduller">Modüller</LegalLink> sayfasında yayımlanmıştır ve bu
          Sözleşme&apos;nin ekidir.
        </p>
        <p>
          Hizmetin türü, adedi ve birim bedeli ile toplam satış bedeli, sipariş özetinde ve sipariş
          onayında yer aldığı şekildedir. Sitede yayımlanan ve sipariş özetinde gösterilen tüm
          fiyatlar Türk Lirası cinsinden olup <strong>%{VAT_RATE * 100} KDV dahildir</strong>. Ayrıca
          bir vergi veya masraf talep edilmez. Hizmetin niteliklerine ve bedeline ilişkin ayrıntılı
          bilgi <LegalLink href="/on-bilgilendirme">Ön Bilgilendirme Formu</LegalLink> sayfasında yer
          alır.
        </p>
        <p>
          Ödeme, ALICI&apos;nın kredi/banka kartı ile 3D Secure doğrulaması üzerinden peşin olarak
          yapılır. Kart bilgileri SATICI&apos;nın sunucularına hiçbir aşamada ulaşmaz; doğrudan ödeme
          kuruluşunun kendi sayfasına iletilir. Ayrıntı için{" "}
          <LegalLink href="/gizlilik-politikasi">Gizlilik Politikası</LegalLink> sayfasına bakınız.
        </p>
      </LegalSection>

      <LegalSection title="4. Genel Hükümler">
        <LegalList items={generalTerms} />
        <p>
          Denetim raporu ve bulguları gizlidir; SATICI, ALICI&apos;nın yazılı izni olmaksızın tesis
          adını, bulguları veya rapor içeriğini üçüncü kişilerle paylaşmaz, referans olarak
          kullanmaz.
        </p>
      </LegalSection>

      <LegalSection title="5. İfa Şekli ve Süresi">
        <p>
          Hizmetin ifası iki aşamadan oluşur ve bu ayrım cayma hakkı bakımından belirleyicidir:
        </p>
        <LegalList
          items={[
            "Denetim tarihinin belirlenmesi: Ödemenin tamamlanmasının ardından SATICI, ALICI ile iletişime geçerek denetim ziyaretinin yapılacağı tarih aralığını mutabakatla belirler. Gizli müşteri yönteminin gereği olarak kesin gün ve saat ALICI'ya bildirilmez.",
            "Denetim ziyareti: Denetçinin tesise misafir sıfatıyla giriş (check-in) yapmasıyla hizmetin ifası başlamış sayılır.",
            "Raporlama: Ziyaretin tamamlanmasının ardından denetim raporu, mutabık kalınan süre içinde ALICI'nın siparişte belirttiği e-posta adresine iletilir.",
          ]}
        />
        <p>
          Denetim ziyareti, ödemenin tamamlanmasından itibaren en geç otuz gün içinde
          gerçekleştirilir. Tesisin doluluk durumu, sezon veya ALICI&apos;nın talebi nedeniyle bu
          sürenin uzaması hâlinde yeni takvim taraflarca yazılı olarak mutabık kalınarak belirlenir.
        </p>
      </LegalSection>

      <LegalSection title="6. ALICI'nın Beyan ve Taahhütleri">
        <p>ALICI, bu Sözleşme&apos;yi elektronik ortamda onaylamakla:</p>
        <LegalList items={buyerUndertakings} />
      </LegalSection>

      <LegalSection title="7. Cayma Hakkı">
        <p>
          Sözleşme konusu hizmet, ifası denetçinin tesise giriş yapmasıyla başlayan bir hizmettir. Bu
          nedenle cayma hakkı, ifanın başlayıp başlamadığına göre iki farklı şekilde uygulanır.
        </p>
        <p>
          <strong>a) Denetim tarihi belirlenmeden önce — cayma hakkı vardır.</strong> ALICI, sipariş
          tarihinden itibaren <strong>on dört gün</strong> içinde ve denetim ziyaretinin tarihi
          taraflarca belirlenmemişken, hiçbir gerekçe göstermeksizin ve cezai şart ödemeksizin
          sözleşmeden cayabilir. Cayma bildiriminin SATICI&apos;ya ulaştığı tarihten itibaren on dört
          gün içinde tahsil edilen tutarın tamamı, ödemede kullanılan kart veya hesaba iade edilir.
        </p>
        <p>
          <strong>b) Denetim tarihi belirlendikten sonra — cayma hakkı devam eder, iptal koşullara
          bağlıdır.</strong> Denetim ziyaretinin tarihi taraflarca belirlendikten sonra da on dört
          günlük süre içinde cayma hakkı kullanılabilir; ancak SATICI&apos;nın denetçi ataması,
          rezervasyon ve seyahat planlaması nedeniyle katlandığı masraflar bakımından{" "}
          <LegalLink href="/iptal-iade">İptal &amp; İade Politikası</LegalLink> sayfasındaki iptal
          basamakları uygulanır.
        </p>
        <p>
          <strong>c) Denetim ziyareti başladıktan sonra — cayma hakkı yoktur.</strong> Mesafeli
          Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca, ALICI&apos;nın onayı ile ifasına
          başlanan hizmetlere ilişkin sözleşmelerde cayma hakkı kullanılamaz. Denetçinin tesise
          misafir sıfatıyla giriş yapmasıyla hizmetin ifası başlamış olur; bu andan itibaren cayma
          hakkı sona erer ve bedel iadesi yapılmaz. Bu, hizmetin doğasından kaynaklanır: ziyaret
          gerçekleştiği anda ölçüm yapılmış, denetçi kaynağı ve seyahat maliyeti harcanmış olur ve
          yapılan gözlem geri alınamaz.
        </p>
        <p>
          <strong>ALICI&apos;nın açık onayı.</strong> ALICI, ödeme adımında bu Sözleşme&apos;yi
          onaylamakla, denetim ziyaretinin on dört günlük cayma süresi dolmadan
          gerçekleştirilebileceğini kabul eder ve hizmetin ifasına bu süre içinde başlanmasına{" "}
          <strong>açıkça onay verir</strong>. ALICI ayrıca, ifanın başlamasıyla birlikte cayma
          hakkını kaybedeceği konusunda bilgilendirildiğini beyan eder. Bu onay alınmadan ödeme adımı
          tamamlanamaz.
        </p>
        <p>
          Cayma bildirimi, süresi içinde{" "}
          <LegalLink href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </LegalLink>{" "}
          adresine yazılı olarak iletilir. İade koşullarının ayrıntısı ve mücbir sebep hâlleri{" "}
          <LegalLink href="/iptal-iade">İptal &amp; İade Politikası</LegalLink> sayfasında
          düzenlenmiştir.
        </p>
      </LegalSection>

      <LegalSection title="8. Uyuşmazlık Çözümü">
        <p>
          İşbu Sözleşme&apos;den doğan uyuşmazlıklarda ALICI, Ticaret Bakanlığı tarafından her yıl
          ilan edilen parasal sınırlar dâhilinde kendi yerleşim yerindeki veya işlemin yapıldığı
          yerdeki <strong>Tüketici Hakem Heyetleri</strong>&apos;ne, bu sınırların üzerindeki
          uyuşmazlıklarda ise <strong>Tüketici Mahkemeleri</strong>&apos;ne başvurabilir.
        </p>
        <p>
          ALICI&apos;nın 6502 sayılı Kanun anlamında tüketici sayılmadığı hâllerde uyuşmazlıklarda
          genel hükümler uygulanır ve yetkili yargı mercii genel yetki kurallarına göre belirlenir.
          Bu ayrım için aşağıdaki 9. maddeye bakınız.
        </p>
      </LegalSection>

      <LegalSection title="9. Tüketici Sıfatı — Hukuk Danışmanına Not">
        <p>
          6502 sayılı Kanun, tüketiciyi &quot;ticari veya mesleki olmayan amaçlarla hareket eden
          gerçek veya tüzel kişi&quot; olarak tanımlar. Bu sitedeki hizmet, otel ve konaklama
          tesislerine yönelik bir işletme hizmetidir ve alıcı fiilen ticari amaçla hareket
          etmektedir. Bu nedenle satışların büyük bölümünde ALICI&apos;nın{" "}
          <strong>tüketici sıfatını taşımaması</strong> beklenir; bu hâlde Tüketicinin Korunması
          Hakkında Kanun ile Mesafeli Sözleşmeler Yönetmeliği&apos;nin cayma hakkı ve Tüketici Hakem
          Heyeti&apos;ne başvuru hükümleri bağlayıcı olmayabilir.
        </p>
        <p>
          Bu metin, tüketici mevzuatının koruyucu hükümlerini{" "}
          <strong>ALICI lehine ve gönüllü olarak</strong> uygulayacak biçimde kaleme alınmıştır.
          Hangi hükümlerin kanunen bağlayıcı olduğu, hangilerinin sözleşmesel taahhüt niteliği
          taşıdığı ve bireysel alıcı ihtimalinin nasıl ele alınacağı{" "}
          <strong>hukuk danışmanı tarafından netleştirilmelidir</strong>. Bu sayfa hukuki görüş
          değildir; inceleme için hazırlanmış bir taslaktır.
        </p>
      </LegalSection>

      <LegalSection title="10. Yürürlük">
        <p>
          ALICI, ödeme adımında bu Sözleşme&apos;nin tüm koşullarını okuduğunu, anladığını ve kabul
          ettiğini elektronik ortamda onaylar. Sözleşme, bu onayın verilmesi ve ödemenin tahsil
          edilmesiyle birlikte kurulur ve yürürlüğe girer. Sözleşme&apos;nin bir örneği,
          ALICI&apos;nın siparişte belirttiği e-posta adresine sipariş onayı ile birlikte iletilir ve
          SATICI nezdinde saklanır.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
