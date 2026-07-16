/**
 * The seam between validation logic and validation copy.
 *
 * The schemas (`lib/quote-schema.ts`, and later the billing schema) stay unaware
 * of language: each failed rule returns a copy-free descriptor — a stable `code`
 * plus any `params` the sentence needs. Every string lives in messages/*.json
 * under `forms.validation`, exactly like the rest of the site.
 *
 * Both sides resolve a descriptor the same way. next-intl's `useTranslations`
 * (client) and `getTranslations` (server) each hand back a `(key, values) =>
 * string` scoped to a namespace; that shape is `Translate` below. The reader sees
 * the message in their own language on the form; the route, which re-validates as
 * a defensive guard, resolves the same descriptors in the source language.
 */

export type FieldError = {
  code: string;
  /** Interpolated into the template, e.g. `{max}`, `{value}`, `{invalid}`. */
  params?: Record<string, string | number>;
};

/** The call shape both next-intl translators share, once scoped to a namespace. */
export type Translate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

/**
 * Resolves one descriptor to its sentence. `label`, supplied only when the
 * template carries `{label}`, is the field's own localized label — the very
 * string the form already renders above the input, so the two never drift.
 */
export function resolveFieldError(
  t: Translate,
  error: FieldError,
  label?: string,
): string {
  const values =
    label === undefined ? error.params : { label, ...error.params };
  return t(error.code, values);
}
