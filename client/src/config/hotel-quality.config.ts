/**
 * Hotel Quality Landing Page Configuration
 * 
 * WINNING ANGLE: Comparison Value (Hotel Parity + Price Relief)
 * Generated: 161 purchases (highest-volume winning angle)
 * 
 * Key mechanics:
 * - "Same comfort" removes downgrade anxiety
 * - "Half Priced" reframes value without signaling cheapness
 * - "5-star secret" positions product as insider alternative
 * - Dominant emotions: Relief + Confidence
 */

import type { PartialLandingPageConfig } from './types';
import { createConfig } from './utils';

const hotelQualityPartial: PartialLandingPageConfig = {
  id: 'hotel-quality',
  name: 'Hotel Quality Pillow',
  slug: 'hotel-quality-pillow',
  category: 'angle',
  
  seo: {
    title: 'Same Comfort. Half the Price. | FluffCo Hotel Quality Pillow',
    description: 'The 5-star secret without the 5-star price. Same hotel-quality comfort at half the cost. 100-night trial, free shipping.',
    keywords: ['hotel pillow', 'luxury pillow', '5-star hotel pillow', 'four seasons pillow', 'ritz carlton pillow', 'hotel quality bedding'],
  },
  
  // Gallery - Uses standard base images with Hotel Quality themed text overlays
  gallery: {
    // Standard gallery order - same images as base page
    // Only customize the overlay text (pills) for Hotel Quality angle
    // Hotel Quality page exception: pricing (hotel-comparison) comes SECOND
    images: [
      { src: '/images/hotel-hero-price-comparison.png', alt: 'Hotel Quality Pillow with Price Comparison', type: 'image' },
      { src: '', alt: 'Hotel Comparison', type: 'hotel-comparison' },
      { src: '/images/optimized/hero/lifestyle-sleep.png', alt: 'Hotel Quality Sleep', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 tips' }] },
      { src: '/images/optimized/benefits/engineering-detail-new.png', alt: '3-Layer Construction', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 layers' }] },
      { src: '', alt: 'Comparison', type: 'comparison' },
      { src: '/images/optimized/benefits/washing-machine.png', alt: 'Easy Care', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: 'care' }] },
      { src: '/images/optimized/benefits/hotel-comfort-packaging.png', alt: 'Hotel Comfort', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: 'hotel' }] },
    ],
    // Customized overlay text for Hotel Quality angle
    slotOverrides: {
      tips: {
        pills: [
          { number: 1, title: 'Same Comfort', description: 'Hotel-grade quality' },
          { number: 2, title: 'Half the Price', description: 'Direct to you' },
          { number: 3, title: 'Wake Refreshed', description: 'Every morning' },
        ],
      },
      layers: {
        pills: [
          { number: 1, title: 'Support Layer', description: 'Firm foundation' },
          { number: 2, title: 'Comfort Core', description: 'Plush microfiber' },
          { number: 3, title: 'Cooling Shell', description: 'Breathable cotton' },
        ],
      },
      care: {
        pills: [
          { number: 1, title: 'Machine Wash', description: 'Easy cleaning' },
          { number: 2, title: 'Tumble Dry', description: 'Quick drying' },
          { number: 3, title: 'No Ironing', description: 'Ready to use' },
        ],
      },
      summary: {
        headline: '5-Star Comfort',
      },
    },
    showAwardCarousel: true,
    awardCarouselItems: [
      { title: 'Best Overall Pillow', source: 'Apartment Therapy' },
      { title: 'Best Down Pillow', source: 'Men\'s Health' },
      { title: 'Best Soft Pillow', source: 'Architectural Digest' },
      { title: 'Editor\'s Pick', source: 'Healthline' },
      { title: '95/100 Rating', source: 'PureWow' },
    ],
  },
  
  hero: {
    // WINNING HEADLINE: "Hotel Quality. No Markup."
    headline: 'Hotel Quality. No Markup.',
    subheadline: 'The 5-star secret without the 5-star price tag. Finally, hotel-quality sleep delivered to your door.',
    trustBadge: {
      reviewCount: '546,000+',
      rating: '95/100',
      source: 'PureWow',
    },
    usps: [
      { icon: 'support', title: 'Same Hotel Comfort', description: 'Identical quality, half the cost' },
      { icon: 'shield', title: '50% Less Than Hotels', description: 'Direct pricing, no markup' },
      { icon: 'clock', title: '100-Night Trial', description: 'Risk-free guarantee' },
      { icon: 'location', title: 'Made in USA', description: 'Premium craftsmanship' },
    ],
    showOekoTexBadge: true,
    showOprahBadge: true,
    show30NightsBadge: true,
  },
  
  benefits: {
    sectionTitle: 'The 5-Star Secret',
    sectionSubtitle: 'Why pay hotel prices when you can get the same comfort for half?',
    benefits: [
      { icon: 'moon', title: 'Same Comfort, Your Bed', description: 'The exact same plush, supportive feel that makes hotel pillows unforgettable. Now yours every night.' },
      { icon: 'shield', title: 'Half the Price, Same Quality', description: 'We cut out the middlemen. Same suppliers as Four Seasons and Ritz-Carlton, 50%+ less.' },
      { icon: 'sparkles', title: 'Built to Hotel Standards', description: 'Designed to withstand commercial laundering. If it survives hotel housekeeping, it\'ll last you years.' },
    ],
  },
  
  difference: {
    standardPillowTitle: 'Hotel Store Pillows',
    standardPillowPoints: [
      '$120-200 for the same quality',
      'Paying for the brand name',
      'Same suppliers, higher markup',
      'No trial period',
      'Expensive shipping',
    ],
    fluffcoPillowTitle: 'FluffCo Pillow',
    fluffcoPillowPoints: [
      'Same comfort, half the price',
      'Direct from manufacturer',
      'Identical hotel-grade materials',
      '100-night risk-free trial',
      'Free shipping included',
    ],
  },
  
  testimonials: {
    sectionTitle: '546,000+ Made the Switch',
    sectionSubtitle: 'Same comfort. Half the price. See why they switched.',
    testimonials: [
      { name: 'Jennifer M.', location: 'San Francisco, CA', verified: true, content: 'I used to steal pillows from hotels (don\'t judge me 😅). Now I don\'t have to! These are EXACTLY like the ones at the Four Seasons. Same comfort, half the price. My husband thought I actually took them from our last trip!' },
      { name: 'Michael R.', location: 'New York, NY', verified: true, content: 'Business traveler here. Spent years wondering why I sleep better in hotels. Turns out it was the pillows. Same quality for half what I\'d pay at the hotel store. Best purchase I\'ve made.' },
      { name: 'Sarah & Tom K.', location: 'Denver, CO', verified: true, content: 'We honeymooned at the Ritz and couldn\'t stop talking about the pillows. Found FluffCo and got 4 for less than 2 would cost at the Ritz store. Same comfort, way better price 💕' },
      { name: 'Dr. Patricia L.', location: 'Boston, MA', verified: true, content: 'As a physician, I\'m skeptical of most sleep products. But these genuinely deliver hotel-quality comfort at half the price. I\'ve recommended them to patients. The value is remarkable.' },
    ],
    showMoreButton: true,
  },
  
  announcementBar: {
    text: 'Same Comfort. Half the Price.',
    showTimer: true,
    ctaText: 'Shop Now →',
    ctaTarget: 'pricing',
  },
  

};

export const hotelQualityConfig = createConfig(hotelQualityPartial);
export default hotelQualityConfig;
