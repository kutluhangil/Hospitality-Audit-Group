import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";

import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { colors } from "@/lib/tokens";

/**
 * Next only accepts `alt` as a static value, so it cannot carry the translated
 * tagline the card actually draws. The company name is the same in both locales
 * and is what the image is *of* — the tagline below it is decoration on a
 * preview card, not information a screen reader is missing.
 */
export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** One card per locale, both known at build time. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Satori cannot read CSS variables, so the palette comes from lib/tokens.ts —
 * the one module allowed to hold raw values. The card is always the light theme:
 * social previews have no theme to follow.
 */
const GOOGLE_FONTS_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)";

/**
 * Fetched at build time rather than committed as a binary. The `text` parameter
 * makes Google return only the glyphs actually drawn — a few KB instead of the
 * full face — and guarantees the Turkish characters in the tagline are included.
 * The desktop UA is what makes Google serve TTF; satori cannot parse woff2.
 */
async function loadFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const cssUrl =
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}` +
    `&text=${encodeURIComponent(text)}`;

  const cssResponse = await fetch(cssUrl, { headers: { "User-Agent": GOOGLE_FONTS_UA } });
  if (!cssResponse.ok) {
    throw new Error(
      `Google Fonts CSS request failed for "${family}" ${weight} (${cssResponse.status}): ` +
        `${await cssResponse.text()}`,
    );
  }

  const css = await cssResponse.text();
  const fontUrl = /src:\s*url\((https:\/\/[^)]+)\)/.exec(css)?.[1];
  if (!fontUrl) {
    throw new Error(
      `No font URL found in Google Fonts CSS for "${family}" ${weight}: ${css.slice(0, 200)}`,
    );
  }

  const fontResponse = await fetch(fontUrl);
  if (!fontResponse.ok) {
    throw new Error(
      `Font download failed for "${family}" ${weight} (${fontResponse.status}): ${fontUrl}`,
    );
  }

  return fontResponse.arrayBuffer();
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: active, namespace: "site" });
  const tagline = t("tagline");

  const [serif, sans] = await Promise.all([
    loadFont("Source Serif 4", 600, siteConfig.name),
    loadFont("Inter", 400, tagline),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: colors.bg.light,
          padding: "96px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Source Serif 4",
            fontSize: 72,
            letterSpacing: "-0.02em",
            color: colors.ink.light,
          }}
        >
          {siteConfig.name}
        </div>

        {/* The terracotta rule — accent doing exactly the decorative job it is for. */}
        <div
          style={{
            display: "flex",
            width: 140,
            height: 5,
            margin: "40px 0",
            backgroundColor: colors.accent,
          }}
        />

        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 32,
            color: colors.ink.light,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Source Serif 4", data: serif, weight: 600, style: "normal" },
        { name: "Inter", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}
