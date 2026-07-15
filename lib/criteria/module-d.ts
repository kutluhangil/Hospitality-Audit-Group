import type { ModuleCriteria } from "@/lib/criteria/types";

/** Source: "Modül D: 360° Entegre Otel Yönetim Matrisi" — Kurumsal Tepe Yönetim Kılavuzu, sayfa 01-04. */
export const MODULE_D: ModuleCriteria = {
  module: "D",
  subtitle: "360° Entegre Otel Yönetim Matrisi",
  intro:
    "Departmanlar Arası Sinerji, Kurumsal İletişim, Eğitim İhtiyaç Analizi ve Yönetim Kurulu SWOT Yol Haritası",
  perspectives: [
    {
      role: "Bir Otel Sahibinin / Yatırımcısının Gözünden (Makro Konsolidasyon & Varlık Verimliliği)",
      body:
        "Otel sahibi olarak, departmanların tek tek başarılı olması benim için nihai hedef değildir. Ön büro odayı mükemmel satsa bile, Kat Hizmetleri odayı zamanında hazırlayamazsa veya F&B misafirin kahvaltısını geciktirirse misafir sadakati (NPS) çöker. Yatırımcı olarak dikkat ettiğim ana unsur, departmanlar arası silolaşmanın engellenmesi, sistemler arası (PMS, POS, CRM, Spa yazılımı) finansal akış entegrasyonu ve tüm bu verilerin Yönetim Kurulu'na kuruşu kuruşuna, aksiyon odaklı bir SWOT ve ROI analizi olarak sunulmasıdır.",
    },
    {
      role: "Bir Genel Müdürün (GM) Gözünden (Sinerji, İletişim & Eğitim Akışı)",
      body:
        "Bir Genel Müdür olarak benim en büyük operasyonel operasyon sınavım, departmanlar arasındaki \"iletişim kopukluğu ve suçlama kültürüdür\". Ön Büro ile Kat Hizmetleri (HK) arasındaki kirli/temiz oda bildirim gecikmeleri, VIP misafir tercihlerinin mutfağa (F&B) eksik aktarılması veya Spa randevularının oda folyolarına yanlış işlenmesi operasyonel kaosa yol açar. Bu yüzden, departmanlar arası bilgi akışının hızını, personelin kurumsal oryantasyon seviyesini ve denetim sonuçlarına göre üretilecek Eğitim İhtiyaç Analizini (TNA) tepe yönetim standardı olarak izlerim.",
    },
    {
      role: "Genel Müdür (GM) Entegrasyon Notu",
      body:
        "Tek başına kusursuz çalışan bir departman, silolaşmış bir oteli kurtaramaz. Gerçek başarı; Ön Büro'nun topladığı CRM verisinin Mutfakta yemeğe, Spa'da terapiye ve Yönetim Kurulu masasında kârlılık grafiğine dönüştüğü 360 derecelik kurumsal akış hızıdır.",
    },
  ],
  groups: [
    {
      code: "D.1.",
      title: "Departmanlar Arası Kurumsal İletişim ve Vardiya (Handover) Sinerjisi",
      intro:
        "Genel Müdür (GM) ve Yatırımcı şapkasıyla oteldeki departmanlar arası silolaşmayı ve koordinasyon açıklarını yıkan tepe analiz.",
      criteria: [
        {
          code: "D.1.1",
          text: "Ön Büro ile Kat Hizmetleri (HK) arasındaki canlı oda durum (kirli/temiz/arıza) senkronizasyonu PMS üzerinden maksimum 2 dakikada güncelleniyor mu?",
          evidenceLabel: "Sistem Ekran Testi",
          evidence: "sistemAnalizi",
          threshold: "2 dakika",
        },
        {
          code: "D.1.2",
          text: "VIP misafirlerin CRM tercihleri ve alerjen bilgileri, Ön Büro tarafından F&B Direktörlüğü ve Mutfak Şefine yazılı/sistemsel ulaştırıldı mı?",
          evidenceLabel: "Mesajlaşma Logu",
          evidence: "sistemAnalizi",
        },
        {
          code: "D.1.3",
          text: "Sabah yapılan departman müdürleri toplantısında (Morning Briefing) bir önceki günün misafir şikayetleri ve aksiyon planları konsolide edildi mi?",
          evidenceLabel: "Toplantı Notu",
          evidence: "evrak",
        },
        {
          code: "D.1.4",
          text: "Vardiya devir süreçlerinde (Handover) departmanların birbirini etkileyen talepleri (Örn: Erken giriş odaları, geç check-out'lar) eksiksiz aktarıldı mı?",
          evidenceLabel: "Logbook Analizi",
          evidence: "sistemAnalizi",
        },
      ],
    },
    {
      code: "D.2.",
      title: "Modül Entegrasyonları ve Yazılımsal Finansal Mutabakat",
      intro:
        "Önceki tüm modüllerin (Ön Büro, F&B, Wellness, HK) yazılımsal ve operasyonel mutabakatının tepe kontrolü.",
      criteria: [
        {
          code: "D.2.1",
          text: "Modül B (F&B) kapsamındaki restoran/bar harcamaları oda hesabına aktarılırken, PMS ve POS adisyon tutarları kuruşu kuruşuna eşleşti mi?",
          evidenceLabel: "Folyoların Çapraz Testi",
          evidence: "sistemAnalizi",
        },
        {
          code: "D.2.2",
          text: "Modül C (Wellness) kapsamındaki Spa randevu iptalleri ve \"no-show\" (gelmeyen randevu) ücretlendirme protokolleri Ön Büro folyosuna doğru yansıdı mı?",
          evidenceLabel: "Spa-PMS Veri Logu",
          evidence: "sistemAnalizi",
        },
        {
          code: "D.2.3",
          text: "Kat Hizmetleri (Modül E) tarafından tespit edilen teknik arızalar (Örn: Balkon/Teras Sineklik yırtığı) Teknik Servise otomatik iş emri olarak düştü mü?",
          evidenceLabel: "İş Emri Akış İncelemesi",
          evidence: "sistemAnalizi",
        },
        {
          code: "D.2.4",
          text: "Misafirlerin oda içi mutfakta (Kitchenette) harcadığı ekstra sarf malzemeleri/minibar ürünleri check-out folyosuna hatasız konsolide edildi mi?",
          evidenceLabel: "Fatura Kalem Kontrolü",
          evidence: "finansal",
        },
      ],
    },
    {
      code: "D.3.",
      title: "Kurumsal Kriz Simülasyonu ve Acil Durum Entegrasyonu",
      criteria: [
        {
          code: "D.3.1",
          text: "Tesis genelinde kurgulanan makro bir kriz senaryosunda (Örn: Otel genelinde elektrik kesintisi veya su kesintisi) departmanlar arası koordinasyon hızlı sağlandı mı?",
          evidenceLabel: "Tepe Kriz Simülasyonu",
          evidence: "simulasyon",
        },
        {
          code: "D.3.2",
          text: "Modül C kapsamındaki Havuz/Plaj cankurtaran kulesi ile otelin revir/medikal doktor ekibi arasındaki telsiz ve acil durum hat entegrasyonu kesintisiz çalışıyor mu?",
          evidenceLabel: "Hız & Frekans Testi",
          evidence: "kronometre",
        },
        {
          code: "D.3.3",
          text: "F&B alanlarında veya odalarda yaşanabilecek olası bir misafir yaralanması/sağlık krizinde Ön Büro Güvenlik ve Tepe Yönetim zinciri ilk 120 saniyede aktive oldu mu?",
          evidenceLabel: "Zaman Sayacı",
          evidence: "kronometre",
          threshold: "120 saniye",
        },
        {
          code: "D.3.4",
          text: "KVKK ve siber güvenlik protokolleri kapsamında, tüm departman personellerinin bilgisayar ekran kilitleme ve şifre mahremiyeti kurallarına uyumu tam mı?",
          evidenceLabel: "Gizli Canlı Denetim",
          evidence: "gozlem",
        },
      ],
    },
    {
      code: "D.4.1.",
      title: "Personel Eğitim İhtiyaç Analizi (TNA) ve Yol Haritası",
      intro:
        "Denetim verilerinin analitik raporlamaya dönüştürülmesi, personel gelişim haritası ve Yönetim Kurulu sunum metrikleri.",
      criteria: [
        {
          code: "D.4.1.1",
          text: "Önceki modüllerde (A, B, C, E) düşük puan alan personeller ve departmanlar için spesifik operasyonel gelişim raporu hazırlandı mı?",
          evidenceLabel: "Veri Konsolidasyonu",
          evidence: "raporlama",
        },
        {
          code: "D.4.1.2",
          text: "Personelin davranışsal ve kurumsal diksiyon eksikliklerine yönelik lüks hizmet standartları (\"Luxury Service Standards\") eğitim takvimi planlandı mı?",
          evidenceLabel: "Eğitim Müfredat Kartı",
          evidence: "raporlama",
        },
        {
          code: "D.4.1.3",
          text: "F&B ve Ön Büro personelinin upsell/çapraz satış kaçırma nedenleri analiz edilerek \"Satış Odaklı Refleks\" eğitim modülü haritalandırıldı mı?",
          evidenceLabel: "TNA Matrisi",
          evidence: "raporlama",
        },
      ],
    },
    {
      code: "D.4.2.",
      title: "Yönetim Kurulu ve Yatırımcı SWOT Sunum Altyapısı",
      criteria: [
        {
          code: "D.4.2.1",
          text: "Denetim sonuçları; ham verilerden arındırılarak Yatırımcının ve Yönetim Kurulu'nun anında karar alabileceği analitik özet grafiklere dönüştürüldü mü?",
          evidenceLabel: "Yönetici Özeti (Dashboard)",
          evidence: "raporlama",
        },
        {
          code: "D.4.2.2",
          text: "Rapor içeriğindeki \"Zayıf Yönler\" ve \"Tehditler\", doğrudan tesisin hangi finansal kayba/ciro sızıntısına yol açtığını rakamlarla gösteriyor mu?",
          evidenceLabel: "Maliyet Sızıntı Analizi",
          evidence: "finansal",
        },
        {
          code: "D.4.2.3",
          text: "Otelin güçlü yönleri ile pazardaki fırsatları birleştiren, rakip analizleriyle desteklenmiş Stratejik Aksiyon Planı yol haritasına eklendi mi?",
          evidenceLabel: "Yol Haritası Kartı",
          evidence: "raporlama",
        },
        {
          code: "D.4.2.4",
          text: "Denetim sonrasında sunulan çözüm önerileri ve personel gelişim planlarının otele sağlayacağı tahmini ROI (Yatırım Dönüş Oranı) konsolide edildi mi?",
          evidenceLabel: "Finansal Projeksiyon",
          evidence: "finansal",
        },
      ],
    },
  ],
};
