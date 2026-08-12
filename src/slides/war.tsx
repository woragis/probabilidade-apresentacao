"use client";

import { useEffect, useState } from "react";
import { Formula } from "@/components/deck/Formula";
import { PrimaryButton, SliderControl } from "@/components/deck/Controls";
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
      <SlideShell eyebrow="War" title="Com 10 x 5, eu conquisto?">
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
  const c32 = enumerateCombat(3, 2);

  return (
    <SlideShell eyebrow="Combate" title="Três números que importam" wide>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs tracking-[0.14em] text-text-subtle uppercase">1 vs 1</p>
          <p className="font-mono text-5xl text-teal">{(one * 100).toFixed(2)}%</p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs tracking-[0.14em] text-text-subtle uppercase">3 vs 2 (médias)</p>
          <ul className="mt-3 space-y-2 text-cream/80">
            <li>
              A perde <span className="font-mono text-amber">{c32.meanAttackerLosses.toFixed(3)}</span>
            </li>
            <li>
              D perde <span className="font-mono text-amber">{c32.meanDefenderLosses.toFixed(3)}</span>
            </li>
            <li className="text-xs text-text-subtle">
              universo: {c32.total.toLocaleString("pt-BR")}
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

  const step = () => {
    if (a <= 1 || d <= 0) return;
    const { attack, defend } = diceCounts(a, d);
    const aDice = rollDice(attack);
    const dDice = rollDice(defend);
    const o = resolveWarRoll(aDice, dDice);
    setA((x) => x - o.attackerLosses);
    setD((x) => x - o.defenderLosses);
    const line = `A[${aDice.join(",")}] vs D[${dDice.join(",")}] → −A${o.attackerLosses} −D${o.defenderLosses}`;
    setLogId((id) => id + 1);
    setLog((L) => [{ id: logId + 1, line }, ...L].slice(0, 6));
  };

  return (
    <SlideShell eyebrow="Cadeia" title="Uma decisão por rolagem">
      <div className="flex gap-10 text-center">
        <div>
          <p className="text-xs text-cream/40">Atacante</p>
          <p className="font-display text-5xl text-teal">{a}</p>
        </div>
        <div>
          <p className="text-xs text-cream/40">Defensor</p>
          <p className="font-display text-5xl text-amber">{d}</p>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <PrimaryButton onClick={step}>Resolver combate</PrimaryButton>
        <PrimaryButton
          onClick={() => {
            setA(8);
            setD(4);
            setLog([]);
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
      {d === 0 ? (
        <p className="mt-4 text-teal">Território conquistado.</p>
      ) : null}
      {a <= 1 && d > 0 ? (
        <p className="mt-4 text-amber">Ataque esgotado.</p>
      ) : null}
    </SlideShell>
  );
}

export function WarPartitionsSlide() {
  const count = warEqualPartitionCount();
  const approx = Number(count);

  return (
    <SlideShell eyebrow="Combinatória" title="Escala do setup inicial">
      <Formula display tex={String.raw`\dfrac{42!}{(7!)^{6}}\approx 1{,}03\times 10^{31}`} />
      <p className="mt-6 font-mono text-xl text-amber">
        {approx.toExponential(3)}
      </p>
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
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4" onKeyDown={(e) => e.stopPropagation()}>
          <SliderControl label="Tropas atacante" value={att} min={2} max={30} onChange={setAtt} />
          <SliderControl label="Tropas defensor" value={def} min={1} max={20} onChange={setDef} />
          <SliderControl
            label="Simulações"
            value={n}
            min={1000}
            max={200_000}
            step={1000}
            onChange={setN}
            format={(v) => v.toLocaleString("pt-BR")}
          />
          <PrimaryButton onClick={simulate} disabled={running}>
            {running ? "Simulando…" : "Simular conquistas"}
          </PrimaryButton>
        </div>
        <div className="grid place-items-center rounded border border-white/10 bg-white/[0.03] p-6">
          {result ? (
            <>
              <p className="text-xs text-text-subtle">p̂ conquista</p>
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
  return (
    <SlideShell eyebrow="Markov" title="War também é estado">
      <Formula
        display
        tex={String.raw`S_t=(\text{territórios},\text{tropas},\text{jogador},\ldots)`}
      />
      <Formula
        display
        className="mt-4 block"
        tex={String.raw`P(S_{t+1}\mid S_t)`}
      />
      <p className="mt-6 max-w-2xl text-text-subtle">Cada combate muda Sₜ e o próximo turno provável.</p>
    </SlideShell>
  );
}
