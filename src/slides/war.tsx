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
  resolveWarRoll,
  rollDice,
  warEqualPartitionCount,
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
          Um território, regras do War: até 3 dados de cada lado, empate com a
          defesa. Não é o jogo inteiro — é essa batalha.
        </p>
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
    <SlideShell eyebrow="Combate" title="Empate não é 50%" wide>
      <p className="mb-6 max-w-2xl text-text-subtle">
        A armadilha: dados “justos” não tornam o combate justo. O defensor leva o
        empate. E 3v3 não é três vezes 1v1 — os dados são ordenados.
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
  const dice = diceCounts(a, d);

  const step = () => {
    if (a <= 1 || d <= 0) return;
    const { attack, defend } = diceCounts(a, d);
    const aDice = rollDice(attack);
    const dDice = rollDice(defend);
    const o = resolveWarRoll(aDice, dDice);
    setA((x) => x - o.attackerLosses);
    setD((x) => x - o.defenderLosses);
    const line = `A[${aDice.join(",")}] vs D[${dDice.join(",")}] → −A${o.attackerLosses} −D${o.defenderLosses}`;
    const nextId = logId + 1;
    setLogId(nextId);
    setLog((L) => [{ id: nextId, line }, ...L].slice(0, 6));
  };

  return (
    <SlideShell eyebrow="Cadeia" title="Uma decisão por rolagem">
      <p className="mb-6 max-w-2xl text-text-subtle">
        Cada rolagem atualiza o par (A, D). O atacante para em 1 tropa — tem que
        deixar alguém na origem.
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
      <div className="mt-6 flex gap-3">
        <PrimaryButton onClick={step}>Resolver combate</PrimaryButton>
        <PrimaryButton
          onClick={() => {
            setA(8);
            setD(4);
            setLog([]);
            setLogId(0);
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
      {d === 0 ? <p className="mt-4 text-teal">Território conquistado.</p> : null}
      {a <= 1 && d > 0 ? <p className="mt-4 text-amber">Ataque esgotado.</p> : null}
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
    <SlideShell eyebrow="Monte Carlo" title="Responder com simulação" wide>
      <p className="mb-6 max-w-2xl text-text-subtle">
        A pergunta do hook, agora com N batalhas i.i.d. do mesmo 10×5 (ou o que
        você escolher). War: defensor até 3 dados.
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
        <div className="grid place-items-center rounded border border-white/10 bg-white/[0.03] p-6">
          {result ? (
            <>
              <p className="text-xs text-text-subtle">
                <Hint title="p̂ conquista" body={HINTS.pHat}>
                  p̂ conquista
                </Hint>
              </p>
              <p className="font-mono text-6xl text-amber">
                <NumberTicker value={result.pHat * 100} digits={2} suffix="%" />
              </p>
              <p className="mt-4 text-sm text-text-subtle">
                IC 95%: [{(result.ci95.low * 100).toFixed(2)}%,{" "}
                {(result.ci95.high * 100).toFixed(2)}%]
              </p>
            </>
          ) : (
            <p className="text-text-subtle">Rode a simulação.</p>
          )}
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
