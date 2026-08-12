import { describe, expect, it } from "vitest";
import {
  bayes,
  bayesBinary,
  binomialExpected,
  binomialPmf,
  combinations,
  confidenceInterval95,
  enumerateCombat,
  pAttackerWinsOneVsOne,
  perftSequences,
  pNoticeOnce,
  twoDiceSumPmf,
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
});

describe("war enumerate", () => {
  it("1v1 totals 36", () => {
    const e = enumerateCombat(1, 1);
    expect(e.total).toBe(36);
  });
});

describe("CI", () => {
  it("shrinks with n", () => {
    const a = confidenceInterval95(0.5, 100);
    const b = confidenceInterval95(0.5, 10000);
    expect(b.high - b.low).toBeLessThan(a.high - a.low);
  });
});
