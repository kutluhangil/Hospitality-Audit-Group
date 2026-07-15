import Link from "next/link";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/ui/Logo";
import { footerNav, siteConfig, type NavLink } from "@/lib/site-config";

const headingClasses = "font-serif text-sm font-semibold text-ink";
const linkClasses = "text-sm text-ink-muted transition-colors duration-150 hover:text-ink";

function FooterColumn({ title, links }: { title: string; links: readonly NavLink[] }) {
  return (
    <div>
      <h2 className={headingClasses}>{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={linkClasses}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-soft">
      <div className="mx-auto max-w-content px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-3 text-ink">
              <Logo size={40} />
              <span className="font-serif text-lg font-semibold">{siteConfig.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-muted">{siteConfig.tagline}</p>
          </div>

          <FooterColumn title="Hizmetler" links={footerNav.hizmetler} />
          <FooterColumn title="Kurumsal" links={footerNav.kurumsal} />

          <div>
            <h2 className={headingClasses}>İletişim</h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className={linkClasses}>
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.contact.phoneHref}`} className={linkClasses}>
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="text-sm text-ink-muted">{siteConfig.contact.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 border-t border-line pt-6">
          <p className="font-mono text-xs tracking-wide text-ink-muted">
            HOSPITALITY AUDIT GROUP © 2026
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
