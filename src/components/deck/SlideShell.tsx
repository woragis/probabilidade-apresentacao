"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Props = {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
  wide?: boolean;
};

export function SlideShell({
  eyebrow,
  title,
  children,
  className = "",
  wide = false,
}: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className={`relative z-10 flex h-full w-full flex-col justify-center px-10 py-16 md:px-20 ${className}`}
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className={`mx-auto w-full ${wide ? "max-w-6xl" : "max-w-5xl"}`}>
        {eyebrow ? (
          <p className="mb-4 text-[11px] font-medium tracking-[0.24em] text-text-subtle uppercase">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h2 className="font-display mb-8 text-3xl leading-[1.08] text-cream md:text-5xl">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </motion.div>
  );
}
