import type { AbstractIntlMessages } from "next-intl";

/**
 * The namespaces a client component actually reads.
 *
 * Without this, NextIntlClientProvider hands the *entire* message file to the
 * browser, and it is serialised into the HTML of every page. The home page was
 * shipping the evidence taxonomy, the legal nav and the deliverables copy from
 * three pages it never renders — around 29KB of it, growing with every string
 * added anywhere.
 *
 * Server components do not read from here at all: getTranslations resolves
 * against the full message file on the server, where the cost is nil. So a
 * namespace belongs on this list only if a component marked "use client" looks
 * it up.
 *
 * Getting this wrong fails loudly rather than silently: a client component
 * asking for a namespace that was not sent throws while the page is being
 * prerendered, so the build breaks rather than production.
 */
const CLIENT_NAMESPACES = [
  "nav", // Header, MobileNav
  "header", // Header, MobileNav
  "theme", // ThemeToggle
  "localeSwitcher", // LocaleSwitcher
  "cart", // CartButton, CartLines, QuoteForm
  "catalogue", // CartLines, QuoteForm
  "modules", // CartButton, CartLines, PackageOfferBanner, QuoteForm
  "packageOffer", // PackageOfferBanner
  "forms", // ContactForm, QuoteForm
] as const;

/**
 * The one client component whose copy sits inside a mostly server-side
 * namespace. Sent on its own rather than dragging all of `home` across.
 */
const CLIENT_HOME_KEYS = ["heroMark"] as const;

export function clientMessages(messages: AbstractIntlMessages): AbstractIntlMessages {
  const picked: Record<string, unknown> = {};

  for (const namespace of CLIENT_NAMESPACES) {
    if (namespace in messages) picked[namespace] = messages[namespace];
  }

  const home = messages.home as Record<string, unknown> | undefined;
  if (home) {
    const homeSubset: Record<string, unknown> = {};
    for (const key of CLIENT_HOME_KEYS) {
      if (key in home) homeSubset[key] = home[key];
    }
    picked.home = homeSubset;
  }

  return picked as AbstractIntlMessages;
}
