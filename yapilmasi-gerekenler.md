# HAG Website — Canlıya Alım (Launch) Öncesi Yapılması Gerekenler

Projenin tüm kodlama, tasarım ve teknik altyapı işlemleri eksiksiz olarak tamamlanmıştır. Ancak projenin tam teşekküllü bir şekilde yayına (canlıya) alınabilmesi için **kodla çözülemeyecek**, sizin tarafınızdan yapılması gereken operasyonel ve ticari adımlar bulunmaktadır. 

Lütfen aşağıdaki adımları sırasıyla tamamlayın:

---

## 1. Formların Çalışması İçin: Resend API Key (Aciliyet: 🔴 Yüksek)
Şu anda sitedeki "Teklif Al" ve "İletişim" formlarının size e-posta gönderebilmesi için bir e-posta servis sağlayıcısına ihtiyacımız var. Altyapı Resend üzerine kuruludur.

**Ne yapmalısınız?**
1. [resend.com](https://resend.com) adresine gidin ve ücretsiz bir hesap açın.
2. Sisteme domain adresinizi (örn: `hospitalityauditgroup.com`) ekleyin ve DNS kayıtlarını doğrulayın.
3. Resend panosundan bir **API Key** oluşturun.
4. Vercel panonuza gidin (veya hangi sunucuyu kullanıyorsanız), projenizin **Environment Variables (Ortam Değişkenleri)** kısmına `RESEND_API_KEY` adıyla bu şifreyi ekleyin.
5. Ekledikten sonra projenizi Vercel üzerinden yeniden build (Redeploy) edin. Artık formlar çalışacaktır.

---

## 2. Gerçek Şirket Bilgileri ve Google İndeksleme (Aciliyet: 🔴 Yüksek)
Şu an sitede test amaçlı yer tutucu (placeholder) şirket bilgileri bulunmaktadır. Ayrıca site geliştirme aşamasında olduğu için Google gibi arama motorlarına kapalıdır (noindex).

**Ne yapmalısınız?**
1. Projedeki `lib/company-data.ts` dosyasını açın.
2. Dosyanın içindeki `isPlaceholder: true` satırını `isPlaceholder: false` olarak değiştirin.
3. Aynı dosya içindeki unvan, adres, vergi numarası, MERSİS numarası ve telefon/mail gibi bilgileri **kendi resmi şirket bilgilerinizle** güncelleyin.
4. Bu değişiklik yapıldığında sitemiz otomatik olarak arama motorlarının taramasına (indekslenmesine) açılacaktır.

---

## 3. Ödeme Alma: İyzico Entegrasyonu (Aciliyet: 🟡 Orta - Ticari)
Kredi kartı ile doğrudan siteden ödeme alabilmeniz için İyzico kod altyapısı kurulmuştur. Ancak test anahtarları yerine gerçek (canlı) anahtarlara ihtiyacımız var.

**Ne yapmalısınız?**
1. [iyzico.com](https://www.iyzico.com) üzerinden kurumsal / üye işyeri başvurunuzu tamamlayın.
2. Başvurunuz onaylandığında İyzico panelinden **Canlı API Anahtarı** ve **Canlı Güvenlik Anahtarı** (Secret Key) değerlerinizi alın.
3. `.env.example` dosyasında belirtildiği gibi bu anahtarları Vercel Environment Variables kısmına ekleyin.
4. Redeploy ettiğinizde ödeme sayfası gerçek kredi kartlarından çekim yapmaya başlayacaktır.

---

## 4. Hukuki ve Yasal Zorunluluklar (Aciliyet: 🟡 Orta - Hukuki)
Web sitenizde KVKK, Gizlilik Politikası, Mesafeli Satış Sözleşmesi, İptal/İade koşulları ve Ön Bilgilendirme Formu için sayfalar tasarlanmış ve şablon metinler yerleştirilmiştir.

**Ne yapmalısınız?**
1. Bu sayfalardaki şablon metinleri şirket avukatınıza veya hukuk danışmanınıza okutun.
2. Firmanıza özel güncellenmesi gereken maddeler varsa bu metinleri güncelleyin.

---

## 5. ETBİS (Elektronik Ticaret Bilgi Sistemi) Kaydı (Aciliyet: 🟡 Orta)
Türkiye'de online ödeme alan ve e-ticaret (hizmet satışı dahil) yapan firmaların Ticaret Bakanlığı'na bağlı ETBİS'e kayıt olması yasal bir zorunluluktur. İyzico da ödeme altyapısını açarken genelde bu kaydı sorar.

**Ne yapmalısınız?**
1. [etbis.gov.tr](https://www.etbis.gov.tr/) üzerinden e-Devlet şifrenizle giriş yaparak sitenizi kayıt edin.
2. Kayıt sonucunda size verilecek olan **ETBİS Karekod (QR)** linkini veya görselini sitenin Footer (alt) kısmına ekletmelisiniz. (Bunu kayıt sonrası bana iletebilirsiniz, koda ben eklerim).

---

> **Not:** Sistemdeki 166 adet İngilizce metin çevirisini (`EN dil kriter çevirisi`) siz bu notu okumadan hemen önce **ben tamamladım**. Artık İngilizce sayfalarınızda tüm denetim kriterleri İngilizce olarak görünmektedir, o kısmı dert etmenize gerek kalmadı! 🎉
