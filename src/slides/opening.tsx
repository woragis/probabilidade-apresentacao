"use client";

import { motion } from "framer-motion";
import { AmbientParticles } from "@/components/deck/AmbientParticles";
import { SlideShell } from "@/components/deck/SlideShell";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

export function TitleSlide() {
  const reduced = usePrefersReducedMotion();
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(45,212,191,0.12),transparent_50%),radial-gradient(ellipse_at_80%_70%,rgba(245,158,11,0.1),transparent_45%)]" />
      <AmbientParticles count={24} />
      <SlideShell>
        <motion.p
          className="mb-4 text-sm tracking-[0.3em] text-teal-muted uppercase"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Probabilidade · UFPB
        </motion.p>
        <h1 className="font-display text-5xl leading-[1.05] text-cream md:text-7xl">
          Quão improvável
          <br />
          <span className="text-amber">é o acaso?</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-cream/65 md:text-xl">
          Uma exploração interativa de probabilidades do cotidiano, jogos e
          inferência — do dado ao teorema de Bayes.
        </p>
        <p className="mt-10 text-xs tracking-wide text-cream/35">
          → ou Espaço para avançar
        </p>
      </SlideShell>
    </div>
  );
}

export function PromiseSlide() {
  const worlds = [
    { title: "Dados", desc: "Espaço amostral clássico" },
    { title: "Encontros", desc: "Fluxo, binomial, Poisson" },
    { title: "Xadrez", desc: "Estado, Perft, Markov" },
    { title: "War", desc: "Cadeias e Monte Carlo" },
  ];
  return (
    <SlideShell eyebrow="Promessa" title="Quatro mundos, uma pergunta">
      <div className="grid gap-4 sm:grid-cols-2">
        {worlds.map((w, i) => (
          <motion.div
            key={w.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            className="border border-white/10 bg-white/[0.03] px-6 py-5"
          >
            <p className="font-display text-2xl text-amber">{w.title}</p>
            <p className="mt-2 text-sm text-cream/60">{w.desc}</p>
          </motion.div>
        ))}
      </div>
      <p className="mt-10 text-cream/55">
        Empilhar condições transforma o “banal” em astronomicamente raro — e
        ainda assim, com população e tempo grandes, o raro acontece.
      </p>
    </SlideShell>
  );
}

export function RoadmapSlide() {
  const steps = [
    "Fundamentos",
    "Encontros",
    "Cães & Bayes",
    "Xadrez",
    "War",
    "Síntese",
  ];
  return (
    <SlideShell eyebrow="Roteiro" title="Mapa da apresentação">
      <ol className="relative space-y-0">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-5 py-3">
            <span className="font-mono text-sm text-teal">{String(i + 1).padStart(2, "0")}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
            <span className="font-display text-xl text-cream md:text-2xl">{s}</span>
          </li>
        ))}
      </ol>
    </SlideShell>
  );
}
