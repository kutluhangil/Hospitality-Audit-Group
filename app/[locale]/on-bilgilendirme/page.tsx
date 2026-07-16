import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { LegalLink, LegalList, LegalPage, LegalSection } from "@/components/legal/LegalPage";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { LocaleParams } from "@/i18n/routing";
import { company, hasCorporateIdentity } from "@/lib/company-data";
import { formatPrice } from "@/lib/cart-math";
import {
  CATALOGUE_ORDER,
  PRICING_NOTE,
  SCALE_NOTE,
  VAT_RATE,
  priceOf,
  titleOf,
} from "@/lib/modules-data";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Ön Bilgilendirme Formu",
  description:
    "Mesafeli Sözleşmeler Yönetmeliği uyarınca satış öncesi bilgilendirme: satıcı bilgileri, denetim hizmetinin temel nitelikleri, KDV dahil fiyat, ödeme ve ifa koşulları, cayma hakkı ve şikâyet yolları.",
};

/**
 * Same registry identifiers the contract names, read from the same source. None
 * of them are invented: they are null in company-data until the real values
 * exist, and the notice below states that instead of printing a fiction.
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
            Satıcının ticaret unvanı, merkez adresi, ticaret sicil numarası, MERSİS numarası ve vergi
            dairesi/numarası bu formda henüz yer almamaktadır. Bu bilgiler resmî sicil kayıtlarıdır;
            uydurulmamış, boş bırakılmıştır. Form, satış yoluna açılmadan önce gerçek sicil
            bilgileriyle tamamlanacaktır.
          </p>
        </Card>
      )}
    </>
  );
}

/**
 * The tariff is derived from modules-data rather than retyped: a price that
 * disagrees with the module page is a pre-contractual misstatement, not a typo.
 */
function priceRows(): readonly string[] {
  return CATALOGUE_ORDER.map((id) => `${titleOf(id)} — ${formatPrice(priceOf(id))}`);
}

const serviceCharacteristics = [
  "Hizmet, ALICI'nın belirttiği konaklama tesisinde, personele önceden haber verilmeksizin gerçekleştirilen bir gizli müşteri denetim ziyaretidir.",
  "Denetçi, tesise misafir sıfatıyla giriş yapar ve sipariş edilen modüllerin kriterlerini sahada ölçer.",
  "Her kriter sahada Evet / Hayır / Uygulanamaz olarak işaretlenir ve kronometre, gözlem, ses kaydı, evrak kontrolü gibi bir kanıt türüne bağlanır.",
  "Ziyaretin ardından bulgular, kanıtlarıyla birlikte bir denetim raporu hâlinde ALICI'ya teslim edilir.",
  "Hizmetin kapsamı, siparişte seçilen modüllerle sınırlıdır; modüllerin kriterleri Modüller sayfasında yayımlanmıştır.",
] as const;

export default async function OnBilgilendirmePage({ params }: { params: Promise<LocaleParams> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tSite = await getTranslations({ locale, namespace: "site" });

  return (
    <LegalPage title="Ön Bilgilendirme Formu" updated="16 Temmuz 2026">
      <LegalSection title="1. Formun Amacı">
        <p>
          Bu form, Mesafeli Sözleşmeler Yönetmeliği uyarınca, {siteConfig.url} adresi üzerinden
          elektronik ortamda sipariş vermeden önce ALICI&apos;nın bilgilendirilmesi amacıyla
          hazırlanmıştır. ALICI, ödeme adımında bu formu okuduğunu ve bilgilendirildiğini elektronik
          ortamda teyit eder. Teyit verilmeden ödeme adımı tamamlanamaz.
        </p>
        <p>
          Bu formun teyidi, <LegalLink href="/mesafeli-satis-sozlesmesi">Mesafeli Satış
          Sözleşmesi</LegalLink>&apos;nin ayrı bir onayla kabul edilmesi zorunluluğunu ortadan
          kaldırmaz; iki metin ayrı ayrı onaylanır.
        </p>
      </LegalSection>

      <LegalSection title="2. Satıcı Bilgileri">
        <SellerIdentity />
      </LegalSection>

      <LegalSection title="3. Hizmetin Temel Nitelikleri">
        <LegalList items={serviceCharacteristics} />
        <p>
          Modüllerin kapsamı, kriterleri ve kanıt türleri{" "}
          <LegalLink href="/moduller">Modüller</LegalLink> sayfasında, denetim sürecinin işleyişi ise{" "}
          <LegalLink href="/surec">Süreç</LegalLink> sayfasında ayrıntılı olarak yayımlanmıştır. Bu
          sayfalardaki bilgiler bu formun ekidir.
        </p>
      </LegalSection>

      <LegalSection title="4. Fiyat">
        <p>
          Sitede yayımlanan ve sipariş özetinde gösterilen tüm fiyatlar Türk Lirası cinsindendir ve{" "}
          <strong>%{VAT_RATE * 100} KDV dahildir</strong> ({PRICING_NOTE}). Fiyatların üzerine ayrıca
          bir vergi, komisyon, hizmet bedeli veya masraf eklenmez. Sipariş özetinde KDV tutarı
          şeffaflık için ayrıştırılmış olarak da gösterilir; bu ayrıştırma toplam bedeli değiştirmez.
        </p>
        <p>Güncel liste fiyatları (KDV dahil):</p>
        <LegalList items={priceRows()} />
        <p>
          360° Tam Denetim, kapsamındaki modüllerin ayrı ayrı satın alınmasına göre daha düşük bir
          bedelle sunulur. {SCALE_NOTE} Ölçeğe bağlı olarak farklılaşan fiyatlar, satın alma öncesi{" "}
          <LegalLink href="/teklif">teklif</LegalLink> yoluyla ayrıca belirlenir.
        </p>
        <p>
          ALICI için bağlayıcı olan bedel, siparişin verildiği anda sipariş özetinde gösterilen ve
          sipariş onayında yer alan toplam tutardır. Fiyat değişiklikleri, değişiklikten önce verilen
          siparişlere uygulanmaz.
        </p>
      </LegalSection>

      <LegalSection title="5. Ödeme ve İfa">
        <p>
          Ödeme, kredi veya banka kartı ile 3D Secure doğrulaması üzerinden peşin olarak yapılır.
          Kart bilgileri hiçbir aşamada bu sitenin sunucularına ulaşmaz; ödeme kuruluşunun kendi
          sayfasına doğrudan iletilir ve orada işlenir.
        </p>
        <LegalList
          items={[
            "Ödemenin tamamlanmasının ardından denetim ziyaretinin tarih aralığı ALICI ile mutabakatla belirlenir.",
            "Gizli müşteri yönteminin gereği olarak kesin gün ve saat ALICI'ya bildirilmez; aksi hâlde ölçüm değerini yitirir.",
            "Denetim ziyareti, ödemenin tamamlanmasından itibaren en geç otuz gün içinde gerçekleştirilir.",
            "Denetim raporu, ziyaretin tamamlanmasının ardından ALICI'nın siparişte belirttiği e-posta adresine iletilir.",
            "Fatura, siparişte beyan edilen fatura bilgilerine göre düzenlenir ve aynı adrese gönderilir.",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Cayma Hakkı ve İstisnası">
        <p>
          ALICI, sipariş tarihinden itibaren <strong>on dört gün</strong> içinde, hiçbir gerekçe
          göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Cayma
          bildirimi bu süre içinde{" "}
          <LegalLink href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </LegalLink>{" "}
          adresine yazılı olarak iletilir.
        </p>
        <p>
          <strong>
            Cayma hakkının istisnası: ifasına başlanmış hizmetlerde cayma hakkı kullanılamaz.
          </strong>{" "}
          Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca, ALICI&apos;nın onayı ile
          ifasına başlanan hizmetlere ilişkin sözleşmelerde cayma hakkı kullanılamaz. Bu hizmette
          ifa, <strong>denetçinin tesise misafir sıfatıyla giriş yapmasıyla başlar</strong>. Bu andan
          itibaren cayma hakkı sona erer ve bedel iadesi yapılmaz.
        </p>
        <p>
          ALICI, ödeme adımında, denetim ziyaretinin on dört günlük cayma süresi dolmadan
          gerçekleştirilebileceğini ve ifanın başlamasıyla cayma hakkını kaybedeceğini bildiğini{" "}
          <strong>açıkça onaylar</strong>. Denetim tarihi henüz belirlenmemişken cayma hakkı her
          hâlde kullanılabilir ve tahsil edilen tutarın tamamı iade edilir.
        </p>
        <p>
          Tarih belirlendikten sonraki iptallerde uygulanacak kesinti basamakları, iade süresi, iade
          yöntemi ve mücbir sebep hâlleri{" "}
          <LegalLink href="/iptal-iade">İptal &amp; İade Politikası</LegalLink> sayfasında
          düzenlenmiştir.
        </p>
      </LegalSection>

      <LegalSection title="7. Şikâyet ve İtiraz">
        <p>
          Hizmete ilişkin her türlü şikâyet ve itirazınızı öncelikle{" "}
          <LegalLink href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </LegalLink>{" "}
          adresine veya {siteConfig.contact.phone} numarasına ({tSite("hours")})
          iletebilirsiniz. Başvurunuz en kısa sürede değerlendirilir ve tarafınıza yazılı olarak
          yanıt verilir.
        </p>
        <p>
          Çözüme ulaşılamaması hâlinde ALICI, Ticaret Bakanlığı tarafından her yıl ilan edilen
          parasal sınırlar dâhilinde kendi yerleşim yerindeki veya işlemin yapıldığı yerdeki{" "}
          <strong>Tüketici Hakem Heyetleri</strong>&apos;ne, bu sınırların üzerindeki uyuşmazlıklarda
          ise <strong>Tüketici Mahkemeleri</strong>&apos;ne başvurabilir.
        </p>
      </LegalSection>

      <LegalSection title="8. Tüketici Sıfatı — Hukuk Danışmanına Not">
        <p>
          Bu form, alıcının 6502 sayılı Kanun anlamında tüketici olduğu varsayımıyla kaleme
          alınmıştır. Ancak bu sitedeki hizmet konaklama tesislerine yönelik bir işletme hizmetidir
          ve alıcı fiilen ticari amaçla hareket etmektedir; bu nedenle satışların büyük bölümünde{" "}
          <strong>tüketici sıfatı bulunmayacaktır</strong>. Böyle bir alıcı bakımından ön
          bilgilendirme yükümlülüğünün ve cayma hakkının kanunen zorunlu olup olmadığı, bu formun
          hangi kısımlarının bağlayıcı yükümlülük hangilerinin gönüllü taahhüt sayılacağı{" "}
          <strong>hukuk danışmanı tarafından netleştirilmelidir</strong>. Bu sayfa hukuki görüş
          değildir; inceleme için hazırlanmış bir taslaktır.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
