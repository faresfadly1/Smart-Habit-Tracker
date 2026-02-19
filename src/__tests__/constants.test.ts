import { describe, expect, it } from 'vitest';
import { COLORS, DICTIONARY } from '../constants';

describe('constants', () => {
  it('defines the expected color palette', () => {
    expect(COLORS.length).toBeGreaterThanOrEqual(8);
    expect(COLORS[0]).toMatch(/^bg-/);
  });

  it('contains Arabic and English month/day labels', () => {
    expect(DICTIONARY.en.monthNames).toHaveLength(12);
    expect(DICTIONARY.ar.monthNames).toHaveLength(12);
    expect(DICTIONARY.en.dayShortNames).toHaveLength(7);
    expect(DICTIONARY.ar.dayShortNames).toHaveLength(7);
  });
});
