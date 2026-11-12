<div align="center">

<img src="docs/media/hero.svg" alt="Hospitality Audit Group — mystery-guest audits and staff training for hotels" width="100%">

<p>
  <a href="https://hospitalityauditgroup.vercel.app"><img alt="Live" src="https://img.shields.io/badge/live-visit%20the%20site-c9a227?style=for-the-badge&labelColor=121212"></a>
  <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js%2016-React%2019-5fbf8f?style=for-the-badge&labelColor=121212">
  <img alt="i18n" src="https://img.shields.io/badge/next--intl-TR%20%2F%20EN-d06a4f?style=for-the-badge&labelColor=121212">
  <img alt="Tailwind" src="https://img.shields.io/badge/Tailwind%20CSS-4-c9a227?style=for-the-badge&labelColor=121212">
</p>

<p><em>The corporate site of a company that audits hotels with mystery-guest visits and trains their staff.<br>
Not a brochure but a sales architecture: choose audit modules, see the price, pay or ask for a quote.</em></p>

<img src="public/images/screenshots/screenshot-1.png" alt="The home page with the audit terminal hero" width="100%">

</div>

<img src="docs/media/divider.svg" width="100%" alt="">

## The idea

A hotel owner arrives, picks which areas of the property to audit module by module, adds them to a cart and sees the price. The commercial heart is `/moduller`; the persuasive heart is the audit criteria themselves: what is measured, with which evidence and at which threshold. Competitors hide their methodology; this site shows it.

**What it deliberately leaves out:** stock hotel photos, a wall of client logos, auditor faces, unverifiable testimonials and hidden prices. A company that sells discretion cannot expose its clients, so it shows evidence instead of praise.

<img src="docs/media/divider.svg" width="100%" alt="">

## Design: paper and terminal

Two themes, two faces of the same site:

- **Light, the report paper**: cream background, serif headings, generous white space. The audit report in your hands.
- **Dark, the operations terminal**: anthracite background and mono log lines. The auditor's screen in the field.

The visual courage is spent in one place: the **audit terminal** in the hero, which types out an audit line by line.

<table>
  <tr>
    <td width="33%"><img src="public/images/screenshots/screenshot-2.png" alt="Audit modules"></td>
    <td width="33%"><img src="public/images/screenshots/screenshot-3.png" alt="Audit criteria"></td>
    <td width="33%"><img src="public/images/screenshots/screenshot-4.png" alt="Dark theme"></td>
  </tr>
</table>

<img src="docs/media/divider.svg" width="100%" alt="">

## Under the hood

```mermaid
flowchart LR
  V[Visitor] --> L[app/locale · next-intl]
  L --> M[/moduller · module cart/]
  L --> C[Criteria library<br/>evidence · thresholds]
  M --> Q[Quote / checkout form]
  Q --> API[app/api] --> R[Resend · email]
  T[next-themes<br/>paper · terminal] --> L
```

<img src="docs/media/divider.svg" width="100%" alt="">

## Türkçe özet

**Hospitality Audit Group**, otellere gizli müşteri denetimi ve personel eğitimi sunan bir firmanın kurumsal web sitesi. Bir tanıtım sitesinden çok satış mimarisi: otel sahibi denetlenecek alanları modül modül seçip sepete ekliyor, fiyatı görüyor, ödüyor ya da teklif istiyor. Denetim kriterleri (neyin, hangi kanıtla, hangi eşikte ölçüldüğü) açıkça gösteriliyor. Açık temada rapor kâğıdı, koyu temada saha terminali görünümü var; Türkçe ve İngilizce.

<img src="docs/media/divider.svg" width="100%" alt="">

## Development

```sh
npm install
cp .env.example .env.local     # Resend key and contact address
npm run dev                    # http://localhost:3000
npm test                       # vitest
npm run typecheck
npm run check-links
npm run build
```

<div align="center">
<br>
<a href="https://github.com/kutluhangil"><img src="docs/media/signature.svg" width="100%" alt="Built by kutluhangil"></a>
<sub>Evidence, not praise.</sub>
</div>
