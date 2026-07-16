import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
  /**
   * Everything except the routes that must never be given a locale prefix:
   *
   * - `api`      — /api/teklif, /api/odeme and its callback are called by the
   *                forms and by the bank with a fixed URL. A redirect to
   *                /tr/api/... would turn a POST into a GET and break both.
   * - `_next`, `_vercel` — build output and platform internals.
   * - `images`   — static assets under /public/images.
   * - `.*\..*`   — any request with a file extension: favicon.ico, robots.txt,
   *                sitemap.xml, og images. These are files, not pages.
   */
  matcher: ["/((?!api|_next|_vercel|images|.*\\..*).*)"],
};
