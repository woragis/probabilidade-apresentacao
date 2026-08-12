"use client";

import { SECTION_LABELS, type SlideDef } from "@/slides/types";

type Props = {
  index: number;
  total: number;
  slide: SlideDef;
};

export function ProgressBar({ index, total, slide }: Props) {
  const pct = total > 0 ? ((index + 1) / total) * 100 : 0;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50">
      <div className="h-[3px] w-full bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-teal to-amber transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex items-center justify-between px-5 py-3 text-[11px] tracking-wide text-cream/45">
        <span>{SECTION_LABELS[slide.section]}</span>
        <span>
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}
