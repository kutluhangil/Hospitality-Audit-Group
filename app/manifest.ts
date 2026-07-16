import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";
import { colors } from "@/lib/tokens";

/**
 * Minimal web app manifest for add-to-home-screen. The theme/background colours
 * come from lib/tokens.ts — a manifest is JSON, so it cannot read a CSS
 * variable, and this is one of the two places allowed to hold raw hex. Light
 * values are used: the manifest has a single colour, and the paper theme is the
 * site's default face.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    start_url: "/",
    display: "standalone",
    background_color: colors.bg.light,
    theme_color: colors.bg.light,
    icons: [
      { src: "/icon.png", sizes: "any", type: "image/png" },
      { src: "/apple-icon.png", sizes: "any", type: "image/png" },
    ],
  };
}
