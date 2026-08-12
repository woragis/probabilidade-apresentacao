/** Sort descending: highest die first */
function sortDesc(dice: number[]): number[] {
  return [...dice].sort((a, b) => b - a);
}

export type WarOutcome = {
  attackerLosses: number;
  defenderLosses: number;
};

/**
 * One War/Risk combat roll: attacker up to 3 dice, defender up to 2.
 * Pair highest vs highest, then second if both have ≥2 dice.
 */
export function resolveWarRoll(
  attackerDice: number[],
  defenderDice: number[],
): WarOutcome {
  const a = sortDesc(attackerDice).slice(0, 3);
  const d = sortDesc(defenderDice).slice(0, 2);
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

/** How many dice each side rolls given troop counts (classic Risk rules). */
export function diceCounts(attackerTroops: number, defenderTroops: number): {
  attack: number;
  defend: number;
} {
  return {
    attack: Math.min(3, Math.max(0, attackerTroops - 1)),
    defend: Math.min(2, defenderTroops),
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
  attackerWinsBoth: number;
  split: number;
  defenderWinsBoth: number;
  /** mean attacker losses */
  meanAttackerLosses: number;
  meanDefenderLosses: number;
} {
  const aFaces = Math.pow(6, attackDice);
  const dFaces = Math.pow(6, defendDice);
  const total = aFaces * dFaces;
  let attackerWinsBoth = 0;
  let split = 0;
  let defenderWinsBoth = 0;
  let sumA = 0;
  let sumD = 0;

  for (let ai = 0; ai < aFaces; ai++) {
    const aDice = facesToDice(ai, attackDice);
    for (let di = 0; di < dFaces; di++) {
      const dDice = facesToDice(di, defendDice);
      const { attackerLosses, defenderLosses } = resolveWarRoll(aDice, dDice);
      sumA += attackerLosses;
      sumD += defenderLosses;
      if (defenderLosses === 2 && attackerLosses === 0) attackerWinsBoth++;
      else if (attackerLosses === 2 && defenderLosses === 0) defenderWinsBoth++;
      else if (attackDice >= 2 && defendDice >= 2) split++;
    }
  }

  return {
    total,
    attackerWinsBoth,
    split,
    defenderWinsBoth,
    meanAttackerLosses: sumA / total,
    meanDefenderLosses: sumD / total,
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

/** Pedagogical: partitions of 42 territories into 6 equal piles of 7. */
export function warEqualPartitionCount(): bigint {
  // 42! / (7!)^6
  let num = BigInt(1);
  for (let i = 1; i <= 42; i++) num *= BigInt(i);
  let den = BigInt(1);
  for (let j = 0; j < 6; j++) {
    for (let i = 1; i <= 7; i++) den *= BigInt(i);
  }
  return num / den;
}
