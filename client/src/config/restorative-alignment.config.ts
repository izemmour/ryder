/**
 * Restorative Alignment Landing Page Configuration
 * 
 * This is the original/baseline landing page targeting the 45+ audience
 * with messaging focused on consistent support and alignment.
 */

import type { PartialLandingPageConfig } from './types';
import { createConfig } from './utils';

const restorativeAlignmentPartial: PartialLandingPageConfig = {
  id: 'restorative-alignment',
  name: 'Restorative Alignment Pillow',
  slug: 'down-pillow-restorative-alignment',
  category: 'angle',
  
  seo: {
    title: 'Restorative Alignment Pillow | FluffCo - Consistent Support Night After Night',
    description: 'The pillow that holds its shape. Engineered for consistent support that doesn\'t sag, flatten, or require constant adjustment. 100-night trial, free shipping.',
    keywords: ['restorative pillow', 'alignment pillow', 'neck support pillow', 'hotel quality pillow', 'down alternative pillow'],
  },
  
  hero: {
    headline: 'The Pillow That Holds Its Shape. Night After Night.',
    subheadline: 'Engineered for consistent support that doesn\'t sag, flatten, or require constant adjustment. Built for sleepers who value reliability over novelty.',
    trustBadge: {
      reviewCount: '546,000+',
      rating: '95/100',
      source: 'PureWow',
    },
    usps: [
      { icon: 'support', title: 'Consistent Support', description: 'Same feel every night' },
      { icon: 'temperature', title: 'Temperature Neutral', description: 'Breathable cotton cover' },
      { icon: 'hypoallergenic', title: 'Hypoallergenic', description: 'Down alternative fill' },
      { icon: 'location', title: 'Made in USA', description: 'Premium materials' },
    ],
    showOekoTexBadge: true,
    showOprahBadge: true,
    show30NightsBadge: true,
  },
  
  benefits: {
    sectionTitle: 'End the Nightly Adjustment',
    sectionSubtitle: 'Tired of constantly repositioning? Find your perfect position once and stay there all night.',
    benefits: [
      { icon: 'moon', title: 'Sleep Without Adjusting', description: 'The structural core holds your position. No midnight fluffing, no repositioning. Just consistent support.' },
      { icon: 'refresh', title: 'Wake Up Neutral', description: 'Your neck rests in its natural position all night. Morning stiffness becomes a thing of the past.' },
      { icon: 'sparkles', title: 'Built for Real Life', description: 'Machine washable, maintains shape after cleaning. Practical hygiene without compromising support.' },
    ],
  },
  
  difference: {
    standardPillowTitle: 'Standard Pillows',
    standardPillowPoints: [
      'Flatten within months',
      'Require constant fluffing',
      'Inconsistent support',
      'Fall apart when washed',
      'Replace every 1-2 years',
    ],
    fluffcoPillowTitle: 'Restorative Pillow',
    fluffcoPillowPoints: [
      'Maintains shape for years',
      'No adjustment needed',
      'Consistent support every night',
      'Built for regular washing',
      'Long-term investment',
    ],
  },
  
  testimonials: {
    sectionTitle: '546,000+ Happy Sleepers',
    sectionSubtitle: 'Real People. Real Sleep.',
    testimonials: [
      { name: 'David & Linda', location: 'Chicago, IL', verified: true, content: 'We\'re both in our 60s and have tried EVERYTHING. Memory foam, buckwheat, water pillows... you name it. This is the first one that actually stays put all night. No more 3am pillow fluffing. Finally sleeping through the night again 🙌' },
      { name: 'Margaret T.', location: 'Portland, OR', verified: true, content: 'I can\'t believe I waited so long... After 3 back surgeries, I\'d given up on finding a pillow that actually works. This one just... holds me. I wake up and my neck isn\'t screaming at me anymore. That alone is worth everything 😭' },
      { name: 'Robert K.', location: 'Austin, TX', verified: true, content: '8 months now. Still perfect. I\'ve washed it probably 15 times and it comes out exactly the same every single time. My wife stole mine so I had to order 2 more lol' },
      { name: 'Susan C.', location: 'Seattle, WA', verified: true, content: 'My physical therapist actually asked what I changed!! Said my neck alignment improved dramatically. I almost cried in her office... years of pain and THIS is what finally helped. Worth every penny and then some ❤️' },
    ],
    showMoreButton: true,
  },
};

export const restorativeAlignmentConfig = createConfig(restorativeAlignmentPartial);
export default restorativeAlignmentConfig;
