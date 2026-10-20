"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="eyebrow no-print border border-ink px-5 py-3 transition-colors duration-300 hover:bg-ink hover:text-ivory"
    >
      {label}
    </button>
  );
}
