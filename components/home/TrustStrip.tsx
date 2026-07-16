import { useTranslations } from "next-intl";

export function TrustStrip() {
  const t = useTranslations("home.trust");
  // A list, so it is one message rather than four keys that could drift apart.
  // `raw` is what returns the array itself; `t` would stringify it.
  const items = t.raw("items") as readonly string[];

  return (
    <section className="border-y border-line bg-bg-soft">
      <div className="mx-auto max-w-content px-6 py-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted sm:text-xs">
          {items.map((item, index) => (
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
