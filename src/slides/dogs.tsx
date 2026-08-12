"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Formula } from "@/components/deck/Formula";
import { PrimaryButton, SliderControl } from "@/components/deck/Controls";
import { DataLabel } from "@/components/deck/DataLabel";
import { MediaBackdrop } from "@/components/deck/MediaBackdrop";
import { SlideShell } from "@/components/deck/SlideShell";
import { bayesBinary, chainProduct } from "@/lib/math";

/** DogsBite.org / CDC compilation — P(breed | fatal attack), NOT P(attack | breed) */
export const FATAL_BY_BREED = [
  { breed: "Pitbull*", pct: 66.4, cases: 346 },
  { breed: "Rottweiler", pct: 9.8, cases: 51 },
  { breed: "Pastor Alemão", pct: 4.0, cases: 21 },
  { breed: "Mixed (s/ Pit)", pct: 3.5, cases: 18 },
  { breed: "Am. Bulldog", pct: 2.9, cases: 15 },
  { breed: "Mastiff", pct: 2.7, cases: 14 },
  { breed: "Husky", pct: 2.5, cases: 13 },
];

export function DogsEthicsSlide() {
  return (
    <div className="relative h-full w-full">
      <MediaBackdrop src="/media/dogs/silhouette.png" opacity={0.22} />
      <SlideShell eyebrow="Cães & Bayes" title="Framing: cenário, não estigma">
        <ul className="max-w-2xl space-y-4 text-lg text-cream/70">
          <li>
            Trabalhamos com{" "}
            <strong className="font-medium text-cream">
              probabilidade de encontro/incidente sob condições
            </strong>
            — não com a tese de “raça assassina”.
          </li>
          <li>
            Todo número na tela leva rótulo:{" "}
            <DataLabel kind="observado" label="dado" />{" "}
            <DataLabel kind="derivado" label="calculado" />{" "}
            <DataLabel kind="parâmetro do modelo" label="hipótese" />
          </li>
          <li>
            Tabelas de fatalidade por raça medem{" "}
            <Formula tex={String.raw`P(\text{raça}\mid\text{fatal})`} /> — o
            inverso de{" "}
            <Formula tex={String.raw`P(\text{fatal}\mid\text{raça})`} />.
          </li>
        </ul>
      </SlideShell>
    </div>
  );
}

export function DogsChainSlide() {
  const factors = [
    { label: "Sair à rua", p: 0.7 },
    { label: "Encontrar cão", p: 0.15 },
    { label: "Interação", p: 0.2 },
    { label: "Incidente | interação", p: 0.05 },
  ];
  const product = chainProduct(factors.map((f) => f.p));

  return (
    <SlideShell eyebrow="Cadeia" title="Produto de condicionais">
      <Formula
        display
        tex={String.raw`P(I)=P(S)\,P(C\mid S)\,P(R\mid C,S)\,P(I\mid R,C,S)`}
      />
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {factors.map((f, i) => (
          <div key={f.label} className="flex items-center gap-3">
            <div className="border border-teal/30 bg-teal/10 px-4 py-3 text-center">
              <p className="text-xs text-cream/50">{f.label}</p>
              <p className="font-mono text-amber">{f.p}</p>
            </div>
            {i < factors.length - 1 ? (
              <span className="text-cream/30">×</span>
            ) : null}
          </div>
        ))}
        <span className="text-cream/30">=</span>
        <p className="font-mono text-2xl text-teal">{product.toExponential(3)}</p>
      </div>
      <p className="mt-6 text-sm text-cream/45">
        Valores ilustrativos (parâmetros do modelo) — ajuste no simulator.
      </p>
    </SlideShell>
  );
}

export function DogsBayesSlide() {
  return (
    <SlideShell eyebrow="Assinatura" title="Bayes inverte a pergunta">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <p className="text-cream/55">O que a tabela de fatalidades dá:</p>
          <Formula display tex={String.raw`P(\text{raça}\mid\text{ataque fatal})`} />
          <p className="text-sm text-cream/45">
            “Dado que houve morte, qual a fração atribuída a cada raça?”
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-cream/55">O que a intuição pede (e exige base):</p>
          <Formula display tex={String.raw`P(\text{ataque fatal}\mid\text{raça})`} />
          <Formula
            display
            tex={String.raw`P(A\mid B)=\dfrac{P(B\mid A)P(A)}{P(B)}`}
          />
        </div>
      </div>
      <p className="mt-8 max-w-2xl text-cream/60">
        Sem a prevalência da raça na população canina e a taxa base de
        incidentes,{" "}
        <span className="text-amber">não dá para ler a tabela como risco por raça</span>.
      </p>
    </SlideShell>
  );
}

export function DogsSimulatorSlide() {
  const [pA, setPA] = useState(0.05);
  const [sens, setSens] = useState(0.66);
  const [falsePos, setFalsePos] = useState(0.1);
  const posterior = bayesBinary(sens, pA, falsePos);

  return (
    <SlideShell eyebrow="Simulator" title="Bayes numérico (cenário)">
      <p className="mb-4 text-sm text-cream/50">
        Hipótese A = “fator de risco presente”. Evidência B = “incidente
        classificado”. Todos os inputs são{" "}
        <DataLabel kind="parâmetro do modelo" label="editáveis" />.
      </p>
      <div className="max-w-md space-y-4" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="P(A) prior"
          value={pA}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={setPA}
          format={(v) => v.toFixed(2)}
        />
        <SliderControl
          label="P(B|A)"
          value={sens}
          min={0.05}
          max={0.95}
          step={0.01}
          onChange={setSens}
          format={(v) => v.toFixed(2)}
        />
        <SliderControl
          label="P(B|¬A)"
          value={falsePos}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={setFalsePos}
          format={(v) => v.toFixed(2)}
        />
      </div>
      <p className="mt-8 font-display text-3xl text-amber">
        P(A|B) ≈ {(posterior * 100).toFixed(1)}%
      </p>
      <PrimaryButton
        onClick={() => {
          setPA(0.05);
          setSens(0.66);
          setFalsePos(0.1);
        }}
      >
        Reset cenário
      </PrimaryButton>
    </SlideShell>
  );
}

export function DogsChartSlide() {
  const data = useMemo(
    () => FATAL_BY_BREED.map((d) => ({ name: d.breed, pct: d.pct })),
    [],
  );

  return (
    <SlideShell eyebrow="Dados" title="Fatalidades por raça (EUA, 15 anos)" wide>
      <p className="mb-4 text-sm text-cream/50">
        <DataLabel kind="observado" label="DogsBite.org / CDC compilado" /> —{" "}
        <Formula tex={String.raw`P(\text{raça}\mid\text{fatal})`} />, não risco
        individual.
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis type="number" stroke="#9ca3af" fontSize={11} unit="%" />
            <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={11} width={90} />
            <Tooltip
              contentStyle={{ background: "#12161c", border: "1px solid #333" }}
            />
            <Bar dataKey="pct" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SlideShell>
  );
}

export function DogsTakeawaySlide() {
  return (
    <SlideShell eyebrow="Takeaway" title="Condicional inverte a pergunta">
      <blockquote className="font-display max-w-3xl text-3xl leading-snug text-cream md:text-4xl">
        “66% das fatalidades envolvem pitbulls”{" "}
        <span className="text-amber">não</span> é a mesma frase que “66% dos
        pitbulls são fatais”.
      </blockquote>
      <p className="mt-8 text-cream/55">
        Bayes existe exatamente para não confundir essas duas sentenças.
      </p>
    </SlideShell>
  );
}
