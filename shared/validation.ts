/**
 * Shared Validation Logic
 * 
 * Used by both frontend compliance dashboard and CLI validation script
 */

import type { LandingPageConfig } from '../client/src/config/types';

// ============================================
// TYPES
// ============================================

export type PageType = 'angle' | 'event' | 'use-case';

export type ValidationLevel = 'error' | 'warning' | 'info';

export interface ValidationResult {
  check: string;
  level: ValidationLevel;
  passed: boolean;
  message: string;
  details?: string;
  fixSuggestion?: string;
}

export interface PageValidationReport {
  pageId: string;
  pageName: string;
  pageType?: PageType;
  results: ValidationResult[];
  score: {
    passed: number;
    failed: number;
    warnings: number;
    total: number;
  };
  status: 'pass' | 'warning' | 'fail';
}

// ============================================
// VALIDATION CHECKS
// ============================================

/**
 * Check 1: Page Type Defined (Mandatory)
 */
export function validatePageType(config: LandingPageConfig): ValidationResult {
  const hasPageType = config.pageType && ['angle', 'event', 'use-case'].includes(config.pageType);
  
  return {
    check: 'Page Type Defined',
    level: 'error',
    passed: hasPageType,
    message: hasPageType 
      ? `Page type: "${config.pageType}"`
      : 'Missing or invalid pageType',
    details: hasPageType 
      ? undefined 
      : 'Every landing page must have a pageType field',
    fixSuggestion: hasPageType
      ? undefined
      : 'Add pageType: "angle" | "event" | "use-case" to config'
  };
}

/**
 * Check 2: SEO Configuration
 */
export function validateSEO(config: LandingPageConfig): ValidationResult {
  const hasSEO = !!(config.seo && config.seo.title && config.seo.description);
  const titleFormat = !!(config.seo?.title?.includes('FluffCo') || config.seo?.title?.includes('–'));
  
  return {
    check: 'SEO Configuration',
    level: 'error',
    passed: hasSEO && titleFormat,
    message: hasSEO && titleFormat
      ? 'SEO properly configured'
      : 'Missing or incorrect SEO',
    details: !hasSEO 
      ? 'SEO title and description are required'
      : !titleFormat
      ? 'Title should follow format: "{Title} – FluffCo"'
      : undefined,
    fixSuggestion: !hasSEO
      ? 'Add seo: { title: "...", description: "..." } to config'
      : !titleFormat
      ? 'Update title to include " – FluffCo"'
      : undefined
  };
}

/**
 * Check 3: Required Config Fields
 */
export function validateRequiredFields(config: LandingPageConfig): ValidationResult {
  const requiredFields = ['id', 'name', 'slug', 'sections'];
  const missingFields = requiredFields.filter(field => !(config as any)[field]);
  
  return {
    check: 'Required Config Fields',
    level: 'error',
    passed: missingFields.length === 0,
    message: missingFields.length === 0
      ? 'All required fields present'
      : `Missing: ${missingFields.join(', ')}`,
    details: missingFields.length > 0
      ? 'Config must have id, name, slug, and sections array'
      : undefined,
    fixSuggestion: missingFields.length > 0
      ? `Add ${missingFields.join(', ')} to config`
      : undefined
  };
}

/**
 * Check 4: Gallery Configuration
 */
export function validateGalleryConfig(config: LandingPageConfig): ValidationResult {
  const hasGallery = !!(config.gallery && 
                    (config.gallery.images?.length > 0 || config.gallery.slotOrder));
  
  return {
    check: 'Gallery Configuration',
    level: 'warning',
    passed: hasGallery,
    message: hasGallery
      ? `${config.gallery?.images?.length || 0} images configured`
      : 'No gallery configuration',
    details: hasGallery
      ? undefined
      : 'Gallery should have images or slot system',
    fixSuggestion: hasGallery
      ? undefined
      : 'Add gallery: { images: [...] } to config'
  };
}

/**
 * Check 5: Testimonials Configuration
 */
export function validateTestimonials(config: LandingPageConfig): ValidationResult {
  const testimonialCount = config.testimonials?.testimonials?.length || 0;
  const hasEnough = testimonialCount >= 4;
  
  return {
    check: 'Testimonials',
    level: 'warning',
    passed: hasEnough,
    message: hasEnough
      ? `${testimonialCount} testimonials`
      : `Only ${testimonialCount} testimonials`,
    details: hasEnough
      ? undefined
      : 'Recommended: 4+ testimonials for social proof',
    fixSuggestion: hasEnough
      ? undefined
      : 'Add more testimonials to testimonials.testimonials array'
  };
}

/**
 * Check 6: Event-Specific Configuration (for event pages only)
 */
export function validateEventConfig(config: LandingPageConfig): ValidationResult {
  if (config.pageType !== 'event') {
    return {
      check: 'Event Configuration',
      level: 'info',
      passed: true,
      message: 'Not an event page',
    };
  }
  
  const configAny = config as any;
  const hasEventConfig = configAny.event || config.announcementBar;
  const hasEndDate = configAny.event?.endDate;
  const hasColorScheme = configAny.event?.colorScheme || configAny.primaryColor;
  
  return {
    check: 'Event Configuration',
    level: 'warning',
    passed: hasEventConfig && hasEndDate && hasColorScheme,
    message: hasEventConfig && hasEndDate && hasColorScheme
      ? 'Event config complete'
      : 'Missing event config',
    details: !hasEndDate
      ? 'Event pages need end date for lifecycle management'
      : !hasColorScheme
      ? 'Event pages need color scheme for branding'
      : undefined,
    fixSuggestion: !hasEndDate
      ? 'Add event: { endDate: "YYYY-MM-DD" } to config'
      : !hasColorScheme
      ? 'Add event: { colorScheme: "..." } to config'
      : undefined
  };
}

/**
 * Check 7: FAQ Configuration
 */
export function validateFAQ(config: LandingPageConfig): ValidationResult {
  const faqCount = config.faq?.items?.length || 0;
  const hasEnough = faqCount >= 3;
  
  return {
    check: 'FAQ Items',
    level: 'info',
    passed: hasEnough,
    message: hasEnough
      ? `${faqCount} FAQ items`
      : `Only ${faqCount} FAQ items`,
    details: hasEnough
      ? undefined
      : 'Recommended: 3+ FAQ items',
    fixSuggestion: hasEnough
      ? undefined
      : 'Add more items to faq.items array'
  };
}

/**
 * Check 8: Pricing Configuration
 */
export function validatePricing(config: LandingPageConfig): ValidationResult {
  const hasStandardPricing = config.pricing?.tiers?.standard?.length > 0;
  const hasKingPricing = config.pricing?.tiers?.king?.length > 0;
  
  return {
    check: 'Pricing Configuration',
    level: 'error',
    passed: hasStandardPricing && hasKingPricing,
    message: hasStandardPricing && hasKingPricing
      ? 'Both sizes configured'
      : 'Missing pricing tiers',
    details: !hasStandardPricing || !hasKingPricing
      ? 'Pricing must include both Standard and King sizes'
      : undefined,
    fixSuggestion: !hasStandardPricing || !hasKingPricing
      ? 'Add pricing.tiers.standard and pricing.tiers.king arrays'
      : undefined
  };
}

// ============================================
// VALIDATION RUNNER
// ============================================

/**
 * Run all validation checks on a landing page config
 */
export function validateLandingPage(config: LandingPageConfig): PageValidationReport {
  // Run all validation checks
  const results: ValidationResult[] = [
    validatePageType(config),
    validateSEO(config),
    validateRequiredFields(config),
    validateGalleryConfig(config),
    validateTestimonials(config),
    validateEventConfig(config),
    validateFAQ(config),
    validatePricing(config),
  ];
  
  // Calculate score
  const score = {
    passed: results.filter(r => r.passed && r.level === 'error').length,
    failed: results.filter(r => !r.passed && r.level === 'error').length,
    warnings: results.filter(r => !r.passed && r.level === 'warning').length,
    total: results.filter(r => r.level === 'error').length,
  };
  
  // Determine status
  const status = score.failed === 0 
    ? 'pass' 
    : score.failed <= 2 
    ? 'warning' 
    : 'fail';
  
  return {
    pageId: config.id,
    pageName: config.name,
    pageType: config.pageType,
    results,
    score,
    status,
  };
}

/**
 * Validate all landing pages
 */
export function validateAllLandingPages(configs: LandingPageConfig[]): PageValidationReport[] {
  return configs.map(config => validateLandingPage(config));
}
