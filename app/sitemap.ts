import type { MetadataRoute } from "next";

import { routes, siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  // Every entry shares one timestamp: the whole site ships as a single build.
  const lastModified = new Date();

  return routes.map((route): MetadataRoute.Sitemap[number] => ({
    url: new URL(route, siteConfig.url).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
