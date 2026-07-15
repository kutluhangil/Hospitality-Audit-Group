import type { ModuleCriteria } from "@/lib/criteria/types";

/** Source: "Geliştirilmiş Saha Kılavuzu" — Modül B, F&B, sayfalar 02-04. */
export const MODULE_B: ModuleCriteria = {
  module: "B",
  subtitle: "F&B Derin Operasyonel Denetim Matrisi",
  intro:
    "Gastronomi Kalite Güvencesi, Reçete Sadakati, Hız, Hijyen (HACCP) ve Eksiksiz Kayıp/ Kaçak Kontrol Listesi",
  groups: [
    {
      code: "B.1.1.",
      title: "Karşılama, Ağırlama ve Masa Yerleşimi",
      intro:
        "Misafirin restorana girişinden masadan ayrılışına kadar geçen tüm servis adımlarının zaman ve standart takibi.",
      criteria: [
        {
          code: "B.1.1.1",
          text: "Misafir restoran giriş kapısında ilk 30 saniye içinde güler yüz ve kurumsal standartla karşılandı mı?",
          evidenceLabel: "Kronometre",
          evidence: "kronometre",
          threshold: "30 saniye",
        },
        {
          code: "B.1.1.2",
          text: "Rezervasyon teyidi hızlıca yapıldı mı ve misafir lüks ağırlama protokollerine uygun masaya yönlendirildi mi?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
        {
          code: "B.1.1.3",
          text: "Masa üstü ekipmanları (menaj, peçete, şık porselen ve kadehler) lekesiz, tozsuz ve simetrik mi?",
          evidenceLabel: "Fiziksel Kontrol",
          evidence: "fizikselTest",
        },
        {
          code: "B.1.1.4",
          text: "Sandalyeler misafir otururken servis personeli tarafından nezaketle geriye çekilerek desteklendi mi?",
          evidenceLabel: "Davranış Analizi",
          evidence: "davranis",
        },
      ],
    },
    {
      code: "B.1.2.",
      title: "Masa Servis Döngüsü ve Mutfak Çıkış Hızları",
      criteria: [
        {
          code: "B.1.2.1",
          text: "Menü ve içecek listesi masaya oturulduktan sonraki ilk 2 dakika içerisinde takdim edildi mi?",
          evidenceLabel: "Zaman Sayacı",
          evidence: "kronometre",
          threshold: "2 dakika",
        },
        {
          code: "B.1.2.2",
          text: "Sipariş alımı, menü takdiminden sonraki ilk 5 dakika içinde eksiksiz ve not alınarak tamamlandı mı?",
          evidenceLabel: "Kronometre",
          evidence: "kronometre",
          threshold: "5 dakika",
        },
        {
          code: "B.1.2.3",
          text: "İçecek servisleri sipariş verildikten sonraki ilk 4 dakika içinde doğru ısıda masaya ulaştı mı?",
          evidenceLabel: "Isı & Zaman",
          evidence: "kronometre",
          threshold: "4 dakika",
        },
        {
          code: "B.1.2.4",
          text: "Başlangıç yemekleri siparişten sonraki 10. dakikada, ana yemekler ise en geç 20. dakikada masaya servis edildi mi?",
          evidenceLabel: "Mutfak Hızı",
          evidence: "kronometre",
          threshold: "10. dakika / 20. dakika",
        },
        {
          code: "B.1.2.5",
          text: "Aynı masadaki tüm ana yemekler eş zamanlı (birlikte), doğru misafirlere karıştırılmadan sunuldu mu?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
        {
          code: "B.1.2.6",
          text: "Yemeklerin tüketimi esnasında (girişten 3 dk sonra) memnuniyet kontrolü (\"Check-back\") nezaketle yapıldı mı?",
          evidenceLabel: "Ses Kaydı",
          evidence: "sesKaydi",
          threshold: "3 dk",
        },
        {
          code: "B.1.2.7",
          text: "Boş tabaklar ve biten kadehler misafir rahatsız edilmeden, doğru servis yönünden (sağdan) hızlıca çekildi mi?",
          evidenceLabel: "Servis Yönü Takibi",
          evidence: "gozlem",
        },
        {
          code: "B.1.2.8",
          text: "Masada ek ekmek, su veya buz ihtiyacı personel tarafından misafir talep etmeden fark edilip yenilendi mi?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
      ],
    },
    {
      code: "B.2.1.",
      title: "Menü Hakimiyeti ve Aktif Çapraz Satış (Upsell/Cross-Sell)",
      intro:
        "Garsonların menü içerik derinliği, çapraz satış yetkinliği ve barda porsiyon kontrolüyle maliyet koruma takipleri.",
      criteria: [
        {
          code: "B.2.1.1",
          text: "Personel menüdeki yemeklerin pişme dereceleri, sos reçeteleri ve garnitür alternatiflerine tam olarak hakim mi?",
          evidenceLabel: "Sözlü Sınama",
          evidence: "sesKaydi",
        },
        {
          code: "B.2.1.2",
          text: "Sipariş alırken misafirin medikal veya dini hassasiyetleri, alerjen durumları dikkatle sorgulandı mı?",
          evidenceLabel: "Konuşma Analizi",
          evidence: "sesKaydi",
        },
        {
          code: "B.2.1.3",
          text: "Seçilen ana yemeğe en uygun premium şarap, yerel içki veya imza kokteyl eşleştirmesi proaktif olarak önerildi mi?",
          evidenceLabel: "Ses Kaydı",
          evidence: "sesKaydi",
        },
        {
          code: "B.2.1.4",
          text: "Ana yemeklerin bitişinin ardından masaya aktif olarak tatlı menüsü, kahve çeşitleri veya dijestif içecekler teklif edildi mi?",
          evidenceLabel: "Kâr Odaklı Teklif",
          evidence: "finansal",
        },
      ],
    },
    {
      code: "B.2.2.",
      title: "Bar Operasyonu, Reçete Sadakati ve Porsiyon Güvenliği",
      criteria: [
        {
          code: "B.2.2.1",
          text: "Tüm alkollü ve alkolsüz miksoloji kokteylleri hazırlanırken \"jigger\" (milli ölçek) milimetrik olarak kullanıldı mı?",
          evidenceLabel: "Hassas Gözlem",
          evidence: "gozlem",
        },
        {
          code: "B.2.2.2",
          text: "Premium yabancı içkiler barmen tarafından gizlice göz kararı dökülmek (free-pour) yerine ölçekle mi bardağa aktarıldı?",
          evidenceLabel: "Maliyet Kontrolü",
          evidence: "finansal",
        },
        {
          code: "B.2.2.3",
          text: "Kokteyl reçetelerindeki garnitür düzeni, buz yoğunluğu ve kurumsal bardak tipi el kitabına %100 uyumlu mu?",
          evidenceLabel: "Görsel İnceleme",
          evidence: "gozlem",
          threshold: "%100",
        },
        {
          code: "B.2.2.4",
          text: "Şişe şarap ve kadeh içecek servisleri doğrudan misafirin masasında, şişe etiketi misafire bakacak şekilde mi açıldı?",
          evidenceLabel: "Görsel Takip",
          evidence: "gozlem",
        },
        {
          code: "B.2.2.5",
          text: "Bar tezgah altı şişe sayımları, açık şarapların vakum koruma durumları standartlara uygun mu?",
          evidenceLabel: "Fiziksel Denetim",
          evidence: "fizikselTest",
        },
        {
          code: "B.2.2.6",
          text: "Buz makinesi içi, garnitür saklama kapları ve bar yıkama evyeleri HACCP hijyen kurallarına tam olarak uygun mu?",
          evidenceLabel: "Mikrobiyolojik Test",
          evidence: "hijyenTesti",
        },
      ],
    },
    {
      code: "B.3.1.",
      title: "Sistemsel Finansal Delik (Shrinkage) ve Adisyon Disiplini",
      intro:
        "POS sistemi hilelerinin tespiti, mutfak iptal/iade (void) takipleri ve Room Service operasyonel hızı.",
      criteria: [
        {
          code: "B.3.1.1",
          text: "Masaya giden her kuver, su, ikram veya ana ürün POS sistemine sipariş anında adisyon olarak işlendi mi?",
          evidenceLabel: "Adisyon Eşleme",
          evidence: "finansal",
        },
        {
          code: "B.3.1.2",
          text: "Sistemdeki sipariş silme (void), iptal ve indirim (discount) işlemleri sadece müdür şifresi ve yazılı gerekçeyle mi yapılıyor?",
          evidenceLabel: "POS Log Analizi",
          evidence: "sistemAnalizi",
        },
        {
          code: "B.3.1.3",
          text: "Misafirden nakit tahsilat yapıldığında geçici pusula (proforma) yerine POS cihazından resmi mali fatura basılıp verildi mi?",
          evidenceLabel: "Finansal Kontrol",
          evidence: "finansal",
        },
        {
          code: "B.3.1.4",
          text: "Açık hesap/oda hesabına imza atan misafirin kimlik/oda kartı ve imza doğrulaması sistemle karşılaştırıldı mı?",
          evidenceLabel: "Güvenlik Takibi",
          evidence: "evrak",
        },
      ],
    },
    {
      code: "B.3.2.",
      title: "Yoğun Saat (Rush-Hour) Kriz ve Şikayet Refleksleri",
      criteria: [
        {
          code: "B.3.2.1",
          text: "Yoğun saatlerde mutfak kaynaklı siparişi geciken masaya garson tarafından ara bilgilendirme ve ücretsiz ikram jesti sunuldu mu?",
          evidenceLabel: "Kriz Simülasyonu",
          evidence: "simulasyon",
        },
        {
          code: "B.3.2.2",
          text: "Denetçi tarafından kurgulanan \"Yemek soğuk / Lezzetsiz\" şikayetinde personel inisiyatif alıp tabağı anında mutfakta yeniletti mi?",
          evidenceLabel: "Davranış Analizi",
          evidence: "davranis",
        },
        {
          code: "B.3.2.3",
          text: "Hesapta oluşan yapay bir itiraz durumunda (örn. içmediğim içecek yazılmış) yetkili müdür masaya gelip krizi profesyonelce yönetti mi?",
          evidenceLabel: "Kriz Çözüm Hızı",
          evidence: "kronometre",
        },
      ],
    },
    {
      code: "B.3.3.",
      title: "Oda Servisi (Room Service) Operasyonel Standartları",
      criteria: [
        {
          code: "B.3.3.1",
          text: "Oda servisi sipariş telefonu maksimum 3 çalışta, kurumsal diksiyon standartlarına uygun şekilde yanıtlandı mı?",
          evidenceLabel: "Ses Takibi",
          evidence: "sesKaydi",
          threshold: "maksimum 3 çalış",
        },
        {
          code: "B.3.3.2",
          text: "Telefon alan personel misafire siparişini tekrar ederek teyit aldı mı ve tahmini varış süresini net olarak belirtti mi?",
          evidenceLabel: "Konuşma Analizi",
          evidence: "sesKaydi",
        },
        {
          code: "B.3.3.3",
          text: "Sipariş edilen sıcak yemekler vaat edilen sürede (maksimum 30 dk) ve \"hot-box\" (sıcak muhafaza) arabasıyla odaya ulaştı mı?",
          evidenceLabel: "Kronometre & Isı",
          evidence: "kronometre",
          threshold: "maksimum 30 dk",
        },
        {
          code: "B.3.3.4",
          text: "Oda servis tepsisi düzeni (tuzluk, karabiberlik, logo hizalaması, temiz peçeteler) lüks marka el kitabına uygun mu?",
          evidenceLabel: "Sunum Kontrolü",
          evidence: "gozlem",
        },
        {
          code: "B.3.3.5",
          text: "Oda servisini teslim eden personel odaya giriş nezaketine uydu mu, hesabı folyoya/oda kartına doğru şekilde işletti mi?",
          evidenceLabel: "Gözlem & İmza",
          evidence: "gozlem",
        },
      ],
    },
  ],
};
