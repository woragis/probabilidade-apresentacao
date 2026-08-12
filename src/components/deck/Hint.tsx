"use client";

import type { ReactNode } from "react";

type Props = {
  /** Short name shown at the top of the popover */
  title: string;
  /** Full explanation — keep it spoken-language, not just a formula */
  body: string;
  children: ReactNode;
  /** Prefer opening to the side on dense left columns */
  side?: "bottom" | "right";
  className?: string;
};

/**
 * Hover/focus glossary chip. Visible underline so the projector audience
 * (and the speaker) can tell the label is documented.
 */
export function Hint({ title, body, children, side = "bottom", className = "" }: Props) {
  const panelPos =
    side === "right"
      ? "left-full top-0 ml-3 w-72"
      : "left-0 top-full mt-2 w-72 sm:w-80";

  return (
    <span className={`group/hint relative inline-flex max-w-full items-center ${className}`}>
      <span
        tabIndex={0}
        className="cursor-help decoration-cream/35 underline decoration-dotted decoration-from-font underline-offset-4 outline-none"
      >
        {children}
      </span>
      <span
        role="tooltip"
        className={`pointer-events-none invisible absolute z-50 rounded-md border border-white/15 bg-ink-elevated p-3 text-left opacity-0 shadow-xl shadow-black/50 transition duration-150 group-hover/hint:visible group-hover/hint:opacity-100 group-focus-within/hint:visible group-focus-within/hint:opacity-100 ${panelPos}`}
      >
        <span className="block font-mono text-[10px] tracking-[0.16em] text-teal uppercase">
          {title}
        </span>
        <span className="mt-1.5 block text-[13px] leading-snug font-normal text-cream/85 normal-case tracking-normal">
          {body}
        </span>
      </span>
    </span>
  );
}
