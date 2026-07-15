import { readFileSync } from "node:fs";

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
      // lives on the deeper /biz-kimiz page.
      { source: "/hakkimizda", destination: "/biz-kimiz", permanent: true },
    ];
  },
};

export default nextConfig;
