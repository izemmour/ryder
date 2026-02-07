import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Site settings table for configurable values like shipping times, customer counts, etc.
 * Uses key-value pairs for flexibility.
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique setting key (e.g., 'shipping_time_us', 'customer_count_base') */
  key: varchar("key", { length: 100 }).notNull().unique(),
  /** Setting value as string (parse as needed) */
  value: text("value").notNull(),
  /** Human-readable label for the setting */
  label: varchar("label", { length: 255 }),
  /** Description of what this setting controls */
  description: text("description"),
  /** Category for grouping in UI (e.g., 'shipping', 'social_proof') */
  category: varchar("category", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Landing page settings table for per-page configuration.
 * Stores settings like color scheme, CTA text overrides, etc. for each landing page.
 */
export const landingPageSettings = mysqlTable("landing_page_settings", {
  id: int("id").autoincrement().primaryKey(),
  /** Landing page identifier (matches config.id, e.g., 'valentine', 'hotel-quality') */
  pageId: varchar("pageId", { length: 100 }).notNull().unique(),
  /** Color scheme for event pages */
  colorScheme: varchar("colorScheme", { length: 50 }),
  /** Marketing angle for event pages (gift, hotel-quality, neck-pain, restorative) */
  marketingAngle: varchar("marketingAngle", { length: 50 }),
  /** Custom CTA button text override */
  ctaText: varchar("ctaText", { length: 100 }),
  /** Custom redirect URL override */
  redirectUrl: varchar("redirectUrl", { length: 500 }),
  /** Event end date for countdown timer (ISO date string) */
  eventEndDate: varchar("eventEndDate", { length: 50 }),
  /** Selected CTA button ID (references ctaButtons table) */
  ctaButtonId: int("ctaButtonId"),
  /** Selected marketing angle ID (references marketingAngles table) */
  angleId: int("angleId"),
  /** JSON array of gallery image URLs generated based on angle narrative */
  galleryImages: text("galleryImages"),
  /** Sub-sentence text displayed under product description, aligned with angle */
  subSentence: text("subSentence"),
  /** Generated color scheme based on event theme (e.g., 'black-red' for Black Friday) */
  generatedColorScheme: varchar("generatedColorScheme", { length: 50 }),
  /** Last compliance check timestamp */
  lastComplianceCheck: timestamp("lastComplianceCheck"),
  /** JSON array of compliance issues found during last check */
  complianceIssues: text("complianceIssues"),
  /** Whether auto-fix is available for current compliance issues */
  autoFixAvailable: int("autoFixAvailable").default(0),
  /** Whether the page is active/enabled */
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LandingPageSetting = typeof landingPageSettings.$inferSelect;
export type InsertLandingPageSetting = typeof landingPageSettings.$inferInsert;

/**
 * CTA buttons table for managing call-to-action configurations.
 * Stores button text, URL, styling, and default status.
 */
export const ctaButtons = mysqlTable("cta_buttons", {
  id: int("id").autoincrement().primaryKey(),
  /** Primary button display text (e.g., 'Order Now', 'Gift Now', 'Get Hotel Quality') */
  text: varchar("text", { length: 100 }).notNull(),
  /** Secondary text for discount variations (e.g., 'Order Now & Save 60%') - uses primary + discount */
  secondaryText: varchar("secondaryText", { length: 150 }),
  /** Alternative text for specific contexts (e.g., event-specific wording) */
  alternativeText: varchar("alternativeText", { length: 150 }),
  /** Button style variant (e.g., 'primary', 'secondary', 'outline') */
  variant: varchar("variant", { length: 50 }).default("primary"),
  /** Whether this is the default CTA shown site-wide (only one can be default) */
  isDefault: int("isDefault").default(0),
  /** Optional description for admin reference */
  description: text("description"),
  /** Display order for admin UI */
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CtaButton = typeof ctaButtons.$inferSelect;
export type InsertCtaButton = typeof ctaButtons.$inferInsert;

/**
 * Marketing angles table for managing product positioning and messaging.
 * Each angle represents a unique value proposition (e.g., 'Hotel Quality', 'Neck Pain Relief').
 */
export const marketingAngles = mysqlTable("marketing_angles", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique identifier for the angle (e.g., 'hotel-quality', 'neck-pain-relief') */
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  /** Display name for the angle (e.g., 'Hotel Quality Pillow') */
  name: varchar("name", { length: 150 }).notNull(),
  /** Product title override for this angle (e.g., 'The Same Pillows Used in 5-Star Hotels') */
  productTitle: varchar("productTitle", { length: 255 }),
  /** Comma-separated tags for this angle (e.g., '100% Cotton,Skin Friendly,Award Winning') */
  tags: text("tags"),
  /** One-sentence summary describing the angle's unique value proposition */
  description: text("description"),
  /** Display order for admin UI */
  sortOrder: int("sortOrder").default(0),
  /** Whether this angle is active and available for selection */
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketingAngle = typeof marketingAngles.$inferSelect;
export type InsertMarketingAngle = typeof marketingAngles.$inferInsert;

/**
 * Color schemes table for event page theming.
 * Stores 6 standardized colors for each event (Valentine's, Mother's Day, etc.).
 * System colors (#1d9bf0, #00b67a, #f59e0b, #2d3a5c, #c9a962) are hardcoded and never overridden.
 */
export const colorSchemes = mysqlTable("color_schemes", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique identifier matching page slug (e.g., 'valentine-gift', 'mothers-day') */
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  /** Display name for the color scheme (e.g., 'Valentine\'s Day', 'Mother\'s Day') */
  name: varchar("name", { length: 150 }).notNull(),
  /** Primary brand color - main CTA buttons, titles, highlights (#c41e3a for Valentine's) */
  primaryColor: varchar("primaryColor", { length: 7 }).notNull(),
  /** Secondary color - announcement bar, Premium Quality section (#8b1a2d for Valentine's) */
  secondaryColor: varchar("secondaryColor", { length: 7 }).notNull(),
  /** Accent color - very light backgrounds for contrast sections (#fff5f5 for Valentine's) */
  accentColor: varchar("accentColor", { length: 7 }).notNull(),
  /** Accent dark color - press bar, alternating sections (#ffe8e8 for Valentine's) */
  accentDarkColor: varchar("accentDarkColor", { length: 7 }).notNull(),
  /** Background color - main page background tint (#fff8f8 for Valentine's) */
  backgroundColor: varchar("backgroundColor", { length: 7 }).notNull(),
  /** Secondary light color - badges, pills, subtle highlights (#fce8eb for Valentine's) */
  secondaryLightColor: varchar("secondaryLightColor", { length: 7 }).notNull(),
  /** Optional description for admin reference */
  description: text("description"),
  /** Display order for admin UI */
  sortOrder: int("sortOrder").default(0),
  /** Whether this is a dark color scheme (true) or light color scheme (false) */
  isDark: int("isDark").default(0),
  /** Whether this color scheme is active and available for selection */
  isActive: int("isActive").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ColorScheme = typeof colorSchemes.$inferSelect;
export type InsertColorScheme = typeof colorSchemes.$inferInsert;
