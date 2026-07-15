import type { ModuleCriteria } from "@/lib/criteria/types";

/** Source: "Geliştirilmiş Saha Kılavuzu" — Wellness & Rekreasyon, sayfa 02-04. */
export const MODULE_C: ModuleCriteria = {
  module: "C",
  subtitle: "Wellness & Rekreasyon Denetim Matrisi",
  intro:
    "SPA, Havuz, Plaj ve Fitness Alanlarında Lüks Hizmet Standartları, Mikrobiyolojik Hijyen, Mutlak Güvenlik ve Gelir Kaldıraçları.",
  perspectives: [
    {
      role: "Bir Otel Sahibinin Gözünden (Hukuki Sorumluluk & Ek Gelir Kaldıracı)",
      body: "Wellness ve rekreasyon departmanı, otelde kar marjı en yüksek olan ama aynı zamanda kayma, boğulma, sakatlanma gibi hukuki ve operasyonel risklerin en yoğun olduğu kritik merkezdir. Bir yatırımcı olarak benim için havuz kimyasallarının yasal sınırlarda canlı takibi ve cankurtaran disiplini, oteli milyon liralık tazminat davalarından koruyan bir kalkandır. Ticari boyutta ise, terapistlerin boş kalma (idle time) sürelerinin düşürülmesi, randevu sadakati ve masaj sonrası ürün satışları (retail upsell) ana odak noktalarımdır.",
    },
    {
      role: "Bir Spa & Rekreasyon Müdürünün Gözünden (Operasyonel Hassasiyet & Hijyen)",
      body: "Bir departman yöneticisi olarak en büyük operasyonel sınavım; ıslak alanlardaki görünmez küf kokuları, randevularda yaşanan gecikmelerin (overbooking/delay) zincirleme krizleri ve terapistlerin misafirle olan mahrem iletişim sınırlarıdır. Havuz suyunun berraklığı, spor salonundaki ekipmanların kalibrasyonu ve havluların mutlak sterilizasyonu markamızın kalitesini doğrudan misafire yansıtır.",
    },
  ],
  groups: [
    {
      code: "C.1.",
      title: "SPA Resepsiyon, Karşılama ve Randevu Sadakati",
      intro:
        "Spa & Fitness Direktörü ve Otel Sahibi gözüyle misafir güvenliği, yasal riskler ve ek gelir (upsell) kontrolü.",
      criteria: [
        {
          code: "C.1.1",
          text: "SPA resepsiyon personeli misafiri 30 saniye içinde ismiyle karşılayıp sağlık beyan formu (Medical form) doldurttu mu?",
          evidenceLabel: "Evrak Kontrolü",
          evidence: "evrak",
          threshold: "30 saniye",
        },
        {
          code: "C.1.2",
          text: "Randevu saatine tam sadakat sağlandı mı; misafir bekleme alanında bitki çayı/soğuk havlu ikramıyla ağırlandı mı?",
          evidenceLabel: "Kronometre",
          evidence: "kronometre",
        },
        {
          code: "C.1.3",
          text: "Terapist misafiri bekleme alanından alıp, yumuşak ses tonuyla masaj odasına kadar eşlik etti mi?",
          evidenceLabel: "Davranış Analizi",
          evidence: "davranis",
        },
      ],
    },
    {
      code: "C.2.",
      title: "Therapist Uzmanlığı, Misafir İletişimi ve Upsell",
      criteria: [
        {
          code: "C.2.1",
          text: "Terapist seans öncesi masaj basınç tercihi, sakatlık durumu ve oda ısı/müzik tercihlerini net olarak sorguladı mı?",
          evidenceLabel: "Ses Kaydı",
          evidence: "sesKaydi",
        },
        {
          code: "C.2.2",
          text: "Masaj esnasında mutlak sessizlik korundu mu; terapist misafir sormadıkça gereksiz konuşmaktan kaçındı mı?",
          evidenceLabel: "Gözlem",
          evidence: "gozlem",
        },
        {
          code: "C.2.3",
          text: "Seans bitiminde terapist, misafirin cilt tipine uygun ev devam ürünlerini (retail product) proaktif olarak tavsiye etti mi?",
          evidenceLabel: "Ek Gelir Teklifi",
          evidence: "finansal",
        },
        {
          code: "C.2.4",
          text: "Terapistin uluslararası geçerliliğe sahip profesyonel masaj/terapi sertifikasyonları ve çalışma izinleri eksiksiz mi?",
          evidenceLabel: "Sicil İnceleme",
          evidence: "evrak",
        },
      ],
    },
    {
      code: "C.3.1.",
      title: "SPA Islak Alanları ve Soyunma Odaları Hijyeni",
      intro:
        "Ortak kullanım alanlarında nem kontrolü, mikrobiyolojik arınma ve spor salonu biomekanik güvenlik denetimleri.",
      criteria: [
        {
          code: "C.3.1.1",
          text: "Soyunma odalarındaki dolap içleri, terlikler ve bornozlar tamamen steril, tek kullanımlık ambalajlı mı?",
          evidenceLabel: "Fiziksel Gözlem",
          evidence: "gozlem",
        },
        {
          code: "C.3.1.2",
          text: "Sauna ve buhar odası ahşaplarında/duvarlarında hiçbir kararma, mantar izi, ağır ter veya rutubet kokusu var mı?",
          evidenceLabel: "Koku & UV Işık",
          evidence: "hijyenTesti",
        },
        {
          code: "C.3.1.3",
          text: "Hamam göbek taşı ve kurnalar her misafir sonrası dezenfektanla arındırılıyor mu; su giderleri temiz mi?",
          evidenceLabel: "Kimyasal Swab",
          evidence: "hijyenTesti",
        },
        {
          code: "C.3.1.4",
          text: "Duş alanlarında kaymayı önleyici kaymaz paspaslar veya özel zemin solüsyonları mevcut mu?",
          evidenceLabel: "Fiziksel Test",
          evidence: "fizikselTest",
        },
      ],
    },
    {
      code: "C.3.2.",
      title: "Fitness / Spor Salonu Kalibrasyon ve Güvenlik Standartları",
      criteria: [
        {
          code: "C.3.2.1",
          text: "Koşu bantları, ağırlık istasyonları ve kablolu mekanizmalar sorunsuz çalışıyor mu; halatlarda aşınma/yırtılma var mı?",
          evidenceLabel: "Mekanik Test",
          evidence: "fizikselTest",
        },
        {
          code: "C.3.2.2",
          text: "Serbest ağırlık alanındaki tüm dambıllar ve barlar ağırlık sıralamasına göre simetrik ve eksiksiz dizilmiş mi?",
          evidenceLabel: "Görsel Kontrol",
          evidence: "gozlem",
        },
        {
          code: "C.3.2.3",
          text: "Kardiyo cihazlarının ekranları, nabız ölçerleri çalışıyor mu; cihazlar her kullanım sonrası dezenfekte ediliyor mu?",
          evidenceLabel: "UV Light Testi",
          evidence: "hijyenTesti",
        },
        {
          code: "C.3.2.4",
          text: "Salonda misafir kullanımı için soğutulmuş temiz havlular, kapalı bardak sular ve el dezenfektanları tam mı?",
          evidenceLabel: "Stok Kontrolü",
          evidence: "evrak",
        },
        {
          code: "C.3.2.5",
          text: "Salonda acil durum butonu aktif mi ve ilk yardım kiti (Defibrilatör - AED dahil) kolay erişilebilir noktada mı?",
          evidenceLabel: "Acil Durum Testi",
          evidence: "simulasyon",
        },
      ],
    },
    {
      code: "C.4.1.",
      title: "Yüzme Havuzları Yasal Kriterleri ve Can Güvenliği",
      intro:
        "Yasal kimyasal parametreler, cankurtaran disiplini ve plaj alanındaki lüks hizmet matrisinin takibi.",
      criteria: [
        {
          code: "C.4.1.1",
          text: "Havuz suyu pH (7.2 - 7.6) ve Klor (1.0 - 3.0 ppm) değerleri günlük olarak ölçülüp yasal panoda canlı ilan ediliyor mu?",
          evidenceLabel: "Kit Ölçüm Kontrolü",
          evidence: "hijyenTesti",
          threshold: "pH 7.2 – 7.6 • Klor 1.0 – 3.0 ppm",
        },
        {
          code: "C.4.1.2",
          text: "Havuz derinlik yazıları (örn. 140 cm) havuz kenarında ve misafirin göreceği şekilde net ve silinmemiş mi?",
          evidenceLabel: "Görsel Takip",
          evidence: "gozlem",
        },
        {
          code: "C.4.1.3",
          text: "Sertifikalı TSSF cankurtaranı, kule istasyonunda aktif, pürüzsüz üniformalı ve pürüzsüz diksiyonla görev başında mı?",
          evidenceLabel: "Gizli Canlı Takip",
          evidence: "gozlem",
        },
        {
          code: "C.4.1.4",
          text: "Havuz çevresindeki can simitleri, fırlatma ipleri ve ilk yardım sedyesi eksiksiz ve kullanıma hazır mı?",
          evidenceLabel: "Donanım Kontrolü",
          evidence: "fizikselTest",
        },
        {
          code: "C.4.1.5",
          text: "Havuz tahlil sonuçları akredite laboratuvar onaylı olarak aylık arşivleniyor mu; enfeksiyon riski takibi tam mı?",
          evidenceLabel: "Evrak Analizi",
          evidence: "evrak",
        },
      ],
    },
    {
      code: "C.4.2.",
      title: "Plaj (Beach) ve Açık Alan Rekreasyon Standartları",
      criteria: [
        {
          code: "C.4.2.1",
          text: "Plaj kumu her sabah elenerek temizleniyor mu; kumda taş, izmarit, kırık cam veya plastik atık mevcut mu?",
          evidenceLabel: "Saha İncelemesi",
          evidence: "sahaHaritalama",
        },
        {
          code: "C.4.2.2",
          text: "Şezlonglar ve şemsiyeler simetrik dizilmiş mi; sehpa üzerlerinde önceki misafirlerden kalma leke/çöp var mı?",
          evidenceLabel: "Görsel Kontrol",
          evidence: "gozlem",
        },
        {
          code: "C.4.2.3",
          text: "Deniz emniyet şeritleri (mantarlar/dubalar) kıyıdan yasal uzaklıkta çekilmiş mi; tekne/jet-ski kulvarı izole mi?",
          evidenceLabel: "Saha Haritalama",
          evidence: "sahaHaritalama",
        },
        {
          code: "C.4.2.4",
          text: "Plaj havlu istasyonundaki personel misafire havlu teslimini kurumsal nezaket sınırları içinde gerçekleştirdi mi?",
          evidenceLabel: "Konuşma Analizi",
          evidence: "sesKaydi",
        },
        {
          code: "C.4.2.5",
          text: "İskele merdivenleri, ahşap yürüme yolları kıymıksız, paslanmaz ve sağlam durumda mı; sabitlemeler tam mı?",
          evidenceLabel: "Fiziksel Mukavemet",
          evidence: "fizikselTest",
        },
      ],
    },
  ],
};
