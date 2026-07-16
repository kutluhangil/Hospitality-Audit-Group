import { describe, expect, it } from "vitest";

import {
  applyPackage,
  coveredByPackage,
  isRedundant,
  packageOffer,
  totalsFor,
} from "@/lib/cart-math";
import { VAT_RATE, priceOf } from "@/lib/modules-data";

describe("totalsFor", () => {
  it("treats list prices as VAT-inclusive", () => {
    const { total, net, vat } = totalsFor(["A"]);
    expect(total).toBe(15_000);
    expect(net + vat).toBe(total);
  });

  it("derives VAT from the gross total, not per line", () => {
    // Four lines at 15.000 each. Splitting per line and summing is what drifts;
    // this pins the total to the prices the buyer actually read.
    const { total, net, vat } = totalsFor(["A", "B", "C", "E"]);
    expect(total).toBe(60_000);
    expect(net).toBe(Math.round(60_000 / (1 + VAT_RATE)));
    expect(net + vat).toBe(60_000);
  });

  it("never lets the split disagree with the total, for any subset", () => {
    const ids = ["A", "B", "C", "E", "D", "EGITIM"] as const;
    // Every possible cart: the split must always reconstruct the gross exactly.
    for (let mask = 0; mask < 1 << ids.length; mask += 1) {
      const items = ids.filter((_, index) => mask & (1 << index));
      const { total, net, vat } = totalsFor(items);
      expect(net + vat).toBe(total);
      expect(total).toBe(items.reduce((sum, id) => sum + priceOf(id), 0));
    }
  });

  it("is zero for an empty cart", () => {
    expect(totalsFor([])).toEqual({ total: 0, net: 0, vat: 0 });
  });
});

describe("packageOffer", () => {
  it("offers D once every module it covers is selected", () => {
    const offer = packageOffer(["A", "B", "C", "E"]);
    expect(offer).not.toBeNull();
    expect(offer?.separateTotal).toBe(60_000);
    expect(offer?.packageTotal).toBe(50_000);
    expect(offer?.saving).toBe(10_000);
  });

  it("stays quiet until the set is complete", () => {
    expect(packageOffer(["A", "B", "C"])).toBeNull();
    expect(packageOffer(["A"])).toBeNull();
    expect(packageOffer([])).toBeNull();
  });

  it("stays quiet when D is already in the cart", () => {
    expect(packageOffer(["D"])).toBeNull();
    expect(packageOffer(["A", "B", "C", "E", "D"])).toBeNull();
  });

  it("ignores training when deciding — it is not part of the package", () => {
    expect(packageOffer(["A", "B", "C", "E", "EGITIM"])).not.toBeNull();
  });
});

describe("applyPackage", () => {
  it("swaps the covered modules for D", () => {
    expect(applyPackage(["A", "B", "C", "E"])).toEqual(["D"]);
  });

  it("keeps training, which D does not cover", () => {
    expect(applyPackage(["A", "B", "C", "E", "EGITIM"])).toEqual([
      "EGITIM",
      "D",
    ]);
  });

  it("is idempotent", () => {
    const once = applyPackage(["A", "B", "C", "E"]);
    expect(applyPackage(once)).toEqual(once);
  });

  it("costs the buyer less than what it replaced", () => {
    const before = totalsFor(["A", "B", "C", "E"]).total;
    const after = totalsFor(applyPackage(["A", "B", "C", "E"])).total;
    expect(after).toBeLessThan(before);
    expect(before - after).toBe(10_000);
  });
});

describe("redundancy", () => {
  it("marks the covered modules once D is in the cart", () => {
    expect(coveredByPackage(["D"])).toEqual(["A", "B", "C", "E"]);
    expect(isRedundant("A", ["D"])).toBe(true);
    expect(isRedundant("B", ["D"])).toBe(true);
  });

  it("leaves training sellable alongside D", () => {
    expect(isRedundant("EGITIM", ["D"])).toBe(false);
  });

  it("marks nothing when D is absent", () => {
    expect(coveredByPackage(["A", "B"])).toEqual([]);
    expect(isRedundant("A", ["A", "B"])).toBe(false);
  });
});
