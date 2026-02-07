# Performance Testing Guide
**Project**: Restorative Alignment Pillow (FluffCo)  
**Focus**: Urgency Section Animations & Low-End Device Compatibility

---

## Overview

The Black Friday urgency section includes complex animations:
- **SVG world map** with 6 continent paths (North America, South America, Europe, Africa, Asia, Australia)
- **3 pulsing warehouse hubs** with CSS animations
- **Animated order flow arrows** (10 concurrent animations, staggered intervals)
- **Live orders counter** updating every 4-20 seconds
- **Smooth expand/collapse** animation (quiz results-style)
- **Auto-collapse timer** (5 seconds after mount)

These animations must perform smoothly on low-end devices to avoid degrading user experience.

---

## Test Devices & Browsers

### Desktop (Baseline)
- **Modern Desktop**: MacBook Pro M1, Chrome 120+ → Expected: 60fps, no jank
- **Older Desktop**: Intel i5 (2015), Firefox 115+ → Expected: 45-60fps, minimal jank

### Mobile (Critical)
- **High-end**: iPhone 14 Pro, Safari 17 → Expected: 60fps
- **Mid-range**: Samsung Galaxy A53, Chrome Android → Expected: 45-60fps
- **Low-end**: iPhone SE (2020), Safari 16 → Expected: 30-45fps, acceptable jank
- **Budget Android**: Moto G Power (2021), Chrome Android → Expected: 30fps minimum

---

## Performance Metrics

### Key Indicators
1. **Frame Rate (FPS)**
   - Target: 60fps (smooth)
   - Acceptable: 45fps (minor jank)
   - Poor: <30fps (noticeable lag)

2. **Paint Time**
   - Target: <16ms per frame (60fps)
   - Acceptable: <22ms per frame (45fps)
   - Poor: >33ms per frame (<30fps)

3. **Memory Usage**
   - Target: <50MB for urgency section
   - Acceptable: <100MB
   - Poor: >150MB (risk of crashes on low-end devices)

4. **CPU Usage**
   - Target: <20% on mobile
   - Acceptable: <40%
   - Poor: >60% (drains battery, causes thermal throttling)

---

## Testing Procedures

### 1. Chrome DevTools Performance Profiling

```bash
# Open Black Friday page
https://get.fluff.co/black-friday

# Open Chrome DevTools (F12) → Performance tab
# Start recording
# Wait 10 seconds (observe animations)
# Stop recording

# Analyze:
# - Main thread activity (should have idle gaps)
# - Frame rate (should be green, not red)
# - Paint events (should be <16ms)
# - Memory timeline (should be stable, not growing)
```

**What to look for:**
- ✅ Green bars in FPS chart (60fps)
- ✅ Idle time between frames (not constantly busy)
- ✅ No long tasks (>50ms) blocking main thread
- ❌ Red bars in FPS chart (<30fps)
- ❌ Yellow bars (30-60fps) indicate jank
- ❌ Memory growing continuously (memory leak)

### 2. Lighthouse Performance Audit

```bash
# Open Chrome DevTools → Lighthouse tab
# Select "Performance" category
# Choose "Mobile" device
# Run audit

# Target scores:
# - Performance: >90 (excellent)
# - First Contentful Paint: <1.8s
# - Largest Contentful Paint: <2.5s
# - Total Blocking Time: <200ms
# - Cumulative Layout Shift: <0.1
```

### 3. Mobile Device Testing (Real Devices)

**Test on iPhone SE (2020) - Low-end iOS:**
1. Open Black Friday page in Safari
2. Observe urgency section expand animation
3. Wait 5 seconds for auto-collapse
4. Manually expand again
5. Scroll page while animations run
6. Check for:
   - Smooth expand/collapse (no stuttering)
   - Order counter updates without lag
   - SVG world map renders correctly
   - No page freezing or crashes

**Test on Moto G Power (2021) - Budget Android:**
1. Open Black Friday page in Chrome
2. Repeat same steps as iPhone test
3. Additional checks:
   - Battery drain rate (should not spike)
   - Device temperature (should not overheat)
   - Page responsiveness (touch interactions)

### 4. Network Throttling Test

```bash
# Chrome DevTools → Network tab
# Throttle: "Slow 3G" or "Fast 3G"
# Reload page

# Verify:
# - SVG world map loads quickly (inline SVG, no network request)
# - Animations start smoothly even on slow connection
# - No layout shift when images load
```

---

## Optimization Techniques (Already Implemented)

### 1. CSS Animations (Hardware Accelerated)
```css
/* Pulsing hub points use transform (GPU-accelerated) */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 0.4; }
}
```

### 2. Conditional Rendering (Mobile Performance)
```tsx
{/* World map hidden on mobile collapsed state for performance */}
{!(isMobile && !isExpanded) && (
  <WorldMapOverlay />
)}
```

### 3. Debounced State Updates
```tsx
// Order counter updates at random 4-20 second intervals (not every frame)
const randomInterval = 4000 + Math.random() * 16000;
setTimeout(() => setLiveOrders(prev => prev + 1), randomInterval);
```

### 4. Responsive Planet Sizing
```tsx
// Smaller planet on mobile = fewer pixels to render
const planetSize = isMobile ? (isExpanded ? 40 : 16) : (isExpanded ? 56 : 24);
```

---

## Performance Benchmarks (Expected)

| Device | FPS | Paint Time | Memory | CPU | Status |
|--------|-----|------------|--------|-----|--------|
| MacBook Pro M1 | 60fps | 8-12ms | 35MB | 10% | ✅ Excellent |
| iPhone 14 Pro | 60fps | 10-14ms | 42MB | 15% | ✅ Excellent |
| Samsung Galaxy A53 | 50-60fps | 14-18ms | 55MB | 25% | ✅ Good |
| iPhone SE (2020) | 40-50fps | 18-24ms | 68MB | 35% | ⚠️ Acceptable |
| Moto G Power (2021) | 35-45fps | 22-30ms | 82MB | 45% | ⚠️ Acceptable |

---

## Known Issues & Mitigations

### Issue 1: Order Flow Arrows Cause Jank on Low-End Devices
**Symptoms**: Frame drops when 10 arrows animate simultaneously  
**Mitigation**: Reduce concurrent arrows to 5 on mobile devices  
**Implementation**: Add device detection in `BlackFridayUrgencySection.tsx`

### Issue 2: SVG World Map Rendering Lag on Budget Android
**Symptoms**: Initial render takes 200-300ms on Moto G Power  
**Mitigation**: Simplify SVG paths (reduce points) or use static image on low-end devices  
**Implementation**: Detect device performance and conditionally render simplified map

### Issue 3: Auto-Collapse Animation Stutters on Slow Devices
**Symptoms**: Collapse animation not smooth (30fps instead of 60fps)  
**Mitigation**: Use `will-change: transform` CSS property to hint browser for optimization  
**Implementation**: Add to `.urgency-section` class in Tailwind

---

## Continuous Monitoring

### Production Metrics (Recommended)
1. **Real User Monitoring (RUM)** - Track actual user performance
   - Tools: Google Analytics 4 (Core Web Vitals), Vercel Analytics
   - Metrics: LCP, FID, CLS, TTFB

2. **Error Tracking** - Catch animation failures
   - Tools: Sentry, LogRocket
   - Track: JavaScript errors in urgency section component

3. **Performance Budget** - Set thresholds
   - Max bundle size: 500KB (gzipped)
   - Max JavaScript execution: 2s
   - Max memory: 150MB

---

## Testing Checklist

Before deploying urgency section updates:

- [ ] Run Chrome DevTools Performance profiling (desktop)
- [ ] Run Lighthouse audit (mobile simulation)
- [ ] Test on real iPhone SE (2020) device
- [ ] Test on real budget Android device
- [ ] Verify animations at 3G network speed
- [ ] Check memory usage doesn't grow over time
- [ ] Confirm error boundary catches animation failures
- [ ] Validate auto-collapse timer works on all devices
- [ ] Test expand/collapse animation smoothness
- [ ] Verify SVG world map renders correctly

---

## Conclusion

The urgency section is optimized for performance with hardware-accelerated CSS animations, conditional rendering, and responsive sizing. Regular testing on low-end devices ensures a smooth experience for all users. The error boundary provides graceful degradation if animations fail.

**Next Steps:**
1. Implement Real User Monitoring to track production performance
2. Add device detection to reduce animation complexity on low-end devices
3. Consider A/B testing simplified urgency section for budget devices
