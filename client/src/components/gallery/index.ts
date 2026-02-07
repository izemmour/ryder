/**
 * Gallery Component System
 * 
 * Centralized gallery components for consistent product display across all landing pages.
 * 
 * Usage:
 * ```tsx
 * import { ProductGallery } from '@/components/gallery';
 * 
 * // Basic usage with defaults
 * <ProductGallery />
 * 
 * // With custom slot configurations
 * <ProductGallery
 *   configId="fathers-day"
 *   slots={{
 *     intro: { image: '/images/fathers-day-hero.png' },
 *     tips: {
 *       pills: [
 *         { number: 1, title: 'Perfect Gift', description: 'Show Dad you care' },
 *         { number: 2, title: 'Quality Sleep', description: 'He deserves the best' },
 *         { number: 3, title: 'Lasting Comfort', description: 'Years of great sleep' },
 *       ]
 *     }
 *   }}
 * />
 * 
 * // With custom order (reorder or omit slots)
 * <ProductGallery
 *   order={['intro', 'hotel-compare', 'tips', 'vs', 'layers', 'care', 'summary']}
 * />
 * ```
 */

// Main component
export { ProductGallery } from './ProductGallery';
export type { ProductGalleryProps } from './ProductGallery';

// Comparison slides (can be used standalone)
export { 
  ComparisonSlide, 
  HotelComparisonSlide, 
  ComparisonThumbnail, 
  HotelComparisonThumbnail 
} from './ComparisonSlides';

// Overlay components (can be used standalone)
export { 
  OprahDailyBadge, 
  AwardCarousel, 
  TrialBadge, 
  OverlayPills, 
  SummaryHeadline 
} from './GalleryOverlays';

// Types and defaults
export type { 
  GallerySlotType, 
  GallerySlotConfig, 
  OverlayPill, 
  AwardItem 
} from './types';

export { 
  DEFAULT_SLOT_IMAGES,
  DEFAULT_THUMBNAIL_TAGS,
  DEFAULT_TIPS_PILLS,
  DEFAULT_LAYERS_PILLS,
  DEFAULT_CARE_PILLS,
  DEFAULT_AWARDS,
  STANDARD_GALLERY_ORDER,
  getDefaultPills,
  mergeSlotConfig,
} from './types';

// Config helpers
export { 
  convertConfigToGalleryProps, 
  getGalleryPreset,
  GALLERY_PRESETS,
} from './configHelper';
