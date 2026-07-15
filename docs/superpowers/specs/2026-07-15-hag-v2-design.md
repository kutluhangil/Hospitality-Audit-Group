# HAG Website v2 — Tasarım Dokümanı

> **Durum:** onay bekliyor
> **Tarih:** 2026-07-15
> **Öncül:** `docs/blueprint-v1.md` (v1, uygulandı ve çalışıyor), `CLAUDE.md` (onaylı sapmalar)
> **Kapsam:** v1 üzerine — fiyatlandırma + kart ödeme, 3 dil, denetim kriterleri, "Biz Kimiz", güven blokları, mobile-first gözden geçirme

Bu doküman v1'i **değiştiriyor**. Çeliştiği yerde bu doküman geçerlidir.

---

## 0. v1'DEN DEĞİŞEN KARARLAR

| v1 kararı | v2 kararı | Sebep |
|---|---|---|
| Fiyat gösterilmez (`FİYAT: TESİS ÖLÇEĞİNE GÖRE TEKLİFLENDİRİLİR`) | Modül fiyatları görünür, sepet toplam hesaplar | Kullanıcı kararı |
| Ödeme yok, sadece teklif (blueprint §17) | **Hem kart ödeme hem teklif** — iki paralel yol | Kullanıcı kararı |
| i18n yok, v2 adayı (blueprint §17) | **TR / EN / RU — tüm sayfalar** | Kullanıcı kararı |
| Modül içerikleri özet düzeyde | **Tam denetim kriterleri sitede** (4 PDF'ten) | Kullanıcı kararı |
| Login yok | Login yok — **karar ertelendi**, v3'te tekrar bakılacak | Kullanıcı kararı |

---

## 1. FİYATLANDIRMA

### 1.0 MODÜL YAPISI — PDF sistemi geçerli (v1'den değişti)

PDF'ler blueprint'ten farklı harflendirme kullanıyor ve **kendi içinde tutarlı**: `360 modul.pdf` D.2.3'te "Kat Hizmetleri (Modül E)" diye çapraz referans veriyor, ve 360°'yi "Önceki tüm modüllerin (Ön Büro, F&B, Wellness, HK)" kontrolü olarak tanımlıyor.

**Karar: PDF sistemi kazanır.** Gerçek metodoloji o.

| Harf | Modül | v1'de neydi |
|---|---|---|
| A | Ön Büro | Konaklama & Ön Büro |
| B | Yiyecek & İçecek (F&B) | aynı |
| C | Wellness & Rekreasyon | aynı |
| D | 360° Tam Denetim = **A + B + C + E** | A+B+C idi |
| **E** | **Kat Hizmetleri & Oda İçi** | **Personel Eğitimi idi** |
| — | **Personel Eğitimi** — harfsiz hizmet | Modül E idi |

**Personel Eğitimi neden harfsiz:** PDF'i yok çünkü denetim değil, eğitim. Zaten kendi hizmet sayfası var (`/hizmetler/personel-egitimi`). Modül D'deki `D.4.1 PERSONEL EĞİTİM İHTİYAÇ ANALİZİ (TNA)` grubundan beslenir — blueprint'in "denetimden eğitime kapanış döngüsü" fikri PDF'te zaten kurulu.

Sepete eklenebilir ama modül kartı değil; `ServiceItem` olarak ayrı tip.

### 1.1 Fiyat listesi — **tüm fiyatlar KDV DAHİL**

| Modül | Fiyat (KDV dahil) | Not |
|---|---|---|
| A — Ön Büro | 15.000 TL | |
| B — Yiyecek & İçecek (F&B) | 15.000 TL | |
| C — Wellness & Rekreasyon | 15.000 TL | |
| E — Kat Hizmetleri & Oda İçi | 15.000 TL | |
| D — 360° Tam Denetim | **50.000 TL** | A+B+C+E kapsamı. Ayrı alınsa 60.000 — paket 10.000 TL avantajlı |
| Personel Eğitimi | 15.000 TL | Harfsiz hizmet, bağımsız alınabilir |

`lib/modules-data.ts` içine `price: number` (kuruş değil, TL tam sayı) ve `vatIncluded: true` alanı eklenir. Fiyat **tek kaynak** buradadır; hiçbir bileşen rakamı gömmez.

### 1.2 Sepet matematiği

- Ara toplam = seçili modül fiyatları toplamı
- KDV dahil olduğu için sepette **ayrıştırılmış gösterim** yapılır (fatura şeffaflığı):
  ```
  Ara toplam (KDV hariç)   25.000,00 TL
  KDV %20                   5.000,00 TL
  GENEL TOPLAM             30.000,00 TL
  ```
  KDV hariç tutar = `price / 1.20`. Yuvarlama: her satır için ayrı değil, **toplam üzerinden** tek seferde — kuruş farkı oluşmasın.
- Para formatı: `Intl.NumberFormat` ile, `tr-TR` → `30.000,00 TL`. EN/RU'da da **TL** kalır (hizmet Türkiye'de faturalanıyor), sadece ayraç locale'e uyar.

### 1.3 D paketi çapraz kontrolü (ticari mantık)

Sepette **A, B, C ve E birlikte** seçiliyken bir öneri şeridi çıkar:

> `D PAKETİ` — Seçtiğiniz dört modül D kapsamında. 50.000 TL — **10.000 TL tasarruf.** [D'ye geç]

Tıklanınca A+B+C+E çıkar, D girer. Bu, sepetin tek "akıllı" davranışıdır; başka otomatik müdahale yok.

D seçiliyken A/B/C/E eklenirse: kart üstünde `D paketine dahil` rozeti çıkar ve **Sepete Ekle butonu devre dışı** kalır (aynı şeyi iki kez satmak yanlış).

Personel Eğitimi D'ye dahil **değildir** — D seçiliyken de ayrı eklenebilir.

---

## 2. İKİ YOLLU SATIN ALMA

Site artık **iki farklı niyeti** karşılıyor. Bu ayrım `/teklif` sayfasında net olmalı — kullanıcı hangi yolda olduğunu bilmeli.

```
                 /moduller  →  Sepet
                                 │
                    ┌────────────┴────────────┐
                    │                         │
             KART İLE ÖDE              TEKLİF İSTE
        (fiyat kabul, hemen)      (özel fiyat / pazarlık)
                    │                         │
          Fatura bilgileri            İletişim bilgileri
          + Mesafeli satış             + KVKK onayı
          + KVKK onayı                       │
                    │                         │
            iyzico/PayTR 3D            POST /api/teklif
                    │                         │
          Sipariş onayı + fatura      TALEP ALINDI — REF
```

### 2.1 Yol 1 — Kart ile ödeme

**Ön koşul:** `PAYMENT_PROVIDER_KEY` env değişkeni set olmalı. **Yoksa bu yol tamamen gizlenir** — buton görünmez, sayfa yalnız teklif modunda çalışır. Resend fallback'iyle aynı felsefe: eksik yapılandırma siteyi kırmaz, sadece o özelliği kapatır.

> **Ödeme fallback'i, teklif fallback'inden farklıdır.** Teklif formu anahtar yokken "başarılı" dönebilir (log + 200), çünkü kimse para kaybetmez. Ödeme **asla** böyle davranmaz — anahtar yoksa özellik yok, sahte başarı yok. Bu kural koda yorum olarak yazılır.

Toplanan fatura bilgileri:
- Fatura tipi: **Kurumsal** / Bireysel (radio)
- Kurumsal ise: Ticaret unvanı*, Vergi dairesi*, Vergi no* (10 hane), (Bireysel ise: Ad Soyad*, TC Kimlik No*)
- Adres*: Ülke, İl, İlçe, Açık adres, Posta kodu
- E-posta*, Telefon*
- Mesafeli satış sözleşmesi onayı* (checkbox + metin linki)
- Ön bilgilendirme formu onayı* (checkbox + metin linki)
- KVKK onayı*

**Doğrulama:** vergi no 10 hane sayı, TC kimlik 11 hane + algoritma kontrolü. Client + server, `lib/quote-schema.ts` mantığıyla aynı: **tek kaynak, iki taraf**.

### 2.2 Yol 2 — Teklif iste

Mevcut `/teklif` akışı korunur (v1'de çalışıyor ve doğrulandı). Üstüne:
- Fiyat görünür ama "bu fiyatlar standart tesis içindir; ölçeğe göre teklif isteyin" notu
- Fatura bilgisi **istenmez** (henüz satış yok)

### 2.3 Ödeme sağlayıcı

**Karar bekliyor.** Adaylar:
- **iyzico** — TR pazarında en yaygın, iyi dokümantasyon, Node SDK var
- **PayTR** — daha ucuz komisyon, dokümantasyon zayıf
- **Stripe** — TR'de kart tahsilatı sınırlı, TL sorunlu → **önerilmez**

**Öneri: iyzico.** Entegrasyon `app/api/odeme/route.ts` + `lib/payment.ts` içine kapsüllenir; sağlayıcı değişse tek dosya değişir.

**Kullanıcının yapması gerekenler (kod ile çözülemez):**
1. iyzico üye işyeri başvurusu + onay
2. API key / secret → `.env.local` (asla repoya girmez)
3. ETBİS kaydı
4. Gerçek ticaret unvanı, vergi no, MERSİS no

---

## 3. HUKUKİ METİNLER (e-ticaret zorunluluğu)

Yeni sayfalar. Hepsi mevcut `LegalPage` kabuğunu kullanır ve **hepsinde şablon uyarısı** görünür:

| Sayfa | Yol | İçerik |
|---|---|---|
| Mesafeli Satış Sözleşmesi | `/mesafeli-satis-sozlesmesi` | Taraflar, konu, hizmet tanımı, bedel, ödeme, ifa, cayma |
| Ön Bilgilendirme Formu | `/on-bilgilendirme` | Satıcı bilgileri, hizmet, fiyat, ödeme, cayma hakkı |
| İptal & İade Politikası | `/iptal-iade` | Denetim tarihi öncesi/sonrası iptal koşulları |
| KVKK (mevcut) | `/kvkk` | Fatura/adres alanları eklenecek |
| Gizlilik (mevcut) | `/gizlilik-politikasi` | Ödeme sağlayıcı aktarımı eklenecek |

> **Cayma hakkı uyarısı:** Hizmet sektöründe, ifası başlamış hizmetlerde cayma hakkı düşer (Mesafeli Sözleşmeler Yönetmeliği m.15). Denetim ziyareti başladıktan sonra iade yapılamaz — bu, sözleşmede **açıkça** yazılmalı ve satın alma anında onaylatılmalı. Metni şablon olarak yazacağım; **hukukçu teyidi şart.**

---

## 4. DENETİM KRİTERLERİ — SİTENİN YENİ İKİNCİ KALBİ

4 PDF'in tam içeriği siteye taşınır. Bu, sitenin en güçlü içerik varlığı: rakip hiçbir denetim firmasında bu yok.

### 4.1 Veri modeli

Yeni dosya: `lib/audit-criteria.ts`

```ts
export type EvidenceType =
  | "Kronometre" | "Gözlem" | "Ses Kaydı" | "Zaman Sayacı" | "Simülasyon"
  | "Davranış Analizi" | "Fiziksel Kontrol" | "Evrak Kontrolü" | "Sistem Analizi"
  | "Fatura Analizi" | "Finansal Log" | "Konuşma Takibi" | "Isı & Zaman"
  | "Mutfak Hızı" | "Sicil İnceleme" | "Ek Gelir Teklifi" | "Sistem Ekran Testi"
  | "Mesajlaşma Logu" | "Toplantı Notu" | "Logbook Analizi";

export type Criterion = {
  code: string;          // "A.2.2"
  text: string;          // tam kriter metni (PDF'ten birebir)
  evidence: EvidenceType;
  threshold?: string;    // "max 4 dakika" — varsa vurgulanır
};

export type CriteriaGroup = {
  code: string;          // "A.2."
  title: string;         // "RESEPSİYON CHECK-IN & UPSELL PERFORMANSI"
  criteria: readonly Criterion[];
};

export type ModuleCriteria = {
  module: ModuleCode;
  intro: string;              // PDF'teki bölüm açıklaması
  perspectives?: {            // C ve D'de var: otel sahibi / müdür gözünden
    role: string;
    body: string;
  }[];
  groups: readonly CriteriaGroup[];
};
```

### 4.2 Sayfa yapısı

Her modülün **kendi detay sayfası** olur (v1'de yoktu):

```
/moduller                          → katalog + sepet (mevcut)
/moduller/konaklama-on-buro        → YENİ: modül A detay + tam kriter listesi
/moduller/yiyecek-icecek           → YENİ
/moduller/wellness-rekreasyon      → YENİ
/moduller/360-tam-denetim          → YENİ
/moduller/personel-egitimi         → YENİ
```

Modül detay sayfası sırası:
1. **PageHero** — modül kodu (mono), başlık (serif), PDF'teki alt başlık
2. **Perspektif blokları** (C ve D'de) — "Bir Otel Sahibinin Gözünden" / "Bir Genel Müdürün Gözünden". Bu metinler PDF'te zaten var ve **çok güçlü** — terracotta sol kenarlıklı alıntı bloğu olarak sunulur
3. **Neden önemli** — her kriter grubunun ticari karşılığı (kullanıcı isteği: "neden önemli olduğunu belirt")
4. **Kriter tablosu** — aşağıda
5. **Kanıt türü özeti** — bu modülde hangi kanıt kaç kez kullanılıyor
6. **Fiyat + Sepete Ekle + Teklif İste**

### 4.3 Kriter tablosu tasarımı — "Denetim Şeması"

PDF'in `Kod | Kriter | Durum | Kanıt Türü` tablosu web'e çevrilir ama **tablo olarak değil** — mobile-first zorunluluğu tabloyu öldürür.

Yerine: **kriter kartı listesi**.

```
┌──────────────────────────────────────────┐
│ A.2.2                    ⏱ KRONOMETRE    │  ← mono kod solda, kanıt rozeti sağda
│                                          │
│ Check-in süreci (kimlik alımından kart   │  ← sans gövde
│ teslimine) maksimum 4 dakikada           │
│ tamamlandı mı?                           │
│                                          │
│ EŞİK: 4 DAKİKA                           │  ← varsa, mono + terracotta
└──────────────────────────────────────────┘
```

- Desktop'ta 2 kolon, mobilde tek kolon
- Grup başlıkları (`A.2. RESEPSİYON CHECK-IN & UPSELL PERFORMANSI`) mono + terracotta ayraç
- `E / H / NA` kolonu **web'de gösterilmez** — o saha formunun kolonu, ziyaretçiye anlamsız. Bunun yerine sayfa başında bir açıklama: "Her kriter sahada Evet / Hayır / Uygulanamaz olarak işaretlenir ve kanıta bağlanır."
- Eşik değerler (60 sn, 4 dk, 2 dk, %11) **ayrı vurgulanır** — bunlar iddianın kanıtı

### 4.4 Kanıt türü rozetleri

Her kanıt türüne bir lucide ikonu + tutarlı renk (accent/brass/ok, dekoratif kullanım):

| Kanıt | İkon |
|---|---|
| Kronometre / Zaman Sayacı | `Timer` |
| Gözlem | `Eye` |
| Ses Kaydı | `Mic` |
| Simülasyon | `FlaskConical` |
| Davranış Analizi | `Users` |
| Fiziksel Kontrol | `Hand` |
| Evrak Kontrolü | `FileCheck` |
| Sistem Analizi / Sistem Ekran Testi | `MonitorCheck` |
| Fatura Analizi / Finansal Log | `Receipt` |
| Konuşma Takibi | `MessageSquare` |
| Isı & Zaman | `Thermometer` |
| Mutfak Hızı | `ChefHat` |
| Sicil İnceleme | `BadgeCheck` |
| Ek Gelir Teklifi | `TrendingUp` |
| Mesajlaşma Logu | `MessagesSquare` |
| Toplantı Notu | `ClipboardList` |
| Logbook Analizi | `BookOpen` |

### 4.5 Eksikleri tamamlama (kullanıcı isteği)

PDF'lerde bölüm yapısı asimetrik: A'da 3 grup, B'de 2+ grup, C'de 2 grup, D'de 3 grup — ama PDF'ler 4 sayfa ve `pdftotext` bazı sayfaları kısmi çıkardı. **Build öncesi tüm 4 PDF'in 4 sayfası da tam çıkarılıp** kriterlerin tamamı `audit-criteria.ts`'e girecek.

PDF'te olmayan ama tutarlılık için eklenecekler — **her biri işaretlenerek, onayına sunularak**:
- Modül A'da "Kat Hizmetleri / Oda İçi" grubu PDF başlığında var (`Ön Büro, Kat Hizmetleri, Balkon/Teras ve Detaylı Oda İçi`) ama metinde eksik → **senden içerik isteyeceğim veya PDF'in kalan sayfalarından çıkaracağım**
- Modül E (Personel Eğitimi) için PDF **yok** → kriterleri v1 blueprint §8.3'ten türetilir, "denetim kriteri" değil "program içeriği" olarak sunulur

### 4.6 Kopyalama caydırıcısı — dürüst sınır

Kullanıcı isteği: kopyalanmasın.

**Yapılacak:** kriter bloklarına `user-select: none`, sağ tık menüsü engeli, PDF indirme yok.

**Yapılamayan — açıkça belirtiliyor:** bu **koruma değil, caydırıcıdır**. Sayfa kaynağı, devtools, reader mode, Ctrl+U, ekran görüntüsü ile içerik alınabilir. Tarayıcıya gönderilen metin korunamaz.

**Bedeli:** `user-select:none` metin seçimini ve bazı erişilebilirlik araçlarını bozar. Bu yüzden:
- Sadece **kriter metinlerine** uygulanır, tüm sayfaya değil
- `@media print` ile yazdırma da kısıtlanır
- Ekran okuyucular etkilenmez (`user-select` AT'yi engellemez)

---

## 5. "BİZ KİMİZ" — `/biz-kimiz`

Mevcut `/hakkimizda` sayfası **kalır** (kısa manifesto). `/biz-kimiz` daha derin, kurumsal sayfa olur. İkisi çakışmasın diye:

- `/hakkimizda` → **kaldırılır**, içeriği `/biz-kimiz` içine taşınır. Nav'da tek giriş: **Biz Kimiz**
- `/hakkimizda` → `/biz-kimiz`'e **301 redirect** (v1 linkleri kırılmasın)

### 5.1 Sayfa yapısı

1. **Hero** — H1 "Otelciliği yönetenler, şimdi ölçüyor." (v1'den, güçlü)
2. **Kuruluş öyküsü** — 3-4 paragraf. *Bu metin geçici, `isPlaceholder` bayraklı.*
3. **Neden anonimiz** — mevcut espri korunur: "Denetçilerimizin yüzünü göremezsiniz. Misafirleriniz de göremiyor."
4. **Denetçi kadrosu** — isimsiz kıdem profili (placeholder, senin dolduracağın rakamlar)
5. **Kanıt türleri vitrini** — `audit-criteria.ts`'ten **otomatik türetilir**, uydurma değil: "Metodolojimizde 20 farklı kanıt türü var. En sık kullanılanlar: Gözlem (14 kriter), Kronometre (6), Ses Kaydı (4)."
6. **Değerler şeridi** — `TARAFSIZLIK · GİZLİLİK · ÖLÇÜLEBİLİRLİK` (v1'den)
7. **Kurumsal sicil bloku** — sicil/vergi/MERSİS. **`null` olduğu sürece render EDİLMEZ.**
8. **Anonim tesis profilleri** — gerçek veri gelene kadar **render EDİLMEZ.**

### 5.2 Placeholder yönetimi

Yeni dosya: `lib/company-data.ts`

```ts
export const company = {
  /**
   * PLACEHOLDER. Bu blok yayına çıkmadan önce gerçek bilgiyle değiştirilmeli.
   * `isPlaceholder` true olduğu sürece dev ortamında görünür bir uyarı şeridi çıkar.
   */
  isPlaceholder: true,

  kurulusYili: 2021,          // PLACEHOLDER
  merkez: "İstanbul",         // PLACEHOLDER
  denetciSayisi: 12,          // PLACEHOLDER
  ortalamaKidemYil: 14,       // PLACEHOLDER

  // Devlet sicil numaraları — UYDURULMADI. Gerçeği girilene kadar null.
  // null olduğu sürece kurumsal sicil bloku render edilmez.
  ticaretSicilNo: null,
  mersisNo: null,
  vergiDairesi: null,
  vergiNo: null,

  // Gerçek denetim geçmişi — UYDURULMADI. Boş kaldıkça bölüm render edilmez.
  tesisProfilleri: [],
} as const;
```

`isPlaceholder: true` iken **`NODE_ENV !== "production"` ortamında** sayfanın üstünde terracotta bir şerit: `⚠ PLACEHOLDER İÇERİK — yayına almadan önce lib/company-data.ts doldurulmalı`. Production'da şerit görünmez ama içerik de yanlış kalır — bu yüzden şerit yerine **build-time uyarı** da eklenir (`next.config.mjs` içinde konsola basar).

---

## 6. ÇOK DİLLİLİK (TR / EN / RU)

### 6.1 Yaklaşım

**Kütüphane: `next-intl`.** Sebep: App Router native desteği, RSC'de çalışır, tip güvenli mesaj anahtarları, Next 16 uyumlu. Alternatif (`next-i18next`) Pages Router odaklı — elenmiştir.

### 6.2 URL yapısı

```
/tr/...  (varsayılan, ama prefix HER ZAMAN görünür — SEO'da belirsizlik olmasın)
/en/...
/ru/...
/        → Accept-Language'e göre yönlendirir
```

Slug'lar da çevrilir:

| TR | EN | RU |
|---|---|---|
| `/tr/moduller` | `/en/modules` | `/ru/moduli` |
| `/tr/surec` | `/en/process` | `/ru/protsess` |
| `/tr/biz-kimiz` | `/en/about-us` | `/ru/o-nas` |
| `/tr/teklif` | `/en/quote` | `/ru/zapros` |
| `/tr/iletisim` | `/en/contact` | `/ru/kontakty` |

> **Rusça slug'lar Latin harfle (translit).** Kiril URL punycode'a döner, paylaşımda çirkin görünür ve bazı sistemlerde kırılır.

### 6.3 Font — kritik

**Kiril desteği zorunlu.** Üç fontun da `subsets` dizisine `cyrillic` eklenir:

```ts
Source_Serif_4({ subsets: ["latin", "latin-ext", "cyrillic"] })
Inter({ subsets: ["latin", "latin-ext", "cyrillic"] })
JetBrains_Mono({ subsets: ["latin", "latin-ext", "cyrillic"] })
```

Üçü de Kiril içeriyor — doğrulandı gerekiyor (build'de test edilecek). İçermezse yedek: `Noto Serif` / `Noto Sans`.

Bu, font yükünü artırır. Azaltma: subset'ler dile göre koşullu yüklenemez (next/font statiktir), ama `display: swap` + preload sadece aktif dil için yapılır.

### 6.4 Çeviri kalitesi

- **TR:** birincil, mevcut kopya (blueprint'ten, nihai)
- **EN:** ben yazacağım — çeviri değil, **yeniden yazım**. "Misafiriniz her şeyi görür. Biz de öyle." kelime kelime çevrilirse ölür.
- **RU:** ben yazacağım. Antalya/Bodrum pazarında Rus misafir ve Rus sermayeli otel gerçeği var — bu dil ciddiye alınmalı. **Yayına almadan önce ana dili Rusça olan birine okutmanı öneririm.** Bunu spec'e not düşüyorum çünkü ben doğrulayamam.
- **Hukuki sayfalar (KVKK, mesafeli satış):** EN/RU versiyonlarının başına: *"Bu metin bilgilendirme amaçlıdır. Bağlayıcı metin Türkçe versiyondur."*

### 6.5 Dil seçici

Header'da, ThemeToggle'ın yanında. `TR / EN / RU` — mono, aktif olan `text-accent-strong`. Bayrak ikonu **yok** (dil ≠ ülke; RU bayrağı Kazakistan'daki kullanıcıyı dışlar).

`hreflang` etiketleri her sayfada, `x-default` → TR.

### 6.6 Sayfalanmayan içerik

`audit-criteria.ts` içindeki kriter metinleri **3 dile çevrilmeli**. Bu ~60-80 kriter × 3 dil = ciddi hacim. Yapı:

```
messages/
  tr.json
  en.json
  ru.json
  criteria/
    tr.json    ← kriter metinleri ayrı, dosya şişmesin
    en.json
    ru.json
```

---

## 7. MOBILE-FIRST GÖZDEN GEÇİRME

v1 responsive ve 375px'te taşmasız (doğrulandı). Ama **mobile-first tasarlanmadı** — desktop tasarlanıp mobile'a indirildi. v2'de yeni gelen her şey mobile-first kurulur:

| Bileşen | Mobil davranış |
|---|---|
| Kriter kartları | Tek kolon, kanıt rozeti kod'un altına iner |
| Sepet | Mobilde **sticky alt çubuk**: `2 modül · 30.000 TL · [Devam]` |
| Fatura formu | Tek kolon, `inputMode` doğru (vergi no → `numeric`, telefon → `tel`) |
| Modül detay | Perspektif blokları accordion'a dönmez — okunması gereken metin, açık kalır |
| Dil seçici | MobileNav içinde büyük dokunma hedefi (min 44×44px) |
| Fiyat | Kart üstünde, başlığın hemen altında — scroll gerektirmez |

Dokunma hedefi minimumu **44×44px** (Apple HIG). v1'deki `Sepete Ekle` butonu bunu karşılıyor; yeni gelen `ÇIKAR`, dil seçici, D-paketi önerisi kontrol edilecek.

---

## 8. YENİ ROUTE HARİTASI

```
/{locale}/                              ana sayfa
/{locale}/hizmetler/gizli-musteri-denetimi
/{locale}/hizmetler/personel-egitimi
/{locale}/moduller                      katalog + sepet
/{locale}/moduller/[slug]               YENİ — 5 modül detay + kriterler
/{locale}/surec
/{locale}/biz-kimiz                     YENİ (hakkimizda → 301)
/{locale}/iletisim
/{locale}/teklif                        sepet + iki yol (ödeme / teklif)
/{locale}/odeme/sonuc                   YENİ — 3D dönüşü
/{locale}/kvkk
/{locale}/gizlilik-politikasi
/{locale}/mesafeli-satis-sozlesmesi     YENİ
/{locale}/on-bilgilendirme              YENİ
/{locale}/iptal-iade                    YENİ
/api/teklif                             mevcut
/api/odeme                              YENİ
/api/odeme/callback                     YENİ — 3D webhook
```

`lib/site-config.ts` `routes` dizisi buna göre güncellenir → `sitemap.ts` ve `check-links.mjs` otomatik takip eder (v1'de bu bağ zaten kurulu).

---

## 9. UYGULAMA FAZLARI

| Faz | İş | Bağımlılık |
|---|---|---|
| **1** | PDF'lerin tam çıkarımı → `lib/audit-criteria.ts` (TR) | — |
| **2** | Fiyat modeli: `modules-data.ts` + sepet matematiği + D paketi mantığı | — |
| **3** | Modül detay sayfaları + kriter kartı tasarımı (mobile-first) | 1, 2 |
| **4** | `/biz-kimiz` + `company-data.ts` + placeholder guard + güven blokları | 1 |
| **5** | Ödeme: `lib/payment.ts`, `/api/odeme`, fatura formu, hukuki sayfalar | 2 |
| **6** | i18n altyapısı: next-intl, routing, font cyrillic, dil seçici | 3, 4, 5 |
| **7** | EN + RU içerik (arayüz + sayfa kopyası + kriterler) | 6 |
| **8** | Görseller (senin Gemini çıktıların) yerleştirme | — |
| **9** | **Polish** — motion, ritim, kontrast, iki tema × 3 dil × 3 kırılım | hepsi |
| **10** | QA + link checker + QA_REPORT.md | hepsi |

Faz 9 (polish) **bilerek sona bırakıldı** — v1'de atlanmasının sebebi buydu: yapı değişirken cila israf olur.

---

## 10. KABUL KRİTERLERİ

```
FİYAT & SEPET
[ ] Fiyatlar yalnızca modules-data.ts'te; hiçbir bileşende gömülü rakam yok
[ ] Sepet KDV ayrıştırması toplam üzerinden, kuruş farkı yok
[ ] A+B+C seçilince D önerisi çıkıyor, tıklayınca doğru takas oluyor
[ ] D seçiliyken A/B/C butonları devre dışı + "D paketine dahil" rozeti
[ ] Intl.NumberFormat ile tr-TR/en/ru formatı, para birimi hep TL

ÖDEME
[ ] PAYMENT_PROVIDER_KEY yokken ödeme yolu tamamen gizli, teklif yolu çalışıyor
[ ] Ödeme YOLU asla sahte başarı dönmüyor (teklif fallback'inden farklı)
[ ] Vergi no 10 hane, TC kimlik 11 hane + algoritma — client VE server'da
[ ] Mesafeli satış + ön bilgilendirme onayı olmadan ödeme başlamıyor (iki tarafta)
[ ] API anahtarı client bundle'a sızmıyor

KRİTERLER
[ ] 4 PDF'in TÜM kriterleri girildi, kod/metin/kanıt türü PDF'le birebir
[ ] Eşik değerler (60sn, 4dk, %11...) ayrı vurgulanıyor
[ ] Kanıt türü rozetleri doğru ikonla eşleşiyor
[ ] E/H/NA kolonu web'de yok, yerine açıklama var
[ ] user-select:none SADECE kriter metinlerinde, ekran okuyucu etkilenmiyor

BİZ KİMİZ
[ ] company-data.ts null alanları → ilgili blok hiç render edilmiyor
[ ] isPlaceholder true iken dev'de uyarı şeridi + build uyarısı
[ ] Sicil/vergi/MERSİS UYDURULMADI
[ ] Tesis profilleri boş → bölüm yok
[ ] Kanıt istatistikleri audit-criteria.ts'ten türetiliyor (elle yazılmıyor)

i18n
[ ] 3 dilde tüm sayfalar; hiçbir sayfada çevrilmemiş metin yok
[ ] Kiril glifler üç fontta doğru render (İ ş ğ ı ve Ж Щ Ъ Ы birlikte test)
[ ] hreflang + x-default doğru
[ ] Hukuki sayfaların EN/RU'sunda "bağlayıcı metin Türkçe" notu
[ ] Dil değişince sepet korunuyor (localStorage locale'den bağımsız)

MOBILE-FIRST
[ ] 375px'te tüm YENİ sayfalar taşmasız
[ ] Dokunma hedefleri min 44×44px
[ ] Sepet mobilde sticky alt çubuk
[ ] inputMode alanlara doğru atanmış

BUILD
[ ] tsc --noEmit / eslint . / npm run build / npm audit — hepsi temiz
[ ] check-links tüm locale'lerde 200
```

---

## 11. KAPSAM DIŞI (v2'de bilinçli yok)

- **Login / müşteri portalı** — ertelendi, v3'te değerlendirilecek. Ara çözüm önerisi: süresi dolan imzalı rapor linki.
- Blog / içgörüler
- Admin paneli, CMS
- Gerçek denetçi profilleri (isim/foto) — marka kararı, kalıcı
- Otel logosu duvarı — gerçek müşteri + yazılı izin olmadan asla

---

## 12. AÇIK KARARLAR (senden bekleniyor)

1. **Ödeme sağlayıcı:** iyzico (öneri) / PayTR / şimdilik ödeme kapalı kalsın mı?
2. **iyzico hesabın var mı?** Yoksa ödeme kodu yazılır ama kapalı doğar.
3. **Modül A'nın "Kat Hizmetleri / Oda İçi" kriterleri:** PDF başlığında var, çıkardığım metinde yok. PDF'in kalan sayfalarında mı, yoksa sen mi vereceksin?
4. **Modül E kriterleri:** PDF yok. Program içeriği olarak mı sunayım, yoksa sen kriter listesi verecek misin?
5. **Rusça metin:** ana dili Rusça birine okutabilir misin? Ben yazarım ama doğrulayamam.
