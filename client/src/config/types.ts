/**
 * Landing Page Configuration Types
 * 
 * This file defines the TypeScript interfaces for configuring
 * template-based landing pages with customizable content and sections.
 */

// ============================================
// SECTION TYPES
// ============================================

export type SectionId = 
  | 'hero'
  | 'benefits'
  | 'sleeper-types'
  | 'price-comparison'
  | 'the-difference'
  | 'sleep-experts'
  | 'technology'
  | 'fluffco-secret'
  | 'features-grid'
  | 'testimonials'
  | 'pricing'
  | 'faq';

// ============================================
// HERO SECTION CONFIG
// ============================================

export interface HeroConfig {
  headline: string;
  subheadline: string;
  /** Optional: Event-specific headline to display on gallery image 1 (top-right overlay) */
  eventHeadline?: string;
  trustBadge: {
    reviewCount: string;
    rating: string;
    source: string;
  };
  usps: Array<{
    icon: 'support' | 'temperature' | 'hypoallergenic' | 'location' | 'shield' | 'clock';
    title: string;
    description: string;
  }>;
  showOekoTexBadge: boolean;
  showOprahBadge: boolean;
  show30NightsBadge: boolean;
}

// ============================================
// GALLERY CONFIG
// ============================================

/**
 * Gallery Slot Types - Each slot has a specific purpose:
 * - intro: Hero pillow with Oprah Daily badge, Trial badge, Award carousel
 * - tips: Lifestyle image with 3 customizable tip pills
 * - layers: Engineering detail with 3 customizable layer pills
 * - vs: Standard vs FluffCo comparison slide (fixed content)
 * - care: Washing machine with 3 customizable care pills
 * - hotel-compare: Price comparison vs hotels (fixed content)
 * - summary: Hotel comfort packaging with customizable headline
 */
export type GallerySlotType = 'intro' | 'tips' | 'layers' | 'vs' | 'care' | 'hotel-compare' | 'summary';

export interface GalleryOverlayPill {
  number: number;
  title: string;
  description: string;
}

export interface GallerySlotOverride {
  /** Override the default image for this slot */
  image?: string;
  /** Override the thumbnail tag text */
  thumbnailTag?: string;
  /** Override the overlay pills text (for tips, layers, care slots) */
  pills?: GalleryOverlayPill[];
  /** Override the headline (for summary slot) */
  headline?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  type: 'image' | 'comparison' | 'hotel-comparison';
  badges?: Array<{
    type: 'text' | 'icon';
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center';
    content: string;
    subtext?: string;
  }>;
}

export interface GalleryConfig {
  /** Legacy: Array of gallery images (deprecated, use slots instead) */
  images: GalleryImage[];
  showAwardCarousel: boolean;
  awardCarouselItems: Array<{
    title: string;
    source: string;
  }>;
  
  /** NEW: Gallery slot customization system */
  /** Custom order of gallery slots (default: intro, tips, layers, vs, care, hotel-compare, summary) */
  slotOrder?: GallerySlotType[];
  /** Slot-specific overrides (only override what you need to customize) */
  slotOverrides?: Partial<Record<GallerySlotType, GallerySlotOverride>>;
}

// ============================================
// BENEFITS SECTION CONFIG
// ============================================

export interface BenefitItem {
  icon: 'moon' | 'refresh' | 'sparkles' | 'shield';
  title: string;
  description: string;
}

export interface BenefitsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  benefits: BenefitItem[];
}

// ============================================
// SLEEPER TYPES SECTION CONFIG
// ============================================

export interface SleeperType {
  type: 'back' | 'side' | 'stomach';
  image: string;
  title: string;
  description: string;
}

export interface SleeperTypesConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  sleeperTypes: SleeperType[];
  trustBadges: Array<{
    icon: 'heart' | 'moon';
    text: string;
  }>;
}

// ============================================
// PRICE COMPARISON SECTION CONFIG
// ============================================

export interface PriceComparisonConfig {
  enabled: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  retailPrice: number;
  retailBreakdown: Array<{
    label: string;
    amount: number;
    color: string;
  }>;
  directPrice: number;
  directBreakdown: Array<{
    label: string;
    amount: number;
    color: string;
  }>;
  savingsCalculator: {
    show: boolean;
    quantities: number[];
  };
}

// ============================================
// THE DIFFERENCE SECTION CONFIG
// ============================================

export interface DifferenceConfig {
  standardPillowTitle: string;
  standardPillowPoints: string[];
  fluffcoPillowTitle: string;
  fluffcoPillowPoints: string[];
}

// ============================================
// SLEEP EXPERTS SECTION CONFIG
// ============================================

export interface ExpertCard {
  image: string;
  title: string;
  expandedContent: string[];
}

export interface SleepExpertsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  cards: ExpertCard[];
}

// ============================================
// TECHNOLOGY SECTION CONFIG
// ============================================

export interface TechnologyFeature {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface TechnologyConfig {
  sectionTitle: string;
  features: TechnologyFeature[];
}

// ============================================
// FLUFFCO SECRET SECTION CONFIG
// ============================================

export interface SecretFeature {
  title: string;
  description: string;
  bulletPoints: string[];
}

export interface FluffcoSecretConfig {
  features: SecretFeature[];
}

// ============================================
// FEATURES GRID SECTION CONFIG
// ============================================

export interface FeatureGridItem {
  icon: 'clock' | 'refresh' | 'droplets' | 'shield' | 'thermometer' | 'layers';
  title: string;
  description: string;
}

export interface FeaturesGridConfig {
  sectionTitle: string;
  features: FeatureGridItem[];
}

// ============================================
// TESTIMONIALS SECTION CONFIG
// ============================================

export interface Testimonial {
  name: string;
  location: string;
  verified: boolean;
  content: string;
  highlight?: string;
}

export interface TestimonialsConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  testimonials: Testimonial[];
  showMoreButton: boolean;
}

// ============================================
// PRICING SECTION CONFIG
// ============================================

export interface PricingTier {
  quantity: number;
  pricePerPillow: number;
  totalPrice: number;
  originalPrice: number;
  savings: number;
  savingsPercent: number;
  badge?: 'popular' | 'best-value';
  bonus?: {
    text: string;
    value: number;
  };
}

export interface PricingConfig {
  sectionTitle: string;
  sectionSubtitle: string;
  sizes: Array<{
    id: 'standard' | 'king';
    name: string;
    dimensions: string;
    badge?: string;
  }>;
  tiers: {
    standard: PricingTier[];
    king: PricingTier[];
  };
  trustBadges: string[];
  pressQuotes: Array<{
    quote: string;
    source: string;
  }>;
}

// ============================================
// FAQ SECTION CONFIG
// ============================================

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQConfig {
  sectionTitle: string;
  items: FAQItem[];
}

// ============================================
// ANNOUNCEMENT BAR CONFIG
// ============================================

export interface AnnouncementBarConfig {
  text: string;
  showTimer: boolean;
  ctaText: string;
  ctaTarget: string;
}

// ============================================
// HEADER CONFIG
// ============================================

export interface HeaderConfig {
  navItems: Array<{
    id: string;
    label: string;
  }>;
  ctaText: string;
}

// ============================================
// FOOTER CONFIG
// ============================================

export interface FooterConfig {
  tagline: string;
  links: Array<{
    label: string;
    href: string;
  }>;
  copyright: string;
}

// ============================================
// SEO CONFIG
// ============================================

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
}

// ============================================
// MAIN LANDING PAGE CONFIG
// ============================================

export interface LandingPageConfig {
  // Metadata
  id: string;
  name: string;
  slug: string;
  /** Page type determines template behavior and customization rules (see LANDING_PAGE_GUIDELINES.md) */
  pageType: 'angle' | 'event' | 'use-case';
  /** Legacy field for backward compatibility - use pageType instead */
  category?: 'legacy' | 'angle' | 'event' | 'use-case';
  redirectUrl?: string; // Optional: URL to redirect CTAs to (default: '/' for use-case pages)
  seo: SEOConfig;
  
  // Global settings
  theme: 'light' | 'dark';
  primaryColor: string;
  accentColor: string;
  
  // Section visibility and order
  sections: SectionId[];
  
  // Section-specific configurations
  announcementBar: AnnouncementBarConfig;
  header: HeaderConfig;
  hero: HeroConfig;
  gallery: GalleryConfig;
  benefits: BenefitsConfig;
  sleeperTypes: SleeperTypesConfig;
  priceComparison: PriceComparisonConfig;
  difference: DifferenceConfig;
  sleepExperts: SleepExpertsConfig;
  technology: TechnologyConfig;
  fluffcoSecret: FluffcoSecretConfig;
  featuresGrid: FeaturesGridConfig;
  testimonials: TestimonialsConfig;
  pricing: PricingConfig;
  faq: FAQConfig;
  footer: FooterConfig;
}

// ============================================
// PARTIAL CONFIG (for extending base)
// ============================================

export type PartialLandingPageConfig = Partial<LandingPageConfig> & {
  id: string;
  name: string;
  slug: string;
};

// ============================================
// FRAMED STORY CONFIG
// ============================================

export interface FramedStoryConfig {
  id: string;
  name: string;
  slug: string;
  pageType: 'framed-story';
  seo: SEOConfig;
}
