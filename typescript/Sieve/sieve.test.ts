import Sieve from "@/Sieve/sieve";

describe("Sieve", () => {
  test("valid results", () => {
    const sieve = new Sieve();
    expect(sieve.NthPrime(0)).toBe(2);
    expect(sieve.NthPrime(1)).toBe(3);
    expect(sieve.NthPrime(2)).toBe(5);
    expect(sieve.NthPrime(3)).toBe(7);
    expect(sieve.NthPrime(4)).toBe(11);
    expect(sieve.NthPrime(5)).toBe(13);
    expect(sieve.NthPrime(6)).toBe(17);
    expect(sieve.NthPrime(7)).toBe(19);
    expect(sieve.NthPrime(8)).toBe(23);
    expect(sieve.NthPrime(9)).toBe(29);
    expect(sieve.NthPrime(10)).toBe(31);
    expect(sieve.NthPrime(11)).toBe(37);
    expect(sieve.NthPrime(12)).toBe(41);
    expect(sieve.NthPrime(13)).toBe(43);
    expect(sieve.NthPrime(14)).toBe(47);
    expect(sieve.NthPrime(15)).toBe(53);
    expect(sieve.NthPrime(16)).toBe(59);
    expect(sieve.NthPrime(17)).toBe(61);
    expect(sieve.NthPrime(18)).toBe(67);
    expect(sieve.NthPrime(19)).toBe(71);
    expect(sieve.NthPrime(99)).toBe(541);
    expect(sieve.NthPrime(500)).toBe(3_581);
    expect(sieve.NthPrime(986)).toBe(7_793);
    expect(sieve.NthPrime(2_000)).toBe(17_393);
    expect(sieve.NthPrime(1_000_000)).toBe(15_485_867);
    expect(sieve.NthPrime(10_000_000)).toBe(179_424_691);
    expect(sieve.NthPrime(100_000_000)).toBe(2_038_074_751); // not required, just a fun challenge
  });
});
