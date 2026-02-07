# Backend-Frontend Configuration Analysis
## FluffCo Restorative Alignment Pillow Landing Page System

**Date:** January 23, 2026  
**Purpose:** Comprehensive analysis of configuration opportunities between backend settings panel and frontend page templates

---

## Executive Summary

This document analyzes the current configuration system and proposes a hierarchical structure with three levels:
1. **Global Store Settings** - Site-wide defaults (announcement bar, trust badges, pricing)
2. **Page Type Settings** - Shared configurations for page categories (event, angle, use-case)
3. **Individual Page Settings** - Page-specific overrides and customizations

---

## Current Configuration Structure

### Existing Configuration Files

```
client/src/config/
├── base.config.ts              # Default/legacy page configuration
├── types.ts                    # TypeScript interfaces for all configs
├── utils.ts                    # Configuration utilities
├── quiz.ts                     # Quiz questions and profiles
├── index.ts                    # Configuration exports
└── [page-specific configs]
    ├── restorative-alignment.config.ts
    ├── side-sleeper.config.ts
    ├── neck-pain-relief.config.ts
    ├── down-alternative.config.ts
    ├── hotel-quality.config.ts
    ├── mothers-day.config.ts
    ├── fathers-day.config.ts
    └── valentine-gift.config.ts
```

### Current Configuration Scope

The existing `LandingPageConfig` interface includes:
- **Metadata**: id, name, slug, category, SEO
- **Theme**: colors, primary/accent
- **Section visibility**: which sections to show
- **Section content**: hero, gallery, benefits, testimonials, pricing, FAQ, etc.

---

## Proposed Configuration Hierarchy

### Level 1: Global Store Settings

**Purpose:** Site-wide defaults that apply across ALL pages unless overridden

#### 1.1 Brand & Identity
```typescript
interface GlobalBrandSettings {
  // Logo & Branding
  logo: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };
  
  // Brand Colors
  colors: {
    primary: string;      // e.g., #e63946
    accent: string;       // e.g., #2d3a5c
    success: string;
    warning: string;
    error: string;
  };
  
  // Typography
  fonts: {
    heading: string;
    body: string;
  };
}
```

**Backend Panel Location:** Settings → Brand

---

#### 1.2 Trust & Social Proof
```typescript
interface GlobalTrustSettings {
  // Customer Count
  customerCount: {
    value: number;         // e.g., 746000
    label: string;         // e.g., "Happy Sleepers"
    showPlus: boolean;     // Show "+" suffix
  };
  
  // Review Stats
  reviews: {
    count: string;         // e.g., "546,000+"
    rating: string;        // e.g., "95/100"
    source: string;        // e.g., "PureWow"
  };
  
  // Trust Badges
  badges: {
    show30NightTrial: boolean;
    trialDays: number;           // e.g., 30
    showOekoTex: boolean;
    showOprahBadge: boolean;
    showMadeInUSA: boolean;
  };
  
  // Press Mentions
  pressLogos: Array<{
    name: string;
    logo: string;
    url?: string;
  }>;
}
```

**Backend Panel Location:** Settings → Trust & Social Proof

---

#### 1.3 Shipping & Fulfillment
```typescript
interface GlobalShippingSettings {
  // Shipping
  freeShippingThreshold: number;  // e.g., 0 for always free
  shippingDays: {
    min: number;                   // e.g., 3
    max: number;                   // e.g., 5
  };
  shippingRegions: string[];       // e.g., ["US", "Canada"]
  
  // Stock & Inventory
  stockDisplay: {
    showLowStock: boolean;
    lowStockThreshold: number;     // e.g., 20
    showStockBar: boolean;
  };
}
```

**Backend Panel Location:** Settings → Shipping

---

#### 1.4 Pricing & Offers
```typescript
interface GlobalPricingSettings {
  // Base Pricing
  basePrices: {
    standard: {
      single: number;
      bulk2: number;
      bulk4: number;
    };
    king: {
      single: number;
      bulk2: number;
      bulk4: number;
    };
  };
  
  // Discounts
  bulkDiscounts: {
    qty2: number;          // Percentage off for 2
    qty4: number;          // Percentage off for 4
  };
  
  // Bonuses
  bonuses: {
    showPillowcaseBonus: boolean;
    pillowcaseBonusQty: number;    // e.g., 4 (buy 4 get 4 free)
    pillowcaseValue: number;       // e.g., 29
  };
  
  // Payment Options
  payment: {
    showAffirm: boolean;
    affirmMonthlyFrom: number;     // e.g., 15
  };
}
```

**Backend Panel Location:** Settings → Pricing

---

#### 1.5 Legal & Policies
```typescript
interface GlobalLegalSettings {
  // Company Info
  company: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  
  // Policy Links
  policies: {
    privacyUrl: string;
    termsUrl: string;
    returnsUrl: string;
    shippingUrl: string;
  };
  
  // Footer
  footer: {
    tagline: string;
    copyright: string;
    showSocialLinks: boolean;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };
}
```

**Backend Panel Location:** Settings → Legal & Policies

---

#### 1.6 Analytics & Tracking
```typescript
interface GlobalAnalyticsSettings {
  // Tracking IDs
  googleAnalytics?: string;
  facebookPixel?: string;
  tiktokPixel?: string;
  
  // Conversion Tracking
  conversionEvents: {
    addToCart: boolean;
    initiateCheckout: boolean;
    purchase: boolean;
  };
}
```

**Backend Panel Location:** Settings → Analytics

---

### Level 2: Page Type Settings

**Purpose:** Shared configurations for page categories (event, angle, use-case)

#### 2.1 Event Pages Settings
```typescript
interface EventPageTypeSettings {
  // Event Timing
  defaultDuration: number;        // Days
  showCountdown: boolean;
  countdownStyle: 'timer' | 'text';
  
  // Event Styling
  announcementBarStyle: {
    showTimer: boolean;
    urgencyLevel: 'low' | 'medium' | 'high';
  };
  
  // Event Behavior
  closedPageBehavior: {
    showClosedMessage: boolean;
    closedMessage: string;
    redirectToHome: boolean;
    redirectDelay: number;         // Seconds
  };
}
```

**Backend Panel Location:** Settings → Page Types → Event Pages

---

#### 2.2 Angle Pages Settings
```typescript
interface AnglePageTypeSettings {
  // Content Strategy
  contentStrategy: {
    retainLegacyUsps: boolean;     // Keep base USPs
    contextualizeOnly: boolean;    // Only add context, don't replace
  };
  
  // Gallery Customization
  gallery: {
    allowSlotReordering: boolean;
    allowPillCustomization: boolean;
    requireAllSlots: boolean;
  };
  
  // Testimonials
  testimonials: {
    filterByAngle: boolean;
    minCount: number;
    maxCount: number;
  };
}
```

**Backend Panel Location:** Settings → Page Types → Angle Pages

---

#### 2.3 Use Case Pages Settings
```typescript
interface UseCasePageTypeSettings {
  // Redirect Behavior
  defaultRedirectUrl: string;      // e.g., "/"
  
  // Content Display
  showPricing: boolean;
  showCheckout: boolean;
  
  // CTA Behavior
  ctaStyle: 'redirect' | 'modal' | 'inline';
}
```

**Backend Panel Location:** Settings → Page Types → Use Case Pages

---

### Level 3: Individual Page Settings

**Purpose:** Page-specific overrides and customizations

#### 3.1 Page Metadata
```typescript
interface PageSettings {
  // Basic Info
  id: string;
  name: string;
  slug: string;
  category: 'legacy' | 'angle' | 'event' | 'use-case';
  status: 'draft' | 'published' | 'archived';
  
  // SEO
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
    noindex?: boolean;
  };
  
  // Scheduling (for events)
  schedule?: {
    startDate: string;
    endDate: string;
    timezone: string;
  };
}
```

---

#### 3.2 Page-Specific Overrides

Each page can override any global or page-type setting:

```typescript
interface PageOverrides {
  // Override Global Settings
  globalOverrides?: Partial<GlobalStoreSettings>;
  
  // Override Page Type Settings
  pageTypeOverrides?: Partial<PageTypeSettings>;
  
  // Custom Content
  content: {
    // Hero Section
    hero?: Partial<HeroConfig>;
    
    // Gallery
    gallery?: {
      slotOrder?: GallerySlotType[];
      slotOverrides?: Partial<Record<GallerySlotType, GallerySlotOverride>>;
    };
    
    // Benefits
    benefits?: Partial<BenefitsConfig>;
    
    // Testimonials
    testimonials?: {
      featured?: string[];        // IDs of testimonials to feature
      exclude?: string[];         // IDs to exclude
      customTestimonials?: Testimonial[];
    };
    
    // Pricing
    pricing?: {
      highlightTier?: number;
      customBadges?: Record<number, string>;
    };
    
    // FAQ
    faq?: {
      featured?: string[];
      customQuestions?: FAQItem[];
    };
  };
}
```

---

## Recommended Configuration UI Structure

### Backend Admin Panel Organization

```
Settings (Global Icon)
├── Brand
│   ├── Logo & Colors
│   ├── Typography
│   └── Theme
│
├── Trust & Social Proof
│   ├── Customer Count
│   ├── Review Stats
│   ├── Trust Badges
│   └── Press Mentions
│
├── Shipping & Fulfillment
│   ├── Shipping Options
│   ├── Stock Display
│   └── Inventory Alerts
│
├── Pricing & Offers
│   ├── Base Pricing
│   ├── Bulk Discounts
│   ├── Bonuses
│   └── Payment Options
│
├── Legal & Policies
│   ├── Company Info
│   ├── Policy Links
│   └── Footer
│
├── Analytics
│   └── Tracking IDs
│
└── Page Types
    ├── Event Pages
    ├── Angle Pages
    └── Use Case Pages

Pages (Pages Icon)
├── All Pages (List View)
│   ├── Filter by Category
│   ├── Filter by Status
│   └── Search
│
└── Individual Page Editor
    ├── Metadata Tab
    ├── Content Tab
    │   ├── Hero Section
    │   ├── Gallery
    │   ├── Benefits
    │   ├── Testimonials
    │   ├── Pricing
    │   └── FAQ
    ├── Overrides Tab
    │   ├── Global Overrides
    │   └── Page Type Overrides
    └── Preview Tab
```

---

## Configuration Inheritance & Priority

### Priority Order (Highest to Lowest)

1. **Individual Page Settings** - Most specific
2. **Page Type Settings** - Category defaults
3. **Global Store Settings** - Site-wide defaults

### Example Inheritance Flow

```
Global: customerCount = 746,000
  ↓
Page Type (Event): No override
  ↓
Individual Page (Mother's Day): customerCount = 800,000
  ↓
RESULT: Page displays 800,000
```

---

## Currently Configurable Elements

### ✅ Already Configurable (via config files)

1. **Hero Section**
   - Headline & subheadline
   - Trust badge (review count, rating, source)
   - USPs (icons, titles, descriptions)
   - Badge visibility (Oeko-Tex, Oprah, 30 Night Trial)

2. **Gallery**
   - Slot order
   - Slot overrides (images, pills, headlines)
   - Award carousel items

3. **Benefits Section**
   - Section title & subtitle
   - Benefit items (icon, title, description)

4. **Sleeper Types**
   - Section title & subtitle
   - Sleeper type cards
   - Trust badges

5. **Price Comparison**
   - Enable/disable section
   - Retail vs direct pricing
   - Savings calculator

6. **Testimonials**
   - Section title & subtitle
   - Testimonial list
   - Show more button

7. **Pricing**
   - Tier structure
   - Badges (popular, best value)
   - Bonuses

8. **FAQ**
   - Section title
   - FAQ items

9. **Announcement Bar**
   - Text
   - Timer visibility
   - CTA text & target

10. **Header & Footer**
    - Nav items
    - CTA text
    - Footer links

---

## Opportunities for Backend Connection

### 🔄 Should Be Connected to Backend

#### High Priority (Frequently Changed)

1. **Announcement Bar**
   - Text content
   - Timer settings
   - CTA text & target
   - **Reason:** Changes with promotions/events

2. **Pricing**
   - Base prices
   - Discount percentages
   - Bonus offers
   - **Reason:** Frequent price adjustments

3. **Customer Count**
   - Current count
   - Display format
   - **Reason:** Updates as business grows

4. **Trust Badges**
   - 30 Night Trial (days)
   - Badge visibility toggles
   - **Reason:** May change with policy updates

5. **Stock Display**
   - Low stock threshold
   - Stock bar visibility
   - **Reason:** Inventory management

#### Medium Priority (Occasionally Changed)

6. **Review Stats**
   - Review count
   - Rating
   - Source
   - **Reason:** Updates with new reviews

7. **Press Mentions**
   - Logo list
   - URLs
   - **Reason:** New press coverage

8. **Shipping Info**
   - Shipping days
   - Free shipping threshold
   - Regions
   - **Reason:** Logistics changes

9. **Payment Options**
   - Affirm availability
   - Monthly payment amount
   - **Reason:** Payment partner changes

10. **Event Timing**
    - Start/end dates
    - Closed page message
    - **Reason:** Event management

#### Low Priority (Rarely Changed)

11. **Brand Colors**
    - Primary/accent colors
    - **Reason:** Rebrand scenarios

12. **Company Info**
    - Address, email, phone
    - **Reason:** Business changes

13. **Policy Links**
    - Privacy, terms, returns URLs
    - **Reason:** Legal updates

---

## Recommended Implementation Phases

### Phase 1: Global Store Settings (Weeks 1-2)
- Implement backend database schema
- Create admin UI for global settings
- Migrate hardcoded values to database
- Test inheritance system

**Priority Items:**
- Customer count
- Pricing
- Trust badges
- Announcement bar

### Phase 2: Page Type Settings (Weeks 3-4)
- Implement page type configurations
- Create UI for event/angle/use-case settings
- Test inheritance with overrides

**Priority Items:**
- Event page timing
- Angle page content strategy

### Phase 3: Individual Page Overrides (Weeks 5-6)
- Implement page-specific override system
- Create page editor UI
- Migrate existing configs to database
- Test full inheritance chain

**Priority Items:**
- Hero section overrides
- Gallery customization
- Testimonial filtering

### Phase 4: Advanced Features (Weeks 7-8)
- Implement configuration versioning
- Add A/B testing support
- Create configuration templates
- Build import/export tools

---

## Technical Implementation Notes

### Database Schema Recommendations

```sql
-- Global Settings
CREATE TABLE global_settings (
  id SERIAL PRIMARY KEY,
  category VARCHAR(50),      -- 'brand', 'trust', 'shipping', etc.
  key VARCHAR(100),
  value JSONB,
  updated_at TIMESTAMP
);

-- Page Type Settings
CREATE TABLE page_type_settings (
  id SERIAL PRIMARY KEY,
  page_type VARCHAR(20),     -- 'event', 'angle', 'use-case'
  settings JSONB,
  updated_at TIMESTAMP
);

-- Pages
CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE,
  name VARCHAR(200),
  category VARCHAR(20),
  status VARCHAR(20),
  config JSONB,              -- Full page configuration
  overrides JSONB,           -- Specific overrides
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Configuration History (for versioning)
CREATE TABLE config_history (
  id SERIAL PRIMARY KEY,
  entity_type VARCHAR(20),   -- 'global', 'page_type', 'page'
  entity_id INT,
  config JSONB,
  changed_by VARCHAR(100),
  changed_at TIMESTAMP
);
```

### API Endpoints

```typescript
// Global Settings
GET    /api/settings/global
GET    /api/settings/global/:category
PUT    /api/settings/global/:category
POST   /api/settings/global/:category/:key

// Page Type Settings
GET    /api/settings/page-types
GET    /api/settings/page-types/:type
PUT    /api/settings/page-types/:type

// Pages
GET    /api/pages
GET    /api/pages/:slug
POST   /api/pages
PUT    /api/pages/:slug
DELETE /api/pages/:slug

// Configuration Resolution (with inheritance)
GET    /api/pages/:slug/resolved-config
```

---

## Benefits of This Approach

### For Business Users
1. **No Code Changes Required** - Update content via admin panel
2. **Consistent Branding** - Global settings ensure consistency
3. **Flexible Overrides** - Customize specific pages when needed
4. **Event Management** - Easy to create and manage time-limited campaigns
5. **A/B Testing Ready** - Can test different configurations

### For Developers
1. **Clear Hierarchy** - Easy to understand where settings come from
2. **Type Safety** - TypeScript interfaces for all configs
3. **Maintainable** - Centralized configuration management
4. **Scalable** - Easy to add new settings
5. **Testable** - Can test inheritance logic

### For Marketing
1. **Fast Iteration** - Launch new pages quickly
2. **Campaign Flexibility** - Easy event page creation
3. **Data-Driven** - Track which configs perform best
4. **Consistency** - Brand guidelines enforced globally

---

## Next Steps

1. **Review & Prioritize**
   - Review this analysis with stakeholders
   - Prioritize which settings to implement first
   - Define success metrics

2. **Design Admin UI**
   - Create mockups for settings panels
   - Design page editor interface
   - Plan user workflows

3. **Implement Phase 1**
   - Set up database schema
   - Build API endpoints
   - Create admin UI for global settings
   - Migrate priority items

4. **Test & Iterate**
   - Test with real use cases
   - Gather feedback
   - Refine based on usage

---

## Appendix: Configuration Examples

### Example 1: Mother's Day Event Page

```typescript
{
  // Page Metadata
  id: "mothers-day-2026",
  slug: "mothers-day",
  category: "event",
  
  // Inherits from Global Settings
  // - customerCount: 746,000
  // - basePrices
  // - trustBadges
  
  // Inherits from Event Page Type
  // - showCountdown: true
  // - closedPageBehavior
  
  // Page-Specific Overrides
  overrides: {
    announcementBar: {
      text: "Mother's Day Special - Buy 4, Get 4 Pillowcases Free",
      showTimer: true,
    },
    hero: {
      headline: "Give Mom the Gift of Perfect Sleep",
      eventHeadline: "Mother's Day Special",
    },
    gallery: {
      slotOverrides: {
        summary: {
          headline: "The Perfect Mother's Day Gift",
        },
      },
    },
  },
  
  // Scheduling
  schedule: {
    startDate: "2026-05-01",
    endDate: "2026-05-11",
    timezone: "America/New_York",
  },
}
```

### Example 2: Side Sleeper Angle Page

```typescript
{
  // Page Metadata
  id: "side-sleeper",
  slug: "side-sleeper",
  category: "angle",
  
  // Inherits from Global Settings
  // - All global settings
  
  // Inherits from Angle Page Type
  // - retainLegacyUsps: true
  // - contextualizeOnly: true
  
  // Page-Specific Overrides
  overrides: {
    hero: {
      headline: "The Pillow Side Sleepers Actually Keep",
      subheadline: "Engineered for side sleepers who need consistent support without the shoulder pressure.",
    },
    gallery: {
      slotOverrides: {
        tips: {
          pills: [
            { number: 1, title: "Side Sleep Support", description: "..." },
            { number: 2, title: "Shoulder Relief", description: "..." },
            { number: 3, title: "Spinal Alignment", description: "..." },
          ],
        },
      },
    },
    testimonials: {
      featured: ["side-sleeper-1", "side-sleeper-2", "side-sleeper-3"],
    },
  },
}
```

---

**End of Analysis**
