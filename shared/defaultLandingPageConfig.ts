import type { LandingPageConfig } from './landingPageTypes';

/**
 * Default landing page configuration for Restorative Alignment Pillow
 * Based on https://cowboy.com/ design style and https://buy.fluff.co/down-alternative structure
 */
export const defaultLandingPageConfig: LandingPageConfig = {
  id: 'default',
  name: 'Restorative Alignment Pillow',
  slug: '/',
  
  hero: {
    headline: 'Sleep Like You\'re on Vacation Every Night',
    subheadline: 'The same high-end luxury quality pillows used in Four Seasons and Ritz Carlton at just a fraction of the price!',
    ctaText: 'Order Now',
    backgroundImage: '/images/hero-pillow.png'
  },
  
  benefits: {
    sectionTitle: 'Built for Real Life',
    sectionSubtitle: 'Not just comfort. Consistent support that lasts.',
    benefits: [
      {
        title: 'Natural Alignment',
        description: 'Maintains your neck\'s natural curve. No strain, no adjustment needed.',
        icon: 'Moon'
      },
      {
        title: 'Machine Washable',
        description: 'Reinforced seams handle regular cleaning. Proper hygiene without compromise.',
        icon: 'Droplets'
      },
      {
        title: 'Holds Shape for Years',
        description: 'Sanforized construction maintains loft and structure. No flattening, no sagging.',
        icon: 'Clock'
      }
    ]
  },
  
  socialProof: {
    customerCount: '546,000+',
    rating: 5
  },
  
  testimonials: {
    sectionTitle: '546,000+ Happy Sleepers',
    sectionSubtitle: 'Real People, Real Results',
    testimonials: [
      {
        name: 'David & Linda',
        location: 'Chicago, IL',
        content: 'We\'re both in our 60s and have tried EVERYTHING. Memory foam, buckwheat, water pillows... you name it. This is the first one that actually stays put all night. No more 3am pillow fluffing. Finally sleeping through the night again 🙌',
        rating: 5,
        verified: true
      },
      {
        name: 'Margaret T.',
        location: 'Portland, OR',
        content: 'I can\'t believe I waited so long... After 3 back surgeries, I\'d given up on finding a pillow that actually works. This one just... holds me. I wake up and my neck isn\'t screaming at me anymore. That alone is worth everything 😭',
        rating: 5,
        verified: true
      },
      {
        name: 'Robert K.',
        location: 'Austin, TX',
        content: '8 months now. Still perfect. I\'ve washed it probably 15 times and it comes out exactly the same every single time. My wife stole mine so I had to order 2 more lol',
        rating: 5,
        verified: true
      },
      {
        name: 'Susan C.',
        location: 'Seattle, WA',
        content: 'My physical therapist actually asked what I changed!! Said my neck alignment improved dramatically. I almost cried in her office... years of pain and THIS is what finally helped. Worth every penny and then some ❤️',
        rating: 5,
        verified: true
      }
    ]
  },
  
  faq: {
    sectionTitle: 'Frequently Asked Questions',
    items: [
      {
        question: 'What makes FluffCo Pillow so special?',
        answer: 'Our FluffCo Zen Pillow offers the luxury of 5-star hotel sleep at a sensible price. With our custom Fluff™ blends and supportive pillow design, we replicate the plush, supportive feel of hotel pillows you adore, but without the hefty markup.'
      },
      {
        question: 'How are FluffCo Pillows more affordable than hotel brand pillows?',
        answer: 'We partner directly with the manufacturers that supply to luxury hotels. This eliminates unnecessary markups and enables us to provide a premium soft pillow at a fraction of the cost of brands like Four Seasons, Ritz Carlton, and Marriott.'
      },
      {
        question: 'Can these pillows help improve my sleep quality?',
        answer: 'Yes! Our soft yet firm pillow provides superior comfort and support, helping to alleviate neck pain and enhance overall sleep quality. It\'s perfect for side, back, and stomach sleepers alike.'
      },
      {
        question: 'What is your Good Sleep Guarantee?',
        answer: 'If you\'re not completely satisfied within the 30-day Good Sleep Guarantee, we\'re happy to offer you hassle-free returns so your purchase is risk free.'
      }
    ]
  },
  
  seo: {
    title: 'The Same Pillows Used in 5-Star Hotels - For Less | FluffCo',
    description: 'Sleep like you\'re on vacation every night. Enjoy the same high-end luxury quality pillows used in Four Seasons and Ritz Carlton at just a fraction of the price!'
  },
  
  announcementBar: {
    text: 'Online-Only Support Event: Up to 66% Off',
    ctaText: 'Claim Now'
  },
  
  difference: {
    standardPillowTitle: 'Standard Pillows',
    standardPillowPoints: [
      'Goes flat after a few months',
      'Needs constant fluffing',
      'Loses shape after washing',
      'Inconsistent support',
      'Overheats at night'
    ],
    fluffcoPillowTitle: 'FluffCo Pillow',
    fluffcoPillowPoints: [
      'Maintains shape for years',
      'No fluffing needed',
      'Machine washable',
      'Consistent support every night',
      'Temperature neutral'
    ]
  }
};
