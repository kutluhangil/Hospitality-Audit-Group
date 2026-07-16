import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { company, hasCorporateIdentity } from "@/lib/company-data";

/**
 * Renders nothing until every identifier is real.
 *
 * Unlike the founding narrative, none of this is stood in for. A ticaret sicil,
 * MERSİS or vergi number is a state registry ID that ends up on an invoice and
 * in a distance-selling contract; a plausible-looking invented one is not
 * marketing copy, it is a false record. So the block waits.
 *
 * The same gate guards the payment path — an e-commerce seller must publish
 * this identity before it can take a card.
 */
export function CorporateIdentity() {
  const t = useTranslations("aboutPage.registry");

  if (!hasCorporateIdentity()) return null;

  // The identifiers themselves are registry values and never translated; only
  // the term naming each one is.
  const rows = [
    { term: t("tradeName"), value: company.ticaretUnvani },
    { term: t("registryNo"), value: company.ticaretSicilNo },
    { term: t("mersis"), value: company.mersisNo },
    { term: t("taxOffice"), value: company.vergiDairesi },
    { term: t("taxNo"), value: company.vergiNo },
    { term: t("address"), value: company.merkezAdres },
    { term: t("kep"), value: company.kepAdresi },
    { term: t("etbis"), value: company.etbisNo },
  ].filter((row) => row.value);

  return (
    <Reveal>
      <Card tone="soft" className="md:p-8">
        <Eyebrow tone="muted">{t("eyebrow")}</Eyebrow>
        <h2 className="mt-3 font-serif text-2xl">{t("title")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
          {t("description")}
        </p>
        <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.term}>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-ink-muted">
                {row.term}
              </dt>
              <dd className="mt-1 font-mono text-sm text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </Reveal>
  );
}
