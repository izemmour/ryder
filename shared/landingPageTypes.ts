/**
 * Landing Page Configuration Types
 * Defines the structure for dynamically configurable landing pages
 */

export interface LandingPageHero {
  headline: string;
  subheadline: string;
  ctaText: string;
  backgroundImage?: string;
}

export interface LandingPageBenefit {
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react
}

export interface LandingPageTestimonial {
  name: string;
  location: string;
  content: string;
  rating: number;
  verified: boolean;
}

export interface LandingPageFAQ {
  question: string;
  answer: string;
}

export interface LandingPageConfig {
  id: string;
  name: string;
  slug: string;
  
  // Hero section
  hero: LandingPageHero;
  
  // Benefits section
  benefits: {
    sectionTitle: string;
    sectionSubtitle: string;
    benefits: LandingPageBenefit[];
  };
  
  // Social proof
  socialProof: {
    customerCount: string;
    rating: number;
  };
  
  // Testimonials
  testimonials: {
    sectionTitle: string;
    sectionSubtitle: string;
    testimonials: LandingPageTestimonial[];
  };
  
  // FAQ
  faq: {
    sectionTitle: string;
    items: LandingPageFAQ[];
  };
  
  // SEO
  seo: {
    title: string;
    description: string;
  };
  
  // Announcement bar
  announcementBar: {
    text: string;
    ctaText: string;
  };
  
  // Gallery images
  gallery?: {
    images: Array<{
      src: string;
      alt: string;
    }>;
  };
  
  // Difference section
  difference: {
    standardPillowTitle: string;
    standardPillowPoints: string[];
    fluffcoPillowTitle: string;
    fluffcoPillowPoints: string[];
  };
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
  screenshotUrl?: string;
}

/**
 * Database schema for landing pages
 */
export interface LandingPageRecord {
  id: string;
  config: string; // JSON stringified LandingPageConfig
  screenshot_url: string | null;
  screenshot_generated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
