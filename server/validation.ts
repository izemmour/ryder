/**
 * Event Page Compliance Validation Engine
 * 
 * Validates that event pages meet all requirements:
 * - Required fields (end date, CTA, angle)
 * - Angle-driven content (gallery images, sub-sentence, color scheme)
 * - Content alignment with angle narrative
 */

import type { LandingPageSetting, MarketingAngle } from "../drizzle/schema";

export interface ComplianceIssue {
  /** Unique identifier for the issue type */
  code: string;
  /** Severity level: 'critical' blocks publishing, 'warning' shows alert, 'info' is advisory */
  severity: 'critical' | 'warning' | 'info';
  /** Human-readable issue description */
  message: string;
  /** Field(s) affected by this issue */
  field: string;
  /** Whether auto-fix is available for this issue */
  autoFixAvailable: boolean;
  /** Suggested action to resolve the issue */
  suggestedAction?: string;
}

export interface ComplianceResult {
  /** Whether the page passes all critical checks */
  isCompliant: boolean;
  /** Total number of issues found */
  issueCount: number;
  /** List of all issues found */
  issues: ComplianceIssue[];
  /** Number of issues that can be auto-fixed */
  autoFixableCount: number;
  /** Timestamp of validation */
  checkedAt: Date;
}

/**
 * Validates a landing page against compliance requirements
 * Note: This function checks database fields. Config-based content (gallery images, sub-sentences, color schemes)
 * defined in landing page config files are considered valid and should not be flagged as missing.
 */
export async function validateEventPage(
  pageSettings: Partial<LandingPageSetting> & { pageId: string; colorScheme?: string | null },
  angle: MarketingAngle | null,
  pageType: 'event' | 'angle' | 'use-case' | 'default',
  hasConfigGallery?: boolean,
  hasConfigSubSentence?: boolean
): Promise<ComplianceResult> {
  const issues: ComplianceIssue[] = [];

  // Critical: Event pages must have end date
  if (pageType === 'event' && !pageSettings.eventEndDate) {
    issues.push({
      code: 'MISSING_END_DATE',
      severity: 'critical',
      message: 'Event end date is required for event pages',
      field: 'eventEndDate',
      autoFixAvailable: false,
      suggestedAction: 'Set an end date in the page settings'
    });
  }

  // Critical: All pages must have CTA assigned
  if (!pageSettings.ctaButtonId) {
    issues.push({
      code: 'MISSING_CTA',
      severity: 'critical',
      message: 'CTA button must be assigned',
      field: 'ctaButtonId',
      autoFixAvailable: true,
      suggestedAction: 'Auto-assign default CTA button'
    });
  }

  // Critical: All pages must have angle assigned
  if (!pageSettings.angleId) {
    issues.push({
      code: 'MISSING_ANGLE',
      severity: 'critical',
      message: 'Marketing angle must be assigned',
      field: 'angleId',
      autoFixAvailable: false,
      suggestedAction: 'Select a marketing angle that matches the page brief'
    });
  }

  // If angle is assigned, validate angle-driven content
  if (pageSettings.angleId && angle) {
    // Warning: Gallery images should be generated based on angle
    // Skip if config file has custom gallery images
    if (!pageSettings.galleryImages && !hasConfigGallery) {
      issues.push({
        code: 'MISSING_GALLERY_IMAGES',
        severity: 'warning',
        message: 'Gallery images have not been generated for this angle',
        field: 'galleryImages',
        autoFixAvailable: true,
        suggestedAction: 'Generate gallery images aligned with angle narrative'
      });
    }

    // Warning: Sub-sentence should be present
    // Skip if config file has subheadline
    if (!pageSettings.subSentence && !hasConfigSubSentence) {
      issues.push({
        code: 'MISSING_SUB_SENTENCE',
        severity: 'warning',
        message: 'Sub-sentence under product description is missing',
        field: 'subSentence',
        autoFixAvailable: true,
        suggestedAction: 'Generate angle-specific sub-sentence'
      });
    }

    // Info: Color scheme should be assigned for event pages
    // Color schemes are now managed via Color Schemes Manager and assigned via colorScheme field
    if (pageType === 'event' && !pageSettings.colorScheme) {
      issues.push({
        code: 'MISSING_COLOR_SCHEME',
        severity: 'info',
        message: 'Event-specific color scheme has not been assigned',
        field: 'colorScheme',
        autoFixAvailable: false,
        suggestedAction: 'Select a color scheme from Color Schemes Manager in page settings'
      });
    }

    // Info: Validate gallery images align with angle narrative
    if (pageSettings.galleryImages) {
      const galleryData = JSON.parse(pageSettings.galleryImages);
      if (!Array.isArray(galleryData) || galleryData.length < 3) {
        issues.push({
          code: 'INSUFFICIENT_GALLERY_IMAGES',
          severity: 'info',
          message: 'Gallery should have at least 3 angle-aligned images',
          field: 'galleryImages',
          autoFixAvailable: true,
          suggestedAction: 'Regenerate gallery with minimum 3 images'
        });
      }
    }
  }

  // Calculate compliance status
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const autoFixableCount = issues.filter(i => i.autoFixAvailable).length;

  return {
    isCompliant: criticalIssues.length === 0,
    issueCount: issues.length,
    issues,
    autoFixableCount,
    checkedAt: new Date()
  };
}

/**
 * Validates angle-content alignment
 * Checks if generated content (gallery, sub-sentence) matches angle narrative
 */
export function validateAngleContentAlignment(
  angle: MarketingAngle,
  galleryImages: string[] | null,
  subSentence: string | null
): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  // Check if gallery images exist
  if (!galleryImages || galleryImages.length === 0) {
    issues.push({
      code: 'GALLERY_NOT_GENERATED',
      severity: 'warning',
      message: `Gallery images not generated for angle: ${angle.name}`,
      field: 'galleryImages',
      autoFixAvailable: true,
      suggestedAction: 'Generate gallery images that showcase the angle narrative'
    });
  }

  // Check if sub-sentence exists
  if (!subSentence || subSentence.trim().length === 0) {
    issues.push({
      code: 'SUB_SENTENCE_MISSING',
      severity: 'warning',
      message: `Sub-sentence not generated for angle: ${angle.name}`,
      field: 'subSentence',
      autoFixAvailable: true,
      suggestedAction: 'Generate a compelling sub-sentence that reinforces the angle'
    });
  }

  return issues;
}

/**
 * Validates event-specific color scheme
 * Checks if color scheme matches event theme
 */
export function validateEventColorScheme(
  pageId: string,
  colorScheme: string | null
): ComplianceIssue[] {
  const issues: ComplianceIssue[] = [];

  // Define expected color schemes for known events (using slugs from Color Schemes Manager)
  const eventColorSchemes: Record<string, string[]> = {
    'black-friday': ['black-friday'],
    'valentine-gift': ['valentine-gift'],
    'mothers-day': ['mothers-day'],
    'fathers-day': ['fathers-day']
  };

  const expectedSchemes = eventColorSchemes[pageId];

  if (expectedSchemes && !colorScheme) {
    issues.push({
      code: 'COLOR_SCHEME_NOT_ASSIGNED',
      severity: 'info',
      message: `Color scheme not assigned for ${pageId}`,
      field: 'colorScheme',
      autoFixAvailable: false,
      suggestedAction: `Select a color scheme from Color Schemes Manager`
    });
  }

  if (expectedSchemes && colorScheme && !expectedSchemes.includes(colorScheme)) {
    issues.push({
      code: 'COLOR_SCHEME_MISMATCH',
      severity: 'info',
      message: `Color scheme "${colorScheme}" may not match event theme`,
      field: 'colorScheme',
      autoFixAvailable: false,
      suggestedAction: `Consider using: ${expectedSchemes.join(', ')}`
    });
  }

  return issues;
}

/**
 * Batch validation for multiple pages
 */
export async function validateAllPages(
  pages: Array<{
    settings: Partial<LandingPageSetting> & { pageId: string; colorScheme?: string | null };
    angle: MarketingAngle | null;
    pageType: 'event' | 'angle' | 'use-case' | 'default';
    hasConfigGallery?: boolean;
    hasConfigSubSentence?: boolean;
  }>
): Promise<Map<string, ComplianceResult>> {
  const results = new Map<string, ComplianceResult>();

  for (const page of pages) {
    const result = await validateEventPage(
      page.settings,
      page.angle,
      page.pageType,
      page.hasConfigGallery,
      page.hasConfigSubSentence
    );
    results.set(page.settings.pageId, result);
  }

  return results;
}
