"use client";

import { useMemo, useState } from "react";
import { Formula } from "@/components/deck/Formula";
import { PrimaryButton } from "@/components/deck/Controls";
import { SlideShell } from "@/components/deck/SlideShell";
import { twoDiceSumPmf } from "@/lib/math";

export function WhatIsProbabilitySlide() {
  return (
    <SlideShell eyebrow="Fundamentos" title="O que é probabilidade?">
      <div className="space-y-6">
        <Formula display tex={String.raw`P(A)=\dfrac{|A|}{|\Omega|}`} />
        <p className="max-w-2xl text-lg text-cream/65">
          Em um espaço amostral finito com resultados igualmente prováveis, a
          probabilidade de um evento é a fração dos resultados favoráveis.
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-cream/50">
          <span>
            Complemento: <Formula tex={String.raw`P(A^c)=1-P(A)`} />
          </span>
          <span>
            União:{" "}
            <Formula
              tex={String.raw`P(A\cup B)=P(A)+P(B)-P(A\cap B)`}
            />
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
    <SlideShell eyebrow="Fundamentos" title="Um dado justo">
      <div className="flex flex-col items-start gap-10 md:flex-row md:items-center">
        <button
          type="button"
          onClick={roll}
          onKeyDown={(e) => e.stopPropagation()}
          className={`grid h-28 w-28 place-items-center rounded-2xl border border-amber/40 bg-ink-elevated font-display text-5xl text-amber shadow-[0_0_40px_rgba(245,158,11,0.15)] transition ${rolling ? "scale-95" : ""}`}
        >
          {face}
        </button>
        <div className="space-y-4">
          <Formula display tex={String.raw`P(6)=\dfrac{1}{6}\approx 0{,}1667`} />
          <p className="text-cream/60">
            Cada face é um ponto de <Formula tex={String.raw`\Omega`} />. Clique
            no dado para sortear.
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
    <SlideShell eyebrow="Fundamentos" title="Dois dados — a soma 7" wide>
      <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
        <div>
          <Formula display tex={String.raw`P(\text{soma}=7)=\dfrac{6}{36}`} />
          <p className="mt-4 text-cream/60">
            Seis pares: (1,6) (2,5) (3,4) (4,3) (5,2) (6,1). Em decimal:{" "}
            {(p7 * 100).toFixed(2)}%.
          </p>
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
    <SlideShell eyebrow="Fundamentos" title="Independência, união, interseção">
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
        <div className="space-y-4">
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
          <p className="text-cream/60">
            Se A e B são independentes:{" "}
            <Formula tex={String.raw`P(A\cap B)=P(A)P(B)`} />
          </p>
          <p className="text-cream/60">
            Interseção ≠ “quase a mesma coisa” — é o evento em que ambos ocorrem.
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
    <SlideShell eyebrow="Fundamentos" title="Probabilidade condicional">
      <Formula
        display
        tex={String.raw`P(A\mid B)=\dfrac{P(A\cap B)}{P(B)}`}
      />
      <div className="mt-8 max-w-md space-y-4">
        <label className="block text-sm text-cream/70">
          P(B) = {pB.toFixed(2)}{" "}
          <span className="text-cream/40">(parâmetro)</span>
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
        <p className="text-lg text-cream/80">
          Com <Formula tex={String.raw`P(A\cap B)=0{,}15`} /> (fixado):{" "}
          <span className="font-mono text-amber">{pAgivenB.toFixed(3)}</span>
        </p>
        <p className="text-sm text-cream/50">
          Condicionar em B restringe o universo — a pergunta muda.
        </p>
      </div>
    </SlideShell>
  );
}

export function BridgeSlide() {
  return (
    <SlideShell eyebrow="Ponte" title="Agora empilhamos condições">
      <p className="max-w-2xl text-xl leading-relaxed text-cream/70 md:text-2xl">
        Um dado é simples. Encontrar a mesma pessoa, sob horário, lugar e
        fluxo — ou uma sequência de lances de xadrez — é o produto de muitas
        probabilidades condicionais.
      </p>
      <p className="mt-8 text-teal-muted">Entramos no mundo real →</p>
    </SlideShell>
  );
}
