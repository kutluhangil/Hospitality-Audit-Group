import { getTranslations } from "next-intl/server";

import { LegalList } from "@/components/legal/LegalPage";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { company, hasCorporateIdentity } from "@/lib/company-data";
import { siteConfig } from "@/lib/site-config";

/**
 * The seller block the distance-selling texts share — the contract, the pre-sale
 * form and the cancellation policy all name the same registered identity, and
 * all three used to carry their own copy of it. One component now, so the three
 * cannot drift.
 *
 * Every registry identifier is a state record that ends up on an invoice, so
 * none are invented: they are null in company-data until the real values exist,
 * and the notice says so out loud rather than printing a plausible fiction. The
 * label naming each field is translated; the value never is — a MERSİS number is
 * the same digits in every language.
 *
 * A server component (async): it reads translations with getTranslations, so it
 * can be dropped into the server-rendered legal pages without a client boundary.
 */
export async function SellerIdentity({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "seller" });

  const registryFields: readonly (readonly [string, string | null])[] = [
    [t("labelTradeName"), company.ticaretUnvani],
    [t("labelAddress"), company.merkezAdres],
    [t("labelRegistryNo"), company.ticaretSicilNo],
    [t("labelMersis"), company.mersisNo],
    [t("labelTaxOffice"), company.vergiDairesi],
    [t("labelTaxNo"), company.vergiNo],
  ];

  const known = registryFields
    .filter((field): field is readonly [string, string] => field[1] !== null)
    .map(([label, value]) => `${label}: ${value}`);

  // These exist today and are true regardless of the registry gap.
  const contact = [
    `${t("labelPhone")}: ${siteConfig.contact.phone}`,
    `${t("labelEmail")}: ${siteConfig.contact.email}`,
    `${t("labelWebsite")}: ${siteConfig.url}`,
  ];

  return (
    <>
      {known.length > 0 ? <LegalList items={known} /> : null}
      <LegalList items={contact} />
      {hasCorporateIdentity() ? null : (
        <Card tone="accent" className="border-2">
          <Eyebrow>{t("incompleteEyebrow")}</Eyebrow>
          <p className="mt-3 text-base leading-relaxed text-ink">
            {t("incompleteBody")}
          </p>
        </Card>
      )}
    </>
  );
}
