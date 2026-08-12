"use client";

import { useMemo, useState } from "react";
import { Formula } from "@/components/deck/Formula";
import { PrimaryButton } from "@/components/deck/Controls";
import { SlideShell } from "@/components/deck/SlideShell";
import { twoDiceSumPmf } from "@/lib/math";

export function WhatIsProbabilitySlide() {
  return (
    <SlideShell eyebrow="Fundamentos" title="Quanto do universo é favorável?">
      <p className="mb-6 max-w-2xl text-text-subtle">
        <span className="text-cream">Ω</span> = todos os resultados possíveis.{" "}
        <span className="text-cream">A</span> = os que contam. A fração só vale se
        os resultados forem <span className="text-cream">equiprováveis</span>.
      </p>
      <div className="space-y-8">
        <Formula display tex={String.raw`P(A)=\dfrac{|A|}{|\Omega|}`} />
        <div className="grid max-w-3xl gap-4 md:grid-cols-2">
          <span className="rounded border border-white/15 bg-white/5 px-4 py-3 text-sm text-text-subtle">
            Complemento · <Formula tex={String.raw`P(A^c)=1-P(A)`} />
          </span>
          <span className="rounded border border-white/15 bg-white/5 px-4 py-3 text-sm text-text-subtle">
            União · <Formula tex={String.raw`P(A\cup B)=P(A)+P(B)-P(A\cap B)`} />
          </span>
        </div>
      </div>
    </SlideShell>
  );
}

export function SingleDieSlide() {
  const [face, setFace] = useState(1);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    let n = 0;
    const id = window.setInterval(() => {
      setFace(1 + Math.floor(Math.random() * 6));
      n++;
      if (n > 12) {
        window.clearInterval(id);
        setRolling(false);
      }
    }, 60);
  };

  return (
    <SlideShell eyebrow="Fundamentos" title="A pergunta é visual: 1 em 6">
      <div className="flex flex-col items-start gap-10 md:flex-row md:items-center">
        <button
          type="button"
          onClick={roll}
          onKeyDown={(e) => e.stopPropagation()}
          className={`grid h-28 w-28 place-items-center rounded-2xl border border-amber/40 bg-ink-elevated font-display text-5xl text-amber shadow-[0_0_40px_rgba(245,158,11,0.15)] transition ${rolling ? "scale-95" : ""}`}
        >
          {face}
        </button>
        <div className="space-y-6">
          <Formula display tex={String.raw`P(6)=\dfrac{1}{6}\approx 0{,}1667`} />
          <p className="max-w-md text-sm text-text-subtle">
            Uma face entre seis iguais. Um clique não é frequência — muitos cliques
            que convergem.
          </p>
          <PrimaryButton onClick={roll}>Rolar</PrimaryButton>
        </div>
      </div>
    </SlideShell>
  );
}

export function TwoDiceSlide() {
  const cells = useMemo(() => {
    const out: { a: number; b: number; sum: number }[] = [];
    for (let a = 1; a <= 6; a++) {
      for (let b = 1; b <= 6; b++) out.push({ a, b, sum: a + b });
    }
    return out;
  }, []);
  const p7 = twoDiceSumPmf().get(7)!;

  return (
    <SlideShell eyebrow="Fundamentos" title="Por que 7 aparece tanto?" wide>
      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <p className="max-w-md text-text-subtle">
            7 tem <span className="text-cream">6 pares</span>; 2 e 12 têm 1. Não é
            sorte: é contagem.
          </p>
          <Formula display tex={String.raw`P(\text{soma}=7)=\dfrac{6}{36}`} />
          <p className="font-mono text-3xl text-amber">{(p7 * 100).toFixed(2)}%</p>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {cells.map((c) => (
            <div
              key={`${c.a}-${c.b}`}
              className={`grid h-9 w-9 place-items-center text-[10px] ${
                c.sum === 7
                  ? "bg-amber text-ink"
                  : "bg-white/5 text-cream/40"
              }`}
              title={`${c.a}+${c.b}=${c.sum}`}
            >
              {c.sum}
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

export function VennSlide() {
  const [showA, setShowA] = useState(true);
  const [showB, setShowB] = useState(true);

  return (
    <SlideShell eyebrow="Fundamentos" title="Interseção: onde os dois acontecem">
      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        <svg viewBox="0 0 320 200" className="h-48 w-full max-w-sm">
          <rect width="320" height="200" fill="transparent" />
          <circle
            cx="130"
            cy="100"
            r="70"
            fill={showA ? "rgba(45,212,191,0.35)" : "rgba(255,255,255,0.05)"}
            stroke="rgba(45,212,191,0.8)"
          />
          <circle
            cx="190"
            cy="100"
            r="70"
            fill={showB ? "rgba(245,158,11,0.3)" : "rgba(255,255,255,0.05)"}
            stroke="rgba(245,158,11,0.8)"
          />
          <text x="100" y="105" fill="#e8e4d9" fontSize="18">
            A
          </text>
          <text x="200" y="105" fill="#e8e4d9" fontSize="18">
            B
          </text>
        </svg>
        <div className="space-y-5">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowA((v) => !v)}
              onKeyDown={(e) => e.stopPropagation()}
              className={`rounded border px-3 py-1.5 text-sm ${showA ? "border-teal text-teal" : "border-white/20 text-cream/40"}`}
            >
              Destacar A
            </button>
            <button
              type="button"
              onClick={() => setShowB((v) => !v)}
              onKeyDown={(e) => e.stopPropagation()}
              className={`rounded border px-3 py-1.5 text-sm ${showB ? "border-amber text-amber" : "border-white/20 text-cream/40"}`}
            >
              Destacar B
            </button>
          </div>
          <p className="max-w-sm text-text-subtle">
            O overlap é os dois ao mesmo tempo. O produto{" "}
            <Formula tex={String.raw`P(A)P(B)`} /> vale só se A e B forem{" "}
            <span className="text-cream">independentes</span> — não é a definição de
            interseção.
          </p>
          <p className="text-lg text-cream/80">
            <Formula tex={String.raw`P(A\cap B)=P(A)P(B)`} />
            <span className="ml-2 text-sm text-cream/40">se independentes</span>
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

export function ConditionalSlide() {
  const [pB, setPB] = useState(0.4);
  const pAandB = 0.15;
  const pAgivenB = pAandB / pB;

  return (
    <SlideShell eyebrow="Fundamentos" title="Quando B acontece, o universo muda">
      <p className="mb-6 max-w-2xl text-text-subtle">
        O universo <span className="text-cream">encolhe para B</span>. Exemplo: P(atrasar |
        choveu) — já sabemos que choveu; o resto do Ω some.
      </p>
      <Formula
        display
        tex={String.raw`P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}`}
      />
      <div className="mt-8 max-w-md space-y-5">
        <label className="block text-sm text-cream/70">
          P(B) = {pB.toFixed(2)}{" "}
          <span className="text-text-subtle/70">(parâmetro, não dado)</span>
          <input
            type="range"
            min={0.16}
            max={0.9}
            step={0.01}
            value={pB}
            onChange={(e) => setPB(Number(e.target.value))}
            onKeyDown={(e) => e.stopPropagation()}
            className="mt-2 h-1.5 w-full appearance-none rounded-full bg-white/10 accent-teal"
          />
        </label>
        <p className="font-mono text-4xl text-amber">{pAgivenB.toFixed(3)}</p>
        <p className="text-sm text-text-subtle">
          Com P(A∩B) fixo, variar P(B) altera a resposta.
        </p>
      </div>
    </SlideShell>
  );
}

export function BridgeSlide() {
  return (
    <SlideShell eyebrow="Ponte" title="Do simples ao improvável">
      <p className="max-w-2xl text-2xl leading-relaxed text-cream/80 md:text-3xl">
        Evento raro = multiplicar condicionais.
      </p>
      <p className="mt-6 max-w-2xl text-text-subtle">
        Cada “e também…” multiplica e o número despenca. Daqui para frente: orla, cães,
        xadrez, War.
      </p>
    </SlideShell>
  );
}
