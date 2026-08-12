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
import { DogMark, DogPack } from "@/components/deck/DogMark";
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
    <SlideShell eyebrow="Cães & Bayes" title="Dados, não estigma" wide>
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <DogPack />
        <ul className="max-w-xl space-y-5 text-lg text-cream/80">
          <li>Probabilidade de cenário, não essência de raça.</li>
          <li>
            Todo número é rotulado:{" "}
            <DataLabel kind="observado" label="dado" />{" "}
            <DataLabel kind="derivado" label="calculado" />{" "}
            <DataLabel kind="parâmetro do modelo" label="hipótese" />
          </li>
          <li>
            <Formula tex={String.raw`P(\text{raça}\mid\text{fatal})`} /> ≠{" "}
            <Formula tex={String.raw`P(\text{fatal}\mid\text{raça})`} />.
          </li>
        </ul>
      </div>
    </SlideShell>
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
    <SlideShell eyebrow="Cadeia" title="Uma chance nasce de várias chances">
      <p className="mb-5 max-w-2xl text-text-subtle">
        Multiplicamos porque <span className="text-cream">todas</span> as condições
        precisam acontecer. S = sair, C = encontrar cão, R = interação, I = incidente.
        Os números abaixo são hipóteses, não censo.
      </p>
      <Formula
        display
        tex={String.raw`P(I)=P(S)\,P(C\mid S)\,P(R\mid C,S)\,P(I\mid R,C,S)`}
      />
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {factors.map((f, i) => (
          <div key={f.label} className="flex items-center gap-3">
            <div className="border border-teal/30 bg-teal/10 px-4 py-3 text-center">
              {f.label === "Encontrar cão" ? (
                <p className="mb-1 flex justify-center text-teal">
                  <DogMark pose="side" className="h-8 w-10" />
                </p>
              ) : null}
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
      <p className="mt-6 text-sm text-text-subtle">Ajuste cada fator no simulador.</p>
    </SlideShell>
  );
}

export function DogsBayesSlide() {
  return (
    <SlideShell eyebrow="Assinatura" title="Mesmas palavras. Perguntas opostas.">
      <p className="mb-6 max-w-2xl text-text-subtle">
        “Dado o fatal, de que grupo veio?” não é “dado o grupo, qual o risco?”. Bayes{" "}
        <span className="text-cream">inverte</span> a condicional.
      </p>
      <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <div className="rounded border border-amber/40 bg-amber/10 p-6">
          <p className="mb-3 text-xs tracking-[0.14em] text-text-subtle uppercase">o dado traz</p>
          <Formula display tex={String.raw`P(\text{raça}\mid\text{fatal})`} />
        </div>
        <DogMark pose="sit" className="mx-auto h-20 w-24 text-cream/70" />
        <div className="rounded border border-teal/40 bg-teal/10 p-6">
          <p className="mb-3 text-xs tracking-[0.14em] text-text-subtle uppercase">o público entende</p>
          <Formula display tex={String.raw`P(\text{fatal}\mid\text{raça})`} />
        </div>
      </div>
      <Formula className="mt-6 block" display tex={String.raw`P(A\mid B)=\dfrac{P(B\mid A)P(A)}{P(B)}`} />
    </SlideShell>
  );
}

export function DogsSimulatorSlide() {
  const [pA, setPA] = useState(0.05);
  const [sens, setSens] = useState(0.66);
  const [falsePos, setFalsePos] = useState(0.1);
  const posterior = bayesBinary(sens, pA, falsePos);

  return (
    <SlideShell eyebrow="Simulator" title="Qual posterior sai desse cenário?">
      <p className="mb-5 max-w-2xl text-text-subtle">
        A = o grupo (ex.: uma raça). B = o sinal (ex.: fatal). O número grande é{" "}
        <span className="font-mono text-cream">P(A|B)</span> — a pergunta invertida.
      </p>
      <div className="max-w-md space-y-4" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="P(A) prior — quão comum o grupo"
          value={pA}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={setPA}
          format={(v) => v.toFixed(2)}
          hint={{
            title: "P(A) prior",
            body: "Quão comum é o grupo A na população. Raro no prior → mesmo um sinal forte não explode o posterior.",
          }}
        />
        <SliderControl
          label="P(B|A) — se A, quão provável o sinal"
          value={sens}
          min={0.05}
          max={0.95}
          step={0.01}
          onChange={setSens}
          format={(v) => v.toFixed(2)}
          hint={{
            title: "P(B|A)",
            body: "Se A é verdade, quão provável é o sinal B. Aqui: se é aquele grupo, quão frequentemente o incidente grave aparece.",
          }}
        />
        <SliderControl
          label="P(B|¬A) — alarme falso"
          value={falsePos}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={setFalsePos}
          format={(v) => v.toFixed(2)}
          hint={{
            title: "P(B|¬A)",
            body: "Alarme falso: B acontece mesmo sem A. Quanto maior, mais o sinal se dilui e o posterior cai.",
          }}
        />
      </div>
      <p className="mt-8 font-display text-5xl text-amber">
        P(A|B) ≈ {(posterior * 100).toFixed(1)}%
      </p>
      <p className="mt-3 max-w-md text-sm text-text-subtle">
        66% no gráfico de fatalidades é P(raça|fatal), o dado. Este % é o posterior do
        cenário — outra pergunta.
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
    <SlideShell eyebrow="Dados" title="Distribuição observada" wide>
      <p className="mb-4 text-sm text-text-subtle">
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
    <SlideShell eyebrow="Takeaway" title="A condicional define o sentido">
      <blockquote className="font-display max-w-3xl text-3xl leading-snug text-cream md:text-4xl">
        “66% das fatalidades envolvem pitbulls”{" "}
        <span className="text-amber">não</span> é a mesma frase que “66% dos
        pitbulls são fatais”.
      </blockquote>
      <p className="mt-8 flex items-center gap-3 text-text-subtle">
        <DogMark pose="sit" className="h-10 w-12 text-amber/70" />
        Bayes evita esse erro de leitura.
      </p>
    </SlideShell>
  );
}
