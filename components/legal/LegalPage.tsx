import Image from "next/image";
import { useFormatter, useLocale, useTranslations } from "next-intl";

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/i18n/navigation";
import { routing, type AppPathname } from "@/i18n/routing";

/**
 * Typographic shell for the legal pages. @tailwindcss/typography is not
 * installed (and Tailwind v4 here is CSS-first), so the handful of elements
 * these two pages actually need are spelled out rather than pulled in wholesale.
 */

/** ~68 characters at the body size — inside the 65–75 comfortable reading band. */
const MEASURE = "max-w-[68ch]";

type LegalPageProps = {
  title: string;
  /**
   * ISO date (YYYY-MM-DD). Legal text is dated by convention, and the date is
   * rendered per locale rather than stored as prose — "16 Temmuz 2026" written
   * out would read as Turkish on the English page.
   */
  updated: string;
  illustrationSrc?: string;
  children: React.ReactNode;
};

export function LegalPage({ title, updated, illustrationSrc, children }: LegalPageProps) {
  const t = useTranslations("legal");
  const format = useFormatter();

  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 md:py-24">
      <div className={illustrationSrc ? "lg:grid lg:grid-cols-12 lg:gap-16 items-start" : ""}>
        <div className={`${MEASURE} ${illustrationSrc ? "lg:col-span-8 xl:col-span-9" : ""}`}>
          <Eyebrow tone="muted">{t("eyebrow")}</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-ink-muted">
            {t("updated", {
              date: format.dateTime(new Date(`${updated}T00:00:00Z`), {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              }),
            })}
          </p>

          <BindingLanguageNotice />
          <TemplateNotice />

          <div className="mt-12 space-y-10">{children}</div>
        </div>

        {illustrationSrc && (
          <aside className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-32 h-[calc(100vh-16rem)]">
            <div className="relative h-full w-full overflow-hidden rounded-md border border-line">
              <Image
                src={illustrationSrc}
                alt=""
                fill
                sizes="(min-width: 1280px) 25vw, 33vw"
                className="object-cover object-top"
              />
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}

/**
 * Shown on every locale except the source one.
 *
 * These texts state the terms of a contract governed by Turkish law, and the
 * Turkish version is the one that binds. A translation published without saying
 * so invites a reader to rely on it — which is the whole problem. It sits above
 * the draft notice because it is the more consequential of the two: the draft
 * warning goes away after legal review; this one never does.
 */
function BindingLanguageNotice() {
  const locale = useLocale();
  const t = useTranslations("legal");

  if (locale === routing.defaultLocale) return null;

  return (
    <Card tone="soft" className="mt-8 border-l-2 border-l-accent">
      <Eyebrow tone="muted">{t("bindingEyebrow")}</Eyebrow>
      <p className="mt-3 text-base leading-relaxed text-ink">
        {t("bindingBody")}
      </p>
    </Card>
  );
}

/**
 * Neither page has been through legal review. The terracotta border and the
 * mono label are here so the draft state is caught on sight rather than read
 * past — shipping either page unreviewed should feel like an obvious mistake.
 */
function TemplateNotice() {
  const t = useTranslations("legal");

  return (
    <Card tone="accent" className="mt-8 border-2">
      <Eyebrow>{t("draftEyebrow")}</Eyebrow>
      <p className="mt-3 text-base leading-relaxed text-ink">
        {t("draftBody")}
      </p>
    </Card>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed text-ink">
        {children}
      </div>
    </section>
  );
}

/**
 * Anything that is not an internal route. Spelled out rather than left as
 * `string` so the internal case keeps its route check: a plain `string` would
 * let a mistyped path fall through to the anchor branch and quietly 404.
 */
type ExternalHref = `mailto:${string}` | `tel:${string}` | `https://${string}`;

/**
 * Internal routes are the only hrefs that start with a slash, which makes the
 * leading character the whole test. A predicate rather than an inline check:
 * `startsWith` does not narrow the union, and the two branches need it to.
 */
function isExternal(href: AppPathname | ExternalHref): href is ExternalHref {
  return !href.startsWith("/");
}

/** Inline link inside legal body copy — underlined, since colour alone must not carry it. */
export function LegalLink({
  href,
  children,
}: {
  href: AppPathname | ExternalHref;
  children: React.ReactNode;
}) {
  const className =
    "text-accent-strong underline underline-offset-4 transition-colors duration-150 hover:text-accent-strong-hover";

  // mailto: and other schemes must stay plain anchors; only routes get the router.
  if (isExternal(href)) {
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
          <span
            aria-hidden
            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Inline code — a storage key or a header name, never prose. */
export function LegalCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-bg-soft px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  );
}

/**
 * The rich-text tags every legal message may use.
 *
 * These paragraphs are single sentences with links inside them, and where a link
 * falls in a sentence is not the same in Turkish and English — so the message
 * owns the placement and this owns the rendering. Spread into a t.rich call and
 * add page-specific tags alongside:
 *
 *   t.rich("s1.p1", { ...legalTags, contract: (c) => <LegalLink href="...">{c}</LegalLink> })
 */
export const legalTags = {
  b: (chunks: React.ReactNode) => <strong>{chunks}</strong>,
  code: (chunks: React.ReactNode) => <LegalCode>{chunks}</LegalCode>,
  kvkk: (chunks: React.ReactNode) => (
    <LegalLink href="/kvkk">{chunks}</LegalLink>
  ),
  privacy: (chunks: React.ReactNode) => (
    <LegalLink href="/gizlilik-politikasi">{chunks}</LegalLink>
  ),
  modules: (chunks: React.ReactNode) => (
    <LegalLink href="/moduller">{chunks}</LegalLink>
  ),
  process: (chunks: React.ReactNode) => (
    <LegalLink href="/surec">{chunks}</LegalLink>
  ),
  quote: (chunks: React.ReactNode) => (
    <LegalLink href="/teklif">{chunks}</LegalLink>
  ),
  contract: (chunks: React.ReactNode) => (
    <LegalLink href="/mesafeli-satis-sozlesmesi">{chunks}</LegalLink>
  ),
  preInfo: (chunks: React.ReactNode) => (
    <LegalLink href="/on-bilgilendirme">{chunks}</LegalLink>
  ),
  cancellation: (chunks: React.ReactNode) => (
    <LegalLink href="/iptal-iade">{chunks}</LegalLink>
  ),
} as const;
