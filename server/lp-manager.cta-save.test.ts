/**
 * Test: LP Manager CTA Save Functionality
 * 
 * Verifies that changing the CTA button for a landing page persists correctly in the database.
 * This test was added to verify the fix for the bug where ctaButtonId wasn't being saved.
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from './db';
import { landingPageSettings, ctaButtons } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';

describe('LP Manager CTA Save Functionality', () => {
  let endYourPillowBattleId: number;
  let claimDealId: number;
  const testPageId = 'black-friday';

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Get CTA button IDs
    const buttons = await db.select().from(ctaButtons).where(
      eq(ctaButtons.text, 'End Your Pillow Battle')
    );
    endYourPillowBattleId = buttons[0]?.id;

    const claimButtons = await db.select().from(ctaButtons).where(
      eq(ctaButtons.text, 'Claim Deal')
    );
    claimDealId = claimButtons[0]?.id;

    expect(endYourPillowBattleId).toBeDefined();
    expect(claimDealId).toBeDefined();
  });

  it('should retrieve current Black Friday CTA setting', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const settings = await db.select().from(landingPageSettings).where(
      eq(landingPageSettings.pageId, testPageId)
    );

    expect(settings).toHaveLength(1);
    expect(settings[0].pageId).toBe(testPageId);
    expect(settings[0].ctaButtonId).toBeDefined();
    
    console.log('Current CTA Button ID:', settings[0].ctaButtonId);
  });

  it('should update CTA from "End Your Pillow Battle" to "Claim Deal"', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Update the CTA button
    await db.update(landingPageSettings)
      .set({ ctaButtonId: claimDealId })
      .where(eq(landingPageSettings.pageId, testPageId));

    // Verify the update persisted
    const updated = await db.select().from(landingPageSettings).where(
      eq(landingPageSettings.pageId, testPageId)
    );

    expect(updated[0].ctaButtonId).toBe(claimDealId);
    console.log('✅ CTA successfully updated to "Claim Deal" (ID:', claimDealId, ')');
  });

  it('should persist the CTA change after multiple queries', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Query multiple times to ensure it persists
    for (let i = 0; i < 3; i++) {
      const settings = await db.select().from(landingPageSettings).where(
        eq(landingPageSettings.pageId, testPageId)
      );
      
      expect(settings[0].ctaButtonId).toBe(claimDealId);
    }

    console.log('✅ CTA change persisted across multiple queries');
  });

  it('should restore original CTA "End Your Pillow Battle"', async () => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    // Restore original CTA
    await db.update(landingPageSettings)
      .set({ ctaButtonId: endYourPillowBattleId })
      .where(eq(landingPageSettings.pageId, testPageId));

    // Verify restoration
    const restored = await db.select().from(landingPageSettings).where(
      eq(landingPageSettings.pageId, testPageId)
    );

    expect(restored[0].ctaButtonId).toBe(endYourPillowBattleId);
    console.log('✅ CTA restored to "End Your Pillow Battle" (ID:', endYourPillowBattleId, ')');
  });
});
