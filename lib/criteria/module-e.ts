import type { ModuleCriteria } from "@/lib/criteria/types";

/** Source: "Genişletilmiş Master Denetim Listesi" — Kat Hizmetleri, sayfa 03-04. */
export const MODULE_E: ModuleCriteria = {
  module: "E",
  subtitle: "Kat Hizmetleri Detaylı Oda İçi Denetim Listesi",
  intro:
    "Duyusal ilk etki, tekstil, derin mikrobiyolojik hijyen ve kör nokta donanım çalışma performansları.",
  groups: [
    {
      code: "E.1.",
      title: "Duyusal İlk Etki ve İklimlendirme",
      criteria: [
        {
          code: "E.1.1",
          text: "Oda kapısı açıldığında ağır/rutubetli koku yerine kurumsal oda kokusu hissedildi mi?",
          evidenceLabel: "Koku Testi",
          evidence: "hijyenTesti",
        },
        {
          code: "E.1.2",
          text: "Genel iklimlendirme (AC) sistemi misafir giriş sıcaklığına (22°C standart) doğru ayarlanmış mı?",
          evidenceLabel: "Ölçüm Cihazı",
          evidence: "hijyenTesti",
          threshold: "22°C",
        },
      ],
    },
    {
      code: "E.2.",
      title: "Yatak Düzeni ve Tekstil Kalitesi Kontrolleri",
      criteria: [
        {
          code: "E.2.1",
          text: "Nevresim, çarşaf ve yastıklarda en ufak leke, yabancı saç, yırtık veya ütüsüzlük var mı?",
          evidenceLabel: "Makro Fotoğraf",
          evidence: "fotograf",
        },
        {
          code: "E.2.2",
          text: "Yatak yapım tekniği lüks otelcilik standardı olan zarf katlama metoduna uygun mu?",
          evidenceLabel: "Fiziksel Gözlem",
          evidence: "gozlem",
        },
        {
          code: "E.2.3",
          text: "Gardırop içindeki yedek yastıklar, battaniyeler ve bornozlar koruyucu kılıfında ve lekesiz mi?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
      ],
    },
    {
      code: "E.3.",
      title: "Banyo Sterilizasyonu ve Detay Hijyeni",
      criteria: [
        {
          code: "E.3.1",
          text: "Klozet, duş ve lavaboda hiçbir kireç/su lekesi, tortu, saç veya nem bulunuyor mu?",
          evidenceLabel: "UV Işık Testi",
          evidence: "hijyenTesti",
        },
        {
          code: "E.3.2",
          text: "Klozet kapağı üzerinde sterilizasyon şeridi (Sanitized Band) kuralına uygun yerleştirilmiş mi?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
        {
          code: "E.3.3",
          text: "Fayans derz aralarında, duşakabin köşelerinde kararma, küf veya mantar emaresi var mı?",
          evidenceLabel: "Detay İnceleme",
          evidence: "gozlem",
        },
        {
          code: "E.3.4",
          text: "Şampuan, duş jeli ve sabun gibi buklet malzemeleri tam, logoları misafire bakacak düzende mi?",
          evidenceLabel: "Fotoğraf Kanıtı",
          evidence: "fotograf",
        },
      ],
    },
    {
      code: "E.4.",
      title: "Kör Nokta Toz ve Donanım Performansı",
      criteria: [
        {
          code: "E.4.1",
          text: "Süpürgelikler, gardırop üstleri, tablo çerçeveleri ve yatak başlığı arkasında toz mevcut mu?",
          evidenceLabel: "Dokunma Testi",
          evidence: "fizikselTest",
        },
        {
          code: "E.4.2",
          text: "TV kumandası, telephone ahizesi ve kapı kolları dezenfekte edilmiş mi; parmak izi var mı?",
          evidenceLabel: "UV & Gözlem",
          evidence: "hijyenTesti",
        },
        {
          code: "E.4.3",
          text: "Oda içindeki tüm aydınlatmalar, mini bar motoru ve saç kurutma makinesi stabil çalışıyor mu?",
          evidenceLabel: "Donanım Testi",
          evidence: "fizikselTest",
        },
      ],
    },
    {
      code: "E.5.",
      title: "Balkon / Teras Hijyeni, Dış Alan ve Mobilya Standartları",
      intro:
        "Misafirlerin en çok vakit geçirdiği dış alan olan balkon ve teraslar ile uzun dönem konaklamalarda kritik önem taşıyan mutfak gereçlerinin hijyen ve envanter standardizasyonu.",
      criteria: [
        {
          code: "E.5.1",
          text: "Balkon / teras zemin fayanslarında toz, çamur, yaprak, kuş pisliği veya sigara izmariti kalıntısı var mı?",
          evidenceLabel: "Fiziksel Gözlem",
          evidence: "gozlem",
        },
        {
          code: "E.5.2",
          text: "Balkon / teras masa ve sandalyeleri silinmiş mi; minderlerde leke, ıslaklık veya yırtık mevcut mu?",
          evidenceLabel: "Dokunma Testi",
          evidence: "fizikselTest",
        },
        {
          code: "E.5.3",
          text: "Balkon / teras korkulukları ve dış alan cam pencereleri temiz mi; su ve parmak izi lekeleri barındırıyor mu?",
          evidenceLabel: "Görsel Kontrol",
          evidence: "gozlem",
        },
        {
          code: "E.5.4",
          text: "Küllük temizlenmiş, kurulanmış ve içine sıfır kurumsal kibrit/logo yerleşimi yapılmış mı?",
          evidenceLabel: "Fotoğraf Kanıtı",
          evidence: "fotograf",
        },
        {
          code: "E.5.5",
          text: "Balkon / teras kapısı kilit mekanizması ve sineklikler hatasız, yırtıksız şekilde çalışıyor mu?",
          evidenceLabel: "Donanım Testi",
          evidence: "fizikselTest",
        },
      ],
    },
    {
      code: "E.6.",
      title: "Oda İçi Mutfak (Kitchenette) Hijyen ve Envanter Gereçleri",
      criteria: [
        {
          code: "E.6.1",
          text: "Buzdolabı kokusuz mu; dondurucuda karlanma veya önceki misafirden kalma atık var mı?",
          evidenceLabel: "Fiziksel Kontrol",
          evidence: "fizikselTest",
        },
        {
          code: "E.6.2",
          text: "Mikrodalga, ocak ve kettle içinde kurumuş yağ, yemek artığı veya kireç tortusu var mı?",
          evidenceLabel: "Makro Fotoğraf",
          evidence: "fotograf",
        },
        {
          code: "E.6.3",
          text: "Mutfak tezgahı, evye ve bataryada su lekesi var mı; giderden odaya yayılan koku mevcut mu?",
          evidenceLabel: "Koku & UV Testi",
          evidence: "hijyenTesti",
        },
        {
          code: "E.6.4",
          text: "Tüm tabak, bardak, şarap kadehleri ve tencereler lekesiz, parlatılmış ve set olarak eksiksiz mi?",
          evidenceLabel: "Görsel Analiz",
          evidence: "gozlem",
        },
        {
          code: "E.6.5",
          text: "Mutfak temizlik kiti (sıfır ambalajlı sünger, deterjan, kurulama bezi) eksiksiz sunulmuş mu?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
      ],
    },
  ],
};
