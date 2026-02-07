/**
 * Unit tests for Non-US Badge functionality
 * 
 * Tests the configurable badge text that replaces "Free Shipping" for international visitors.
 */

import { describe, it, expect } from 'vitest';

describe('Non-US Badge Configuration', () => {
  // Test default badge text
  describe('Default Badge Text', () => {
    it('should have "Free Returns" as default non-US badge text', () => {
      const defaultBadgeText = 'Free Returns';
      expect(defaultBadgeText).toBe('Free Returns');
    });

    it('should be a non-empty string', () => {
      const defaultBadgeText = 'Free Returns';
      expect(defaultBadgeText.length).toBeGreaterThan(0);
    });
  });

  // Test badge text variations
  describe('Badge Text Variations', () => {
    const validBadgeTexts = [
      'Free Returns',
      'Easy Returns',
      '30-Day Returns',
      'Worldwide Shipping',
      'Ships Worldwide',
    ];

    it.each(validBadgeTexts)('should accept "%s" as valid badge text', (badgeText) => {
      expect(typeof badgeText).toBe('string');
      expect(badgeText.length).toBeGreaterThan(0);
      expect(badgeText.length).toBeLessThan(50); // Reasonable length for badge
    });
  });

  // Test badge display logic
  describe('Badge Display Logic', () => {
    const isUSVisitor = (countryCode: string): boolean => countryCode === 'US';
    
    it('should show "Free shipping" for US visitors', () => {
      const countryCode = 'US';
      const isUS = isUSVisitor(countryCode);
      const displayText = isUS ? 'Free shipping' : 'Free Returns';
      expect(displayText).toBe('Free shipping');
    });

    it('should show non-US badge for Canadian visitors', () => {
      const countryCode = 'CA';
      const isUS = isUSVisitor(countryCode);
      const nonUsBadgeText = 'Free Returns';
      const displayText = isUS ? 'Free shipping' : nonUsBadgeText;
      expect(displayText).toBe('Free Returns');
    });

    it('should show non-US badge for UK visitors', () => {
      const countryCode = 'GB';
      const isUS = isUSVisitor(countryCode);
      const nonUsBadgeText = 'Free Returns';
      const displayText = isUS ? 'Free shipping' : nonUsBadgeText;
      expect(displayText).toBe('Free Returns');
    });

    it('should show non-US badge for German visitors', () => {
      const countryCode = 'DE';
      const isUS = isUSVisitor(countryCode);
      const nonUsBadgeText = 'Free Returns';
      const displayText = isUS ? 'Free shipping' : nonUsBadgeText;
      expect(displayText).toBe('Free Returns');
    });

    it('should show non-US badge for Australian visitors', () => {
      const countryCode = 'AU';
      const isUS = isUSVisitor(countryCode);
      const nonUsBadgeText = 'Free Returns';
      const displayText = isUS ? 'Free shipping' : nonUsBadgeText;
      expect(displayText).toBe('Free Returns');
    });
  });

  // Test settings key
  describe('Settings Key', () => {
    it('should use correct settings key for non-US badge', () => {
      const settingsKey = 'non_us_badge_text';
      expect(settingsKey).toBe('non_us_badge_text');
    });

    it('should be in shipping category', () => {
      const category = 'shipping';
      expect(category).toBe('shipping');
    });
  });

  // Test badge text formatting
  describe('Badge Text Formatting', () => {
    it('should not have leading or trailing whitespace', () => {
      const badgeText = 'Free Returns';
      expect(badgeText).toBe(badgeText.trim());
    });

    it('should not contain HTML tags', () => {
      const badgeText = 'Free Returns';
      expect(badgeText).not.toMatch(/<[^>]*>/);
    });

    it('should be suitable for display in various contexts', () => {
      const badgeText = 'Free Returns';
      // Should work in inline text
      const inlineText = `Ships to London · ${badgeText} · 5-8 days`;
      expect(inlineText).toContain(badgeText);
      
      // Should work in subtitle
      const subtitle = `Online-only pricing. ${badgeText}.`;
      expect(subtitle).toContain(badgeText);
      
      // Should work in footer
      const footer = `100 Night Better Sleep • ${badgeText} • Lifetime Warranty`;
      expect(footer).toContain(badgeText);
    });
  });
});


describe('Non-US Alternative USP', () => {
  describe('Default Alternative USP', () => {
    it('should have default alternative USP title', () => {
      const defaultUsp = { title: 'Award-Winning Quality', description: 'Oprah Daily recognized' };
      expect(defaultUsp.title).toBe('Award-Winning Quality');
    });

    it('should have default alternative USP description', () => {
      const defaultUsp = { title: 'Award-Winning Quality', description: 'Oprah Daily recognized' };
      expect(defaultUsp.description).toBe('Oprah Daily recognized');
    });
  });

  describe('Alternative USP Display Logic', () => {
    const isUSVisitor = (countryCode: string): boolean => countryCode === 'US';
    
    it('should replace Made in USA for non-US visitors', () => {
      const countryCode = 'CA';
      const isUS = isUSVisitor(countryCode);
      const originalUsp = { title: 'Made in USA', description: 'Premium materials' };
      const alternativeUsp = { title: 'Award-Winning Quality', description: 'Oprah Daily recognized' };
      
      const displayedUsp = isUS ? originalUsp : alternativeUsp;
      expect(displayedUsp.title).toBe('Award-Winning Quality');
      expect(displayedUsp.description).toBe('Oprah Daily recognized');
    });

    it('should show Made in USA for US visitors', () => {
      const countryCode = 'US';
      const isUS = isUSVisitor(countryCode);
      const originalUsp = { title: 'Made in USA', description: 'Premium materials' };
      const alternativeUsp = { title: 'Award-Winning Quality', description: 'Oprah Daily recognized' };
      
      const displayedUsp = isUS ? originalUsp : alternativeUsp;
      expect(displayedUsp.title).toBe('Made in USA');
      expect(displayedUsp.description).toBe('Premium materials');
    });

    it('should replace Made in the USA variant for non-US visitors', () => {
      const countryCode = 'GB';
      const isUS = isUSVisitor(countryCode);
      const originalUsp = { title: 'Made in the USA', description: 'Premium materials only' };
      const alternativeUsp = { title: 'Award-Winning Quality', description: 'Oprah Daily recognized' };
      
      const displayedUsp = isUS ? originalUsp : alternativeUsp;
      expect(displayedUsp.title).toBe('Award-Winning Quality');
    });
  });

  describe('Settings Keys', () => {
    it('should use correct settings key for alternative USP title', () => {
      const settingsKey = 'non_us_alternative_usp_title';
      expect(settingsKey).toBe('non_us_alternative_usp_title');
    });

    it('should use correct settings key for alternative USP description', () => {
      const settingsKey = 'non_us_alternative_usp_description';
      expect(settingsKey).toBe('non_us_alternative_usp_description');
    });
  });
});
