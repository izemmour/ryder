/**
 * Side Sleeper Solution Landing Page Configuration
 * 
 * Use case page targeting side sleepers (74% of adults).
 * Pain-first approach focusing on shoulder pressure, alignment issues,
 * and the "hotel sleep" phenomenon.
 */

import type { PartialLandingPageConfig } from './types';
import { createConfig } from './utils';

const sideSleeperPartial: PartialLandingPageConfig = {
  id: 'side-sleeper',
  name: 'Side Sleeper Solution',
  slug: 'side-sleeper-pillow',
  category: 'use-case',
  redirectUrl: '/', // Redirect CTAs to legacy homepage (configurable)
  
  seo: {
    title: 'Side Sleeper Pillow | FluffCo - Finally Sleep Like You Do in Hotels',
    description: 'Ever wonder why you sleep better in hotels? It\'s the pillow. Get the same shoulder pressure relief and alignment that makes hotel sleep effortless. 100-night trial.',
    keywords: ['side sleeper pillow', 'shoulder pressure relief', 'hotel pillow', 'side sleeping pillow', 'alignment pillow'],
  },
  
  // Reorder sections for pain-first approach
  sections: [
    'hero',
    'benefits',          // Problem identification first
    'the-difference',    // Show the contrast
    'sleep-experts',     // Social proof of the problem
    'testimonials',      // Real stories of pain
    'pricing',           // Only then introduce solution
    'faq'
  ],
  
  hero: {
    headline: 'Why Does Your Shoulder Hurt Every Morning?',
    subheadline: '74% of adults sleep on their side. Most wake up with shoulder pain, arm numbness, or neck stiffness. Your pillow is the problem. Hotels figured this out decades ago.',
    trustBadge: {
      reviewCount: '38,000+',
      rating: 'side sleepers',
      source: 'switched this year',
    },
    usps: [
      { icon: 'support', title: 'Shoulder Pressure', description: 'Wakes you up at 3am' },
      { icon: 'shield', title: 'Arm Numbness', description: 'Tingling every night' },
      { icon: 'temperature', title: 'Spine Misalignment', description: 'Morning stiffness' },
      { icon: 'clock', title: 'Hotel Mystery', description: 'Why you sleep better away' },
    ],
    showOekoTexBadge: false,
    showOprahBadge: false,
    show30NightsBadge: false,
  },
  
  benefits: {
    sectionTitle: 'The 3 Problems Every Side Sleeper Knows',
    sectionSubtitle: 'If you sleep on your side, you know these issues. You probably think they\'re normal. They\'re not.',
    benefits: [
      { 
        icon: 'moon', 
        title: '1. The 3am Shoulder Wake-Up', 
        description: 'You wake up because your shoulder is screaming. You flip to the other side. An hour later, same thing. Your pillow flattens under your head weight, forcing your shoulder to bear all the pressure. This isn\'t normal. It\'s your pillow failing.' 
      },
      { 
        icon: 'refresh', 
        title: '2. The Numb Arm Shake-Out', 
        description: 'That tingling, dead-arm feeling when you wake up. You shake it out, flex your fingers, wait for the pins and needles to stop. It\'s not "sleeping funny"—it\'s poor circulation from your head dropping too low and compressing nerves. Hotels don\'t let this happen to their guests.' 
      },
      { 
        icon: 'sparkles', 
        title: '3. The Morning Neck Stiffness', 
        description: 'You wake up and can\'t turn your head properly for the first hour. Your spine spent 8 hours curved unnaturally because your pillow lost its shape. Physical therapists see this every day. It\'s preventable.' 
      },
    ],
  },
  
  difference: {
    standardPillowTitle: 'Why Your Pillow Fails You',
    standardPillowPoints: [
      'Compresses flat within 2 hours',
      'No structural core = no support',
      'Designed for back sleepers',
      'Cheap fill that shifts and clumps',
      'You adjust it 4-5 times per night',
    ],
    fluffcoPillowTitle: 'Why Hotels Invest in Better',
    fluffcoPillowPoints: [
      'Maintains loft for 8+ hours straight',
      'Engineered core holds your head up',
      'Specifically designed for side sleeping',
      'Premium fill that stays distributed',
      'You don\'t touch it once all night',
    ],
  },
  
  sleepExperts: {
    sectionTitle: 'Hotels Know This. Physical Therapists Know This.',
    sectionSubtitle: 'The side sleeper problem isn\'t new. The solution has existed for years—in luxury hotels.',
    cards: [
      { 
        image: '/images/hotel-pillow-engineering.jpg', 
        title: 'Why Hotels Invest in Side Sleeper Pillows', 
        expandedContent: [
          'Four Seasons and Ritz-Carlton source pillows with structural support cores specifically for side sleepers.',
          'Guest sleep quality is directly tied to pillow engineering—hotels know this affects reviews and repeat bookings.',
          'Luxury hotels test hundreds of pillow designs. The ones that survive all have one thing in common: loft maintenance for side sleeping.',
        ]
      },
      { 
        image: '/images/physical-therapy-pillow.jpg', 
        title: 'What Physical Therapists See Every Day', 
        expandedContent: [
          'Chronic shoulder and neck issues caused by pillow compression are one of the most common complaints in physical therapy.',
          'Side sleepers need loft maintenance—most pillows lose 60% of their height overnight, causing misalignment.',
          'The solution isn\'t stretching or massage. It\'s fixing the root cause: your pillow.',
        ]
      },
      { 
        image: '/images/side-sleeper-alignment.jpg', 
        title: 'The Engineering Behind Side Sleep Support', 
        expandedContent: [
          'Side sleeping requires 4-6 inches of loft to keep your spine aligned. Standard pillows compress to 2 inches or less.',
          'Hotels use pillows with engineered cores that resist compression for 8+ hours straight.',
          'This isn\'t luxury—it\'s basic ergonomics. Your pillow should hold your head up all night.',
        ]
      },
    ],
  },
  
  testimonials: {
    sectionTitle: 'From People Who Stopped Accepting the Pain',
    sectionSubtitle: 'They thought shoulder pain and arm numbness were just part of side sleeping. They were wrong.',
    testimonials: [
      { 
        name: 'Rachel M.', 
        location: 'Austin, TX', 
        verified: true, 
        content: 'I\'m a dedicated side sleeper and I\'ve tried EVERYTHING. This is the first pillow that doesn\'t flatten by 3am. My shoulder pain is completely gone. It really does feel like sleeping in a nice hotel.',
        highlight: 'shoulder pain is completely gone'
      },
      { 
        name: 'David K.', 
        location: 'Seattle, WA', 
        verified: true, 
        content: 'My wife kept asking why I was sleeping so much better. I realized it was after we stayed at the Ritz last month. Found out they use FluffCo. Ordered immediately. She was right—I\'m not tossing anymore.',
        highlight: 'not tossing anymore'
      },
      { 
        name: 'Jennifer L.', 
        location: 'Chicago, IL', 
        verified: true, 
        content: 'The arm numbness was driving me insane. I\'d wake up 4-5 times a night shaking my arm out. First night with this pillow? Slept straight through. I actually cried the next morning. Finally.',
        highlight: 'Slept straight through'
      },
      { 
        name: 'Marcus T.', 
        location: 'Denver, CO', 
        verified: true, 
        content: 'I travel for work and always sleep better in hotels. Thought it was just being away from home stress. Nope—it was the pillow. Got the same one they use. Now home feels like a hotel stay.',
        highlight: 'home feels like a hotel stay'
      },
      { 
        name: 'Sarah P.', 
        location: 'Portland, OR', 
        verified: true, 
        content: 'After years of chiropractor visits for neck pain, my doctor suggested changing my pillow. This one changed everything. No more morning stiffness, no more headaches. Wish I\'d found it sooner.',
        highlight: 'No more morning stiffness'
      },
      { 
        name: 'James H.', 
        location: 'Boston, MA', 
        verified: true, 
        content: 'I\'m 6\'2" and side sleeping was always uncomfortable. This pillow actually fills the gap between my shoulder and head. First time I\'ve woken up without adjusting my pillow 5 times a night.',
        highlight: 'fills the gap'
      },
      { 
        name: 'Lisa W.', 
        location: 'Miami, FL', 
        verified: true, 
        content: 'My physical therapist recommended trying a hotel-quality pillow. Got this one and the difference is night and day. My shoulder doesn\'t hurt anymore and I actually sleep through the night now.',
        highlight: 'sleep through the night'
      },
      { 
        name: 'Tom R.', 
        location: 'San Diego, CA', 
        verified: true, 
        content: 'Skeptical at first but desperate for better sleep. This pillow holds its shape all night—no more flipping to find the \'good spot.\' Worth every penny for the quality of sleep I\'m getting now.',
        highlight: 'holds its shape all night'
      },
    ],
    showMoreButton: true,
  },
  
  faq: {
    sectionTitle: 'Side Sleeper Questions',
    items: [
      {
        question: 'How is this different from a regular pillow?',
        answer: 'Regular pillows compress under the weight of your head, causing your shoulder to bear pressure and your spine to curve. This pillow maintains its loft all night with a structural core that keeps your head elevated properly—exactly like the pillows used in luxury hotels.',
      },
      {
        question: 'Will this work if I switch positions during the night?',
        answer: 'Yes. While optimized for side sleeping, the pillow adapts to back sleeping too. The supportive core provides proper neck alignment in both positions. (Stomach sleepers typically need a flatter pillow.)',
      },
      {
        question: 'Why do hotels use these pillows?',
        answer: 'Hotels invest in pillows that reduce guest complaints and improve sleep quality reviews. After testing thousands of options, luxury hotels like Four Seasons and Ritz-Carlton chose pillows with this exact design. We use the same suppliers and specifications.',
      },
      {
        question: 'What if I\'m used to a softer pillow?',
        answer: 'Most side sleepers think they want "soft," but what they actually need is "supportive with cushioning." This pillow has both—a plush outer layer with structural support underneath. Give it 3-5 nights for your body to adjust to proper alignment.',
      },
      {
        question: 'How long until I notice a difference?',
        answer: 'Most customers report reduced shoulder pressure the first night. Spine alignment improvements (less morning stiffness, better posture) typically show up within the first week as your body adapts to proper support.',
      },
      {
        question: 'What size should I get?',
        answer: 'Side sleepers typically prefer King size (20" × 36") for more surface area and better shoulder support. Standard (20" × 28") works if you have a smaller frame or prefer a more compact pillow. Both have the same supportive core.',
      },
    ],
  },
};

export const sideSleeperConfig = createConfig(sideSleeperPartial);
