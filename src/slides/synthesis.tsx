"use client";

import { SlideShell } from "@/components/deck/SlideShell";
import { useDeckStore } from "@/lib/deck-store";
import { SECTION_LABELS, type SlideSection } from "@/slides/types";

const LADDER = [
  "Probabilidade clássica",
  "Combinatória",
  "Condicional + Bayes",
  "Variáveis aleatórias",
  "Binomial / Poisson",
  "Monte Carlo",
  "Intervalo de confiança",
  "Cadeias de Markov",
];

export function LadderSlide() {
  return (
    <SlideShell eyebrow="Síntese" title="Escada matemática">
      <ol className="space-y-3">
        {LADDER.map((item, i) => (
          <li key={item} className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-teal">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-xl text-cream md:text-2xl">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </SlideShell>
  );
}

export function ImprobableSlide() {
  return (
    <SlideShell eyebrow="Síntese" title="Improvável ≠ impossível">
      <p className="font-mono text-5xl text-amber md:text-7xl">10⁻⁶</p>
      <p className="mt-6 max-w-2xl text-2xl text-cream/80">
        Em milhões de tentativas, o raro aparece.
      </p>
    </SlideShell>
  );
}

export function LimitsSlide() {
  return (
    <SlideShell eyebrow="Limites" title="O que o modelo não é">
      <ul className="max-w-2xl space-y-4 text-lg text-cream/80">
        <li>Parâmetro editável ≠ medição empírica.</li>
        <li>População da cidade ≠ denominador do encontro no calçadão.</li>
        <li>
          <span className="text-amber">P(raça | fatal)</span> ≠{" "}
          <span className="text-teal">P(fatal | raça)</span>.
        </li>
      </ul>
    </SlideShell>
  );
}

const JUMPS: { section: SlideSection; index: number; label: string }[] = [
  { section: "encontros", index: 11, label: SECTION_LABELS.encontros },
  { section: "caes", index: 19, label: SECTION_LABELS.caes },
  { section: "xadrez", index: 28, label: SECTION_LABELS.xadrez },
  { section: "war", index: 33, label: SECTION_LABELS.war },
];

export function DemoQaSlide() {
  const setIndex = useDeckStore((s) => s.setIndex);

  return (
    <SlideShell eyebrow="Q&A" title="Demo livre">
      <p className="mb-6 text-text-subtle">Atalhos de seção.</p>
      <div className="flex flex-wrap gap-3">
        {JUMPS.map((j) => (
          <button
            key={j.section}
            type="button"
            onClick={() => setIndex(j.index)}
            onKeyDown={(e) => e.stopPropagation()}
            className="rounded border border-white/20 px-4 py-2 text-sm text-cream/80 transition hover:border-teal hover:text-teal"
          >
            {j.label}
          </button>
        ))}
      </div>
    </SlideShell>
  );
}

export function CreditsSlide() {
  return (
    <SlideShell eyebrow="Fontes" title="Referências">
      <ul className="max-w-2xl space-y-3 text-sm text-text-subtle">
        <li>Perft (xadrez): valores canônicos da posição inicial.</li>
        <li>
          Populações urbanas: figuras censitárias de referência (contexto; não
          denominador de encontro).
        </li>
        <li>
          Fatalidades caninas por raça: compilação DogsBite.org / CDC (EUA, ~15
          anos) — interpretada via Bayes.
        </li>
        <li>War/Risk: regras clássicas de combate com dados.</li>
        <li>Apresentação: Next.js · TypeScript · KaTeX · Recharts.</li>
      </ul>
      <p className="font-display mt-12 text-3xl text-amber">Obrigado.</p>
    </SlideShell>
  );
}

export function ThanksSlide() {
  return (
    <SlideShell>
      <p className="text-sm tracking-[0.25em] text-text-subtle uppercase">
        Fim
      </p>
      <h2 className="font-display mt-4 text-5xl text-cream md:text-6xl">
        Quão improvável
        <br />
        <span className="text-amber">é o acaso?</span>
      </h2>
      <p className="mt-8 text-text-subtle">Perguntas · replay dos simulators</p>
    </SlideShell>
  );
}
