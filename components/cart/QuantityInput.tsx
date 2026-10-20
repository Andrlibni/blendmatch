"use client";

type Props = {
  value: number;
  step: number;
  min: number;
  onChange: (value: number) => void;
  label: string;
  compact?: boolean;
};

export function QuantityInput({ value, step, min, onChange, label, compact }: Props) {
  const h = compact ? "h-10" : "h-full min-h-12";
  const snap = (n: number) => Math.max(min, Math.round(n / step) * step);
  return (
    <div className={`inline-flex items-stretch border border-ink ${h}`} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        aria-label={`− ${step}`}
        className="w-10 text-lg transition-colors hover:bg-ivory-deep disabled:opacity-30"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        step={step}
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10);
          if (Number.isFinite(n)) onChange(n);
        }}
        onBlur={() => onChange(snap(value))}
        className="w-12 [appearance:textfield] bg-transparent text-center text-sm tabular-nums [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(value + step)}
        aria-label={`+ ${step}`}
        className="w-10 text-lg transition-colors hover:bg-ivory-deep"
      >
        +
      </button>
    </div>
  );
}
