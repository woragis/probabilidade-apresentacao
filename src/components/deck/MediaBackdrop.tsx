"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

type Props = {
  src: string;
  alt?: string;
  opacity?: number;
  className?: string;
};

export function MediaBackdrop({
  src,
  alt = "",
  opacity = 0.28,
  className = "",
}: Props) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
      animate={
        reduced
          ? undefined
          : { scale: [1, 1.04, 1], x: [0, 8, 0], y: [0, -6, 0] }
      }
      transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{ opacity }}
        sizes="100vw"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/40" />
    </motion.div>
  );
}
