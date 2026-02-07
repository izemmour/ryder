/**
 * Gallery Slot System Types
 * 
 * Each gallery slot has a specific purpose that remains consistent across all pages.
 * Only the text content can be customized per angle page.
 * 
 * SLOT PURPOSES:
 * 1. INTRO/HERO - Product introduction with Oprah Daily badge and award carousel
 * 2. TIPS - Lifestyle tips with 3 overlay pills (customizable text)
 * 3. LAYERS - Engineering/pillow layers with 3 overlay pills (customizable text)
 * 4. VS - Standard vs FluffCo comparison slide
 * 5. CARE - Washing/care instructions with 3 overlay pills
 * 6. HOTEL_COMPARE - Price comparison vs luxury hotels
 * 7. SUMMARY - Hotel comfort packaging with headline
 */

export type GallerySlotType = 
  | 'intro'
  | 'tips'
  | 'layers'
  | 'vs'
  | 'care'
  | 'hotel-compare'
  | 'summary';

export interface OverlayPill {
  number: number;
  title: string;
  description: string;
}

export interface GallerySlotConfig {
  type: GallerySlotType;
  image?: string; // Optional override for the base image
  thumbnailTag?: string; // Optional override for thumbnail tag
  pills?: OverlayPill[]; // Optional override for overlay pills text
  headline?: string; // Optional override for headline (used in summary slot)
}

// Default images for each slot type
export const DEFAULT_SLOT_IMAGES: Record<GallerySlotType, string> = {
  'intro': '/images/hero-pillow.png',
  'tips': '/images/lifestyle-sleep.png',
  'layers': '/images/engineering-detail-new.png',
  'vs': 'comparison', // Special component type
  'care': '/images/washing-machine.png',
  'hotel-compare': 'hotel-comparison', // Special component type
  'summary': '/images/hotel-comfort-packaging.png',
};

// Default thumbnail tags for each slot type
// These should be short, inviting labels that fit in small spaces
export const DEFAULT_THUMBNAIL_TAGS: Record<GallerySlotType, string> = {
  'intro': '', // No overlay text for intro - the pillow image speaks for itself
  'tips': '3 tips', // Changed from 'tips' - clearer that there are 3 tips to discover
  'layers': '3 layers', // Keep as is - clear and descriptive
  'vs': 'VS', // Keep as is - universally understood
  'care': 'care', // Simplified from '3 care' - cleaner
  'hotel-compare': '5-star', // Changed from 'compare' - emphasizes luxury hotel comparison
  'summary': 'hotel', // Keep as is - indicates hotel-quality
};

// Default overlay pills for tips slot
export const DEFAULT_TIPS_PILLS: OverlayPill[] = [
  { number: 1, title: 'Elevate Your Sleep', description: 'Same 5-star quality as luxury resorts' },
  { number: 2, title: 'Custom Support', description: 'Pillow-in-pillow design for cloud comfort' },
  { number: 3, title: 'Wake Refreshed', description: 'Clear-eyed, pain free, ready for the day' },
];

// Default overlay pills for layers slot
export const DEFAULT_LAYERS_PILLS: OverlayPill[] = [
  { number: 1, title: 'Cotton Shell', description: '100% breathable cotton exterior' },
  { number: 2, title: 'Microfiber Fill', description: '5x thinner than human hair for plush feel' },
  { number: 3, title: 'Structural Core', description: 'Sanforized for lasting shape retention' },
];

// Default overlay pills for care slot
export const DEFAULT_CARE_PILLS: OverlayPill[] = [
  { number: 1, title: 'Machine Washable', description: 'Toss it in, comes out perfect' },
  { number: 2, title: 'Shape Retention', description: 'Maintains loft after every wash' },
  { number: 3, title: 'Practical Hygiene', description: 'Clean sleep without compromise' },
];

// Default headline for summary slot
export const DEFAULT_SUMMARY_HEADLINE = '5-Star Hotel Comfort at Home';

// Helper to get default pills for a slot type
export function getDefaultPills(type: GallerySlotType): OverlayPill[] | undefined {
  switch (type) {
    case 'tips':
      return DEFAULT_TIPS_PILLS;
    case 'layers':
      return DEFAULT_LAYERS_PILLS;
    case 'care':
      return DEFAULT_CARE_PILLS;
    default:
      return undefined;
  }
}

// Helper to merge slot config with defaults
export function mergeSlotConfig(config: GallerySlotConfig): Required<Omit<GallerySlotConfig, 'headline'>> & { headline?: string } {
  const defaultImage = DEFAULT_SLOT_IMAGES[config.type];
  const defaultTag = DEFAULT_THUMBNAIL_TAGS[config.type];
  const defaultPills = getDefaultPills(config.type);
  
  return {
    type: config.type,
    image: config.image || defaultImage,
    thumbnailTag: config.thumbnailTag || defaultTag,
    pills: config.pills || defaultPills || [],
    headline: config.headline,
  };
}

// Standard gallery order (can be reordered per page)
export const STANDARD_GALLERY_ORDER: GallerySlotType[] = [
  'intro',
  'tips',
  'layers',
  'vs',
  'care',
  'hotel-compare',
  'summary',
];

// Award item for the carousel
export interface AwardItem {
  award: string;
  publication: string;
}

// Default awards list
export const DEFAULT_AWARDS: AwardItem[] = [
  { award: "Best Down Pillow", publication: "Men's Health" },
  { award: "Best Soft Pillow", publication: "Architectural Digest" },
  { award: "Best Pillow for Side Sleepers", publication: "Sleep Foundation" },
  { award: "Best Luxury Pillow", publication: "Forbes" },
  { award: "Best Pillow Overall", publication: "Good Housekeeping" },
];
