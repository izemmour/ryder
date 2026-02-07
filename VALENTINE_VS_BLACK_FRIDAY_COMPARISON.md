# Valentine vs Black Friday Page Comparison
## Visual and Content Audit

**Date**: January 25, 2026

---

## Summary of Discrepancies

### ✅ Elements Present on Both Pages
1. **Gallery images** - Both show same images (Valentine images on Black Friday - INCORRECT)
2. **Event headline on gallery image 1** - Valentine: "Better Than Flowers. Softer Than Roses." | Black Friday: NOT VISIBLE (should be "Black Friday Sale. Premium Comfort. Unbeatable Prices.")
3. **Main headline** - Identical on both: "The Pillow That Holds Its Shape. Night After Night."
4. **Subheadline** - Different but both present
5. **USP icons** - Both have 4 USP icons below subheadline
6. **Pricing section** - Both have identical structure

### ❌ Elements Missing on Black Friday
1. **Colorful one-line sentence** - Valentine: "The perfect gift that shows you care about their comfort and well-being." (red text) | Black Friday: MISSING
2. **Event headline overlay** - Black Friday config has it defined but NOT RENDERING on page
3. **Black Friday-specific images** - Using Valentine images instead

### ⚠️ Elements Present but Incorrect on Black Friday
1. **Gallery images** - Using Valentine images (`/images/optimized/events/valentine-hero-pillow.png`, `/images/optimized/events/valentine-unboxing.png`)
2. **"The Difference" section** - Still says "Generic Gifts Miss the Mark" (gift-focused, not sale-focused)
3. **Sleep Experts section** - Title: "The Gift Everyone Raves About" (should be sale-focused)
4. **Features Grid section** - Title: "A Gift Built to Last" (should be "Premium Quality That Lasts")
5. **FAQ questions** - Still gift-focused: "Is this a good gift for someone who already has pillows?", "Does it come in gift-ready packaging?", "Can I include a gift message?"

---

## Detailed Element-by-Element Comparison

### 1. Announcement Bar
**Valentine**: "Valentine's Day: Up to 66% Off" (red background)  
**Black Friday**: "Black Friday: Up to 66% Off Premium Pillows" (black background)  
**Status**: ✅ Correct - Black Friday has appropriate messaging and color

### 2. Navigation CTA
**Valentine**: "Gift Now →" (red button)  
**Black Friday**: "Claim Now →" (red button - should be black/gold)  
**Status**: ⚠️ Partially correct - Text is appropriate but color doesn't match Black Friday theme

### 3. Gallery Image 1 - Hero Pillow
**Valentine**: `/images/optimized/events/valentine-hero-pillow.png` (pillow with rose petals)  
**Black Friday**: `/images/optimized/events/valentine-hero-pillow.png` (SAME IMAGE - INCORRECT)  
**Status**: ❌ CRITICAL - Black Friday using Valentine image

### 4. Event Headline Overlay on Gallery Image 1
**Valentine**: "Better Than Flowers. Softer Than Roses." (white text, top right)  
**Black Friday**: NOT VISIBLE (config defines "Black Friday Sale. Premium Comfort. Unbeatable Prices." but not rendering)  
**Status**: ❌ CRITICAL - Not rendering despite being in config

**Root Cause Investigation**:
- Home.tsx line 1917: `{isEventPage && config.hero.eventHeadline && (`
- Black Friday config line 71 defines: `eventHeadline: 'Black Friday Sale.\nPremium Comfort.\nUnbeatable Prices.',`
- Need to check if `isEventPage` is true for Black Friday
- OR if `config.hero.eventHeadline` is being read correctly

### 5. Main Headline
**Valentine**: "The Pillow That Holds Its Shape. Night After Night."  
**Black Friday**: "The Pillow That Holds Its Shape. Night After Night."  
**Status**: ✅ Correct - Maintains brand consistency

### 6. Subheadline
**Valentine**: "A gift they'll enjoy every night, not just once. Give the thoughtful luxury of hotel-quality sleep this Valentine's Day, beautifully packaged and ready to unwrap."  
**Black Friday**: "Limited time Black Friday pricing on hotel-quality pillows. Save big on premium comfort that lasts."  
**Status**: ✅ Correct - Black Friday has sale-focused messaging

### 7. Colorful One-Line Sentence (heroEmphasis)
**Valentine**: "The perfect gift that shows you care about their comfort and well-being." (red text, styled with primary color)  
**Black Friday**: MISSING  
**Status**: ❌ CRITICAL - Not showing

**Root Cause**:
- This text comes from `angleModifiers.heroEmphasis` in Home.tsx (line 2567-2570)
- Valentine likely has "gift-focused" marketing angle assigned in database
- Black Friday likely has NO marketing angle assigned OR wrong angle
- Need to check database `landing_page_settings` table for Black Friday's marketing angle

### 8. USP Icons
**Valentine**: Gift-Ready Packaging, Award-Winning Quality, Enjoyed Every Night, Made in USA  
**Black Friday**: Gift-Ready Packaging, Award-Winning Quality, Enjoyed Every Night, Made in USA  
**Status**: ⚠️ Partially correct - "Gift-Ready Packaging" should be "Limited Time Offer" or similar for Black Friday

### 9. Gallery Image 2 - Unboxing
**Valentine**: `/images/optimized/events/valentine-unboxing.png`  
**Black Friday**: `/images/optimized/events/valentine-unboxing.png` (SAME IMAGE - INCORRECT)  
**Status**: ❌ CRITICAL - Black Friday using Valentine image

### 10. Gallery Pills Text (Overlays on Images 2-6)
**Valentine**: "Gift of Rest", "Shared Comfort", "Lasting Quality"  
**Black Friday**: "Gift of Rest", "Shared Comfort", "Lasting Quality" (SAME - INCORRECT)  
**Status**: ❌ Should be "Save Big", "Premium Quality", "Limited Time" for Black Friday

### 11. Benefits Section Title
**Valentine**: "End Your Pillow Battle"  
**Black Friday**: "End Your Pillow Battle"  
**Status**: ✅ Correct - Generic enough for both

### 12. Benefits Section Subtitle
**Valentine**: "Fighting with overheating or a sore neck and tight shoulders? Give the gift of being coolly cradled and finding the 'Sweet Spot' every night."  
**Black Friday**: "Fighting with overheating or a sore neck and tight shoulders? Give the gift of being coolly cradled and finding the 'Sweet Spot' every night."  
**Status**: ❌ INCORRECT - "Give the gift" is Valentine-specific, should be "Experience" or "Enjoy" for Black Friday

### 13. "The Difference" Section
**Valentine**:
- Left side: "Generic Gifts Miss the Mark"
- Points: "Flowers wilt within days", "Chocolates are forgotten by morning", etc.
- Right side: "A FluffCo Pillow Says 'I Care'"
- Points: "Enjoyed every single night", "Reminds them of you each morning", etc.

**Black Friday**: IDENTICAL TO VALENTINE  
**Status**: ❌ CRITICAL - Entire section is gift-focused, should compare cheap pillows vs. premium for Black Friday

### 14. Sleep Experts Section
**Valentine**: "The Gift Everyone Raves About" | "Thoughtful. Practical. Unforgettable."  
**Black Friday**: "The Pillow Sleep Experts Recommend" | "Luxury Comfort, Zero Guilt (or Allergies!)"  
**Status**: ✅ Correct - Black Friday has different, more appropriate messaging

### 15. Features Grid Section
**Valentine**: "A Gift Built to Last"  
**Black Friday**: NOT VISIBLE IN SCREENSHOT (need to scroll to check)  
**Status**: ⚠️ Need to verify - Config likely says "A Gift Built to Last" (incorrect for Black Friday)

### 16. Pricing Section Title
**Valentine**: "A Thoughtful Valentine's Day Gift" | "Valentine's Day Pricing"  
**Black Friday**: "Choose Your Setup" | "Online-only pricing. Free shipping on all orders."  
**Status**: ✅ Correct - Black Friday has sale-focused messaging

### 17. FAQ Questions
**Valentine**:
- "Is this a good gift for someone who already has pillows?"
- "Does it come in gift-ready packaging?"
- "Can I include a gift message?"
- "Is this good for couples?"

**Black Friday**: IDENTICAL TO VALENTINE  
**Status**: ❌ CRITICAL - Gift-focused questions inappropriate for Black Friday sale

### 18. Color Scheme Application
**Valentine**: Red/pink primary color applied to:
- Announcement bar background
- CTA buttons
- Pricing highlights
- "Save X%" badges
- heroEmphasis text
- Section accents

**Black Friday**: Red/pink colors still showing (should be black/gold):
- Announcement bar: Black (✅ correct)
- CTA buttons: Red (❌ should be black or gold)
- Pricing highlights: Green (✅ correct - savings)
- "Save X%" badges: Green (✅ correct)
- heroEmphasis text: N/A (missing)
- Section accents: Need to verify

**Status**: ⚠️ Partially correct - Some elements use correct colors, others still use Valentine colors

---

## Root Cause Analysis

### Primary Issue: Direct Copy-Paste from Valentine Config
Black Friday config (`black-friday.config.ts`) was created by copying Valentine config with minimal changes. Evidence:

1. **Lines 93-94**: Gallery images still reference Valentine files
2. **Lines 102-127**: Pills text still says "Gift of Rest", "Shared Comfort"
3. **Lines 138-238**: Entire content sections identical to Valentine (gift-focused)
4. **Lines 172-187**: "The Difference" section still compares gifts, not pillows

### Secondary Issues

#### Issue 1: Event Headline Not Rendering
**Config**: Black Friday defines `eventHeadline` on line 71  
**Expected**: Should show "Black Friday Sale. Premium Comfort. Unbeatable Prices." on gallery image 1  
**Actual**: Not showing  
**Possible Causes**:
1. `isEventPage` check failing (Home.tsx line 1917)
2. Config not being read correctly
3. CSS z-index issue hiding the text
4. Conditional logic excluding Black Friday

**Investigation Needed**: Check Home.tsx `isEventPage` logic

#### Issue 2: heroEmphasis Missing
**Expected**: Should show a colorful one-line sentence below subheadline  
**Actual**: Not showing  
**Root Cause**: 
- heroEmphasis comes from `angleModifiers` object in Home.tsx (line 628-658)
- Requires a marketing angle to be assigned in database
- Black Friday likely has NO marketing angle assigned
- OR has wrong angle that doesn't have heroEmphasis defined

**Fix Required**: 
1. Check database for Black Friday's marketing angle
2. If missing, assign appropriate angle (e.g., "5-star-hotel" or create new "black-friday-sale" angle)
3. OR add Black Friday-specific heroEmphasis to angleModifiers object

#### Issue 3: Color Scheme Not Fully Applied
**Expected**: Black/gold color scheme throughout  
**Actual**: Mixed red/black colors  
**Possible Causes**:
1. Database `colorScheme` field not set for Black Friday
2. Config colors not overriding all sections
3. Some hardcoded colors in Home.tsx
4. CSS specificity issues

**Investigation Needed**: Check database `colorScheme` value for Black Friday page

---

## Recommended Fixes (Priority Order)

### Critical (Must Fix Before Launch)
1. **Replace all gallery images** with Black Friday-specific images
2. **Fix event headline rendering** - Investigate why it's not showing
3. **Assign marketing angle** to Black Friday page in database (or add Black Friday heroEmphasis)
4. **Rewrite "The Difference" section** - Compare cheap pillows vs. premium, not gifts
5. **Update FAQ questions** - Remove gift-focused questions, add sale-focused ones

### High Priority
6. **Update pills text** - Change "Gift of Rest" to "Save Big", etc.
7. **Fix benefits section subtitle** - Remove "Give the gift" language
8. **Verify color scheme** - Ensure black/gold applies to all sections
9. **Update features grid title** - Change from "A Gift Built to Last"

### Medium Priority
10. **Update USP icons** - Change "Gift-Ready Packaging" to "Limited Time Offer"
11. **Verify CTA button colors** - Should use black/gold, not red
12. **Test mobile responsiveness** - Ensure all fixes work on mobile

### Low Priority (Nice to Have)
13. **Add Black Friday-specific testimonials** - Focus on value/savings
14. **Create Black Friday-specific comparison chart** - Show savings vs. retail
15. **Add urgency elements** - "Only X hours left", "Limited stock"

---

## Systematic Process to Prevent Future Issues

### Phase 1: Planning & Brief (Before Creating Config)
- [ ] Define event theme, target audience, key messaging
- [ ] List all sections that need custom content
- [ ] Specify custom images needed (hero, unboxing, etc.)
- [ ] Define color scheme (primary, secondary, accent)
- [ ] Write event-specific headlines, subheadlines, CTAs
- [ ] Identify which marketing angle to use (or create new one)

### Phase 2: Config File Creation
- [ ] **Start from base.config.ts**, NOT another event config
- [ ] Update metadata (id, name, slug, seo)
- [ ] Set theme and colors
- [ ] Customize announcement bar
- [ ] Update hero section (headline, subheadline, eventHeadline, USPs)
- [ ] Define gallery images (create custom images FIRST)
- [ ] Customize slotOverrides (pills text for tips, layers, care)
- [ ] Update benefits section (remove event-specific language)
- [ ] Customize "The Difference" section for event context
- [ ] Update sleep experts section title and cards
- [ ] Customize technology, fluffco-secret, features-grid sections
- [ ] Review FAQ questions for event relevance
- [ ] **Checklist**: Search for "gift", "Valentine", "romantic" and replace ALL

### Phase 3: Database Setup
- [ ] Create landing_page_settings record
- [ ] Assign color scheme from Color Schemes Manager
- [ ] Assign CTA button from CTA Buttons Manager
- [ ] **Assign marketing angle** (critical for heroEmphasis)
- [ ] Set event end date

### Phase 4: Visual QA
- [ ] Check gallery images load correctly
- [ ] Verify eventHeadline displays on gallery image 1
- [ ] Verify heroEmphasis (colorful sentence) displays
- [ ] Check color scheme applies to all sections
- [ ] Test on mobile and desktop
- [ ] Review all copy for event appropriateness
- [ ] Check CTA buttons use correct text and colors

### Phase 5: Content QA
- [ ] Search page for previous event names (e.g., "Valentine")
- [ ] Verify no gift-focused language on non-gift events
- [ ] Check FAQ questions match event type
- [ ] Verify "The Difference" section is event-appropriate
- [ ] Test all CTAs lead to correct checkout

---

**End of Comparison**
