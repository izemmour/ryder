import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, siteSettings, InsertSiteSetting, SiteSetting, landingPageSettings, InsertLandingPageSetting, LandingPageSetting, ctaButtons, CtaButton, InsertCtaButton, marketingAngles, MarketingAngle, InsertMarketingAngle, colorSchemes, ColorScheme, InsertColorScheme } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : null;
}

// ==================== Site Settings ====================

/**
 * Get a site setting by key
 */
export async function getSiteSetting(key: string): Promise<SiteSetting | undefined | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get setting: database not available");
    return undefined;
  }

  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Get all site settings, optionally filtered by category
 */
export async function getAllSiteSettings(category?: string): Promise<SiteSetting[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get settings: database not available");
    return [];
  }

  if (category) {
    return db.select().from(siteSettings).where(eq(siteSettings.category, category));
  }
  return db.select().from(siteSettings);
}

/**
 * Upsert a site setting
 */
export async function upsertSiteSetting(setting: InsertSiteSetting): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert setting: database not available");
    return;
  }

  await db.insert(siteSettings).values(setting).onDuplicateKeyUpdate({
    set: {
      value: setting.value,
      label: setting.label,
      description: setting.description,
      category: setting.category,
    },
  });
}

/**
 * Initialize default site settings if they don't exist
 */
export async function initializeDefaultSettings(): Promise<void> {
  const defaults: InsertSiteSetting[] = [
    {
      key: 'shipping_time_us',
      value: '4–6 days',
      label: 'US Shipping Time',
      description: 'Delivery estimate for US customers',
      category: 'shipping',
    },
    {
      key: 'shipping_time_ca',
      value: '6–10 days',
      label: 'Canada Shipping Time',
      description: 'Delivery estimate for Canadian customers',
      category: 'shipping',
    },
    {
      key: 'shipping_time_eu',
      value: '8–14 days',
      label: 'Europe Shipping Time',
      description: 'Delivery estimate for European customers',
      category: 'shipping',
    },
    {
      key: 'shipping_time_au',
      value: '12–18 days',
      label: 'Australia/NZ Shipping Time',
      description: 'Delivery estimate for Australia/NZ customers',
      category: 'shipping',
    },
    {
      key: 'shipping_time_row',
      value: '12–22 days',
      label: 'Rest of World Shipping Time',
      description: 'Delivery estimate for other countries',
      category: 'shipping',
    },
    {
      key: 'customer_count_base',
      value: '546000',
      label: 'Customer Count Base',
      description: 'Base number of happy customers (increments weekly)',
      category: 'social_proof',
    },
    {
      key: 'customer_count_start_date',
      value: '2026-01-20',
      label: 'Customer Count Start Date',
      description: 'Date when the customer count base was set (YYYY-MM-DD)',
      category: 'social_proof',
    },
    {
      key: 'customer_count_weekly_increment',
      value: '4000',
      label: 'Weekly Customer Increment',
      description: 'Number of customers added each Monday',
      category: 'social_proof',
    },
    {
      key: 'trial_period_text',
      value: '30-Night Trial',
      label: 'Trial Period Text',
      description: 'Text displayed for the trial period (e.g., "30-Night Trial")',
      category: 'product',
    },
    {
      key: 'guarantee_text',
      value: '30-Day Guarantee',
      label: 'Guarantee Text',
      description: 'Text displayed for the money-back guarantee',
      category: 'product',
    },
    {
      key: 'shipping_text',
      value: 'Free Shipping',
      label: 'Shipping Text',
      description: 'Text displayed for shipping (e.g., "Free Shipping")',
      category: 'product',
    },
    {
      key: 'origin_text',
      value: 'Made in USA',
      label: 'Origin Text',
      description: 'Text displayed for product origin',
      category: 'product',
    },
    {
      key: 'non_us_badge_text',
      value: 'Free Returns',
      label: 'Non-US Badge Text',
      description: 'Badge text shown to international visitors instead of Free Shipping',
      category: 'shipping',
    },
  ];

  for (const setting of defaults) {
    const existing = await getSiteSetting(setting.key);
    if (!existing) {
      await upsertSiteSetting(setting);
    }
  }
}

// ==================== Landing Page Settings ====================

/**
 * Get landing page settings by page ID
 */
export async function getLandingPageSetting(pageId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get landing page setting: database not available");
    return undefined;
  }

  const result = await db
    .select({
      id: landingPageSettings.id,
      pageId: landingPageSettings.pageId,
      colorScheme: landingPageSettings.colorScheme,
      marketingAngle: landingPageSettings.marketingAngle,
      ctaText: landingPageSettings.ctaText,
      redirectUrl: landingPageSettings.redirectUrl,
      eventEndDate: landingPageSettings.eventEndDate,
      ctaButtonId: landingPageSettings.ctaButtonId,
      angleId: landingPageSettings.angleId,
      isActive: landingPageSettings.isActive,
      createdAt: landingPageSettings.createdAt,
      updatedAt: landingPageSettings.updatedAt,
      angle: marketingAngles,
    })
    .from(landingPageSettings)
    .leftJoin(marketingAngles, eq(landingPageSettings.angleId, marketingAngles.id))
    .where(eq(landingPageSettings.pageId, pageId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

/**
 * Get all landing page settings
 */
export async function getAllLandingPageSettings() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get landing page settings: database not available");
    return [];
  }

  return db
    .select({
      id: landingPageSettings.id,
      pageId: landingPageSettings.pageId,
      colorScheme: landingPageSettings.colorScheme,
      marketingAngle: landingPageSettings.marketingAngle,
      ctaText: landingPageSettings.ctaText,
      redirectUrl: landingPageSettings.redirectUrl,
      eventEndDate: landingPageSettings.eventEndDate,
      ctaButtonId: landingPageSettings.ctaButtonId,
      angleId: landingPageSettings.angleId,
      galleryImages: landingPageSettings.galleryImages,
      subSentence: landingPageSettings.subSentence,
      generatedColorScheme: landingPageSettings.generatedColorScheme,
      lastComplianceCheck: landingPageSettings.lastComplianceCheck,
      complianceIssues: landingPageSettings.complianceIssues,
      autoFixAvailable: landingPageSettings.autoFixAvailable,
      isActive: landingPageSettings.isActive,
      createdAt: landingPageSettings.createdAt,
      updatedAt: landingPageSettings.updatedAt,
      angle: marketingAngles,
    })
    .from(landingPageSettings)
    .leftJoin(marketingAngles, eq(landingPageSettings.angleId, marketingAngles.id));
}

/**
 * Upsert a landing page setting
 */
export async function upsertLandingPageSetting(setting: InsertLandingPageSetting): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert landing page setting: database not available");
    return;
  }

  await db.insert(landingPageSettings).values(setting).onDuplicateKeyUpdate({
    set: {
      colorScheme: setting.colorScheme,
      marketingAngle: setting.marketingAngle,
      ctaText: setting.ctaText,
      redirectUrl: setting.redirectUrl,
      eventEndDate: setting.eventEndDate,
      isActive: setting.isActive,
      ctaButtonId: setting.ctaButtonId,
      angleId: setting.angleId,
      galleryImages: setting.galleryImages,
      subSentence: setting.subSentence,
      generatedColorScheme: setting.generatedColorScheme,
    },
  });
}

// ==================== CTA Buttons ====================

/**
 * Get all CTA buttons ordered by sortOrder
 */
export async function getAllCtaButtons() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get CTA buttons: database not available");
    return [];
  }

  const { ctaButtons } = await import("../drizzle/schema");
  const { asc } = await import("drizzle-orm");
  return db.select().from(ctaButtons).orderBy(asc(ctaButtons.sortOrder));
}

/**
 * Get the default CTA button
 */
export async function getDefaultCtaButton() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get default CTA button: database not available");
    return undefined;
  }

  const { ctaButtons } = await import("../drizzle/schema");
  const result = await db.select().from(ctaButtons).where(eq(ctaButtons.isDefault, 1)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Get a single CTA button by ID
 */
export async function getCtaButton(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get CTA button: database not available");
    return undefined;
  }

  const { ctaButtons } = await import("../drizzle/schema");
  const result = await db.select().from(ctaButtons).where(eq(ctaButtons.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Create a new CTA button
 */
export async function createCtaButton(data: { text: string; secondaryText?: string; alternativeText?: string; variant?: string; description?: string; sortOrder?: number }) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create CTA button: database not available");
    return;
  }

  const { ctaButtons } = await import("../drizzle/schema");
  await db.insert(ctaButtons).values({
    text: data.text,
    variant: data.variant || 'primary',
    description: data.description,
    sortOrder: data.sortOrder || 0,
    isDefault: 0,
  });
}

/**
 * Update a CTA button
 */
export async function updateCtaButton(id: number, data: { text?: string; secondaryText?: string; alternativeText?: string; variant?: string; description?: string; sortOrder?: number }) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update CTA button: database not available");
    return;
  }

  const { ctaButtons } = await import("../drizzle/schema");
  await db.update(ctaButtons).set(data).where(eq(ctaButtons.id, id));
}

/**
 * Delete a CTA button
 */
export async function deleteCtaButton(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete CTA button: database not available");
    return;
  }

  const { ctaButtons } = await import("../drizzle/schema");
  await db.delete(ctaButtons).where(eq(ctaButtons.id, id));
}

/**
 * Set a CTA button as the default (unsets all others)
 */
export async function setDefaultCtaButton(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot set default CTA button: database not available");
    return;
  }

  const { ctaButtons } = await import("../drizzle/schema");
  
  // First, unset all defaults
  await db.update(ctaButtons).set({ isDefault: 0 });
  
  // Then set the specified button as default
  await db.update(ctaButtons).set({ isDefault: 1 }).where(eq(ctaButtons.id, id));
}

// ==================== Marketing Angles ====================

/**
 * Get all marketing angles ordered by sortOrder
 */
export async function getAllMarketingAngles(): Promise<MarketingAngle[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get marketing angles: database not available");
    return [];
  }

  const { asc } = await import("drizzle-orm");
  return db.select().from(marketingAngles).orderBy(asc(marketingAngles.sortOrder));
}

/**
 * Get a single marketing angle by ID
 */
export async function getMarketingAngle(id: number): Promise<MarketingAngle | undefined | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get marketing angle: database not available");
    return undefined;
  }

  const result = await db.select().from(marketingAngles).where(eq(marketingAngles.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Get a marketing angle by slug
 */
export async function getMarketingAngleBySlug(slug: string): Promise<MarketingAngle | undefined | null> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get marketing angle by slug: database not available");
    return undefined;
  }

  const result = await db.select().from(marketingAngles).where(eq(marketingAngles.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Create a new marketing angle
 */
export async function createMarketingAngle(data: InsertMarketingAngle): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create marketing angle: database not available");
    return;
  }

  await db.insert(marketingAngles).values(data);
}

/**
 * Update a marketing angle
 */
export async function updateMarketingAngle(id: number, data: Partial<InsertMarketingAngle>): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update marketing angle: database not available");
    return;
  }

  await db.update(marketingAngles).set(data).where(eq(marketingAngles.id, id));
}

/**
 * Delete a marketing angle
 */
export async function deleteMarketingAngle(id: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete marketing angle: database not available");
    return;
  }

  await db.delete(marketingAngles).where(eq(marketingAngles.id, id));
}

/**
 * Initialize default marketing angles
 */
export async function initializeDefaultMarketingAngles(): Promise<void> {
  const defaults: InsertMarketingAngle[] = [
    {
      slug: 'hotel-quality',
      name: 'Hotel Quality Pillow',
      productTitle: 'The Same Pillows Used in 5-Star Hotels - For Less',
      tags: '100% Cotton,Skin Friendly,Award Winning,300 Thread Count',
      description: 'Sleep like you\'re on vacation every night. Enjoy the same high-end luxury quality pillows used in Four Seasons and Ritz Carlton at just a fraction of the price!',
      sortOrder: 1,
      isActive: 1,
    },
    {
      slug: 'neck-pain-relief',
      name: 'Neck Pain Relief',
      productTitle: 'Say Goodbye to Morning Neck Pain',
      tags: 'Orthopedic Support,Pain Relief,Doctor Recommended,Adjustable Loft',
      description: 'Wake up pain-free with our orthopedically designed pillow that provides optimal neck alignment and pressure relief throughout the night.',
      sortOrder: 2,
      isActive: 1,
    },
    {
      slug: 'restorative-alignment',
      name: 'Restorative Alignment',
      productTitle: 'Restorative Alignment Pillow',
      tags: 'Spinal Alignment,Deep Sleep,Pressure Relief,Therapeutic',
      description: 'Experience truly restorative sleep with our therapeutic pillow designed to maintain perfect spinal alignment and reduce pressure points.',
      sortOrder: 3,
      isActive: 1,
    },
    {
      slug: 'gift',
      name: 'Perfect Gift',
      productTitle: 'The Gift of Better Sleep',
      tags: 'Gift Ready,Premium Quality,Loved by Thousands,Free Shipping',
      description: 'Give the gift they\'ll use every night. Our premium pillows come beautifully packaged and are loved by over 746,000 happy sleepers.',
      sortOrder: 4,
      isActive: 1,
    },
  ];

  for (const angle of defaults) {
    const existing = await getMarketingAngleBySlug(angle.slug!);
    if (!existing) {
      await createMarketingAngle(angle);
    }
  }
}

// ============================================================================
// Color Schemes
// ============================================================================

/**
 * Get all color schemes ordered by sortOrder
 */
export async function getAllColorSchemes(): Promise<ColorScheme[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get color schemes: database not available");
    return [];
  }

  const { asc } = await import("drizzle-orm");
  return db.select().from(colorSchemes).orderBy(asc(colorSchemes.sortOrder));
}

/**
 * Get a color scheme by slug
 */
export async function getColorSchemeBySlug(slug: string): Promise<ColorScheme | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get color scheme: database not available");
    return undefined;
  }

  const { eq } = await import("drizzle-orm");
  const results = await db.select().from(colorSchemes).where(eq(colorSchemes.slug, slug));
  return results[0];
}

/**
 * Create a new color scheme
 */
export async function createColorScheme(data: InsertColorScheme): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create color scheme: database not available");
    return;
  }

  await db.insert(colorSchemes).values(data);
}

/**
 * Update an existing color scheme
 */
export async function updateColorScheme(id: number, data: Partial<InsertColorScheme>): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update color scheme: database not available");
    return;
  }

  const { eq } = await import("drizzle-orm");
  await db.update(colorSchemes).set(data).where(eq(colorSchemes.id, id));
}

/**
 * Delete a color scheme
 */
export async function deleteColorScheme(id: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete color scheme: database not available");
    return;
  }

  const { eq } = await import("drizzle-orm");
  await db.delete(colorSchemes).where(eq(colorSchemes.id, id));
}

/**
 * Initialize default color schemes (Valentine's, Mother's, Father's Day, Black Friday)
 */
export async function initDefaultColorSchemes(): Promise<void> {
  const defaults: InsertColorScheme[] = [
    {
      slug: 'valentine-gift',
      name: 'Valentine\'s Day',
      primaryColor: '#c41e3a',
      secondaryColor: '#8b1a2d',
      accentColor: '#fff5f5',
      accentDarkColor: '#ffe8e8',
      backgroundColor: '#fff8f8',
      secondaryLightColor: '#fce8eb',
      description: 'Romantic red and pink color scheme for Valentine\'s Day event',
      sortOrder: 1,
      isActive: 1,
    },
    {
      slug: 'mothers-day',
      name: 'Mother\'s Day',
      primaryColor: '#9b6b6b',
      secondaryColor: '#7a5454',
      accentColor: '#fff9f9',
      accentDarkColor: '#f5e6e6',
      backgroundColor: '#fffafa',
      secondaryLightColor: '#f5eaea',
      description: 'Soft mauve color scheme for Mother\'s Day event',
      sortOrder: 2,
      isActive: 1,
    },
    {
      slug: 'fathers-day',
      name: 'Father\'s Day',
      primaryColor: '#2c5282',
      secondaryColor: '#1a365d',
      accentColor: '#f0f5ff',
      accentDarkColor: '#e2e8f0',
      backgroundColor: '#f8fafc',
      secondaryLightColor: '#e8eef8',
      description: 'Deep navy blue color scheme for Father\'s Day event',
      sortOrder: 3,
      isActive: 1,
    },
    {
      slug: 'black-friday',
      name: 'Black Friday',
      primaryColor: '#000000',
      secondaryColor: '#1a1a1a',
      accentColor: '#fff9f0',
      accentDarkColor: '#ffe8cc',
      backgroundColor: '#fffbf5',
      secondaryLightColor: '#fff3e0',
      description: 'Black and gold color scheme for Black Friday event',
      sortOrder: 4,
      isActive: 1,
    },
  ];

  for (const scheme of defaults) {
    const existing = await getColorSchemeBySlug(scheme.slug!);
    if (!existing) {
      await createColorScheme(scheme);
    }
  }
}
