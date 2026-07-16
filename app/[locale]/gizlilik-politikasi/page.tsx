import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import { LegalLink, LegalList, LegalPage, LegalSection } from "@/components/legal/LegalPage";
import type { LocaleParams } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Bu sitede hangi çerezlerin kullanıldığı, form verilerinin nasıl işlendiği, hangi üçüncü taraf hizmetlerin devrede olduğu ve verilerin nasıl korunduğu.",
};

export default async function GizlilikPolitikasiPage({ params }: { params: Promise<LocaleParams> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage title="Gizlilik Politikası" updated="15 Temmuz 2026">
      <LegalSection title="1. Kapsam">
        <p>
          Bu politika, {siteConfig.url} adresinde yayınlanan {siteConfig.name} web sitesini
          kapsar. Kişisel verilerinizin 6698 sayılı KVKK kapsamında işlenmesine ilişkin ayrıntılı
          bilgi için <LegalLink href="/kvkk">KVKK Aydınlatma Metni</LegalLink> sayfasını
          inceleyebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="2. Çerezler ve Yerel Depolama">
        <p>
          Bu site hiçbir takip veya reklam çerezi kullanmaz. Ziyaretçi davranışını ölçen bir analiz
          aracı, reklam pikseli veya sosyal medya izleyicisi bulunmaz. Site, sizi tanımlayan bir
          çerez yerleştirmez.
        </p>
        <p>
          Tarayıcınızda tutulan tek veri, teklif sepetinize ilişkin{" "}
          <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-sm">hag-quote-cart</code>{" "}
          adlı bir yerel depolama (localStorage) kaydıdır. Bu kayıt yalnızca{" "}
          <LegalLink href="/moduller">Modüller</LegalLink> sayfasında seçtiğiniz denetim modüllerinin
          kodlarını içerir; böylece sayfayı yenilediğinizde seçiminiz korunur.
        </p>
        <LegalList
          items={[
            "Kayıt yalnızca kendi tarayıcınızda tutulur ve kendiliğinden sunucuya gönderilmez",
            "Kimliğinizi tanımlayan hiçbir bilgi içermez; yalnızca modül kodlarından oluşur",
            "Yalnızca siz teklif formunu gönderdiğinizde, talebinizin kapsamı olarak tarafımıza iletilir",
            "Tarayıcınızın site verilerini temizleyerek dilediğiniz zaman silebilirsiniz",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Form Verileri">
        <p>
          Teklif ve iletişim formlarına girdiğiniz ad soyad, e-posta adresi, telefon numarası, tesis
          adı, tesis tipi, oda sayısı ve mesaj bilgileri yalnızca talebinizi karşılamak için
          kullanılır. Bu bilgiler tarafımıza e-posta olarak iletilir; sitede bir veritabanında
          saklanmaz.
        </p>
        <p>
          Formlar, otomatik gönderimleri elemek için görünmeyen bir alan (honeypot) içerir. Bu alan
          hakkınızda herhangi bir bilgi toplamaz.
        </p>
      </LegalSection>

      <LegalSection title="4. Üçüncü Taraf Hizmetler">
        <p>Site, yalnızca aşağıdaki hizmet sağlayıcıları kullanır:</p>
        <LegalList
          items={[
            "Resend (Resend, Inc.) — form içeriğinin tarafımıza e-posta olarak iletilmesi için kullanılır",
            "Vercel (Vercel, Inc.) — web sitesinin barındırılması için kullanılır ve teknik sunucu kayıtları tutar",
            "iyzico (İyzi Ödeme ve Elektronik Para Hizmetleri A.Ş.) — kart ile satın alma hâlinde ödemenin tahsil edilmesi için kullanılır",
          ]}
        />
        <p>
          Yazı tipleri siteyle birlikte sunulur; sayfa görüntülenirken harici bir yazı tipi veya
          içerik sağlayıcısına istek gönderilmez. Resend ve Vercel yurt dışında bulunmaktadır;
          iyzico, Türkiye&apos;de yerleşik ve BDDK denetimine tabi bir ödeme kuruluşudur.
        </p>
      </LegalSection>

      <LegalSection title="5. Kart Bilgileri">
        <p>
          <strong>Kart bilgileriniz bu sitenin sunucularına hiçbir aşamada ulaşmaz.</strong> Kart
          numarası, son kullanma tarihi ve güvenlik kodu bu sitede yer alan bir forma girilmez;
          ödeme adımında doğrudan ödeme kuruluşunun kendi sayfasına iletilir ve orada işlenir.
          Doğrulama, bankanızın 3D Secure ekranı üzerinden yapılır.
        </p>
        <p>
          Bu nedenle kart bilgileriniz tarafımızca görülmez, kaydedilmez ve saklanmaz. Ödeme
          kuruluşundan tarafımıza yalnızca işlemin sonucu (başarılı/başarısız), işlem numarası ve
          tutar bilgisi döner. Faturanın düzenlenmesi için topladığımız fatura ve adres bilgilerine
          ilişkin ayrıntı <LegalLink href="/kvkk">KVKK Aydınlatma Metni</LegalLink> sayfasındadır.
        </p>
      </LegalSection>

      <LegalSection title="6. Veri Güvenliği">
        <p>
          Site tamamen HTTPS üzerinden sunulur. Form gönderimleri şifreli bağlantı üzerinden
          iletilir ve e-posta ile ödeme sağlayıcısının erişim anahtarları yalnızca sunucu tarafında
          tutulur; tarayıcıya gönderilmez.
        </p>
        <p>
          Verileriniz, talebinizin karşılanması için gereken süre boyunca saklanır ve bu amaç ortadan
          kalktığında silinir. Saklama süresine ilişkin ayrıntılar{" "}
          <LegalLink href="/kvkk">KVKK Aydınlatma Metni</LegalLink> sayfasında yer alır.
        </p>
      </LegalSection>

      <LegalSection title="7. Değişiklikler">
        <p>
          Bu politika, hizmetlerimizde veya mevzuatta meydana gelen değişikliklere bağlı olarak
          güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır ve sayfa başındaki tarih
          güncellenir.
        </p>
      </LegalSection>

      <LegalSection title="8. İletişim">
        <p>
          Gizlilik uygulamalarımıza ilişkin soru ve talepleriniz için{" "}
          <LegalLink href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </LegalLink>{" "}
          adresine yazabilirsiniz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
