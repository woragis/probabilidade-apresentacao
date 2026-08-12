/** Factorial with BigInt for large n; number for n <= 20. */
export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new Error("factorial: n must be non-negative integer");
  if (n > 170) throw new Error("factorial: overflow for Number");
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

export function factorialBig(n: number): bigint {
  if (!Number.isInteger(n) || n < 0) throw new Error("factorialBig: invalid n");
  let r = BigInt(1);
  for (let i = 2; i <= n; i++) r *= BigInt(i);
  return r;
}

/** P(n, r) = n! / (n-r)! */
export function permutations(n: number, r: number): number {
  if (r < 0 || n < 0 || r > n) return 0;
  let p = 1;
  for (let i = 0; i < r; i++) p *= n - i;
  return p;
}

/** C(n, r) = n! / (r!(n-r)!) */
export function combinations(n: number, r: number): number {
  if (r < 0 || n < 0 || r > n) return 0;
  r = Math.min(r, n - r);
  let c = 1;
  for (let i = 1; i <= r; i++) {
    c = (c * (n - r + i)) / i;
  }
  return Math.round(c);
}

export function combinationsBig(n: number, r: number): bigint {
  if (r < 0 || n < 0 || r > n) return BigInt(0);
  r = Math.min(r, n - r);
  let c = BigInt(1);
  for (let i = 1; i <= r; i++) {
    c = (c * BigInt(n - r + i)) / BigInt(i);
  }
  return c;
}
