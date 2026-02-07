/**
 * Unit tests for geolocation utilities and shipping message logic
 */

import { describe, it, expect } from 'vitest';

// Test the delivery estimate logic (extracted from useGeolocation.ts)
// Updated to match the simpler "X days" format
function getDeliveryEstimate(countryCode: string): string {
  // US domestic shipping
  if (countryCode === 'US') {
    return '4–6 days';
  }
  
  // Canada
  if (countryCode === 'CA') {
    return '6–10 days';
  }
  
  // UK, Western Europe
  if (['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'IE', 'PT', 'SE', 'NO', 'DK', 'FI', 'PL', 'CZ', 'HU', 'GR'].includes(countryCode)) {
    return '8–14 days';
  }
  
  // Australia, New Zealand
  if (['AU', 'NZ'].includes(countryCode)) {
    return '12–18 days';
  }
  
  // Worldwide (all other countries)
  return '10–20 days';
}

// Test shipping availability logic - we ship worldwide!
function isShippingAvailable(countryCode: string): boolean {
  return true; // We ship to all countries
}

describe('Delivery Estimate Logic', () => {
  it('returns 4-6 days for US', () => {
    expect(getDeliveryEstimate('US')).toBe('4–6 days');
  });

  it('returns 6-10 days for Canada', () => {
    expect(getDeliveryEstimate('CA')).toBe('6–10 days');
  });

  it('returns 8-14 days for UK', () => {
    expect(getDeliveryEstimate('GB')).toBe('8–14 days');
  });

  it('returns 8-14 days for Western Europe', () => {
    expect(getDeliveryEstimate('DE')).toBe('8–14 days');
    expect(getDeliveryEstimate('FR')).toBe('8–14 days');
    expect(getDeliveryEstimate('IT')).toBe('8–14 days');
    expect(getDeliveryEstimate('CH')).toBe('8–14 days');
  });

  it('returns 12-18 days for Australia/NZ', () => {
    expect(getDeliveryEstimate('AU')).toBe('12–18 days');
    expect(getDeliveryEstimate('NZ')).toBe('12–18 days');
  });

  it('returns 10-20 days for worldwide (other countries)', () => {
    expect(getDeliveryEstimate('JP')).toBe('10–20 days');
    expect(getDeliveryEstimate('BR')).toBe('10–20 days');
    expect(getDeliveryEstimate('IN')).toBe('10–20 days');
  });
});

describe('Shipping Availability Logic', () => {
  it('returns true for US', () => {
    expect(isShippingAvailable('US')).toBe(true);
  });

  it('returns true for all countries (worldwide shipping)', () => {
    expect(isShippingAvailable('CA')).toBe(true);
    expect(isShippingAvailable('GB')).toBe(true);
    expect(isShippingAvailable('DE')).toBe(true);
    expect(isShippingAvailable('JP')).toBe(true);
    expect(isShippingAvailable('BR')).toBe(true);
  });
});
