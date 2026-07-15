const TRUST_ITEMS = [
  "KVKK %100 UYUM",
  "KARŞILIKLI NDA",
  "YÖNETİM KURULUNA HAZIR SWOT RAPORU",
  "SEKTÖR KIDEMLİ DENETÇİLER",
] as const;

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-bg-soft">
      <div className="mx-auto max-w-content px-6 py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted sm:text-xs">
          {TRUST_ITEMS.map((item, index) => (
            <li key={item} className="flex items-center gap-x-4">
              {/* The separator is decoration; the list itself carries the semantics. */}
              {index > 0 ? (
                <span aria-hidden="true" className="text-accent">
                  ·
                </span>
              ) : null}
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
