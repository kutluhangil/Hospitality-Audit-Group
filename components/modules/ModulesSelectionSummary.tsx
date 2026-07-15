"use client";

import { CartLines, CartTotals } from "@/components/modules/CartLines";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useQuoteCart } from "@/lib/quote-cart";

export function ModulesSelectionSummary() {
  const { selected, hydrated } = useQuoteCart();

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
    <>
      <CartLines />
      <CartTotals />
    </>
  );

  return (
    <Card tone="soft" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-2xl">Seçiminiz</h2>
        {hydrated && selected.length > 0 ? (
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
            {selected.length} KALEM
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
