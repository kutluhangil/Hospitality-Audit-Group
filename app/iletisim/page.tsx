import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Hospitality Audit Group ile iletişime geçin. Kurumsal e-posta, telefon ve çalışma saatleri.",
};

const linkClasses =
  "text-base text-ink underline underline-offset-4 transition-colors duration-150 hover:text-accent-strong";

/** The web address is shown without its scheme; the href keeps it. */
const displayUrl = siteConfig.url.replace(/^https?:\/\//, "");

export default function IletisimPage() {
  return (
    <main className="mx-auto max-w-content px-4 py-16 sm:px-6 md:py-24">
      <Reveal>
        <header className="max-w-2xl">
          <Eyebrow>İLETİŞİM</Eyebrow>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            Konuşalım.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
            Denetim kapsamınızı birlikte netleştirelim. Tüm görüşmeler karşılıklı gizlilik
            taahhüdü altında yürütülür.
          </p>
        </header>
      </Reveal>

      <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16">
        <Reveal>
          {/* No map and no street address: the brand's promise is discretion. */}
          <dl className="space-y-8">
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">WEB</dt>
              <dd className="mt-2">
                <a href={siteConfig.url} className={linkClasses}>
                  {displayUrl}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                E-POSTA
              </dt>
              <dd className="mt-2">
                <a href={`mailto:${siteConfig.contact.email}`} className={linkClasses}>
                  {siteConfig.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                TELEFON
              </dt>
              <dd className="mt-2">
                <a href={`tel:${siteConfig.contact.phoneHref}`} className={linkClasses}>
                  {siteConfig.contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                ÇALIŞMA SAATLERİ
              </dt>
              <dd className="mt-2 text-base text-ink">{siteConfig.contact.hours}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </main>
  );
}
