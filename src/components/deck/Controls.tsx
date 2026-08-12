"use client";

import type { ReactNode } from "react";
import { Hint } from "@/components/deck/Hint";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: { title?: string; body: string; side?: "bottom" | "right" };
};

export function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (v) => String(v),
  hint,
}: Props) {
  return (
    <label className="block space-y-2">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-cream/70">
          {hint ? (
            <Hint title={hint.title ?? label} body={hint.body} side={hint.side}>
              {label}
            </Hint>
          ) : (
            label
          )}
        </span>
        <span className="font-mono text-amber">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={(e) => e.stopPropagation()}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-teal"
      />
    </label>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onKeyDown={(e) => e.stopPropagation()}
      className="rounded-md bg-teal px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-teal-bright disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
