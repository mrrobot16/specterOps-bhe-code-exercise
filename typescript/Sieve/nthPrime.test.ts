import { nthPrime } from "@/Sieve/nthPrime";

/** Independent primality check via trial division (used only by the boundary test). */
function isPrime(value: number): boolean {
  if (value < 2) return false;
  if (value % 2 === 0) return value === 2;
  if (value % 3 === 0) return value === 3;
  for (let divisor = 5; divisor * divisor <= value; divisor += 6) {
    if (value % divisor === 0 || value % (divisor + 2) === 0) return false;
  }
  return true;
}

interface NthPrimeCase {
  readonly nth: number;
  readonly expected: number;
}

const NTH_PRIME_CASES: ReadonlyArray<NthPrimeCase> = [
  { nth: 0, expected: 2 },
  { nth: 1, expected: 3 },
  { nth: 2, expected: 5 },
  { nth: 3, expected: 7 },
  { nth: 4, expected: 11 },
  { nth: 5, expected: 13 },
  { nth: 6, expected: 17 },
  { nth: 7, expected: 19 },
  { nth: 8, expected: 23 },
  { nth: 9, expected: 29 },
  { nth: 10, expected: 31 },
  { nth: 11, expected: 37 },
  { nth: 12, expected: 41 },
  { nth: 13, expected: 43 },
  { nth: 14, expected: 47 },
  { nth: 15, expected: 53 },
  { nth: 16, expected: 59 },
  { nth: 17, expected: 61 },
  { nth: 18, expected: 67 },
  { nth: 19, expected: 71 },
  { nth: 99, expected: 541 },
  { nth: 500, expected: 3_581 },
  { nth: 986, expected: 7_793 },
  { nth: 2_000, expected: 17_393 },
  { nth: 1_000_000, expected: 15_485_867 },
  { nth: 10_000_000, expected: 179_424_691 },
  { nth: 100_000_000, expected: 2_038_074_751 }, // not required, just a fun challenge
];

const INVALID_NTH_INPUTS: ReadonlyArray<number> = [-1, -100, 1.5, NaN, Infinity];

// The branch in upperBoundForNthPrime is `count >= 688_383`, i.e. nth >= 688_382.
// Cover both sides plus one more, and trial-divide the result to verify
// primality independently of the sieve itself.
const DUSART_BOUNDARY_CASES: ReadonlyArray<NthPrimeCase> = [
  { nth: 688_381, expected: 10_384_259 }, // looser n*(ln n + ln ln n) bound
  { nth: 688_382, expected: 10_384_261 }, // first nth using the Dusart bound
  { nth: 688_383, expected: 10_384_267 },
];

describe("nthPrime", () => {
  test.each(NTH_PRIME_CASES)(
    "nthPrime($nth) === $expected",
    ({ nth, expected }: NthPrimeCase) => {
      expect(nthPrime(nth)).toBe(expected);
    },
  );

  test.each(INVALID_NTH_INPUTS)(
    "rejects %p with RangeError",
    (bad: number) => {
      expect(() => nthPrime(bad)).toThrow(RangeError);
    },
  );

  describe("Dusart boundary (count == 688_383)", () => {
    test.each(DUSART_BOUNDARY_CASES)(
      "nthPrime($nth) === $expected and is prime",
      ({ nth, expected }: NthPrimeCase) => {
        const got = nthPrime(nth);
        expect(got).toBe(expected);
        expect(isPrime(got)).toBe(true);
      },
    );

    test("strictly increasing across the boundary", () => {
      expect(nthPrime(688_381)).toBeLessThan(nthPrime(688_382));
      expect(nthPrime(688_382)).toBeLessThan(nthPrime(688_383));
    });
  });
});
