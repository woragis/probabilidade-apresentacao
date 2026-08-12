"use client";

import { useMemo, useState } from "react";
import { Formula } from "@/components/deck/Formula";
import { SliderControl } from "@/components/deck/Controls";
import { Hint } from "@/components/deck/Hint";
import { MediaBackdrop } from "@/components/deck/MediaBackdrop";
import { NumberTicker } from "@/components/deck/NumberTicker";
import { SlideShell } from "@/components/deck/SlideShell";
import {
  log10InversePerft,
  naivePathProbability,
  naiveUniformSequences,
  pathProbabilityFromBranching,
  PERFT_INITIAL,
  perftSequences,
  SAMPLE_BRANCHING_PATH,
  uniformOverLeavesProbability,
} from "@/lib/math";

const HINTS = {
  profundidade:
    "n = profundidade em plies (meio-lances). n = 1 são os 20 primeiros lances das brancas. n = 2 inclui a resposta das pretas. Não é “n lances completos” (um lance completo = 2 plies).",
  vinteN:
    "Modelo ingênuo: “sempre 20 lances legais”. Conta 20ⁿ sequências. Na abertura isso SUBESTIMA a árvore (Perft > 20ⁿ a partir de n = 3). Se você lê P = 1/20ⁿ, SUPERESTIMA a chance de um caminho específico.",
  pNaive:
    "1/20ⁿ: chance de uma linha fixa se cada lado sorteasse uniforme entre 20 lances, sempre. É o modelo da armadilha — simples, e errado no tamanho e na probabilidade.",
  perft:
    "Perft(n): número EXATO de sequências legais de n plies a partir da posição inicial. Contagem verificável (wiki de programação de xadrez / Stockfish). Inclui lances péssimos. Não é o número de Shannon (~10¹²⁰ jogos), nem “partidas que humanos jogariam”.",
  razao:
    "20ⁿ / Perft. Menor que 1 significa: o modelo de ramificação 20 subestima quantas linhas legais existem. A árvore real é maior; a chance uniforme de uma folha (1/Perft) é menor que 1/20ⁿ.",
  pPerft:
    "1/Perft: se você sorteasse uniforme entre todas as sequências legais de n plies. Ordem de grandeza pedagógica. O produto ∏ 1/B(S_t) ao longo de UM caminho é o modelo mais fiel ao “sorteio lance a lance”.",
  ply: "t: índice do meio-lance neste caminho ilustrativo. B(S_t) = quantos lances legais existem naquela posição — o fator de ramificação local.",
  branching:
    "B(S_t): lances legais na posição S_t. Abertura ~20; meio-jogo costuma subir (30+); finais caem. Este caminho é ilustrativo, não uma partida real gravada.",
  produto:
    "P desta trajetória se, em cada posição, o lance fosse sorteado uniforme entre os legais. É UM caminho, não “a probabilidade do xadrez”. Humano não sorteia: teoria de aberturas concentra massa em poucas linhas.",
  markov:
    "Nas regras, o conjunto de lances legais depende só do estado atual — não da história completa. Estado ≠ só as peças: roque, en passant, regra dos 50 lances também entram. Jogador real ainda escolhe com memória e teoria; o tabuleiro, não.",
} as const;

function fmtProb(p: number): string {
  return p.toExponential(3);
}

export function ChessHookSlide() {
  return (
    <div className="relative h-full w-full">
      <MediaBackdrop src="/media/chess/pieces.jpg" opacity={0.3} />
      <SlideShell eyebrow="Xadrez" title="Qual a chance da mesma partida?">
        <p className="font-mono text-5xl text-amber md:text-7xl">minúscula</p>
        <p className="mt-6 max-w-2xl text-lg text-text-subtle">
          Pergunta cravada: repetir <span className="text-cream">lance a lance</span> uma
          linha específica, se cada lado sorteasse um lance legal. Não é “duas pessoas
          jogarem a Siciliana”.
        </p>
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
  const pNaive = naivePathProbability(n);

  return (
    <SlideShell eyebrow="Armadilha" title="20ⁿ não é o tabuleiro">
      <p className="mb-6 max-w-2xl text-text-subtle">
        O modelo assume 20 lances legais em <span className="text-cream">todo</span> lance.
        Na abertura isso <span className="text-amber">subestima a árvore</span> e{" "}
        <span className="text-amber">superestima P(um caminho)</span>.
      </p>
      <div className="max-w-md" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="profundidade n"
          value={n}
          min={1}
          max={8}
          onChange={setN}
          hint={{ title: "profundidade n", body: HINTS.profundidade }}
        />
      </div>
      <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
        <div className="rounded border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-text-subtle uppercase">
            <Hint title="20ⁿ" body={HINTS.vinteN}>
              sequências (20ⁿ)
            </Hint>
          </p>
          <p className="mt-2 font-mono text-2xl text-amber">
            <NumberTicker value={naive} digits={0} scientific />
          </p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-text-subtle uppercase">
            <Hint title="1/20ⁿ" body={HINTS.pNaive}>
              P(caminho) = 1/20ⁿ
            </Hint>
          </p>
          <p className="mt-2 font-mono text-2xl text-teal">{fmtProb(pNaive)}</p>
        </div>
      </div>
    </SlideShell>
  );
}

export function ChessPerftSlide() {
  const rows = Object.entries(PERFT_INITIAL)
    .map(([d, v]) => ({ d: Number(d), v }))
    .sort((a, b) => a.d - b.d);

  return (
    <SlideShell eyebrow="Perft" title="O real: sequências legais" wide>
      <p className="mb-6 max-w-2xl text-text-subtle">
        <Hint title="Perft" body={HINTS.perft}>
          Perft
        </Hint>{" "}
        conta folhas da árvore legal. Um ply = um meio-lance. Depth 1 = 20 primeiros
        lances das brancas. Inclui jogadas ruins.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full max-w-2xl text-left text-sm">
          <thead className="text-cream/40">
            <tr>
              <th className="py-2 pr-6">
                <Hint title="profundidade" body={HINTS.profundidade}>
                  n (plies)
                </Hint>
              </th>
              <th className="pr-6">
                <Hint title="20ⁿ" body={HINTS.vinteN}>
                  20ⁿ
                </Hint>
              </th>
              <th className="pr-6">
                <Hint title="Perft" body={HINTS.perft}>
                  Perft
                </Hint>
              </th>
              <th>
                <Hint title="razão" body={HINTS.razao}>
                  20ⁿ / Perft
                </Hint>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const naive = naiveUniformSequences(r.d);
              return (
                <tr key={r.d} className="border-t border-white/10">
                  <td className="py-2 font-mono text-teal">{r.d}</td>
                  <td className="pr-6 font-mono text-cream/55">
                    {naive.toLocaleString("pt-BR")}
                  </td>
                  <td className="pr-6 font-mono text-cream">
                    {r.v.toLocaleString("pt-BR")}
                  </td>
                  <td className="font-mono text-amber">{(naive / r.v).toFixed(2)}×</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-sm text-text-subtle">
        Fonte: perft canônico da posição inicial. A partir de n = 3, Perft &gt; 20ⁿ.
      </p>
    </SlideShell>
  );
}

export function ChessStateSlide() {
  const [ply, setPly] = useState(0);
  const b = SAMPLE_BRANCHING_PATH[ply]!;

  return (
    <SlideShell eyebrow="Estado" title="B(Sₜ) muda a cada lance">
      <p className="mb-6 max-w-2xl text-text-subtle">
        <Hint title="B(Sₜ)" body={HINTS.branching}>
          B(Sₜ)
        </Hint>{" "}
        = lances legais nesta posição. A chance local, no modelo uniforme, é 1/B.
        Caminho ilustrativo — não é uma partida real.
      </p>
      <Formula display tex={String.raw`P(m_t\mid S_t)=\dfrac{1}{B(S_t)}`} />
      <div className="mt-6 max-w-md" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="Lance t"
          value={ply}
          min={0}
          max={SAMPLE_BRANCHING_PATH.length - 1}
          onChange={setPly}
          hint={{ title: "Lance t", body: HINTS.ply }}
        />
      </div>
      <p className="mt-6 font-display text-4xl text-amber">
        B(S<sub>{ply}</sub>) = {b}
      </p>
      <p className="mt-2 font-mono text-sm text-teal">P(lance | S) = 1/{b}</p>
    </SlideShell>
  );
}

export function ChessProductSlide() {
  const p = pathProbabilityFromBranching(SAMPLE_BRANCHING_PATH);
  const log10 = -Math.log10(p);

  return (
    <SlideShell eyebrow="Produto" title="Um caminho, não o xadrez">
      <p className="mb-6 max-w-2xl text-text-subtle">
        Multiplicar 1/B ao longo dos plies dá a chance{" "}
        <span className="text-cream">desta</span> trajetória sob sorteio uniforme.
        Humano não sorteia: aberturas concentram probabilidade.
      </p>
      <Formula
        display
        tex={String.raw`P(\text{esta linha})=\prod_{t=1}^{n}\dfrac{1}{B(S_t)}`}
      />
      <p className="mt-4 font-mono text-2xl text-teal">
        <Hint title="P(esta linha)" body={HINTS.produto}>
          P ≈ {p.toExponential(4)}
        </Hint>
      </p>
      <p className="mt-2 text-sm text-cream/45">
        Ordem de magnitude: ~10<sup>−{log10.toFixed(1)}</sup> · {SAMPLE_BRANCHING_PATH.length}{" "}
        plies ilustrativos
      </p>
    </SlideShell>
  );
}

export function ChessMarkovSlide() {
  return (
    <SlideShell eyebrow="Markov" title="No xadrez, o estado é a posição">
      <p className="mb-6 max-w-2xl text-text-subtle">
        Aplica o slide anterior: S_t = tabuleiro (peças + roque + en passant). Os lances legais
        saem só daqui. O jogador pode ter memória; as <span className="text-cream">regras</span>{" "}
        não.
      </p>
      <div className="flex flex-wrap items-center gap-3 text-cream/80">
        {["S₀ abertura", "S₁", "S₂ meio", "…"].map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className="rounded-full border border-teal/40 px-4 py-2 font-mono text-sm text-teal">
              {s}
            </div>
            {i < 3 ? <span className="text-cream/30">→</span> : null}
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-start gap-6">
        <div className="rounded-full border-2 border-amber px-5 py-4 font-mono text-amber">S_t</div>
        <div className="space-y-2 pt-1 text-sm text-text-subtle">
          <p>
            → S′ com P = 1/B(S_t) no modelo uniforme
          </p>
          <p className="text-cream/45">B ramos legais · produto ao longo do caminho = P(linha)</p>
        </div>
      </div>
      <Formula
        display
        className="mt-8 block"
        tex={String.raw`P(S_{t+1}=j\mid S_t=i)=p_{ij}`}
      />
    </SlideShell>
  );
}

export function ChessSimulatorSlide() {
  const [depth, setDepth] = useState(5);
  const naive = naiveUniformSequences(depth);
  const perft = perftSequences(depth);
  const pNaive = naivePathProbability(depth);
  const pLeaves = uniformOverLeavesProbability(depth);
  const logInv = log10InversePerft(depth);

  const comparison = useMemo(() => {
    if (perft == null) return null;
    return naive / perft;
  }, [naive, perft]);

  return (
    <SlideShell eyebrow="Simulator" title="Ingênuo vs real" wide>
      <div className="max-w-md" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="Profundidade"
          value={depth}
          min={1}
          max={8}
          onChange={setDepth}
          hint={{ title: "Profundidade", body: HINTS.profundidade }}
        />
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-text-subtle uppercase">
            <Hint title="20ⁿ" body={HINTS.vinteN}>
              20ⁿ
            </Hint>
          </p>
          <p className="mt-2 font-mono text-lg text-cream/80">{naive.toExponential(3)}</p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-text-subtle uppercase">
            <Hint title="Perft" body={HINTS.perft}>
              Perft
            </Hint>
          </p>
          <p className="mt-2 font-mono text-lg text-amber">
            {perft?.toExponential(3) ?? "—"}
          </p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-text-subtle uppercase">
            <Hint title="1/20ⁿ" body={HINTS.pNaive}>
              1/20ⁿ
            </Hint>
          </p>
          <p className="mt-2 font-mono text-lg text-cream/80">{fmtProb(pNaive)}</p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs text-text-subtle uppercase">
            <Hint title="1/Perft" body={HINTS.pPerft}>
              1/Perft
            </Hint>
          </p>
          <p className="mt-2 font-mono text-lg text-teal">
            {pLeaves != null ? fmtProb(pLeaves) : "—"}
          </p>
        </div>
      </div>
      <p className="mt-6 text-sm text-text-subtle">
        <Hint title="razão" body={HINTS.razao}>
          razão 20ⁿ/Perft
        </Hint>
        {": "}
        <span className="font-mono text-amber">
          {comparison != null ? `${comparison.toFixed(2)}×` : "—"}
        </span>
        {logInv != null ? (
          <>
            {" · "}
            log₁₀(Perft) ≈ {logInv.toFixed(2)}
          </>
        ) : null}
      </p>
      <p className="mt-4 max-w-3xl text-sm text-cream/50">
        Uniforme ≠ humano. Perft inclui lances péssimos; teoria de aberturas deixa uma
        Siciliana bem mais comum que 1/Perft — e ainda assim repetir uma partida
        inteira lance a lance continua minúsculo.
      </p>
    </SlideShell>
  );
}
