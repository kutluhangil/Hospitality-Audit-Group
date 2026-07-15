# HAG Website — Çalışma Kuralları

## Git (KESİN KURALLAR)

- `git commit` / `git push` **yalnızca Kutluhan açıkça istediğinde** çalıştırılır. Kendiliğinden asla.
- ASLA branch oluşturma (`git branch`, `git checkout -b` yasak). Mevcut branch'te kal.
- Commit mesajlarına, koda veya PR'lara hiçbir Claude/AI atfı ekleme. "Co-Authored-By: Claude" YASAK. GitHub Contributors yalnızca kutluhangil göstermeli.
- Commit öncesi zorunlu: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` — dördü de temiz olmadan commit atılmaz.

## Kod stili

- Yorumlar İngilizce, doğal ve profesyonel; "ne"yi değil "neden"i açıklar.
- TypeScript strict; `any` yasak.
- İçerik dili Türkçe — `docs/blueprint-v1.md`'deki kopya birebir kullanılır, lorem ipsum yazılmaz.

## Tasarım

- Tüm renkler CSS değişkenlerinden gelir; hardcoded hex yalnızca `app/globals.css` ve `lib/tokens.ts`'te bulunur.

### Animasyon (blueprint Bölüm 10'un yerine geçer)

Blueprint animasyonu tek "orkestra anı"yla sınırlıyordu. Bu genişletildi — ama **bütçe hâlâ var**, sınırsız değil. Kural: *hareket bir işe yaramalı.* Dikkat çekmek için değil, bir şey anlatmak için.

İzinli hareket:

| Yer | Efekt | Sınır |
|---|---|---|
| AuditTerminal | Satır satır typewriter + loop | Sitenin tek imza anı |
| Section girişleri | `Reveal` fade+rise | 0.5s, sadece ilk görünümde |
| Sepet rozeti | Sayı değişiminde scale-pop | 200ms |
| Buton/link hover | Renk geçişi | 150ms |
| Kart hover | Kenarlık rengi + çok hafif yükselme | 150ms, `translateY` max 2px |
| Kriter kartları | Liste içinde stagger reveal | 40ms aralık, grup başına max 6 kart |
| Sayı sayaçları | İstatistiklerde count-up | Sadece ilk görünümde, reduced-motion'da statik |
| Sayfa geçişleri | View Transitions ile fade | 200ms |
| Akordeon/details | Yükseklik geçişi | 200ms |

Yasak: parallax, sonsuz dönen/pulsing öğeler, gradient animasyonu, spinner (skeleton kullan), hover'da scale > 1.02, 500ms'den uzun giriş animasyonu, scroll-jacking.

**Her yeni animasyon `useReducedMotion` kontrolünden geçmek zorunda.** İstisna yok.

## Blueprint'ten onaylı sapmalar

Blueprint yazıldıktan sonra alınan kararlar. Blueprint metniyle çeliştiklerinde **bu bölüm geçerlidir**.

### Next.js 16 (blueprint: 14)

Next 14 hattı yama almayı bıraktı; 14.2.35 üzerinde 14 açık advisory vardı ve hiçbirinin 14.x düzeltmesi yok. Next 16 + React 19'a çıkıldı, `npm audit` temiz. Sonuçları:

- `next lint` kaldırıldı — lint script'i `eslint .`, config `eslint.config.mjs` (flat config).
- `postcss` için `package.json` içinde `overrides` var; `next`'in gömdüğü sürüm açıklıydı. Kaldırma.

### Tailwind CSS v4 (blueprint: v3)

`tailwind.config.ts` YOK. Tema `app/globals.css` içinde CSS-first tanımlanır:

- `@custom-variant dark` — `.dark` sınıfı stratejisi.
- `:root` / `.dark` blokları ham değerleri tutar.
- `@theme inline` bunları Tailwind utility'lerine bağlar (`--color-bg` → `bg-bg`).

Yeni token eklerken: önce `:root` ve `.dark`'a ham değeri yaz, sonra `@theme inline`'a eşle. `@theme inline` şart — `inline` olmadan `.dark` geçişi çalışmaz.

### İki katmanlı accent (blueprint: tek `--accent`)

`#D97757` metin olarak krem zeminde 2.96:1 — AA'yı geçmiyor. Bu yüzden accent ikiye ayrıldı:

- `--accent` (`#D97757`, iki temada da) — **yalnızca dekoratif**: kenarlık, ikon, ayraç, terminal `✗`. **Asla metin taşımaz.**
- `--accent-strong` — accent renkli **metin** ve **buton dolgusu** için. Açık: `#B04E2C`, koyu: `#E28A6D`.
- `--accent-strong-ink` — `--accent-strong` dolgusu üstündeki metin rengi. Açık: krem, koyu: siyah.

Yani eyebrow'lar `text-accent-strong`, `text-accent` DEĞİL. Blueprint'teki `--accent-hover` token'ı yerini `--accent-strong-hover`'a bıraktı.

### Teklif sepeti: Context yerine harici store (blueprint: `QuoteCartProvider` + Context)

`components/modules/QuoteCartProvider.tsx` YOK. Yerine `lib/quote-cart.ts` var: `useSyncExternalStore` üstüne kurulu bir store.

Neden: Context + `useEffect` içinde localStorage okuma pattern'i `react-hooks/set-state-in-effect` lint hatası veriyor ve SSR'da ya hydration uyumsuzluğu ya da bir tur boş render üretiyor. `useSyncExternalStore` bunu tasarım gereği çözer — sunucu render'ında `getServerSnapshot` (boş sepet), mount sonrası gerçek değer. Effect yok, provider yok.

Kullanım — herhangi bir client component'te, sarmalayıcı gerekmez:

```ts
"use client";
import { useQuoteCart } from "@/lib/quote-cart";

const { selected, hydrated, has, add, remove, toggle, clear } = useQuoteCart();
```

`hydrated` false iken seçime bağlı UI (header rozeti) render EDİLMEZ — aksi halde sunucu HTML'i ile ilk boyama çelişir.

### Paylaşılan çekirdek — ajanlar bunu yazmaz, kullanır

Bu dosyalar sözleşmedir; sayfa yazan ajanlar bunları değiştirmez, import eder:

- `app/globals.css`, `lib/tokens.ts` — renk/tipografi token'ları
- `lib/site-config.ts` — nav, iletişim, route listesi
- `lib/modules-data.ts` — modül A–E içerikleri + `moduleIcons` + `PRICING_NOTE`
- `lib/quote-cart.ts` — sepet store'u
- `components/ui/{Button,Card,Eyebrow,SectionHeading,Reveal,Logo}.tsx`

`Button` href verilirse `next/link`, verilmezse `<button>` render eder. Varyantlar: `accent` | `ghost` | `terminal`.

### Font değişken adları

next/font değişkenleri `--font-source-serif`, `--font-inter`, `--font-jetbrains-mono`. Blueprint'teki `--font-serif` adları kullanılamazdı: Tailwind v4'te `--font-serif` theme anahtarının kendisi, kendine referans verirdi. `@theme inline` bunları `--font-serif` / `--font-sans` / `--font-mono` utility'lerine bağlar — yani `font-serif`, `font-sans`, `font-mono` sınıfları normal çalışır.

## Tarayıcı otomasyonunda doğrulama — bilinen tuzak

Otomasyonla ekran görüntüsü alırken sayfa **boş görünür**. Site hatası değil: Chrome görünmeyen
sekmelerde `requestAnimationFrame`'i kısıyor, Framer Motion da rAF kullanıyor, `Reveal`
animasyonları `opacity: 0.07` gibi bir değerde donuyor. Beklemek çözmez — 6 saniye sonra da donuk.

**Çözüm:** ekran görüntüsünden önce tek bir scroll tıkı gönder. Sekme uyanır, animasyonlar anında
tamamlanır. Ya da DOM'u `getComputedStyle` ile sorgula — DOM her zaman doğru.

## Kontrast sözleşmesi

`globals.css`'teki oranlar ölçülmüş değerlerdir, yorum olarak yazılı. Palet değişirse yeniden ölçülmeli — hedef normal metin için AA (4.5:1).
