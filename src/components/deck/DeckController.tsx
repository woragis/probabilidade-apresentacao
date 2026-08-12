"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { AmbientParticles } from "@/components/deck/AmbientParticles";
import { ProgressBar } from "@/components/deck/ProgressBar";
import { useDeckStore } from "@/lib/deck-store";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { SLIDES } from "@/slides";

export function DeckController() {
  const searchParams = useSearchParams();
  const index = useDeckStore((s) => s.index);
  const setIndex = useDeckStore((s) => s.setIndex);
  const setTotal = useDeckStore((s) => s.setTotal);
  const next = useDeckStore((s) => s.next);
  const prev = useDeckStore((s) => s.prev);
  const goHome = useDeckStore((s) => s.goHome);
  const goEnd = useDeckStore((s) => s.goEnd);
  const reduced = usePrefersReducedMotion();
  const synced = useRef(false);

  useEffect(() => {
    setTotal(SLIDES.length);
  }, [setTotal]);

  useEffect(() => {
    if (synced.current) return;
    const raw = searchParams.get("s");
    if (raw != null) {
      const n = Number(raw);
      if (Number.isFinite(n)) {
        const idx = n >= 1 && n <= SLIDES.length ? n - 1 : n;
        setIndex(idx);
      }
    }
    synced.current = true;
  }, [searchParams, setIndex]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("s", String(index + 1));
    window.history.replaceState(null, "", url.toString());
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowRight":
        case "PageDown":
        case " ":
        case "Spacebar":
          e.preventDefault();
          next();
          break;
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          goHome();
          break;
        case "End":
          e.preventDefault();
          goEnd();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, goHome, goEnd]);

  const slide = SLIDES[index]!;
  const Slide = slide.Component;

  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-ink text-cream">
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 4%, rgba(95,168,211,0.1), transparent 45%), radial-gradient(ellipse at 88% 80%, rgba(217,164,65,0.08), transparent 40%), linear-gradient(160deg, #05070b 0%, #0a0f17 54%, #070b11 100%)",
          transform: reduced ? undefined : `translateY(${(index % 4) * -1.5}px)`,
          transition: reduced ? undefined : "transform 600ms ease",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {slide.section === "abertura" ? <AmbientParticles /> : null}

      <ProgressBar index={index} total={SLIDES.length} slide={slide} />

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="absolute inset-0"
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Slide />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
