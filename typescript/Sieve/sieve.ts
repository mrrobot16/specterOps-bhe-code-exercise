import { 
  upperBoundForNthPrime, 
  bitIndexAtOrBelow, 
  valueAt, 
  bitIndexOf 
} from "@/Sieve/utils";

/**
 * Sieve of Eratosthenes with a 2-3 wheel and bit-packed storage.
 *
 * The bit array (see `utils.ts`) only holds candidates coprime to 6, so
 * memory is ~1/24 of a naive boolean sieve over [0, limit]. Marking is
 * accelerated by the wheel pattern: for any prime p > 3, its multiples
 * that survive the wheel land on a repeating pair of bit-index strides,
 * so we can skip directly between them instead of walking every multiple.
 */
export class Sieve {
  /** Returns the nth prime (0-indexed: NthPrime(0) === 2). */
  public NthPrime(nth: number): number {
    if (!Number.isInteger(nth) || nth < 0) {
      throw new RangeError(`nth must be a non-negative integer, got ${nth}`);
    }

    // 2 and 3 aren't representable in the wheel; short-circuit them.
    if (nth === 0) return 2;
    if (nth === 1) return 3;
 
    const limit = upperBoundForNthPrime(nth);
    const sqrtLimit = Math.floor(Math.sqrt(limit));
    const numBits = bitIndexAtOrBelow(limit) + 1;
    const bytes = new Uint8Array((numBits + 7) >> 3);
 
    const isComposite = (index: number): boolean =>
      (bytes[index >> 3] & (1 << (index & 7))) !== 0;
    const setComposite = (index: number): void => {
      bytes[index >> 3] |= 1 << (index & 7);
    };
 
    // Sieving phase: mark composites for every prime p ≤ √limit.
    // We start crossing out at p² because all smaller multiples of p have
    // a smaller prime factor and are already marked (or excluded by the wheel).
    for (let index = 0; ; index++) {
      const prime = valueAt(index);
      if (prime > sqrtLimit) break;
      if (isComposite(index)) continue;
 
      // Within the 6k±1 wheel, the surviving multiples of p alternate between
      // two bit-index strides whose sum equals 2p (one full wheel turn).
      // Computing both strides up front lets the inner loop avoid any
      // per-iteration mod/div work.
      let bitIndex = bitIndexOf(prime * prime);
      const bitIndexNext = (prime % 6 === 1)
        ? bitIndexOf(prime * (prime + 4))
        : bitIndexOf(prime * (prime + 2));
      const step = bitIndexNext - bitIndex;
      const step2 = bitIndexOf(prime * (prime + 6)) - bitIndexNext;
 
      // Unrolled by 2 so the alternating strides stay hot in registers.
      while (bitIndex + step < numBits) {
        setComposite(bitIndex);
        bitIndex += step;
        setComposite(bitIndex);
        bitIndex += step2;
      }
      if (bitIndex < numBits) setComposite(bitIndex);
    }
 
    // Collection phase. The wheel skipped 2 and 3, so the count of primes
    // remaining to find is (nth + 1) - 2 = nth - 1.
    let remaining = nth - 1;
    for (let index = 0; index < numBits; index++) {
      if (!isComposite(index)) {
        if (--remaining === 0) return valueAt(index);
      }
    }
    throw new Error("sieve undersized — upper bound failed (should be impossible)");
  }
}
 
export default Sieve;
