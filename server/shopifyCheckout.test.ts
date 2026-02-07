/**
 * Unit tests for Shopify Checkout URL Generation
 * Tests all checkout scenarios with variant IDs and promo codes
 */

import { describe, it, expect } from 'vitest';
import { 
  generateCheckoutUrl, 
  PILLOW_VARIANTS, 
  DISCOUNT_CODES,
  PILLOWCASE_SET_VARIANTS,
  SHIPPING_INSURANCE_VARIANT
} from '@/lib/shopifyCheckout';

describe('Shopify Checkout URL Generation', () => {
  const STORE_URL = 'https://fluffco-llc.myshopify.com';

  describe('Basic Pillow Orders (No Upsells)', () => {
    it('generates correct URL for 1x Standard pillow', () => {
      const url = generateCheckoutUrl({ size: 'Standard', quantity: 1 });
      
      expect(url).toContain(STORE_URL);
      expect(url).toContain(`/cart/${PILLOW_VARIANTS.standard_1}:1`);
      expect(url).toContain('ref=skyvane');
      expect(url).not.toContain('discount=');
    });

    it('generates correct URL for 1x King pillow', () => {
      const url = generateCheckoutUrl({ size: 'King', quantity: 1 });
      
      expect(url).toContain(`/cart/${PILLOW_VARIANTS.king_1}:1`);
      expect(url).toContain('ref=skyvane');
    });

    it('generates correct URL for 2x Standard pillows', () => {
      const url = generateCheckoutUrl({ size: 'Standard', quantity: 2 });
      
      expect(url).toContain(`/cart/${PILLOW_VARIANTS.standard_2}:1`);
    });

    it('generates correct URL for 2x King pillows', () => {
      const url = generateCheckoutUrl({ size: 'King', quantity: 2 });
      
      expect(url).toContain(`/cart/${PILLOW_VARIANTS.king_2}:1`);
    });
  });

  describe('4x Pillow Orders (Free Pillowcase)', () => {
    it('generates correct URL for 4x Standard with free pillowcase', () => {
      const url = generateCheckoutUrl({ size: 'Standard', quantity: 4 });
      
      // Should include 4x pillow variant
      expect(url).toContain(`${PILLOW_VARIANTS.standard_4}:1`);
      // Should include free pillowcase
      expect(url).toContain(`${PILLOWCASE_SET_VARIANTS.standard.variant_id}:1`);
      // Should apply Standard-specific free pillowcase discount
      expect(url).toContain(`discount=${DISCOUNT_CODES.free_pillowcase_4x_standard}`);
    });

    it('generates correct URL for 4x King with free pillowcase', () => {
      const url = generateCheckoutUrl({ size: 'King', quantity: 4 });
      
      // Should include 4x pillow variant
      expect(url).toContain(`${PILLOW_VARIANTS.king_4}:1`);
      // Should include free pillowcase
      expect(url).toContain(`${PILLOWCASE_SET_VARIANTS.king.variant_id}:1`);
      // Should apply King-specific free pillowcase discount
      expect(url).toContain(`discount=${DISCOUNT_CODES.free_pillowcase_4x_king}`);
    });
  });

  describe('Single Pillow Upsell', () => {
    it('adds upsell pillow with correct variant for Standard', () => {
      const url = generateCheckoutUrl({ 
        size: 'Standard', 
        quantity: 1, 
        upsell: 'single-pillow' 
      });
      
      // Main pillow
      expect(url).toContain(`${PILLOW_VARIANTS.standard_1}:1`);
      // Upsell pillow (uses upsell-specific variant)
      expect(url).toContain(`${PILLOW_VARIANTS.standard_1_upsell}:1`);
      // No discount code needed for upsell (pre-priced in Shopify)
    });

    it('adds upsell pillow with correct variant for King', () => {
      const url = generateCheckoutUrl({ 
        size: 'King', 
        quantity: 2, 
        upsell: 'single-pillow' 
      });
      
      // Main pillow (2-pack)
      expect(url).toContain(`${PILLOW_VARIANTS.king_2}:1`);
      // Upsell pillow
      expect(url).toContain(`${PILLOW_VARIANTS.king_1_upsell}:1`);
    });
  });

  describe('Second Upsell (Pillowcase Set)', () => {
    it('adds pillowcase set with discount code', () => {
      const url = generateCheckoutUrl({ 
        size: 'Standard', 
        quantity: 1, 
        secondUpsell: true 
      });
      
      // Main pillow
      expect(url).toContain(`${PILLOW_VARIANTS.standard_1}:1`);
      // Pillowcase set
      expect(url).toContain(`${PILLOWCASE_SET_VARIANTS.standard.variant_id}:1`);
      // Pillowcase discount code
      expect(url).toContain(`discount=${PILLOWCASE_SET_VARIANTS.standard.discount_code}`);
    });

    it('prioritizes 4x free pillowcase discount over second upsell discount', () => {
      const url = generateCheckoutUrl({ 
        size: 'Standard', 
        quantity: 4, 
        secondUpsell: true 
      });
      
      // Should have 4x free pillowcase discount, not the Y7QCKQF68C27 code
      expect(url).toContain(`discount=${DISCOUNT_CODES.free_pillowcase_4x_standard}`);
      expect(url).not.toContain('Y7QCKQF68C27');
    });
  });

  describe('Shipping Insurance', () => {
    it('adds shipping insurance variant when selected', () => {
      const url = generateCheckoutUrl({ 
        size: 'Standard', 
        quantity: 1, 
        shippingInsurance: true 
      });
      
      expect(url).toContain(`${SHIPPING_INSURANCE_VARIANT.variant_id}:1`);
    });
  });

  describe('Combined Scenarios', () => {
    it('handles 1x Standard + single pillow upsell + pillowcase + insurance', () => {
      const url = generateCheckoutUrl({ 
        size: 'Standard', 
        quantity: 1, 
        upsell: 'single-pillow',
        secondUpsell: true,
        shippingInsurance: true
      });
      
      // All items should be present
      expect(url).toContain(`${PILLOW_VARIANTS.standard_1}:1`);
      expect(url).toContain(`${PILLOW_VARIANTS.standard_1_upsell}:1`);
      expect(url).toContain(`${PILLOWCASE_SET_VARIANTS.standard.variant_id}:1`);
      expect(url).toContain(`${SHIPPING_INSURANCE_VARIANT.variant_id}:1`);
      // Should have pillowcase discount
      expect(url).toContain(`discount=${PILLOWCASE_SET_VARIANTS.standard.discount_code}`);
    });

    it('handles 4x King + single pillow upsell + second pillowcase + insurance', () => {
      const url = generateCheckoutUrl({ 
        size: 'King', 
        quantity: 4, 
        upsell: 'single-pillow',
        secondUpsell: true,
        shippingInsurance: true
      });
      
      // 4x King pillow
      expect(url).toContain(`${PILLOW_VARIANTS.king_4}:1`);
      // Upsell pillow
      expect(url).toContain(`${PILLOW_VARIANTS.king_1_upsell}:1`);
      // Two pillowcase sets (one free with 4x, one from second upsell)
      // Note: The variant appears twice with :1 each
      const pillowcaseMatches = url.match(new RegExp(PILLOWCASE_SET_VARIANTS.king.variant_id, 'g'));
      expect(pillowcaseMatches?.length).toBe(2);
      // Insurance
      expect(url).toContain(`${SHIPPING_INSURANCE_VARIANT.variant_id}:1`);
      // Free pillowcase discount takes priority
      expect(url).toContain(`discount=${DISCOUNT_CODES.free_pillowcase_4x_king}`);
    });
  });

  describe('URL Format Validation', () => {
    it('generates valid Shopify cart URL format', () => {
      const url = generateCheckoutUrl({ size: 'Standard', quantity: 1 });
      
      // Should start with store URL
      expect(url.startsWith(STORE_URL)).toBe(true);
      // Should have /cart/ path
      expect(url).toContain('/cart/');
      // Should have variant:quantity format
      expect(url).toMatch(/\/cart\/\d+:\d+/);
    });

    it('includes referrer tracking parameter', () => {
      const url = generateCheckoutUrl({ size: 'King', quantity: 2 });
      
      expect(url).toContain('ref=skyvane');
    });
  });
});
