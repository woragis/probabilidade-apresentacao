"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Formula } from "@/components/deck/Formula";
import { PrimaryButton, SliderControl } from "@/components/deck/Controls";
import { DataLabel } from "@/components/deck/DataLabel";
import { MediaBackdrop } from "@/components/deck/MediaBackdrop";
import { NumberTicker } from "@/components/deck/NumberTicker";
import { SlideShell } from "@/components/deck/SlideShell";
import {
  binomialExpected,
  binomialPmfSeries,
  CITIES,
  expectedReencounters,
  pAtLeastOneReencounter,
  pNoticeOnce,
  poissonLambda,
  poissonPmfSeries,
  type CityKey,
} from "@/lib/math";
import { useMonteCarloWorker } from "@/lib/useMonteCarloWorker";

export function EncounterHookSlide() {
  return (
    <div className="relative h-full w-full">
      <MediaBackdrop src="/media/encounters/times-square.jpg" opacity={0.35} />
      <SlideShell eyebrow="Encontros" title="Vou ver essa pessoa de novo?">
        <p className="font-mono text-6xl text-amber md:text-8xl">?</p>
        <p className="mt-6 max-w-2xl text-lg text-text-subtle">
          A resposta depende do fluxo local, não da população total.
        </p>
      </SlideShell>
    </div>
  );
}

export function EncounterModelSlide() {
  return (
    <SlideShell eyebrow="Encontros" title="Modelo em 3 passos">
      <div className="space-y-6">
        <Formula display tex={String.raw`p_{\text{hora}}\approx 1-\Bigl(1-\frac{1}{F}\Bigr)^{r}`} />
        <Formula display tex={String.raw`p_{\text{visita}}=1-(1-p_{\text{hora}})^{h}`} />
        <Formula display tex={String.raw`P(X\ge 1)=1-(1-p_{\text{visita}})^{n}`} />
      </div>
    </SlideShell>
  );
}

export function EncounterSimulatorSlide() {
  const [cityKey, setCityKey] = useState<CityKey>("jp");
  const city = CITIES.find((c) => c.key === cityKey)!;
  const [placeId, setPlaceId] = useState(city.places[0]!.id);
  const place = city.places.find((p) => p.id === placeId) ?? city.places[0]!;
  const [hours, setHours] = useState(2);
  const [visits, setVisits] = useState(20);
  const [observeRate, setObserveRate] = useState(80);

  const pVisit = pNoticeOnce({
    flowPerHour: place.flowPerHour,
    hours,
    observeRatePerHour: observeRate,
  });
  const pAgain = pAtLeastOneReencounter(pVisit, visits);
  const expected = expectedReencounters(pVisit, visits);

  return (
    <SlideShell eyebrow="Simulator" title="Pergunta: qual P(reencontro)?" wide>
      <div className="grid gap-8 xl:grid-cols-[320px_1fr_280px]">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <label className="block text-sm text-text-subtle">
            Cidade
            <select
              className="mt-1 w-full rounded border border-white/15 bg-ink-elevated px-3 py-2 text-cream"
              value={cityKey}
              onChange={(e) => {
                const k = e.target.value as CityKey;
                setCityKey(k);
                const c = CITIES.find((x) => x.key === k)!;
                setPlaceId(c.places[0]!.id);
              }}
            >
              {CITIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm text-text-subtle">
            Lugar
            <select
              className="mt-1 w-full rounded border border-white/15 bg-ink-elevated px-3 py-2 text-cream"
              value={place.id}
              onChange={(e) => setPlaceId(e.target.value)}
            >
              {city.places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.flowPerHour.toLocaleString("pt-BR")}/h)
                </option>
              ))}
            </select>
          </label>
          <DataLabel kind="observado" label={`pop. ${city.population.toLocaleString("pt-BR")}`} />
          <DataLabel kind={place.flowLabel} label="fluxo local" />
          <SliderControl label="Horas" value={hours} min={0.5} max={8} step={0.5} onChange={setHours} />
          <SliderControl label="Visitas" value={visits} min={1} max={100} onChange={setVisits} />
          <SliderControl
            label="Observações/h"
            value={observeRate}
            min={10}
            max={300}
            step={10}
            onChange={setObserveRate}
          />
        </div>
        <div className="grid place-items-center rounded border border-white/10 bg-white/[0.03] p-8">
          <div className="text-center">
            <p className="text-xs tracking-[0.16em] text-text-subtle uppercase">P(reencontro)</p>
            <p className="font-mono text-6xl text-amber md:text-7xl">
              <NumberTicker value={pAgain * 100} digits={2} suffix="%" />
            </p>
            <p className="mt-4 text-sm text-text-subtle">
              p visita: <span className="font-mono text-teal">{pVisit.toExponential(2)}</span>
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs tracking-[0.16em] text-text-subtle uppercase">E[X]</p>
          <p className="font-mono text-4xl text-teal">
            <NumberTicker value={expected} digits={3} />
          </p>
          <p className="text-sm text-text-subtle">
            Quanto maior o fluxo local, menor a chance de repetir a mesma pessoa.
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

export function BinomialSlide() {
  const [n, setN] = useState(20);
  const [p, setP] = useState(0.15);
  const data = useMemo(() => binomialPmfSeries(n, p).map((prob, k) => ({ k, prob })), [n, p]);
  const mean = binomialExpected(n, p);

  return (
    <SlideShell eyebrow="Variável aleatória" title="Distribuição de reencontros" wide>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <Formula tex={String.raw`E[X]=np`} />
          <SliderControl label="n" value={n} min={5} max={40} onChange={setN} />
          <SliderControl label="p" value={p} min={0.02} max={0.5} step={0.01} onChange={setP} format={(v) => v.toFixed(2)} />
          <p className="font-mono text-2xl text-amber">{mean.toFixed(2)}</p>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="k" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip contentStyle={{ background: "#12161c", border: "1px solid #333" }} />
              <Bar dataKey="prob" fill="#5fa8d3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SlideShell>
  );
}

export function PoissonSlide() {
  const [lambda, setLambda] = useState(3);
  const data = useMemo(() => poissonPmfSeries(lambda, 18).map((prob, k) => ({ k, prob })), [lambda]);
  const derived = poissonLambda({ flowPerHour: 2500, hours: 2, observeRatePerHour: 80 });

  return (
    <SlideShell eyebrow="Fluxo raro" title="Quando o evento é raro">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div onKeyDown={(e) => e.stopPropagation()}>
          <p className="mb-3 font-mono text-2xl text-amber">λ ≈ {derived.toFixed(3)}</p>
          <SliderControl label="λ" value={lambda} min={0.5} max={12} step={0.5} onChange={setLambda} format={(v) => v.toFixed(1)} />
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="k" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip contentStyle={{ background: "#12161c", border: "1px solid #333" }} />
              <Line type="monotone" dataKey="prob" stroke="#d9a441" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SlideShell>
  );
}

export function EncounterMonteCarloSlide() {
  const [p, setP] = useState(0.08);
  const [n, setN] = useState(100_000);
  const { run, running } = useMonteCarloWorker();
  const [result, setResult] = useState<{ pHat: number; hits: number; ci95: { low: number; high: number } } | null>(null);

  const simulate = async () => {
    const r = await run({ type: "bernoulli", n, p });
    setResult({ pHat: r.pHat, hits: r.hits, ci95: r.ci95 });
  };

  return (
    <SlideShell eyebrow="Monte Carlo" title="Teórico vs simulado">
      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <SliderControl label="p teórico" value={p} min={0.01} max={0.4} step={0.01} onChange={setP} format={(v) => v.toFixed(2)} />
          <SliderControl label="N" value={n} min={1000} max={500_000} step={1000} onChange={setN} format={(v) => v.toLocaleString("pt-BR")} />
          <PrimaryButton onClick={simulate} disabled={running}>
            {running ? "Simulando…" : "Simular"}
          </PrimaryButton>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-text-subtle uppercase">teórico</p>
            <p className="font-mono text-2xl text-teal">{(p * 100).toFixed(2)}%</p>
          </div>
          <div className="rounded border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-text-subtle uppercase">p̂</p>
            <p className="font-mono text-2xl text-amber">{result ? `${(result.pHat * 100).toFixed(3)}%` : "—"}</p>
          </div>
          <div className="rounded border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-text-subtle uppercase">hits</p>
            <p className="font-mono text-2xl text-cream">{result ? result.hits.toLocaleString("pt-BR") : "—"}</p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

export function ConfidenceIntervalSlide() {
  const [pHat] = useState(0.12);
  const [n, setN] = useState(1_000);
  const se = Math.sqrt((pHat * (1 - pHat)) / n);
  const low = Math.max(0, pHat - 1.96 * se);
  const high = Math.min(1, pHat + 1.96 * se);

  return (
    <SlideShell eyebrow="Inferência" title="Mais N, menos incerteza">
      <div className="max-w-2xl space-y-5" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl label="n" value={n} min={50} max={50_000} step={50} onChange={setN} format={(v) => v.toLocaleString("pt-BR")} />
        <div className="relative h-12 rounded bg-white/5">
          <div className="absolute top-1/2 h-2 -translate-y-1/2 rounded bg-teal/80" style={{ left: `${low * 100}%`, width: `${(high - low) * 100}%` }} />
          <div className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-amber" style={{ left: `${pHat * 100}%` }} />
        </div>
        <p className="font-mono text-xl text-cream">
          [{(low * 100).toFixed(2)}%, {(high * 100).toFixed(2)}%]
        </p>
      </div>
    </SlideShell>
  );
}
