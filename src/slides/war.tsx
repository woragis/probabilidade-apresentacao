"use client";

import { useEffect, useState } from "react";
import { Formula } from "@/components/deck/Formula";
import { PrimaryButton, SliderControl } from "@/components/deck/Controls";
import { Hint } from "@/components/deck/Hint";
import { MediaBackdrop } from "@/components/deck/MediaBackdrop";
import { NumberTicker } from "@/components/deck/NumberTicker";
import { SlideShell } from "@/components/deck/SlideShell";
import {
  diceCounts,
  enumerateCombat,
  pAttackerWinsOneVsOne,
  pConquestExact,
  resolveWarRoll,
  rollDice,
  warEqualPartitionCount,
  secondsToEnumerate,
  formatDurationPt,
} from "@/lib/math";
import { useMonteCarloWorker } from "@/lib/useMonteCarloWorker";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const HINTS = {
  umVsUm:
    "Um dado contra um: 36 pares equiprováveis. O atacante só ganha se o valor for ESTRITAMENTE maior. Empate fica com o defensor — por isso não é 50%, é 15/36 ≈ 41,67%. Essa é a assimetria do combate.",
  tresVsTres:
    "War (Grow): atacante e defensor até 3 dados. Comparam-se os maiores, depois os segundos, depois os terceiros. Não são três 1v1 independentes: os dados são ordenados. Universo: 6⁶ = 46.656.",
  perdas:
    "Perda média de exércitos numa rolagem 3v3, enumerando todos os 46.656 resultados. O defensor perde um pouco menos, em média, porque leva os empates.",
  tropasA:
    "Exércitos no território de origem. O atacante é obrigado a deixar 1 para trás, então os dados são min(3, tropas − 1). Com 10 tropas, rola 3 dados.",
  tropasD:
    "Exércitos no território defendido. No War, 1 dado por exército, máximo 3. (No Risk clássico o defensor só rola até 2 — aqui é War.)",
  sims:
    "N de Monte Carlo: quantas conquistas independentes do MESMO 1 território. Não é um jogo completo. Mais N → p̂ mais estável e IC mais estreito.",
  pHat:
    "Frequência de simulações em que o defensor chegou a 0. O atacante para se ficar com 1 tropa (não pode abandonar a origem). IC 95% assume tentativas i.i.d.",
  particao:
    "Multinomial: 42 territórios distintos para 6 jogadores nomeados, 7 cada. 42! / (7!)⁶ ≈ 8,57×10²⁸. Não divide por 6! (jogadores são distinguíveis). Não conta exércitos extras, cartas, nem 2–5 jogadores.",
  estado:
    "Numa batalha por UM território, o estado útil é o par (A, D) de tropas. Absorventes: D = 0 (conquistou) ou A = 1 (ataque esgotado). Cada rolagem é uma transição.",
  dados:
    "Quantos dados cada lado está rolando agora, pelas regras: A deixa 1 atrás; D até 3.",
  relogioWar:
    "Uma rolagem 3v3 tem 46.656 resultados. A 10⁹/s o computador enumera isto em microssegundos e depois fecha a cadeia (A, D) com a probabilidade exata. No xadrez a árvore inteira não cabe; aqui a batalha de um território cabe.",
  pExato:
    "Probabilidade exata de o defensor chegar a 0 antes de o atacante ficar com 1. Não é simulação: é a cadeia (A, D) resolvida. O Monte Carlo ao lado deve chegar perto.",
} as const;

export function WarHookSlide() {
  const reduced = usePrefersReducedMotion();
  const [faces, setFaces] = useState([3, 5, 2]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setFaces([
        1 + Math.floor(Math.random() * 6),
        1 + Math.floor(Math.random() * 6),
        1 + Math.floor(Math.random() * 6),
      ]);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className="relative h-full w-full">
      <MediaBackdrop src="/media/war/map.png" opacity={0.28} />
      <SlideShell eyebrow="War" title="Com 10 × 5, eu conquisto?">
        <p className="mt-2 max-w-2xl text-lg text-text-subtle">
          10 exércitos no seu território, 5 no do vizinho. Você ataca{" "}
          <span className="text-cream">este</span> território — não o mapa inteiro.
        </p>
        <ul className="mt-6 max-w-xl space-y-2 text-cream/80">
          <li>
            <span className="text-teal">Ganha</span> se o defensor chegar a 0.
          </li>
          <li>
            <span className="text-amber">Para (não conquistou)</span> se você ficar com 1 —
            tem que deixar alguém na origem.
          </li>
        </ul>
        <div className="mt-10 flex gap-3">
          {faces.map((f, i) => (
            <div
              key={i}
              className="grid h-16 w-16 place-items-center rounded-xl border border-amber/30 bg-ink-elevated font-display text-2xl text-amber"
            >
              {f}
            </div>
          ))}
        </div>
      </SlideShell>
    </div>
  );
}

export function WarCombatSlide() {
  const one = pAttackerWinsOneVsOne();
  const c33 = enumerateCombat(3, 3);

  return (
    <SlideShell eyebrow="Combate" title="Como se joga esta batalha" wide>
      <ol className="mb-4 max-w-3xl space-y-1.5 text-sm text-text-subtle">
        <li>
          1. Cada lado rola até 3 dados. Atacante deixa 1 na origem, então com 10 tropas
          rola 3; defensor com 5 também rola 3.
        </li>
        <li>
          2. Ordena do maior para o menor e compara par a par.{" "}
          <span className="text-cream">Maior estrito</span> ganha;{" "}
          <span className="text-amber">empate fica com a defesa</span>.
        </li>
        <li>
          3. Cada par: o perdedor perde 1 exército. Depois rola de novo até alguém
          parar — D = 0 (conquistou) ou A = 1 (ataque esgotado).
        </li>
      </ol>
      <div className="mb-5 grid max-w-lg grid-cols-[1fr_auto_1fr] items-center gap-3 font-mono text-sm">
        <div className="rounded border border-teal/30 bg-teal/10 p-3 text-center">
          <p className="mb-2 text-[10px] tracking-wide text-cream/40 uppercase">atacante</p>
          <p className="text-2xl text-teal">6 · 4 · 2</p>
        </div>
        <p className="text-cream/40">vs</p>
        <div className="rounded border border-amber/30 bg-amber/10 p-3 text-center">
          <p className="mb-2 text-[10px] tracking-wide text-cream/40 uppercase">defensor</p>
          <p className="text-2xl text-amber">5 · 4 · 1</p>
        </div>
        <p className="col-span-3 text-center text-xs text-text-subtle">
          6&gt;5 → D −1 · 4=4 → A −1 · 2&gt;1 → D −1 · nesta rolagem: A perde 1, D perde 2
        </p>
      </div>
      <p className="mb-4 max-w-2xl text-sm text-text-subtle">
        A armadilha: dados “justos” não tornam o combate justo. E 3v3 não é três vezes
        1v1 — os dados são ordenados.
      </p>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs tracking-[0.14em] text-text-subtle uppercase">
            <Hint title="1 vs 1" body={HINTS.umVsUm}>
              1 vs 1
            </Hint>
          </p>
          <p className="mt-2 font-mono text-4xl text-teal">{(one * 100).toFixed(2)}%</p>
          <p className="mt-2 text-sm text-cream/50">15/36 · empate → defesa</p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs tracking-[0.14em] text-text-subtle uppercase">
            <Hint title="3 vs 3" body={HINTS.tresVsTres}>
              3 vs 3 (War)
            </Hint>
          </p>
          <p className="mt-2 font-mono text-4xl text-amber">
            {c33.total.toLocaleString("pt-BR")}
          </p>
          <p className="mt-2 text-sm text-cream/50">6⁶ resultados · Risk é 3v2</p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs tracking-[0.14em] text-text-subtle uppercase">
            <Hint title="perdas médias" body={HINTS.perdas}>
              perdas médias
            </Hint>
          </p>
          <ul className="mt-3 space-y-2 text-cream/80">
            <li>
              A perde{" "}
              <span className="font-mono text-amber">{c33.meanAttackerLosses.toFixed(3)}</span>
            </li>
            <li>
              D perde{" "}
              <span className="font-mono text-teal">{c33.meanDefenderLosses.toFixed(3)}</span>
            </li>
          </ul>
        </div>
      </div>
    </SlideShell>
  );
}

export function WarChainSlide() {
  const [a, setA] = useState(8);
  const [d, setD] = useState(4);
  const [log, setLog] = useState<{ id: number; line: string }[]>([]);
  const [logId, setLogId] = useState(0);
  const [last, setLast] = useState<{ aDice: number[]; dDice: number[] } | null>(null);
  const dice = diceCounts(a, d);
  const conquered = d === 0;
  const exhausted = a <= 1 && d > 0;

  const step = () => {
    if (a <= 1 || d <= 0) return;
    const { attack, defend } = diceCounts(a, d);
    const aDice = rollDice(attack);
    const dDice = rollDice(defend);
    const o = resolveWarRoll(aDice, dDice);
    setLast({ aDice, dDice });
    setA((x) => x - o.attackerLosses);
    setD((x) => x - o.defenderLosses);
    const line = `A[${aDice.join(",")}] vs D[${dDice.join(",")}] → −A${o.attackerLosses} −D${o.defenderLosses}`;
    const nextId = logId + 1;
    setLogId(nextId);
    setLog((L) => [{ id: nextId, line }, ...L].slice(0, 6));
  };

  return (
    <SlideShell eyebrow="Cadeia" title="Rola, compara, tira exército">
      <p className="mb-5 max-w-2xl text-text-subtle">
        Começa 8 contra 4. Cada clique é uma rolagem.{" "}
        <span className="text-teal">D = 0: conquistou.</span>{" "}
        <span className="text-amber">A = 1: parou, o território continua do defensor.</span>
      </p>
      <div className="flex gap-10 text-center">
        <div>
          <p className="text-xs text-cream/40">
            <Hint title="Atacante" body={HINTS.tropasA}>
              Atacante
            </Hint>
          </p>
          <p className="font-display text-5xl text-teal">{a}</p>
        </div>
        <div>
          <p className="text-xs text-cream/40">
            <Hint title="Defensor" body={HINTS.tropasD}>
              Defensor
            </Hint>
          </p>
          <p className="font-display text-5xl text-amber">{d}</p>
        </div>
        <div>
          <p className="text-xs text-cream/40">
            <Hint title="dados" body={HINTS.dados}>
              dados agora
            </Hint>
          </p>
          <p className="font-mono text-2xl text-cream/70">
            {dice.attack} × {dice.defend}
          </p>
        </div>
      </div>
      {last ? (
        <p className="mt-4 font-mono text-sm text-cream/70">
          última: A [{last.aDice.join(" · ")}] vs D [{last.dDice.join(" · ")}]
        </p>
      ) : null}
      <div className="mt-6 flex gap-3">
        <PrimaryButton onClick={step} disabled={conquered || exhausted}>
          Rolar dados
        </PrimaryButton>
        <PrimaryButton
          onClick={() => {
            setA(8);
            setD(4);
            setLog([]);
            setLogId(0);
            setLast(null);
          }}
        >
          Reset
        </PrimaryButton>
      </div>
      <ul className="mt-6 space-y-1 font-mono text-xs text-text-subtle">
        {log.map((entry) => (
          <li key={entry.id}>{entry.line}</li>
        ))}
      </ul>
      {conquered ? (
        <p className="mt-4 text-teal">Conquistou: o defensor chegou a 0.</p>
      ) : null}
      {exhausted ? (
        <p className="mt-4 text-amber">
          Ataque esgotado: ficou 1 na origem. O defensor ficou com o território.
        </p>
      ) : null}
    </SlideShell>
  );
}

export function WarPartitionsSlide() {
  const count = warEqualPartitionCount();
  const approx = Number(count);

  return (
    <SlideShell eyebrow="Combinatória" title="Setup ≠ combate">
      <p className="mb-6 max-w-2xl text-text-subtle">
        <Hint title="partição" body={HINTS.particao}>
          42 territórios, 6 jogadores, 7 cada
        </Hint>
        . Isso é o começo do jogo, não a chance de conquistar um território. O
        número 1,03×10³¹ que aparece por aí está errado — o multinomial certo é
        ~10²⁸.
      </p>
      <Formula display tex={String.raw`\dfrac{42!}{(7!)^{6}}\approx 8{,}57\times 10^{28}`} />
      <p className="mt-6 font-mono text-xl text-amber">{approx.toExponential(3)}</p>
      <p className="mt-2 text-xs text-text-subtle">
        Valor exato (BigInt): {count.toString().slice(0, 12)}…
      </p>
    </SlideShell>
  );
}

export function WarSimulatorSlide() {
  const [att, setAtt] = useState(10);
  const [def, setDef] = useState(5);
  const [n, setN] = useState(50_000);
  const { run, running } = useMonteCarloWorker();
  const [result, setResult] = useState<{
    pHat: number;
    ci95: { low: number; high: number };
  } | null>(null);

  const pExact = pConquestExact(att, def);
  const rollOutcomes = 6 ** (diceCounts(att, def).attack + diceCounts(att, def).defend);
  const enumSeconds = secondsToEnumerate(rollOutcomes);

  const simulate = async () => {
    const r = await run({
      type: "warConquest",
      n,
      attackerTroops: att,
      defenderTroops: def,
    });
    setResult({ pHat: r.pHat, ci95: r.ci95 });
  };

  return (
    <SlideShell eyebrow="Monte Carlo" title="O computador já sabe. A simulação confere." wide>
      <p className="mb-6 max-w-3xl text-text-subtle">
        Ao contrário do xadrez, esta batalha cabe na máquina: ela enumera as rolagens e
        fecha a cadeia (A, D). Monte Carlo é o mesmo palpite, à força bruta.
      </p>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <SliderControl
            label="Tropas atacante"
            value={att}
            min={2}
            max={30}
            onChange={setAtt}
            hint={{ title: "Tropas atacante", body: HINTS.tropasA }}
          />
          <SliderControl
            label="Tropas defensor"
            value={def}
            min={1}
            max={20}
            onChange={setDef}
            hint={{ title: "Tropas defensor", body: HINTS.tropasD }}
          />
          <SliderControl
            label="Simulações"
            value={n}
            min={1000}
            max={200_000}
            step={1000}
            onChange={setN}
            format={(v) => v.toLocaleString("pt-BR")}
            hint={{ title: "Simulações", body: HINTS.sims }}
          />
          <PrimaryButton onClick={simulate} disabled={running}>
            {running ? "Simulando…" : "Simular conquistas"}
          </PrimaryButton>
        </div>
        <div className="space-y-4">
          <div className="rounded border border-teal/30 bg-teal/10 p-5">
            <p className="text-xs text-text-subtle uppercase">
              <Hint title="p exato" body={HINTS.pExato}>
                previsão do computador
              </Hint>
            </p>
            <p className="font-mono text-5xl text-teal">{(pExact * 100).toFixed(1)}%</p>
            <p className="mt-2 text-xs text-cream/45">
              <Hint title="relógio" body={HINTS.relogioWar}>
                enumerar esta rolagem
              </Hint>
              {": "}
              {formatDurationPt(enumSeconds)}
            </p>
          </div>
          <div className="rounded border border-white/10 bg-white/[0.03] p-5">
            {result ? (
              <>
                <p className="text-xs text-text-subtle">
                  <Hint title="p̂ conquista" body={HINTS.pHat}>
                    p̂ Monte Carlo
                  </Hint>
                </p>
                <p className="font-mono text-4xl text-amber">
                  <NumberTicker value={result.pHat * 100} digits={2} suffix="%" />
                </p>
                <p className="mt-3 text-sm text-text-subtle">
                  IC 95%: [{(result.ci95.low * 100).toFixed(2)}%,{" "}
                  {(result.ci95.high * 100).toFixed(2)}%]
                </p>
              </>
            ) : (
              <p className="text-text-subtle">Rode a simulação para ver p̂ ao lado do exato.</p>
            )}
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

export function WarMarkovSlide() {
  const [a, setA] = useState(5);
  const [d, setD] = useState(3);
  const Avals = [5, 4, 3, 2, 1];
  const Dvals = [0, 1, 2, 3, 4];

  const step = () => {
    if (a <= 1 || d <= 0) return;
    const { attack, defend } = diceCounts(a, d);
    const o = resolveWarRoll(rollDice(attack), rollDice(defend));
    setA((x) => Math.max(1, x - o.attackerLosses));
    setD((x) => Math.max(0, x - o.defenderLosses));
  };

  const absorbed = d === 0 || a <= 1;

  return (
    <SlideShell eyebrow="Markov" title="No War, o estado é o par (A, D)" wide>
      <p className="mb-5 max-w-3xl text-text-subtle">
        Cada célula é um estado. Verde: conquistou (D = 0). Âmbar: ataque esgotado (A = 1).
        Uma rolagem só anda para um vizinho com menos tropas — memória do caminho não importa.
      </p>
      <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
        <div className="overflow-x-auto">
          <div className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(${Dvals.length}, 2.6rem)` }}>
            <div />
            {Dvals.map((dv) => (
              <div key={`h-${dv}`} className="text-center font-mono text-[10px] text-cream/40">
                D={dv}
              </div>
            ))}
            {Avals.map((av) => (
              <div key={`row-${av}`} className="contents">
                <div className="grid place-items-center pr-2 font-mono text-[10px] text-cream/40">
                  A={av}
                </div>
                {Dvals.map((dv) => {
                  const here = av === a && dv === d;
                  const win = dv === 0;
                  const stuck = av === 1 && dv > 0;
                  return (
                    <button
                      key={`${av}-${dv}`}
                      type="button"
                      onClick={() => {
                        setA(av);
                        setD(dv);
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                      className={`h-10 w-10 rounded border text-[10px] font-mono ${
                        here
                          ? "border-amber bg-amber text-ink"
                          : win
                            ? "border-teal/40 bg-teal/20 text-teal"
                            : stuck
                              ? "border-amber/30 bg-amber/10 text-amber/80"
                              : "border-white/10 bg-white/5 text-cream/50"
                      }`}
                    >
                      {av},{dv}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <p className="font-mono text-2xl text-cream">
            ({a}, {d})
          </p>
          {d === 0 ? <p className="text-teal">absorveu: conquista</p> : null}
          {a <= 1 && d > 0 ? <p className="text-amber">absorveu: esgotou</p> : null}
          <PrimaryButton onClick={step}>Rolar uma transição</PrimaryButton>
          <PrimaryButton
            onClick={() => {
              setA(5);
              setD(3);
            }}
          >
            Voltar a (5,3)
          </PrimaryButton>
          {absorbed ? (
            <p className="text-xs text-cream/40">Clique outra célula para recomeçar.</p>
          ) : null}
        </div>
      </div>
    </SlideShell>
  );
}
