import { Eyebrow } from "./Eyebrow";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  /** Centred suits full-width sections; left suits sections with adjacent content. */
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={[
        centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        className={[
          "font-serif text-3xl md:text-4xl",
          eyebrow ? "mt-3" : "",
        ].join(" ")}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
