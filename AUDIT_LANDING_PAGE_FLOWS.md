# Landing Page Creation Flow Audit
## Comprehensive Analysis: Valentine vs Black Friday Discrepancies

**Date**: January 25, 2026  
**Purpose**: Identify all discrepancies between Valentine (baseline) and Black Friday pages, trace root causes, and document standardized creation process

---

## Executive Summary

**Critical Finding**: Black Friday config file is a **direct copy-paste of Valentine config** with minimal changes. This explains ALL discrepancies:

1. **Gallery images**: Lines 88-100 still reference Valentine images (`/images/optimized/events/valentine-hero-pillow.png`, `/images/optimized/events/valentine-unboxing.png`)
2. **Event headline**: Line 71 says "Black Friday Sale" but gallery comments (lines 88, 90, 101) still say "Valentine's Day"
3. **Content calibration**: Lines 138-238 are **identical** to Valentine, including gift-focused messaging inappropriate for Black Friday
4. **Overlay text**: Lines 102-127 still use Valentine's "Gift of Rest", "Shared Comfort" pills text
5. **Section titles**: Lines 170-188 still say "Generic Gifts Miss the Mark" (gift-focused, not sale-focused)

**Root Cause**: Black Friday page was created by copying Valentine config without proper customization for the Black Friday context.

---

## Landing Page Creation Flows

### Flow 1: Config-Based (Primary)
**Location**: `client/src/config/*.ts`

**Process**:
1. Create new config file (e.g., `black-friday.config.ts`)
2. Import `baseConfig` from `base.config.ts`
3. Override specific sections for event customization
4. Register in `client/src/config/index.ts` → `landingPageConfigs` array
5. Home.tsx reads config via `useLandingPageConfig()` hook

**Key Files**:
- `client/src/config/types.ts` - TypeScript interfaces
- `client/src/config/base.config.ts` - Default values
- `client/src/config/[event].config.ts` - Event-specific overrides
- `client/src/config/index.ts` - Config registry

### Flow 2: Database-Driven (Secondary)
**Location**: `drizzle/schema.ts` → `landing_page_settings` table

**Process**:
1. LP Manager creates database record for page
2. Stores: `pageId`, `colorScheme`, `ctaButtonId`, `marketingAngleId`, `eventEndDate`
3. Home.tsx fetches via `trpc.landingPages.getSettings.useQuery()`
4. Database settings **override** config values

**Key Fields**:
- `colorScheme` - Slug referencing `color_schemes` table
- `ctaButtonId` - Foreign key to `cta_buttons` table
- `marketingAngleId` - Foreign key to `marketing_angles` table
- `eventEndDate` - Determines if event is active

### Flow 3: Content Generation (AI-Assisted)
**Location**: `server/contentGeneration.ts`

**Process**:
1. Admin triggers "Generate Content" or "Auto-Fix"
2. Backend calls LLM with page context
3. Generates: headlines, descriptions, USPs, testimonials
4. Saves to database or config file

**Functions**:
- `generateEventPageContent()` - Creates full page content
- `autoFixMissingElements()` - Fills gaps in existing pages

### Flow 4: Validation/Compliance
**Location**: `server/validation.ts`

**Process**:
1. LP Manager "Compliance" tab triggers validation
2. Backend checks: color scheme, CTA buttons, marketing angles, event dates
3. Returns recommendations for missing elements
4. Admin can trigger "Auto-Fix" to resolve issues

**Validation Rules**:
- Event pages MUST have `colorScheme` set
- Event pages MUST have `eventEndDate` set
- All pages SHOULD have CTA button assigned

---

## Detailed Discrepancy Analysis

### 1. Gallery Images Not Implemented

**Valentine (Correct)**:
```typescript
// Line 92-93
{ src: '/images/optimized/events/valentine-hero-pillow.png', alt: 'FluffCo Pillow - Valentine\'s Day', type: 'image' },
{ src: '/images/optimized/events/valentine-unboxing.png', alt: 'Gift of Better Sleep', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 tips' }] },
```

**Black Friday (Incorrect - Same as Valentine)**:
```typescript
// Line 93-94
{ src: '/images/optimized/events/valentine-hero-pillow.png', alt: 'FluffCo Pillow - Valentine\'s Day', type: 'image' },
{ src: '/images/optimized/events/valentine-unboxing.png', alt: 'Gift of Better Sleep', type: 'image', badges: [{ type: 'text', position: 'bottom-left', content: '3 tips' }] },
```

**Root Cause**: Direct copy-paste without updating image paths.

**Fix Required**: 
- Create Black Friday-specific images: `/images/optimized/events/black-friday-hero-pillow.png`, `/images/optimized/events/black-friday-unboxing.png`
- Update lines 93-94 in `black-friday.config.ts`

---

### 2. Headline Text on Gallery Image 1 Missing

**Valentine (Correct)**:
```typescript
// Line 70
eventHeadline: 'Better Than Flowers.\nSofter Than Roses.',
```

**Black Friday (Present but Different)**:
```typescript
// Line 71
eventHeadline: 'Black Friday Sale.\nPremium Comfort.\nUnbeatable Prices.',
```

**Analysis**: Black Friday DOES have `eventHeadline` defined. If it's not showing on the page, the issue is in Home.tsx rendering logic, not the config.

**Root Cause**: Need to check Home.tsx to see if `eventHeadline` is being rendered on gallery image 1.

---

### 3. Title and Description Not Properly Calibrated

**Valentine (Correct)**:
```typescript
// Line 68-69
headline: 'The Pillow That Holds Its Shape. Night After Night.',
subheadline: 'A gift they\'ll enjoy every night, not just once. Give the thoughtful luxury of hotel-quality sleep this Valentine\'s Day, beautifully packaged and ready to unwrap.',
```

**Black Friday (Generic)**:
```typescript
// Line 69-70
headline: 'The Pillow That Holds Its Shape. Night After Night.',
subheadline: 'Limited time Black Friday pricing on hotel-quality pillows. Save big on premium comfort that lasts.',
```

**Analysis**: 
- Headline is identical (correct - maintains brand consistency)
- Subheadline is Black Friday-specific but lacks the emotional depth and specificity of Valentine's version
- Valentine: "A gift they'll enjoy every night, not just once" (benefit-focused, emotional)
- Black Friday: "Save big on premium comfort that lasts" (discount-focused, generic)

**Root Cause**: Insufficient brief/calibration during Black Friday page creation.

---

### 4. Colorful One-Line Sentence Under Description Missing

**FOUND**: This is the `heroEmphasis` field from the `angleModifiers` object in Home.tsx (lines 628-658).

**How it works**:
1. Home.tsx has hardcoded angle modifiers for different marketing angles
2. When an event page has a marketing angle assigned (e.g., "gift-focused"), it shows the corresponding `heroEmphasis` text
3. Valentine page uses "gift-focused" angle → shows "The perfect gift that shows you care about their comfort and well-being."
4. This text is styled with the event's primary color (line 2568)

**Valentine (Correct)**:
- Has marketing angle assigned in database (likely "gift-focused")
- Shows: "The perfect gift that shows you care about their comfort and well-being."
- Styled in red/pink color matching Valentine theme

**Black Friday (Missing)**:
- Likely has NO marketing angle assigned in database
- OR has a different angle that doesn't have `heroEmphasis` defined
- Result: No colorful sentence appears

**Root Cause**: Black Friday page doesn't have a marketing angle assigned in the database, OR the assigned angle doesn't have a `heroEmphasis` defined in the hardcoded `angleModifiers` object.

---

### 5. Color Scheme Not Applied Consistently

**Valentine**:
```typescript
// Lines 27-28
primaryColor: '#c41e3a', // Deep romantic red
accentColor: '#1a1a1a',
```

**Black Friday**:
```typescript
// Lines 29-30
primaryColor: '#000000', // Black
accentColor: '#FFD700',  // Gold
```

**Analysis**: Both configs define colors. If Black Friday colors aren't applying consistently, the issue is in:
1. Home.tsx color application logic
2. Database `colorScheme` field overriding config colors
3. CSS variable injection

**Root Cause**: Need to trace how `primaryColor` and `accentColor` from config are applied to page sections in Home.tsx.

---

### 6. Additional Discrepancies Found

#### 6.1 Benefits Section - Inappropriate Gift Messaging
**Black Friday (Incorrect)**:
```typescript
// Line 141
sectionSubtitle: 'Fighting with overheating or a sore neck and tight shoulders? Give the gift of being coolly cradled and finding the \'Sweet Spot\' every night.',
```

**Issue**: "Give the gift" is Valentine-specific, not appropriate for Black Friday sale messaging.

#### 6.2 The Difference Section - Gift-Focused Instead of Sale-Focused
**Black Friday (Incorrect)**:
```typescript
// Lines 172-187
standardPillowTitle: 'Generic Gifts Miss the Mark',
standardPillowPoints: [
  'Flowers wilt within days',
  'Chocolates are forgotten by morning',
  'Gift cards feel impersonal',
  'Novelty items collect dust',
  'One-time experiences fade',
],
fluffcoPillowTitle: 'A FluffCo Pillow Says "I Care',
```

**Issue**: Entire section is about gift-giving, not Black Friday sale value proposition.

#### 6.3 Sleep Experts Section - Gift Testimonials
**Black Friday (Incorrect)**:
```typescript
// Lines 191-199
sectionTitle: 'The Gift Everyone Raves About',
sectionSubtitle: 'Thoughtful. Practical. Unforgettable.',
cards: [
  { image: '/images/expert-couple.png', title: 'Perfect for Couples', expandedContent: ['Share the gift of better sleep', ...] },
  { image: '/images/expert-gift.png', title: 'Gift-Ready Presentation', ...},
```

**Issue**: Entire section is gift-focused, not sale-focused.

#### 6.4 Features Grid Section - Gift Messaging
**Black Friday (Incorrect)**:
```typescript
// Line 221
sectionTitle: 'A Gift Built to Last',
```

**Issue**: Should be "Premium Quality That Lasts" or similar sale-focused messaging.

---

## Root Cause Summary

**Primary Issue**: Black Friday config was created by **copying Valentine config** without systematic customization.

**Breakdown Points**:
1. **No standardized event page creation checklist** - No verification that all Valentine-specific content was replaced
2. **No content calibration process** - Black Friday brief didn't specify replacing gift-focused messaging
3. **No validation/compliance check** - System didn't flag inappropriate content for Black Friday context
4. **No visual QA process** - Gallery images still showing Valentine content wasn't caught

---

## Standardized Event Page Creation Process

### Phase 1: Planning & Brief
- [ ] Define event theme, target audience, key messaging
- [ ] Identify which sections need custom content vs. can use base config
- [ ] Specify custom images needed (hero, unboxing, etc.)
- [ ] Define color scheme (primary, secondary, accent, etc.)
- [ ] Write event-specific headlines, subheadlines, CTAs

### Phase 2: Config File Creation
- [ ] Copy base.config.ts (NOT another event config)
- [ ] Update metadata (id, name, slug, seo)
- [ ] Set theme and colors
- [ ] Customize announcement bar
- [ ] Update hero section (headline, subheadline, eventHeadline, USPs)
- [ ] Define gallery images (create custom images first)
- [ ] Customize slotOverrides (pills text for tips, layers, care)
- [ ] Update benefits section (remove gift-specific language if not gift event)
- [ ] Customize "The Difference" section for event context
- [ ] Update sleep experts section title and cards
- [ ] Customize technology, fluffco-secret, features-grid sections
- [ ] Review testimonials for event relevance

### Phase 3: Database Setup
- [ ] Create landing_page_settings record in database
- [ ] Assign color scheme from Color Schemes Manager
- [ ] Assign CTA button from CTA Buttons Manager
- [ ] Assign marketing angle (optional)
- [ ] Set event end date

### Phase 4: Content Generation (If Using AI)
- [ ] Trigger content generation with event-specific prompt
- [ ] Review generated content for brand consistency
- [ ] Manually adjust any generic or inappropriate content

### Phase 5: Validation & QA
- [ ] Run compliance check in LP Manager
- [ ] Verify all images load correctly
- [ ] Check eventHeadline displays on gallery image 1
- [ ] Verify color scheme applies to all sections
- [ ] Test on mobile and desktop
- [ ] Review all copy for event appropriateness
- [ ] Check CTA buttons use correct text

### Phase 6: Launch
- [ ] Register config in index.ts
- [ ] Deploy to production
- [ ] Monitor analytics
- [ ] Collect user feedback

---

## Recommended Fixes for Black Friday Page

### Immediate (Critical)
1. **Replace gallery images** - Create Black Friday-specific hero and unboxing images
2. **Update all gift-focused copy** - Replace "gift", "thoughtful", "romantic" with "save", "deal", "limited time"
3. **Verify color scheme application** - Ensure black/gold colors apply to all sections

### Short-term (Important)
4. **Recalibrate title/description** - Add emotional depth and specificity to Black Friday messaging
5. **Update section titles** - "The Difference" should compare cheap pillows vs. premium, not gifts
6. **Customize pills text** - Replace Valentine-specific overlay text with Black Friday angle

### Long-term (Systematic)
7. **Create event page creation checklist** - Standardize process to prevent copy-paste errors
8. **Build content validation system** - Flag inappropriate keywords for event type
9. **Implement visual QA workflow** - Automated screenshot comparison between events
10. **Document event page best practices** - Create internal guide for future event pages

---

## Next Steps

1. Fix Black Friday config file (replace all Valentine-specific content)
2. Create Black Friday-specific images
3. Test Black Friday page to verify all fixes
4. Compare Mother's Day and Father's Day pages for similar issues
5. Create standardized event page creation template
6. Document findings and recommendations for team

---

**End of Audit**
