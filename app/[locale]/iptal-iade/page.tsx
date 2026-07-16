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
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { alternatesFor } from "@/i18n/metadata";
import type { LocaleParams } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<LocaleParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cancellationPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor("/iptal-iade", locale),
  };
}

export default async function IptalIadePage({
  params,
}: {
  params: Promise<LocaleParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "cancellationPage" });
  const tSite = await getTranslations({ locale, namespace: "site" });

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
    <LegalPage title={t("title")} updated="2026-07-16" illustrationSrc="/images/iptal-iade-ill.png">
      <LegalSection title={t("s1.title")}>
        <p>{t.rich("s1.p1", { ...tags, url: siteConfig.url })}</p>
        <p>{t("s1.p2")}</p>
      </LegalSection>

      <LegalSection title={t("s2.title")}>
        <p>{t.rich("s2.p1", tags)}</p>
        <p>{t.rich("s2.p2", tags)}</p>
      </LegalSection>

      <LegalSection title={t("s3.title")}>
        <Card tone="accent" className="border-2">
          <Eyebrow>{t("s3.draftEyebrow")}</Eyebrow>
          <p className="mt-3 text-base leading-relaxed text-ink">
            {t.rich("s3.draftBody", tags)}
          </p>
        </Card>
        <LegalList items={t.raw("ladder") as readonly string[]} />
        <p>{t("s3.p1")}</p>
      </LegalSection>

      <LegalSection title={t("s4.title")}>
        <p>{t.rich("s4.p1", tags)}</p>
        <p>{t("s4.p2")}</p>
        <p>{t("s4.p3")}</p>
      </LegalSection>

      <LegalSection title={t("s5.title")}>
        <p>{t.rich("s5.p1", tags)}</p>
        <p>{t("s5.p2")}</p>
      </LegalSection>

      <LegalSection title={t("s6.title")}>
        <p>{t.rich("s6.p1", tags)}</p>
        <LegalList items={t.raw("s6.items") as readonly string[]} />
      </LegalSection>

      <LegalSection title={t("s7.title")}>
        <p>{t("s7.p1")}</p>
        <LegalList items={t.raw("forceMajeure") as readonly string[]} />
        <p>{t("s7.p2")}</p>
        <p>{t("s7.p3")}</p>
      </LegalSection>

      <LegalSection title={t("s8.title")}>
        <SellerIdentity locale={locale} />
        <p>
          {t.rich("s8.p1", {
            ...tags,
            email: siteConfig.contact.email,
            phone: siteConfig.contact.phone,
            hours: tSite("hours"),
          })}
        </p>
      </LegalSection>
    </LegalPage>
  );
}
