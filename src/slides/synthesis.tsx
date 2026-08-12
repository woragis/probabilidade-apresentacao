"use client";

import { SlideShell } from "@/components/deck/SlideShell";
import { useDeckStore } from "@/lib/deck-store";
import { SECTION_LABELS } from "@/slides/types";

const LADDER = [
  { name: "Probabilidade clássica", world: "dado" },
  { name: "Combinatória", world: "xadrez / War" },
  { name: "Condicional + Bayes", world: "cães" },
  { name: "Variáveis aleatórias", world: "orla" },
  { name: "Binomial / Poisson", world: "visitas" },
  { name: "Monte Carlo", world: "sorteio" },
  { name: "Intervalo de confiança", world: "incerteza" },
  { name: "Cadeias de Markov", world: "posição / tropas" },
];

export function LadderSlide() {
  return (
    <SlideShell eyebrow="Síntese" title="Escada matemática">
      <p className="mb-6 max-w-2xl text-text-subtle">
        Subimos de fração → processo → simulação. Cada degrau apareceu num mundo.
      </p>
      <ol className="space-y-3">
        {LADDER.map((item, i) => (
          <li key={item.name} className="flex items-baseline gap-4">
            <span className="font-mono text-sm text-teal">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-display text-xl text-cream md:text-2xl">
              {item.name}
            </span>
            <span className="text-sm text-cream/40">{item.world}</span>
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
      <p className="mt-4 max-w-2xl text-text-subtle">
        10⁻⁶ não é zero. E[X] = N p: orla, Perft, 10×5 — com N grande o esperado deixa
        de ser desprezível.
      </p>
    </SlideShell>
  );
}

export function LimitsSlide() {
  return (
    <SlideShell eyebrow="Limites" title="O que o modelo não é">
      <ul className="max-w-2xl space-y-4 text-lg text-cream/80">
        <li>Parâmetro editável ≠ medição empírica.</li>
        <li>
          Fluxo/hora ≠ população efetiva: 1.200/h na orla não são as mesmas 1.200
          pessoas toda hora.
        </li>
        <li>População da cidade ≠ denominador do encontro no calçadão.</li>
        <li>
          <span className="text-amber">P(raça | fatal)</span> ≠{" "}
          <span className="text-teal">P(fatal | raça)</span>.
        </li>
      </ul>
    </SlideShell>
  );
}

const JUMPS: { id: string; label: string }[] = [
  { id: "enc-sim", label: SECTION_LABELS.encontros },
  { id: "dogs-ethics", label: SECTION_LABELS.caes },
  { id: "markov-what", label: "Markov" },
  { id: "chess-hook", label: SECTION_LABELS.xadrez },
  { id: "war-hook", label: SECTION_LABELS.war },
];

export function DemoQaSlide() {
  const jumpToId = useDeckStore((s) => s.jumpToId);

  return (
    <SlideShell eyebrow="Q&A" title="Demo livre">
      <p className="mb-6 text-text-subtle">Atalhos de seção.</p>
      <div className="flex flex-wrap gap-3">
        {JUMPS.map((j) => (
          <button
            key={j.id}
            type="button"
            onClick={() => jumpToId(j.id)}
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
        <li>
          War (Grow): atacante e defensor até 3 dados; empate fica com a defesa.
          Risk clássico é 3v2 — não é o modelo daqui.
        </li>
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
