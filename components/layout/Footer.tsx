import { useTranslations } from "next-intl";


import { Logo } from "@/components/ui/Logo";
import { Link } from "@/i18n/navigation";
import { footerNav, siteConfig, type NavLink } from "@/lib/site-config";

const headingClasses = "font-serif text-sm font-semibold text-ink";
const linkClasses =
  "text-sm text-ink-muted transition-colors duration-150 hover:text-ink";

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly NavLink[];
}) {
  const t = useTranslations("nav");

  return (
    <div>
      <h2 className={headingClasses}>{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClasses}>
              {t(link.labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tSite = useTranslations("site");

  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/biz-kimiz" className="group">
              <h2 className={`${headingClasses} transition-colors group-hover:text-ink-muted`}>
                {tNav("aboutUs")}
              </h2>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {tSite("description")}
            </p>
          </div>

          <FooterColumn title={t("services")} links={footerNav.hizmetler} />
          <FooterColumn title={t("corporate")} links={footerNav.kurumsal} />

          <div>
            <h2 className={headingClasses}>{t("contact")}</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className={linkClasses}
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.contact.phoneHref}`}
                  className={linkClasses}
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="text-sm text-ink-muted">{tSite("hours")}</li>
            </ul>
          </div>
        </div>

        {/* Contract texts sit in the legal strip rather than a fifth column: they
            are reference material, not navigation, and distance-selling rules
            only require them to be reachable from every page — which the footer
            is. Wraps to as many lines as the viewport needs. */}
        <div className="mt-16 border-t border-line pt-10">
          <nav aria-label={t("legalNav")} className="mb-12">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
              {footerNav.hukuki.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {tNav(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <p className="font-mono text-xs tracking-wide text-ink-muted">
              {t("copyright")}
            </p>
            <p className="max-w-sm text-xs text-ink-muted">
              {tSite("tagline")}
            </p>
            <Link href="/">
              <Logo size={64} className="mt-2" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
