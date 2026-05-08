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
 * Largest representable bit index whose value is <= `limit`.
 * Constant-time switch on `limit % 6` lands on the nearest 6k+/-1 value at or below `limit`.
 */
export function bitIndexAtOrBelow(limit: number): number {
  switch (limit % 6) {
    case 0: return bitIndexOf(limit - 1); // 6k     -> 6k-1 (residue 5)
    case 2: return bitIndexOf(limit - 1); // 6k+2   -> 6k+1 (residue 1)
    case 3: return bitIndexOf(limit - 2); // 6k+3   -> 6k+1 (residue 1)
    case 4: return bitIndexOf(limit - 3); // 6k+4   -> 6k+1 (residue 1)
    default: return bitIndexOf(limit);    // residues 1 and 5: already coprime with 6
  }
}

/**
 * Upper bound on the nth prime (0-indexed: nth=0 -> 2).
 *
 * Uses Dusart's tightened form of Rosser's theorem for count >= 688,383, and
 * the looser count*(ln count + ln ln count) bound for smaller counts where the
 * tighter form isn't proven.
 */
export function upperBoundForNthPrime(nth: number): number {
  // For nth <= 5 (primes 2..13), 15 is a sufficient bound and avoids
  // ln(ln(count)) being undefined or negative.
  if (nth < 6) return 15;

  const count = nth + 1;
  const lnCount = Math.log(count);
  const lnLnCount = Math.log(lnCount);

  if (count >= 688_383) {
    return Math.ceil(count * (lnCount + lnLnCount - 1 + (lnLnCount - 2) / lnCount));
  }
  return Math.ceil(count * (lnCount + lnLnCount));
}
