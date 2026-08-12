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
import { Hint } from "@/components/deck/Hint";
import { MediaBackdrop } from "@/components/deck/MediaBackdrop";
import { NumberTicker } from "@/components/deck/NumberTicker";
import { SlideShell } from "@/components/deck/SlideShell";
import {
  binomialExpected,
  binomialPmfSeries,
  CITIES,
  calendarDaysFromVisits,
  expectedReencounters,
  expectedVisitsUntilFirst,
  observationsPerVisit,
  pAtLeastOneReencounter,
  pNoticeOnce,
  poissonLambda,
  poissonPmfSeries,
  sampleGeometricTrials,
  visitsUntilCdf,
  type CityKey,
} from "@/lib/math";
import { useMonteCarloWorker } from "@/lib/useMonteCarloWorker";

const HINTS = {
  cidade:
    "Só escolhe o cenário (população observada + lugares). A população da cidade aparece como contexto: ela NÃO entra no denominador. Quem circula na orla não é João Pessoa inteira.",
  lugar:
    "O recorte espacial do modelo. Cada lugar traz um fluxo/hora (intensidade) e um N efetivo padrão (universo de pessoas distintas). Trocar de orla para faculdade muda o pool, não só o movimento.",
  popCidade:
    "Habitantes da cidade (censo). Serve para comparar escala entre JP, Recife, SP… Não é o N da fórmula. Usar isso como denominador na orla misturaria milhões de pessoas que nunca passam ali.",
  fluxo:
    "Pessoas por hora naquele trecho — uma TAXA, não um conjunto fechado. 1.200/h na orla não são as mesmas 1.200 toda hora. Fluxo alto com muita rotatividade empurra o N efetivo para cima; sozinho ele não é o denominador.",
  nEfetivo:
    "N: pessoas DISTINTAS que frequentam o lugar no horizonte das suas visitas (dias/semanas). É o universo de amostragem. p ≈ k/N. Orla aberta → N grande → reencontro raro. Faculdade → N menor e gente que volta → reencontro mais fácil. Parâmetro do modelo, não censo.",
  horas:
    "h: quanto tempo dura UMA visita. Multiplica as observações: k = h × r. Ficar mais tempo é olhar mais gente naquela ida — não é o mesmo que voltar outro dia (isso é n, visitas).",
  visitas:
    "n: quantas idas independentes no horizonte. X ~ Binomial(n, p_visita). P(reencontro) = 1 − (1 − p)ⁿ. O modelo assume independência: na vida real rotina (trabalho, academia) aumenta a chance.",
  idasSemana:
    "Quantas vezes por semana você volta ao mesmo lugar. Converte visitas em dias de calendário: dias = visitas × 7 / idas-por-semana. 7 = todo dia; 1 = só no fim de semana.",
  espera:
    "Espera geométrica: cada ida é um sorteio com chance p. E[T] = 1/p visitas até o primeiro acerto. Em dias: (1/p) × 7 / idas-por-semana. 50% e 90% são quantis — não é garantia.",
  sorteioEspera:
    "Uma história sorteada: quantas idas (e dias) até o primeiro acerto nesta realização. A média de muitas histórias chega em E[T]; uma história isolada oscila.",
  obsHora:
    "r: quantas pessoas você de fato “nota” por hora — rostos que entram na sua atenção, não todo mundo que passa. k = h × r olhadelas por visita. Se r for maior que o fluxo, você está superestimando o que dá para ver.",
  k: "k = h × r: total de olhadelas numa visita. Cada uma tem chance ≈ 1/N de ser o alvo, no modelo uniforme. p_visita = 1 − (1 − 1/N)^k ≈ k/N quando k ≪ N.",
  pVisita:
    "Probabilidade de notar aquela pessoa específica em UMA visita. Ainda não é o reencontro ao longo do tempo — isso empilha n visitas na binomial.",
  pReencontro:
    "P(X ≥ 1) = 1 − (1 − p)ⁿ: chance de pelo menos um acerto em n visitas. Não é “encontrar alguém”, é rever UM alvo que já está no pool N. Se o número parecer absurdo, questione N — não o 1−(1−p)ⁿ.",
  esperado:
    "E[X] = n × p: quantos reencontros você esperaria em média se repetisse o experimento muitas vezes. Pode ser 0,04 — ou seja, na maioria das histórias não acontece, mas o esperado não é zero.",
  binomialN: "n da binomial: número de tentativas (visitas). Cada uma é sucesso/fracasso com a mesma p, independentes.",
  binomialP: "p da binomial: chance de sucesso em UMA tentativa — aqui, notar o alvo numa visita. No simulador anterior isso saía de k e N.",
  binomialMean: "E[X] = n p. Onde a massa da distribuição se concentra. p pequeno e n grande ainda pode gerar esperado visível.",
  poissonLambda:
    "λ: encontros esperados na janela. No modelo raro, λ ≈ (n × h × r) / N. Poisson(λ) aproxima a binomial quando n é grande e p é pequeno, com λ = n p.",
  poissonDerived:
    "λ derivado do exemplo da orla (N = 80 mil, 20 visitas, 2 h, 80 obs/h). É a taxa média de “acertos” do alvo — bem menor do que se o denominador fosse o fluxo 1.200.",
  mcP: "p teórico da Bernoulli: a probabilidade “de verdade” que a simulação tenta recuperar. Cada trial é sucesso com chance p.",
  mcN: "N de simulação (não confundir com N efetivo da orla): quantos experimentos aleatórios rodar. Mais N → p̂ mais estável e IC mais estreito.",
  mcTeorico: "O valor que o modelo analítico afirma. A simulação deve chegar perto — diferença pequena é o ponto, não coincidência perfeita.",
  mcPhat: "p̂ = hits / N. Frequência relativa observada. Lei dos grandes números: com N grande, p̂ → p.",
  mcHits: "Quantos trials deram “sucesso”. Binomial(N, p) na prática. p̂ = hits / N.",
  ciN: "n da amostra para o intervalo de confiança de uma proporção. SE = √(p̂(1−p̂)/n). Mais n, barra mais estreita — menos incerteza, não “mais verdade absoluta”.",
} as const;

function formatWait(days: number): { amount: number; unit: string; daysLabel: string } {
  if (!Number.isFinite(days)) {
    return { amount: Number.POSITIVE_INFINITY, unit: "", daysLabel: "∞" };
  }
  const daysLabel = `${Math.round(days).toLocaleString("pt-BR")} dias`;
  if (days < 60) return { amount: days, unit: "dias", daysLabel };
  const months = days / 30.437;
  if (months < 18) {
    return { amount: months, unit: "meses", daysLabel };
  }
  return { amount: days / 365.25, unit: "anos", daysLabel };
}

export function EncounterHookSlide() {
  return (
    <div className="relative h-full w-full">
      <MediaBackdrop src="/media/encounters/times-square.jpg" opacity={0.35} />
      <SlideShell eyebrow="Encontros" title="Vou ver essa pessoa de novo?">
        <p className="font-mono text-6xl text-amber md:text-8xl">?</p>
        <p className="mt-6 max-w-2xl text-lg text-text-subtle">
          O denominador é a população efetiva do lugar — não o fluxo por hora e
          não a população da cidade.
        </p>
      </SlideShell>
    </div>
  );
}

export function EncounterModelSlide() {
  return (
    <SlideShell eyebrow="Encontros" title="Modelo em 3 passos">
      <div className="space-y-6">
        <div>
          <p className="mb-1 text-xs tracking-[0.14em] text-cream/40 uppercase">1. olhadelas numa visita</p>
          <Formula display tex={String.raw`k = h\cdot r`} />
          <p className="mt-1 text-sm text-text-subtle">
            h = horas na visita · r = rostos notados por hora · k = olhadelas
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs tracking-[0.14em] text-cream/40 uppercase">2. chance nessa visita</p>
          <Formula display tex={String.raw`p_{\text{visita}}=1-\Bigl(1-\frac{1}{N}\Bigr)^{k}`} />
          <p className="mt-1 text-sm text-text-subtle">
            N = pessoas distintas do lugar — não o fluxo por hora
          </p>
        </div>
        <div>
          <p className="mb-1 text-xs tracking-[0.14em] text-cream/40 uppercase">3. ao menos um acerto em n idas</p>
          <Formula display tex={String.raw`P(X\ge 1)=1-(1-p_{\text{visita}})^{n}`} />
          <p className="mt-1 text-sm text-text-subtle">
            n = visitas. Independência entre visitas é hipótese.
          </p>
        </div>
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
  const [visitsPerWeek, setVisitsPerWeek] = useState(3);
  const [observeRate, setObserveRate] = useState(80);
  const [effectiveN, setEffectiveN] = useState(place.effectivePopulation);
  const [story, setStory] = useState<{ visits: number; days: number } | null>(null);

  const syncPlace = (nextCityKey: CityKey, nextPlaceId: string) => {
    const nextCity = CITIES.find((c) => c.key === nextCityKey)!;
    const nextPlace = nextCity.places.find((p) => p.id === nextPlaceId) ?? nextCity.places[0]!;
    setCityKey(nextCityKey);
    setPlaceId(nextPlace.id);
    setEffectiveN(nextPlace.effectivePopulation);
    setStory(null);
  };

  const k = observationsPerVisit(hours, observeRate);
  const pVisit = pNoticeOnce({
    effectivePopulation: effectiveN,
    hours,
    observeRatePerHour: observeRate,
  });
  const pAgain = pAtLeastOneReencounter(pVisit, visits);
  const expected = expectedReencounters(pVisit, visits);
  const waitVisits = expectedVisitsUntilFirst(pVisit);
  const waitDays = calendarDaysFromVisits(waitVisits, visitsPerWeek);
  const wait = formatWait(waitDays);
  const median = formatWait(
    calendarDaysFromVisits(visitsUntilCdf(pVisit, 0.5), visitsPerWeek),
  );
  const almost = formatWait(
    calendarDaysFromVisits(visitsUntilCdf(pVisit, 0.9), visitsPerWeek),
  );

  const drawStory = () => {
    const n = sampleGeometricTrials(pVisit);
    setStory({ visits: n, days: calendarDaysFromVisits(n, visitsPerWeek) });
  };

  return (
    <SlideShell eyebrow="Simulator" title="Em quantos dias eu veria de novo?" wide>
      <p className="mb-5 max-w-3xl text-text-subtle">
        Vi aquela pessoa. Cada volta ao lugar é um sorteio. A espera até o primeiro
        acerto é geométrica: E[T] = 1/p.
      </p>
      <div className="grid gap-8 xl:grid-cols-[320px_1fr_280px]">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <label className="block text-sm text-text-subtle">
            <Hint title="Cidade" body={HINTS.cidade}>
              Cidade
            </Hint>
            <select
              className="mt-1 w-full rounded border border-white/15 bg-ink-elevated px-3 py-2 text-cream"
              value={cityKey}
              onChange={(e) => {
                const nextKey = e.target.value as CityKey;
                const nextCity = CITIES.find((c) => c.key === nextKey)!;
                syncPlace(nextKey, nextCity.places[0]!.id);
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
            <Hint title="Lugar" body={HINTS.lugar}>
              Lugar
            </Hint>
            <select
              className="mt-1 w-full rounded border border-white/15 bg-ink-elevated px-3 py-2 text-cream"
              value={place.id}
              onChange={(e) => syncPlace(cityKey, e.target.value)}
            >
              {city.places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (F={p.flowPerHour.toLocaleString("pt-BR")}/h)
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-2">
            <DataLabel
              kind="observado"
              label={`cidade ${city.population.toLocaleString("pt-BR")}`}
              hint={HINTS.popCidade}
            />
            <DataLabel
              kind={place.flowLabel}
              label={`fluxo ${place.flowPerHour.toLocaleString("pt-BR")}/h`}
              hint={HINTS.fluxo}
            />
            <DataLabel kind={place.populationLabel} label="N efetivo" hint={HINTS.nEfetivo} />
          </div>
          <SliderControl
            label="N efetivo"
            value={effectiveN}
            min={1_000}
            max={2_000_000}
            step={1_000}
            onChange={setEffectiveN}
            format={(v) => v.toLocaleString("pt-BR")}
            hint={{ title: "N efetivo", body: HINTS.nEfetivo, side: "right" }}
          />
          <SliderControl
            label="Horas na visita"
            value={hours}
            min={0.5}
            max={8}
            step={0.5}
            onChange={setHours}
            hint={{ title: "Horas (h)", body: HINTS.horas, side: "right" }}
          />
          <SliderControl
            label="Idas por semana"
            value={visitsPerWeek}
            min={1}
            max={7}
            onChange={setVisitsPerWeek}
            hint={{ title: "Idas por semana", body: HINTS.idasSemana, side: "right" }}
          />
          <SliderControl
            label="Horizonte (visitas)"
            value={visits}
            min={1}
            max={100}
            onChange={setVisits}
            hint={{ title: "Visitas (n)", body: HINTS.visitas, side: "right" }}
          />
          <SliderControl
            label="Observações/h"
            value={observeRate}
            min={10}
            max={300}
            step={10}
            onChange={setObserveRate}
            hint={{ title: "Observações/h (r)", body: HINTS.obsHora, side: "right" }}
          />
        </div>
        <div className="grid place-items-center rounded border border-white/10 bg-white/[0.03] p-8">
          <div className="text-center">
            <p className="text-xs tracking-[0.16em] text-text-subtle uppercase">
              <Hint title="Espera até o 1º acerto" body={HINTS.espera}>
                esperança até o 1º reencontro
              </Hint>
            </p>
            {Number.isFinite(wait.amount) ? (
              <p className="font-mono text-5xl text-amber md:text-6xl">
                <NumberTicker value={wait.amount} digits={wait.unit === "dias" ? 0 : 1} />
                <span className="ml-2 text-3xl text-amber/80">{wait.unit}</span>
              </p>
            ) : (
              <p className="font-mono text-5xl text-amber">∞</p>
            )}
            <p className="mt-2 text-sm text-text-subtle">{wait.daysLabel}</p>
            <p className="mt-4 text-sm text-text-subtle">
              {visitsPerWeek} ida{visitsPerWeek === 1 ? "" : "s"}/semana
              {" · "}
              <Hint title="k" body={HINTS.k}>
                k={k.toLocaleString("pt-BR")}
              </Hint>
              {" · "}
              <Hint title="p visita" body={HINTS.pVisita}>
                p=
              </Hint>
              <span className="font-mono text-teal">{pVisit.toExponential(2)}</span>
            </p>
            <p className="mt-5 text-sm text-cream/70">
              50% em {median.daysLabel}
              {" · "}
              90% em {almost.daysLabel}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs tracking-[0.16em] text-text-subtle uppercase">
            <Hint title="P(reencontro)" body={HINTS.pReencontro}>
              P em {visits} idas
            </Hint>
          </p>
          <p className="font-mono text-4xl text-teal">
            <NumberTicker value={pAgain * 100} digits={2} suffix="%" />
          </p>
          <p className="text-sm text-text-subtle">
            E[X] = <span className="font-mono text-cream">{expected.toFixed(3)}</span>
            . Faculdade (N menor) reencontra mais cedo que a orla aberta.
          </p>
          <PrimaryButton onClick={drawStory}>Sortear uma história</PrimaryButton>
          {story ? (
            <p className="text-sm text-text-subtle">
              <Hint title="nessa história" body={HINTS.sorteioEspera}>
                nessa história:
              </Hint>{" "}
              <span className="text-cream">
                {Number.isFinite(story.visits)
                  ? `${story.visits.toLocaleString("pt-BR")} idas · ${formatWait(story.days).daysLabel}`
                  : "nunca"}
              </span>
            </p>
          ) : (
            <p className="text-sm text-text-subtle">Uma realização da espera geométrica.</p>
          )}
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
  const [trial, setTrial] = useState<boolean[] | null>(null);

  const runTrial = () => {
    setTrial(Array.from({ length: n }, () => Math.random() < p));
  };

  const hits = trial?.filter(Boolean).length;

  return (
    <SlideShell eyebrow="Variável aleatória" title="n visitas, mesma chance" wide>
      <p className="mb-5 max-w-3xl text-text-subtle">
        Você volta à orla <span className="text-cream">{n} vezes</span>. Cada ida: ou vê aquela
        pessoa, ou não — mesma p. Binomial = <span className="text-cream">contar quantos “sim”</span>{" "}
        nessas n idas.
      </p>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <SliderControl
            label="n — quantas idas"
            value={n}
            min={5}
            max={40}
            onChange={(v) => {
              setN(v);
              setTrial(null);
            }}
            hint={{ title: "n", body: HINTS.binomialN }}
          />
          <SliderControl
            label="p — chance numa ida"
            value={p}
            min={0.02}
            max={0.5}
            step={0.01}
            onChange={(v) => {
              setP(v);
              setTrial(null);
            }}
            format={(v) => v.toFixed(2)}
            hint={{ title: "p", body: HINTS.binomialP }}
          />
          <p className="text-sm text-text-subtle">
            Em média espera{" "}
            <Hint title="E[X]" body={HINTS.binomialMean}>
              <span className="font-mono text-amber">{mean.toFixed(1)}</span>
            </Hint>{" "}
            acertos.
          </p>
          <PrimaryButton onClick={runTrial}>Sortear n visitas</PrimaryButton>
          {hits != null ? (
            <p className="text-sm text-text-subtle">
              nesta história: <span className="font-mono text-teal">{hits}</span> sim
            </p>
          ) : null}
        </div>
        <div>
          <p className="mb-2 text-xs tracking-[0.14em] text-cream/40 uppercase">
            cada tile = uma visita · âmbar = viu
          </p>
          {trial ? (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {trial.map((hit, i) => (
                <div
                  key={i}
                  className={`grid h-8 w-8 place-items-center rounded-md text-[10px] font-mono ${
                    hit ? "bg-amber text-ink" : "bg-white/10 text-cream/35"
                  }`}
                  title={`visita ${i + 1}: ${hit ? "sim" : "não"}`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-4 text-sm text-cream/40">Clique para ver uma história de n idas.</p>
          )}
          <div className="h-40">
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
          <p className="mt-3 text-sm text-text-subtle">
            A barra é a lei (quantos “sim” são comuns). Os tiles são <em>uma</em> história.
          </p>
        </div>
      </div>
      <p className="mt-4 font-mono text-sm text-cream/45">
        <Formula tex={String.raw`X\sim\mathrm{Bin}(n,p)\quad E[X]=np`} />
      </p>
    </SlideShell>
  );
}

export function PoissonSlide() {
  const [lambda, setLambda] = useState(3);
  const data = useMemo(() => poissonPmfSeries(lambda, 18).map((prob, k) => ({ k, prob })), [lambda]);
  const derived = poissonLambda({
    effectivePopulation: 80_000,
    hours: 2,
    observeRatePerHour: 80,
    visits: 20,
  });
  const [marks, setMarks] = useState<number[] | null>(null);

  const sprinkle = () => {
    const L = Math.exp(-lambda);
    let k = 0;
    let prod = 1;
    do {
      k++;
      prod *= Math.random();
    } while (prod > L);
    const count = k - 1;
    setMarks(
      Array.from({ length: count }, () => Math.random()).sort((a, b) => a - b),
    );
  };

  return (
    <SlideShell eyebrow="Processo" title="Raro demais para contar visitas" wide>
      <p className="mb-5 max-w-3xl text-text-subtle">
        Binomial = n tentativas. Poisson = uma <span className="text-cream">taxa no tempo</span>:
        quantos, em média, nesta janela. λ é esse esperado — não um “número mágico”.
      </p>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div onKeyDown={(e) => e.stopPropagation()}>
          <p className="mb-1 text-xs tracking-[0.14em] text-cream/40 uppercase">na orla (N certo)</p>
          <p className="mb-3 font-mono text-2xl text-amber">
            <Hint title="λ derivado" body={HINTS.poissonDerived}>
              λ ≈ {derived.toFixed(3)}
            </Hint>
          </p>
          <p className="mb-4 text-sm text-text-subtle">
            Quase zero: o raro não explode. O slider abaixo é só para ver o desenho.
          </p>
          <SliderControl
            label="λ — esperado na janela"
            value={lambda}
            min={0.5}
            max={12}
            step={0.5}
            onChange={(v) => {
              setLambda(v);
              setMarks(null);
            }}
            format={(v) => v.toFixed(1)}
            hint={{ title: "λ", body: HINTS.poissonLambda }}
          />
          <div className="mt-4">
            <PrimaryButton onClick={sprinkle}>Sortear uma janela</PrimaryButton>
          </div>
          {marks ? (
            <p className="mt-3 font-mono text-sm text-teal">{marks.length} pontos nesta janela</p>
          ) : null}
        </div>
        <div>
          <p className="mb-2 text-xs tracking-[0.14em] text-cream/40 uppercase">
            uma janela de tempo · cada ponto = o raro caiu
          </p>
          <div className="relative mb-5 h-16 rounded-2xl border border-white/10 bg-white/[0.04]">
            <span className="absolute top-1.5 left-3 text-[10px] tracking-wide text-cream/35 uppercase">
              início
            </span>
            <span className="absolute top-1.5 right-3 text-[10px] tracking-wide text-cream/35 uppercase">
              fim
            </span>
            <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-white/20" />
            {marks?.map((t, i) => (
              <span
                key={`${t}-${i}`}
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_12px_rgba(217,164,65,0.7)]"
                style={{ left: `${8 + t * 84}%` }}
              />
            ))}
          </div>
          <div className="h-40">
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
      </div>
      <p className="mt-4 font-mono text-sm text-cream/45">
        <Formula tex={String.raw`P(K=k)=e^{-\lambda}\lambda^{k}/k!`} />
      </p>
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
      <p className="mb-6 max-w-2xl text-text-subtle">
        É o slide anterior, com N enorme. Teórico = a fórmula; p̂ = frequência. Devem se
        aproximar. Bernoulli i.i.d. — não o modelo completo da orla.
      </p>
      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <SliderControl
            label="p teórico"
            value={p}
            min={0.01}
            max={0.4}
            step={0.01}
            onChange={setP}
            format={(v) => v.toFixed(2)}
            hint={{ title: "p teórico", body: HINTS.mcP }}
          />
          <SliderControl
            label="N"
            value={n}
            min={1000}
            max={500_000}
            step={1000}
            onChange={setN}
            format={(v) => v.toLocaleString("pt-BR")}
            hint={{ title: "N (simulação)", body: HINTS.mcN }}
          />
          <PrimaryButton onClick={simulate} disabled={running}>
            {running ? "Simulando…" : "Simular"}
          </PrimaryButton>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-text-subtle uppercase">
              <Hint title="teórico" body={HINTS.mcTeorico}>
                teórico
              </Hint>
            </p>
            <p className="font-mono text-2xl text-teal">{(p * 100).toFixed(2)}%</p>
          </div>
          <div className="rounded border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-text-subtle uppercase">
              <Hint title="p̂" body={HINTS.mcPhat}>
                p̂
              </Hint>
            </p>
            <p className="font-mono text-2xl text-amber">{result ? `${(result.pHat * 100).toFixed(3)}%` : "—"}</p>
          </div>
          <div className="rounded border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-text-subtle uppercase">
              <Hint title="hits" body={HINTS.mcHits}>
                hits
              </Hint>
            </p>
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
      <p className="mb-5 max-w-2xl text-text-subtle">
        A faixa de incerteza daquela frequência. IC 95% = onde o método acerta ~95% das
        vezes. Aqui p̂ está <span className="text-cream">fixo em 12%</span>. Mais n estreita a
        barra — não “prova mais”.
      </p>
      <div className="max-w-2xl space-y-5" onKeyDown={(e) => e.stopPropagation()}>
        <SliderControl
          label="n"
          value={n}
          min={50}
          max={50_000}
          step={50}
          onChange={setN}
          format={(v) => v.toLocaleString("pt-BR")}
          hint={{ title: "n (amostra)", body: HINTS.ciN }}
        />
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
