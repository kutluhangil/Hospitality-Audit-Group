import { Check } from "lucide-react";

export type ProcessStepData = {
  /** Mono ordinal — the sequence is real, so the number is earned. */
  number: string;
  name: string;
  summary: string;
  detail: readonly string[];
};

type ProcessStepProps = {
  step: ProcessStepData;
};

export function ProcessStep({ step }: ProcessStepProps) {
  return (
    <article className="grid gap-6 border-t border-line py-10 md:grid-cols-[10rem_1fr] md:gap-10">
      <p className="font-mono text-3xl tracking-tight text-accent-strong md:text-4xl">
        {step.number}
      </p>
      <div>
        {/* h2: each step is a top-level section of the process page, not a subsection. */}
        <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-ink">
          {step.name}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">
          {step.summary}
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {step.detail.map((line) => (
            <li
              key={line}
              className="flex gap-3 text-sm leading-relaxed text-ink-muted"
            >
              <Check
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-accent"
              />
              {line}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
