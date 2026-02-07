# Project TODO - FluffCo Landing Page

## Completed Tasks ✅

### Jan 31, 2026 - Final Polish
- [x] Fix trust badges gradient visibility - show/hide based on overflow and scroll position
- [x] Update Care Instructions accordion with new washing instructions text
- [x] Update Materials & Sizes accordion with CRO-optimized description
- [x] Replace testimonials heading "The Pillow Everyone's Talking About" with "+6,000 5-Star Reviews"
- [x] Update Shipping Protection price to $5 and add variant ID 50283956896038 to checkout
- [x] Speed up press logos marquee animation by 15% on mobile
- [x] Add "Instant saving: $X" line to sticky cart under price
- [x] Remove duplicate original images (keep only /images/optimized/)
- [x] Compress large PNG files (testimonials, dust-mites-zoom)
- [x] Compress side-sleeper JPG images (22MB → 1.3MB)
- [x] Improve 100-Night badge presentation - unify across desktop, tablet, mobile with better text layout
- [x] Fix upsell collapse minimized state - improve text color and transition smoothness
- [x] Add GA4 tracking (G-MV4DEJ21RH)
- [x] Add Microsoft Clarity tracking (with defer for performance)
- [x] Run Lighthouse performance test and document score (Desktop: 73, Mobile: 52)
- [x] Test page load performance improvement after image compression
- [x] Verify 100-Night badge design is unified across breakpoints (desktop/mobile/tablet)
- [x] Verify 5-star rating in hero is clickable and scrolls to reviews section
- [x] PageSpeed optimizations: lazy loading routes, deferred fonts, deferred FB pixel, DNS prefetch

### Testing Needed
- [ ] Test 5 checkout scenarios with new variant IDs
- [ ] Verify discount codes work correctly in Shopify
- [ ] Verify UTM tracking (ref=skyvane) appears in Shopify orders
- [ ] Test 4x Standard + both upsells (first pillowcase free, second charged)
- [ ] Test 4x King + both upsells (first pillowcase free, second charged)
- [ ] Test "Sold today" counter displays reasonable numbers throughout the day

## PageSpeed Optimizations Applied (Jan 31)
- Preload hero images (WebP + PNG fallback)
- DNS prefetch for GA, Clarity, Facebook
- Deferred Google Fonts loading (media="print" trick)
- Deferred Facebook Pixel (loads after page load)
- Microsoft Clarity already deferred
- Lazy loading for non-critical routes (Quiz, Admin, Demo, FramedStory)
- Code splitting with React.lazy() and Suspense


## New Tasks (Jan 31 - User Request)
- [x] Remove hover effect on stars in hero section (no effect on hover)
- [x] Unify 100-Night badge mobile to match desktop exactly (80px size, same font sizes)
- [x] Add GA4 e-commerce events with product parameters (view_item, add_to_cart, begin_checkout)
- [x] Hide "unlock 10%" popup on checkout modal close
- [x] Add image srcset for responsive images (hero-pillow, lifestyle-sleep: 400w, 800w, 1200w)
- [x] Fix broken hotel logo in "vs hotels" gallery page (marriott path corrected)


## New Tasks (Jan 31 - Shopify & Images)
- [x] Test Shopify checkout URL generation with variant IDs and promo codes (15 tests passing)
- [x] Create responsive image sizes (400w, 800w) for testimonials (6 images)
- [x] Create responsive image sizes (400w, 800w) for benefits (3 key images)
- [x] Add srcset mappings to BlurImage component for testimonials and benefits


## New Tasks (Jan 31 - Testimonials & PageSpeed)
- [x] Add location data to first 4 testimonials (Austin TX, Seattle WA, Chicago IL, Portland OR)
- [x] Create LQIP placeholders (20px) for all 8 testimonial images
- [ ] Measure PageSpeed Insights score after publish


## Bug Fix (Jan 31)
- [x] Fix Reviews button in header - should scroll to testimonials section (mapped 'reviews' to 'reviews-section')


## New Tasks (Jan 31 - Mobile Sticky Cart & Thumbnails)
- [x] Fix instant saving display on mobile sticky cart for 4x option (flex-col layout)
- [x] Create optimized thumbnail sizes for hero gallery images (64px, 128px webp)
- [x] Add thumbnail srcset mappings to Home.tsx getThumbnailSrcSet helper


## Quick Fix (Jan 31)
- [x] Rename "Popular" badge to "Most Popular" (Home.tsx + FramedStory.tsx)


## New Tasks (Jan 31 - Checkout Security Badges)
- [x] Replace checkout security badges with "SECURE SSL ENCRYPTION" (lock icon) and "GUARANTEED SAFE CHECKOUT" (shield-check icon)


## UI Test (Jan 31 - Discount Badges)
- [x] Add -XX% discount badges next to quantity selectors (1x, 2x, 4x options) - green badges showing -48%, -55%, -66%


## PageSpeed Optimizations (Jan 31 - 4.5MB savings)
- [x] Convert washing-machine.png to WebP with responsive sizes (400px, 800px) - 2.2MB → 142KB
- [x] Convert wake-refreshed.png to WebP with responsive sizes (400px, 800px) - 1.1MB → 52KB
- [x] Convert sleep-alignment.png to WebP with responsive sizes (400px, 800px) - 1MB → 44KB
- [x] Reduce marriott-logo.png from 2000px to 100px - 108KB → 2.5KB
- [x] Add srcset to gallery images in ImageCarousel (200w, 400w, 600w)


## PageSpeed LCP Optimizations (Jan 31)
- [ ] Optimize Oprah badge image from 400px to 100px (reverted - user preference)
- [x] Add fetchpriority="high" to hero LCP image (BlurImage component + index.html preload)
- [x] Remove lazy loading from hero LCP image (loading="eager" for first gallery image)
- [x] Optimize Google Fonts loading (already deferred with media="print" trick)
- [x] Update hero image preload with correct path and srcset


## Tracking & Bug Fixes (Feb 1)
- [ ] Add GA4 add_to_cart tracking to all Order Now buttons (currently only Meta is tracked)
- [ ] Fix Oprah image aspect ratio on mobile (95x95 forced on 400x400 image)
- [ ] Fix Facebook Pixel initialization timing error (fbq is not defined)


## Accessibility & Upsell Tracking (Feb 1)
- [x] Add GA4 tracking for upsell #1 and #2 selections (already implemented: trackUpsell1Add/Remove, trackUpsell2Add/Remove)
- [x] Fix button accessible names with aria-label (6 award carousel buttons)
- [x] Fix viewport meta tag to allow zooming (removed maximum-scale=1)
- [x] Add main landmark element (<main id="main-content">)
- [x] Add video captions track for deaf users (2 videos with aria-labels and track elements)


## VTT Caption Files (Feb 1)
- [x] Create VTT caption file for standard pillow video (losing shape)
- [x] Create VTT caption file for FluffCo pillow video (maintaining shape)
- [x] Update video elements to reference local VTT files


## PageSpeed Insights Optimizations (Feb 1)
- [x] Create 600px hero image variant for displayed 584px size (81KB → 13KB)
- [x] Defer gtag.js to reduce render-blocking (moved to body with load event)
- [x] Reduce LCP element render delay (added content-visibility CSS optimization)
- [x] Optimize Oprah badge from 400px to 150px (16.9KB → 4.4KB)
- [x] Create 100px variants for sleep position cards (15KB → 2KB each)
- [x] Add preconnect hints for third-party domains (GA, Clarity, FB, Plausible)


## PageSpeed Insights - Round 2 (Feb 1)
- [x] Lazy load comparison videos below the fold (LazyVideo component with IntersectionObserver)
- [x] Fix layout shift on product selector (CLS 0.006) - added min-h-[180px] and width/height attributes
- [x] DOM size (1,544 elements) - acceptable for complex PDP; depth 17 is within reasonable limits
- [ ] Note: Legacy JavaScript (20KB) is from Facebook Pixel - external script, cannot optimize


## Oprah Badge Fix (Feb 1)
- [x] Fix pixelated Oprah badge - use 400px original for desktop, 150px for tablet, 120px for mobile


## Console Error Fixes (Feb 1)
- [x] Fix ipapi.co 429 rate limit - added ipwho.is as primary API with fallback
- [x] Fix Facebook Pixel "fbq is not defined" - use window.fbq for proper scope


## Accessibility & Build Fixes (Feb 1)
- [x] Fix button accessible name at line 5889 (added aria-label="Close notification")
- [x] Enable source maps in production build (sourcemap: true in vite.config.ts)


## Image Regeneration (Feb 1)
- [x] Generate new "Lasting Shape and Comfort" image with classic simple pillow (no dark corners)
- [x] Optimize to WebP and create responsive sizes (400px, 800px, 1200px)
- [x] Update code references to use new image with srcset
- [x] Delete original PNG and old sanforizing images (~433KB saved)


## Checkout UX Improvement (Feb 1)
- [x] Move Shipping Protection above order summary as standalone section
- [x] Make it more prominent and visually distinct (blue theme, shield icon, tags)
- [x] Keep it always pre-checked (default state unchanged)


## Design Unification & Image Optimization (Feb 1)
- [x] Unify Shipping Protection border/radius with product section (bg-secondary/50 rounded-xl)
- [x] Remove background color when selected (now uses same bg as Order Total)
- [x] Optimize hero image for 721px display (added 720w variant, 19KB)
- [x] Optimize Oprah badge for 170px display (added 170w variant, 5KB)


## Expert Recommendation Image (Feb 1)
- [x] Generate pillow image on feather background with white FluffCo label
- [x] No text on image - clean background for text overlays
- [x] Add to gallery as slide 1 in "The Pillow Sleep Experts Recommend" section
- [x] Create HTML text overlays with magnifying glass/loupe effect on pillow corner
- [x] Make texts customizable for different languages (ExpertPillowSlide component with props)


## Gallery Slide 2 - Pillow Benefits (Feb 1)
- [x] Generate hand-pressing-pillow image with Black woman's hand, simple pillow (no dark border)
- [x] Optimize image to WebP with responsive sizes (400, 800, 1200px)
- [x] Create PillowBenefitsSlide component with 3 animated cards (like main gallery)
- [x] Cards: 1) Elevate Your Sleep Game, 2) Customized Support, 3) Wake Up Rejuvenated
- [x] Replace gallery-2 in Sleep Experts section
- [x] Create thumbnail version for carousel (PillowBenefitsThumbnail)


## ExpertPillowSlide Fixes (Feb 1)
- [x] Remove FluffCo label overlay (kept original image, removed label from component)
- [x] Reposition circle to 64% vertical (centered on pillow corner)
- [x] Adjust text label positions around the circle
- [x] Create thumbnail version for carousel (100px WebP)
- [x] Images already optimized in WebP with responsive sizes
- [x] Delete PillowBenefitsSlide and hand-pressing images
