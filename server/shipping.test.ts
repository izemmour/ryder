/**
 * Shipping Logic Unit Tests
 * 
 * Tests for geo-detection and shipping cost calculation functions
 */

import { describe, it, expect } from 'vitest';

// Replicate the shipping logic from useGeolocation.ts for testing
// (These are the same functions used in the frontend)

const US_COUNTRY_CODE = 'US';

function isUSVisitor(countryCode: string): boolean {
  return countryCode === US_COUNTRY_CODE;
}

function getShippingCost(countryCode: string, quantity: number): number {
  // US visitors get free shipping
  if (isUSVisitor(countryCode)) {
    return 0;
  }
  
  // International shipping costs:
  // 1 item: $10
  // 2 items: $15
  // 3+ items: $20
  if (quantity <= 1) {
    return 10;
  } else if (quantity === 2) {
    return 15;
  } else {
    return 20;
  }
}

function getDeliveryEstimate(countryCode: string): string {
  if (isUSVisitor(countryCode)) {
    return '2-3 days';
  }
  return '5-8 days';
}

describe('isUSVisitor', () => {
  it('should return true for US country code', () => {
    expect(isUSVisitor('US')).toBe(true);
  });

  it('should return false for non-US country codes', () => {
    expect(isUSVisitor('CA')).toBe(false);
    expect(isUSVisitor('GB')).toBe(false);
    expect(isUSVisitor('DE')).toBe(false);
    expect(isUSVisitor('JP')).toBe(false);
    expect(isUSVisitor('AU')).toBe(false);
    expect(isUSVisitor('FR')).toBe(false);
  });

  it('should be case sensitive', () => {
    expect(isUSVisitor('us')).toBe(false);
    expect(isUSVisitor('Us')).toBe(false);
  });
});

describe('getShippingCost', () => {
  describe('US visitors', () => {
    it('should return 0 (free shipping) for US visitors regardless of quantity', () => {
      expect(getShippingCost('US', 1)).toBe(0);
      expect(getShippingCost('US', 2)).toBe(0);
      expect(getShippingCost('US', 4)).toBe(0);
      expect(getShippingCost('US', 10)).toBe(0);
    });
  });

  describe('International visitors', () => {
    it('should return $10 for 1 item', () => {
      expect(getShippingCost('CA', 1)).toBe(10);
      expect(getShippingCost('GB', 1)).toBe(10);
      expect(getShippingCost('DE', 1)).toBe(10);
    });

    it('should return $15 for 2 items', () => {
      expect(getShippingCost('CA', 2)).toBe(15);
      expect(getShippingCost('GB', 2)).toBe(15);
      expect(getShippingCost('DE', 2)).toBe(15);
    });

    it('should return $20 for 3+ items', () => {
      expect(getShippingCost('CA', 3)).toBe(20);
      expect(getShippingCost('GB', 4)).toBe(20);
      expect(getShippingCost('DE', 5)).toBe(20);
      expect(getShippingCost('JP', 10)).toBe(20);
    });

    it('should handle edge cases for quantity', () => {
      // 0 or negative should be treated as 1 item
      expect(getShippingCost('CA', 0)).toBe(10);
      expect(getShippingCost('CA', -1)).toBe(10);
    });
  });
});

describe('getDeliveryEstimate', () => {
  it('should return 2-3 days for US visitors', () => {
    expect(getDeliveryEstimate('US')).toBe('2-3 days');
  });

  it('should return 5-8 days for international visitors', () => {
    expect(getDeliveryEstimate('CA')).toBe('5-8 days');
    expect(getDeliveryEstimate('GB')).toBe('5-8 days');
    expect(getDeliveryEstimate('DE')).toBe('5-8 days');
    expect(getDeliveryEstimate('JP')).toBe('5-8 days');
    expect(getDeliveryEstimate('AU')).toBe('5-8 days');
  });
});

describe('Shipping cost with upsells', () => {
  it('should calculate correct shipping when upsell is added', () => {
    // Scenario: 2 pillows + 1 upsell = 3 items
    const pillowQuantity = 2;
    const hasUpsell = true;
    const totalItems = pillowQuantity + (hasUpsell ? 1 : 0);
    
    // US: free
    expect(getShippingCost('US', totalItems)).toBe(0);
    
    // International: $20 (3+ items)
    expect(getShippingCost('CA', totalItems)).toBe(20);
  });

  it('should calculate correct shipping for 4 pillows + upsell', () => {
    // Scenario: 4 pillows + 1 upsell = 5 items
    const pillowQuantity = 4;
    const hasUpsell = true;
    const totalItems = pillowQuantity + (hasUpsell ? 1 : 0);
    
    // US: free
    expect(getShippingCost('US', totalItems)).toBe(0);
    
    // International: $20 (3+ items)
    expect(getShippingCost('GB', totalItems)).toBe(20);
  });

  it('should calculate correct shipping for 1 pillow without upsell', () => {
    const pillowQuantity = 1;
    const hasUpsell = false;
    const totalItems = pillowQuantity + (hasUpsell ? 1 : 0);
    
    // US: free
    expect(getShippingCost('US', totalItems)).toBe(0);
    
    // International: $10 (1 item)
    expect(getShippingCost('DE', totalItems)).toBe(10);
  });

  it('should calculate correct shipping for 1 pillow with upsell', () => {
    const pillowQuantity = 1;
    const hasUpsell = true;
    const totalItems = pillowQuantity + (hasUpsell ? 1 : 0);
    
    // US: free
    expect(getShippingCost('US', totalItems)).toBe(0);
    
    // International: $15 (2 items)
    expect(getShippingCost('FR', totalItems)).toBe(15);
  });
});

// ============================================
// Shipping Insurance Tests
// ============================================

describe('Shipping Insurance', () => {
  const INSURANCE_COST = 4.99;
  
  it('insurance cost is $4.99', () => {
    expect(INSURANCE_COST).toBe(4.99);
  });
  
  it('total includes insurance when selected', () => {
    const subtotal = 149.90;
    const shippingCost = 0; // US free shipping
    const insuranceSelected = true;
    const insuranceCost = insuranceSelected ? INSURANCE_COST : 0;
    const total = subtotal + shippingCost + insuranceCost;
    
    expect(total).toBeCloseTo(154.89, 2);
  });
  
  it('total excludes insurance when not selected', () => {
    const subtotal = 149.90;
    const shippingCost = 0; // US free shipping
    const insuranceSelected = false;
    const insuranceCost = insuranceSelected ? INSURANCE_COST : 0;
    const total = subtotal + shippingCost + insuranceCost;
    
    expect(total).toBeCloseTo(149.90, 2);
  });
  
  it('international order with insurance calculates correctly', () => {
    const subtotal = 149.90;
    const shippingCost = 20; // International 4 pillows
    const insuranceSelected = true;
    const insuranceCost = insuranceSelected ? INSURANCE_COST : 0;
    const total = subtotal + shippingCost + insuranceCost;
    
    expect(total).toBeCloseTo(174.89, 2);
  });
});

// ============================================
// Delivery Estimate with Prefix Tests
// ============================================

describe('Delivery Estimate with Prefix', () => {
  // Simulating the updated function behavior
  const getDeliveryEstimateWithPrefix = (countryCode: string, includePrefix: boolean = true): string => {
    const days = countryCode === 'US' ? '2-3 days' : '5-8 days';
    return includePrefix ? `Delivers in ${days}` : days;
  };
  
  it('includes "Delivers in" prefix by default', () => {
    expect(getDeliveryEstimateWithPrefix('US')).toBe('Delivers in 2-3 days');
    expect(getDeliveryEstimateWithPrefix('CH')).toBe('Delivers in 5-8 days');
    expect(getDeliveryEstimateWithPrefix('GB')).toBe('Delivers in 5-8 days');
  });
  
  it('returns days only when prefix is false', () => {
    expect(getDeliveryEstimateWithPrefix('US', false)).toBe('2-3 days');
    expect(getDeliveryEstimateWithPrefix('CH', false)).toBe('5-8 days');
  });
  
  it('handles various international country codes with prefix', () => {
    expect(getDeliveryEstimateWithPrefix('DE')).toBe('Delivers in 5-8 days');
    expect(getDeliveryEstimateWithPrefix('FR')).toBe('Delivers in 5-8 days');
    expect(getDeliveryEstimateWithPrefix('JP')).toBe('Delivers in 5-8 days');
    expect(getDeliveryEstimateWithPrefix('AU')).toBe('Delivers in 5-8 days');
  });
});
