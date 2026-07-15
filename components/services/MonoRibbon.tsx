type MonoRibbonProps = {
  /** Pre-joined final copy; the separators are part of the approved string. */
  children: string;
  className?: string;
};

/** Mono = the evidence language of the brand (blueprint 2, principle 2). */
export function MonoRibbon({ children, className }: MonoRibbonProps) {
  return (
    <p
      className={[
        "rounded-xl2 border border-line bg-bg-soft px-6 py-5 text-center font-mono text-xs leading-relaxed tracking-[0.2em] text-ink-muted uppercase",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}
