/** Sort descending: highest die first */
function sortDesc(dice: number[]): number[] {
  return [...dice].sort((a, b) => b - a);
}

export type WarOutcome = {
  attackerLosses: number;
  defenderLosses: number;
};

/**
 * One War combat roll (Grow): attacker and defender up to 3 dice.
 * Pair highest vs highest, then next, then next.
 * Ties go to the defender — the key unfairness vs a “fair” die.
 */
export function resolveWarRoll(
  attackerDice: number[],
  defenderDice: number[],
): WarOutcome {
  const a = sortDesc(attackerDice).slice(0, 3);
  const d = sortDesc(defenderDice).slice(0, 3);
  let attackerLosses = 0;
  let defenderLosses = 0;
  const pairs = Math.min(a.length, d.length);
  for (let i = 0; i < pairs; i++) {
    if (a[i]! > d[i]!) defenderLosses += 1;
    else attackerLosses += 1;
  }
  return { attackerLosses, defenderLosses };
}

export function rollDie(): number {
  return 1 + Math.floor(Math.random() * 6);
}

export function rollDice(n: number): number[] {
  return Array.from({ length: n }, rollDie);
}

/**
 * Dice each side rolls given troop counts (War / Grow).
 * Attacker must leave 1 behind, so dice = min(3, troops − 1).
 * Defender: one die per army, max 3 (Risk clássico é max 2).
 */
export function diceCounts(attackerTroops: number, defenderTroops: number): {
  attack: number;
  defend: number;
} {
  return {
    attack: Math.min(3, Math.max(0, attackerTroops - 1)),
    defend: Math.min(3, Math.max(0, defenderTroops)),
  };
}

/** Exact probability attacker wins a single comparison (one die vs one). */
export function pAttackerWinsOneVsOne(): number {
  // 36 outcomes; attacker wins when A > D
  let wins = 0;
  for (let a = 1; a <= 6; a++) {
    for (let d = 1; d <= 6; d++) {
      if (a > d) wins++;
    }
  }
  return wins / 36;
}

/** Enumerate all outcomes for a×d dice; return loss distribution. */
export function enumerateCombat(attackDice: number, defendDice: number): {
  total: number;
  pairs: number;
  /** P(attacker takes 0 losses) i.e. sweeps the comparison */
  pAttackerSweeps: number;
  /** P(defender takes 0 losses) */
  pDefenderSweeps: number;
  meanAttackerLosses: number;
  meanDefenderLosses: number;
  /** Mass on each (attackerLosses, defenderLosses) pair */
  byLosses: { attackerLosses: number; defenderLosses: number; count: number }[];
} {
  const aFaces = Math.pow(6, attackDice);
  const dFaces = Math.pow(6, defendDice);
  const total = aFaces * dFaces;
  const pairs = Math.min(attackDice, defendDice);
  const counts = new Map<string, { attackerLosses: number; defenderLosses: number; count: number }>();
  let sumA = 0;
  let sumD = 0;
  let attackerSweeps = 0;
  let defenderSweeps = 0;

  for (let ai = 0; ai < aFaces; ai++) {
    const aDice = facesToDice(ai, attackDice);
    for (let di = 0; di < dFaces; di++) {
      const dDice = facesToDice(di, defendDice);
      const { attackerLosses, defenderLosses } = resolveWarRoll(aDice, dDice);
      sumA += attackerLosses;
      sumD += defenderLosses;
      if (attackerLosses === 0) attackerSweeps++;
      if (defenderLosses === 0) defenderSweeps++;
      const key = `${attackerLosses},${defenderLosses}`;
      const prev = counts.get(key);
      if (prev) prev.count += 1;
      else counts.set(key, { attackerLosses, defenderLosses, count: 1 });
    }
  }

  const byLosses = [...counts.values()].sort(
    (x, y) => x.attackerLosses - y.attackerLosses || x.defenderLosses - y.defenderLosses,
  );

  return {
    total,
    pairs,
    pAttackerSweeps: attackerSweeps / total,
    pDefenderSweeps: defenderSweeps / total,
    meanAttackerLosses: sumA / total,
    meanDefenderLosses: sumD / total,
    byLosses,
  };
}

function facesToDice(index: number, n: number): number[] {
  const dice: number[] = [];
  let x = index;
  for (let i = 0; i < n; i++) {
    dice.push((x % 6) + 1);
    x = Math.floor(x / 6);
  }
  return dice;
}

const combatCache = new Map<string, ReturnType<typeof enumerateCombat>>();

function combatCached(attackDice: number, defendDice: number) {
  const key = `${attackDice}x${defendDice}`;
  const hit = combatCache.get(key);
  if (hit) return hit;
  const e = enumerateCombat(attackDice, defendDice);
  combatCache.set(key, e);
  return e;
}

/**
 * Exact P(conquer this territory) by walking the (A, D) chain.
 * Absorbing: D = 0 win, A ≤ 1 and D > 0 fail (must leave 1 on origin).
 */
export function pConquestExact(attackerTroops: number, defenderTroops: number): number {
  const memo = new Map<string, number>();
  const rec = (a: number, d: number): number => {
    if (d <= 0) return 1;
    if (a <= 1) return 0;
    const k = `${a},${d}`;
    const cached = memo.get(k);
    if (cached != null) return cached;
    const { attack, defend } = diceCounts(a, d);
    if (attack === 0) {
      memo.set(k, 0);
      return 0;
    }
    const e = combatCached(attack, defend);
    let s = 0;
    for (const row of e.byLosses) {
      s += (row.count / e.total) * rec(a - row.attackerLosses, d - row.defenderLosses);
    }
    memo.set(k, s);
    return s;
  };
  return rec(attackerTroops, defenderTroops);
}

/**
 * Simulate battles until attacker has 1 troop left or defender is wiped.
 * Returns true if territory conquered.
 */
export function simulateConquest(
  attackerTroops: number,
  defenderTroops: number,
): boolean {
  let a = attackerTroops;
  let d = defenderTroops;
  while (a > 1 && d > 0) {
    const { attack, defend } = diceCounts(a, d);
    const outcome = resolveWarRoll(rollDice(attack), rollDice(defend));
    a -= outcome.attackerLosses;
    d -= outcome.defenderLosses;
  }
  return d === 0;
}

/** Two-dice sum probability mass (classic). */
export function twoDiceSumPmf(): Map<number, number> {
  const m = new Map<number, number>();
  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {
      const s = a + b;
      m.set(s, (m.get(s) ?? 0) + 1 / 36);
    }
  }
  return m;
}

/** Pedagogical: 42 distinct territories into 6 labeled players, 7 each. */
export function warEqualPartitionCount(): bigint {
  // 42! / (7!)^6  — multinomial; players are distinguishable
  let num = BigInt(1);
  for (let i = 1; i <= 42; i++) num *= BigInt(i);
  let den = BigInt(1);
  for (let j = 0; j < 6; j++) {
    for (let i = 1; i <= 7; i++) den *= BigInt(i);
  }
  return num / den;
}
