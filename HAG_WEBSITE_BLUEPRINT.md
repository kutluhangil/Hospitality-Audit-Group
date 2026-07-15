# HOSPITALITY AUDIT GROUP — Web Sitesi Blueprint

> **Proje kodu:** `hag-website`
> **Tagline:** "Marka Güvencesi ve Operasyonel Kaldıraç."
> **Tek cümlelik tanım:** Otellere gizli müşteri ziyaretiyle denetim ve personel eğitimi hizmeti sunan, hizmetlerin modül olarak seçilip teklif talep edilebildiği, ikna edici ve premium bir B2B tanıtım + lead-generation web sitesi.
> **Dil:** Site içeriği %100 Türkçe. Kod, dosya adları, commit mesajları İngilizce.
> **Hedef:** Bu doküman Claude Code tarafından fazlar halinde, sıfırdan bitmiş ürüne kadar uygulanacak. Hiçbir tasarım/mimari karar dışarıda bırakılmamıştır.

---

## 0. İŞ MODELİ ANALİZİ (PDF'ten Çıkarılan)

Kaynak PDF (Hospitality_Audit_Group_Ultra_Premium.pdf) analizi:

| Bulgu | Siteye Yansıması |
|---|---|
| Ana hizmet: gizli müşteri ziyaretiyle otel denetimi | Birincil hizmet sayfası + ana sayfa hero |
| İkinci hizmet: personel eğitimi (arkadaşın promptundan) | İkinci hizmet sayfası + Modül E |
| Modüler satış: A (Konaklama & Ön Büro), B (F&B), C (Wellness & Rekreasyon), D (360° Tam Denetim) | `/moduller` sayfası + "Teklif Sepeti" akışı |
| Değer önerileri: marka standardı ölçümü, gelir kaçağı önleme, SWOT raporu, ROI | Ana sayfa değer bölümleri, süreç bölümü |
| Güven unsurları: KVKK %100 uyum, NDA, sektörden üst düzey yönetici geçmişli denetçiler | Güven şeridi + yasal sayfalar |
| İletişim: web/e-posta/telefon | Footer + iletişim sayfası |

**Önemli iş kararı:** Bu B2B kurumsal hizmet olduğu için "satın alma" = **modül seç → teklif sepetine ekle → teklif formu gönder** akışıdır. Kredi kartı ödemesi YOK (v1). Form gönderimi gerçek çalışan bir API route üzerinden e-posta iletir (aşağıda detaylı).

---

## 1. FARKLILAŞTIRICI TABLO

| Sıradan denetim firması sitesi | Hospitality Audit Group sitesi |
|---|---|
| Stok otel fotoğrafları, mavi kurumsal tema | Claude.com estetiği: krem/koyu ikili tema, serif başlıklar, mono etiketler |
| "Hizmetlerimiz" düz listesi | Modüler mimari: modül kartları + canlı Teklif Sepeti |
| Statik "hakkımızda" metni | Hero'da canlı akan "Denetim Terminali" (imza öğe) |
| İletişim formu = mailto | Gerçek API route + Resend e-posta + başarı ekranı |
| Tek tema | Koyu + açık tema, sistem tercihi algılama, FOUC yok |

---

## 2. TASARIM FELSEFESİ

**Referans:** https://claude.com/product/claude-code — kullanıcı bu estetiği açıkça istedi. Bu brief'in kendisi paleti sabitliyor; Claude'un kendi renk dünyası (krem kağıt zemin, terracotta vurgu, koyu antrasit tema) birebir hedeftir.

Üç ilke:

1. **Kağıt + Terminal.** Açık tema bir "denetim raporu kağıdı" gibi (krem, serif başlık, bol beyaz alan). Koyu tema bir "operasyon terminali" gibi (antrasit, mono log satırları). İki tema aynı sitenin iki yüzü: rapor ve saha.
2. **Mono = kanıt dili.** Eyebrow etiketler, istatistikler, modül kodları (`MODUL-A`, `AUDIT-LOG`), süreç adımları JetBrains Mono ile yazılır. Denetim işinin "ölçülebilirlik" iddiasını tipografi taşır.
3. **Tek imza, geri kalanı disiplinli.** Görsel cesaret tek yerde harcanır: hero'daki Denetim Terminali. Diğer her şey sessiz, hizalı, ferah.

### 2.1 İmza Öğe: "Denetim Terminali"

Claude Code sayfasındaki terminal bloğunun bu sektöre çevirisi. Hero'nun sağında (mobilde altında) duran, yumuşak köşeli, tema-duyarlı bir panel. İçinde satır satır yazılan (typewriter efekti, Framer Motion + interval) sahte-canlı bir gizli müşteri denetim logu:

```
$ hag audit --module=A --property="•••• Hotel & Spa"

[14:02:11] check-in       süre: 3dk 40sn        ✓ standart: <4dk
[14:06:32] bellboy        karşılama süresi 45sn  ✓
[14:41:05] oda hijyeni    buklet düzeni          ✗ eksik: 2 kalem
[19:20:18] f&b            reçete gramajı         ✗ sapma: %11
[21:05:44] upselling      teklif yapılmadı       ✗ gelir kaybı

> rapor hazırlanıyor... SWOT + ROI analizi
> tespit edilen aylık gelir kaçağı: ₺ ***.***
```

- Satırlar 600ms arayla belirir, `✓` yeşil-nane, `✗` terracotta.
- Log döngü sonunda soluklaşıp baştan başlar (sonsuz loop, `prefers-reduced-motion` durumunda animasyonsuz tam liste gösterilir).
- Panel başlığında üç macOS noktası yerine üç küçük altın nokta (PDF'teki otel/yıldız kimliğine ince selam).

---

## 3. RENK PALETİ (CSS + TS TOKEN)

Tailwind, CSS değişkeni üzerinden çalışır; tema `class` stratejisiyle (`<html class="dark">`) değişir.

### 3.1 `app/globals.css` — tema değişkenleri

```css
:root {
  /* Açık tema — "Rapor Kağıdı" */
  --bg: #FAF9F5;          /* kağıt: Claude krem */
  --bg-soft: #F0EEE6;     /* oat: kart/section zeminleri */
  --surface: #FFFFFF;      /* yükseltilmiş kartlar */
  --ink: #141413;          /* ana metin */
  --ink-muted: #6B6A66;    /* ikincil metin */
  --border: #E3DFD4;
  --accent: #D97757;       /* terracotta: CTA, vurgu */
  --accent-hover: #C4633F;
  --brass: #A98A44;        /* pirinç: otel kimliği, çok az kullanılır */
  --ok: #4C8A67;           /* denetim ✓ */
  --terminal-bg: #262624;  /* açık temada bile terminal koyu kalır */
  --terminal-ink: #EDEBE3;
}

.dark {
  /* Koyu tema — "Operasyon Terminali" */
  --bg: #1F1E1D;
  --bg-soft: #262624;
  --surface: #2B2A28;
  --ink: #F5F4EF;
  --ink-muted: #A6A39A;
  --border: #3A3835;
  --accent: #D97757;
  --accent-hover: #E28A6D;
  --brass: #C8A55C;
  --ok: #6FB08D;
  --terminal-bg: #171716;
  --terminal-ink: #EDEBE3;
}
```

### 3.2 `lib/tokens.ts` (TS tarafında ihtiyaç olursa)

```ts
export const colors = {
  accent: "#D97757",
  brass: { light: "#A98A44", dark: "#C8A55C" },
  ok: { light: "#4C8A67", dark: "#6FB08D" },
} as const;
```

### 3.3 Tailwind eşlemesi (`tailwind.config.ts`)

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "bg-soft": "var(--bg-soft)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        line: "var(--border)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        brass: "var(--brass)",
        ok: "var(--ok)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: { xl2: "1.25rem" },
      maxWidth: { content: "72rem" },
    },
  },
  plugins: [],
};
export default config;
```

---

## 4. TİPOGRAFİ

Claude.com'un Tiempos/Styrene ikilisi lisanslı olduğundan Google Fonts'tan en yakın karakterli eşdeğerler seçildi (next/font ile self-host, CLS yok):

| Rol | Font | Gerekçe |
|---|---|---|
| Display / başlıklar | **Source Serif 4** (weights 400, 600) | Tiempos'un okuma-serif karakterine en yakın açık font; büyük punto krem zemin üzerinde "rapor" hissi verir |
| Body / UI | **Inter** (400, 500, 600) | Styrene'in nötr grotesk rolünü üstlenir, uzun Türkçe paragraflarda sorunsuz |
| Etiket / veri / kod | **JetBrains Mono** (400, 500) | Eyebrow'lar, modül kodları, istatistikler, Denetim Terminali |

Tip skalası (Tailwind sınıflarıyla):

- Hero H1: `font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight`
- Section H2: `font-serif text-3xl md:text-4xl`
- Eyebrow: `font-mono text-xs uppercase tracking-[0.2em] text-accent`
- Body: `text-base md:text-lg text-ink-muted leading-relaxed`
- İstatistik rakamları: `font-mono text-4xl text-ink`

`app/layout.tsx` içinde:

```tsx
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";

const serif = Source_Serif_4({ subsets: ["latin", "latin-ext"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-mono" });
```

> **DİKKAT:** Türkçe karakterler (ş, ğ, İ, ı) için `latin-ext` subset'i zorunlu.

---

## 5. TEKNOLOJİ YIĞINI

| Katman | Seçim | Not |
|---|---|---|
| Framework | Next.js 14 (App Router) + TypeScript | `create-next-app@14 --ts --tailwind --eslint --app --src-dir=false` |
| Stil | Tailwind CSS + CSS değişkenleri | Tema `class` stratejisi |
| Tema yönetimi | `next-themes` | Sistem tercihi + toggle, FOUC önleme |
| Animasyon | Framer Motion | Hero terminal, scroll-reveal, sepet rozeti |
| İkon | `lucide-react` | Hafif, tutarlı çizgi ikonlar |
| Form gönderimi | Next.js Route Handler + **Resend** | `RESEND_API_KEY` yoksa graceful fallback (aşağıda) |
| Durum (sepet) | React Context + `localStorage` persist | Harici state kütüphanesi YOK |
| Deploy | Vercel | Bölüm 12'deki uyum listesi |

Kurulacak paketler:

```bash
npm i next-themes framer-motion lucide-react resend
```

---

## 6. KLASÖR YAPISI

```
hag-website/
├── CLAUDE.md                        # Bölüm 13'teki içerikle
├── README.md                        # Bölüm 14'teki şablonla
├── .env.example                     # RESEND_API_KEY=, CONTACT_EMAIL=
├── app/
│   ├── layout.tsx                   # fontlar, ThemeProvider, Header/Footer, metadata
│   ├── page.tsx                     # Ana sayfa
│   ├── globals.css
│   ├── not-found.tsx                # Özel 404 (mono: "404 — kayıt bulunamadı")
│   ├── hizmetler/
│   │   ├── gizli-musteri-denetimi/page.tsx
│   │   └── personel-egitimi/page.tsx
│   ├── moduller/page.tsx
│   ├── surec/page.tsx
│   ├── hakkimizda/page.tsx
│   ├── iletisim/page.tsx
│   ├── teklif/page.tsx              # Sepet + teklif formu
│   ├── kvkk/page.tsx
│   ├── gizlilik-politikasi/page.tsx
│   └── api/
│       └── teklif/route.ts          # POST — form/e-posta
├── components/
│   ├── layout/Header.tsx            # sticky, blur, tema toggle, sepet rozeti
│   ├── layout/Footer.tsx
│   ├── layout/ThemeToggle.tsx
│   ├── layout/MobileNav.tsx
│   ├── home/Hero.tsx
│   ├── home/AuditTerminal.tsx       # İMZA ÖĞE
│   ├── home/TrustStrip.tsx
│   ├── home/ServicesOverview.tsx
│   ├── home/ProcessSection.tsx
│   ├── home/StatsSection.tsx
│   ├── home/TestimonialsSection.tsx
│   ├── home/FinalCTA.tsx
│   ├── modules/ModuleCard.tsx
│   ├── modules/QuoteCartProvider.tsx # Context + localStorage
│   ├── modules/QuoteCartBadge.tsx
│   ├── forms/QuoteForm.tsx
│   ├── forms/ContactForm.tsx
│   └── ui/{Button,SectionHeading,Eyebrow,Card,Reveal}.tsx
├── lib/
│   ├── modules-data.ts              # Modül A–E içerikleri (tek kaynak)
│   ├── site-config.ts               # nav, iletişim, metadata
│   └── tokens.ts
└── public/
    ├── logo.svg                     # Bölüm 7.1'de tarifli
    └── og-image.png
```

---

## 7. MARKA VARLIKLARI

### 7.1 Logo (SVG, elle kod yazılacak — harici dosya yok)

PDF'teki yıldız+çember kimliğinin sadeleştirilmiş hali: ince çizgili çember içinde beş kollu yıldız konturu, ortasında mono "H". Renk `currentColor` — böylece iki temada da doğru görünür. Header'da 32px, footer'da 40px. Yanında `font-serif` ile "Hospitality Audit Group" (mobilde sadece "HAG").

### 7.2 Görseller

Stok fotoğraf KULLANILMAYACAK. Görsel dil tamamen tipografi + soyut paneller:
- Hizmet kartlarında lucide ikonları (`ConciergeBell`, `UtensilsCrossed`, `Waves`, `Radar`, `GraduationCap`).
- `og-image.png`: kod ile üretilecek basit kompozisyon (krem zemin, serif başlık, terracotta çizgi) — `@vercel/og` yerine tek statik PNG yeterli; Claude Code bunu bir HTML/canvas script'iyle üretebilir ya da düz tek renk + tipografili SVG'den çevirebilir.

---

## 8. SAYFA SAYFA İÇERİK VE YAPI

> Aşağıdaki tüm başlık ve metinler **nihai kopydır** — birebir kullanılacak. Lorem ipsum YASAK.

### 8.1 Ana Sayfa `/`

**Sıra:** Hero → TrustStrip → ServicesOverview → ProcessSection → StatsSection → ModulesTeaser → TestimonialsSection → FinalCTA

**Hero**
- Eyebrow: `GİZLİ MÜŞTERİ DENETİMİ • PERSONEL EĞİTİMİ`
- H1: **"Misafiriniz her şeyi görür. Biz de öyle."**
- Alt metin: "Sektörde üst düzey yöneticilik yapmış denetçilerimiz, tesisinize misafir olarak gelir; vaat ettiğiniz marka standardı ile sahada yaşanan gerçek arasındaki boşluğu ölçer, gelir kaçaklarını rakamlarla önünüze koyar."
- CTA'lar: `Teklif Alın` (accent, `/moduller`e) + `Sürecimizi İnceleyin` (ghost, `/surec`e)
- Sağda: **AuditTerminal** (Bölüm 2.1)

**TrustStrip** — tek satır, mono, ayraçlı:
`KVKK %100 UYUM · KARŞILIKLI NDA · YÖNETİM KURULUNA HAZIR SWOT RAPORU · SEKTÖR KIDEMLİ DENETÇİLER`

**ServicesOverview** — iki büyük kart:
1. **Gizli Müşteri ile Otel Denetimi** — "Rezervasyondan check-out'a, misafir deneyimi döngüsünün tamamını habersiz ve tarafsız ölçeriz." → `/hizmetler/gizli-musteri-denetimi`
2. **Personel Eğitimi** — "Denetimde tespit edilen gelişim alanlarını, departman bazlı ve ölçülebilir eğitim programlarına çeviririz." → `/hizmetler/personel-egitimi`

**ProcessSection** — 4 adım, mono numaralı (gerçek bir sıralama olduğu için numara meşru):
1. `01 KEŞİF` — İhtiyaç görüşmesi, NDA imzası, modül seçimi.
2. `02 SAHA` — Habersiz gizli müşteri ziyareti; standart kontrol listeleriyle kanıt toplama.
3. `03 RAPOR` — SWOT + ROI analizi; gelir kaçağı ve gelişim alanları net rakamlarla.
4. `04 DÖNÜŞÜM` — Departman bazlı personel eğitimi ve takip denetimi.

**StatsSection** — 3 mono istatistik (dürüst, iddiasız çerçeveli):
- `4 modül` — ihtiyaca göre seçilebilir denetim mimarisi
- `48 saat` — saha ziyareti sonrası ön bulgu paylaşımı
- `%100` — KVKK uyumlu veri toplama ve kanıt analizi

**ModulesTeaser** — 5 modül kartının kompakt hali + "Tüm modülleri inceleyin →"

**TestimonialsSection** — 2 anonim referans (gizlilik/NDA temasıyla tutarlı):
> "Denetim raporundaki gelir kaçağı kalemi, hizmet bedelinin kendisini ilk çeyrekte amorti etti." — *Genel Müdür, 5 yıldızlı resort (NDA gereği anonim)*
> "Eğitim sonrası upselling dönüşümümüz iki katına çıktı." — *F&B Direktörü, şehir oteli*

**FinalCTA** — koyu panel (her iki temada `--terminal-bg`): "Tesisinizin gerçek fotoğrafını çekelim." + `Teklif Alın` butonu.

### 8.2 `/hizmetler/gizli-musteri-denetimi`

- Hero: H1 "Gizli Müşteri ile Otel Denetimi", alt metin PDF sayfa 2'nin özü.
- "Neyi ölçeriz" bölümü — PDF'teki 4 başlık aynen:
  - **Karşılama ve İlk İzlenim:** rezervasyon doğruluğu, valet/bellboy hızı, check-in protokol uyumu
  - **Ön Büro Verimliliği:** problem çözme refleksleri, upselling süreç yönetimi
  - **Kat Hizmetleri Hassasiyeti:** oda hijyeni, buklet düzeni, talep karşılama süresi
  - **Check-Out ve Uğurlama:** doğru faturalandırma, loyalty yönlendirme, uğurlama nezaketi
- "F&B ve Gelir Kaçağı" bölümü: Gastronomi & Servis + Bar & Reçete Güvencesi (PDF sayfa 3).
- "Çıktınız" bölümü: yönetim kuruluna hazır SWOT raporu, ROI analizi, departman karnesi.
- Sayfa sonu CTA: ilgili modüllere (`A`, `B`, `C`, `D`) hızlı linkler + `Teklif Alın`.

### 8.3 `/hizmetler/personel-egitimi`

- H1: "Denetimden Eğitime: Ölçülen Gelişir."
- Konsept: eğitim programları denetim bulgularından beslenir (kapanış döngüsü). Bağımsız da satın alınabilir.
- Program başlıkları:
  - Ön Büro Mükemmelliği (check-in hızı, şikâyet yönetimi, upselling teknikleri)
  - F&B Servis Standartları (servis akışı, menü tavsiye satışı, reçete disiplini)
  - Kat Hizmetleri Kalite Sistemi (hijyen standartları, oda kontrol listeleri)
  - Liderlik & Vardiya Yönetimi (süpervizör ve müdür seviyesi)
- Format satırı (mono): `YERİNDE EĞİTİM · ATÖLYE · ROL CANLANDIRMA · ÖLÇÜM: ÖN/SON TEST + TAKİP DENETİMİ`
- CTA: Modül E'yi sepete ekle + `Teklif Alın`.

### 8.4 `/moduller` — Modüler Hizmet Mimarisi (SİTENİN TİCARİ KALBİ)

- Giriş metni PDF sayfa 4'ten uyarlanır: "İhtiyacınız olan modülleri özgürce seçin, yatırımınızı doğrudan öncelikli alanlarınıza yönlendirin."
- 5 ModuleCard, `lib/modules-data.ts`'ten beslenir:

```ts
export const modules = [
  { code: "A", slug: "konaklama-on-buro", title: "Konaklama & Ön Büro",
    summary: "Giriş/çıkış süreçleri, check-in hızı, sadakat kartı uygulamaları ve oda kalite/buklet standartları denetimi.",
    scope: ["Check-in / check-out protokol uyumu", "Bellboy & valet hız ölçümü", "Oda hijyeni ve buklet düzeni", "Loyalty yönlendirme kontrolü"],
    icon: "ConciergeBell" },
  { code: "B", slug: "yiyecek-icecek", title: "Yiyecek & İçecek (F&B)",
    summary: "Restoran, à la carte, bar ve oda servisinde sunum, hız, satış performansı ve kaçak denetimi.",
    scope: ["Servis hızı ve sunum kalitesi", "Menü tavsiye satış becerisi", "Reçete gramajı & porsiyon kontrolü", "Gelir koruma süreçleri"],
    icon: "UtensilsCrossed" },
  { code: "C", slug: "wellness-rekreasyon", title: "Wellness & Rekreasyon",
    summary: "SPA, havuz, plaj ve spor alanlarında hijyen, güvenlik, terapist uzmanlığı ve hizmet standardı denetimleri.",
    scope: ["SPA & havuz hijyen kontrolü", "Güvenlik prosedür uyumu", "Terapist uzmanlık değerlendirmesi", "Rezervasyon & kapasite yönetimi"],
    icon: "Waves" },
  { code: "D", slug: "360-tam-denetim", title: "360° Tam Denetim",
    summary: "Tesis genelindeki tüm departmanların entegre denetimi, departmanlar arası koordinasyon ve tam kapsamlı SWOT raporu.",
    scope: ["A + B + C modüllerinin tamamı", "Departmanlar arası koordinasyon analizi", "Yönetim kuruluna hazır SWOT", "ROI ve gelir kaçağı raporu"],
    icon: "Radar", featured: true },
  { code: "E", slug: "personel-egitimi", title: "Personel Eğitimi",
    summary: "Denetim bulgularından beslenen, departman bazlı ve ölçülebilir yerinde eğitim programları.",
    scope: ["Ön büro & F&B & kat hizmetleri programları", "Rol canlandırma atölyeleri", "Ön/son test ölçümü", "Takip denetimiyle doğrulama"],
    icon: "GraduationCap" },
] as const;
```

- Kart tasarımı: sol üstte mono `MODÜL A` rozeti, serif başlık, kapsam listesi (ince `✓` işaretli), altta **`Sepete Ekle`** butonu. Eklenince buton `Sepette ✓` durumuna geçer (toggle). `D` kartı `featured`: accent kenarlıklı + "En kapsamlı" mono rozet.
- Fiyat GÖSTERİLMEZ; her kartta mono not: `FİYAT: TESİS ÖLÇEĞİNE GÖRE TEKLİFLENDİRİLİR`.
- Sayfa altında sticky olmayan bir "Seçiminiz" özeti + `Teklif Formuna Geç →` (`/teklif`).
- KVKK/NDA güven kutusu (PDF sayfa 4'teki metnin uyarlaması) sayfa sonunda.

### 8.5 Teklif Sepeti Mekaniği

`QuoteCartProvider` (Context):

```ts
type QuoteCart = { selected: string[]; add(code: string): void; remove(code: string): void; toggle(code: string): void; clear(): void };
```

- `localStorage` anahtarı: `hag-quote-cart` (JSON string[]). Mount'ta hydrate, değişimde persist. SSR uyumsuzluğuna karşı `useEffect` içinde okunur; hydrate olana dek rozet gizli.
- Header'daki `QuoteCartBadge`: sepet doluysa `Teklif (2)` şeklinde accent rozet, `/teklif`e link, Framer Motion ile sayı değişiminde küçük scale-pop.

### 8.6 `/teklif` — Teklif Formu

- Solda: seçili modüllerin listesi (çıkarılabilir), boşsa "Henüz modül seçmediniz" + `/moduller` linki. Modül seçilmeden de form gönderilebilir (genel görüşme talebi).
- Sağda `QuoteForm` alanları:
  - Ad Soyad* · Kurumsal E-posta* · Telefon · Tesis Adı* · Tesis Tipi (select: Şehir Oteli / Resort / Butik / Zincir) · Oda Sayısı (select aralıkları) · Mesaj (textarea)
  - Gizli alan: `selectedModules` (context'ten)
  - KVKK onayı*: checkbox + "Kişisel verilerimin [KVKK Aydınlatma Metni](/kvkk) kapsamında işlenmesini kabul ediyorum."
- Client-side doğrulama (native + küçük yardımcılar; kütüphane yok). Hata mesajları alan altında, `aria-describedby` bağlı.
- Gönderim: `POST /api/teklif` → başarıda form yerine başarı paneli: mono `TALEP ALINDI — REF: HAG-{timestamp36}` + "48 saat içinde dönüş yapıyoruz." + sepet temizlenir.

### 8.7 `POST /api/teklif` — Route Handler

```ts
// app/api/teklif/route.ts — davranış sözleşmesi
// 1. JSON body'yi parse et, zorunlu alanları ve kvkkConsent === true'yu doğrula → değilse 400 + { error }
// 2. Basit honeypot: body.website dolu ise sessizce 200 dön (bot)
// 3. process.env.RESEND_API_KEY varsa: Resend ile CONTACT_EMAIL'e formatlı e-posta gönder
//    (konu: "Yeni Teklif Talebi — {tesisAdi} [{modul kodları}]")
// 4. API key YOKSA: console.log ile payload'u logla ve yine 200 dön
//    → site demo/lokal ortamda da "çalışır" kalır, form asla kırılmaz
// 5. Her durumda { ok: true, ref } döndür
```

`.env.example`:
```
RESEND_API_KEY=
CONTACT_EMAIL=corporate@hospitalityauditgroup.com
```

### 8.8 `/surec`

Ana sayfadaki 4 adımın derinleştirilmiş hali + "Kanıt Standardımız" bölümü (zaman damgalı gözlem kayıtları, standart kontrol listeleri, çift denetçi doğrulaması) + KVKK/NDA kutusu + SSS (5 soru, `<details>` ile, JS'siz):
1. Denetçileriniz kim? — Sektörde üst düzey yöneticilik yapmış, aktif olarak otelcilikte çalışmayan profesyoneller.
2. Ziyaret ne kadar sürer? — Modüle göre 1–3 gece konaklama.
3. Personel anlayabilir mi? — Denetçiler gerçek misafir profiliyle, gerçek rezervasyonla gelir.
4. Rapor ne zaman teslim edilir? — Ön bulgular 48 saat, tam SWOT raporu 10 iş günü.
5. Verilerimiz güvende mi? — %100 KVKK uyumu + karşılıklı NDA.

### 8.9 `/hakkimizda`

- H1: "Otelciliği yönetenler, şimdi ölçüyor."
- Kısa manifesto (3 paragraf): ekip sektör kıdemi, tarafsızlık ilkesi, "rakam konuşur" yaklaşımı.
- Değerler: `TARAFSIZLIK · GİZLİLİK · ÖLÇÜLEBİLİRLİK` (mono şerit).
- Kişi isimleri/fotoğrafları KULLANILMAZ (gizli müşteri firması için anonimlik tutarlı bir marka kararıdır — sayfada bu espriyle kısa bir not: "Denetçilerimizin yüzünü göremezsiniz. Misafirleriniz de göremiyor.").

### 8.10 `/iletisim`

- İki kolon: solda iletişim bilgileri (site-config'ten: web, `corporate@hospitalityauditgroup.com`, `+90 (212) XXX XX XX`, mono etiketlerle) + çalışma saatleri; sağda `ContactForm` (Ad, E-posta, Konu, Mesaj, KVKK checkbox) → aynı `/api/teklif` endpoint'i `type: "contact"` alanıyla kullanılır.
- Harita YOK (fiziksel adres verilmiyor — gizlilik markası).

### 8.11 `/kvkk` ve `/gizlilik-politikasi`

- Düz tipografik yasal sayfalar (`prose` benzeri özel stiller). Başlıklar serif, gövde sans.
- KVKK sayfası: veri sorumlusu, işlenen veriler (form alanları), işleme amacı (teklif/iletişim), saklama süresi, haklar (11. madde), başvuru e-postası. Genel şablon metni yaz, sayfa başına not: *"Bu metin şablondur; yayına almadan önce hukuk danışmanınızla teyit edin."*
- Footer'dan linklenir.

### 8.12 `not-found.tsx`

Terminal esprisi: mono `$ hag find --page="..."` → `404 — kayıt bulunamadı` + `Ana sayfaya dön` butonu.

---

## 9. LAYOUT BİLEŞENLERİ

### Header
- Sticky, `backdrop-blur`, alt kenar `border-line`, zemin `bg/80`.
- Sol: logo + isim. Orta/sağ nav: `Hizmetler` (dropdown: iki hizmet), `Modüller`, `Süreç`, `Hakkımızda`, `İletişim`.
- Sağ uç: `ThemeToggle` (Sun/Moon ikonu, `next-themes`, `aria-label` var) + `QuoteCartBadge` + `Teklif Alın` accent butonu (mobilde gizli, MobileNav içinde).
- MobileNav: hamburger → tam ekran overlay, büyük serif linkler, Framer Motion stagger.

### Footer
- 4 kolon: marka+tagline / Hizmetler / Kurumsal (Süreç, Hakkımızda, KVKK, Gizlilik) / İletişim bilgileri.
- Alt şerit: `HOSPITALITY AUDIT GROUP © 2026` (mono) + tema toggle tekrarı.

### Ortak UI
- `Button`: `variant: "accent" | "ghost" | "terminal"`; accent = terracotta dolu, hover koyulaşır, `focus-visible:ring-2 ring-accent` her varyantta.
- `Eyebrow`, `SectionHeading` (eyebrow + H2 + opsiyonel açıklama), `Card` (surface + border + `rounded-xl2`), `Reveal` (Framer Motion `whileInView`, `once: true`, y:16→0, opacity, `useReducedMotion` kontrolü).

---

## 10. ANİMASYON BÜTÇESİ (disiplinli)

| Yer | Efekt | Kural |
|---|---|---|
| AuditTerminal | Satır satır typewriter + loop | Tek "orkestra anı"; reduced-motion'da statik |
| Section girişleri | `Reveal` fade+rise, 0.5s | Sadece ilk görünümde |
| Sepet rozeti | Sayı değişiminde scale-pop | 200ms |
| Buton hover | Renk geçişi 150ms | Transform yok |
| Bunun dışında animasyon **eklenmez** | | |

---

## 11. ERİŞİLEBİLİRLİK & SEO TABANI

- Tüm sayfalarda tek `<h1>`, sıralı başlık hiyerarşisi.
- Renk kontrastı: `--ink-muted` her iki temada AA'yı geçecek şekilde yukarıdaki değerlerle sabit.
- Klavye: tüm interaktifler `focus-visible` halkalı; MobileNav açıkken focus trap + `Esc` ile kapanır.
- `metadata` API ile sayfa başına `title` (`{Sayfa} — Hospitality Audit Group`) ve `description`; `openGraph` + `og-image.png`.
- `lang="tr"`, semantic landmark'lar (`header/nav/main/footer`).
- `sitemap.ts` ve `robots.ts` (Next API'siyle) eklenir.

---

## 12. VERCEL UYUM KONTROL LİSTESİ

- [ ] `npm run build` sıfır hata/uyarı ile geçer (TS strict).
- [ ] Env değişkenleri yalnızca server tarafında okunur (`RESEND_API_KEY` client bundle'a sızmaz).
- [ ] `next/font` ile self-host fontlar (harici CSS font isteği yok).
- [ ] Görseller `next/image` veya saf SVG.
- [ ] API route Node runtime'da (`export const runtime = "nodejs"`), Resend uyumu için.
- [ ] 404 ve tüm dinamik olmayan sayfalar statik prerender.
- [ ] `metadataBase` ayarlı (OG url'leri mutlak).

---

## 13. `CLAUDE.md` (proje köküne aynen yazılacak)

```md
# HAG Website — Çalışma Kuralları

## Git (KESİN KURALLAR)
- ASLA `git commit` veya `git push` çalıştırma. Tüm commit ve push işlemlerini Kutluhan manuel yapar.
- ASLA branch oluşturma (`git branch`, `git checkout -b` yasak). Mevcut branch'te kal.
- Commit mesajlarına, koda veya PR'lara hiçbir Claude/AI atfı ekleme. "Co-Authored-By: Claude" YASAK.

## Kod stili
- Yorumlar İngilizce, doğal ve profesyonel; "ne"yi değil "neden"i açıklar.
- TypeScript strict; `any` yasak.
- İçerik dili Türkçe — HAG_WEBSITE_BLUEPRINT.md'deki kopya birebir kullanılır, lorem ipsum yazılmaz.

## Tasarım
- Tüm renkler CSS değişkenlerinden gelir; hardcoded hex yalnızca globals.css ve tokens.ts'te bulunur.
- Yeni animasyon eklenmez (Bölüm 10 bütçesi sabittir).
```

---

## 14. `README.md` ŞABLONU

```md
# Hospitality Audit Group — Website

Otellere gizli müşteri denetimi ve personel eğitimi sunan HAG'ın kurumsal web sitesi.
Next.js 14 · TypeScript · Tailwind CSS · Framer Motion

## Geliştirme
npm install
cp .env.example .env.local   # RESEND_API_KEY opsiyonel — yoksa form logger moduna düşer
npm run dev

## Yapı
- `app/` — App Router sayfaları ve /api/teklif endpoint'i
- `components/` — layout, home, modules, forms, ui
- `lib/modules-data.ts` — modül içeriklerinin tek kaynağı

## Tema
Açık ("Rapor Kağıdı") ve koyu ("Operasyon Terminali") tema, `next-themes` ile.
```

---

## 15. 9-AJAN SİSTEMİ (dosya sahipliği + kabul kriterleri)

> Her ajan yalnızca kendi dosyalarına yazar. Sıra: 1 → 2 → (3,4,5 paralel olabilir) → 6 → 7 → 8 → 9.

**AJAN 1 — Foundation**
Sahiplik: proje init, `tailwind.config.ts`, `globals.css`, `lib/tokens.ts`, `lib/site-config.ts`, font kurulumu, `next-themes` provider, `CLAUDE.md`, `.env.example`.
Kabul: `npm run dev` açılıyor; tema toggle'sız da `class="dark"` elle eklenince tüm değişkenler değişiyor; Türkçe karakterler her üç fontta doğru render.

**AJAN 2 — Layout**
Sahiplik: `Header`, `Footer`, `ThemeToggle`, `MobileNav`, `app/layout.tsx`, `not-found.tsx`.
Kabul: sticky header blur çalışıyor; toggle FOUC üretmiyor (`suppressHydrationWarning`); mobil menü focus trap + Esc; tüm nav linkleri doğru path'e gidiyor.

**AJAN 3 — Home & İmza**
Sahiplik: `app/page.tsx`, `components/home/*` (özellikle `AuditTerminal`).
Kabul: terminal logu loop'lu typewriter ile akıyor; `prefers-reduced-motion`'da statik tam liste; hero mobilde tek kolon; tüm CTA'lar doğru sayfalara.

**AJAN 4 — Hizmet Sayfaları**
Sahiplik: `app/hizmetler/**`, `app/surec/page.tsx`, `app/hakkimizda/page.tsx`.
Kabul: Bölüm 8 kopyası birebir; SSS `<details>` klavyeyle açılıyor; her sayfada tek h1 + metadata.

**AJAN 5 — Modüller & Sepet**
Sahiplik: `app/moduller/page.tsx`, `lib/modules-data.ts`, `components/modules/*`.
Kabul: 5 kart data dosyasından render; Sepete Ekle toggle çalışıyor; refresh sonrası localStorage'tan sepet geri geliyor; header rozeti canlı güncelleniyor; D kartı featured stilinde.

**AJAN 6 — Formlar & API**
Sahiplik: `app/teklif/page.tsx`, `app/iletisim/page.tsx`, `components/forms/*`, `app/api/teklif/route.ts`.
Kabul: zorunlu alan/KVKK doğrulaması hem client hem server'da; API key'siz ortamda form 200 + başarı paneli; Resend key'liyken e-posta şablonu modül kodlarını içeriyor; honeypot botu sessiz yutuyor; başarıda sepet temizleniyor.

**AJAN 7 — İçerik & Yasal**
Sahiplik: `app/kvkk/page.tsx`, `app/gizlilik-politikasi/page.tsx`, `sitemap.ts`, `robots.ts`, `og-image.png`, metadata denetimi.
Kabul: yasal sayfalar okunaklı tipografide; sitemap tüm route'ları listeliyor; her sayfanın title/description'ı benzersiz.

**AJAN 8 — Motion & Polish**
Sahiplik: `components/ui/Reveal.tsx`, mikro-etkileşim geçişleri, spacing/kontrast düzeltmeleri (tüm dosyalarda salt-stil dokunuşu hakkı).
Kabul: Bölüm 10 bütçesi dışına çıkılmamış; her iki temada tüm section'lar ekran görüntüsüyle kontrol edilmiş; AA kontrast korunuyor.

**AJAN 9 — QA & Test** (arkadaşın "test et" şartının karşılığı)
Sahiplik: `scripts/check-links.mjs`, QA raporu.
Kabul: aşağıdaki listenin TAMAMI işaretli.

### 15.1 AJAN 9 — Zorunlu QA Kontrol Listesi

```
BUILD
[ ] npm run lint temiz
[ ] npm run build sıfır hata
[ ] npx tsc --noEmit temiz

LİNKLER (scripts/check-links.mjs: prod build'i başlat, tüm sayfaları fetch et,
        HTML'deki iç href'leri topla, her birinin 200 döndüğünü doğrula)
[ ] / , /hizmetler/* , /moduller , /surec , /hakkimizda , /iletisim ,
    /teklif , /kvkk , /gizlilik-politikasi → hepsi 200
[ ] Header + Footer + gövde içi TÜM iç linkler 200 (script çıktısı rapora eklenir)
[ ] Olmayan path özel 404 gösteriyor

FONKSİYON
[ ] Sepet: ekle → rozet artar → refresh → kalıcı → teklif sayfasında listelenir → çıkar çalışır
[ ] Teklif formu: boş gönderim alan hataları; geçerli gönderim REF'li başarı paneli; sepet sıfırlanır
[ ] İletişim formu aynı endpoint'le başarılı
[ ] KVKK işaretlenmeden gönderim engelleniyor (client + server)

GÖRSEL (her iki temada ayrı ayrı)
[ ] 375px / 768px / 1440px genişliklerde tüm sayfalar taşmasız
[ ] Tema geçişinde okunamayan metin yok; terminal paneli iki temada da doğru
[ ] Fontlarda Türkçe karakter (İ ş ğ ı) bozulması yok

ERİŞİLEBİLİRLİK
[ ] Sadece klavye ile tüm site gezilebiliyor, focus halkası görünür
[ ] prefers-reduced-motion açıkken terminal statik
```

---

## 16. UYGULAMA ZAMAN ÇİZELGESİ + ÖRNEK COMMIT'LER

> Commit'leri **Kutluhan atar**; Claude Code yalnızca mesaj önerir.

| Faz | İş | Örnek commit mesajı |
|---|---|---|
| 1 | Ajan 1 | `chore: scaffold next14 app with theme tokens and fonts` |
| 2 | Ajan 2 | `feat: add header, footer, theme toggle and mobile nav` |
| 3 | Ajan 3 | `feat: build home page with audit terminal hero` |
| 4 | Ajan 4 | `feat: add service, process and about pages` |
| 5 | Ajan 5 | `feat: add modules catalog with quote cart` |
| 6 | Ajan 6 | `feat: add quote form and email api route` |
| 7 | Ajan 7 | `feat: add legal pages, sitemap and metadata` |
| 8 | Ajan 8 | `polish: refine motion, spacing and contrast` |
| 9 | Ajan 9 | `test: add link checker and complete qa pass` |

---

## 17. KAPSAM DIŞI (v1'de bilinçli yok — sonradan sorulmasın)

- Online ödeme (B2B teklif modeli; ileride Lemon Squeezy/iyzico eklenebilir)
- İngilizce dil desteği (i18n altyapısı kurulmayacak; v2 adayı)
- CMS (içerik `lib/` dosyalarında; sahibi kod bilmiyorsa v2'de değerlendirilir)
- Blog, admin paneli, gerçek denetçi profilleri

— SON —
