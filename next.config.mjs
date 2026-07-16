import { readFileSync } from "node:fs";

import createNextIntlPlugin from "next-intl/plugin";

/**
 * Warns in every build log while the company data is still a placeholder.
 *
 * Read as text rather than imported: this file is loaded by the Next config
 * before any TypeScript transform exists to compile lib/company-data.ts.
 */
function warnIfPlaceholder() {
  try {
    const source = readFileSync(new URL("./lib/company-data.ts", import.meta.url), "utf8");
    if (!/isPlaceholder:\s*true/.test(source)) return;

    console.warn(
      [
        "",
        "  ⚠  PLACEHOLDER İÇERİK İLE BUILD ALINIYOR",
        "     lib/company-data.ts → isPlaceholder: true",
        "     Kuruluş öyküsü ve kadro rakamları geçici. robots.txt arama",
        "     motorlarını engelliyor. Ayrıntı: docs/senin-yapacaklarin.md",
        "",
      ].join("\n"),
    );
  } catch (error) {
    // A missing or unreadable file is a real problem — the flag cannot be
    // checked, so say so rather than letting the build look clean.
    console.warn(`  ⚠  lib/company-data.ts okunamadı, placeholder kontrolü atlandı: ${error}`);
  }
}

warnIfPlaceholder();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // /hakkimizda shipped in v1 and may be linked or indexed; its content now
      // lives on the deeper /biz-kimiz page. The unprefixed source is kept and
      // sent to the Turkish page: the old links carry no locale, and the
      // middleware only prefixes paths it does not already redirect.
      { source: "/hakkimizda", destination: "/tr/biz-kimiz", permanent: true },
      { source: "/tr/hakkimizda", destination: "/tr/biz-kimiz", permanent: true },
      { source: "/en/hakkimizda", destination: "/en/about-us", permanent: true },
    ];
  },
};

// Wires i18n/request.ts into the server components, which is what makes
// getTranslations / setRequestLocale resolve messages per request.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
