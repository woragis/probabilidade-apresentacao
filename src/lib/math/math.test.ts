import { describe, expect, it } from "vitest";
import {
  bayes,
  bayesBinary,
  binomialExpected,
  binomialPmf,
  combinations,
  confidenceInterval95,
  enumerateCombat,
  diceCounts,
  resolveWarRoll,
  warPairComparisons,
  warEqualPartitionCount,
  pAttackerWinsOneVsOne,
  pConquestExact,
  perftSequences,
  naiveUniformSequences,
  naivePathProbability,
  uniformOverLeavesProbability,
  pNoticeOnce,
  expectedVisitsUntilFirst,
  visitsUntilCdf,
  calendarDaysFromVisits,
  sampleGeometricTrials,
  twoDiceSumPmf,
  secondsToEnumerate,
  formatDurationPt,
  SHANNON_GAME_TREE,
} from "./index";

describe("combinatorics", () => {
  it("C(5,2) = 10", () => {
    expect(combinations(5, 2)).toBe(10);
  });
});

describe("dice", () => {
  it("P(sum=7) = 6/36", () => {
    const pmf = twoDiceSumPmf();
    expect(pmf.get(7)).toBeCloseTo(6 / 36, 10);
  });

  it("attacker wins 1v1 with 15/36", () => {
    expect(pAttackerWinsOneVsOne()).toBeCloseTo(15 / 36, 10);
  });
});

describe("binomial", () => {
  it("Bin(10,0.5) mean and P(5)", () => {
    expect(binomialExpected(10, 0.5)).toBe(5);
    expect(binomialPmf(10, 5, 0.5)).toBeCloseTo(combinations(10, 5) * Math.pow(0.5, 10), 10);
  });
});

describe("bayes", () => {
  it("classic medical-test style numbers", () => {
    // P(disease)=0.01, sens=0.99, false pos=0.05
    const p = bayesBinary(0.99, 0.01, 0.05);
    expect(p).toBeCloseTo((0.99 * 0.01) / (0.99 * 0.01 + 0.05 * 0.99), 8);
  });

  it("direct bayes", () => {
    expect(bayes(0.8, 0.1, 0.2)).toBeCloseTo(0.4, 10);
  });
});

describe("chess perft", () => {
  it("known perft depths", () => {
    expect(perftSequences(1)).toBe(20);
    expect(perftSequences(2)).toBe(400);
    expect(perftSequences(3)).toBe(8902);
    expect(perftSequences(4)).toBe(197281);
    expect(perftSequences(8)).toBe(84_998_978_956);
  });

  it("20^n underestimates the opening tree from depth 3", () => {
    expect(naiveUniformSequences(1)).toBe(20);
    expect(naiveUniformSequences(2)).toBe(400);
    expect(naiveUniformSequences(3)).toBeLessThan(8902);
    expect(naiveUniformSequences(5)).toBeLessThan(4_865_609);
  });

  it("1/20^n overestimates uniform-over-leaves probability", () => {
    const depth = 5;
    const naiveP = naivePathProbability(depth);
    const leavesP = uniformOverLeavesProbability(depth)!;
    expect(naiveP).toBeGreaterThan(leavesP);
    expect(leavesP).toBeCloseTo(1 / 4_865_609, 12);
  });
});

describe("encounters", () => {
  it("notice probability grows with hours", () => {
    const a = pNoticeOnce({ effectivePopulation: 80_000, hours: 1, observeRatePerHour: 50 });
    const b = pNoticeOnce({ effectivePopulation: 80_000, hours: 3, observeRatePerHour: 50 });
    expect(b).toBeGreaterThan(a);
    expect(a).toBeGreaterThan(0);
    expect(b).toBeLessThan(1);
  });

  it("uses effective population, not hourly flow, as denominator", () => {
    // Orla-like: F=1200/h but N≃80k distinct people over the visit horizon.
    // Sampling from F would wildly overstate p (closed-pool fallacy).
    const fromN = pNoticeOnce({
      effectivePopulation: 80_000,
      hours: 2,
      observeRatePerHour: 80,
    });
    const closedPoolFallacy = 1 - Math.pow(1 - 1 / 1_200, 80 * 2);
    expect(fromN).toBeLessThan(0.01);
    expect(closedPoolFallacy).toBeGreaterThan(0.1);
    expect(fromN).toBeLessThan(closedPoolFallacy / 10);
  });

  it("smaller effective N (faculdade) raises reencounter odds", () => {
    const orla = pNoticeOnce({ effectivePopulation: 80_000, hours: 2, observeRatePerHour: 80 });
    const faculdade = pNoticeOnce({
      effectivePopulation: 10_000,
      hours: 2,
      observeRatePerHour: 80,
    });
    expect(faculdade).toBeGreaterThan(orla);
  });

  it("waiting time until first reencounter is geometric", () => {
    expect(expectedVisitsUntilFirst(0.1)).toBeCloseTo(10, 10);
    expect(visitsUntilCdf(0.1, 0.5)).toBe(7);
    expect(calendarDaysFromVisits(10, 7)).toBeCloseTo(10, 10);
    expect(calendarDaysFromVisits(10, 1)).toBeCloseTo(70, 10);
    expect(sampleGeometricTrials(1)).toBe(1);
    expect(sampleGeometricTrials(0, () => 0.5)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("war enumerate", () => {
  it("1v1 totals 36 and attacker wins 15/36 (ties to defender)", () => {
    const e = enumerateCombat(1, 1);
    expect(e.total).toBe(36);
    expect(pAttackerWinsOneVsOne()).toBeCloseTo(15 / 36, 10);
    expect(e.pAttackerSweeps).toBeCloseTo(15 / 36, 10);
  });

  it("uses War dice: defender up to 3, attacker leaves 1 behind", () => {
    expect(diceCounts(10, 5)).toEqual({ attack: 3, defend: 3 });
    expect(diceCounts(2, 5)).toEqual({ attack: 1, defend: 3 });
    expect(diceCounts(8, 2)).toEqual({ attack: 3, defend: 2 });
  });

  it("3v3 enumerates 6^6 outcomes", () => {
    const e = enumerateCombat(3, 3);
    expect(e.total).toBe(46_656);
    expect(e.pairs).toBe(3);
    expect(e.meanAttackerLosses).toBeGreaterThan(e.meanDefenderLosses);
  });

  it("tie goes to defender", () => {
    expect(resolveWarRoll([4, 3, 2], [4, 3, 2])).toEqual({
      attackerLosses: 3,
      defenderLosses: 0,
    });
  });

  it("pairs highest vs highest and labels the winner", () => {
    const pairs = warPairComparisons([2, 6, 4], [1, 5, 4]);
    expect(pairs).toEqual([
      { attacker: 6, defender: 5, winner: "A" },
      { attacker: 4, defender: 4, winner: "D" },
      { attacker: 2, defender: 1, winner: "A" },
    ]);
  });

  it("exact conquest: 2 vs 1 is a single 1v1 (15/36)", () => {
    expect(pConquestExact(2, 1)).toBeCloseTo(15 / 36, 10);
    expect(pConquestExact(1, 5)).toBe(0);
    expect(pConquestExact(8, 0)).toBe(1);
  });

  it("equal 7-territory deal is ~8.57e28, not 1.03e31", () => {
    const n = Number(warEqualPartitionCount());
    expect(n).toBeGreaterThan(8e28);
    expect(n).toBeLessThan(9e28);
  });
});

describe("CI", () => {
  it("shrinks with n", () => {
    const a = confidenceInterval95(0.5, 100);
    const b = confidenceInterval95(0.5, 10000);
    expect(b.high - b.low).toBeLessThan(a.high - a.low);
  });
});

describe("compute scale", () => {
  it("formats Perft-sized counts as seconds and Shannon as universe ages", () => {
    expect(secondsToEnumerate(1_000_000_000)).toBe(1);
    expect(formatDurationPt(0.000047)).toMatch(/µs/);
    const shannonSec = secondsToEnumerate(SHANNON_GAME_TREE);
    expect(formatDurationPt(shannonSec)).toMatch(/universo/);
  });
});
