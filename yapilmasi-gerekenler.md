# Kutluhan — Senin Yapacakların (Adım Adım)

> Bu liste **sadece senin elinden geçecek** işler. Kod tarafındaki her şey bende; sen bana
> bilgi/anahtar getireceksin, kodu ben yazacağım.
>
> **Nasıl okunur:** Her madde "şu siteye gir → şuna bas → şunu al → bana ver" mantığında.
> Kod dosyasına **sen dokunmuyorsun** — istediğim bilgiyi bana yapıştırman yeterli.
>
> Bir madde bitince başındaki `[ ]` işaretini `[x]` yap.
>
> **Sıra önemli:** BÖLÜM 1 bitmeden site tam yayına alınamaz.

---

## BÖLÜM 0 — Bana Vereceğin Bilgiler (5 dakika, kod değişikliği bende)

Bunları bir yere yazıp bana topluca yapıştır. Hepsini koda ben işlerim.

### 0.1 Gerçek şirket bilgileri (resmi belgelerden birebir)

Aşağıdakileri **vergi levhası** ve **ticaret sicil gazetesinden** bakarak yaz. Uydurmam,
sen verene kadar bu bloklar sitede hiç görünmüyor.

- [ ] **Ticaret unvanı** (tam yasal ad, "Ltd. Şti." / "A.Ş." dahil)
- [ ] **Ticaret sicil numarası**
- [ ] **MERSİS numarası** (16 hane)
- [ ] **Vergi dairesi adı**
- [ ] **Vergi numarası** (10 hane)
- [ ] **Şirket merkezi açık adres** (fatura + sözleşmede zorunlu)
- [ ] **KEP adresi** (varsa; yoksa "yok" de)
- [ ] **Gerçek telefon numarası** (şu an sitede `+90 (212) 000 00 00` yazıyor — sahte)
- [ ] **Gerçek kurumsal e-posta** (şu an `corporate@hospitalityauditgroup.com` — doğru mu? kutu açık mı?)

### 0.2 "Biz Kimiz" gerçekleri

Şu an geçici bir kuruluş öyküsü var. Gerçeğiyle değişecek:

- [ ] **Kuruluş yılı**
- [ ] **Merkez şehir**
- [ ] **Ortalama sektör kıdemi** (kaç yıl?)

> **NOT — denetçi kadrosu:** Bana "denetçi kadro yok" dedin. Sitede şu an
> *"Sektörde üst düzey yöneticilik yapmış denetçilerimiz"* gibi cümleler var — bu haliyle
> yanlış beyan olur. **Karar ver, aşağıya yaz (BÖLÜM 4), ona göre metni ben düzeltirim.**

---

## BÖLÜM 1 — YAYIN ÖNCESİ ZORUNLU

### 1.1 Resend — Teklif/İletişim formları mail atsın 🔴

Şu an formlar "gönderildi" diyor ama sana mail **ulaşmıyor**. Bunu açıyoruz.

1. [ ] [resend.com](https://resend.com) → sağ üst **"Sign Up"** → ücretsiz hesap aç.
2. [ ] Sol menü **"Domains"** → **"Add Domain"** → alan adını yaz: `hospitalityauditgroup.com`.
3. [ ] Resend sana **DNS kayıtları** (SPF + DKIM, birkaç satır) verir. Bunları alan adını
       aldığın yere (GoDaddy / Cloudflare / Natro vb.) DNS ayarlarına ekle. Ekleyemiyorsan
       kayıtları bana at, nereye gireceğini tarif ederim.
4. [ ] DNS doğrulanınca (birkaç dk – birkaç saat) Resend'de domain **"Verified"** olur.
5. [ ] Sol menü **"API Keys"** → **"Create API Key"** → adı `hag-production` → **"Add"**.
6. [ ] Çıkan `re_...` ile başlayan anahtarı **hemen kopyala** (bir daha gösterilmez).
7. [ ] Bu anahtarı Vercel'e ekle → aşağıda **BÖLÜM 3.1** anlatıyor.

> Domain doğrulaması yapılmazsa mailler spam'e düşer. 3. adımı atlama.

### 1.2 iyzico — Kredi kartı tahsilatı 🟡

Kod hazır ama **kapalı doğdu**. Açmak için hem iyzico anahtarı hem de BÖLÜM 0.1'deki şirket
bilgileri **birlikte** gerekiyor (kimliğini yayınlamayan satıcı kart çekemez — kanun böyle).

1. [ ] [iyzico.com](https://www.iyzico.com) → **"Üye İşyeri Ol"** / kurumsal başvuru.
2. [ ] İstenen evrak: vergi levhası, imza sirküleri, ticaret sicil gazetesi, kimlik.
3. [ ] Başvuru onaylanınca iyzico panelinde **Ayarlar → API Anahtarları**:
       - **API Key** (Anahtar)
       - **Secret Key** (Güvenlik Anahtarı)
4. [ ] Önce **sandbox (test) anahtarlarını** al — canlıya geçmeden test edeceğiz.
5. [ ] Bu iki anahtarı bana ver. **Kart bilgisi girmem gereken bir test adımı olursa onu sen
       yaparsın** — ben kart verisi girmiyorum.

> ⚠ **Önemli — anahtar tek başına yetmez:** Anahtarı Vercel'e eklemek yetmez; sonra
> **Redeploy** (yeniden build) şart. Aksi halde 3D dönüş sayfası 404 kalır. Sırayı ben
> yöneteceğim, sen sadece anahtarı ver.
>
> ⚠ **Test edilmedi:** Entegrasyon gerçek iyzico endpoint'ine hiç dokunmadı. Anahtarı
> verdiğinde sandbox'ta uçtan uca birlikte test edip düzelteceğiz.

### 1.3 ETBİS kaydı 🟡

Kart tahsilatı yapan her sitenin Ticaret Bakanlığı'na kayıtlı olması **zorunlu** (cezası var).

1. [ ] [etbis.ticaret.gov.tr](https://etbis.ticaret.gov.tr) → e-Devlet şifrenle giriş.
2. [ ] **"e-Ticaret Sitesi / Bildirim"** → siteni kaydet: `hospitalityauditgroup.com`.
3. [ ] Kayıt bitince sana bir **ETBİS karekod (QR) linki/görseli** verilir.
4. [ ] O karekodu bana ilet — footer'a (site altı) ben eklerim.

### 1.4 Hukukçu kontrolü 🟡

5 yasal sayfa **şablon** olarak yazıldı. Yayından önce hukukçuna okutman şart.

1. [ ] Şu sayfaları hukukçuna göster: `/kvkk`, `/gizlilik-politikasi`,
       `/mesafeli-satis-sozlesmesi`, `/on-bilgilendirme`, `/iptal-iade`.
2. [ ] **Özellikle sor — cayma hakkı:** Mesafeli Sözleşmeler Yönetmeliği m.15'e göre ifası
       başlamış hizmette cayma hakkı düşer. "Denetim ziyareti başladıktan sonra iade yok"
       maddesinin senin iş modeline uygun lafzını hukukçun belirlesin. Yanlış olursa iade davası.
3. [ ] **VERBİS kaydı gerekiyor mu?** Hukukçuna sor (çalışan sayısı + ciroya bağlı).
4. [ ] Değişmesi gereken maddeleri bana ilet, metni ben güncellerim.

### 1.5 Alan adı ve mail kutusu 🔴

1. [ ] `hospitalityauditgroup.com` alan adı **sende mi**? (Değilse önce al.)
2. [ ] Kurumsal mail kutusu (`corporate@hospitalityauditgroup.com` veya vereceğin adres)
       **açık ve çalışıyor mu**? Teklif formları buraya düşecek — çalışmıyorsa müşteri kaybı.

---

## BÖLÜM 2 — DEPLOY / Vercel (anahtarları koyma yeri)

Site şu an canlı: **https://hospitalityauditgroup.vercel.app**
Vercel projesi: `hospitalityauditgroup`

### 2.1 Vercel'e ortam değişkeni (env) ekleme

Her anahtar (Resend, iyzico) buraya girilir:

1. [ ] [vercel.com](https://vercel.com) → giriş → **hospitalityauditgroup** projesi.
2. [ ] Üstten **Settings** → sol menü **Environment Variables**.
3. [ ] Tek tek ekle (Name / Value), her biri için **"Save"**:
   ```
   RESEND_API_KEY        = re_...        (BÖLÜM 1.1'den)
   CONTACT_EMAIL         = corporate@hospitalityauditgroup.com
   IYZICO_API_KEY        = ...           (BÖLÜM 1.2'den, hazır olunca)
   IYZICO_SECRET_KEY     = ...
   IYZICO_BASE_URL       = https://sandbox-api.iyzipay.com   (test) / https://api.iyzipay.com (canlı)
   ```
4. [ ] Ekledikten sonra **Deployments** sekmesi → en üstteki deploy → sağdaki **"..."** →
       **"Redeploy"**. Bu şart, yoksa anahtarlar aktif olmaz.

### 2.2 Otomatik deploy (önerilir, bir kere)

Bunu bir kez bağlarsan her değişiklik otomatik yayına çıkar:

1. [ ] Vercel → hospitalityauditgroup → **Settings → Git** → **"Connect Git Repository"**.
2. [ ] `kutluhangil/Hospitality-Audit-Group` deposunu seç.

### 2.3 Google'a açılma (launch anı)

1. [ ] BÖLÜM 0.1 bilgilerini bana verdikten sonra, kodda `isPlaceholder: false` yapıp
       kurumsal blokları + Google indekslemeyi **ben açacağım**. Sen "artık açabilirsin" de.
2. [ ] [search.google.com/search-console](https://search.google.com/search-console) → siteyi
       ekle, doğrula, sitemap gönder: `hospitalityauditgroup.com/sitemap.xml`.

---

## BÖLÜM 3 — İÇERİK / TEYİT (yayını engellemez ama gerekir)

### 3.1 Fiyat teyidi

1. [ ] Modül fiyatı şu an **15.000 TL** ("şimdilik" demiştin), 360° paket **50.000 TL**.
       Kesin fiyat listesini bana ver, tek yerden değiştiririm.
2. [ ] Fiyatlar **KDV dahil** görünüyor. Fatura bu şekilde mi kesilecek? Muhasebecine teyit ettir.

### 3.2 Rusça — İPTAL ✅

Rusça kapsam dışı. Site **TR + EN**. Bu maddeyi dert etme, kapandı.

---

## BÖLÜM 4 — BANA CEVAP / KARAR VER (yazılı bekliyorum)

Aşağıya cevabını yazıp bana ilet; ona göre metni/kodu düzenlerim.

### 4.1 Denetçi kadrosu yok — ✅ ÇÖZÜLDÜ (metin düzeltildi)

"Şu an hiç kimse denetim yapmıyor" dedin. Buna göre sitedeki **tüm yanlış beyanlar kaldırıldı**:

- Biz-kimiz'deki **"Denetçi Kadrosu" bölümü tümden silindi** (12 denetçi, 14 yıl kıdem,
  "geldikleri pozisyonlar" listesi — hepsi uydurmaydı, gitti).
- Hero + biz-kimiz + SSS'teki *"deneyimli denetçilerimiz / ekibimiz"* dili **yöntem diline**
  çevrildi: artık "denetim şu kriterlerle, misafir sıfatıyla yapılır" anlatılıyor — var olmayan
  bir ekip iddia edilmiyor. (TR + EN.)
- "Denetçileriniz kim?" SSS cevabı, kadro yerine **denetçi standardını** tarif ediyor.

**Sende kalan:** İleride gerçekten denetçi kadron / bağımsız denetçilerin olduğunda söyle —
o zaman kadro bölümünü dürüst ve doğrulanabilir haliyle geri koyarım. Şimdilik yok.

> Not: Biz-kimiz kuruluş öyküsündeki **şehir + yıl** hâlâ placeholder (`lib/company-data.ts`
> → `merkez`, `kurulusYili`). Gerçeğini BÖLÜM 0.2'de bana ver.

---

## HATIRLATMA — Benim yapmayacaklarım

Bunları isteme, yapmam (sebebini konuştuk):

- Sahte müşteri referansı
- Gerçek otel logoları ("denetlediğimiz oteller" diye)
- Uydurma sicil / vergi / MERSİS numarası
- Uydurma denetim geçmişi / örnek rapor
- Senin adına iyzico hesabı açmak / kart bilgisi girmek

---

## ÖZET — Sıra

1. BÖLÜM 0 bilgilerini bana ver → şirket + Biz Kimiz blokları açılır
2. BÖLÜM 1.1 Resend → formlar mail atmaya başlar
3. BÖLÜM 4 kararları → metinleri düzeltirim
4. "Açabilirsin" de → `isPlaceholder: false`, Google'a açılır
5. iyzico + ETBİS + hukukçu → ödeme yolu açılır (daha uzun sürer, paralel yürüsün)
