import { setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import {
  LegalLink,
  LegalList,
  LegalPage,
  LegalSection,
} from "@/components/legal/LegalPage";
import type { LocaleParams } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni",
  description:
    "Hospitality Audit Group'un 6698 sayılı KVKK kapsamında kişisel verilerinizi hangi amaçla işlediğini, ne kadar sürede sakladığını ve haklarınızı açıklayan aydınlatma metni.",
};

/** The form fields on /teklif and /iletisim; the only personal data the site collects. */
const collectedData = [
  "Ad soyad",
  "E-posta adresi",
  "Telefon numarası",
  "Tesis adı",
  "Tesis tipi",
  "Oda sayısı",
  "Mesaj içeriğinde tarafınızca paylaşılan bilgiler",
] as const;

/**
 * Only reached on the card-payment path: a sale needs an invoice, and an invoice
 * needs an identified payer. Listed apart from the form fields above because
 * these are collected for a legal obligation, not for a quote.
 */
const billingData = [
  "Fatura tipi (kurumsal veya bireysel)",
  "Kurumsal fatura için: ticaret unvanı, vergi dairesi ve vergi numarası",
  "Bireysel fatura için: ad soyad ve T.C. kimlik numarası",
  "Fatura adresi (ülke, il, ilçe, açık adres, posta kodu)",
] as const;

const purposes = [
  "Tarafınızca iletilen teklif talebinin değerlendirilmesi ve fiyatlandırılması",
  "Talep ettiğiniz denetim modüllerine ilişkin teklifin hazırlanması ve tarafınıza sunulması",
  "İletişim formu üzerinden iletilen soru ve taleplerin yanıtlanması",
  "Talebinizin sonuçlandırılabilmesi için sizinle iletişime geçilmesi",
  "Kart ile satın alma hâlinde ödemenin ödeme kuruluşu aracılığıyla tahsil edilmesi ve doğrulanması",
  "Satın alınan hizmete ilişkin faturanın düzenlenmesi ve tarafınıza iletilmesi",
  "Vergi mevzuatı ile 6563 sayılı Kanun kapsamındaki saklama ve belgelendirme yükümlülüklerinin yerine getirilmesi",
  "İptal, iade ve cayma taleplerinin sonuçlandırılması",
] as const;

/** KVKK madde 11 — the statutory list, reproduced in full. */
const rights = [
  "Kişisel verilerinizin işlenip işlenmediğini öğrenme",
  "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme",
  "Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme",
  "Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme",
  "Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme",
  "KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme",
  "Düzeltme, silme ve yok edilme taleplerinizin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme",
  "İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme",
  "Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme",
] as const;

export default async function KvkkPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LegalPage title="KVKK Aydınlatma Metni" updated="15 Temmuz 2026">
      <LegalSection title="1. Veri Sorumlusu">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
          uyarınca kişisel verileriniz, veri sorumlusu sıfatıyla{" "}
          {siteConfig.name} tarafından aşağıda açıklanan kapsamda işlenmektedir.
        </p>
        <p>
          Veri sorumlusuna{" "}
          <LegalLink href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </LegalLink>{" "}
          adresinden ulaşabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection title="2. İşlenen Kişisel Veriler">
        <p>
          Bu web sitesi üzerinden yalnızca teklif formu ve iletişim formu
          aracılığıyla tarafınızca iletilen veriler işlenir. İşlenen veriler
          şunlardır:
        </p>
        <LegalList items={collectedData} />
        <p>
          Teklif formunda seçtiğiniz denetim modüllerinin kodları da talebinizin
          kapsamını belirlemek üzere formla birlikte iletilir.
        </p>
        <p>
          Hizmeti kart ile satın almanız hâlinde, faturanın düzenlenebilmesi
          için aşağıdaki bilgiler ayrıca işlenir:
        </p>
        <LegalList items={billingData} />
        <p>
          Kart numarası, son kullanma tarihi ve güvenlik kodu bu bilgilere{" "}
          <strong>dahil değildir</strong>: kart bilgileri bu sitenin
          sunucularına hiçbir aşamada ulaşmaz, doğrudan ödeme kuruluşunun kendi
          sayfasına iletilir ve tarafımızca görülmez veya saklanmaz.
        </p>
        <p>
          Site, bunların dışında herhangi bir kişisel veri toplamaz; ziyaretçi
          davranışını izleyen bir analiz veya reklam aracı kullanılmaz.
        </p>
      </LegalSection>

      <LegalSection title="3. Kişisel Verilerin İşlenme Amacı">
        <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
        <LegalList items={purposes} />
        <p>
          Verileriniz bu amaçların dışında kullanılmaz; pazarlama listelerine
          eklenmez ve üçüncü kişilere satılmaz.
        </p>
      </LegalSection>

      <LegalSection title="4. Hukuki Sebep">
        <p>
          Kişisel verileriniz, KVKK&apos;nın 5. maddesinin 2. fıkrasının (c)
          bendi uyarınca bir sözleşmenin kurulması veya ifasıyla doğrudan
          doğruya ilgili olması ve (f) bendi uyarınca veri sorumlusunun meşru
          menfaatleri için veri işlenmesinin zorunlu olması hukuki sebeplerine
          dayanarak, formu doldurarak tarafımıza ilettiğiniz beyanınız üzerine
          otomatik yollarla işlenmektedir.
        </p>
      </LegalSection>

      <LegalSection title="5. Saklama Süresi">
        <p>
          Kişisel verileriniz, talebinizin karşılanması için gerekli olan süre
          boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri saklanır.
          Talebinizin sonuçlanmasının ardından bir sözleşme ilişkisi
          kurulmadıysa verileriniz en geç 12 ay içinde silinir veya anonim hâle
          getirilir. Bu süreden önce silinmesini talep etme hakkınız saklıdır.
        </p>
      </LegalSection>

      <LegalSection title="6. Kişisel Verilerin Aktarılması">
        <p>
          Kişisel verileriniz, yalnızca talebinizin tarafımıza ulaştırılabilmesi
          amacıyla ve hizmet alınan tedarikçilerle sınırlı olmak üzere
          aktarılır:
        </p>
        <LegalList
          items={[
            "E-posta iletimi için Resend (Resend, Inc.) — form içeriği tarafımıza e-posta olarak bu altyapı üzerinden iletilir",
            "Web sitesinin barındırılması için Vercel (Vercel, Inc.)",
          ]}
        />
        <p>
          Bu tedarikçiler yurt dışında bulunduğundan söz konusu aktarım,
          KVKK&apos;nın 9. maddesi kapsamında yurt dışına aktarım
          niteliğindedir. Verileriniz bunların dışında hiçbir üçüncü kişiyle
          paylaşılmaz; yalnızca kanunen yetkili kamu kurum ve kuruluşlarına,
          mevzuatın zorunlu kıldığı hâllerde aktarılabilir.
        </p>
      </LegalSection>

      <LegalSection title="7. KVKK 11. Madde Kapsamındaki Haklarınız">
        <p>
          Veri sahibi olarak KVKK&apos;nın 11. maddesi uyarınca aşağıdaki
          haklara sahipsiniz:
        </p>
        <LegalList items={rights} />
      </LegalSection>

      <LegalSection title="8. Başvuru">
        <p>
          Yukarıda sayılan haklarınıza ilişkin taleplerinizi{" "}
          <LegalLink href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </LegalLink>{" "}
          adresine iletebilirsiniz. Başvurunuz, talebinizin niteliğine göre en
          kısa sürede ve en geç otuz gün içinde ücretsiz olarak sonuçlandırılır.
          İşlemin ayrıca bir maliyet gerektirmesi hâlinde Kişisel Verileri
          Koruma Kurulu tarafından belirlenen tarifedeki ücret talep edilebilir.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
