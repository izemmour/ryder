/**
 * Base Landing Page Configuration
 * 
 * This file contains the default configuration values that all
 * landing page variants inherit from. Override specific values
 * in variant configs to customize each page.
 */

import type { LandingPageConfig } from './types';

export const baseConfig: LandingPageConfig = {
  // Metadata
  id: 'base',
  name: 'Base Template',
  slug: '',
  pageType: 'angle' as const,
  seo: {
    title: 'FluffCo Pillow - Premium Sleep Support',
    description: 'Experience hotel-quality sleep at home with FluffCo pillows. Engineered for consistent support that doesn\'t sag, flatten, or require constant adjustment.',
    keywords: ['pillow', 'sleep', 'hotel quality', 'down alternative', 'neck support'],
  },
  
  // Global settings
  theme: 'light',
  primaryColor: '#e63946',
  accentColor: '#2d3a5c',
  
  // Section visibility and order
  sections: [
    'hero',
    'benefits',
    'sleeper-types',
    'price-comparison',
    'the-difference',
    'sleep-experts',
    'technology',
    'fluffco-secret',
    'features-grid',
    'testimonials',
    'pricing',
    'faq',
  ],
  
  // Announcement Bar
  announcementBar: {
    text: 'Buy 4 Pillows, Get 2 Pillowcases Free',
    showTimer: true,
    ctaText: 'Claim Now →',
    ctaTarget: 'pricing',
  },
  
  // Header
  header: {
    navItems: [
      { id: 'benefits', label: 'Benefits' },
      { id: 'the-difference', label: 'The Difference' },
      { id: 'technology', label: 'Technology' },
      { id: 'testimonials', label: 'Reviews' },
      { id: 'faq', label: 'FAQ' },
    ],
    ctaText: 'Order Now →',
  },
  
  // Hero Section
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
  
  // Gallery - Standard 7-image structure
  // All angle pages should use these base images and only customize overlay text
  gallery: {
    images: [
      { src: '/images/optimized/hero/hero-pillow.png', alt: 'FluffCo Pillow', type: 'image' },
      { src: '/images/optimized/hero/lifestyle-sleep.png', alt: 'Better Sleep Tips', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 tips' }] },
      { src: '/images/optimized/benefits/engineering-detail-new.png', alt: '3-Layer Construction', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 layers' }] },
      { src: '', alt: 'Comparison', type: 'comparison' },
      { src: '/images/optimized/benefits/washing-machine.png', alt: 'Easy Care', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: 'care' }] },
      { src: '', alt: 'Hotel Comparison', type: 'hotel-comparison' },
      { src: '/images/optimized/benefits/hotel-comfort-packaging.png', alt: 'Hotel Comfort', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: 'hotel' }] },
    ],
    showAwardCarousel: true,
    awardCarouselItems: [
      { title: 'Best Overall Pillow', source: 'Apartment Therapy' },
      { title: 'Best Down Pillow', source: 'Men\'s Health' },
      { title: 'Best Soft Pillow', source: 'Architectural Digest' },
      { title: 'Editor\'s Pick', source: 'Healthline' },
      { title: '95/100 Rating', source: 'PureWow' },
    ],
  },
  
  // Benefits Section
  benefits: {
    sectionTitle: 'End the Nightly Adjustment',
    sectionSubtitle: 'Tired of constantly repositioning? Find your perfect position once and stay there all night.',
    benefits: [
      { icon: 'moon', title: 'Sleep Without Adjusting', description: 'The structural core holds your position. No midnight fluffing, no repositioning. Just consistent support.' },
      { icon: 'refresh', title: 'Wake Up Neutral', description: 'Your neck rests in its natural position all night. Morning stiffness becomes a thing of the past.' },
      { icon: 'sparkles', title: 'Built for Real Life', description: 'Machine washable, maintains shape after cleaning. Practical hygiene without compromising support.' },
    ],
  },
  
  // Sleeper Types Section
  sleeperTypes: {
    sectionTitle: 'Works for Every Sleeper',
    sectionSubtitle: 'Adapts to Your Position',
    sleeperTypes: [
      { type: 'back', image: '/images/optimized/cards/sleep-position-back.png', title: 'Back', description: 'Cradles neck curve' },
      { type: 'side', image: '/images/optimized/cards/sleep-position-side.png', title: 'Side', description: 'Fills shoulder gap' },
      { type: 'stomach', image: '/images/optimized/cards/sleep-position-stomach.png', title: 'Stomach', description: 'Low profile support' },
    ],
    trustBadges: [
      { icon: 'heart', text: 'Pain Free Sleep' },
      { icon: 'moon', text: 'Restful Nights' },
    ],
  },
  
  // Price Comparison Section
  priceComparison: {
    enabled: true,
    sectionTitle: 'Premium Quality. Without the Premium Markup.',
    sectionSubtitle: 'Traditional retail adds layers of cost that have nothing to do with quality. Distributors, showroom rent, sales commissions. You pay for all of it. We cut them out.',
    retailPrice: 119,
    retailBreakdown: [
      { label: 'Mfg', amount: 17.50, color: '#6b7280' },
      { label: 'Distributor', amount: 20.50, color: '#9ca3af' },
      { label: 'Store Rent', amount: 25.00, color: '#d1d5db' },
      { label: 'Staff', amount: 16.00, color: '#e5e7eb' },
      { label: 'Margin', amount: 40.00, color: '#f3f4f6' },
    ],
    directPrice: 37.48,
    directBreakdown: [
      { label: 'Mfg', amount: 17.50, color: '#22c55e' },
      { label: 'Ship', amount: 8.50, color: '#4ade80' },
      { label: 'Us', amount: 11.48, color: '#86efac' },
    ],
    savingsCalculator: {
      show: true,
      quantities: [1, 2, 4],
    },
  },
  
  // The Difference Section
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
  
  // Sleep Experts Section
  sleepExperts: {
    sectionTitle: 'The Pillow Sleep Experts Recommend',
    sectionSubtitle: '',
    cards: [
      { image: '/images/expert-comfort.png', title: 'Luxury Comfort, Zero Guilt (or Allergies!)', expandedContent: ['Soft, Plush, and Ethically Made', 'Sustainable and 100% Cruelty-Free'] },
      { image: '/images/expert-cool.png', title: 'No More Night Sweats', expandedContent: ['Sleep Like a Baby', 'Built to Last, Night After Night'] },
    ],
  },
  
  // Technology Section
  technology: {
    sectionTitle: 'The Engineering',
    features: [
      { id: 'sanforized', title: 'Sanforized Construction', description: 'A specialized process used by luxury hotel suppliers. Pre-shrinks and stabilizes the fabric, preventing the compression and shape loss that plagues standard pillows.', tags: ['Holds Shape', 'More Durable', 'Easy to Clean', 'Crisp Texture'] },
      { id: 'microfiber', title: 'Microfiber Fill', description: 'Fibers 5x thinner than human hair create plush, down-like support without the allergens. Maintains loft while providing consistent resistance.', tags: ['Hypoallergenic', 'High Loft', 'Temperature Neutral', 'Wear Resistant'] },
    ],
  },
  
  // FluffCo Secret Section
  fluffcoSecret: {
    features: [
      { title: 'Lasting Shape and Comfort', description: '"Sanforizing" is a special and rare way to make pillows that only the 5-star suppliers do. This unique method of craftsmanship allows these pillows to hold their shape night in and night out - as luxury pillows should!', bulletPoints: ['Holds Their Shape', 'More Durable', 'Easy to Clean', 'Extra Crisp Texture', 'Softer to the Touch'] },
      { title: '5x Thinner Than a Hair', description: 'The best pillows are made with the thinnest threads. Hotel-pillows use super thin fibers to make the inside of the pillow feel squishy but also firm at the same time.', bulletPoints: ['Plush, Down-Like Softness', 'Higher Loft (height and fluffiness)', 'Cooler Temperatures', 'Resistant to Wear and Tear', 'Hypoallergenic'] },
    ],
  },
  
  // Features Grid Section
  featuresGrid: {
    sectionTitle: 'Built for the Long Run',
    features: [
      { icon: 'clock', title: 'Holds Shape for Years', description: 'Sanforized construction maintains loft and structure. No flattening, no sagging.' },
      { icon: 'refresh', title: 'No Daily Fluffing', description: 'The structural core holds its position. Make your bed once and forget about it.' },
      { icon: 'droplets', title: 'Machine Washable', description: 'Reinforced seams handle regular cleaning. Proper hygiene without compromise.' },
      { icon: 'shield', title: 'Hypoallergenic', description: 'Down alternative fill provides luxury feel without allergens or ethical concerns.' },
      { icon: 'thermometer', title: 'Temperature Neutral', description: 'Breathable cotton cover stays comfortable. No overheating, no cold spots.' },
      { icon: 'layers', title: 'Consistent Support', description: 'Same feel on night 1,000 as night 1. Your neck knows what to expect.' },
    ],
  },
  
  // Testimonials Section
  testimonials: {
    sectionTitle: '+6,000 5-Star Reviews',
    sectionSubtitle: 'Loved by Hundreds of Thousands',
    testimonials: [
      { name: 'David & Linda', location: 'Chicago, IL', verified: true, content: 'We\'re both in our 60s and have tried EVERYTHING. Memory foam, buckwheat, water pillows... you name it. This is the first one that actually stays put all night. No more 3am pillow fluffing. Finally sleeping through the night again 🙌' },
      { name: 'Margaret T.', location: 'Portland, OR', verified: true, content: 'I can\'t believe I waited so long... After 3 back surgeries, I\'d given up on finding a pillow that actually works. This one just... holds me. I wake up and my neck isn\'t screaming at me anymore. That alone is worth everything 😭' },
      { name: 'Robert K.', location: 'Austin, TX', verified: true, content: '8 months now. Still perfect. I\'ve washed it probably 15 times and it comes out exactly the same every single time. My wife stole mine so I had to order 2 more lol' },
      { name: 'Susan C.', location: 'Seattle, WA', verified: true, content: 'My physical therapist actually asked what I changed!! Said my neck alignment improved dramatically. I almost cried in her office... years of pain and THIS is what finally helped. Worth every penny and then some ❤️' },
      { name: 'James M.', location: 'Boston, MA', verified: true, content: 'After shoulder surgery, I couldn\'t find anything that didn\'t make me wake up in pain. This pillow has been a game changer. My surgeon even commented on how well I\'m healing. Best investment in my recovery!' },
      { name: 'Patricia L.', location: 'Denver, CO', verified: true, content: 'My husband and I both got one after our hotel stay. We couldn\'t believe how well we slept. Now we have them at home and it\'s like sleeping in a 5-star hotel every night. Worth every single cent!' },
      { name: 'Michael R.', location: 'Phoenix, AZ', verified: true, content: 'I work night shifts and sleep during the day. This pillow blocks out everything and keeps me comfortable no matter what position I end up in. Finally getting the rest I need to function. Life changing!' },
      { name: 'Jennifer K.', location: 'Miami, FL', verified: true, content: 'Chronic migraines for 15 years. Tried every pillow imaginable. This one actually supports my neck properly and I\'ve noticed a real difference in my morning headaches. Wish I\'d found this years ago!' },
    ],
    showMoreButton: true,
  },
  
  // Pricing Section
  pricing: {
    sectionTitle: 'Choose Your Setup',
    sectionSubtitle: 'Online-only pricing. Free shipping on all orders.',
    sizes: [
      { id: 'standard', name: 'Standard', dimensions: '20"×28' },
      { id: 'king', name: 'King', dimensions: '20"×36', badge: 'Chosen by 67%' },
    ],
    tiers: {
      standard: [
        { quantity: 1, pricePerPillow: 59.90, totalPrice: 59.90, originalPrice: 115.00, savings: 55.10, savingsPercent: 48 },
        { quantity: 2, pricePerPillow: 49.45, totalPrice: 98.90, originalPrice: 222.00, savings: 123.10, savingsPercent: 55, badge: 'popular' },
        { quantity: 4, pricePerPillow: 37.48, totalPrice: 149.90, originalPrice: 444.00, savings: 294.10, savingsPercent: 66, badge: 'best-value', bonus: { text: '+ 2 Free Pillowcases', value: 116 } },
      ],
      king: [
        { quantity: 1, pricePerPillow: 69.90, totalPrice: 69.90, originalPrice: 135.00, savings: 65.10, savingsPercent: 48 },
        { quantity: 2, pricePerPillow: 57.45, totalPrice: 114.90, originalPrice: 260.00, savings: 145.10, savingsPercent: 56, badge: 'popular' },
        { quantity: 4, pricePerPillow: 44.98, totalPrice: 179.90, originalPrice: 520.00, savings: 340.10, savingsPercent: 65, badge: 'best-value', bonus: { text: '+ 2 Free Pillowcases', value: 136 } },
      ],
    },
    trustBadges: ['100-Night Guarantee', 'Free Shipping', 'Made in USA'],
    pressQuotes: [
      { quote: 'Best Soft Pillow', source: 'Architectural Digest' },
      { quote: 'Best Overall Pillow', source: 'Apartment Therapy' },
      { quote: 'Best Down Pillow', source: 'Men\'s Health' },
      { quote: 'Editor\'s Pick', source: 'Healthline' },
      { quote: '95/100', source: 'PureWow' },
    ],
  },
  
  // FAQ Section
  faq: {
    sectionTitle: 'Common Questions',
    items: [
      { question: 'What makes FluffCo Pillow so special?', answer: 'FluffCo pillows use Sanforized construction, a specialized process used by luxury hotel suppliers. This pre-shrinks and stabilizes the fabric, preventing the compression and shape loss that plagues standard pillows. Combined with microfiber fill that\'s 5x thinner than human hair, you get consistent support that lasts for years.' },
      { question: 'How are FluffCo Pillows more affordable than hotel brand pillows?', answer: 'We sell directly to you online, cutting out distributors, retail markups, and showroom costs. The same hotel-grade construction that costs $119+ in stores costs a fraction of that when you buy direct from us.' },
      { question: 'Can these pillows help improve my sleep quality?', answer: 'Many customers report significant improvements in sleep quality, particularly those who previously struggled with neck pain or constantly adjusting their pillows. The consistent support helps maintain proper spinal alignment throughout the night.' },
      { question: 'How do I clean and maintain my pillow?', answer: 'FluffCo pillows are fully machine washable. Use a gentle cycle with mild detergent and tumble dry on low. The Sanforized construction ensures the pillow maintains its shape even after multiple washes.' },
      { question: 'Are these pillows ethically and sustainably made?', answer: 'Yes! Our pillows are OEKO-TEX Standard 100 certified, meaning they\'ve been tested for harmful substances. We use down alternative fill, making them 100% cruelty-free and suitable for those with allergies.' },
      { question: 'What is your Good Sleep Guarantee?', answer: 'We offer a 100-night trial period. If you\'re not completely satisfied with your pillow, contact us for a full refund. We want you to love your sleep.' },
      { question: 'How long until I receive my order?', answer: 'Orders typically ship within 1-2 business days. Standard delivery takes 2-4 business days within the continental US. Free shipping is included on all orders.' },
    ],
  },
  
  // Footer
  footer: {
    tagline: 'Consistent support. Night after night.',
    links: [
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Return Policy', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
    copyright: '© 2026 FluffCo. All rights reserved.',
  },
};

export default baseConfig;
