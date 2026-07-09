import { describe, it, expect } from 'vitest';
import { calcPackedPct } from '../lib/packing-math.js';

describe('calcPackedPct', () => {
  it('returns 0 when total is 0 (avoids divide-by-zero)', () => {
    expect(calcPackedPct(0, 0)).toBe(0);
    expect(calcPackedPct(5, 0)).toBe(0);
  });

  it('returns 0 when nothing is packed', () => {
    expect(calcPackedPct(0, 20)).toBe(0);
  });

  it('returns 100 when everything is packed', () => {
    expect(calcPackedPct(20, 20)).toBe(100);
  });

  it('rounds to the nearest whole percent', () => {
    expect(calcPackedPct(1, 3)).toBe(33);
    expect(calcPackedPct(2, 3)).toBe(67);
    expect(calcPackedPct(1, 8)).toBe(13);
  });

  it('handles a typical mid-trip value', () => {
    expect(calcPackedPct(13, 20)).toBe(65);
  });
});
