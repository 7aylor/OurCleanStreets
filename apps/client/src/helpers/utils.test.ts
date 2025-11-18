import { describe, it, expect } from 'vitest';
import { getRouteColorByDate } from './utils';

describe('getRouteColorByDate', () => {
  const now = new Date();

  it('returns green for a route within 3 months', () => {
    const recentDate = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      now.getDate()
    );
    expect(getRouteColorByDate(recentDate)).toBe('green');
  });

  it('returns orange for a route within 4-6 months', () => {
    const fourMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 4,
      now.getDate()
    );
    const sixMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 6,
      now.getDate()
    );

    expect(getRouteColorByDate(fourMonthsAgo)).toBe('orange');
    expect(getRouteColorByDate(sixMonthsAgo)).toBe('orange');
  });

  it('returns red for a route older than 6 months', () => {
    const sevenMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 7,
      now.getDate()
    );
    const oneYearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );

    expect(getRouteColorByDate(sevenMonthsAgo)).toBe('red');
    expect(getRouteColorByDate(oneYearAgo)).toBe('red');
  });
});
