import {
  valueAt,
  bitIndexOf,
  bitIndexAtOrBelow,
  upperBoundForNthPrime,
} from "@/Sieve/wheel";

const FIRST_TWELVE_WHEEL_VALUES: ReadonlyArray<number> = [
  5, 7, 11, 13, 17, 19, 23, 25, 29, 31, 35, 37,
];

interface KnownNthPrime {
  readonly nth: number;
  readonly prime: number;
}

const KNOWN_NTH_PRIMES: ReadonlyArray<KnownNthPrime> = [
  { nth: 99, prime: 541 },
  { nth: 500, prime: 3_581 },
  { nth: 2_000, prime: 17_393 },
  { nth: 1_000_000, prime: 15_485_867 },
  { nth: 10_000_000, prime: 179_424_691 },
];

const BIT_INDEX_AT_OR_BELOW_LIMITS: ReadonlyArray<number> = [
  6, 7, 8, 9, 10, 11, 12, 13, 14, 100, 101, 102, 103, 104, 105,
];


// `nth` values straddling the 688_383 cutoff between the looser
// n*(ln n + ln ln n) bound and Dusart's tightened form.
const DUSART_SWITCH_NTHS: ReadonlyArray<number> = [
  688_381, 688_382, 688_383, 688_384,
];

describe("valueAt", () => {
  test(`first 12 indices land on ${FIRST_TWELVE_WHEEL_VALUES.join(",")}`, () => {
    const got = Array.from(
      { length: FIRST_TWELVE_WHEEL_VALUES.length },
      (_: unknown, index: number) => valueAt(index),
    );
    expect(got).toEqual(FIRST_TWELVE_WHEEL_VALUES);
  });

  test("only emits values coprime to 6", () => {
    for (let index = 0; index < 1000; index++) {
      const value = valueAt(index);
      expect(value % 2).not.toBe(0);
      expect(value % 3).not.toBe(0);
    }
  });
});

describe("bitIndexOf / valueAt round-trip", () => {
  test("valueAt(bitIndexOf(value)) === value for every value coprime with 6 in [5, 5000]", () => {
    for (let value = 5; value <= 5000; value++) {
      if (value % 2 === 0 || value % 3 === 0) continue;
      expect(valueAt(bitIndexOf(value))).toBe(value);
    }
  });

  test("bitIndexOf(valueAt(index)) === index for index in [0, 2000]", () => {
    for (let index = 0; index < 2000; index++) {
      expect(bitIndexOf(valueAt(index))).toBe(index);
    }
  });
});


describe("bitIndexAtOrBelow", () => {
  test.each(BIT_INDEX_AT_OR_BELOW_LIMITS)(
    "lands on a 6k+/-1 value at-or-below limit=%i",
    (limit: number) => {
      const value = valueAt(bitIndexAtOrBelow(limit));
      expect(value).toBeLessThanOrEqual(limit);
      expect(value % 2).not.toBe(0);
      expect(value % 3).not.toBe(0);
    },
  );

  test("hits every residue class mod 6", () => {
    // Pick one limit per residue and confirm the result is the largest 6k+/-1 <= limit.
    expect(valueAt(bitIndexAtOrBelow(12))).toBe(11); // 12 % 6 === 0
    expect(valueAt(bitIndexAtOrBelow(13))).toBe(13); // 13 % 6 === 1
    expect(valueAt(bitIndexAtOrBelow(14))).toBe(13); // 14 % 6 === 2
    expect(valueAt(bitIndexAtOrBelow(15))).toBe(13); // 15 % 6 === 3
    expect(valueAt(bitIndexAtOrBelow(16))).toBe(13); // 16 % 6 === 4
    expect(valueAt(bitIndexAtOrBelow(17))).toBe(17); // 17 % 6 === 5
  });

  test("matches the brute-force reference implementation for limits in [5, 5000]", () => {
    // Reference: walk down from `limit` until we hit a value coprime with 6.
    // The constant-time switch must agree at every limit.
    const reference = (limit: number): number => {
      let value = limit;
      while (value % 2 === 0 || value % 3 === 0) value--;
      return bitIndexOf(value);
    };
    for (let limit = 5; limit <= 5000; limit++) {
      expect(bitIndexAtOrBelow(limit)).toBe(reference(limit));
    }
  });
});



describe("upperBoundForNthPrime", () => {
  test("returns 15 for nth < 6", () => {
    for (let nth = 0; nth < 6; nth++) {
      expect(upperBoundForNthPrime(nth)).toBe(15);
    }
  });

  test("monotonic non-decreasing on [0, 5000]", () => {
    let previous = upperBoundForNthPrime(0);
    for (let nth = 1; nth <= 5000; nth++) {
      const current = upperBoundForNthPrime(nth);
      expect(current).toBeGreaterThanOrEqual(previous);
      previous = current;
    }
  });

  test.each(KNOWN_NTH_PRIMES)(
    "upperBoundForNthPrime($nth) >= $prime (the actual nth prime)",
    ({ nth, prime }: KnownNthPrime) => {
      expect(upperBoundForNthPrime(nth)).toBeGreaterThanOrEqual(prime);
    },
  );

  test("stays finite and integer-valued at the Dusart switch", () => {
    for (const nth of DUSART_SWITCH_NTHS) {
      const bound = upperBoundForNthPrime(nth);
      expect(Number.isFinite(bound)).toBe(true);
      expect(Number.isInteger(bound)).toBe(true);
      expect(bound).toBeGreaterThan(0);
    }
  });
});
