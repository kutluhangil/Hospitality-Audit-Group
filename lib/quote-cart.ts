"use client";

import { useSyncExternalStore } from "react";

import { totalsFor, packageOffer, applyPackage, type CartTotals, type PackageOffer } from "@/lib/cart-math";
import { CATALOGUE_ORDER, type CartItemId } from "@/lib/modules-data";

const STORAGE_KEY = "hag-quote-cart";

export type QuoteCartSnapshot = {
  selected: readonly CartItemId[];
  /**
   * False during server render and hydration, true once localStorage has been
   * read. Selection-dependent UI (the header badge, the cart button's label)
   * stays neutral until it flips, so the server HTML and the first client paint
   * always agree.
   */
  hydrated: boolean;
};

const EMPTY: readonly CartItemId[] = [];
const SERVER_SNAPSHOT: QuoteCartSnapshot = { selected: EMPTY, hydrated: false };

const validIds = new Set<string>(CATALOGUE_ORDER);
const listeners = new Set<() => void>();

// useSyncExternalStore compares snapshots by reference, so this is replaced
// wholesale on every change and never mutated in place.
let snapshot: QuoteCartSnapshot = SERVER_SNAPSHOT;

function parseStored(raw: string | null): readonly CartItemId[] {
  if (!raw) return EMPTY;

  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error(`${STORAGE_KEY} must hold a JSON array, received: ${raw.slice(0, 64)}`);
  }

  // Unknown ids are dropped rather than thrown on: the catalogue changed once
  // already (E used to mean training), so a stale cart is expected, not corrupt.
  return parsed.filter((id): id is CartItemId => typeof id === "string" && validIds.has(id));
}

function readStorage(): readonly CartItemId[] {
  try {
    return parseStored(window.localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    // A corrupt or hand-edited key must not take the page down with it, but it
    // should still be visible to anyone with the console open.
    console.error(`Discarding unreadable ${STORAGE_KEY} value:`, error);
    window.localStorage.removeItem(STORAGE_KEY);
    return EMPTY;
  }
}

function commit(selected: readonly CartItemId[]) {
  snapshot = { selected, hydrated: true };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  // Runs before hydration. Safe because useSyncExternalStore renders the server
  // snapshot during hydration and only then swaps to this one.
  snapshot = { selected: readStorage(), hydrated: true };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function addItem(id: CartItemId) {
  if (snapshot.selected.includes(id)) return;
  // Keep the cart in catalogue order so the summary never depends on click order.
  const next = CATALOGUE_ORDER.filter(
    (candidate) => candidate === id || snapshot.selected.includes(candidate),
  );
  commit(next);
}

export function removeItem(id: CartItemId) {
  commit(snapshot.selected.filter((entry) => entry !== id));
}

export function toggleItem(id: CartItemId) {
  if (snapshot.selected.includes(id)) {
    removeItem(id);
    return;
  }
  addItem(id);
}

export function clearItems() {
  commit(EMPTY);
}

/** Swaps the individually-selected modules for the package they add up to. */
export function switchToPackage() {
  commit(applyPackage(snapshot.selected));
}

export type QuoteCart = QuoteCartSnapshot & {
  has: (id: CartItemId) => boolean;
  add: typeof addItem;
  remove: typeof removeItem;
  toggle: typeof toggleItem;
  clear: typeof clearItems;
  switchToPackage: typeof switchToPackage;
  totals: CartTotals;
  offer: PackageOffer | null;
};

/**
 * Reads the quote cart. Backed by an external store rather than context, so
 * there is no provider to mount and no state to sync in an effect.
 */
export function useQuoteCart(): QuoteCart {
  const { selected, hydrated } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    selected,
    hydrated,
    has: (id: CartItemId) => selected.includes(id),
    add: addItem,
    remove: removeItem,
    toggle: toggleItem,
    clear: clearItems,
    switchToPackage,
    totals: totalsFor(selected),
    offer: packageOffer(selected),
  };
}
