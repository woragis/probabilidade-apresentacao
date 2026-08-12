"use client";

import { useMemo, useState } from "react";
import { Formula } from "@/components/deck/Formula";
import { SliderControl } from "@/components/deck/Controls";
import { MediaBackdrop } from "@/components/deck/MediaBackdrop";
import { NumberTicker } from "@/components/deck/NumberTicker";
import { SlideShell } from "@/components/deck/SlideShell";
import {
  log10InversePerft,
  naiveUniformSequences,
  pathProbabilityFromBranching,
  PERFT_INITIAL,
  perftSequences,
  SAMPLE_BRANCHING_PATH,
} from "@/lib/math";

export function ChessHookSlide() {
  return (
    <div className="relative h-full w-full">
      <MediaBackdrop src="/media/chess/pieces.jpg" opacity={0.3} />
      <SlideShell eyebrow="Xadrez" title="Qual a chance da mesma partida?">
        <p className="font-mono text-6xl text-amber md:text-8xl">minúscula</p>
        <div className="mt-10 grid max-w-sm grid-cols-8 gap-0.5 opacity-80">
          {Array.from({ length: 64 }).map((_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const dark = (row + col) % 2 === 1;
            return (
              <div
                key={i}
                className={`aspect-square ${dark ? "bg-teal/40" : "bg-cream/15"}`}
              />
            );
          })}
        </div>
      </SlideShell>
    </div>
  );
}

export function ChessTrapSlide() {
  const [n, setN] = useState(5);
  const naive = naiveUniformSequences(n);

  return (
    <SlideShell eyebrow="Armadilha" title="20ⁿ superestima o tabuleiro">
      <div onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl label="profundidade n" value={n} min={1} max={8} onChange={setN} />
      </div>
      <p className="mt-6 font-mono text-3xl text-amber">
        20<sup>{n}</sup> ≈ <NumberTicker value={naive} digits={0} scientific />
      </p>
    </SlideShell>
  );
}

export function ChessPerftSlide() {
  const rows = Object.entries(PERFT_INITIAL)
    .map(([d, v]) => ({ d: Number(d), v }))
    .sort((a, b) => a.d - b.d);

  return (
    <SlideShell eyebrow="Perft" title="O real: Perft por profundidade">
      <div className="overflow-x-auto">
        <table className="w-full max-w-lg text-left text-sm">
          <thead className="text-cream/40">
            <tr>
              <th className="py-2 pr-6">Profundidade</th>
              <th>Folhas (Perft)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.d} className="border-t border-white/10">
                <td className="py-2 font-mono text-teal">{r.d}</td>
                <td className="font-mono text-cream">
                  {r.v.toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm text-text-subtle">Fonte: perft canônico da posição inicial.</p>
    </SlideShell>
  );
}

export function ChessStateSlide() {
  const [ply, setPly] = useState(0);
  const b = SAMPLE_BRANCHING_PATH[ply]!;

  return (
    <SlideShell eyebrow="Estado" title="B(Sₜ) muda a cada lance">
      <Formula display tex={String.raw`P(m_t\mid S_t)=\dfrac{1}{B(S_t)}`} />
      <div className="mt-6 max-w-md" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="Lance t"
          value={ply}
          min={0}
          max={SAMPLE_BRANCHING_PATH.length - 1}
          onChange={setPly}
        />
      </div>
      <p className="mt-6 font-display text-4xl text-amber">
        B(S<sub>{ply}</sub>) = {b}
      </p>
    </SlideShell>
  );
}

export function ChessProductSlide() {
  const p = pathProbabilityFromBranching(SAMPLE_BRANCHING_PATH);
  const log10 = -Math.log10(p);

  return (
    <SlideShell eyebrow="Produto" title="Produto das escolhas locais">
      <Formula
        display
        tex={String.raw`P(\text{partida})=\prod_{t=1}^{n}\dfrac{1}{B(S_t)}`}
      />
      <p className="mt-4 font-mono text-2xl text-teal">
        P ≈ {p.toExponential(4)}
      </p>
      <p className="mt-2 text-sm text-cream/45">
        Ordem de magnitude: ~10<sup>−{log10.toFixed(1)}</sup>
      </p>
    </SlideShell>
  );
}

export function ChessMarkovSlide() {
  return (
    <SlideShell eyebrow="Markov" title="Xadrez como estados">
      <div className="flex flex-wrap items-center gap-3 text-cream/80">
        {["S₀", "S₁", "S₂", "S₃", "…"].map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className="rounded-full border border-teal/40 px-4 py-2 font-mono text-teal">
              {s}
            </div>
            {i < 4 ? <span className="text-cream/30">→</span> : null}
          </div>
        ))}
      </div>
      <Formula
        display
        className="mt-8 block"
        tex={String.raw`P(S_{t+1}=j\mid S_t=i)=p_{ij}`}
      />
      <p className="mt-4 max-w-2xl text-text-subtle">Cada posição gera um próximo estado provável.</p>
    </SlideShell>
  );
}

export function ChessSimulatorSlide() {
  const [depth, setDepth] = useState(4);
  const naive = naiveUniformSequences(depth);
  const perft = perftSequences(depth);
  const logInv = log10InversePerft(depth);

  const comparison = useMemo(() => {
    if (perft == null) return null;
    return naive / perft;
  }, [naive, perft]);

  return (
    <SlideShell eyebrow="Simulator" title="Ingênuo vs real" wide>
      <div onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl label="Profundidade" value={depth} min={1} max={7} onChange={setDepth} />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <div className="rounded border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-text-subtle">20ⁿ</p>
          <p className="font-mono text-lg text-cream/80">
            {naive.toExponential(3)}
          </p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-text-subtle">Perft</p>
          <p className="font-mono text-lg text-amber">
            {perft?.toLocaleString("pt-BR") ?? "—"}
          </p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-text-subtle">razão</p>
          <p className="font-mono text-lg text-teal">
            {comparison?.toFixed(2) ?? "—"}×
          </p>
        </div>
      </div>
      {logInv != null ? (
        <p className="mt-6 text-sm text-cream/50">
          log₁₀(Perft) ≈ {logInv.toFixed(2)} — ordem de magnitude do espaço de
          sequências.
        </p>
      ) : null}
    </SlideShell>
  );
}
