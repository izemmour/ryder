/**
 * Unit tests for CustomerCount component logic
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCustomerCount } from '@/components/CustomerCount';

describe('CustomerCount', () => {
  beforeEach(() => {
    // Reset any mocked dates
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCustomerCount', () => {
    // Note: Default base count is 746000, base date is 2026-01-20, weekly increment is 4000
    
    it('returns base count on the base date (Jan 20, 2026)', () => {
      // Set date to Monday Jan 20, 2026 (the base date)
      vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));
      
      const count = getCustomerCount();
      expect(count).toBe(746000);
    });

    it('returns base count + 4000 after one week', () => {
      // Set date to Monday Jan 27, 2026 (one week after base)
      vi.setSystemTime(new Date('2026-01-27T12:00:00Z'));
      
      const count = getCustomerCount();
      expect(count).toBe(750000);
    });

    it('returns base count + 8000 after two weeks', () => {
      // Set date to Monday Feb 3, 2026 (two weeks after base)
      vi.setSystemTime(new Date('2026-02-03T12:00:00Z'));
      
      const count = getCustomerCount();
      expect(count).toBe(754000);
    });

    it('returns base count + 204000 after 51 weeks', () => {
      // Set date to Monday Jan 18, 2027 (51 weeks after base)
      vi.setSystemTime(new Date('2027-01-18T12:00:00Z'));
      
      const count = getCustomerCount();
      expect(count).toBe(746000 + (51 * 4000)); // 950000
    });

    it('returns base count during the first week', () => {
      // Set date to Wednesday Jan 22, 2026 (mid-first week)
      vi.setSystemTime(new Date('2026-01-22T12:00:00Z'));
      
      const count = getCustomerCount();
      expect(count).toBe(746000);
    });

    it('does not go below base count for dates before base date', () => {
      // Set date to before base date
      vi.setSystemTime(new Date('2026-01-01T12:00:00Z'));
      
      const count = getCustomerCount();
      expect(count).toBe(746000);
    });

    it('increments correctly for current date (Jan 31, 2026)', () => {
      // Current date is Jan 31, 2026 (11 days after base date Jan 20)
      // Week calculation: floor(11/7) = 1 week = 4000 increment
      vi.setSystemTime(new Date('2026-01-31T12:00:00Z'));
      
      const count = getCustomerCount();
      // After 1 full week, should have 1 increment of 4000
      expect(count).toBe(750000);
    });
  });
});
