import { createNavigation } from "next-intl/navigation";

import { routing } from "@/i18n/routing";

/**
 * Locale-aware replacements for the `next/link` and `next/navigation` exports.
 *
 * Components import these instead of the Next originals: they take the internal
 * Turkish pathname and render whatever the active locale's URL is, so no
 * component has to know that /moduller is /modules in English.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
