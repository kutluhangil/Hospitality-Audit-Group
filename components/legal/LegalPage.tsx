import Link from "next/link";

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Typographic shell for the legal pages. @tailwindcss/typography is not
 * installed (and Tailwind v4 here is CSS-first), so the handful of elements
 * these two pages actually need are spelled out rather than pulled in wholesale.
 */

/** ~68 characters at the body size — inside the 65–75 comfortable reading band. */
const MEASURE = "max-w-[68ch]";

type LegalPageProps = {
  title: string;
  /** Rendered as the "Son güncelleme" line; legal text is dated by convention. */
  updated: string;
  children: React.ReactNode;
};

export function LegalPage({ title, updated, children }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 md:py-24">
      <div className={MEASURE}>
        <Eyebrow tone="muted">Yasal</Eyebrow>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-ink-muted">Son güncelleme: {updated}</p>

        <TemplateNotice />

        <div className="mt-12 space-y-10">{children}</div>
      </div>
    </main>
  );
}

/**
 * Neither page has been through legal review. The terracotta border and the
 * mono label are here so the draft state is caught on sight rather than read
 * past — shipping either page unreviewed should feel like an obvious mistake.
 */
function TemplateNotice() {
  return (
    <Card tone="accent" className="mt-8 border-2">
      <Eyebrow>Taslak — hukuk onayı bekliyor</Eyebrow>
      <p className="mt-3 text-base leading-relaxed text-ink">
        Bu metin şablondur; yayına almadan önce hukuk danışmanınızla teyit edin.
      </p>
    </Card>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-ink">{children}</div>
    </section>
  );
}

/** Inline link inside legal body copy — underlined, since colour alone must not carry it. */
export function LegalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className =
    "text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-accent-strong-hover";

  // mailto: and other schemes must stay plain anchors; only routes get the router.
  if (!href.startsWith("/")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function LegalList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          {/* Decorative bullet, so the plain accent is allowed to carry it. */}
          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
