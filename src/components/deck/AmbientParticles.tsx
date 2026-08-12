"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Props = {
  count?: number;
  className?: string;
};

export function AmbientParticles({ count = 18, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const size = 2 + (i % 3);
        const duration = 22 + (i % 7) * 4;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-amber/30"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
            }}
            animate={{
              y: [0, -24, 0],
              opacity: [0.15, 0.45, 0.15],
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        );
      })}
    </div>
  );
}
