/**
 * Valentine's Day "Thoughtful Gift" Landing Page Configuration
 * 
 * Focus: Meaningful care, elevated presentation, and a gift that becomes part of everyday life.
 * Target: Gift-givers who want their gift to feel thoughtful, not generic.
 */

import type { LandingPageConfig } from './types';
import { baseConfig } from './base.config';

export const valentineGiftConfig: LandingPageConfig = {
  ...baseConfig,
  
  // Metadata
  id: 'valentine-gift',
  name: 'Valentine\'s Day Gift',
  slug: 'valentines-gift',
  category: 'event',
  seo: {
    title: 'The Perfect Valentine\'s Gift | FluffCo Pillow - Better Than Flowers',
    description: 'Give the gift of better sleep this Valentine\'s Day. A thoughtful, practical luxury they\'ll enjoy every night. Premium gift-ready packaging included.',
    keywords: ['valentine gift', 'romantic gift', 'thoughtful gift', 'pillow gift', 'couples gift', 'luxury gift', 'practical gift'],
  },
  
  // Global settings - Romantic but sophisticated palette
  theme: 'light',
  primaryColor: '#c41e3a', // Deep romantic red
  accentColor: '#1a1a1a',
  
  // Section visibility and order - Gift-focused flow
  sections: [
    'hero',
    'benefits',
    'sleeper-types',
    'the-difference',
    'sleep-experts',
    'technology',
    'fluffco-secret',
    'features-grid',
    'testimonials',
    'pricing',
    'faq',
  ],
  
  // Announcement Bar - Valentine's themed
  announcementBar: {
    text: 'Valentine\'s Day: Up to 66% Off',
    showTimer: true,
    ctaText: 'Shop the Gift →',
    ctaTarget: 'pricing',
  },
  
  // Header
  header: {
    navItems: [
      { id: 'benefits', label: 'Why It\'s Perfect' },
      { id: 'the-difference', label: 'The Difference' },
      { id: 'technology', label: 'Quality' },
      { id: 'testimonials', label: 'Love Stories' },
      { id: 'faq', label: 'FAQ' },
    ],
    ctaText: 'Gift Now →',
  },
  
  // Hero Section - Gift-focused messaging
  // Main headline uses default for consistency; eventHeadline shows on gallery image 1
  hero: {
    headline: 'The Pillow That Holds Its Shape. Night After Night.',
    subheadline: 'A gift they\'ll enjoy every night, not just once. Give the thoughtful luxury of hotel-quality sleep this Valentine\'s Day, beautifully packaged and ready to unwrap.',
    eventHeadline: 'Better Than Flowers.\nSofter Than Roses.',
    trustBadge: {
      reviewCount: '546,000+',
      rating: '95/100',
      source: 'PureWow',
    },
    usps: [
      { icon: 'support', title: 'Gift-Ready Packaging', description: 'No wrapping needed' },
      { icon: 'shield', title: 'Award-Winning Quality', description: 'Oprah Daily recognized' },
      { icon: 'clock', title: 'Enjoyed Every Night', description: 'Not just once' },
      { icon: 'location', title: 'Made in USA', description: 'Premium materials' },
    ],
    showOekoTexBadge: true,
    showOprahBadge: true, // Prominent Oprah badge for trust
    show30NightsBadge: true,
  },
  
  // Gallery - Uses custom Valentine's Day images for slots 1 and 2, standard for rest
  gallery: {
    // Custom Valentine's Day images for hero and tips slots
    // Standard images for layers, comparison, care, hotel, hotel-comparison
    images: [
      { src: '/images/optimized/events/valentine-hero-pillow.png', alt: 'FluffCo Pillow - Valentine\'s Day', type: 'image' },
      { src: '/images/optimized/events/valentine-unboxing.png', alt: 'Gift of Better Sleep', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 tips' }] },
      { src: '/images/optimized/benefits/engineering-detail-new.png', alt: '3-Layer Construction', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 layers' }] },
      { src: '', alt: 'Comparison', type: 'comparison' },
      { src: '/images/optimized/benefits/washing-machine.png', alt: 'Easy Care', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: 'care' }] },
      { src: '/images/optimized/benefits/hotel-comfort-packaging.png', alt: 'Gift-Ready Packaging', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: 'hotel' }] },
      { src: '', alt: 'Hotel Comparison', type: 'hotel-comparison' },
    ],
    // Customized overlay text for Valentine's Day angle
    slotOverrides: {
      tips: {
        pills: [
          { number: 1, title: 'Gift of Rest', description: 'A thoughtful gift enjoyed every night' },
          { number: 2, title: 'Shared Comfort', description: 'Better sleep, better mornings together' },
          { number: 3, title: 'Wake Refreshed', description: 'Clear-eyed, pain free, ready for the day' },
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
        headline: 'Gift-Ready Luxury',
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
  
  // Benefits Section - Legacy text with slight Valentine's adjustments
  benefits: {
    sectionTitle: 'End Your Pillow Battle',
    sectionSubtitle: 'Fighting with overheating or a sore neck and tight shoulders? Give the gift of being coolly cradled and finding the \'Sweet Spot\' every night.',
    benefits: [
      { icon: 'moon', title: 'Sleep like Royalty', description: 'Frustrated with overpriced pillows? FluffCo pillows are the same quality of luxury hotel pillows. For durable, luxurious comfort at an affordable price.' },
      { icon: 'sparkles', title: 'Wake Up Pain-Free', description: 'Your neck rests in its natural position all night. Morning stiffness becomes a thing of the past.' },
      { icon: 'refresh', title: 'Built for Real Life', description: 'Machine washable, maintains shape after cleaning. Practical hygiene without compromising support.' },
    ],
  },
  
  // Sleeper Types Section
  sleeperTypes: {
    sectionTitle: 'Perfect for Every Sleeper',
    sectionSubtitle: 'No matter how they sleep, they\'ll love it',
    sleeperTypes: [
      { type: 'back', image: '/images/optimized/cards/sleep-position-back.png', title: 'Back', description: 'Cradles neck curve' },
      { type: 'side', image: '/images/optimized/cards/sleep-position-side.png', title: 'Side', description: 'Fills shoulder gap' },
      { type: 'stomach', image: '/images/optimized/cards/sleep-position-stomach.png', title: 'Stomach', description: 'Low profile support' },
    ],
    trustBadges: [
      { icon: 'heart', text: 'Shared Comfort' },
      { icon: 'moon', text: 'Better Together' },
    ],
  },
  
  // Price Comparison - Disabled for gift page (focus on value, not savings math)
  priceComparison: {
    ...baseConfig.priceComparison,
    enabled: false,
  },
  
  // The Difference Section - Gift-focused framing
  difference: {
    standardPillowTitle: 'Generic Gifts Miss the Mark',
    standardPillowPoints: [
      'Flowers wilt within days',
      'Chocolates are forgotten by morning',
      'Gift cards feel impersonal',
      'Novelty items collect dust',
      'One-time experiences fade',
    ],
    fluffcoPillowTitle: 'A FluffCo Pillow Says "I Care',
    fluffcoPillowPoints: [
      'Enjoyed every single night',
      'Reminds them of you each morning',
      'Practical luxury they\'ll treasure',
      'Premium quality they can feel',
      'A gift that keeps on giving',
    ],
  },
  
  // Sleep Experts Section - Gift testimonials
  sleepExperts: {
    sectionTitle: 'The Gift Everyone Raves About',
    sectionSubtitle: 'Thoughtful. Practical. Unforgettable.',
    cards: [
      { image: '/images/expert-couple.png', title: 'Perfect for Couples', expandedContent: ['Share the gift of better sleep', 'Upgrade your partner\'s nightly routine', 'A romantic gesture that lasts'] },
      { image: '/images/expert-gift.png', title: 'Gift-Ready Presentation', expandedContent: ['Premium packaging included', 'No wrapping needed', 'Makes an impression'] },
      { image: '/images/expert-quality.png', title: 'Quality They\'ll Feel', expandedContent: ['Hotel-grade construction', 'Oprah Daily recognized', 'Built to last for years'] },
      { image: '/images/expert-everyday.png', title: 'Everyday Luxury', expandedContent: ['Used and appreciated nightly', 'Becomes part of their routine', 'The gift that keeps giving'] },
    ],
  },
  
  // Technology Section
  technology: {
    sectionTitle: 'The Quality Behind the Gift',
    features: [
      { id: 'sanforized', title: 'Sanforized Construction', description: 'A specialized process used by luxury hotel suppliers. Pre-shrinks and stabilizes the fabric, preventing the compression and shape loss that plagues standard pillows.', tags: ['Holds Shape', 'More Durable', 'Easy to Clean', 'Crisp Texture'] },
      { id: 'microfiber', title: 'Microfiber Fill', description: 'Fibers 5x thinner than human hair create plush, down-like support without the allergens. Maintains loft while providing consistent resistance.', tags: ['Hypoallergenic', 'High Loft', 'Temperature Neutral', 'Wear Resistant'] },
    ],
  },
  
  // FluffCo Secret Section
  fluffcoSecret: {
    features: [
      { title: 'Why It\'s Gift-Worthy', description: '"Sanforizing" is a special and rare way to make pillows that only the 5-star suppliers do. This unique method of craftsmanship allows these pillows to hold their shape night in and night out - as luxury pillows should!', bulletPoints: ['Holds Their Shape', 'More Durable', 'Easy to Clean', 'Extra Crisp Texture', 'Softer to the Touch'] },
      { title: 'Luxury They Can Feel', description: 'The best pillows are made with the thinnest threads. Hotel-pillows use super thin fibers to make the inside of the pillow feel squishy but also firm at the same time.', bulletPoints: ['Plush, Down-Like Softness', 'Higher Loft (height and fluffiness)', 'Cooler Temperatures', 'Resistant to Wear and Tear', 'Hypoallergenic'] },
    ],
  },
  
  // Features Grid Section
  featuresGrid: {
    sectionTitle: 'A Gift Built to Last',
    features: [
      { icon: 'clock', title: 'Holds Shape for Years', description: 'Sanforized construction maintains loft and structure. No flattening, no sagging.' },
      { icon: 'refresh', title: 'No Daily Fluffing', description: 'The structural core holds its position. Make your bed once and forget about it.' },
      { icon: 'droplets', title: 'Machine Washable', description: 'Reinforced seams handle regular cleaning. Practical hygiene without compromise.' },
      { icon: 'shield', title: 'Hypoallergenic', description: 'Down alternative fill provides luxury feel without allergens or ethical concerns.' },
      { icon: 'thermometer', title: 'Temperature Neutral', description: 'Breathable cotton cover stays comfortable. No overheating, no cold spots.' },
      { icon: 'layers', title: 'Consistent Support', description: 'Same feel on night 1,000 as night 1. Your neck knows what to expect.' },
    ],
  },
  
  // Testimonials Section - Standard format (keep sectionTitle short for mobile)
  testimonials: {
    sectionTitle: 'Hotel-Level Comfort',
    sectionSubtitle: 'Join the community who finally found their pillow',
    testimonials: [
      { name: 'Sarah M.', location: 'New York', verified: true, content: 'I bought this for my husband for our anniversary and he hasn\'t stopped talking about it. Best gift I\'ve ever given him!', highlight: 'Best gift I\'ve ever given' },
      { name: 'Michael R.', location: 'California', verified: true, content: 'Got this for my girlfriend for Valentine\'s Day. She said it\'s the most thoughtful gift because she uses it every single night.', highlight: 'Most thoughtful gift' },
      { name: 'Jennifer L.', location: 'Texas', verified: true, content: 'My mom is impossible to shop for. She has everything. But she absolutely loved this pillow. Finally, a gift she actually uses!', highlight: 'A gift she actually uses' },
      { name: 'David K.', location: 'Florida', verified: true, content: 'The packaging was so beautiful, I didn\'t even need to wrap it. My wife was impressed before she even opened the box.', highlight: 'Beautiful packaging' },
      { name: 'Noe C.', location: 'Chicago', verified: true, content: 'Love, love, love these pillows. Ahhh! A wonderful night\'s sleep begins with these Down Alternative Pillows. My husband & I thank you!', highlight: 'Wonderful night\'s sleep' },
      { name: 'Susan C.', location: 'Seattle', verified: true, content: 'Pillows have always been difficult for me. I wake with headaches frequently. Since using this pillow, I wake up feeling great!', highlight: 'Wake up feeling great' },
      { name: 'Julien W.', location: 'Denver', verified: true, content: 'Just the perfect amount of \'squish\' so it\'s not flat. Best night\'s sleep in a long time since I got this pillow. Buy it!!', highlight: 'Perfect amount of squish' },
      { name: 'Celia M.', location: 'Boston', verified: true, content: 'Best pillow I\'ve ever had! Best sleep ever, and I don\'t usually sleep well. Love, love this pillow. Thank you!', highlight: 'Best pillow ever' },
    ],
    showMoreButton: true,
  },
  
  // Pricing Section - Valentine's themed
  pricing: {
    sectionTitle: 'Valentine\'s Gifting Event',
    sectionSubtitle: 'Give the gift of better sleep at exclusive seasonal pricing.',
    sizes: [
      { id: 'standard', name: 'Standard', dimensions: '20"×28', badge: undefined },
      { id: 'king', name: 'King', dimensions: '20"×36', badge: 'Chosen by 67%' },
    ],
    tiers: {
      standard: [
        { quantity: 1, pricePerPillow: 59.90, totalPrice: 59.90, originalPrice: 115.00, savings: 55.10, savingsPercent: 48 },
        { quantity: 2, pricePerPillow: 49.45, totalPrice: 98.90, originalPrice: 222.00, savings: 123.10, savingsPercent: 55, badge: 'popular' },
        { quantity: 4, pricePerPillow: 37.48, totalPrice: 149.90, originalPrice: 444.00, savings: 294.10, savingsPercent: 66, badge: 'best-value', bonus: { text: '4 Free Pillowcases', value: 116 } },
      ],
      king: [
        { quantity: 1, pricePerPillow: 69.90, totalPrice: 69.90, originalPrice: 135.00, savings: 65.10, savingsPercent: 48 },
        { quantity: 2, pricePerPillow: 57.45, totalPrice: 114.90, originalPrice: 262.00, savings: 147.10, savingsPercent: 56, badge: 'popular' },
        { quantity: 4, pricePerPillow: 44.98, totalPrice: 179.90, originalPrice: 524.00, savings: 344.10, savingsPercent: 66, badge: 'best-value', bonus: { text: '4 Free Pillowcases', value: 136 } },
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
  
  // FAQ Section - Common questions
  faq: {
    sectionTitle: 'Common Questions',
    items: [
      { question: 'Is this a good gift for someone who already has pillows?', answer: 'Absolutely! Most people don\'t invest in quality pillows for themselves. FluffCo pillows are a noticeable upgrade from standard pillows. Your recipient will feel the difference immediately and appreciate the thoughtfulness.' },
      { question: 'Does it come in gift-ready packaging?', answer: 'Yes! Every FluffCo pillow arrives in premium packaging that\'s designed to impress. No additional wrapping needed. Just add a card and you\'re ready to gift.' },
      { question: 'What if they don\'t like it?', answer: 'We offer a 100-night Good Sleep Guarantee. If your recipient isn\'t completely satisfied, they can return it for a full refund. Gift with confidence!' },
      { question: 'How quickly will it arrive?', answer: 'Orders typically ship within 1-2 business days and arrive within 3-5 business days. Need it faster? Contact us and we\'ll do our best to accommodate.' },
      { question: 'Should I get Standard or King size?', answer: 'If you\'re unsure, King is the most popular choice (67% of customers choose it). It works on any bed size and provides extra room for movement.' },
      { question: 'Can I include a gift message?', answer: 'Yes! Add a personal message at checkout and we\'ll include a beautifully printed card with your gift.' },
      { question: 'Is this good for couples?', answer: 'Perfect for couples! Many customers buy the 2-pack or 4-pack to upgrade both sides of the bed. It\'s a gift you can enjoy together.' },
    ],
  },
  
  // Footer
  footer: {
    tagline: 'Give the gift of better sleep.',
    links: [
      { label: 'Terms & Conditions', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Return Policy', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
    copyright: '© 2026 FluffCo. All rights reserved.',
  },
};
