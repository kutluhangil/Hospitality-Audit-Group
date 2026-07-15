# Kutluhan — Senin Yapman Gerekenler

> Kodla çözülemeyen, senin elinden geçmesi zorunlu işler.
> Sıra önemli: **1. Bölüm bitmeden site yayına alınamaz.**
> Her madde bitince `[ ]` → `[x]` yap.

---

## BÖLÜM 1 — YAYIN ÖNCESİ ZORUNLU (bunlarsız site açılmaz)

### 1.1 Şirket kimlik bilgileri

Bunları uydurmadım ve uydurmayacağım — devlet sicil numaraları. Sen verene kadar ilgili bölümler siteye **hiç çıkmıyor** (kod bunu otomatik yapıyor, `null` olan blok render edilmiyor).

Dosya: `lib/company-data.ts`

- [ ] **Ticaret unvanı** (tam yasal unvan, "Ltd. Şti." dahil)
- [ ] **Ticaret sicil numarası**
- [ ] **MERSİS numarası** (16 hane)
- [ ] **Vergi dairesi** ve **vergi numarası** (10 hane)
- [ ] **Şirket merkezi açık adres** (fatura ve sözleşmede zorunlu)
- [ ] **KEP adresi** (varsa)
- [ ] **Gerçek telefon numarası** — şu an `+90 (212) 000 00 00` placeholder
- [ ] **Gerçek e-posta** — `corporate@hospitalityauditgroup.com` doğru mu, kutu çalışıyor mu?

> **Neden zorunlu:** Kart tahsilatı yapan bir site bu bilgileri göstermek zorunda (Mesafeli Sözleşmeler Yönetmeliği + ETBİS). Eksikse ödeme yolunu açamayız.

### 1.2 "Biz Kimiz" gerçek bilgileri

Geçici bir kuruluş öyküsü yazdım (`isPlaceholder: true` bayraklı). Bunlar **senin gerçeğinle değişmeli**:

- [ ] **Kuruluş yılı** (gerçek)
- [ ] **Merkez şehir**
- [ ] **Denetçi sayısı** — kaç kişilik kadro var?
- [ ] **Ortalama sektör kıdemi** — kaç yıl?
- [ ] **Denetçilerin gerçek geçmiş pozisyonları** — "5★ resort GM", "F&B Direktörü" gibi. İsim değil, pozisyon.

> **Kritik soru:** Denetçi kadron **şu an var mı**? Sitede "Sektörde üst düzey yöneticilik yapmış denetçilerimiz" yazıyor. Kadro henüz yoksa bu cümle de yanlış — bana söyle, düzeltirim.

### 1.3 iyzico üye işyeri hesabı

Ödeme kodunu yazacağım ama **anahtarsız kapalı doğacak**. Sen açacaksın:

- [ ] https://www.iyzico.com → Üye işyeri başvurusu
- [ ] Gereken evraklar: vergi levhası, imza sirküleri, ticaret sicil gazetesi, kimlik
- [ ] Onay sonrası **API Key** ve **Secret Key** al
- [ ] Bunları `.env.local` dosyasına yaz:
  ```
  IYZICO_API_KEY=...
  IYZICO_SECRET_KEY=...
  IYZICO_BASE_URL=https://api.iyzipay.com
  ```
- [ ] **Bu dosyayı ASLA git'e ekleme.** `.gitignore`'da zaten var, kontrol et.
- [ ] Vercel'e deploy ederken anahtarları Vercel dashboard → Settings → Environment Variables içine gir

> Sandbox ile test için: `IYZICO_BASE_URL=https://sandbox-api.iyzipay.com` ve sandbox anahtarları. Önce sandbox'ta test edelim.

### 1.4 ETBİS kaydı

- [ ] https://etbis.ticaret.gov.tr → e-ticaret sitesi kaydı
- [ ] Kayıt sonrası aldığın **ETBİS bandını** siteye koyacağız (footer)

> **Zorunlu.** Kart tahsilatı yapan her site kayıtlı olmak zorunda. Cezası var.

### 1.5 Hukukçu kontrolü

Şu metinleri **şablon** olarak yazacağım. Yayına almadan önce hukukçuna okutman şart — her birinin başında bu uyarı görünür duracak:

- [ ] `/kvkk` — KVKK Aydınlatma Metni
- [ ] `/gizlilik-politikasi` — Gizlilik Politikası
- [ ] `/mesafeli-satis-sozlesmesi` — Mesafeli Satış Sözleşmesi
- [ ] `/on-bilgilendirme` — Ön Bilgilendirme Formu
- [ ] `/iptal-iade` — İptal & İade Politikası

> **Özellikle sorulacak konu — cayma hakkı:** Mesafeli Sözleşmeler Yönetmeliği m.15'e göre ifası başlamış hizmetlerde cayma hakkı düşer. "Denetim ziyareti başladıktan sonra iade yok" maddesini yazacağım ama bunun senin iş modeline uygun lafzını hukukçun belirlemeli. Yanlış yazılırsa iade davası açılır.

- [ ] **VERBİS kaydı** gerekiyor mu, hukukçuna sor. (Çalışan sayısı ve ciroya bağlı; gerekiyorsa yapılmalı.)

### 1.6 Alan adı ve mail

- [ ] `hospitalityauditgroup.com` alan adı sende mi?
- [ ] Kurumsal mail kutusu çalışıyor mu? (Teklif formları buraya düşecek)
- [ ] **Resend** hesabı: https://resend.com → API key al → `.env.local`:
  ```
  RESEND_API_KEY=...
  CONTACT_EMAIL=corporate@hospitalityauditgroup.com
  ```
- [ ] Resend'de alan adı doğrulaması (DNS'e SPF/DKIM kaydı) — yoksa mailler spam'e düşer

---

## BÖLÜM 2 — İÇERİK (siteyi güçlendirir, yayını engellemez)

### 2.1 Görseller

- [ ] `docs/gorsel-promptlari.md` dosyasını aç
- [ ] Promptları Gemini'ye ver
- [ ] Çıkanları `public/images/` altına, dosyadaki **tam isimlerle** koy
- [ ] Dosyanın sonundaki kabul kontrol listesini uygula (özellikle: zemin rengi `#FAF9F5` mi, görselde yazı var mı)

### 2.2 Rusça metin

- [ ] Rusça metni ana dili Rusça birine okutamayacağını söyledin — **not ediyorum, riski kabul ediyorsun.**

> Ben Rusça yazacağım ama doğrulayamıyorum. Antalya'da Rus sermayeli otele giden bir sitede bozuk Rusça, güvenilirliği bitirir. **Öneri:** yayından sonra bir tercümandan tek seferlik okuma hizmeti al (birkaç bin TL). Ya da Rusça'yı ilk sürümde hiç açma, sonra ekleyelim. Kararı sana bırakıyorum ama riski yazılı bırakıyorum.

### 2.3 Fiyat teyidi

- [ ] 15.000 TL "şimdilik" dedin. Gerçek fiyat listesi netleşince `lib/modules-data.ts`'te tek yerden değişecek.
- [ ] KDV **dahil** dedin — fatura kesiminde bu şekilde mi olacak, muhasebecine teyit ettir.

---

## BÖLÜM 3 — BENİM SANA SORDUKLARIM (cevap bekliyorum)

- [ ] **Modül harflendirme çelişkisi** — PDF'lerde `Modül E = Kat Hizmetleri`, sitede `Modül E = Personel Eğitimi`. Karar gerekiyor (konuşmada soruyorum).
- [ ] **Denetçi kadron var mı?** (1.2'deki kritik soru)
- [ ] Referans bölümünün yerine ne koyalım?

---

## BÖLÜM 4 — DEPLOY (build bitince)

- [ ] Vercel hesabı + repo bağlantısı
- [ ] Environment variables (yukarıdaki tüm anahtarlar)
- [ ] Alan adı DNS yönlendirmesi
- [ ] `lib/site-config.ts` → `url` alanını gerçek alan adına çevir (şu an `https://hospitalityauditgroup.com`)
- [ ] Google Search Console → site doğrulama + sitemap gönder
- [ ] **`isPlaceholder: false` yap** — `lib/company-data.ts`. Bunu yapmadan yayına alma; geçici hikâye canlıya çıkar.

---

## HATIRLATMA — BENİM YAPMAYACAKLARIM

Bunları isteme, yapmam; sebebini konuşmada açıkladım:

- **Sahte müşteri referansı** — kaldırdım, geri koymam
- **Gerçek otel logoları** ("denetlediğimiz oteller" diye) — müşterin değilken marka kullanımı + yanıltıcı beyan
- **Uydurma sicil/vergi/MERSİS numarası** — resmi belgede sahtecilik
- **Uydurma denetim geçmişi / tesis profili / örnek rapor** — "gerçek denetim yapmadık" dedin, o bölümler yok
- **Senin adına iyzico hesabı açmak / kart bilgisi girmek** — finansal hesap işlemleri sana ait

---

## BÖLÜM 5 — CANLI SİTE

Site yayında: **https://hospitalityauditgroup.vercel.app**

Vercel projesi: `hospitalityauditgroup` (takım: kutluhans-projects-93876a9e)

### Şu an canlıda olan ama düzeltilmesi gereken

- [ ] **Telefon placeholder** — `+90 (212) 000 00 00` footer ve iletişim sayfasında görünüyor
- [ ] **Teklif formu mail göndermiyor** — `RESEND_API_KEY` Vercel'de tanımlı değil. Form "başarılı" diyor ama sana ulaşmıyor. Gerçek bir otel teklif isterse kaybedersin.
- [ ] **Google indekslemiyor** — bu bilinçli. `lib/company-data.ts` içinde `isPlaceholder: true` olduğu sürece `robots.txt` `Disallow: /` veriyor. Launch'ta `isPlaceholder: false` yapınca indeksleme + kurumsal bloklar birlikte açılır.

### Vercel'e env değişkeni ekleme

Vercel dashboard → hospitalityauditgroup → Settings → Environment Variables:

```
RESEND_API_KEY=re_...
CONTACT_EMAIL=corporate@hospitalityauditgroup.com
```

Ekledikten sonra yeniden deploy gerekir (Deployments → ... → Redeploy).

### Otomatik deploy (önerilir)

Şu an deploy elle yapılıyor. GitHub'a bağlarsan her `git push` otomatik deploy alır:

Vercel dashboard → hospitalityauditgroup → Settings → Git → Connect Git Repository
→ `kutluhangil/Hospitality-Audit-Group` seç.
