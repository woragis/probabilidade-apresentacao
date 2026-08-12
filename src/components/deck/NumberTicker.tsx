"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

type Props = {
  value: number;
  digits?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  scientific?: boolean;
};

export function NumberTicker({
  value,
  digits = 4,
  className = "",
  prefix = "",
  suffix = "",
  scientific = false,
}: Props) {
  const spring = useSpring(value, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => {
    if (scientific && (v !== 0 && (Math.abs(v) < 1e-4 || Math.abs(v) >= 1e6))) {
      return prefix + v.toExponential(digits) + suffix;
    }
    if (Number.isInteger(value) && digits === 0) {
      return prefix + Math.round(v).toLocaleString("pt-BR") + suffix;
    }
    return (
      prefix +
      v.toLocaleString("pt-BR", {
        minimumFractionDigits: Math.min(digits, 6),
        maximumFractionDigits: digits,
      }) +
      suffix
    );
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={className}>{display}</motion.span>;
}
