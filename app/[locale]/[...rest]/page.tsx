import { notFound } from "next/navigation";

/**
 * Renders the custom 404 for unknown paths under a locale.
 *
 * Without this, /tr/olmayan has no matching route at all and Next falls back to
 * its own default 404, which sits outside the layout — no header, no footer, no
 * theme. Making the miss explicit puts it back inside app/[locale]/not-found.tsx.
 */
export default function CatchAllPage(): never {
  notFound();
}
