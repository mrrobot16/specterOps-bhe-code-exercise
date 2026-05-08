// Wheel-2-3 (mod 6) bit-index helpers.
//
// Every prime > 3 is congruent to 1 or 5 (mod 6). We can therefore skip ~67%
// of integers by storing only candidates of the form 6k+5 and 6k+7, packed
// into a contiguous bit array. The encoding interleaves the two residues:
//
//   bit index : 0   1   2   3   4   5   6   7   ...
//   value     : 5   7  11  13  17  19  23  25  ...
//
// Even bit indices map to 6k+5, odd bit indices map to 6k+7. This pairing
// is what makes `valueAt` and `bitIndexOf` cheap inverse functions.

/** Decode a bit index into the candidate value it represents. */
export function valueAt(index: number): number {
    return 6 * (index >> 1) + ((index & 1) ? 7 : 5);
}

/**
 * Encode a candidate value (must be coprime to 6) into its bit index.
 * Values divisible by 2 or 3 have no representation here.
 */
export function bitIndexOf(value: number): number {
    return (value % 6 === 5)
      ? 2 * ((value - 5) / 6)
      : 2 * ((value - 7) / 6) + 1;
}

/**
 * Largest representable bit index whose value is ≤ `limit`.
 * Walks down past any multiples of 2 or 3 to land on a 6k±1 value.
 */
export function bitIndexAtOrBelow(limit: number): number {
    let value = limit;
    while (value % 2 === 0 || value % 3 === 0) value--;
    return bitIndexOf(value);
}

/**
 * Upper bound on the nth prime (0-indexed: nth=0 ⇒ 2).
 *
 * Uses Dusart's tightened form of Rosser's theorem for n ≥ 688,383, and
 * the looser n·(ln n + ln ln n) bound for smaller n where the tighter form
 * isn't proven. The constant 15 covers nth < 6 where ln ln n is undefined
 * or negative (15 ≥ 13, the 6th prime).
 */
export function upperBoundForNthPrime(nth: number): number {
    if (nth < 6) return 15;
    const n = nth + 1;
    const lnN = Math.log(n);
    const lnLnN = Math.log(lnN);

    if (n >= 688383) {
      return Math.ceil(n * (lnN + lnLnN - 1 + (lnLnN - 2) / lnN));
    }
    return Math.ceil(n * (lnN + lnLnN));
}
