type EyebrowProps = {
  children: React.ReactNode;
  className?: string;
  /** Muted reads as a data label rather than a section opener. */
  tone?: "accent" | "muted";
};

export function Eyebrow({ children, className, tone = "accent" }: EyebrowProps) {
  const color = tone === "accent" ? "text-accent-strong" : "text-ink-muted";
  return (
    <p
      className={["font-mono text-xs uppercase tracking-[0.2em]", color, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}
