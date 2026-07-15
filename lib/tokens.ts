/**
 * Colour values that TypeScript needs to know about — theme metadata, canvas
 * drawing, and anything that cannot read a CSS variable. Everything rendered by
 * a component should use the Tailwind tokens from globals.css instead.
 */
export const colors = {
  accent: "#D97757",
  accentStrong: { light: "#B04E2C", dark: "#E28A6D" },
  brass: { light: "#A98A44", dark: "#C8A55C" },
  ok: { light: "#4C8A67", dark: "#6FB08D" },
  bg: { light: "#FAF9F5", dark: "#1F1E1D" },
  ink: { light: "#141413", dark: "#F5F4EF" },
} as const;

export type ThemeName = "light" | "dark";
