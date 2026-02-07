# Content Override Hierarchy Audit

## Problem Statement
When updating content on the "legacy" page (e.g., changing "30 Night Trial" to "100 Night Better Sleep"), changes made at one layer get overwritten by content defined at other layers.

## Content Layers (Priority Order - Highest to Lowest)

### Layer 1: Config Files (HIGHEST PRIORITY - OVERRIDES EVERYTHING)
Location: `client/src/config/*.config.ts`

These files contain hardcoded strings that override all other sources:
- `base.config.ts` - Default/legacy page config
- `valentine-gift.config.ts`, `mothers-day.config.ts`, etc. - Event configs
- `hotel-quality.config.ts`, `neck-pain-relief.config.ts`, etc. - Angle configs

**Found 30-Night/30-Day references in configs:**
1. `base.config.ts:254` - trustBadges: ['30-Day Guarantee', ...]
2. `base.config.ts:273` - FAQ answer: "30-night trial period"
3. `black-friday.config.ts:266` - FAQ answer: "30-night trial"
4. `down-alternative.config.ts:115` - FAQ answer: "30-night trial period"
5. `fathers-day.config.ts:269` - trustBadges: ['30-Night Trial', ...]
6. `fathers-day.config.ts:282` - FAQ answer: "30-night trial"
7. `hotel-quality.config.ts:25` - description: "30-night trial"
8. `hotel-quality.config.ts:92` - features: "30-Night Trial"
9. `hotel-quality.config.ts:116` - comparison: "No trial period"
10. `hotel-quality.config.ts:124` - comparison: "30-night risk-free trial"
11. `mothers-day.config.ts:268` - trustBadges: ['30-Day Guarantee', ...]
12. `mothers-day.config.ts:284` - FAQ answer: "30-night trial"
13. `neck-pain-relief.config.ts:19` - description: "30-night trial"
14. `neck-pain-relief.config.ts:84` - text: "30-Night Risk-Free Trial"
15. `restorative-alignment.config.ts:19` - description: "30-night trial"
16. `side-sleeper.config.ts:21` - description: "30-night trial"
17. `valentine-gift.config.ts:268` - trustBadges: ['30-Day Guarantee', ...]
18. `valentine-gift.config.ts:284` - FAQ answer: "30-day Good Sleep Guarantee"

### Layer 2: Home.tsx Hardcoded Values
Location: `client/src/pages/Home.tsx`

Inline strings that may override component defaults:
- Event features arrays (lines 708, 724, 740, 756)
- FAQ accordion items (line 3594)
- Trust badges (lines 3586, 5034)
- Fallback values in template literals

### Layer 3: Component Defaults (useSiteSettings)
Location: `client/src/hooks/useSiteSettings.ts`

Default values used when database has no value:
- `trial_period_text: '100 Night Better Sleep'` (UPDATED)
- `guarantee_text: '100-Night Guarantee'` (UPDATED)

### Layer 4: Database (site_settings table)
Location: Database `site_settings` table

Admin-configurable values that override component defaults.

## Root Cause
Config files (Layer 1) have the highest priority and contain hardcoded strings that bypass the centralized settings system entirely. When Home.tsx renders a page, it uses values from the config file, not from useSiteSettings.

## Solution
1. **Update ALL config files** to use 100-Night instead of 30-Night
2. **OR** Refactor configs to reference useSiteSettings for these values (requires significant architecture change)

## Immediate Fix (Recommended)
Update all config files with the new 100-Night messaging to match the component defaults.
