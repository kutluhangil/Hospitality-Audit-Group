import { Card } from "@/components/ui/Card";

type DefinitionCardProps = {
  title: string;
  description: string;
  /** Mono label for cards that carry a code or an ordinal. */
  label?: string;
};

/** Title + prose pairing shared by the "what we measure", F&B and training grids. */
export function DefinitionCard({
  title,
  description,
  label,
}: DefinitionCardProps) {
  return (
    <Card as="article" className="h-full">
      {label ? (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
          {label}
        </p>
      ) : null}
      <h3
        className={["font-serif text-xl md:text-2xl", label ? "mt-3" : ""].join(
          " ",
        )}
      >
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
        {description}
      </p>
    </Card>
  );
}
