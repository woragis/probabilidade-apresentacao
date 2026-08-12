/** Classical conditional probability P(A|B) = P(A∩B) / P(B) */
export function conditional(pIntersection: number, pCondition: number): number {
  if (pCondition <= 0) return NaN;
  return pIntersection / pCondition;
}

/** Bayes: P(A|B) = P(B|A) P(A) / P(B) */
export function bayes(pBGivenA: number, pA: number, pB: number): number {
  if (pB <= 0) return NaN;
  return (pBGivenA * pA) / pB;
}

/**
 * Bayes with law of total probability for binary hypothesis.
 * P(A|B) = P(B|A)P(A) / [P(B|A)P(A) + P(B|¬A)P(¬A)]
 */
export function bayesBinary(
  pBGivenA: number,
  pA: number,
  pBGivenNotA: number,
): number {
  const pNotA = 1 - pA;
  const pB = pBGivenA * pA + pBGivenNotA * pNotA;
  return bayes(pBGivenA, pA, pB);
}

/** Chain rule product: P(E1) P(E2|E1) P(E3|E1∩E2) … */
export function chainProduct(factors: number[]): number {
  return factors.reduce((acc, x) => acc * x, 1);
}
