/**
 * Neck Pain Relief Landing Page Configuration
 * 
 * Landing page variant targeting people suffering from neck pain.
 * Messaging focuses on proper alignment and pain relief benefits.
 */

import type { PartialLandingPageConfig } from './types';
import { createConfig } from './utils';

const neckPainReliefPartial: PartialLandingPageConfig = {
  id: 'neck-pain-relief',
  name: 'Neck Pain Relief Pillow',
  slug: 'neck-pain-relief-pillow',
  category: 'angle',
  
  seo: {
    title: 'Neck Pain Relief Pillow | FluffCo - Wake Up Without Stiffness',
    description: 'Finally, a pillow designed for proper cervical alignment. Reduce neck pain and morning stiffness with FluffCo\'s supportive design. 100-night trial.',
    keywords: ['neck pain pillow', 'cervical pillow', 'neck support pillow', 'pillow for neck pain', 'orthopedic pillow'],
  },
  
  hero: {
    headline: 'Wake Up Without the Neck Pain. Finally.',
    subheadline: 'Engineered for proper cervical alignment that reduces strain and eliminates morning stiffness. Recommended by physical therapists and chiropractors.',
    trustBadge: {
      reviewCount: '546,000+',
      rating: '95/100',
      source: 'PureWow',
    },
    usps: [
      { icon: 'support', title: 'Cervical Support', description: 'Proper neck alignment' },
      { icon: 'shield', title: 'Pain Relief', description: 'Reduces morning stiffness' },
      { icon: 'hypoallergenic', title: 'Hypoallergenic', description: 'Safe for sensitive skin' },
      { icon: 'location', title: 'Made in USA', description: 'Quality you can trust' },
    ],
    showOekoTexBadge: true,
    showOprahBadge: true,
    show30NightsBadge: true,
  },
  
  benefits: {
    sectionTitle: 'End the Morning Pain Cycle',
    sectionSubtitle: 'Your pillow might be the hidden cause of your neck pain. Here\'s how we fix it.',
    benefits: [
      { icon: 'moon', title: 'Proper Cervical Alignment', description: 'The structural core maintains your neck\'s natural curve all night. No more waking up with your head at an awkward angle.' },
      { icon: 'refresh', title: 'Reduced Morning Stiffness', description: 'Customers report significant reduction in morning neck stiffness within the first week. Your muscles can finally relax.' },
      { icon: 'sparkles', title: 'Therapist Recommended', description: 'Physical therapists and chiropractors recommend our pillow for patients with chronic neck issues.' },
    ],
  },
  
  difference: {
    standardPillowTitle: 'Regular Pillows',
    standardPillowPoints: [
      'Flatten and lose support overnight',
      'Force neck into unnatural positions',
      'Cause muscle strain and tension',
      'Lead to chronic pain over time',
      'No ergonomic design consideration',
    ],
    fluffcoPillowTitle: 'Pain Relief Pillow',
    fluffcoPillowPoints: [
      'Maintains supportive loft all night',
      'Cradles neck in natural position',
      'Allows muscles to fully relax',
      'Reduces pain with consistent use',
      'Engineered for cervical health',
    ],
  },
  
  testimonials: {
    sectionTitle: 'Real Pain Relief Stories',
    sectionSubtitle: 'From people who finally found relief.',
    testimonials: [
      { name: 'Margaret T.', location: 'Portland, OR', verified: true, content: 'After 3 back surgeries, I\'d given up on finding a pillow that actually works. This one just... holds me. I wake up and my neck isn\'t screaming at me anymore. That alone is worth everything 😭' },
      { name: 'Susan C.', location: 'Seattle, WA', verified: true, content: 'My physical therapist actually asked what I changed!! Said my neck alignment improved dramatically. I almost cried in her office... years of pain and THIS is what finally helped. Worth every penny ❤️' },
      { name: 'Dr. James H.', location: 'Phoenix, AZ', verified: true, content: 'As a chiropractor, I see the damage bad pillows cause every day. I now recommend FluffCo to all my patients with cervical issues. The consistent support is exactly what the neck needs.' },
      { name: 'Linda K.', location: 'Minneapolis, MN', verified: true, content: 'I was spending $200/month on massage therapy for my neck. Since switching to this pillow 6 months ago, I\'ve cut that in half. The pillow literally paid for itself in the first month.' },
    ],
    showMoreButton: true,
  },
  
  announcementBar: {
    text: 'Neck Pain Relief - 100-Night Risk-Free Trial',
    showTimer: true,
    ctaText: 'Try It Now →',
    ctaTarget: 'pricing',
  },
  
  // Gallery - Uses custom neck pain images for slots 1 and 2, standard for rest
  gallery: {
    // Custom neck pain images for hero and tips slots
    images: [
      { src: '/images/neck-pain-cervical-alignment.png', alt: 'FluffCo Pillow - Neck Pain Relief', type: 'image' as const },
      { src: '/images/neck-pain-morning-relief.png', alt: 'Morning Relief', type: 'image' as const, badges: [{ type: 'text' as const, position: 'bottom-left' as const, content: '3 tips' }] },
      { src: '/images/optimized/benefits/engineering-detail-new.png', alt: '3-Layer Construction', type: 'image' as const, badges: [{ type: 'text' as const, position: 'bottom-left' as const, content: '3 layers' }] },
      { src: '', alt: 'Comparison', type: 'comparison' as const },
      { src: '/images/optimized/benefits/washing-machine.png', alt: 'Easy Care', type: 'image' as const, badges: [{ type: 'text' as const, position: 'bottom-left' as const, content: '3 care' }] },
      { src: '/images/optimized/benefits/hotel-comfort-packaging.png', alt: 'Hotel Comfort', type: 'image' as const, badges: [{ type: 'text' as const, position: 'bottom-left' as const, content: 'hotel' }] },
      { src: '', alt: 'Hotel Comparison', type: 'hotel-comparison' as const },
    ],
    // Customized overlay text for Neck Pain angle
    slotOverrides: {
      tips: {
        pills: [
          { number: 1, title: 'Cervical Alignment', description: 'Proper neck support' },
          { number: 2, title: 'Pain Relief', description: 'Reduce morning stiffness' },
          { number: 3, title: 'Wake Refreshed', description: 'No more neck pain' },
        ],
      },
      layers: {
        pills: [
          { number: 1, title: 'Support Core', description: 'Cervical alignment' },
          { number: 2, title: 'Comfort Layer', description: 'Pressure relief' },
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
        headline: 'Pain-Free Mornings',
      },
    },
    showAwardCarousel: true,
    awardCarouselItems: [
      { title: 'Sleep O-Wards 2024', source: 'Oprah Daily' },
      { title: 'Best Overall Pillow', source: 'Apartment Therapy' },
      { title: 'Best Down Pillow', source: 'Men\'s Health' },
      { title: 'Editor\'s Pick', source: 'Healthline' },
      { title: '95/100 Rating', source: 'PureWow' },
    ],
  },

  // Remove price comparison section for this angle - focus on pain relief
  priceComparison: {
    enabled: false,
    sectionTitle: '',
    sectionSubtitle: '',
    retailPrice: 119,
    retailBreakdown: [],
    directPrice: 37.48,
    directBreakdown: [],
    savingsCalculator: {
      show: false,
      quantities: [],
    },
  },
};

export const neckPainReliefConfig = createConfig(neckPainReliefPartial);
export default neckPainReliefConfig;
