import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

import {
  LegalLink,
  LegalList,
  LegalPage,
  LegalSection,
  legalTags,
} from "@/components/legal/LegalPage";
import { alternatesFor } from "@/i18n/metadata";
import type { LocaleParams } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "kvkkPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/kvkk", locale),
  };
}

export default async function KvkkPage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "kvkkPage" });

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
    <LegalPage title={t("title")} updated="2026-07-15">
      <LegalSection title={t("s1.title")}>
        <p>{t.rich("s1.p1", { ...tags, name: siteConfig.name })}</p>
        <p>{t.rich("s1.p2", { ...tags, email: siteConfig.contact.email })}</p>
      </LegalSection>

      <LegalSection title={t("s2.title")}>
        <p>{t("s2.p1")}</p>
        <LegalList items={t.raw("collected") as readonly string[]} />
        <p>{t("s2.p2")}</p>
        <p>{t("s2.p3")}</p>
        <LegalList items={t.raw("billing") as readonly string[]} />
        <p>{t.rich("s2.p4", tags)}</p>
        <p>{t("s2.p5")}</p>
      </LegalSection>

      <LegalSection title={t("s3.title")}>
        <p>{t("s3.p1")}</p>
        <LegalList items={t.raw("purposes") as readonly string[]} />
        <p>{t("s3.p2")}</p>
      </LegalSection>

      <LegalSection title={t("s4.title")}>
        <p>{t("s4.p1")}</p>
      </LegalSection>

      <LegalSection title={t("s5.title")}>
        <p>{t("s5.p1")}</p>
      </LegalSection>

      <LegalSection title={t("s6.title")}>
        <p>{t("s6.p1")}</p>
        <LegalList items={t.raw("s6.items") as readonly string[]} />
        <p>{t("s6.p2")}</p>
      </LegalSection>

      <LegalSection title={t("s7.title")}>
        <p>{t("s7.p1")}</p>
        <LegalList items={t.raw("rights") as readonly string[]} />
      </LegalSection>

      <LegalSection title={t("s8.title")}>
        <p>{t.rich("s8.p1", { ...tags, email: siteConfig.contact.email })}</p>
      </LegalSection>
    </LegalPage>
  );
}
