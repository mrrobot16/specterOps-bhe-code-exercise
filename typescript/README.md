# Sieve (TypeScript)

Returns the nth prime, 0-indexed (`nthPrime(0) === 2`).

## Run

```sh
npm install
npm test
```

## Approach

Bit-packed Sieve of Eratosthenes on a 2-3 wheel. Only candidates coprime to 6
(residues 1 and 5 mod 6) are stored, giving roughly a 24x reduction in memory
versus a naive boolean sieve. Within the wheel, multiples of any prime `p > 3`
land on a repeating pair of bit-index strides whose sum is `2p`, so the inner
marking loop can advance by precomputed steps without per-iteration mod/div.

The sieve is sized using Dusart's tightened upper bound on the nth prime for
`n >= 688,383`, falling back to the looser `n*(ln n + ln ln n)` bound for
smaller `n` where the tighter form isn't proven.

## Files

- `Sieve/nthPrime.ts` — public API: `nthPrime(n: number): number`
- `Sieve/wheel.ts` — wheel encoding helpers and the upper-bound formula
- `Sieve/nthPrime.test.ts`, `Sieve/wheel.test.ts` — test suites
