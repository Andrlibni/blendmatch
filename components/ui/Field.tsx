import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "mt-2 block w-full border-b border-ink/60 bg-transparent py-2.5 text-[0.95rem] transition-colors duration-200 focus:border-ink focus:outline-none aria-[invalid=true]:border-alert";

type Common = { label: string; error?: string; hint?: ReactNode; name: string };

function Wrapper({ label, error, hint, name, children }: Common & { children: ReactNode }) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-xs text-alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(name: string, error?: string, hint?: ReactNode) {
  return error ? `${name}-error` : hint ? `${name}-hint` : undefined;
}

export function TextField({ label, error, hint, name, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrapper label={label} error={error} hint={hint} name={name}>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={control}
        {...props}
      />
    </Wrapper>
  );
}

export function SelectField({
  label,
  error,
  hint,
  name,
  children,
  ...props
}: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <Wrapper label={label} error={error} hint={hint} name={name}>
      <select
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={`${control} cursor-pointer`}
        {...props}
      >
        {children}
      </select>
    </Wrapper>
  );
}

export function TextAreaField({ label, error, hint, name, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrapper label={label} error={error} hint={hint} name={name}>
      <textarea
        id={name}
        name={name}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(name, error, hint)}
        className={`${control} resize-y`}
        {...props}
      />
    </Wrapper>
  );
}

export function SubmitButton({ children, pending }: { children: ReactNode; pending?: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="eyebrow w-full bg-ink py-4 text-ivory transition-colors duration-300 hover:bg-wine disabled:opacity-50"
    >
      {children}
    </button>
  );
}
