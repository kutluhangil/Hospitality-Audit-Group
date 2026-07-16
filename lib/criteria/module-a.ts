import type { ModuleCriteria } from "@/lib/criteria/types";

/** Source: "Genişletilmiş Master Denetim Listesi" — Ön Büro, sayfa 02. */
export const MODULE_A: ModuleCriteria = {
  module: "A",
  subtitle: "Ön Büro Operasyonel Kalite Kontrol Listesi",
  intro:
    "Misafir ilk temas, karşılama hızı, veri giriş doğruluğu ve finansal güvence parametrelerinin takibi.",
  groups: [
    {
      code: "A.1.",
      title: "Karşılama ve Valet Standartları",
      criteria: [
        {
          code: "A.1.1",
          text: "Araç kapıya yanaştığı an ilk 60 saniye içinde profesyonel karşılama yapıldı mı?",
          evidenceLabel: "Zaman Sayacı",
          evidence: "kronometre",
          threshold: "60 saniye",
        },
        {
          code: "A.1.2",
          text: "Vale ekibi göz teması kurup kurumsal selamlama standartlarını uyguladı mı?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
        {
          code: "A.1.3",
          text: "Bagajlar bellboy tarafından hasar kontrolüyle alınıp bagaj kartı misafire teslim edildi mi?",
          evidenceLabel: "Evrak Kontrolü",
          evidence: "evrak",
        },
      ],
    },
    {
      code: "A.2.",
      title: "Resepsiyon Check-in & Upsell Performansı",
      criteria: [
        {
          code: "A.2.1",
          text: "Resepsiyonist misafiri güleryüzle ve ismiyle hitap ederek karşıladı mı?",
          evidenceLabel: "Ses Kaydı",
          evidence: "sesKaydi",
        },
        {
          code: "A.2.2",
          text: "Check-in süreci (kimlik alımından kart teslimine) maksimum 4 dakikada tamamlandı mı?",
          evidenceLabel: "Kronometre",
          evidence: "kronometre",
          threshold: "4 dakika",
        },
        {
          code: "A.2.3",
          text: "KVKK onayları eksiksiz alınarak sisteme ve CRM profiline hatasız işlendi mi?",
          evidenceLabel: "Sistem Analizi",
          evidence: "sistemAnalizi",
        },
        {
          code: "A.2.4",
          text: "Personel proaktif olarak ücretli oda upgrade (üst segment satış) seçeneklerini sundu mu?",
          evidenceLabel: "Konuşma Takibi",
          evidence: "sesKaydi",
        },
        {
          code: "A.2.5",
          text: "Finansal güvence adına standart depozito/kredi kartı provizyonu eksiksiz bloke edildi mi?",
          evidenceLabel: "Finansal Log",
          evidence: "finansal",
        },
      ],
    },
    {
      code: "A.3.",
      title: "Kriz Yönetimi ve Check-out Süreci",
      criteria: [
        {
          code: "A.3.1",
          text: "Yapay şikayet simülasyonunda (örn. oda kartı hatası) personel inisiyatif alıp hızlı çözüm üretti mi?",
          evidenceLabel: "Simülasyon",
          evidence: "simulasyon",
        },
        {
          code: "A.3.2",
          text: "Oda hesabı kapatılırken mini bar ve ekstra harcama kalemleri tek tek misafire onaylatıldı mı?",
          evidenceLabel: "Fatura Analizi",
          evidence: "finansal",
        },
        {
          code: "A.3.3",
          text: "Fatura kesim ve check-out süreci toplamda maksimum 3 dakikada tamamlandı mı?",
          evidenceLabel: "Kronometre",
          evidence: "kronometre",
          threshold: "3 dakika",
        },
      ],
    },
    {
      code: "A.4.",
      title: "Kat Hizmetleri / Oda İçi",
      criteria: [
        {
          code: "A.4.1",
          text: "Oda genel temizliği ve hijyeni (zemin, mobilya, cam yüzeyler) marka standartlarına uygun şekilde yapılmış mı?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
        {
          code: "A.4.2",
          text: "Banyo alanındaki havlular ve buklet malzemeleri eksiksiz şekilde, doğru simetriyle yerleştirilmiş mi?",
          evidenceLabel: "Fotoğraf",
          evidence: "fotograf",
        },
        {
          code: "A.4.3",
          text: "Yatak takımlarında (çarşaf, yastık kılıfı, yorgan) leke, yıpranma veya standart dışı kırışıklık var mı?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
        {
          code: "A.4.4",
          text: "Odadaki teknolojik ekipmanlar (TV, klima, kasa, aydınlatma) sorunsuz çalışır durumda mı?",
          evidenceLabel: "Sistem Analizi",
          evidence: "sistemAnalizi",
        },
      ],
    },
  ],
};
