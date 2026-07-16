import { describe, expect, it } from "vitest";

import {
  billingTotals,
  createOrderReference,
  isValidTcKimlikNo,
  isValidVergiNo,
  validateBillingRequest,
  type BillingField,
} from "@/lib/billing-schema";
import { priceOf } from "@/lib/modules-data";
import type { FieldError } from "@/lib/validation-messages";

/**
 * Both of these satisfy the real checksum — derived from the algorithm, not
 * copied from a person. 10000000078: odd=1, even=0, d10=(1*7-0)%10=7, d11=(1+7)%10=8.
 */
const VALID_TCKN = "10000000078";
const OTHER_VALID_TCKN = "12345678950";

const VALID_ADDRESS = {
  ulke: "Türkiye",
  il: "İstanbul",
  ilce: "Beşiktaş",
  acikAdres: "Barbaros Bulvarı No 1 Daire 4",
  postaKodu: "34353",
};

const CORPORATE_INPUT = {
  faturaTipi: "kurumsal",
  ticaretUnvani: "Örnek Turizm A.Ş.",
  vergiDairesi: "Beşiktaş",
  vergiNo: "1234567890",
  adres: VALID_ADDRESS,
  email: "muhasebe@ornek.com",
  telefon: "+90 212 000 00 00",
  selectedItems: ["A", "B"],
  mesafeliSatisOnay: true,
  onBilgilendirmeOnay: true,
  kvkkConsent: true,
};

const INDIVIDUAL_INPUT = {
  faturaTipi: "bireysel",
  adSoyad: "Ayşe Yılmaz",
  tcKimlikNo: VALID_TCKN,
  adres: VALID_ADDRESS,
  email: "ayse@ornek.com",
  telefon: "05001112233",
  selectedItems: ["A"],
  mesafeliSatisOnay: true,
  onBilgilendirmeOnay: true,
  kvkkConsent: true,
};

/** Builds a payload with one key genuinely absent, rather than set to undefined. */
function without<T extends object, K extends keyof T>(
  source: T,
  key: K,
): Omit<T, K> {
  const copy = { ...source };
  delete copy[key];
  return copy;
}

/** Reads the error for one field, failing loudly if validation unexpectedly passed. */
function errorFor(input: unknown, field: BillingField): FieldError | undefined {
  const result = validateBillingRequest(input);
  if (result.ok) {
    throw new Error(
      `Expected validation to fail on "${field}", but it passed.`,
    );
  }
  return result.errors[field];
}

describe("isValidTcKimlikNo", () => {
  it("accepts numbers that satisfy both check digits", () => {
    expect(isValidTcKimlikNo(VALID_TCKN)).toBe(true);
    expect(isValidTcKimlikNo(OTHER_VALID_TCKN)).toBe(true);
  });

  it("rejects a wrong tenth digit", () => {
    // 10000000078 with d10 moved off its computed value of 7.
    expect(isValidTcKimlikNo("10000000018")).toBe(false);
    expect(isValidTcKimlikNo("10000000098")).toBe(false);
  });

  it("rejects a wrong eleventh digit", () => {
    // d10 stays correct at 7; only the trailing sum digit is off.
    expect(isValidTcKimlikNo("10000000071")).toBe(false);
    expect(isValidTcKimlikNo("10000000079")).toBe(false);
  });

  it("catches every single-digit typo in a valid number", () => {
    // This is the whole reason the checksum is here rather than a length check.
    for (let position = 0; position < VALID_TCKN.length; position += 1) {
      for (let digit = 0; digit <= 9; digit += 1) {
        const typo = `${VALID_TCKN.slice(0, position)}${digit}${VALID_TCKN.slice(position + 1)}`;
        if (typo === VALID_TCKN) continue;
        expect(isValidTcKimlikNo(typo)).toBe(false);
      }
    }
  });

  it("catches adjacent transpositions", () => {
    expect(isValidTcKimlikNo("12345678950")).toBe(true);
    // Swap the 4 and the 5 in the middle.
    expect(
      isValidTcKimlikNo(
        "12345678950".slice(0, 3) + "54" + "12345678950".slice(5),
      ),
    ).toBe(false);
  });

  it("rejects a leading zero", () => {
    expect(isValidTcKimlikNo("01234567890")).toBe(false);
  });

  it("rejects anything that is not 11 digits", () => {
    expect(isValidTcKimlikNo("")).toBe(false);
    expect(isValidTcKimlikNo("1000000007")).toBe(false); // 10
    expect(isValidTcKimlikNo("100000000788")).toBe(false); // 12
    expect(isValidTcKimlikNo("1000000007a")).toBe(false);
    expect(isValidTcKimlikNo("10000000 78")).toBe(false);
  });
});

describe("isValidVergiNo", () => {
  it("accepts exactly 10 digits", () => {
    expect(isValidVergiNo("1234567890")).toBe(true);
    expect(isValidVergiNo("0000000000")).toBe(true);
  });

  it("rejects any other length", () => {
    expect(isValidVergiNo("123456789")).toBe(false);
    expect(isValidVergiNo("12345678901")).toBe(false);
    expect(isValidVergiNo("")).toBe(false);
  });

  it("rejects non-digits", () => {
    expect(isValidVergiNo("12345 6789")).toBe(false);
    expect(isValidVergiNo("123456789a")).toBe(false);
  });
});

describe("validateBillingRequest — invoice type", () => {
  it("accepts a complete corporate payload", () => {
    const result = validateBillingRequest(CORPORATE_INPUT);
    expect(result.ok).toBe(true);
  });

  it("accepts a complete individual payload", () => {
    const result = validateBillingRequest(INDIVIDUAL_INPUT);
    expect(result.ok).toBe(true);
  });

  it("rejects an unknown invoice type by name", () => {
    const error = errorFor(
      { ...CORPORATE_INPUT, faturaTipi: "vakif" },
      "faturaTipi",
    );
    expect(error?.code).toBe("unknownInvoiceType");
    expect(String(error?.params?.type)).toContain("vakif");
  });

  it("does not let a corporate payload smuggle in a TC kimlik instead of a vergi no", () => {
    const payload = {
      ...without(CORPORATE_INPUT, "vergiNo"),
      tcKimlikNo: VALID_TCKN,
    };
    expect(errorFor(payload, "vergiNo")).toBeDefined();
  });

  it("requires the vergi no to be 10 digits, and says how many were sent", () => {
    expect(
      errorFor({ ...CORPORATE_INPUT, vergiNo: "123456789" }, "vergiNo"),
    ).toMatchObject({ code: "vergiNoInvalid", params: { count: 9 } });
    expect(
      errorFor({ ...CORPORATE_INPUT, vergiNo: "12345678901" }, "vergiNo"),
    ).toMatchObject({ code: "vergiNoInvalid", params: { count: 11 } });
  });

  it("runs the TC kimlik checksum, not just its length", () => {
    // 11 digits, so a length check would wave this through and put it on an invoice.
    const error = errorFor(
      { ...INDIVIDUAL_INPUT, tcKimlikNo: "12345678901" },
      "tcKimlikNo",
    );
    expect(error?.code).toBe("tcKimlikNoInvalid");
  });

  it("requires ticaret unvanı and vergi dairesi for a corporate invoice", () => {
    expect(
      errorFor({ ...CORPORATE_INPUT, ticaretUnvani: "  " }, "ticaretUnvani"),
    ).toBeDefined();
    expect(
      errorFor({ ...CORPORATE_INPUT, vergiDairesi: "" }, "vergiDairesi"),
    ).toBeDefined();
  });
});

describe("validateBillingRequest — address and contact", () => {
  it("requires every address part", () => {
    for (const field of ["ulke", "il", "ilce", "acikAdres"] as const) {
      const adres = { ...VALID_ADDRESS, [field]: "" };
      expect(errorFor({ ...CORPORATE_INPUT, adres }, field)).toBeDefined();
    }
  });

  it("requires a 5-digit posta kodu", () => {
    const bad = {
      ...CORPORATE_INPUT,
      adres: { ...VALID_ADDRESS, postaKodu: "343" },
    };
    expect(errorFor(bad, "postaKodu")).toBeDefined();
  });

  it("rejects a missing address object outright rather than inventing one", () => {
    expect(
      errorFor(without(CORPORATE_INPUT, "adres"), "acikAdres"),
    ).toBeDefined();
  });

  it("requires a plausible e-mail and a telephone", () => {
    expect(
      errorFor({ ...CORPORATE_INPUT, email: "muhasebe" }, "email"),
    ).toBeDefined();
    // Unlike the quote form, the phone is mandatory: an invoice needs a reachable buyer.
    expect(
      errorFor({ ...CORPORATE_INPUT, telefon: "" }, "telefon"),
    ).toBeDefined();
  });
});

describe("validateBillingRequest — consents", () => {
  const consents = [
    "mesafeliSatisOnay",
    "onBilgilendirmeOnay",
    "kvkkConsent",
  ] as const;

  it("blocks payment when any single consent is missing", () => {
    for (const consent of consents) {
      expect(
        errorFor({ ...CORPORATE_INPUT, [consent]: false }, consent),
      ).toBeDefined();
      expect(
        errorFor({ ...CORPORATE_INPUT, [consent]: undefined }, consent),
      ).toBeDefined();
    }
  });

  it("names the specific consent that is missing", () => {
    expect(
      errorFor(
        { ...CORPORATE_INPUT, mesafeliSatisOnay: false },
        "mesafeliSatisOnay",
      )?.code,
    ).toBe("consentMesafeli");
    expect(
      errorFor(
        { ...CORPORATE_INPUT, onBilgilendirmeOnay: false },
        "onBilgilendirmeOnay",
      )?.code,
    ).toBe("consentOnBilgilendirme");
    expect(
      errorFor({ ...CORPORATE_INPUT, kvkkConsent: false }, "kvkkConsent")?.code,
    ).toBe("consentBillingKvkk");
  });

  it("accepts only a literal true — not a truthy value", () => {
    // "on" is what an unguarded HTML checkbox would send. It is not consent.
    expect(
      errorFor({ ...CORPORATE_INPUT, kvkkConsent: "on" }, "kvkkConsent"),
    ).toBeDefined();
    expect(
      errorFor({ ...CORPORATE_INPUT, kvkkConsent: 1 }, "kvkkConsent"),
    ).toBeDefined();
  });
});

describe("validateBillingRequest — basket", () => {
  it("refuses an empty basket", () => {
    expect(
      errorFor({ ...CORPORATE_INPUT, selectedItems: [] }, "selectedItems"),
    ).toBeDefined();
  });

  it("refuses unknown item codes and names them", () => {
    const error = errorFor(
      { ...CORPORATE_INPUT, selectedItems: ["A", "Z"] },
      "selectedItems",
    );
    expect(error?.code).toBe("itemsInvalid");
    expect(String(error?.params?.invalid)).toContain("Z");
  });

  it("refuses to bill a module the 360° package already covers", () => {
    const error = errorFor(
      { ...CORPORATE_INPUT, selectedItems: ["D", "A"] },
      "selectedItems",
    );
    expect(error?.code).toBe("itemsRedundant");
    expect(String(error?.params?.redundant)).toContain("A");
  });

  it("still sells training alongside the package — it is not covered", () => {
    const result = validateBillingRequest({
      ...CORPORATE_INPUT,
      selectedItems: ["D", "EGITIM"],
    });
    expect(result.ok).toBe(true);
  });

  it("normalises duplicates and click order into catalogue order", () => {
    const result = validateBillingRequest({
      ...CORPORATE_INPUT,
      selectedItems: ["B", "A", "A"],
    });
    if (!result.ok) throw new Error("Expected a valid payload");
    expect(result.value.selectedItems).toEqual(["A", "B"]);
  });
});

describe("the server recomputes the total", () => {
  it("has nowhere for a client-sent price to land", () => {
    const result = validateBillingRequest({
      ...CORPORATE_INPUT,
      selectedItems: ["A", "B"],
      // Everything a tampering buyer might try. None of it is part of the contract.
      total: 1,
      price: 1,
      paidPrice: 1,
      amount: 1,
      net: 1,
      vat: 1,
    });

    if (!result.ok) throw new Error("Expected a valid payload");

    // The validated value carries the basket and nothing resembling a price.
    expect(result.value).not.toHaveProperty("total");
    expect(result.value).not.toHaveProperty("price");
    expect(result.value).not.toHaveProperty("paidPrice");
    expect(result.value).not.toHaveProperty("amount");
  });

  it("prices the basket from the catalogue, ignoring anything the client claimed", () => {
    const result = validateBillingRequest({
      ...CORPORATE_INPUT,
      selectedItems: ["A", "B"],
      total: 1,
    });
    if (!result.ok) throw new Error("Expected a valid payload");

    const totals = billingTotals(result.value.selectedItems);
    expect(totals.total).toBe(priceOf("A") + priceOf("B"));
    expect(totals.total).toBe(30_000);
    expect(totals.net + totals.vat).toBe(totals.total);
  });

  it("charges the package price for D, not the sum of what D contains", () => {
    const result = validateBillingRequest({
      ...CORPORATE_INPUT,
      selectedItems: ["D"],
    });
    if (!result.ok) throw new Error("Expected a valid payload");
    expect(billingTotals(result.value.selectedItems).total).toBe(50_000);
  });

  it("gives the same answer for the same basket every time", () => {
    // The total is a function of the catalogue alone; nothing about the buyer moves it.
    const first = validateBillingRequest({
      ...CORPORATE_INPUT,
      selectedItems: ["A", "B"],
    });
    const second = validateBillingRequest({
      ...INDIVIDUAL_INPUT,
      selectedItems: ["B", "A"],
    });
    if (!first.ok || !second.ok) throw new Error("Expected valid payloads");

    expect(billingTotals(first.value.selectedItems)).toEqual(
      billingTotals(second.value.selectedItems),
    );
  });
});

describe("createOrderReference", () => {
  it("is prefixed and unique across a burst", () => {
    const references = new Set(
      Array.from({ length: 500 }, createOrderReference),
    );
    expect(references.size).toBe(500);
    for (const reference of references) {
      expect(reference.startsWith("SIP-")).toBe(true);
    }
  });
});
