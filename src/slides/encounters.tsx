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
    <SlideShell eyebrow="Encontros" title="Ver a mesma pessoa de novo">
      <p className="max-w-2xl text-xl text-cream/70">
        Você cruza alguém no centro. Qual a chance de cruzar{" "}
        <em className="text-amber not-italic">aquela</em> pessoa outra vez —
        na mesma orla, no mesmo horário, semanas depois?
      </p>
      <p className="mt-6 text-sm text-cream/45">
        População da cidade informa contexto; o denominador do encontro é o{" "}
        <strong className="font-medium text-cream/70">fluxo do lugar</strong>.
      </p>
    </SlideShell>
  );
}

export function EncounterModelSlide() {
  return (
    <SlideShell eyebrow="Encontros" title="Modelo de fluxo">
      <div className="space-y-5 text-cream/70">
        <Formula
          display
          tex={String.raw`p_{\text{hora}}\approx 1-\Bigl(1-\frac{1}{F}\Bigr)^{r}`}
        />
        <Formula
          display
          tex={String.raw`p_{\text{visita}}=1-(1-p_{\text{hora}})^{h}`}
        />
        <Formula
          display
          tex={String.raw`P(X\ge 1)=1-(1-p_{\text{visita}})^{n}`}
        />
        <p className="text-sm">
          F = fluxo/hora · r = pessoas que você “observa” por hora · h = horas
          na visita · n = visitas · X ~ Binomial(n, p)
        </p>
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
    <SlideShell eyebrow="Simulator" title="Encontro casual" wide>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <label className="block text-sm text-cream/70">
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
          <DataLabel
            kind="observado"
            label={`pop. ${city.population.toLocaleString("pt-BR")}`}
          />
          <label className="block text-sm text-cream/70">
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
          <DataLabel kind={place.flowLabel} label="fluxo horário" />
          <SliderControl label="Horas na visita" value={hours} min={0.5} max={8} step={0.5} onChange={setHours} />
          <SliderControl label="Visitas" value={visits} min={1} max={100} onChange={setVisits} />
          <SliderControl
            label="Observações / hora"
            value={observeRate}
            min={10}
            max={300}
            step={10}
            onChange={setObserveRate}
          />
        </div>
        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-wide text-cream/40 uppercase">p visita</p>
            <p className="font-mono text-3xl text-teal">
              <NumberTicker value={pVisit} digits={6} scientific />
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-cream/40 uppercase">
              P(≥1 reencontro)
            </p>
            <p className="font-mono text-4xl text-amber">
              <NumberTicker value={pAgain * 100} digits={2} suffix="%" />
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-cream/40 uppercase">E[X]</p>
            <p className="font-mono text-2xl text-cream">
              <NumberTicker value={expected} digits={3} />
            </p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

export function BinomialSlide() {
  const [n, setN] = useState(20);
  const [p, setP] = useState(0.15);
  const data = useMemo(
    () => binomialPmfSeries(n, p).map((prob, k) => ({ k, prob })),
    [n, p],
  );
  const mean = binomialExpected(n, p);

  return (
    <SlideShell eyebrow="Variável aleatória" title="Binomial e esperança" wide>
      <Formula display tex={String.raw`P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}\quad E[X]=np`} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <SliderControl label="n" value={n} min={5} max={40} onChange={setN} />
          <SliderControl
            label="p"
            value={p}
            min={0.02}
            max={0.5}
            step={0.01}
            onChange={setP}
            format={(v) => v.toFixed(2)}
          />
          <p className="text-sm text-cream/55">
            E[X] = <span className="font-mono text-amber">{mean.toFixed(2)}</span>
          </p>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="k" stroke="#9ca3af" fontSize={11} />
              <YAxis stroke="#9ca3af" fontSize={11} />
              <Tooltip
                contentStyle={{ background: "#12161c", border: "1px solid #333" }}
              />
              <Bar dataKey="prob" fill="#2dd4bf" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </SlideShell>
  );
}

export function PoissonSlide() {
  const [lambda, setLambda] = useState(3);
  const data = useMemo(
    () => poissonPmfSeries(lambda, 18).map((prob, k) => ({ k, prob })),
    [lambda],
  );
  const derived = poissonLambda({
    flowPerHour: 2500,
    hours: 2,
    observeRatePerHour: 80,
  });

  return (
    <SlideShell eyebrow="Fluxo raro" title="Poisson">
      <Formula display tex={String.raw`P(X=k)=e^{-\lambda}\dfrac{\lambda^k}{k!}`} />
      <p className="mt-3 text-sm text-cream/50">
        Exemplo derivado (centro JP, 2h, r=80): λ ≈ {derived.toFixed(3)}
      </p>
      <div className="mt-6" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="λ"
          value={lambda}
          min={0.5}
          max={12}
          step={0.5}
          onChange={setLambda}
          format={(v) => v.toFixed(1)}
        />
      </div>
      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="k" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} />
            <Tooltip
              contentStyle={{ background: "#12161c", border: "1px solid #333" }}
            />
            <Line type="monotone" dataKey="prob" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SlideShell>
  );
}

export function EncounterMonteCarloSlide() {
  const [p, setP] = useState(0.08);
  const [n, setN] = useState(100_000);
  const { run, running } = useMonteCarloWorker();
  const [result, setResult] = useState<{
    pHat: number;
    hits: number;
    ci95: { low: number; high: number };
  } | null>(null);

  const simulate = async () => {
    const r = await run({ type: "bernoulli", n, p });
    setResult({ pHat: r.pHat, hits: r.hits, ci95: r.ci95 });
  };

  return (
    <SlideShell eyebrow="Monte Carlo" title="Simular reencontros">
      <Formula display tex={String.raw`\hat p=\dfrac{k}{N}`} />
      <div className="mt-6 max-w-md space-y-4" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="p teórico"
          value={p}
          min={0.01}
          max={0.4}
          step={0.01}
          onChange={setP}
          format={(v) => v.toFixed(2)}
        />
        <SliderControl
          label="N simulações"
          value={n}
          min={1000}
          max={500_000}
          step={1000}
          onChange={setN}
          format={(v) => v.toLocaleString("pt-BR")}
        />
        <PrimaryButton onClick={simulate} disabled={running}>
          {running ? "Simulando…" : "Simular"}
        </PrimaryButton>
      </div>
      {result ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-cream/40">teórico</p>
            <p className="font-mono text-xl text-teal">{(p * 100).toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-xs text-cream/40">p̂</p>
            <p className="font-mono text-xl text-amber">{(result.pHat * 100).toFixed(3)}%</p>
          </div>
          <div>
            <p className="text-xs text-cream/40">hits</p>
            <p className="font-mono text-xl text-cream">
              {result.hits.toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      ) : null}
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
    <SlideShell eyebrow="Inferência" title="Intervalo de confiança 95%">
      <Formula
        display
        tex={String.raw`\hat p\pm 1{,}96\sqrt{\dfrac{\hat p(1-\hat p)}{n}}`}
      />
      <div className="mt-6 max-w-lg space-y-4" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="n"
          value={n}
          min={50}
          max={50_000}
          step={50}
          onChange={setN}
          format={(v) => v.toLocaleString("pt-BR")}
        />
        <p className="text-cream/60">
          Com p̂ fixo = 12% (ilustrativo), o intervalo encolhe quando n cresce.
        </p>
        <div className="relative h-12 rounded bg-white/5">
          <div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded bg-teal/80"
            style={{
              left: `${low * 100}%`,
              width: `${(high - low) * 100}%`,
            }}
          />
          <div
            className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-amber"
            style={{ left: `${pHat * 100}%` }}
          />
        </div>
        <p className="font-mono text-sm text-cream/80">
          [{(low * 100).toFixed(2)}%, {(high * 100).toFixed(2)}%]
        </p>
      </div>
    </SlideShell>
  );
}
