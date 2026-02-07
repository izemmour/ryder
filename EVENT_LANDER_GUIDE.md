# Event Landing Page Creation Guide

This document captures the patterns and rules for creating event-themed landing pages (Valentine's Day, Mother's Day, etc.) for the FluffCo pillow product.

## Core Principles

1. **Event pages inherit from the base template** - All structural elements remain consistent
2. **Only customize what's different** - Color scheme, hero image, copy, and event-specific messaging
3. **Maintain brand consistency** - FluffCo's premium, trustworthy aesthetic must be preserved

---

## What Gets Customized for Event Pages

### 1. Color Scheme (Required)
Each event has a unique color palette applied throughout:
- **Primary color**: Main accent color (CTAs, highlights, badges)
- **Secondary color**: Darker variant for text/headers
- **Accent color**: Light background tint for sections
- **Background color**: Very light hero gradient

**Elements that receive event colors:**
- Hero section background gradient
- Hero title text
- USP icons and backgrounds
- PureWow badge
- 30 Nights Trial badge
- Size/quantity selector borders
- Bonus section borders and icons
- Announcement bar
- Press bar section
- Sleep position guide section
- The Difference section
- Technology section
- Built for Long Run section
- Pricing section background
- FAQ section cards (light background, colored borders)
- Footer
- Sticky bar
- All CTA buttons

**Elements that stay WHITE (not colored):**
- Header background
- Footer background
- Benefits section background
- Sleep Experts section background
- Testimonials section background
- FluffCo Secret section background

**Elements that use SUBTLE event color (#ffe8e8 for Valentine):**
- Press bar, Sleep Position Guide, The Difference, Technology, Built for Long Run, Pricing sections

### 2. Hero Image (Required)
Generate ONE custom hero image that:
- Matches the existing hero pillow composition (single pillow, premium aesthetic)
- Uses event-appropriate colors (e.g., burgundy velvet for Valentine)
- Includes subtle contextual elements (e.g., rose petals for Valentine)
- Has a simple, smooth background (no complex patterns)
- Maintains the premium, luxurious feel

### 3. Copy Customization (Required)
- **Announcement bar**: Event-specific offer text (keep short for mobile)
- **Hero headline**: Gift-focused messaging
- **Hero subheadline**: Emotional positioning for the occasion
- **USPs**: Gift-giving focused benefits
- **CTA buttons**: Event-specific action text (e.g., "Gift Now" for Valentine)
- **Benefits section title**: Event-appropriate (e.g., "Why It's the Perfect Gift")

### 4. Gallery Images
- First image: Custom event-themed hero pillow
- Second image: Can be event-themed (e.g., unboxing with gift elements)
- Images 3-7: Keep original default images

### 5. Testimonials
- Keep 8 testimonials for "Show More" functionality
- Pre-header text stays default ("Join the community...")
- Content can be gift-giving focused

---

## What Does NOT Get Customized

1. **Section structure** - Same sections in same order
2. **FAQ title** - Always "Common Questions" (not event-specific)
3. **Testimonials pre-header** - Keep default
4. **Benefits count** - Always exactly 3 items
5. **Green elements in Premium Quality section** - Convert to white-scale for events
6. **Thumbnail tags** - Keep original tags (5-star, 3 tips, 3 layers, etc.)

---

## Event Date Rules

1. **1 business day buffer before start**: Page accessible 1 day before official start date
2. **1 business day buffer after end**: Page accessible 1 day after official end date (no countdown)
3. **Timer sync**: All timers on the page sync to LP Manager dates
4. **Timer hidden when expired**: If event end date has passed, hide all countdown timers
5. **Closed page**: Show EventClosedPage when outside buffer dates

---

## LP Manager Integration

Each event page needs:
1. Entry in `categorizeConfigs()` as an event config
2. Default dates in `getDefaultEventDates()`
3. Color scheme in `colorSchemes` object
4. Route in App.tsx
5. Config file in `/client/src/config/`

---

## Creating a New Event Page Checklist

1. [ ] Create config file: `/client/src/config/{event-name}.config.ts`
2. [ ] Define color scheme (primary, secondary, accent, background)
3. [ ] Generate custom hero image with event theming
4. [ ] Update announcement bar text
5. [ ] Update hero headline and subheadline
6. [ ] Update USPs for gift-giving focus
7. [ ] Update CTA button text
8. [ ] Update benefits (exactly 3 items)
9. [ ] Add 8 testimonials
10. [ ] Export config from `/client/src/config/index.ts`
11. [ ] Add route in App.tsx
12. [ ] Add to LP Manager categorization
13. [ ] Add default dates in LP Manager
14. [ ] Add color scheme to LP Manager dropdown
15. [ ] Update Home.tsx event status check to include new event ID
16. [ ] Test all color applications
17. [ ] Test closed page behavior

---

## Color Scheme Reference

### Valentine's Day
- Primary: #c41e3a (deep red)
- Secondary: #8b1a2d (dark burgundy)
- Accent: #fff5f5 (very light pink)
- Background: #fff8f8 (lightest pink)
- Subtle sections: #ffe8e8

### Mother's Day
- Primary: #d4a5a5 (dusty rose)
- Secondary: #9b6b6b (mauve)
- Accent: #fff9f9 (very light rose)
- Background: #fffafa (lightest rose)
- Subtle sections: #fce8e8

### Father's Day
- Primary: #2c5282 (navy blue)
- Secondary: #1a365d (dark navy)
- Accent: #f0f5ff (very light blue)
- Background: #f8faff (lightest blue)
- Subtle sections: #e8f0ff

### Black Friday
- Primary: #1a1a1a (black)
- Secondary: #333333 (dark grey)
- Accent: #f5f5f5 (light grey)
- Background: #fafafa (off-white)
- Subtle sections: #e8e8e8

### Christmas
- Primary: #165b33 (forest green)
- Secondary: #bb2528 (christmas red)
- Accent: #fef7f7 (very light red)
- Background: #f8fff8 (lightest green)
- Subtle sections: #e8f5e8
