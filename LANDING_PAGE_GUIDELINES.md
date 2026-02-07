# Landing Page Creation Guidelines

**Version:** 1.0  
**Last Updated:** January 23, 2026  
**Status:** Living Document

This document defines the mandatory process, decision hierarchy, and acceptable deviations when creating any new landing page for the FluffCo pillow product ecosystem.

---

## Table of Contents

1. [Page Type Definition](#1-page-type-definition-mandatory-first-step)
2. [Structure and Template Integrity](#2-structure-and-template-integrity)
3. [LP Manager Integration](#3-lp-manager-integration-non-negotiable)
4. [Context-Based Copy Customization](#4-context-based-copy-customization)
5. [Structural Adjustments](#5-structural-adjustments-after-copy-is-done)
6. [Gallery Hero Customization Rules](#6-gallery-hero-customization-rules)
7. [Adding New Sections or Slides](#7-adding-new-sections-or-slides-conditional)
8. [Event Page Specific Rules](#8-event-page-specific-rules)
9. [Technical Implementation](#9-technical-implementation)
10. [SEO and Metadata](#10-seo-and-metadata)
11. [Quality Assurance Checklist](#11-quality-assurance-checklist)
12. [Living Document Principle](#12-living-document-principle)

---

## 1. Page Type Definition (Mandatory First Step)

**Before creating anything**, explicitly identify the page type:

### Page Types

- **Use Case Page** - Targets specific user scenarios (e.g., side-sleeper, back-pain-relief)
- **Angle Page** - Emphasizes specific product benefits (e.g., hotel-quality, restorative-alignment)
- **Event Page** - Time-sensitive promotional pages (e.g., valentine-gift, mothers-day)

### Why This Matters

This choice determines:
- The base template to use
- Which sections may be contextualized
- Which elements must remain legacy
- Whether color schemes, dates, or urgency logic apply

**Rule:** You must start from the correct base template. Do not retrofit another type.

---

## 2. Structure and Template Integrity

### Mandatory Requirements

All new pages must:
- Respect the exact 1:1 structure of the existing system
- Use only the components already created
- Be built as an iteration of the legacy base template

### Rules

- **No ad hoc components** - Use existing components from `client/src/components/`
- **No structural improvisation before content customization** - Follow the base template structure first
- **Deviations are allowed only after the base page is correctly implemented** - Document rationale for any structural changes

### Existing Component Library

Before creating new components, check if these exist:
- `ImageCarousel.tsx` - Gallery with thumbnails
- `StockInventoryBar.tsx` - Urgency indicator
- `OrderPopup.tsx` - Social proof notifications
- `PressLogos.tsx` - Media credibility
- `ProfileResultsBanner.tsx` - Quiz result personalization
- `QuizMiniSection.tsx` - Quiz entry point
- `EventClosedPage.tsx` - Post-event messaging

---

## 3. LP Manager Integration (Non-Negotiable)

### Requirements

Every new page must:
- Be added to the LP Manager (`client/src/pages/LPManager.tsx`)
- Appear dynamically in the page selector
- Reflect live updates if modified
- Be accessible via the `/lp-manager` route

### Implementation Steps

1. Create config file in `client/src/config/{page-name}.config.ts`
2. Export config in `client/src/config/index.ts`
3. Add route in `client/src/App.tsx`
4. Add to LP Manager selector

**Rule:** If a page is not visible or editable through the LP Manager, it is considered invalid.

---

## 4. Context-Based Copy Customization

### 4.1 Defining Context-Based vs Legacy Copy

Establish a clear split between:

#### Context-Based Copy (Customizable)

- Headlines
- Sub-headlines
- Supporting benefit statements
- Contextual CTAs
- Section intros
- Testimonial highlights

#### Legacy Copy (Must Remain Stable)

- Core product value propositions
- Foundational proof arguments
- Structural explanations
- Compliance-sensitive claims
- Technical specifications
- Warranty/guarantee details

### Pragmatic Decision-Making

Use pragmatism and common sense:
- **If personalization adds clarity or relevance** → apply it
- **If it risks diluting core arguments** → keep legacy

**Goal:** Avoid over-personalization that weakens clarity or credibility.

---

### 4.2 Copywriting Rules

#### CRO Best Practices

Always apply conversion rate optimization (CRO) copywriting best practices:
- Clarity over creativity
- Specificity over vagueness
- Benefits over features
- Social proof integration
- Urgency and scarcity (when authentic)

#### Winning Ad Copy Priority

**If winning ad copy is provided:**
- Prioritize the exact words and word combinations
- Do not rewrite proven language
- Maintain the emotional tone and phrasing

**If no winning angles are provided:**
- Use CRO principles, clarity, specificity, and relevance
- Avoid creative fluff or speculative claims
- Test multiple variations if possible

---

## 5. Structural Adjustments (After Copy Is Done)

Once copy customization is complete, assess whether the page brief justifies:

### Allowed Adjustments

- Reordering entire sections
- Reordering elements inside the gallery hero
- Hiding sections in exceptional, justified edge cases

### Rules

- **Structure changes must be intentional and defensible** - Document the rationale
- **Never change structure by default** - Respect the proven template
- **Document the rationale when changes are made** - Add comments in config file

---

## 6. Gallery Hero Customization Rules

### Slides 1, 2, and 5 (Standard Customization)

- **Keep the original image composition** - Maintain layout and framing
- **Contextualize the object or subject** - Adapt to match page intent
- **Maintain brand environment:**
  - Color palette (navy `#2d3a5c`, cream `#f5f1e8`, coral `#e63946`, gold `#f5c542`)
  - Mood (premium, trustworthy, comfortable)
  - Visual language (clean, modern, lifestyle-focused)

**Goal:** The image should feel like a natural evolution, not a replacement.

---

### Slide 3 (Exception Case - Full Customization)

For slide 3 only, you may:

- **Fully modify:**
  - Pills content
  - Thumbnail titles
  - Text overlays
  - Image composition
- **Make it 100% context-based** - Focus on the core argument of the page
- **Carry the strongest contextual differentiation** - This is your hero slide

**Purpose:** This slide is designed to be the most contextually relevant and persuasive element of the gallery.

---

### Slide 4 (Comparison Slide)

- **Hotel comparison** - FluffCo vs Four Seasons, Ritz-Carlton, Marriott
- **Price/value positioning** - Show savings and feature advantages
- **Keep consistent** - This slide reinforces core value proposition across all pages

---

### Slide 6 (Packaging/Unboxing)

- **Hotel comfort packaging** - Premium presentation
- **Gift-ready appearance** - Especially important for event pages
- **Maintain brand consistency** - Logo, colors, materials

---

## 7. Adding New Sections or Slides (Conditional)

After core customization is complete, evaluate:

### Decision Criteria

- Does the message require additional explanation?
- Is there a missing proof, angle, or clarification?
- Will this section improve conversion or reduce friction?

### Implementation Rules

**Only if the answer is clearly yes:**
- Add a new section or an extra gallery slide
- Generate new images if needed (use `generate` tool)
- Ensure full consistency with existing components and logic
- Add to config with clear naming

**Rule:** No section should exist without a clear purpose.

---

## 8. Event Page Specific Rules

### 8.1 Color Scheme

#### Process

1. **Check the color scheme database first** - Review existing event color schemes
2. **If a suitable scheme exists:**
   - Reuse it for consistency
   - Reference the scheme ID in config
3. **If not:**
   - Create a new scheme following existing logic:
     - Color hierarchy (primary, secondary, accent)
     - Contrast rules (WCAG AA minimum)
     - Readability constraints (text on backgrounds)
   - Add to color scheme database
   - Connect the scheme to the frontend

#### Existing Event Color Schemes

- **Valentine's Day** - Red/pink romantic palette
- **Mother's Day** - Soft pastels, floral tones
- **Father's Day** - Navy/brown masculine palette

---

### 8.2 Event End Date

#### Logic

- **Define the most logical end date using common sense**
- **If multiple valid dates exist:**
  - Prioritize US dates (target market)
  - Choose the date with the strongest commercial relevance
  - Consider shipping cutoff dates for gift delivery

#### Implementation

- Set the date in the config file
- Ensure it connects to `EventClosedPage` component
- Test the transition from active to closed state

---

### 8.3 Event-Specific Elements

- **Urgency messaging** - Countdown timers, limited-time offers
- **Gift framing** - "Perfect gift for..." messaging
- **Seasonal imagery** - Holiday-appropriate visuals
- **CTA variations** - "Gift Now" instead of "Order Now"

---

## 9. Technical Implementation

### Config File Structure

```typescript
import type { LandingPageConfig } from './types';

export const pageNameConfig: LandingPageConfig = {
  // Page metadata
  pageTitle: 'Page Title – FluffCo',
  pageType: 'angle' | 'useCase' | 'event',
  
  // Hero section
  hero: {
    badge: '...',
    headline: '...',
    subheadline: '...',
    images: [...],
  },
  
  // Sections
  benefits: {...},
  technology: {...},
  testimonials: {...},
  faq: {...},
  
  // Event-specific (if applicable)
  event: {
    endDate: '2026-02-14',
    colorScheme: 'valentine',
  },
};
```

---

### Component Usage

```typescript
// In App.tsx
import { pageNameConfig } from '@/config/page-name.config';

<Route path="/page-name">
  <ProductLandingTemplate config={pageNameConfig} />
</Route>
```

---

### LP Manager Integration

```typescript
// In LPManager.tsx
const pages = [
  { value: 'page-name', label: 'Page Display Name', type: 'angle' },
  // ...
];
```

---

## 10. SEO and Metadata

### Page Title Format

- **Angle/Use Case Pages:** `{Title} – FluffCo`
  - Example: `Hotel Quality Pillow – FluffCo`
- **Event Pages:** `{Event} {Product} – FluffCo`
  - Example: `Valentine's Day Gift Pillow – FluffCo`
- **Default Page:** `Down Alternative Pillow – FluffCo`

### SEO Exclusion

**All landing pages must be configured to prevent search engine indexing:**

```html
<meta name="robots" content="noindex, nofollow" />
```

**Reason:** These pages are designed for paid traffic and specific campaigns, not organic search.

---

### Open Graph / Social Sharing

```typescript
og: {
  title: 'Page Title – FluffCo',
  description: 'Brief compelling description...',
  image: '/images/og-image.jpg',
}
```

---

## 11. Quality Assurance Checklist

Before considering a landing page complete, verify:

### Structure & Components
- [ ] Page type correctly identified (angle/use-case/event)
- [ ] Built from correct base template
- [ ] All components from existing library
- [ ] No ad hoc structural changes without documentation

### LP Manager Integration
- [ ] Config file created in `client/src/config/`
- [ ] Exported in `config/index.ts`
- [ ] Route added in `App.tsx`
- [ ] Appears in LP Manager selector
- [ ] Live preview works correctly

### Copy & Content
- [ ] Context-based copy customized appropriately
- [ ] Legacy copy preserved where needed
- [ ] CRO best practices applied
- [ ] Winning ad copy used (if provided)
- [ ] All testimonials formatted correctly (no double quotes)

### Gallery Hero
- [ ] Slides 1, 2, 5 maintain brand environment
- [ ] Slide 3 fully customized for context
- [ ] Slide 4 (comparison) consistent
- [ ] Slide 6 (packaging) appropriate
- [ ] All images optimized and loading correctly

### Event Pages (if applicable)
- [ ] Color scheme selected or created
- [ ] End date configured correctly
- [ ] EventClosedPage transition tested
- [ ] Gift framing and urgency messaging appropriate

### Technical
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] All CTAs functional and tracked
- [ ] Page load performance acceptable

### SEO & Metadata
- [ ] Page title follows naming convention
- [ ] `noindex` meta tag present
- [ ] Open Graph tags configured
- [ ] Favicon displays correctly

---

## 12. Living Document Principle

This guideline is not static.

### Evolution Process

It must be:
- **Updated** - When new patterns emerge
- **Clarified** - When ambiguity is discovered
- **Improved over time** - Based on results and feedback

### When to Update

- Feedback or edge cases arise
- New page types are introduced
- Conversion data suggests improvements
- Technical constraints change

### How to Update

1. Document the issue or improvement
2. Propose changes with rationale
3. Review with team (if applicable)
4. Update this document
5. Communicate changes to all stakeholders

---

## Appendix: Related Knowledge

### Reusable Template Strategy
When creating landing pages, prioritize reusable templates based on successful core designs. Templates should be adaptable for multiple landers with varying copy and minor section modifications, while maintaining consistent core elements and structure.

### Design Consistency
New page types must strictly adhere to the existing design system. No design breaks or inconsistencies should be introduced that deviate from the established LP design language.

### Componentization
All customized or recurring elements must be componentized into reusable, consistent components. Preserve existing customizations (colors, element order, overrides) within the component system.

### Centralized Configuration
Recurring site-wide text elements (e.g., "30 Night Trial", CTA button text) must be editable through centralized configuration, with support for global defaults and per-type/per-angle overrides.

---

**End of Guidelines**

For questions or clarifications, refer to the project documentation or consult with the development team.
