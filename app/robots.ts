import type { MetadataRoute } from "next";

import { company } from "@/lib/company-data";
import { siteConfig } from "@/lib/site-config";

/**
 * Indexing is gated on the same flag that marks the company data as
 * placeholder. Until the real details are in, crawlers are turned away: a
 * search result advertising a stand-in phone number and an invented founding
 * story is worse than no search result, and de-indexing afterwards is slow.
 *
 * Setting `isPlaceholder` to false at launch opens indexing and the corporate
 * sections together, which is the point — they are the same readiness question.
 */
export default function robots(): MetadataRoute.Robots {
  if (company.isPlaceholder) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteConfig.url).toString(),
    host: siteConfig.url,
  };
}
