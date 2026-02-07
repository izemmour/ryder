# Event Page Creation Guide

This document provides comprehensive instructions for creating new event pages (e.g., Mother's Day, Father's Day, Valentine's Day, Christmas, etc.) for the FluffCo landing page system.

## Overview

Event pages are time-sensitive landing pages for holidays and special occasions. They share the same base structure as the default landing page but include:

- Custom color scheme matching the event theme
- Event-specific headline overlay on gallery image 1
- Customized gallery images (slots 1 and 2)
- Customized pills text for gallery overlays
- Event-specific testimonials
- Countdown timer tied to event dates
- Closed page display when outside event dates

---

## Step-by-Step Creation Process

### 1. Create the Config File

Create a new config file in `client/src/config/` named `{event-name}.config.ts`.

**Required fields to customize:**

```typescript
import type { LandingPageConfig } from './types';
import { baseConfig } from './base.config';

export const eventNameConfig: LandingPageConfig = {
  ...baseConfig,
  
  // REQUIRED: Unique identifier
  id: 'event-name',
  name: 'Event Name Gift',
  slug: 'event-name-gift',
  
  // REQUIRED: Event categorization
  category: 'event',  // Must be 'event' for holiday pages
  
  // REQUIRED: Event color scheme
  eventColors: {
    primary: '#HEX',      // Main accent color (buttons, highlights)
    secondary: '#HEX',    // Secondary color
    accent: '#HEX',       // Light background sections
    accentDark: '#HEX',   // Dark background sections
  },
  
  // SEO (noindex is automatic for landing pages)
  seo: {
    title: 'Event Name Gift Title',
    description: 'Event-specific description...',
  },
};
```

### 2. Configure the Hero Section

The hero section uses the **default headline** but adds an **eventHeadline** for the gallery image 1 overlay:

```typescript
hero: {
  // KEEP DEFAULT: Main headline stays consistent
  headline: 'The Pillow That Holds Its Shape. Night After Night.',
  
  // CUSTOMIZE: Subheadline for event context
  subheadline: 'A gift they\'ll enjoy every night, not just once. Give the thoughtful luxury of hotel-quality sleep this [Event], beautifully packaged and ready to unwrap.',
  
  // REQUIRED: Event headline overlay on gallery image 1
  // - Displays top-right on gallery image 1
  // - Size matches primary title (text-2xl md:text-3xl lg:text-4xl)
  // - White text with drop shadow, no background
  // - Use \n for line breaks (e.g., Valentine's Day)
  eventHeadline: 'Give [Recipient] the Rest\n[They] Deserve.',
  
  // CUSTOMIZE: USPs for event angle
  usps: [
    { icon: 'support', title: 'Gift-Ready Packaging', description: 'No wrapping needed' },
    { icon: 'shield', title: 'Award-Winning Quality', description: 'Oprah Daily recognized' },
    { icon: 'clock', title: 'Enjoyed Every Night', description: 'Not just once' },
    { icon: 'location', title: 'Made in USA', description: 'Premium materials' },
  ],
  
  // Keep these badges
  showOekoTexBadge: true,
  showOprahBadge: true,
  show30NightsBadge: true,
},
```

### 3. Configure the Gallery

The gallery uses a **7-image structure**. Customize slots 1 and 2 with event-specific images:

```typescript
gallery: {
  images: [
    // SLOT 1: Custom event hero image
    { src: '/images/{event}-hero-pillow.png', alt: 'FluffCo Pillow - [Event]', type: 'image' },
    
    // SLOT 2: Custom event lifestyle/unboxing image
    { src: '/images/{event}-unboxing.png', alt: 'Gift of Better Sleep', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 tips' }] },
    
    // SLOTS 3-7: Keep standard images
    { src: '/images/engineering-detail-new.png', alt: '3-Layer Construction', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 layers' }] },
    { src: '', alt: 'Comparison', type: 'comparison' },
    { src: '/images/washing-machine.png', alt: 'Easy Care', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: 'care' }] },
    { src: '/images/hotel-comfort-packaging.png', alt: 'Gift-Ready Packaging', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: 'hotel' }] },
    { src: '', alt: 'Hotel Comparison', type: 'hotel-comparison' },
  ],
  
  // REQUIRED: Customize overlay pills text
  slotOverrides: {
    tips: {
      pills: [
        // IMPORTANT: Description length should match original (~6-8 words)
        // Original: "Same 5-star quality as luxury resorts"
        { number: 1, title: '[Event Title 1]', description: '[6-8 word description matching angle]' },
        { number: 2, title: '[Event Title 2]', description: '[6-8 word description matching angle]' },
        { number: 3, title: 'Wake Refreshed', description: 'Clear-eyed, pain free, ready for the day' },
      ],
    },
    // Keep standard for other slots unless specific customization needed
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
    { title: 'Best Soft Pillow', source: 'Architectural Digest' },
    { title: '95/100 Rating', source: 'PureWow' },
  ],
},
```

### 4. Configure Testimonials

Add event-specific testimonials that reference the gift-giving context:

```typescript
testimonials: {
  sectionTitle: 'FluffCo delivers hotel-level comfort every night.',
  sectionSubtitle: 'Join the community who finally found their pillow',
  testimonials: [
    {
      name: '[Name]',
      location: '[State]',
      image: '/images/testimonial-1.png',
      quote: '[Gift-focused testimonial mentioning the event]',
      verified: true,
    },
    // Add 3-4 more testimonials
  ],
},
```

### 5. Configure Announcement Bar

```typescript
announcementBar: {
  text: '[Event Name]: Up to 66% Off',
  showTimer: true,
  ctaText: 'Gift Now →',
  ctaTarget: 'pricing',
},
```

### 6. Register the Route

Add the config to the registry in `client/src/config/registry.ts`:

```typescript
import { eventNameConfig } from './event-name.config';

export const configRegistry: Record<string, LandingPageConfig> = {
  // ... existing configs
  'event-name-gift': eventNameConfig,
};
```

### 7. Add Custom Images

Upload custom images to `client/public/images/`:

- `{event}-hero-pillow.png` - Hero pillow image with event styling
- `{event}-unboxing.png` or `{event}-comfort.png` - Lifestyle/gift image for slot 2

---

## Event-Specific Behavior

### Countdown Timer

- **During event period**: Shows countdown to event end date
- **Outside event period**: Falls back to default legacy countdown (cookie-based perpetual timer)
- Event dates are configured via the LP Manager (`/lp` route)

### Closed Page Display

When outside the configured event date range:
- Shows a simple "Event Closed" page
- Includes redirect button to main landing page
- Copy should be engaging (e.g., "Come back next year!")

### Color Scheme Application

The `eventColors` object automatically applies to:
- Announcement bar background
- CTA buttons
- Section backgrounds (alternating accent/accentDark)
- Border highlights on selectors
- Trust badges and icons

---

## Checklist for New Event Pages

- [ ] Create config file with unique `id`, `name`, `slug`
- [ ] Set `category: 'event'`
- [ ] Define `eventColors` with 4 color values
- [ ] Keep default `headline`, add custom `eventHeadline` with line breaks if needed
- [ ] Customize `subheadline` for event context
- [ ] Upload custom images for gallery slots 1 and 2
- [ ] Configure `slotOverrides.tips.pills` with **6-8 word descriptions**
- [ ] Add event-specific testimonials (gift-focused)
- [ ] Update announcement bar text
- [ ] Register route in registry
- [ ] Configure event dates via LP Manager
- [ ] Test countdown timer behavior
- [ ] Test closed page display (set dates in past)
- [ ] Verify all gallery overlays render correctly

---

## Example: Valentine's Day Config Reference

```typescript
// Key customizations for Valentine's Day:
eventHeadline: 'Better Than Flowers.\nSofter Than Roses.',  // Two lines with \n

slotOverrides: {
  tips: {
    pills: [
      { number: 1, title: 'Gift of Rest', description: 'A thoughtful gift enjoyed every night' },
      { number: 2, title: 'Shared Comfort', description: 'Better sleep, better mornings together' },
      { number: 3, title: 'Wake Refreshed', description: 'Clear-eyed, pain free, ready for the day' },
    ],
  },
},

eventColors: {
  primary: '#be185d',      // Rose/pink
  secondary: '#9f1239',
  accent: '#fdf2f8',       // Light pink background
  accentDark: '#831843',   // Dark pink background
},
```

---

## Notes

- **Pills text length**: Always match the original description length (~6-8 words) for visual consistency
- **Event headline**: Use `\n` for line breaks when needed (e.g., Valentine's two-sentence headline)
- **No password protection**: Password logic has been removed from event pages
- **SEO**: All landing pages automatically get `noindex` meta tags
- **Page title format**: `{Title} – FluffCo`
