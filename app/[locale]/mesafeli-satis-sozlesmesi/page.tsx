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
import { VAT_RATE } from "@/lib/modules-data";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contractPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/mesafeli-satis-sozlesmesi", locale),
  };
}

export default async function MesafeliSatisSozlesmesiPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contractPage" });

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
    <LegalPage title={t("title")} updated="2026-07-16" illustrationSrc="/images/mesafeli-satis-ill.png">
      <LegalSection title={t("s1.title")}>
        <p>{t("s1.p1")}</p>
        <p>
          <strong>{t("s1.seller")}</strong>
        </p>
        <SellerIdentity locale={locale} />
        <p>
          <strong>{t("s1.buyer")}</strong>
        </p>
        <p>{t("s1.buyerBody")}</p>
      </LegalSection>

      <LegalSection title={t("s2.title")}>
        <p>{t.rich("s2.p1", { ...tags, url: siteConfig.url })}</p>
        <p>{t("s2.p2")}</p>
      </LegalSection>

      <LegalSection title={t("s3.title")}>
        <p>{t.rich("s3.p1", tags)}</p>
        <p>{t.rich("s3.p2", { ...tags, vat: VAT_RATE * 100 })}</p>
        <p>{t.rich("s3.p3", tags)}</p>
      </LegalSection>

      <LegalSection title={t("s4.title")}>
        <LegalList items={t.raw("s4.items") as readonly string[]} />
        <p>{t("s4.p1")}</p>
      </LegalSection>

      <LegalSection title={t("s5.title")}>
        <p>{t("s5.p1")}</p>
        <LegalList items={t.raw("s5.items") as readonly string[]} />
        <p>{t("s5.p2")}</p>
      </LegalSection>

      <LegalSection title={t("s6.title")}>
        <p>{t("s6.p1")}</p>
        <LegalList items={t.raw("s6.items") as readonly string[]} />
      </LegalSection>

      <LegalSection title={t("s7.title")}>
        <p>{t("s7.p1")}</p>
        <p>{t.rich("s7.p2", tags)}</p>
        <p>{t.rich("s7.p3", tags)}</p>
        <p>{t.rich("s7.p4", tags)}</p>
        <p>{t.rich("s7.p5", tags)}</p>
        <p>{t.rich("s7.p6", tags)}</p>
      </LegalSection>

      <LegalSection title={t("s8.title")}>
        <p>{t.rich("s8.p1", tags)}</p>
        <p>{t("s8.p2")}</p>
      </LegalSection>

      <LegalSection title={t("s9.title")}>
        <p>{t.rich("s9.p1", tags)}</p>
        <p>{t.rich("s9.p2", tags)}</p>
      </LegalSection>

      <LegalSection title={t("s10.title")}>
        <p>{t("s10.p1")}</p>
      </LegalSection>
    </LegalPage>
  );
}
