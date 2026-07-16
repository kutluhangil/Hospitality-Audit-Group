# Pre-Launch Production Readiness Audit — Hospitality Audit Group

> Date: 2026-07-16 · Stack: Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · next-intl (TR/EN) · Resend (mail) · iyzico (payments) · Host target: Vercel · No database.

---

## 1. Executive Summary

| Category | Score | Verdict |
|---|:---:|---|
| Performance | 88 | Strong. Static SSG, `next/font` with `display: swap`, `next/image` everywhere but one decorative `<img>`. No blocking third parties. |
| Security | 62 | Biggest gap. **No HTTP security headers at all.** No rate limiting on public POST routes. Offsetting: no secrets in repo, `npm audit` clean, strong input validation, honeypot, payment double-locked. |
| Accessibility | 80 | Good foundations (measured AA contrast, `prefers-reduced-motion`, real semantic elements). Missing skip-link; one decorative `<img>` without dimensions. |
| Mobile / Responsive | 85 | Mobile-first, safe-area insets, sticky mobile cart bar with HIG touch targets, zoom not locked. |
| SEO / Metadata | 82 | Per-locale titles/descriptions, OpenGraph, canonical + hreflang, robots gating, sitemap. Missing Twitter Card and JSON-LD structured data. |
| Code Quality | 90 | TS strict, no `any`, business logic isolated in `lib/`, 57 passing tests, clean lint (1 known warning). Deliberate, documented fallbacks. |
| UX / Polish | 84 | Solid form UX. Missing `apple-touch-icon`, web manifest, `theme-color`. |
| **Overall** | **~80** | **Not launch-blocked by code.** One Critical class (security headers) is fully fixable in-repo now. Remaining blockers are the operational items already tracked in `yapilmasi-gerekenler.md` (real company data, keys, ETBİS, legal review). |

---

## 2. Findings

### Security

**🔴 SEC-1 — No HTTP security headers** · `next.config.mjs` (no `headers()`)
The config sets redirects and i18n only. Nothing sends `Strict-Transport-Security`, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or a `Content-Security-Policy`. A site that will take card payments is clickjackable (no frame protection), allows MIME sniffing, and never forces HTTPS. Fix: add an `async headers()` block (snippet in Fix Plan).

**🟠 SEC-2 — No rate limiting on public POST routes** · `app/api/teklif/route.ts`, `app/api/odeme/route.ts`
Both endpoints accept unauthenticated POSTs. The honeypot (`hasHoneypotValue`) stops naive bots, but there is no per-IP throttle, so a script can flood `/api/teklif` — inbox spam plus, once `RESEND_API_KEY` is live, real send cost. Fix: an IP token-bucket via Vercel KV / Upstash Ratelimit (needs a store; see Fix Plan). Marked High, not Critical, because it needs infra.

**🟢 SEC-3 — PII written to server log in the no-key fallback** · `app/api/teklif/route.ts:176`
When `RESEND_API_KEY` is unset the full payload (name, email, phone) is logged. Deliberate dev/demo fallback and it never reaches the browser, but in a misconfigured production (key missing) contact PII lands in Vercel logs. Acceptable given the design; revisit if it ever runs keyless in prod.

**✅ No secrets in repo** — grep clean, `.env` gitignored, `.env.example` only. **✅ `npm audit`: 0 vulnerabilities.** **✅ No `dangerouslySetInnerHTML`/`innerHTML`.** **✅ No DB / no SQL injection surface.** **✅ Payment secrets server-only; payment double-locked (keys + corporate identity).**

### Performance

**🟡 PERF-1 — One raw `<img>` without dimensions** · `components/legal/LegalPage.tsx:61`
Decorative aside image bypasses `next/image` (also the lone lint warning). No `width`/`height` → minor CLS on legal pages; unoptimized bytes. Hidden below `lg`, so impact is desktop-only. Fix: `next/image` with explicit dimensions, or keep `<img>` with `width`/`height` + `loading="lazy"` + `decoding="async"`.

**✅** Fonts self-hosted via `next/font` with `display: swap` and `latin-ext` subset. **✅** SSG for all locale pages (`generateStaticParams`). **✅** `next/image` in `PaperFigure`, `Logo`, `EvidenceShowcase`. No render-blocking third-party origins (no external fonts/analytics), so no `preconnect` needed.

### Accessibility

**🟠 A11Y-1 — No skip-to-content link** · `app/[locale]/layout.tsx`
Keyboard/screen-reader users must tab through the full header nav on every page. Fix: a visually-hidden skip link before `<Header/>` targeting `#main`, and add `id="main"` to page `<main>`.

**🟡 A11Y-2 — Decorative `<img>` lacks dimensions** · `components/legal/LegalPage.tsx:61`
`alt=""` is correct (decorative), but missing dimensions; see PERF-1. Same fix resolves both.

**✅** `lang={locale}` on `<html>`. **✅** Real `<button>`/`<a>` (no clickable divs found). **✅** `prefers-reduced-motion` honored (project contract). **✅** Contrast measured to AA and documented in `globals.css`; two-layer accent keeps text off the sub-AA terracotta.

### Mobile / Responsive

**✅** Safe-area insets + HIG touch sizes applied (recent commit). **✅** Sticky mobile cart bar. **✅** Viewport not zoom-locked (no `maximum-scale`/`user-scalable=no`), so iOS pinch-zoom works. **Note:** no explicit `viewport` export — Next's default (`width=device-width, initial-scale=1`) applies; fine, but the same export is where `themeColor` belongs (see UX-2).

### SEO / Metadata

**🟠 SEO-1 — No Twitter Card tags** · `app/[locale]/layout.tsx:66`
Only OpenGraph is set. X/Twitter shares fall back to a bare link. Fix: add `twitter: { card: "summary_large_image", ... }` to metadata.

**🟠 SEO-2 — No JSON-LD structured data** · site-wide
No `Organization`/`ProfessionalService` schema. Rich-result eligibility and entity understanding suffer. Fix: inject an `Organization` JSON-LD `<script>` in the layout, gated on `!company.isPlaceholder` so it never ships placeholder data.

**✅** Per-locale `title`/`description`, `metadataBase`, canonical + hreflang via `alternatesFor`, OG per locale. **✅** `robots.ts` disallows all while placeholder, opens with sitemap at launch. **✅** `sitemap.ts`. **✅** Localized slugs. **✅** Useful 404 (`not-found.tsx`). **✅** `check-links` script verifies internal links.

### Code Quality

**✅** TS strict, no `any`/`@ts-ignore`/`eslint-disable`. **✅** Business logic in `lib/`, isolated and unit-tested (57 tests). **✅** Errors raised explicitly; fallbacks are deliberate and commented. **🟢** `console.log` calls in API routes are intentional operational logging, not debug leftovers.

### UX / Polish

**🟡 UX-1 — Icon set incomplete** · `app/` has only `icon.png`
No `apple-touch-icon` (iOS home-screen), no `manifest.webmanifest`. Fix: add `apple-icon.png` and a minimal manifest.

**🟡 UX-2 — No `theme-color`** · `app/[locale]/layout.tsx`
No `viewport.themeColor`, so mobile browser chrome does not match the paper/terminal themes. Fix: export `viewport` with light/dark `themeColor`.

**✅** Forms: inline errors, pending-disabled submit, success reference feedback, honeypot. **✅** No unsafe `target="_blank"` external links found.

---

## 3. Fix Plan (Critical first)

Status: items 1–7 **applied and verified** on 2026-07-16 (typecheck + lint + 57 tests + build clean; headers confirmed live via `curl -I`). Item 8 deferred — needs an external store.

| # | Item | Sev | Effort | Status |
|---|---|:---:|:---:|:---:|
| 1 | **HTTP security headers** in `next.config.mjs` (HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP with `frame-ancestors 'none'` + iyzico allow-list) | 🔴 | S | ✅ Done |
| 2 | Twitter Card metadata · `app/[locale]/layout.tsx` | 🟠 | XS | ✅ Done |
| 3 | `Organization` JSON-LD, gated on `!isPlaceholder` · `app/[locale]/layout.tsx` | 🟠 | S | ✅ Done |
| 4 | Skip-to-content link + `#main-content` wrapper · `app/[locale]/layout.tsx` | 🟠 | XS | ✅ Done |
| 5 | `theme-color` via `viewport` export (from `lib/tokens.ts`) | 🟡 | XS | ✅ Done |
| 6 | `apple-icon.png` + `app/manifest.ts` | 🟡 | S | ✅ Done |
| 7 | `LegalPage` `<img>` → `next/image fill` | 🟡 | XS | ✅ Done |
| 8 | Rate limiting on `/api/teklif` + `/api/odeme` | 🟠 | M | ⏳ Deferred — **needs Vercel KV / Upstash** |

### #1 — security headers (the Critical fix)

```js
// next.config.mjs — inside nextConfig
async headers() {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "style-src 'self' 'unsafe-inline'",           // Tailwind + framer inline styles
    "script-src 'self' 'unsafe-inline'",          // next-themes inline theme script
    "connect-src 'self' https://*.iyzipay.com",
    "frame-src https://*.iyzipay.com",            // iyzico 3DS
    "form-action 'self' https://*.iyzipay.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  return [{
    source: "/:path*",
    headers: [
      { key: "Content-Security-Policy", value: csp },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ],
  }];
},
```

> CSP note: `script-src`/`style-src` keep `'unsafe-inline'` because next-themes injects an inline pre-hydration script and Tailwind/framer emit inline styles; XSS surface is minimal (no `dangerouslySetInnerHTML`, no user-rendered HTML). Tightening to nonces is a later hardening step. iyzico origins are pre-allow-listed so the payment path works the moment keys go live.

### #8 — rate limiting (needs a store)

In-memory counters do not survive serverless cold starts / multiple instances, so this needs Vercel KV or Upstash Redis:

```ts
import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
const limiter = new Ratelimit({ redis: kv, limiter: Ratelimit.slidingWindow(5, "10 m") });
// in POST: const { success } = await limiter.limit(ip); if (!success) return 429;
```

---

## 4. Notes / Out of Scope

- Operational launch blockers (real company registry data, `RESEND_API_KEY`, iyzico keys, ETBİS, legal review, `isPlaceholder: false`) are **not code defects** — they are tracked in `yapilmasi-gerekenler.md`. This audit does not repeat them.
- Payment integration is `UNVERIFIED` against a live iyzico endpoint (documented in `lib/payment.ts`); must be sandbox-tested end-to-end once keys exist.
