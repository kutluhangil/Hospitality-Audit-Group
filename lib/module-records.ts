import tr from "@/messages/tr.json";

import { CATALOGUE_ORDER, type CartItemId } from "@/lib/modules-data";

/**
 * What a module is called *on a record* — the payment basket sent to the
 * provider, and anything else that has to survive being read back later.
 *
 * This is always Turkish, and that is the point rather than an omission. The
 * contract is governed by Turkish law and its binding language is Turkish (see
 * the note on every English legal page); the invoice is a Turkish document; and
 * reconciliation happens in a Turkish merchant panel. A basket line that read
 * "Front Office" because the buyer happened to be browsing /en would name a
 * product that no contract, invoice or ledger of ours mentions.
 *
 * So: the interface follows the reader, the record follows the contract. What
 * the buyer *sees* is translated — components read the same strings through
 * `useTranslations("modules")`.
 *
 * Reading tr.json directly keeps one source of truth: the title here and the
 * title on screen cannot drift apart, because they are the same string. Server
 * only — importing this from a client component would ship all of tr.json to
 * the browser.
 */
export function recordTitleOf(id: CartItemId): string {
  const entry = tr.modules[id as keyof typeof tr.modules];

  if (!entry || typeof entry !== "object" || !("title" in entry)) {
    throw new Error(
      `Unknown cart item: ${id}. Expected one of ${CATALOGUE_ORDER.join(", ")}. ` +
        `Every item needs a "modules.<id>.title" entry in messages/tr.json.`,
    );
  }

  return entry.title;
}

/** The provider's basket taxonomy. One category: everything sold here is an audit service. */
export const RECORD_CATEGORY = "Denetim Hizmeti";
