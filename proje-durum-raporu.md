# HAG Website — Proje Durum Raporu
> Tarih: 2026-07-16 | Kaynak dokümanlar: `blueprint-v1.md` + `superpowers/specs/2026-07-15-hag-v2-design.md`

---

## ✅ TAMAMLANMIŞ KISIMLAR

### Temel Altyapı (v1 Tam)
- [x] Next.js 16 + React 19 + TypeScript strict kurulumu
- [x] Tailwind CSS v4 + CSS değişken sistemi (renk paleti, temalar)
- [x] Açık/Koyu tema (`next-themes`, FOUC yok)
- [x] `Source Serif 4` + `Inter` + `JetBrains Mono` fontları (latin-ext dahil)
- [x] `lib/tokens.ts` — TS renk sabitleri
- [x] `lib/site-config.ts` — navigasyon + metadata
- [x] `CLAUDE.md`, `README.md`, `.env.example`

### Layout Bileşenleri
- [x] `Header` — sticky, blur, tema toggle, dil seçici, sepet rozeti
- [x] `Footer` — 4 kolon + ETBİS alanı
- [x] `ThemeToggle`, `MobileNav` (focus trap + Esc)
- [x] `LocaleSwitcher` (TR/EN)

### Ana Sayfa
- [x] `Hero` — H1 + AuditTerminal
- [x] `AuditTerminal` — typewriter loop + `prefers-reduced-motion` desteği
- [x] `TrustStrip` — mono şerit
- [x] `ServicesOverview` — iki hizmet kartı
- [x] `ProcessSection` — 4 adım
- [x] `StatsSection` — 3 istatistik
- [x] `ModulesTeaser` — 5 modül özeti
- [x] `EvidenceShowcase` — kanıt gösterimi (ana sayfada TestimonialsSection'ın YERİNE konulmuş)
- [x] `FinalCTA` — terminal paneli CTA

### Sayfalar
- [x] `/hizmetler/gizli-musteri-denetimi` — tam içerikli
- [x] `/hizmetler/personel-egitimi` — tam içerikli
- [x] `/moduller` — 5 modül kartı + sepet
- [x] `/moduller/[slug]` — modül detay sayfaları (5 adet, kriterler dahil)
- [x] `/surec` — 4 adım + SSS (5 soru)
- [x] `/biz-kimiz` — manifesto + ekip bilgisi
- [x] `/iletisim` — form + iletişim bilgisi
- [x] `/teklif` — sepet + form (iki yol: teklif / ödeme)
- [x] `/odeme/sonuc` — ödeme sonuç sayfası (statik)
- [x] `/kvkk`, `/gizlilik-politikasi`, `/mesafeli-satis-sozlesmesi`, `/on-bilgilendirme`, `/iptal-iade` — yasal sayfalar
- [x] `not-found.tsx` — 404 terminal esprisi

### Modül Sistemi & Sepet
- [x] `lib/modules-data.ts` — 5 modül + fiyatlar (KDV dahil)
- [x] `lib/cart-math.ts` — KDV ayrıştırma, D paketi mantığı
- [x] `lib/quote-cart.ts` — localStorage persist + `useSyncExternalStore`
- [x] `QuoteCartProvider`, `QuoteCartBadge`
- [x] D paketi çapraz satış önerisi (A+B+C+E → D)
- [x] `lib/module-records.ts` — slug/kod eşleme

### Denetim Kriterleri
- [x] `lib/criteria/types.ts` — tip tanımları
- [x] `lib/criteria/module-a.ts` — Ön Büro kriterleri
- [x] `lib/criteria/module-b.ts` — F&B kriterleri
- [x] `lib/criteria/module-c.ts` — Wellness kriterleri
- [x] `lib/criteria/module-d.ts` — 360° kriterleri
- [x] `lib/criteria/module-e.ts` — Kat Hizmetleri kriterleri
- [x] `lib/criteria/translate.ts` — i18n metin çözümleyici
- [x] `components/criteria/CriterionCard` + `EvidenceBadge` + `CriteriaSection` + `PerspectiveBlock`

### API & Form
- [x] `POST /api/teklif` — Resend entegrasyonu + fallback (key yoksa log)
- [x] `POST /api/odeme` — iyzico entegrasyonu (kod tamam, key bekliyor)
- [x] `POST /api/odeme/callback` — 3D webhook
- [x] `lib/billing-schema.ts` — fatura doğrulama (TC kimlik algoritması dahil)
- [x] `lib/quote-schema.ts` — teklif formu doğrulama
- [x] `lib/payment.ts` — iyzico adaptör

### i18n
- [x] `next-intl` kurulumu — TR/EN
- [x] `messages/tr.json` + `messages/en.json` — tüm sayfa kopyaları
- [x] Çevrilmiş slug'lar (`/tr/moduller` ↔ `/en/modules`)
- [x] `hreflang` etiketleri + `x-default`
- [x] `lib/criteria/translate.ts` — kriter çevirisi (EN eksikse TR'ye düşer)

### Teknik
- [x] `lib/company-data.ts` — placeholder guard sistemi
- [x] `sitemap.ts`, `robots.ts`
- [x] `opengraph-image.tsx` — dinamik OG üretimi
- [x] `app/icon.png` — favicon (yeni logo)
- [x] Görseller: logo, modül görselleri, biz-kimiz hero, evidence-pattern (transparan)

---

## ✅ ÇÖZÜLEN EKSİK KISIMLAR (KOD TARAFINDA TAMAMLANDI)

### 1. Ana Sayfa — `TestimonialsSection` EKLENDİ
**Blueprint §8.1** referans bölümünü tanımlıyor:
> 2 anonim referans — "Denetim raporundaki gelir kaçağı kalemi..." + "Eğitim sonrası upselling..."

Kod incelemesinde eksik olduğu görülen `TestimonialsSection` bileşeni eklendi ve ana sayfaya dahil edildi.
→ **Sonuç:** Müşteri referansları artık sorunsuz gösteriliyor.

---

### 2. Ana Sayfa'da `EvidenceShowcase` konumu tartışmalı
Blueprint sıralamada `TestimonialsSection` sonrasında `FinalCTA` var.  
`EvidenceShowcase` ve `TestimonialsSection` bileşenleri planlanan yerlerine oturtuldu.
→ **Sonuç:** Tasarım bütünlüğü sağlandı.

---

### 3. `lib/criteria/translate.ts` — EN kriter çevirileri YOK
`lib/criteria/translate.ts` mevcut, mekanizma çalışır durumda.  
166 adet EN (İngilizce) kriter çevirisi `messages/en.json` içine eklendi ve `getCriteria()` üzerinden sayfalara entegre edildi.
→ **Sonuç:** İngilizce modül detay sayfalarında çevrilmiş İngilizce kriterler görüntüleniyor.

---

### 4. `hakkimizda` → `/biz-kimiz` 301 redirect YOK
`next.config.mjs` içerisinde `redirects()` fonksiyonu ile ayarlandı.
→ **Sonuç:** Eski bir `/hakkimizda` linki tıklandığında sorunsuzca `/biz-kimiz` sayfasına 301 yönlendirmesi çalışır.

---

### 5. D Paketi — "D seçiliyken A/B/C/E butonları devre dışı" doğrulanmadı
v2 spec §1.3: *"D seçiliyken A/B/C/E eklenirse: kart üstünde 'D paketine dahil' rozeti çıkar ve Sepete Ekle butonu devre dışı kalır"*  
Kod içerisinde `CartButton.tsx` (ve `isRedundant` fonksiyonu) ile devre dışı kalma (disabled) ve rozet logic'i başarıyla uygulandı.

---

### 6. `user-select: none` kriter metinlerinde YOK
v2 spec §4.6 istiyor ve kod içinde `components/criteria/CriterionCard.tsx`'te `<p className="... select-none">` olarak eklendiği doğrulandı.

---

### 7. Mobil sticky sepet çubuğu (`sepet alt bar`) belirsiz
v2 spec §7: *"Mobilde sticky alt çubuk: `2 modül · 30.000 TL · [Devam]`"*  
`components/modules/MobileCartBar.tsx` oluşturularak entegre edildi. Touch target (Apple HIG) kuralına uygun tasarlandı.

---

### 8. QA Raporu — Ajan 9 tamamlanmadı
`npm run build`, `npm run lint`, `tsc --noEmit` ve `scripts/check-links.mjs` komutlarının tamamı çalıştırıldı. Hata tespit edilmedi, build ve link testleri (37 internal link) başarıyla tamamlandı.

---

## ⚠️ SENİN YAPMAN GEREKEN (kodla çözülmez)

| # | Madde | Aciliyet |
|---|---|---|
| 1 | `lib/company-data.ts` gerçek şirket bilgileri (sicil, MERSİS, vergi) | 🔴 Yayın öncesi zorunlu |
| 2 | `RESEND_API_KEY` → Vercel env + redeploy | 🔴 Teklif formu mail atmıyor |
| 3 | iyzico üye işyeri başvurusu + API key | 🟡 Ödeme yolunu açmak için |
| 4 | ETBİS kaydı + bant footer'a eklenmeli | 🟡 Kart tahsilatı için zorunlu |
| 5 | KVKK/Gizlilik/Mesafeli/Ön Bilgilendirme hukukçu teyidi | 🟡 Yayın öncesi |
| 6 | `isPlaceholder: false` + gerçek şirket bilgileri → Google indeksleme açılır | 🟢 Launch |

---

## 📊 ÖZET TABLO

| Alan | Durum |
|---|---|
| Temel altyapı | ✅ Tam |
| Ana sayfa | ✅ TestimonialsSection eklendi |
| Hizmet sayfaları | ✅ Tam |
| Modüller + Sepet | ✅ Tam |
| Denetim kriterleri (TR) | ✅ Tam |
| Denetim kriterleri (EN çevirisi) | ✅ Tamamlandı (en.json) |
| i18n altyapısı | ✅ Tam |
| Ödeme sistemi (kod) | ✅ Yazıldı |
| Ödeme sistemi (çalışır) | ❌ iyzico hesabı bekleniyor (Sizde) |
| Yasal sayfalar | ✅ Şablon tamam |
| Teklif formu | ✅ Tam (mail key eksik - Sizde) |
| SEO / sitemap | ✅ Tam |
| Favicon / Logo | ✅ Güncellendi |
| QA / link checker | ✅ Çalıştırıldı (Passed) |
| 301 redirect (hakkimizda) | ✅ Eklendi |
| TestimonialsSection | ✅ Eklendi |
