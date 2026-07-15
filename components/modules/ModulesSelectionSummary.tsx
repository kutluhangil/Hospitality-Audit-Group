"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useQuoteCart } from "@/lib/quote-cart";
import { getModule } from "@/lib/modules-data";

export function ModulesSelectionSummary() {
  const { selected, remove, hydrated } = useQuoteCart();

  const body = !hydrated ? (
    // Neutral placeholder: the real selection is unknown during server render, and
    // an empty-state message here would flash the wrong answer to returning users.
    <p className="text-sm text-ink-muted">Seçiminiz yükleniyor…</p>
  ) : selected.length === 0 ? (
    <p className="text-sm text-ink-muted">
      Henüz modül seçmediniz. Yukarıdaki kartlardan dilediğiniz modülleri ekleyebilir ya da genel bir
      görüşme talebiyle ilerleyebilirsiniz.
    </p>
  ) : (
    <ul className="flex flex-col gap-2">
      {selected.map((code) => {
        const entry = getModule(code);
        if (!entry) return null;

        return (
          <li
            key={code}
            className="flex items-center justify-between gap-4 rounded-xl2 border border-line px-4 py-3"
          >
            <span className="flex items-baseline gap-3 text-sm">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
                {entry.code}
              </span>
              {entry.title}
            </span>
            <button
              type="button"
              onClick={() => remove(code)}
              className="shrink-0 text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
              aria-label={`${entry.title} modülünü seçimden çıkar`}
            >
              Çıkar
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <Card tone="soft" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-2xl">Seçiminiz</h2>
        {hydrated && selected.length > 0 ? (
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            {selected.length} MODÜL
          </span>
        ) : null}
      </div>

      {body}

      <div>
        <Button href="/teklif" size="lg">
          Teklif Formuna Geç →
        </Button>
      </div>
    </Card>
  );
}
