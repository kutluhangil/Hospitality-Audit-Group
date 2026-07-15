# HAG — Görsel Üretim Promptları (Gemini)

> Bu promptları Gemini'ye ver, çıkan dosyaları `public/images/` altına belirtilen isimle koy.
> Ben kodda o isimleri bekliyor olacağım.

---

## ⚠ DURUM — 2026-07-16

Görseller üretildi ve siteye işlendi. **Bir tanesi eksik.**

### EKSİK: `module-e-kat-hizmetleri.png`

Bu doküman modül harflendirmesi **değişmeden önce** yazılmıştı. O zaman `E = Personel Eğitimi` idi;
saha kılavuzları `E = Kat Hizmetleri` diyor ve kazanan o oldu. Sonuç:

- `module-e-egitim.png` (kitap + ok) → **Personel Eğitimi** hizmetine bağlandı, doğru yerde duruyor
- **Kat Hizmetleri (Modül E) görselsiz** — `/moduller/kat-hizmetleri` detay sayfasında illüstrasyon yok

Kod bunu sorunsuz kaldırıyor (`lib/illustrations.ts`, görsel yoksa layout tek kolona düşüyor), ama
diğer dört modülde çizim varken E'de olmaması göze çarpar. Aşağıdaki 3.6 promptunu üret, dosyayı
`public/images/modules/module-e-kat-hizmetleri.png` olarak koy, bana söyle — bağlarım.

### Kullanılmayan görseller ve sebepleri

| Dosya | Neden kullanılmadı |
|---|---|
| `og/og-default-*.png` | 1024×1024 kare üretilmiş; OG standardı 1200×630. Sosyal platformlar kareyi kırpar. Mevcut `app/opengraph-image.tsx` kodla üretiyor, doğru boyutta ve sayfa başlığını da içeriyor. |
| `logo.png` | Renkler PNG'ye gömülü (koyu çizgi + krem zemin) → koyu temada kırılır. Mevcut SVG logo `currentColor` kullanıyor, iki temada da çalışıyor. Ayrıca bu mark, OG filigranındaki ve blueprint'teki yıldız+çember kimliğiyle çelişiyor. Vektörü rastere çevirmek gerileme olurdu. |
| `404-terminal.png` | Mevcut 404 sayfası saf CSS terminal — gerçek metin içeriyor, tema-duyarlı, seçilebilir. Arkasına dekoratif görsel koymak gürültü olurdu. |
| `paper-texture.png` | 604 KB. Bir arka plan dokusu için ağır; kazancı marjinal. İstersen WebP'ye çevirip %4 opaklıkla ekleyebilirim. |

> **Not:** tüm görseller 1024×1024 kare geldi, istenen boyutlar değil (modüller 800×450, hero
> 1600×900, pattern 1200×400). Kompozisyonlar doğru olduğu için kare hâlleriyle kullanıldı — kod
> `next/image` ile ölçekliyor. OG'de bu tolere edilemedi, orası sabit oran ister.

---

## 0. ÖNCE OKU — Marka Kuralları (her promptta geçerli)

Site estetiği: **"Kağıt + Terminal"**. Açık tema bir denetim raporu kağıdı, koyu tema bir operasyon terminali.

**Palet — bu renklerin dışına çıkma:**

| Rol | Hex |
|---|---|
| Krem kağıt (açık zemin) | `#FAF9F5` |
| Yulaf (ikincil zemin) | `#F0EEE6` |
| Mürekkep (koyu metin) | `#141413` |
| Antrasit (koyu zemin) | `#1F1E1D` |
| Terracotta (vurgu) | `#D97757` |
| Derin terracotta | `#B04E2C` |
| Pirinç (çok az) | `#A98A44` |
| Nane yeşili (onay) | `#4C8A67` |

**Her prompta eklenecek negatif prompt (kopyala-yapıştır):**

```
NEGATIVE PROMPT: no stock photography, no real people, no faces, no hands,
no hotel interior photos, no lobby photos, no beds, no food photos, no beaches,
no corporate blue, no teal, no purple, no neon, no gradients with more than two
colors, no glossy 3D renders, no lens flare, no bokeh, no drop shadows, no
text, no letters, no words, no numbers, no logos, no watermarks, no UI mockups,
no icons with thick strokes, no clipart, no generic AI business imagery,
no shiny metallic surfaces, no glass morphism
```

**Neden fotoğraf yok:** blueprint kuralı — "Stok fotoğraf KULLANILMAYACAK." Rakip her denetim sitesi stok otel fotoğrafı kullanıyor; bizim farkımız bu. Görseller **soyut, tipografik ve dokusal** olacak.

**Format kuralı:**
- Doku/arka planlar → **PNG**, şeffaflık gerekiyorsa PNG-24
- Fotoğrafik olmayan düz kompozisyonlar → **PNG**
- Hiçbiri JPEG değil (krem zeminde JPEG artefaktı görünür)
- Üretim sonrası ben `next/image` ile WebP'ye çeviriyorum, sen ham PNG ver

---

## 1. `og-default-tr.png` · `og-default-en.png` · `og-default-ru.png`

**Boyut:** 1200 × 630 px (tam olarak — OG standardı)
**Konum:** `public/images/og/`
**Kullanım:** Sosyal paylaşım kartı, her dil için ayrı

> Not: v1'de `app/opengraph-image.tsx` bunu kodla üretiyor. Bu görselleri verirsen kod yerine bunları kullanırım — daha kontrollü olur. İstemezsen bu maddeyi atla.

```
A minimalist Open Graph card, 1200x630 pixels, landscape.
Background: warm cream paper color #FAF9F5 with a very subtle paper fiber
texture, barely visible, like fine uncoated stationery.
Composition: a single thin horizontal rule in terracotta #D97757, 2px, sitting
in the lower third, extending from the left margin to about 40% of the width.
Above the rule, generous empty space reserved for typography (I will overlay
text in code — leave this area clean and uncluttered).
In the far right, a very subtle geometric motif: a thin-line circle outline
containing a five-pointed star outline, drawn in a single 1px stroke, color
#E3DFD4, at about 12% opacity — almost a watermark, not a focal point.
Flat, editorial, print-like. No depth, no shadows, no gradient.
Mood: a premium audit report cover. Restrained, confident, quiet.

NEGATIVE PROMPT: [yukarıdaki ortak negatif promptu buraya yapıştır]
```

---

## 2. `paper-texture.png`

**Boyut:** 1024 × 1024 px, **seamless tile** (kenarları birleşmeli)
**Konum:** `public/images/`
**Kullanım:** Açık temada section arka planı, çok düşük opaklıkta (%3-5)

```
A seamless tileable paper texture, 1024x1024 pixels.
Uncoated cream paper #FAF9F5 with extremely subtle fiber grain and a faint
cold-press tooth. The variation must be very low contrast — this will be
overlaid at 4% opacity, so it should read as texture, not as pattern.
Absolutely uniform lighting, no vignette, no visible seams at the edges,
perfectly tileable in both axes.
Flat scan, as if a flatbed scanner captured a blank sheet of premium
letterhead stock.

NEGATIVE PROMPT: [ortak negatif prompt] + no vignette, no lighting gradient,
no visible tile seams, no crumples, no folds, no stains, no torn edges
```

---

## 3. Modül Kartı Görselleri (5 adet)

**Boyut:** 800 × 450 px (16:9)
**Konum:** `public/images/modules/`
**Kullanım:** `/moduller/[slug]` detay sayfası hero'su, ve katalog kartı üstü

Hepsi **aynı görsel dilde** olmalı — beş kart yan yana geldiğinde tek sistem gibi durmalı. Ortak iskelet:

> Ortak stil cümlesi (her beşine de ekle):
> `Flat vector-like abstract composition on cream #FAF9F5 ground. Thin 1.5px line work only, no fills except one small terracotta #D97757 accent shape. Isometric-adjacent but not fully isometric. Editorial diagram aesthetic — like a technical illustration in a quality print magazine. Extremely restrained: at most 8 distinct elements in the whole frame. Generous negative space, composition weighted to the left third.`

### 3.1 `module-a-onburo.png` — Konaklama & Ön Büro

```
[ortak stil cümlesi]
Subject: an abstract reception counter reduced to pure geometry — a long
horizontal bar in thin line work, a small rectangle suggesting a key card
resting on it, and three concentric thin arcs radiating from one point on the
counter suggesting a greeting or a signal.
One element only in terracotta #D97757: the key card rectangle.
A thin vertical line on the right edge with small tick marks, like a stopwatch
scale — a quiet nod to timed measurement.

NEGATIVE PROMPT: [ortak negatif prompt]
```

### 3.2 `module-b-fb.png` — Yiyecek & İçecek

```
[ortak stil cümlesi]
Subject: an abstract place setting seen from directly above, reduced to thin
outlines — one circle (plate), two thin vertical lines (cutlery), one small
ellipse (glass). Beside them, a thin-line balance scale motif suggesting
portion and recipe accuracy.
One element only in terracotta #D97757: the balance scale's beam.
A faint dotted line connects the plate to the scale, like a measurement path.

NEGATIVE PROMPT: [ortak negatif prompt] + no actual food, no ingredients
```

### 3.3 `module-c-wellness.png` — Wellness & Rekreasyon

```
[ortak stil cümlesi]
Subject: three concentric thin-line arcs suggesting water ripples, intersected
by a single straight horizontal line (water surface). Below the surface line, a
thin-line grid fading out, suggesting pool tiling and measurement.
To the right, a small thin-line droplet outline with a tiny cross inside it —
a chemical test motif, not a medical cross.
One element only in terracotta #D97757: the droplet outline.

NEGATIVE PROMPT: [ortak negatif prompt] + no swimming pools, no spa photos,
no candles, no stones, no towels, no medical cross, no red cross symbol
```

### 3.4 `module-d-360.png` — 360° Tam Denetim

```
[ortak stil cümlesi]
Subject: four small thin-line squares arranged in a loose ring, connected to
each other by thin lines forming a closed circuit — departments in sync. At the
centre of the ring, a single small filled circle.
One element only in terracotta #D97757: the centre circle.
A very faint large circle outline encompasses the whole arrangement, 1px,
#E3DFD4 — the 360 boundary.
This one should read as the most complex and complete of the five.

NEGATIVE PROMPT: [ortak negatif prompt] + no globes, no world maps, no networks
of dots, no blockchain imagery
```

### 3.6 `module-e-kat-hizmetleri.png` — Kat Hizmetleri & Oda İçi ⚠ EKSİK, BUNU ÜRET

**Boyut:** 800 × 450 (kare gelirse de olur, kod ölçekliyor)
**Konum:** `public/images/modules/module-e-kat-hizmetleri.png`

```
[ortak stil cümlesi]
Subject: an abstract bed seen from a low three-quarter angle, reduced to thin
outline only — a flat rectangle for the mattress, one folded triangle at its
corner suggesting an envelope fold, and two small squares stacked at the head
for pillows. Beside the bed, a single thin-line rectangle standing upright,
suggesting a balcony door or window frame, with a faint grid inside it.
One element only in terracotta #D97757: the folded triangle at the bed's corner.
A very small circle outline floats above the bed like a dust particle under
inspection — the blind-spot check.
Nothing else in the frame. No bedding texture, no patterns, no room.

NEGATIVE PROMPT: [ortak negatif prompt] + no hotel rooms, no bedding photos,
no pillows with texture, no curtains, no lamps, no furniture detail, no vacuum
cleaner, no cleaning products, no sparkles, no shine marks
```

### 3.5 `module-e-egitim.png` — Personel Eğitimi

> **DİKKAT:** dosya adı `module-e-` ile başlıyor ama artık **Modül E değil**. Harflendirme
> değişti; bu görsel harfsiz **Personel Eğitimi** hizmetine bağlı. Dosya adı geçmişten kalma,
> koda `lib/illustrations.ts` içinde `EGITIM` anahtarıyla bağlandı. Yeniden adlandırmadım —
> dosya zaten commit'lenmişti, adını değiştirmek git geçmişini gereksiz kirletirdi.

```
[ortak stil cümlesi]
Subject: a thin-line open book or folded sheet seen at a slight angle, with
three short horizontal lines on it suggesting text. Above it, an upward arrow
made of a thin line, broken into three ascending segments — measured progress,
not a generic growth arrow.
One element only in terracotta #D97757: the topmost arrow segment.

NEGATIVE PROMPT: [ortak negatif prompt] + no graduation caps, no diplomas,
no classrooms, no lightbulbs, no brain imagery, no generic growth chart
```

---

## 4. `biz-kimiz-hero.png`

**Boyut:** 1600 × 900 px (16:9)
**Konum:** `public/images/`
**Kullanım:** `/biz-kimiz` sayfası hero görseli

```
An abstract editorial composition, 1600x900, on cream #FAF9F5.
Subject: a stack of thin-line rectangles seen at a slight angle, like sheets of
a report offset from each other. Each sheet is drawn in 1px outline only,
#E3DFD4. The topmost sheet carries a few short horizontal rules suggesting
lines of text (abstract, not readable), and one small terracotta #D97757
horizontal rule among them — the finding that matters.
The stack sits in the right two-thirds; the left third is empty cream for
typography.
No perspective grid, no desk, no environment — the sheets float on the cream
with no shadow at all.
Flat, print-like, deeply restrained. Mood: evidence, quietly stacked.

NEGATIVE PROMPT: [ortak negatif prompt] + no desks, no offices, no pens,
no coffee cups, no clipboards, no magnifying glass
```

---

## 5. `evidence-pattern.png`

**Boyut:** 1200 × 400 px
**Konum:** `public/images/`
**Kullanım:** "Kanıt türleri vitrini" bölümünün arka planı, düşük opaklık

```
A wide abstract band, 1200x400, on antrasit #1F1E1D (dark).
Subject: a horizontal timeline of very small thin-line marks — vertical ticks
of varying heights, like a stopwatch scale merged with an audio waveform,
running the full width. The marks are #EDEBE3 at low opacity.
Roughly every seventh mark is terracotta #D97757 and slightly taller.
Extremely subtle, low contrast — this sits behind text at 15% opacity.
Perfectly horizontal, no perspective, evenly distributed.

NEGATIVE PROMPT: [ortak negatif prompt] + no music equalizer bars, no heartbeat
line, no EKG, no sound wave visualization with fills
```

---

## 6. `404-terminal.png` (opsiyonel)

**Boyut:** 800 × 400 px
**Konum:** `public/images/`
**Kullanım:** 404 sayfası — şu an saf CSS terminal var, görsel şart değil

```
An abstract composition, 800x400, on terminal dark #262624.
Subject: a thin-line rectangle outline suggesting a panel, with three tiny
filled circles in brass #A98A44 in its top-left corner. Inside the panel,
mostly empty space with a single short horizontal terracotta #D97757 line and
a small blinking-cursor-like vertical bar in #EDEBE3.
Very sparse. Almost nothing in the frame.

NEGATIVE PROMPT: [ortak negatif prompt] + no code, no syntax highlighting,
no terminal text, no error symbols, no 404 numerals
```

---

## 7. TESLİM KONTROL LİSTESİ

Bana dosyaları verirken:

```
public/images/
├── og/
│   ├── og-default-tr.png      1200×630
│   ├── og-default-en.png      1200×630
│   └── og-default-ru.png      1200×630
├── modules/
│   ├── module-a-onburo.png    800×450
│   ├── module-b-fb.png        800×450
│   ├── module-c-wellness.png  800×450
│   ├── module-d-360.png       800×450
│   └── module-e-egitim.png    800×450
├── paper-texture.png          1024×1024 (seamless)
├── biz-kimiz-hero.png         1600×900
├── evidence-pattern.png       1200×400
└── 404-terminal.png           800×400 (opsiyonel)
```

**Kabul kontrolü — bana vermeden önce bak:**

- [ ] Zemin rengi tam `#FAF9F5` mi? (Gemini sıklıkla beyaza kayar — pipetle kontrol et)
- [ ] Terracotta tam `#D97757` mi, turuncuya kaymış mı?
- [ ] Görselde **hiç yazı/harf/rakam** var mı? Olmamalı — Gemini istemsizce metin ekler
- [ ] Beş modül görseli **yan yana konunca tek sistem** gibi duruyor mu? Biri diğerlerinden kalınsa/renkliyse tekrar üret
- [ ] `paper-texture.png` gerçekten seamless mi? İki kopyayı yan yana koy, dikiş görünüyor mu?
- [ ] Gölge/gradient/parlaklık var mı? Olmamalı

**Renk kaymışsa:** dosyayı yine de ver, ben kodda düzeltirim (CSS filter veya yeniden renklendirme). Ama kompozisyon yanlışsa yeniden üretmek gerekir.

**Karanlık tema:** görsellerin çoğu krem zeminli. Koyu temada bunları `mix-blend-mode` veya ayrı karanlık varyantla halledeceğim — sen ayrıca karanlık versiyon üretme, önce açık temayı doğru yakalayalım.
