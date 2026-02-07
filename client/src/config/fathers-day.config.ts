/**
 * Father's Day "Neck Pain Relief" Landing Page Configuration
 * 
 * Focus: Give dad the gift of better sleep and relief from neck pain.
 * Target: Gift-givers who want to help dad wake up without stiffness.
 * Angle: Neck pain relief - addressing the aches that come with age.
 */

import type { LandingPageConfig } from './types';
import { baseConfig } from './base.config';

export const fathersDayConfig: LandingPageConfig = {
  ...baseConfig,
  
  // Metadata
  id: 'fathers-day',
  name: 'Father\'s Day Gift',
  slug: 'fathers-day-gift',
  category: 'event',
  seo: {
    title: 'The Perfect Father\'s Day Gift | FluffCo Pillow - Help Dad Sleep Better',
    description: 'Give dad the gift of better sleep this Father\'s Day. Designed for proper neck alignment to help reduce morning stiffness. Premium gift-ready packaging included.',
    keywords: ['fathers day gift', 'gift for dad', 'neck pain pillow', 'pillow gift', 'luxury gift', 'practical gift for dad'],
  },
  
  // Global settings - Deep navy and slate palette
  theme: 'light',
  primaryColor: '#2c5282', // Deep navy blue
  accentColor: '#1a1a1a',
  
  // Section visibility and order - Neck pain focused flow
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
  
  // Announcement Bar - Father's Day themed
  announcementBar: {
    text: 'Father\'s Day: Up to 66% Off',
    showTimer: true,
    ctaText: 'Shop for Dad →',
    ctaTarget: 'pricing',
  },
  
  // Header
  header: {
    navItems: [
      { id: 'benefits', label: 'Why Dad Will Love It' },
      { id: 'the-difference', label: 'The Difference' },
      { id: 'technology', label: 'Quality' },
      { id: 'testimonials', label: 'Happy Dads' },
      { id: 'faq', label: 'FAQ' },
    ],
    ctaText: 'Gift Dad →',
  },
  
  // Hero Section - Dad-focused messaging with neck pain angle
  // Main headline uses default for consistency; eventHeadline shows on gallery image 1
  hero: {
    headline: 'The Pillow That Holds Its Shape. Night After Night.',
    subheadline: 'He never complains, but you know he wakes up stiff. This Father\'s Day, give him the gift of proper neck alignment and hotel-quality sleep he\'ll enjoy every single night.',
    eventHeadline: 'Give Dad Relief\nHe Deserves.',
    trustBadge: {
      reviewCount: '546,000+',
      rating: '95/100',
      source: 'PureWow',
    },
    usps: [
      { icon: 'support', title: 'Neck Alignment Support', description: 'Reduces morning stiffness' },
      { icon: 'shield', title: 'Award-Winning Quality', description: 'Oprah Daily recognized' },
      { icon: 'clock', title: 'Enjoyed Every Night', description: 'A gift he\'ll actually use' },
      { icon: 'location', title: 'Made in USA', description: 'Premium materials' },
    ],
    showOekoTexBadge: true,
    showOprahBadge: true,
    show30NightsBadge: true,
  },
  
  // Gallery - Uses custom Father's Day images for slots 1 and 2, standard for rest
  gallery: {
    // Custom Father's Day images for hero and tips slots
    // Standard images for layers, comparison, care, hotel, hotel-comparison
    images: [
      { src: '/images/optimized/events/fathers-day-hero-pillow.png', alt: 'FluffCo Pillow - Father\'s Day', type: 'image' },
      { src: '/images/optimized/events/fathers-day-sleep-comfort.png', alt: 'Better Sleep for Dad', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 tips' }] },
      { src: '/images/optimized/benefits/engineering-detail-new.png', alt: '3-Layer Construction', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 layers' }] },
      { src: '', alt: 'Comparison', type: 'comparison' },
      { src: '/images/optimized/benefits/washing-machine.png', alt: 'Easy Care', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 care' }] },
      { src: '/images/optimized/benefits/hotel-comfort-packaging.png', alt: 'Hotel Comfort', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: 'hotel' }] },
      { src: '', alt: 'Hotel Comparison', type: 'hotel-comparison' },
    ],
    // Customized overlay text for Father's Day angle
    slotOverrides: {
      tips: {
        pills: [
          { number: 1, title: 'Relief for Dad', description: 'Proper neck alignment he deserves' },
          { number: 2, title: 'Neck Alignment', description: 'Reduces morning stiffness and pain' },
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
  
  // Benefits Section - Legacy text with slight Father's Day adjustments
  benefits: {
    sectionTitle: 'End Your Pillow Battle',
    sectionSubtitle: 'Fighting with overheating or a sore neck and tight shoulders? Give Dad the gift of being coolly cradled and finding the \'Sweet Spot\' every night.',
    benefits: [
      { icon: 'moon', title: 'Sleep like Royalty', description: 'Frustrated with overpriced pillows? FluffCo pillows are the same quality of luxury hotel pillows. For durable, luxurious comfort at an affordable price.' },
      { icon: 'sparkles', title: 'Wake Up Pain-Free', description: 'Your neck rests in its natural position all night. Morning stiffness becomes a thing of the past.' },
      { icon: 'refresh', title: 'Built for Real Life', description: 'Machine washable, maintains shape after cleaning. Practical hygiene without compromising support.' },
    ],
  },
  
  // Sleeper Types Section
  sleeperTypes: {
    sectionTitle: 'Perfect for Every Sleeper',
    sectionSubtitle: 'No matter how dad sleeps, he\'ll love it',
    sleeperTypes: [
      { type: 'back', image: '/images/optimized/cards/sleep-position-back.png', title: 'Back', description: 'Cradles neck curve' },
      { type: 'side', image: '/images/optimized/cards/sleep-position-side.png', title: 'Side', description: 'Fills shoulder gap' },
      { type: 'stomach', image: '/images/optimized/cards/sleep-position-stomach.png', title: 'Stomach', description: 'Low profile support' },
    ],
    trustBadges: [
      { icon: 'heart', text: 'Made with Care' },
      { icon: 'moon', text: 'Rest for Dad' },
    ],
  },
  
  // Price Comparison - Disabled for gift page
  priceComparison: {
    ...baseConfig.priceComparison,
    enabled: false,
  },
  
  // The Difference Section - Dad-focused framing with neck pain angle
  difference: {
    standardPillowTitle: 'Generic Gifts Miss the Mark',
    standardPillowPoints: [
      'Ties he\'ll never wear',
      'Gadgets that collect dust',
      'Gift cards feel impersonal',
      'Tools he already has',
      'Socks and underwear again',
    ],
    fluffcoPillowTitle: 'A FluffCo Pillow Says "Thanks, Dad',
    fluffcoPillowPoints: [
      'Enjoyed every single night',
      'Helps reduce morning stiffness',
      'Practical luxury he\'ll appreciate',
      'Premium quality he can feel',
      'A gift that keeps on giving',
    ],
  },
  
  // Sleep Experts Section - Dad testimonials with male images
  sleepExperts: {
    sectionTitle: 'End Your Pillow Battle',
    sectionSubtitle: 'Finally, a pillow that works for him.',
    cards: [
      { image: '/images/fathers-day-sleep-1.png', title: 'Relief for Dad', expandedContent: ['Proper neck alignment', 'Reduces morning stiffness', 'Wake up refreshed'] },
      { image: '/images/fathers-day-sleep-2.png', title: 'Gift-Ready Presentation', expandedContent: ['Premium packaging included', 'No wrapping needed', 'Makes an impression'] },
      { image: '/images/expert-quality.png', title: 'Quality He\'ll Feel', expandedContent: ['Hotel-grade construction', 'Oprah Daily recognized', 'Built to last for years'] },
      { image: '/images/expert-everyday.png', title: 'Everyday Comfort', expandedContent: ['Used and appreciated nightly', 'Becomes part of his routine', 'The gift that keeps giving'] },
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
      { title: 'Support He Can Feel', description: 'The best pillows are made with the thinnest threads. Hotel-pillows use super thin fibers to make the inside of the pillow feel squishy but also firm at the same time.', bulletPoints: ['Plush, Down-Like Softness', 'Higher Loft (height and fluffiness)', 'Cooler Temperatures', 'Resistant to Wear and Tear', 'Hypoallergenic'] },
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
      { icon: 'layers', title: 'Consistent Support', description: 'Same feel on night 1,000 as night 1. His neck knows what to expect.' },
    ],
  },
  
  // Testimonials Section (keep sectionTitle short for mobile)
  testimonials: {
    sectionTitle: 'Hotel-Level Comfort',
    sectionSubtitle: 'Join the community who finally found their pillow',
    testimonials: [
      { name: 'Michael R.', location: 'California', verified: true, content: 'I bought this for my dad for Father\'s Day and he says his neck hasn\'t felt this good in years. Best gift I\'ve ever given him!', highlight: 'Best gift I\'ve ever given' },
      { name: 'David T.', location: 'New York', verified: true, content: 'My dad is impossible to shop for. He has everything. But he absolutely loved this pillow. Finally, a gift he actually uses every day!', highlight: 'A gift he actually uses' },
      { name: 'James K.', location: 'Texas', verified: true, content: 'Dad always complained about waking up stiff. Since getting this pillow, he says he feels 10 years younger in the morning.', highlight: 'Feels 10 years younger' },
      { name: 'Robert S.', location: 'Florida', verified: true, content: 'Dad deserves the best, and this pillow delivers. He says it\'s like sleeping on a cloud every night. Thank you FluffCo!', highlight: 'Like sleeping on a cloud' },
      { name: 'Thomas C.', location: 'Chicago', verified: true, content: 'Love, love, love these pillows. Ahhh! A wonderful night\'s sleep begins with these Down Alternative Pillows. My wife & I thank you!', highlight: 'Wonderful night\'s sleep' },
      { name: 'William C.', location: 'Seattle', verified: true, content: 'Pillows have always been difficult for me. I wake with headaches frequently. Since using this pillow, I wake up feeling great!', highlight: 'Wake up feeling great' },
      { name: 'John W.', location: 'Denver', verified: true, content: 'Just the perfect amount of \'squish\' so it\'s not flat. Best night\'s sleep in a long time since I got this pillow. Buy it!!', highlight: 'Perfect amount of squish' },
      { name: 'Richard M.', location: 'Boston', verified: true, content: 'Best pillow I\'ve ever had! Best sleep ever, and I don\'t usually sleep well. Love, love this pillow. Thank you!', highlight: 'Best pillow ever' },
    ],
    showMoreButton: true,
  },
  
  // Pricing Section - Father's Day themed
  pricing: {
    sectionTitle: 'Father\'s Day Gifting Event',
    sectionSubtitle: 'Give dad the gift of better sleep at exclusive seasonal pricing.',
    sizes: [
      { id: 'standard', name: 'Standard', dimensions: '20"x28', badge: undefined },
      { id: 'king', name: 'King', dimensions: '20"x36', badge: 'Chosen by 67%' },
    ],
    tiers: {
      standard: [
        { quantity: 1, pricePerPillow: 59.90, totalPrice: 59.90, originalPrice: 115.00, savings: 55.10, savingsPercent: 48 },
        { quantity: 2, pricePerPillow: 49.95, totalPrice: 99.90, originalPrice: 230.00, savings: 130.10, savingsPercent: 57 },
        { quantity: 4, pricePerPillow: 39.98, totalPrice: 159.90, originalPrice: 460.00, savings: 300.10, savingsPercent: 65 },
      ],
      king: [
        { quantity: 1, pricePerPillow: 69.90, totalPrice: 69.90, originalPrice: 135.00, savings: 65.10, savingsPercent: 48 },
        { quantity: 2, pricePerPillow: 54.95, totalPrice: 109.90, originalPrice: 270.00, savings: 160.10, savingsPercent: 59 },
        { quantity: 4, pricePerPillow: 44.98, totalPrice: 179.90, originalPrice: 540.00, savings: 360.10, savingsPercent: 67 },
      ],
    },
    trustBadges: ['Free Shipping', '100-Night Trial', 'Easy Returns'],
    pressQuotes: [
      { quote: 'A game-changer for neck pain sufferers', source: 'Men\'s Health' },
      { quote: 'The pillow that finally delivers', source: 'GQ' },
    ],
  },
  
  // FAQ Section - Gift-focused
  faq: {
    sectionTitle: 'Common Questions',
    items: [
      { question: 'Will this help with dad\'s neck pain?', answer: 'Yes! Our pillow is designed for proper neck alignment, which can help reduce morning stiffness and discomfort. Many customers report significant improvement in neck pain after switching to FluffCo.' },
      { question: 'Does it come gift-ready?', answer: 'Absolutely! Every FluffCo pillow arrives in premium packaging that looks beautiful as-is. No wrapping required, just add a card and you\'re ready to gift.' },
      { question: 'What if dad doesn\'t like it?', answer: 'We offer a 100-night trial. If dad isn\'t completely satisfied, return it for a full refund. No questions asked.' },
      { question: 'How is this different from other pillows?', answer: 'FluffCo uses the same Sanforized construction and premium microfiber fill found in 5-star hotels. This means it holds its shape, provides consistent support, and lasts for years, not months.' },
      { question: 'Is it good for side sleepers?', answer: 'Yes! Our pillow adapts to all sleep positions. The adjustable fill provides proper support whether dad sleeps on his back, side, or stomach.' },
      { question: 'How do I wash it?', answer: 'Simply machine wash on gentle cycle and tumble dry low. The reinforced construction handles regular cleaning without losing its shape.' },
    ],
  },
  
  // Footer
  footer: {
    tagline: 'Sleep better. Live better.',
    copyright: '© 2025 FluffCo. All rights reserved.',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact', href: '/contact' },
    ],
  },
};
