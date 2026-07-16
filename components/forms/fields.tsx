import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

import { HONEYPOT_FIELD } from "@/lib/quote-schema";

/**
 * Field primitives shared by QuoteForm and ContactForm. Each one owns the
 * label/error/aria wiring so no form can forget a piece of it.
 */

const labelClasses =
  "block font-mono text-xs uppercase tracking-[0.2em] text-ink-muted";

const controlBase =
  "mt-2 w-full rounded-xl2 border bg-surface px-4 py-3 text-sm text-ink " +
  "placeholder:text-ink-muted transition-colors duration-150";

/** An invalid field is outlined in accent; the message under it carries the meaning. */
function controlClasses(hasError: boolean): string {
  return `${controlBase} ${hasError ? "border-accent" : "border-line"}`;
}

function errorId(id: string): string {
  return `${id}-error`;
}

function describedBy(id: string, hasError: boolean): string | undefined {
  return hasError ? errorId(id) : undefined;
}

type FieldShellProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

function FieldShell({ id, label, required, error, children }: FieldShellProps) {
  return (
    <div>
      <label htmlFor={id} className={labelClasses}>
        {label}
        {/* The `required` attribute already announces this; the mark is for sighted users. */}
        {required ? (
          <span aria-hidden="true" className="text-accent-strong">
            {" *"}
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={errorId(id)} className="mt-2 text-sm text-accent-strong">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  id: string;
  label: string;
  error?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "className">;

export function TextField({
  id,
  label,
  error,
  required,
  ...props
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <input
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(error))}
        className={controlClasses(Boolean(error))}
        {...props}
      />
    </FieldShell>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  error?: string;
  /**
   * `value` is what the server accepts and what lands on the record, so it is
   * never translated; `label` is what the reader sees, so it always is.
   */
  options: readonly { value: string; label: string }[];
  /** Rendered as the empty first option, since these selects are optional. */
  placeholder: string;
} & Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "id" | "className" | "children"
>;

export function SelectField({
  id,
  label,
  error,
  options,
  placeholder,
  required,
  ...props
}: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <select
        id={id}
        name={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(error))}
        className={controlClasses(Boolean(error))}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

type TextareaFieldProps = {
  id: string;
  label: string;
  error?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "className">;

export function TextareaField({
  id,
  label,
  error,
  required,
  rows = 5,
  ...props
}: TextareaFieldProps) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, Boolean(error))}
        className={`${controlClasses(Boolean(error))} resize-y`}
        {...props}
      />
    </FieldShell>
  );
}

type CheckboxFieldProps = {
  id: string;
  error?: string;
  /** Free-form so the KVKK label can carry its link. */
  children: ReactNode;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "className" | "type" | "children"
>;

export function CheckboxField({
  id,
  error,
  children,
  required,
  ...props
}: CheckboxFieldProps) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, Boolean(error))}
          className="mt-1 h-4 w-4 shrink-0 rounded border-line accent-accent-strong"
          {...props}
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-ink-muted">
          {children}
        </label>
      </div>
      {error ? (
        <p id={errorId(id)} className="mt-2 text-sm text-accent-strong">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type HoneypotFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
};

/**
 * Bait for form-filling bots. `sr-only` hides it visually, `aria-hidden` hides it
 * from assistive tech and tabIndex -1 keeps it off the keyboard path, so only a
 * script that reads the DOM will ever fill it in.
 */
export function HoneypotField({ value, onValueChange }: HoneypotFieldProps) {
  return (
    <div className="sr-only" aria-hidden="true">
      <label htmlFor={HONEYPOT_FIELD}>Web sitesi</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </div>
  );
}

type FormErrorProps = { message: string };

/** Server-side failure, shown above the submit button. */
export function FormError({ message }: FormErrorProps) {
  return (
    <p
      role="alert"
      className="rounded-xl2 border border-accent bg-bg-soft p-4 text-sm text-ink"
    >
      {message}
    </p>
  );
}
