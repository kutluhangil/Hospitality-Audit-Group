import type { Metadata, Viewport } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Source_Serif_4, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlaceholderNotice } from "@/components/layout/PlaceholderNotice";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { clientMessages } from "@/i18n/client-messages";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { company } from "@/lib/company-data";
import { ogLocales, siteConfig } from "@/lib/site-config";
import { colors } from "@/lib/tokens";

import "../globals.css";

// latin-ext carries the Turkish glyphs (ş, ğ, İ, ı); without it they fall back
// to a substitute face and the type loses its alignment. latin-ext also covers
// English, so these two subsets serve both locales.
const serif = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  variable: "--font-source-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/**
 * Built per locale rather than exported as a constant: the tagline and the
 * description are copy, and copy is what changes between /tr and /en. A static
 * `metadata` export would put the Turkish tagline in every English <title>.
 */
export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const active = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: "site" });

  const title = `${siteConfig.name} — ${t("tagline")}`;
  const url = new URL(
    getPathname({ href: "/", locale: active }),
    siteConfig.url,
  ).toString();

  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: title, template: `%s — ${siteConfig.name}` },
    description: t("description"),
    openGraph: {
      type: "website",
      locale: ogLocales[active],
      url,
      siteName: siteConfig.name,
      title,
      description: t("description"),
      // No `images` key: app/[locale]/opengraph-image.tsx supplies it. File-based
      // metadata wins over this object, so an entry here would only be a stale duplicate.
    },
    // Twitter/X reads its own card tags; without them a share degrades to a bare
    // link. The image comes from the same file-based opengraph-image.
    twitter: {
      card: "summary_large_image",
      title,
      description: t("description"),
    },
  };
}

// Matches the mobile browser chrome to the active theme's page background. The
// raw values come from lib/tokens.ts — the one place, with globals.css, allowed
// to hold hex — because a theme-color meta tag cannot read a CSS variable.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: colors.bg.light },
    { media: "(prefers-color-scheme: dark)", color: colors.bg.dark },
  ],
};

/** Both locales are known at build time, so every page below can stay static. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type LayoutProps = { params: Promise<{ locale: string }> };

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps & { children: React.ReactNode }) {
  const { locale } = await params;
  // [locale] catches any first segment, so an unknown one is a 404 rather than a
  // page rendered in a language that does not exist.
  if (!hasLocale(routing.locales, locale)) notFound();

  // Opts the tree into static rendering: without it every page below turns
  // dynamic as soon as it reads a translation.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "site" });

  // Only what a "use client" component reads. The rest resolves on the server,
  // where it costs nothing and never reaches the browser.
  const messages = await getMessages();

  // Organization schema for search engines. Gated on the same launch flag as
  // indexing: while the registry data is a placeholder, robots.txt blocks
  // crawlers anyway, so shipping structured data would only describe stand-in
  // details. It opens together with indexing at launch.
  const organizationJsonLd = company.isPlaceholder
    ? null
    : JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: siteConfig.name,
        url: siteConfig.url,
        email: siteConfig.contact.email,
        telephone: siteConfig.contact.phone,
      });

  return (
    // suppressHydrationWarning is required: next-themes writes the theme class
    // onto <html> before React hydrates.
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-bg text-ink">
        {organizationJsonLd && (
          // Static, self-authored JSON — no user input reaches this string, so
          // it carries no injection surface. This is Next's documented way to
          // emit JSON-LD.
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
          />
        )}
        <NextIntlClientProvider messages={clientMessages(messages)}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2 focus:text-ink"
            >
              {t("skipToContent")}
            </a>
            <PlaceholderNotice />
            <Header />
            <div id="main-content" tabIndex={-1} className="outline-none">
              {children}
            </div>
            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
