/**
 * Landing Page Configurations Index
 * 
 * Export all available landing page configurations and utilities.
 */

// Types
export * from './types';

// Utilities
export * from './utils';

// Base configuration
export { baseConfig } from './base.config';

// Variant configurations
export { downAlternativeConfig } from './down-alternative.config';
export { restorativeAlignmentConfig } from './restorative-alignment.config';
export { hotelQualityConfig } from './hotel-quality.config';
export { neckPainReliefConfig } from './neck-pain-relief.config';
export { sideSleeperConfig } from './side-sleeper.config';
export { valentineGiftConfig } from './valentine-gift.config';
export { mothersDayConfig } from './mothers-day.config';
export { fathersDayConfig } from './fathers-day.config';
export { blackFridayConfig } from './black-friday.config';

// Framed Stories
export { fiveStarHotelComfortConfig } from './framed-stories/5-star-hotel-comfort.config';

// Configuration registry - add new configs here
import { downAlternativeConfig } from './down-alternative.config';
import { restorativeAlignmentConfig } from './restorative-alignment.config';
import { hotelQualityConfig } from './hotel-quality.config';
import { neckPainReliefConfig } from './neck-pain-relief.config';
import { sideSleeperConfig } from './side-sleeper.config';
import { valentineGiftConfig } from './valentine-gift.config';
import { mothersDayConfig } from './mothers-day.config';
import { fathersDayConfig } from './fathers-day.config';
import { blackFridayConfig } from './black-friday.config';
import { fiveStarHotelComfortConfig } from './framed-stories/5-star-hotel-comfort.config';
import type { LandingPageConfig, FramedStoryConfig } from './types';

export const configRegistry: Record<string, LandingPageConfig> = {
  // Down Alternative variant (DEFAULT - maps to /)
  'down-alternative': downAlternativeConfig,
  
  // Restorative Alignment variant
  'restorative-alignment': restorativeAlignmentConfig,
  'down-pillow-restorative-alignment': restorativeAlignmentConfig,
  'restorative-alignment-pillow': restorativeAlignmentConfig,
  
  // Hotel Quality variant
  'hotel-quality': hotelQualityConfig,
  'hotel-quality-pillow': hotelQualityConfig,
  
  // Neck Pain Relief variant
  'neck-pain-relief': neckPainReliefConfig,
  'neck-pain-relief-pillow': neckPainReliefConfig,
  
  // Side Sleeper Solution (Use Case)
  'side-sleeper': sideSleeperConfig,
  'side-sleeper-pillow': sideSleeperConfig,
  
  // Valentine's Day Gift variant
  'valentine-gift': valentineGiftConfig,
  'valentines-gift': valentineGiftConfig,
  
  // Mother's Day Gift variant
  'mothers-day': mothersDayConfig,
  'mothers-day-gift': mothersDayConfig,
  
  // Father's Day Gift variant
  'fathers-day': fathersDayConfig,
  'fathers-day-gift': fathersDayConfig,
  
  // Black Friday Sale variant
  'black-friday': blackFridayConfig,
};

/**
 * Get a landing page configuration by slug or ID.
 */
export function getConfigBySlug(slug: string): LandingPageConfig | undefined {
  return configRegistry[slug];
}

/**
 * Get all available landing page slugs.
 */
export function getAllSlugs(): string[] {
  return Object.values(configRegistry).map(config => config.slug);
}

/**
 * Unique landing page configurations for the index page.
 * Only includes one entry per unique config (not aliases).
 * Down Alternative is first as it's the default.
 */
export const landingPageConfigs: LandingPageConfig[] = [
  downAlternativeConfig,
  restorativeAlignmentConfig,
  hotelQualityConfig,
  neckPainReliefConfig,
  sideSleeperConfig,
  valentineGiftConfig,
  mothersDayConfig,
  fathersDayConfig,
  blackFridayConfig,
];

/**
 * Framed Story configurations for conversion funnels.
 */
export const framedStoryConfigs: FramedStoryConfig[] = [
  fiveStarHotelComfortConfig,
];
