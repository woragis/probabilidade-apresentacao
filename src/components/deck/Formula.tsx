"use client";

import katex from "katex";
import { useMemo } from "react";
import "katex/dist/katex.min.css";

type Props = {
  tex: string;
  display?: boolean;
  className?: string;
};

export function Formula({ tex, display = false, className = "" }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        throwOnError: false,
        displayMode: display,
        strict: "ignore",
      });
    } catch {
      return tex;
    }
  }, [tex, display]);

  return (
    <span
      className={`katex-wrap text-[1.05em] text-cream/95 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
