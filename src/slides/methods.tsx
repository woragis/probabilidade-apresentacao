"use client";

import { useMemo, useState } from "react";
import { Formula } from "@/components/deck/Formula";
import { PrimaryButton } from "@/components/deck/Controls";
import { SlideShell } from "@/components/deck/SlideShell";

const COLS = 20;
const ROWS = 8;
const CELLS = COLS * ROWS;

function sampleBernoulli(p: number): boolean {
  return Math.random() < p;
}

export function MonteCarloExplainerSlide() {
  const p = 0.2;
  const [cells, setCells] = useState<(boolean | null)[]>(() => Array(CELLS).fill(null));

  const done = cells.filter((c) => c !== null);
  const hits = done.filter(Boolean).length;
  const pHat = done.length > 0 ? hits / done.length : null;

  const batch = (size: number) => {
    setCells((prev) => {
      const next = [...prev];
      let filled = 0;
      for (let i = 0; i < CELLS && filled < size; i++) {
        if (next[i] == null) {
          next[i] = sampleBernoulli(p);
          filled++;
        }
      }
      return next;
    });
  };

  const reset = () => {
    setCells(Array(CELLS).fill(null));
  };

  return (
    <SlideShell eyebrow="Algoritmo" title="Não dá para contar tudo? Sorteia." wide>
      <p className="mb-5 max-w-3xl text-text-subtle">
        Monte Carlo = <span className="text-cream">repetir o acaso</span>. Cada célula é um
        sorteio. A fração de âmbar se aproxima da chance verdadeira. O próximo slide é isto, com
        N enorme.
      </p>
      <div className="grid gap-8 lg:grid-cols-[1fr_220px]">
        <div>
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {cells.map((hit, i) => (
              <div
                key={i}
                className={`aspect-square rounded-[2px] ${
                  hit == null
                    ? "bg-white/8"
                    : hit
                      ? "bg-amber"
                      : "bg-teal/35"
                }`}
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-cream/40">
            Âmbar = sucesso · teal = não · vazio = ainda não sorteado
          </p>
        </div>
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <p className="text-sm text-text-subtle">
            p verdadeiro = <span className="font-mono text-teal">{(p * 100).toFixed(0)}%</span>
          </p>
          <p className="font-mono text-4xl text-amber">
            {pHat != null ? `${(pHat * 100).toFixed(1)}%` : "—"}
          </p>
          <p className="text-sm text-text-subtle">
            p̂ = acertos / tentativas
          </p>
          <p className="text-xs text-cream/45">
            {done.length} / {CELLS} · {hits} acertos
          </p>
          <div className="flex flex-wrap gap-2">
            <PrimaryButton onClick={() => batch(20)}>Sortear 20</PrimaryButton>
            <PrimaryButton onClick={reset}>Limpar</PrimaryButton>
          </div>
        </div>
      </div>
      <p className="mt-4 font-mono text-sm text-cream/45">
        <Formula tex={String.raw`\hat p = \text{acertos}/\text{tentativas}`} />
      </p>
    </SlideShell>
  );
}

type Place = "casa" | "orla" | "faculdade";

const PLACES: { id: Place; label: string; x: number; y: number }[] = [
  { id: "casa", label: "Casa", x: 160, y: 36 },
  { id: "orla", label: "Orla", x: 48, y: 168 },
  { id: "faculdade", label: "Faculdade", x: 272, y: 168 },
];

/** Didactic daily location chain — tomorrow depends only on today. */
const TRANSITIONS: Record<Place, Record<Place, number>> = {
  casa: { casa: 0.55, orla: 0.3, faculdade: 0.15 },
  orla: { casa: 0.5, orla: 0.35, faculdade: 0.15 },
  faculdade: { casa: 0.25, orla: 0.15, faculdade: 0.6 },
};

function pickNext(from: Place): Place {
  const row = TRANSITIONS[from];
  const u = Math.random();
  let acc = 0;
  for (const to of Object.keys(row) as Place[]) {
    acc += row[to]!;
    if (u < acc) return to;
  }
  return from;
}

export function MarkovExplainerSlide() {
  const [here, setHere] = useState<Place>("casa");
  const [trail, setTrail] = useState<Place[]>(["casa"]);

  const step = () => {
    const next = pickNext(here);
    setHere(next);
    setTrail((t) => [...t, next].slice(-10));
  };

  const edges = useMemo(() => {
    const out: { from: Place; to: Place; p: number }[] = [];
    for (const from of Object.keys(TRANSITIONS) as Place[]) {
      for (const to of Object.keys(TRANSITIONS[from]) as Place[]) {
        const p = TRANSITIONS[from][to]!;
        if (p > 0) out.push({ from, to, p });
      }
    }
    return out;
  }, []);

  const pos = Object.fromEntries(PLACES.map((p) => [p.id, p])) as Record<
    Place,
    (typeof PLACES)[number]
  >;

  return (
    <SlideShell eyebrow="Markov" title="O amanhã só precisa de hoje" wide>
      <p className="mb-5 max-w-3xl text-text-subtle">
        Não precisa da lista da semana. Onde você está <span className="text-cream">agora</span>{" "}
        já diz as chances de amanhã. Clique “Amanhã”: só as setas que saem do círculo âmbar
        importam. A trilha é memória para nós — a máquina ignora.
      </p>
      <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
        <svg viewBox="0 0 320 210" className="h-56 w-full max-w-lg">
          {edges.map((e) => {
            const a = pos[e.from];
            const b = pos[e.to];
            const loop = e.from === e.to;
            const active = here === e.from;
            if (loop) {
              return (
                <g key={`${e.from}-${e.to}`}>
                  <path
                    d={`M ${a.x + 22} ${a.y - 8} C ${a.x + 48} ${a.y - 42}, ${a.x - 48} ${a.y - 42}, ${a.x - 22} ${a.y - 8}`}
                    fill="none"
                    stroke={active ? "rgba(217,164,65,0.85)" : "rgba(255,255,255,0.18)"}
                    strokeWidth={active ? 2 : 1}
                  />
                  <text
                    x={a.x}
                    y={a.y - 46}
                    textAnchor="middle"
                    fill="#d9a441"
                    fontSize="11"
                    fontFamily="ui-monospace, monospace"
                    opacity={active ? 1 : 0}
                  >
                    {e.p.toFixed(2)}
                  </text>
                </g>
              );
            }
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const len = Math.hypot(dx, dy) || 1;
            const ox = (-dy / len) * 8;
            const oy = (dx / len) * 8;
            const x1 = a.x + (dx / len) * 28 + ox;
            const y1 = a.y + (dy / len) * 28 + oy;
            const x2 = b.x - (dx / len) * 28 + ox;
            const y2 = b.y - (dy / len) * 28 + oy;
            return (
              <g key={`${e.from}-${e.to}`}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={active ? "rgba(95,168,211,0.9)" : "rgba(255,255,255,0.18)"}
                  strokeWidth={active ? 2 : 1}
                  markerEnd="url(#arrow)"
                />
                <text
                  x={(x1 + x2) / 2 + ox * 0.4}
                  y={(y1 + y2) / 2 + oy * 0.4}
                  textAnchor="middle"
                  fill="#b7c0cf"
                  fontSize="11"
                  fontFamily="ui-monospace, monospace"
                  opacity={active ? 1 : 0}
                >
                  {e.p.toFixed(2)}
                </text>
              </g>
            );
          })}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(95,168,211,0.9)" />
            </marker>
          </defs>
          {PLACES.map((p) => {
            const on = here === p.id;
            return (
              <g key={p.id}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={26}
                  fill={on ? "rgba(217,164,65,0.25)" : "rgba(14,19,28,0.9)"}
                  stroke={on ? "#d9a441" : "rgba(95,168,211,0.55)"}
                  strokeWidth={on ? 3 : 1.5}
                />
                <text
                  x={p.x}
                  y={p.y + 4}
                  textAnchor="middle"
                  fill="#f4f1e8"
                  fontSize="11"
                  fontFamily="Georgia, serif"
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <p className="text-sm text-text-subtle">Hoje você está em</p>
          <p className="font-display text-3xl text-amber">
            {PLACES.find((p) => p.id === here)?.label}
          </p>
          <PrimaryButton onClick={step}>Amanhã</PrimaryButton>
          <p className="font-mono text-[11px] leading-relaxed text-cream/40">
            {trail.map((s) => PLACES.find((p) => p.id === s)?.label?.[0]).join(" → ")}
          </p>
          <p className="text-sm text-text-subtle">
            Depois: xadrez = a posição agora. War = as tropas agora. Mesma máquina.
          </p>
        </div>
      </div>
      <p className="mt-4 font-mono text-sm text-cream/45">
        <Formula tex={String.raw`P(\text{amanhã}\mid\text{hoje, ontem},\ldots)=P(\text{amanhã}\mid\text{hoje})`} />
      </p>
    </SlideShell>
  );
}
