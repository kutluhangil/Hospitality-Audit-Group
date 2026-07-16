import { Minus, Plus } from "lucide-react";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqProps = {
  items: readonly FaqItem[];
};

/**
 * Native <details>/<summary> only: the disclosure works with the keyboard and
 * before hydration, so no JavaScript is spent on it. The marker swaps rather
 * than rotating — the animation budget (blueprint 10) has no room for it.
 */
export function Faq({ items }: FaqProps) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-lg transition-colors duration-150 hover:text-accent-strong md:text-xl [&::-webkit-details-marker]:hidden">
            {item.question}
            <Plus
              aria-hidden
              className="size-5 shrink-0 text-accent group-open:hidden"
            />
            <Minus
              aria-hidden
              className="hidden size-5 shrink-0 text-accent group-open:block"
            />
          </summary>
          <p className="max-w-2xl pb-6 text-sm leading-relaxed text-ink-muted md:text-base">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
