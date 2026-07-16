import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import {
  LegalLink,
  LegalList,
  LegalPage,
  LegalSection,
  legalTags,
} from "@/components/legal/LegalPage";
import { SellerIdentity } from "@/components/legal/SellerIdentity";
import { alternatesFor } from "@/i18n/metadata";
import type { LocaleParams } from "@/i18n/routing";
import { formatPrice } from "@/lib/cart-math";
import { recordTitleOf } from "@/lib/module-records";
import { CATALOGUE_ORDER, priceOf, VAT_RATE } from "@/lib/modules-data";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "preInfoPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/on-bilgilendirme", locale),
  };
}

/**
 * The tariff is derived from modules-data rather than retyped: a price that
 * disagrees with the module page is a pre-contractual misstatement, not a typo.
 *
 * Turkish names and Turkish formatting in both locales, deliberately. This is
 * the pre-sale form: it states the terms of a contract whose binding language is
 * Turkish, and the English rendering exists to be understood, not to be signed.
 * A tariff that named "Front Office" would name a line no contract of ours has.
 */
function priceRows(): readonly string[] {
  return CATALOGUE_ORDER.map(
    (id) => `${recordTitleOf(id)} — ${formatPrice(priceOf(id))}`,
  );
}

export default async function OnBilgilendirmePage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "preInfoPage" });
  const tSite = await getTranslations({ locale, namespace: "site" });
  const tModules = await getTranslations({ locale, namespace: "modules" });

  const tags = {
    ...legalTags,
    // Bound as a value too, since several sentences read "<mail>{email}</mail>"
    // — the tag renders the link, the placeholder fills the visible address.
    email: siteConfig.contact.email,
    mail: (chunks: React.ReactNode) => (
      <LegalLink href={`mailto:${siteConfig.contact.email}`}>
        {chunks}
      </LegalLink>
    ),
  };

  return (
    <LegalPage title={t("title")} updated="2026-07-16">
      <LegalSection title={t("s1.title")}>
        <p>{t.rich("s1.p1", { ...tags, url: siteConfig.url })}</p>
        <p>{t.rich("s1.p2", tags)}</p>
      </LegalSection>

      <LegalSection title={t("s2.title")}>
        <SellerIdentity locale={locale} />
      </LegalSection>

      <LegalSection title={t("s3.title")}>
        <LegalList items={t.raw("characteristics") as readonly string[]} />
        <p>{t.rich("s3.p1", tags)}</p>
      </LegalSection>

      <LegalSection title={t("s4.title")}>
        <p>
          {t.rich("s4.p1", {
            ...tags,
            vat: VAT_RATE * 100,
            pricingNote: tModules("pricingNote"),
          })}
        </p>
        <p>{t("s4.p2")}</p>
        <LegalList items={priceRows()} />
        <p>{t.rich("s4.p3", { ...tags, scaleNote: tModules("scaleNote") })}</p>
        <p>{t("s4.p4")}</p>
      </LegalSection>

      <LegalSection title={t("s5.title")}>
        <p>{t("s5.p1")}</p>
        <LegalList items={t.raw("s5.items") as readonly string[]} />
      </LegalSection>

      <LegalSection title={t("s6.title")}>
        <p>{t.rich("s6.p1", tags)}</p>
        <p>{t.rich("s6.p2", tags)}</p>
        <p>{t.rich("s6.p3", tags)}</p>
        <p>{t.rich("s6.p4", tags)}</p>
      </LegalSection>

      <LegalSection title={t("s7.title")}>
        <p>
          {t.rich("s7.p1", {
            ...tags,
            email: siteConfig.contact.email,
            phone: siteConfig.contact.phone,
            hours: tSite("hours"),
          })}
        </p>
        <p>{t.rich("s7.p2", tags)}</p>
      </LegalSection>

      <LegalSection title={t("s8.title")}>
        <p>{t.rich("s8.p1", tags)}</p>
      </LegalSection>
    </LegalPage>
  );
}
