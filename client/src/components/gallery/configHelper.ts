/**
 * Gallery Config Helper
 * 
 * Converts LandingPageConfig gallery settings to ProductGallery props format.
 * This allows existing configs to work with the new component system while
 * maintaining backward compatibility.
 */

import type { LandingPageConfig, GallerySlotType as ConfigSlotType, GallerySlotOverride } from '@/config/types';
import type { GallerySlotType, GallerySlotConfig, AwardItem } from './types';
import { STANDARD_GALLERY_ORDER } from './types';

/**
 * Convert config slot type to gallery slot type
 */
function mapSlotType(type: ConfigSlotType): GallerySlotType {
  // The types are the same, but we need to handle the mapping
  const mapping: Record<ConfigSlotType, GallerySlotType> = {
    'intro': 'intro',
    'tips': 'tips',
    'layers': 'layers',
    'vs': 'vs',
    'care': 'care',
    'hotel-compare': 'hotel-compare',
    'summary': 'summary',
  };
  return mapping[type];
}

/**
 * Convert GallerySlotOverride to GallerySlotConfig
 */
function convertOverrideToConfig(type: GallerySlotType, override?: GallerySlotOverride): GallerySlotConfig | undefined {
  if (!override) return undefined;
  
  return {
    type,
    image: override.image,
    thumbnailTag: override.thumbnailTag,
    pills: override.pills?.map(p => ({
      number: p.number,
      title: p.title,
      description: p.description,
    })),
    headline: override.headline,
  };
}

/**
 * Convert LandingPageConfig gallery settings to ProductGallery props
 */
export function convertConfigToGalleryProps(config: LandingPageConfig): {
  configId: string;
  slots?: Partial<Record<GallerySlotType, GallerySlotConfig>>;
  order?: GallerySlotType[];
  awards?: AwardItem[];
} {
  const gallery = config.gallery;
  
  // Convert slot order if specified
  const order = gallery.slotOrder 
    ? gallery.slotOrder.map(mapSlotType)
    : STANDARD_GALLERY_ORDER;
  
  // Convert slot overrides
  const slots: Partial<Record<GallerySlotType, GallerySlotConfig>> = {};
  
  if (gallery.slotOverrides) {
    for (const [type, override] of Object.entries(gallery.slotOverrides)) {
      const slotType = mapSlotType(type as ConfigSlotType);
      const slotConfig = convertOverrideToConfig(slotType, override);
      if (slotConfig) {
        slots[slotType] = slotConfig;
      }
    }
  }
  
  // Convert awards
  const awards: AwardItem[] = gallery.awardCarouselItems.map(item => ({
    award: item.title,
    publication: item.source,
  }));
  
  return {
    configId: config.id,
    slots: Object.keys(slots).length > 0 ? slots : undefined,
    order,
    awards: awards.length > 0 ? awards : undefined,
  };
}

/**
 * Pre-defined gallery configurations for common angle pages
 * These can be used directly or as templates for new configs
 */
export const GALLERY_PRESETS = {
  // Side Sleeper - Focus on support and alignment
  'side-sleeper': {
    slotOverrides: {
      tips: {
        pills: [
          { number: 1, title: 'Side Sleeper Support', description: 'Maintains spinal alignment all night' },
          { number: 2, title: 'Pressure Relief', description: 'Cradles head and neck perfectly' },
          { number: 3, title: 'Wake Refreshed', description: 'No more shoulder or neck pain' },
        ],
      },
    },
  },
  
  // Father's Day - Gift-focused messaging
  'fathers-day': {
    slotOverrides: {
      intro: {
        image: '/images/fathers-day-hero.png',
      },
      tips: {
        pills: [
          { number: 1, title: 'Perfect Gift', description: 'Show Dad you care about his sleep' },
          { number: 2, title: 'Quality Rest', description: 'He deserves the best after long days' },
          { number: 3, title: 'Lasting Comfort', description: 'Years of great sleep ahead' },
        ],
      },
    },
  },
  
  // Mother's Day - Gift-focused messaging
  'mothers-day': {
    slotOverrides: {
      intro: {
        image: '/images/mothers-day-hero.png',
      },
      tips: {
        pills: [
          { number: 1, title: 'She Deserves It', description: 'Treat Mom to luxury sleep' },
          { number: 2, title: 'Self-Care Gift', description: 'Better rest for busy moms' },
          { number: 3, title: 'Wake Refreshed', description: 'Ready to take on the day' },
        ],
      },
    },
  },
  
  // Neck Pain Relief - Health-focused messaging
  'neck-pain-relief': {
    slotOverrides: {
      intro: {
        image: '/images/neck-pain-cervical-alignment.png',
      },
      tips: {
        pills: [
          { number: 1, title: 'Cervical Support', description: 'Proper neck alignment all night' },
          { number: 2, title: 'Pain Relief', description: 'Wake up without stiffness' },
          { number: 3, title: 'Doctor Approved', description: 'Recommended by sleep specialists' },
        ],
      },
      layers: {
        pills: [
          { number: 1, title: 'Support Core', description: 'Maintains cervical curve' },
          { number: 2, title: 'Comfort Layer', description: 'Pressure-relieving softness' },
          { number: 3, title: 'Breathable Shell', description: 'Stays cool all night' },
        ],
      },
    },
  },
  
  // Restorative Alignment - Wellness-focused messaging
  'restorative-alignment': {
    slotOverrides: {
      intro: {
        image: '/images/sleep-alignment.png',
      },
      tips: {
        pills: [
          { number: 1, title: 'Spinal Alignment', description: 'Wake up properly aligned' },
          { number: 2, title: 'Deep Sleep', description: 'Restorative rest every night' },
          { number: 3, title: 'Morning Energy', description: 'Start each day refreshed' },
        ],
      },
    },
  },
  
  // Hotel Quality - Luxury-focused messaging
  'hotel-quality': {
    slotOrder: ['intro', 'hotel-compare', 'tips', 'vs', 'layers', 'care', 'summary'] as GallerySlotType[],
    slotOverrides: {
      intro: {
        image: '/images/hotel-hero-price-comparison.png',
      },
      tips: {
        pills: [
          { number: 1, title: '5-Star Quality', description: 'Same pillows as luxury hotels' },
          { number: 2, title: 'Fraction of Price', description: 'Hotel comfort without the markup' },
          { number: 3, title: 'Home Luxury', description: 'Every night feels like vacation' },
        ],
      },
    },
  },
} as const;

/**
 * Get preset gallery configuration for a page ID
 */
export function getGalleryPreset(pageId: string): typeof GALLERY_PRESETS[keyof typeof GALLERY_PRESETS] | undefined {
  return GALLERY_PRESETS[pageId as keyof typeof GALLERY_PRESETS];
}
