/**
 * Landing Page Validation Script
 * 
 * Validates landing pages against LANDING_PAGE_GUIDELINES.md checklist
 * 
 * Usage:
 *   pnpm validate:lp              # Validate all pages
 *   pnpm validate:lp <page-id>    # Validate specific page
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { landingPageConfigs } from '../client/src/config/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// TYPES
// ============================================

type PageType = 'angle' | 'event' | 'use-case';

type ValidationLevel = 'error' | 'warning' | 'info';

interface ValidationResult {
  check: string;
  level: ValidationLevel;
  passed: boolean;
  message: string;
  details?: string;
}

interface PageValidationReport {
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
}

// ============================================
// CONFIGURATION
// ============================================

const PROJECT_ROOT = path.resolve(__dirname, '..');
const APP_FILE = path.join(PROJECT_ROOT, 'client/src/App.tsx');
const LP_MANAGER_FILE = path.join(PROJECT_ROOT, 'client/src/pages/LPManager.tsx');
const CONFIG_INDEX_FILE = path.join(PROJECT_ROOT, 'client/src/config/index.ts');

// ============================================
// VALIDATION CHECKS
// ============================================

/**
 * Check 1: Page Type Defined (Mandatory)
 * Every landing page must have a pageType field
 */
function validatePageType(config: any): ValidationResult {
  const hasPageType = config.pageType && ['angle', 'event', 'use-case'].includes(config.pageType);
  
  return {
    check: 'Page Type Defined',
    level: 'error',
    passed: hasPageType,
    message: hasPageType 
      ? `Page type correctly defined as "${config.pageType}"`
      : 'Missing or invalid pageType field',
    details: hasPageType 
      ? undefined 
      : 'Add pageType: "angle" | "event" | "use-case" to config'
  };
}

/**
 * Check 2: SEO Configuration
 * Must have title following "{Title} – FluffCo" format
 */
function validateSEO(config: any): ValidationResult {
  const hasSEO = config.seo && config.seo.title && config.seo.description;
  const titleFormat = config.seo?.title?.includes('FluffCo') || config.seo?.title?.includes('–');
  
  return {
    check: 'SEO Configuration',
    level: 'error',
    passed: hasSEO && titleFormat,
    message: hasSEO && titleFormat
      ? 'SEO configuration complete'
      : 'Missing or incorrectly formatted SEO fields',
    details: !hasSEO 
      ? 'Add seo.title and seo.description fields'
      : !titleFormat
      ? 'Title should follow format: "{Title} – FluffCo"'
      : undefined
  };
}

/**
 * Check 3: LP Manager Integration
 * Page must be in landingPageConfigs array (config/index.ts)
 */
function validateLPManagerIntegration(config: any): ValidationResult {
  try {
    const configIndexContent = fs.readFileSync(CONFIG_INDEX_FILE, 'utf-8');
    // Check if config is exported in landingPageConfigs array
    const configVarName = config.id.split('-').map((word: string, i: number) => 
      i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('') + 'Config';
    
    const isInArray = configIndexContent.includes(`export const landingPageConfigs`) &&
                     configIndexContent.includes(configVarName);
    
    return {
      check: 'LP Manager Integration',
      level: 'error',
      passed: isInArray,
      message: isInArray
        ? 'Page registered in LP Manager'
        : 'Page not found in LP Manager',
      details: isInArray
        ? undefined
        : `Add ${configVarName} to landingPageConfigs array in config/index.ts`
    };
  } catch (error) {
    return {
      check: 'LP Manager Integration',
      level: 'warning',
      passed: false,
      message: 'Could not verify LP Manager integration',
      details: 'config/index.ts file not accessible'
    };
  }
}

/**
 * Check 4: Route Configuration
 * Page must have a route in App.tsx
 */
function validateRouteConfiguration(config: any): ValidationResult {
  try {
    const appContent = fs.readFileSync(APP_FILE, 'utf-8');
    const hasRoute = appContent.includes(config.slug) && 
                    appContent.includes('<Route');
    
    return {
      check: 'Route Configuration',
      level: 'error',
      passed: hasRoute,
      message: hasRoute
        ? 'Route configured in App.tsx'
        : 'No route found in App.tsx',
      details: hasRoute
        ? undefined
        : `Add route for "/${config.slug}" in App.tsx`
    };
  } catch (error) {
    return {
      check: 'Route Configuration',
      level: 'warning',
      passed: false,
      message: 'Could not verify route configuration',
      details: 'App.tsx file not accessible'
    };
  }
}

/**
 * Check 5: Required Config Fields
 * Must have id, name, slug, sections array
 */
function validateRequiredFields(config: any): ValidationResult {
  const requiredFields = ['id', 'name', 'slug', 'sections'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  return {
    check: 'Required Config Fields',
    level: 'error',
    passed: missingFields.length === 0,
    message: missingFields.length === 0
      ? 'All required fields present'
      : `Missing required fields: ${missingFields.join(', ')}`,
    details: missingFields.length > 0
      ? 'Add missing fields to config'
      : undefined
  };
}

/**
 * Check 6: Gallery Configuration
 * Must have gallery config with images or slot system
 */
function validateGalleryConfig(config: any): ValidationResult {
  const hasGallery = config.gallery && 
                    (config.gallery.images?.length > 0 || config.gallery.slotOrder);
  
  return {
    check: 'Gallery Configuration',
    level: 'warning',
    passed: hasGallery,
    message: hasGallery
      ? 'Gallery configuration present'
      : 'Missing or empty gallery configuration',
    details: hasGallery
      ? undefined
      : 'Add gallery.images or gallery.slotOrder to config'
  };
}

/**
 * Check 7: Testimonials Configuration
 * Should have at least 4 testimonials
 */
function validateTestimonials(config: any): ValidationResult {
  const testimonialCount = config.testimonials?.testimonials?.length || 0;
  const hasEnough = testimonialCount >= 4;
  
  return {
    check: 'Testimonials Configuration',
    level: 'warning',
    passed: hasEnough,
    message: hasEnough
      ? `${testimonialCount} testimonials configured`
      : `Only ${testimonialCount} testimonials (recommended: 4+)`,
    details: hasEnough
      ? undefined
      : 'Add more testimonials for better social proof'
  };
}

/**
 * Check 8: Event-Specific Configuration (for event pages only)
 * Event pages should have color scheme and end date
 */
function validateEventConfig(config: any): ValidationResult {
  if (config.pageType !== 'event') {
    return {
      check: 'Event Configuration',
      level: 'info',
      passed: true,
      message: 'Not an event page (check skipped)',
    };
  }
  
  const hasEventConfig = config.event || config.announcementBar;
  const hasEndDate = config.event?.endDate;
  const hasColorScheme = config.event?.colorScheme || config.primaryColor;
  
  return {
    check: 'Event Configuration',
    level: 'warning',
    passed: hasEventConfig && hasEndDate && hasColorScheme,
    message: hasEventConfig && hasEndDate && hasColorScheme
      ? 'Event configuration complete'
      : 'Missing event-specific configuration',
    details: !hasEndDate
      ? 'Add event.endDate for proper event lifecycle'
      : !hasColorScheme
      ? 'Add event.colorScheme or primaryColor for event branding'
      : undefined
  };
}

/**
 * Check 9: FAQ Configuration
 * Should have FAQ section with items
 */
function validateFAQ(config: any): ValidationResult {
  const faqCount = config.faq?.items?.length || 0;
  const hasEnough = faqCount >= 3;
  
  return {
    check: 'FAQ Configuration',
    level: 'info',
    passed: hasEnough,
    message: hasEnough
      ? `${faqCount} FAQ items configured`
      : `Only ${faqCount} FAQ items (recommended: 3+)`,
    details: hasEnough
      ? undefined
      : 'Add more FAQ items to address common questions'
  };
}

/**
 * Check 10: Pricing Configuration
 * Must have pricing tiers for both sizes
 */
function validatePricing(config: any): ValidationResult {
  const hasStandardPricing = config.pricing?.tiers?.standard?.length > 0;
  const hasKingPricing = config.pricing?.tiers?.king?.length > 0;
  
  return {
    check: 'Pricing Configuration',
    level: 'error',
    passed: hasStandardPricing && hasKingPricing,
    message: hasStandardPricing && hasKingPricing
      ? 'Pricing configured for both sizes'
      : 'Missing pricing configuration',
    details: !hasStandardPricing || !hasKingPricing
      ? 'Add pricing.tiers.standard and pricing.tiers.king arrays'
      : undefined
  };
}

// ============================================
// VALIDATION RUNNER
// ============================================

function validatePage(config: any): PageValidationReport {
  // Run all validation checks
  const results: ValidationResult[] = [
    validatePageType(config),
    validateSEO(config),
    validateLPManagerIntegration(config),
    validateRouteConfiguration(config),
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
  
  return {
    pageId: config.id,
    pageName: config.name,
    pageType: config.pageType,
    results,
    score,
  };
}

// ============================================
// REPORT FORMATTING
// ============================================

function formatReport(report: PageValidationReport): string {
  const { pageId, pageName, pageType, score, results } = report;
  
  // Determine overall status
  const status = score.failed === 0 
    ? '✅ PASS' 
    : score.failed <= 2 
    ? '⚠️  NEEDS ATTENTION' 
    : '❌ FAIL';
  
  let output = '\n';
  output += '═'.repeat(80) + '\n';
  output += `  ${status}  ${pageName} (${pageId})\n`;
  output += '═'.repeat(80) + '\n';
  output += `  Type: ${pageType || 'unknown'}\n`;
  output += `  Score: ${score.passed}/${score.total} critical checks passed`;
  if (score.warnings > 0) {
    output += ` | ${score.warnings} warnings`;
  }
  output += '\n';
  output += '─'.repeat(80) + '\n\n';
  
  // Group results by level
  const errors = results.filter(r => r.level === 'error');
  const warnings = results.filter(r => r.level === 'warning');
  const info = results.filter(r => r.level === 'info');
  
  // Show errors first
  if (errors.length > 0) {
    output += '  CRITICAL CHECKS:\n';
    errors.forEach(result => {
      const icon = result.passed ? '  ✓' : '  ✗';
      output += `${icon} ${result.check}: ${result.message}\n`;
      if (result.details && !result.passed) {
        output += `    → ${result.details}\n`;
      }
    });
    output += '\n';
  }
  
  // Show warnings
  if (warnings.length > 0) {
    output += '  WARNINGS:\n';
    warnings.forEach(result => {
      const icon = result.passed ? '  ✓' : '  ⚠';
      output += `${icon} ${result.check}: ${result.message}\n`;
      if (result.details && !result.passed) {
        output += `    → ${result.details}\n`;
      }
    });
    output += '\n';
  }
  
  // Show info (optional)
  const failedInfo = info.filter(r => !r.passed);
  if (failedInfo.length > 0) {
    output += '  RECOMMENDATIONS:\n';
    failedInfo.forEach(result => {
      output += `  ℹ ${result.check}: ${result.message}\n`;
      if (result.details) {
        output += `    → ${result.details}\n`;
      }
    });
    output += '\n';
  }
  
  return output;
}

function formatSummary(reports: PageValidationReport[]): string {
  const totalPages = reports.length;
  const passedPages = reports.filter(r => r.score.failed === 0).length;
  const failedPages = reports.filter(r => r.score.failed > 0).length;
  
  let output = '\n';
  output += '═'.repeat(80) + '\n';
  output += '  VALIDATION SUMMARY\n';
  output += '═'.repeat(80) + '\n';
  output += `  Total Pages: ${totalPages}\n`;
  output += `  Passed: ${passedPages} ✅\n`;
  output += `  Failed: ${failedPages} ❌\n`;
  output += '═'.repeat(80) + '\n';
  
  return output;
}

// ============================================
// MAIN
// ============================================

function main() {
  const args = process.argv.slice(2);
  const targetId = args[0];
  
  console.log('\n🔍 Landing Page Validation Script');
  console.log('📋 Checking against LANDING_PAGE_GUIDELINES.md\n');
  
  // Get all configs
  const configs = Object.values(landingPageConfigs);
  
  // Filter by target ID if specified
  const configsToValidate = targetId
    ? configs.filter(config => config.id === targetId || config.slug === targetId)
    : configs;
  
  if (configsToValidate.length === 0) {
    console.error(`❌ No pages found${targetId ? ` matching "${targetId}"` : ''}`);
    process.exit(1);
  }
  
  // Validate each page
  const reports: PageValidationReport[] = [];
  for (const config of configsToValidate) {
    try {
      const report = validatePage(config);
      reports.push(report);
      console.log(formatReport(report));
    } catch (error) {
      console.error(`❌ Error validating ${config.id}:`, error);
    }
  }
  
  // Show summary
  if (reports.length > 1) {
    console.log(formatSummary(reports));
  }
  
  // Exit with error code if any pages failed
  const hasFailures = reports.some(r => r.score.failed > 0);
  process.exit(hasFailures ? 1 : 0);
}

main();
