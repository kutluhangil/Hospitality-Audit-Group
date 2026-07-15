import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type Variant = "accent" | "ghost" | "terminal";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl2 font-medium transition-colors duration-150";

const variants: Record<Variant, string> = {
  // --accent-strong rather than --accent: the brand terracotta cannot carry text at AA.
  accent: "bg-accent-strong text-accent-strong-ink hover:bg-accent-strong-hover",
  ghost: "border border-line text-ink hover:bg-bg-soft",
  // For use on the dark panels, where the page tokens would disappear.
  terminal: "border border-terminal-ink/25 text-terminal-ink hover:bg-terminal-ink/10",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
};

function classesFor(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

type CommonProps = { variant?: Variant; size?: Size; className?: string };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & { href: string };

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, "className"> & { href?: undefined };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

/** Renders a Next Link when given an href, a native button otherwise. */
export function Button({ variant = "accent", size = "md", className, ...props }: ButtonProps) {
  if (props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink;
    return <Link href={href} className={classesFor(variant, size, className)} {...rest} />;
  }

  const { type = "button", ...rest } = props as ButtonAsButton;
  return <button type={type} className={classesFor(variant, size, className)} {...rest} />;
}
