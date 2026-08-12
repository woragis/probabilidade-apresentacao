"use client";

import { useState } from "react";
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
