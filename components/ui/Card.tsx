import type { ComponentPropsWithoutRef, ElementType } from "react";

type CardProps<T extends ElementType> = {
  as?: T;
  /** Accent draws the terracotta border used by the featured module. */
  tone?: "surface" | "soft" | "accent";
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

const tones = {
  surface: "bg-surface border-line",
  soft: "bg-bg-soft border-transparent",
  accent: "bg-surface border-accent",
} as const;

export function Card<T extends ElementType = "div">({
  as,
  tone = "surface",
  className,
  ...props
}: CardProps<T>) {
  const Component = (as ?? "div") as ElementType;
  return (
    <Component
      className={["rounded-xl2 border p-6", tones[tone], className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
