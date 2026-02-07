/**
 * Down Alternative Landing Page Configuration
 * 
 * This is the default landing page (/) targeting the "5-star hotel luxury" angle.
 * Based on the buy.fluff.co/down-alternative positioning.
 */

import type { PartialLandingPageConfig } from './types';
import { createConfig } from './utils';

const downAlternativePartial: PartialLandingPageConfig = {
  id: 'down-alternative',
  name: '5-Star Hotel Pillow',
  slug: 'down-alternative',
  pageType: 'angle' as const,
  category: 'legacy',
  
  seo: {
    title: 'FluffCo | Down Alternative Pillow - 5-Star Hotel Quality For Less',
    description: 'Sleep like you\'re on vacation every night. The same luxury pillows used in Four Seasons and Ritz Carlton at a fraction of the price. 5,000+ five star reviews.',
    keywords: ['down alternative pillow', '5 star hotel pillow', 'luxury pillow', 'hotel quality pillow', 'Four Seasons pillow', 'Ritz Carlton pillow'],
  },
  
  hero: {
    headline: 'The Same Pillows Used in 5-Star Hotels - For Less',
    subheadline: 'Sleep like you\'re on vacation every night. Enjoy the same high-end luxury quality pillows used in Four Seasons and Ritz Carlton at just a fraction of the price!',
    trustBadge: {
      reviewCount: '5,000+',
      rating: '5 Star',
      source: 'Reviews',
    },
    usps: [
      { icon: 'support', title: 'Perfect Sleep, Every Night', description: 'Wake up feeling refreshed' },
      { icon: 'temperature', title: 'Always Cool', description: 'Crafted for perfect temperature control' },
      { icon: 'shield', title: '5-Star Quality', description: 'Bye bye neck and back pain' },
      { icon: 'location', title: 'Made in the USA', description: 'Premium materials only' },
    ],
    showOekoTexBadge: true,
    showOprahBadge: true,
    show30NightsBadge: true,
  },
  
  benefits: {
    sectionTitle: 'End Your Pillow Battle',
    sectionSubtitle: 'Fighting with overheating or a sore neck and tight shoulders? Enjoy your head being coolly cradled and find the \'Sweet Spot\' every night.',
    benefits: [
      { icon: 'moon', title: 'Sleep like Royalty', description: 'Frustrated with overpriced pillows? FluffCo pillows are the same quality of luxury hotel pillows. For durable, luxurious comfort at an affordable price.' },
      { icon: 'sparkles', title: 'Wake Up Pain-Free', description: 'Your neck rests in its natural position all night. Morning stiffness becomes a thing of the past.' },
      { icon: 'refresh', title: 'Built for Real Life', description: 'Machine washable, maintains shape after cleaning. Practical hygiene without compromising support.' },
    ],
  },
  
  difference: {
    standardPillowTitle: 'Standard Pillows Ruin Your Sleep',
    standardPillowPoints: [
      'Waking up with neck pain',
      'Overheating during the night',
      'Spending $$$ on sub-par pillows',
      'Lumpy, unsupportive, and frustrating',
      'Made with unethical materials',
    ],
    fluffcoPillowTitle: 'FluffCo Pillows Treat You Like a VIP',
    fluffcoPillowPoints: [
      'Pain-free, restful sleep',
      'Stay cool and comfortable all night long',
      'The same quality as 5* hotels without the price tag',
      'Quality materials for supportive sleep',
      'Ethical, cruelty free down alternative',
    ],
  },
  
  testimonials: {
    sectionTitle: '+6,000 5-Star Reviews',
    sectionSubtitle: 'Loved by Hundreds of Thousands',
    testimonials: [
      { name: 'Noe C.', location: 'Austin, TX', verified: true, content: 'Love, love, love these pillows. Ahhh! A wonderful night\'s sleep begins with these Down Alternative Pillows. My husband & I thank you!' },
      { name: 'Susan C.', location: 'Seattle, WA', verified: true, content: 'Pillows have always been difficult for me. I wake with headaches frequently. Since using this pillow, I wake up feeling great!' },
      { name: 'Julien W.', location: 'Chicago, IL', verified: true, content: 'Just the perfect amount of \'squish\' so it\'s not flat. Best night\'s sleep in a long time since I got this pillow. Buy it!!' },
      { name: 'Celia M.', location: 'Portland, OR', verified: true, content: 'Best pillow I\'ve ever had! Best sleep ever, and I don\'t usually sleep well. Love, love this pillow. Thank you!' },
      { name: 'James M.', location: 'Boston, MA', verified: true, content: 'After shoulder surgery, I couldn\'t find anything that didn\'t make me wake up in pain. This pillow has been a game changer. My surgeon even commented on how well I\'m healing. Best investment in my recovery!' },
      { name: 'Patricia L.', location: 'Denver, CO', verified: true, content: 'My husband and I both got one after our hotel stay. We couldn\'t believe how well we slept. Now we have them at home and it\'s like sleeping in a 5-star hotel every night. Worth every single cent!' },
      { name: 'Michael R.', location: 'Phoenix, AZ', verified: true, content: 'I work night shifts and sleep during the day. This pillow blocks out everything and keeps me comfortable no matter what position I end up in. Finally getting the rest I need to function. Life changing!' },
      { name: 'Jennifer K.', location: 'Miami, FL', verified: true, content: 'Chronic migraines for 15 years. Tried every pillow imaginable. This one actually supports my neck properly and I\'ve noticed a real difference in my morning headaches. Wish I\'d found this years ago!' },
    ],
    showMoreButton: true,
  },
  
  // FluffCo Secret Section - specific to this variant
  fluffcoSecret: {
    features: [
      { title: 'Lasting Shape and Comfort', description: '"Sanforizing" is a special and rare way to make pillows that only the 5-star suppliers do. This unique method of craftsmanship allows these pillows to hold their shape night in and night out - as luxury pillows should!', bulletPoints: ['Holds Their Shape', 'More Durable', 'Easy to Clean', 'Extra Crisp Texture', 'Softer to the Touch'] },
      { title: '5x Thinner Than a Hair', description: 'The best pillows are made with the thinnest threads. Hotel-pillows use super thin fibers to make the inside of the pillow feel squishy but also firm at the same time.', bulletPoints: ['Plush, Down-Like Softness', 'Higher Loft (height and fluffiness)', 'Cooler Temperatures', 'Resistant to Wear and Tear', 'Hypoallergenic'] },
    ],
  },
  
  // Sleep Experts Section
  sleepExperts: {
    sectionTitle: 'The Pillow Top Sleep Experts Swear By',
    sectionSubtitle: '',
    cards: [
      { image: '/images/expert-comfort.png', title: 'Luxury Comfort, Zero Guilt (or Allergies!)', expandedContent: ['Soft, plush, and ethically made. Our vegan microfiber pillows feel just like down, without the feathers, the guilt, or the allergies.', 'Sustainable and 100% Cruelty-Free'] },
      { image: '/images/expert-cool.png', title: 'No More Night Sweats', expandedContent: ['Hotel-quality luxury at a price that won\'t keep you up at night.', 'Built to Last, Night After Night'] },
    ],
  },
  
  // FAQ Section with hotel-focused questions
  faq: {
    sectionTitle: 'Common Questions',
    items: [
      { question: 'What makes FluffCo Pillow so special?', answer: 'Our FluffCo Zen Pillow offers the luxury of 5-star hotel sleep at a sensible price. With our custom Fluff™ blends and supportive pillow design, we replicate the plush, supportive feel of hotel pillows you adore, but without the hefty markup.' },
      { question: 'How are FluffCo Pillows more affordable than hotel brand pillows?', answer: 'We sell directly to you online, cutting out distributors, retail markups, and showroom costs. The same hotel-grade construction that costs $119+ in stores costs a fraction of that when you buy direct from us.' },
      { question: 'Can these pillows help improve my sleep quality?', answer: 'Many customers report significant improvements in sleep quality, particularly those who previously struggled with neck pain or constantly adjusting their pillows. The consistent support helps maintain proper spinal alignment throughout the night.' },
      { question: 'How do I clean and maintain my pillow?', answer: 'FluffCo pillows are fully machine washable. Use a gentle cycle with mild detergent and tumble dry on low. The Sanforized construction ensures the pillow maintains its shape even after multiple washes.' },
      { question: 'Are these pillows ethically and sustainably made?', answer: 'Yes! Our pillows are OEKO-TEX Standard 100 certified, meaning they\'ve been tested for harmful substances. We use down alternative fill, making them 100% cruelty-free and suitable for those with allergies.' },
      { question: 'What is your Good Sleep Guarantee?', answer: 'We offer a 100-night trial period. If you\'re not completely satisfied with your pillow, contact us for a full refund. We want you to love your sleep.' },
      { question: 'How long until I receive my order?', answer: 'Orders typically ship within 1-2 business days. Standard delivery takes 2-4 business days within the continental US. Free shipping is included on all orders.' },
    ],
  },
};

export const downAlternativeConfig = createConfig(downAlternativePartial);
export default downAlternativeConfig;
