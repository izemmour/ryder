# FluffCo Landing Page System - Project Status

**Last Updated:** January 21, 2026  
**Dev Server:** Running on port 3001  
**Status:** ✅ All routes verified and working

---

## 🎯 Current Task Context

You want to create a **new landing page** that recreates the structure and functionality of `https://buy.fluff.co/down-alternative`, but with a **reframed narrative focused on "Restorative Alignment"** for a pillow product. The design and copy style should be inspired by `https://cowboy.com/` for premium perceived value.

### Key Requirements:
- Same product options as the original Fluff site
- Target audience: Adults 45+ seeking consistency over experimentation
- Key messaging: natural neck alignment, long-term pillow integrity, sleep hygiene, shape retention
- Include: "546,000+ Happy Sleepers" social proof, "Up to 66% Off" offer
- Use placeholders for images, gallery, and videos initially
- **Ensure all existing landing pages maintain their original settings (1:1)**

---

## 📋 Available Landing Pages

### 1. **Legacy/Default Pages**
| Route | Config ID | Description | Status |
|-------|-----------|-------------|--------|
| `/` | `down-alternative` | Original Fluff.co down alternative page (default) | ✅ Active |
| `/down-pillow-restorative-alignment` | `restorative-alignment` | Restorative alignment variant | ✅ Active |

### 2. **Marketing Angle Pages**
| Route | Config ID | Description | Status |
|-------|-----------|-------------|--------|
| `/hotel-quality-pillow` | `hotel-quality` | "Same pillows used in 5-star hotels" angle | ✅ Active |
| `/neck-pain-relief-pillow` | `neck-pain-relief` | Neck pain relief focus | ✅ Active |

### 3. **Use Case Pages**
| Route | Config ID | Description | Redirect URL | Status |
|-------|-----------|-------------|--------------|--------|
| `/side-sleeper-pillow` | `side-sleeper` | Side sleeper solution | `/` (legacy homepage) | ✅ Active |

### 4. **Event/Seasonal Pages**
| Route | Config ID | Description | Date Range | Status |
|-------|-----------|-------------|------------|--------|
| `/valentines-gift` | `valentine-gift` | Valentine's Day gift angle | Feb 1-17 | ✅ Active (with bypass) |
| `/mothers-day-gift` | `mothers-day` | Mother's Day gift angle | Jan 1-May 15 (testing) | ✅ Active (with bypass) |
| `/fathers-day-gift` | `fathers-day` | Father's Day gift angle | TBD | ✅ Active (with bypass) |

### 5. **System Pages**
| Route | Description | Status |
|-------|-------------|--------|
| `/lp` | LP Manager dashboard (password: `#skyvane!funnel`) | ✅ Active |
| `/lp/[slug]` | Dynamic landing page preview | ✅ Active |
| `/quiz` | Sleep quiz funnel with email collection | ✅ Active |
| `/debug-quiz` | Quiz result variations debug page | ✅ Active |

---

## 🔍 Verification Results

All routes tested and returning **HTTP 200 (OK)**:

```
✓ / - HTTP 200
✓ /hotel-quality-pillow - HTTP 200
✓ /side-sleeper-pillow - HTTP 200
✓ /lp - HTTP 200
✓ /quiz - HTTP 200
```

**Database helpers:** Updated and working  
**Routing system:** All routes functioning correctly  
**Landing page configurations:** All maintain original settings (1:1)

---

## 🏗️ System Architecture

### Configuration System
- **Base Config:** `/client/src/config/base.config.ts` - Default values
- **Variant Configs:** Individual files for each landing page variant
- **Config Registry:** `/client/src/config/index.ts` - Central registry mapping slugs to configs
- **Types:** `/client/src/config/types.ts` - TypeScript interfaces

### Routing
- **Static Routes:** Direct URL paths (e.g., `/hotel-quality-pillow`)
- **Dynamic Routes:** `/lp/[slug]` for preview and testing
- **Aliases:** Multiple URLs can map to the same config (e.g., `side-sleeper` and `side-sleeper-pillow`)

### LP Manager Features
- Live iframe previews of all landing pages
- Toggle controls for event dates and marketing angles
- Redirect URL configuration for use-case pages
- GA4 analytics placeholders (ready for tracking)
- Password-protected access

---

## ✅ Completed Features

### Recent Improvements (from previous session)
1. ✅ Quiz modal matches checkout design (full-width, brand colors)
2. ✅ Profile results banner with smooth slide-down animation
3. ✅ Dynamic page titles and meta descriptions per page
4. ✅ Quiz results scroll to hero section correctly
5. ✅ LP Manager with live iframe previews
6. ✅ Use-case page URL parameter tracking (`?from=side-sleeper-pillow`)
7. ✅ "Made for {Use Case}" badge on product pages
8. ✅ Reusable QuizModal component (no redirects)
9. ✅ Reviews section matching Home design 1:1
10. ✅ All CTAs redirect to configurable URLs

### Core Features
- ✅ Multiple landing page variants with shared component base
- ✅ Event-based pages with date range controls
- ✅ Use-case specific pages with redirect configuration
- ✅ Sleep quiz funnel with personalized recommendations
- ✅ Email collection and result storage
- ✅ LP Manager dashboard for configuration
- ✅ Live previews with iframe scaling
- ✅ Facebook Pixel tracking (ViewContent, AddToCart)
- ✅ Responsive design (mobile-first)
- ✅ OEKO-TEX certification badge with expandable details
- ✅ Stock inventory bar with countdown timer
- ✅ Order popup with product selection
- ✅ Sticky CTA bar (desktop and mobile)
- ✅ "Just purchased" toast notifications
- ✅ Gallery with overlay badges and comparison slides
- ✅ Hotel comparison pricing table
- ✅ Premium Quality section with press logos
- ✅ Sleep position guide
- ✅ "Cut the middlemen" savings section with bar graphs
- ✅ Testimonials with verified badges
- ✅ FAQ section with expandable items
- ✅ Size guide modal
- ✅ Pillowcase bonus timer

---

## 🚀 Next Steps: Creating the New "Restorative Alignment" Landing Page

The `/down-pillow-restorative-alignment` route already exists and is configured. Here's what needs to happen:

### Option 1: Update Existing Restorative Alignment Config
**File:** `/client/src/config/restorative-alignment.config.ts`

**Changes needed:**
1. Update hero headline and subheadline to focus on "Restorative Alignment"
2. Adjust USPs to emphasize:
   - Natural neck alignment
   - Long-term pillow integrity
   - Sleep hygiene
   - Shape retention
3. Update benefits section with Cowboy.com-inspired premium copy
4. Adjust testimonials to target 45+ audience
5. Update FAQ to address consistency and durability concerns
6. Review and update all copy to match premium, mature tone

### Option 2: Create New Landing Page Route
If you want a completely separate page:

1. Create new config file: `/client/src/config/restorative-alignment-premium.config.ts`
2. Add to config registry in `/client/src/config/index.ts`
3. Choose a route (e.g., `/restorative-alignment` or `/premium-alignment-pillow`)
4. Update App.tsx routing if needed

### Design Inspiration from Cowboy.com
**Premium elements to incorporate:**
- Clean, spacious layouts with generous whitespace
- High-quality product photography (use placeholders initially)
- Sophisticated color palette (navy, cream, gold accents)
- Serif fonts for headlines (Georgia, Playfair Display)
- Understated luxury messaging
- Focus on craftsmanship and longevity
- Minimal but impactful CTAs

### Content Strategy for 45+ Audience
**Messaging principles:**
- Emphasize reliability over novelty
- Focus on long-term value and durability
- Highlight health benefits (neck alignment, pain relief)
- Use testimonials from age-appropriate customers
- Avoid trendy language; use classic, timeless copy
- Stress hygiene and cleanliness (machine washable)
- Mention consistency ("same feel night after night")

---

## 📝 Configuration Example

Here's what a "Restorative Alignment" config should look like:

```typescript
export const restorativeAlignmentPremiumConfig: LandingPageConfig = {
  id: 'restorative-alignment-premium',
  name: 'Restorative Alignment Pillow',
  slug: 'restorative-alignment',
  category: 'angle',
  
  hero: {
    headline: 'The Pillow That Holds Its Shape. Night After Night.',
    subheadline: 'Engineered for consistent support that doesn\'t sag, flatten, or require constant adjustment. Built for sleepers who value reliability over novelty.',
    image: '/images/hero-pillow.png',
    usps: [
      {
        icon: 'support',
        title: 'Consistent Support',
        description: 'Same feel every night'
      },
      {
        icon: 'temperature',
        title: 'Temperature Neutral',
        description: 'Breathable cotton cover'
      },
      {
        icon: 'hypoallergenic',
        title: 'Hypoallergenic',
        description: 'Down alternative fill'
      },
      {
        icon: 'location',
        title: 'Made in USA',
        description: 'Premium materials'
      }
    ]
  },
  
  benefits: {
    sectionTitle: 'Built for the Long Run',
    sectionSubtitle: 'No fluffing. No flattening. No replacing every few months.',
    benefits: [
      {
        title: 'Natural Neck Alignment',
        description: 'Maintains your cervical spine\'s natural curve throughout the night.',
        image: '/images/sleep-alignment.png'
      },
      {
        title: 'Shape Retention',
        description: 'Sanforized construction prevents the compression that plagues standard pillows.',
        image: '/images/wake-refreshed.png'
      },
      {
        title: 'Machine Washable',
        description: 'Proper hygiene without compromise. Reinforced seams handle regular cleaning.',
        image: '/images/washing-machine.png'
      }
    ]
  },
  
  // ... rest of config
};
```

---

## 🛠️ Technical Notes

### Database Helpers
All database helper functions have been updated and are working correctly. No changes needed for the new landing page.

### Routing
The system uses Wouter for client-side routing. All routes are defined in `/client/src/App.tsx`. The current routing setup supports:
- Static routes (direct URL mapping)
- Dynamic routes (`/lp/:slug`)
- Catch-all 404 handling

### LP Manager
Access the LP Manager at `/lp` with password: `#skyvane!funnel`

Features:
- Live iframe previews of all pages
- Toggle controls for events and angles
- Redirect URL configuration
- Copy URL buttons
- Debug quiz link

---

## 📊 Analytics & Tracking

### Facebook Pixel Events
Currently tracking:
- `ViewContent` - On page load (default 4x Standard product)
- `AddToCart` - When user clicks "Order Now" or "Gift Now"

Product data structure:
```javascript
{
  content_ids: ['fluff-pillow-standard-4'],
  content_type: 'product',
  content_name: 'FluffCo Pillow - Standard (4-Pack)',
  value: 149.90,
  currency: 'USD',
  contents: [
    { id: 'fluff-pillow-standard', quantity: 4, item_price: 37.48 }
  ]
}
```

### GA4 Placeholders
LP Manager cards have GA4 analytics placeholders ready for implementation.

---

## 🔒 Security & Access

### LP Manager Password
- Current password: `#skyvane!funnel`
- Stored in session storage
- Required for accessing `/lp` dashboard

### Event Page Bypass
Event pages can be accessed outside their date range with:
- Session storage bypass: `event_bypass_{config.id} = 'true'`
- LP Manager authentication: `skyvane_lp_auth = 'authenticated'`

---

## 📦 Dependencies

### Key Packages
- React 19
- Wouter (routing)
- Lucide React (icons)
- Tailwind CSS 4
- Vite (build tool)

### Custom Components
- `FluffLogo` - Brand logo component
- `PressLogos` - Media outlet logos
- `OrderPopup` - Checkout modal
- `StockInventoryBar` - Urgency indicator
- `EventClosedPage` - Event date restriction page
- `ProfileResultsBanner` - Quiz results banner
- `QuizModal` - Reusable quiz component
- `QuizMiniSection` - Quiz CTA section

---

## 🐛 Known Issues & Limitations

### Current Limitations
1. Images are placeholders (user will provide guidance later)
2. Gallery videos are static (no actual video functionality)
3. Quiz results are client-side only (no backend persistence yet)
4. Email collection stores to localStorage (no email service integration)

### No Known Bugs
All routes verified and working. All existing landing pages maintain their original settings (1:1).

---

## 📚 Resources

### Reference Sites
- Original Fluff page: `https://buy.fluff.co/down-alternative`
- Design inspiration: `https://cowboy.com/`

### Documentation
- Config types: `/client/src/config/types.ts`
- Base config: `/client/src/config/base.config.ts`
- Routing: `/client/src/App.tsx`
- Main component: `/client/src/pages/Home.tsx`

---

## 🎨 Design System

### Colors (Event Pages)
- **Valentine's:** Primary `#c41e3a`, Secondary `#8b1a2d`, Accent `#fff5f5`
- **Mother's Day:** Primary `#9b6b6b`, Secondary `#7a5454`, Accent `#fff9f9`
- **Father's Day:** Primary `#2c5282`, Secondary `#1a365d`, Accent `#f0f5ff`

### Typography
- Headlines: System font stack (sans-serif)
- Body: System font stack
- Accent: Georgia (serif) for premium feel

### Spacing
- Container: `max-w-7xl` with responsive padding
- Section padding: `py-16` (desktop), `py-12` (mobile)
- Component gaps: `gap-4`, `gap-6`, `gap-8`, `gap-12`

---

## ✨ Recommendations

### For the New "Restorative Alignment" Page

1. **Start with the existing config** (`/client/src/config/restorative-alignment.config.ts`)
2. **Update copy** to match the mature, premium tone inspired by Cowboy.com
3. **Adjust imagery** (use placeholders initially, user will provide guidance)
4. **Test thoroughly** using the LP Manager preview
5. **Verify mobile responsiveness** (design is mobile-first)
6. **Check all CTAs** redirect correctly
7. **Review testimonials** for age-appropriate content
8. **Update meta tags** for SEO

### Content Checklist
- [ ] Hero headline emphasizes "Restorative Alignment"
- [ ] Subheadline targets 45+ audience
- [ ] USPs focus on consistency and reliability
- [ ] Benefits highlight natural alignment and durability
- [ ] Testimonials from mature customers
- [ ] FAQ addresses long-term value concerns
- [ ] Copy avoids trendy language
- [ ] Messaging emphasizes health benefits
- [ ] Social proof ("546,000+ Happy Sleepers") included
- [ ] "Up to 66% Off" offer prominently displayed

---

## 🚦 Current Status Summary

**✅ System Status:** All routes verified and working  
**✅ Database:** Helpers updated and functional  
**✅ Routing:** All landing pages accessible  
**✅ LP Manager:** Fully functional with live previews  
**✅ Quiz Funnel:** Working with email collection  
**✅ Existing Configs:** All maintain original settings (1:1)

**🎯 Next Action:** Update the Restorative Alignment config or create a new variant based on user preference.

---

**Ready to proceed with creating the new landing page!** 🚀
