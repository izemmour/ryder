# Gallery Customization Analysis

## Summary of All Landing Page Configs

### 1. base.config.ts ✅ COMPLIANT
- Uses standard gallery images
- No custom images
- Standard overlays and thumbnails

### 2. down-alternative.config.ts ✅ COMPLIANT
- Uses standard gallery images
- No custom images
- Standard overlays and thumbnails

### 3. fathers-day.config.ts ✅ COMPLIANT (after fix)
- Uses standard gallery images
- Has `slotOverrides` for customized pill text
- Standard structure with text-only customizations

### 4. hotel-quality.config.ts ✅ COMPLIANT
- Uses standard gallery images
- No custom images
- Standard overlays and thumbnails

### 5. mothers-day.config.ts ✅ COMPLIANT (after fix)
- Uses standard gallery images
- Has `slotOverrides` for customized pill text
- Standard structure with text-only customizations

### 6. neck-pain-relief.config.ts ⚠️ NEEDS CHECK
- No gallery section found in grep output
- May be using defaults or has different structure

### 7. restorative-alignment.config.ts ⚠️ NEEDS CHECK
- No gallery section found in grep output
- May be using defaults or has different structure

### 8. side-sleeper.config.ts ⚠️ NEEDS CHECK
- No gallery section found in grep output
- May be using defaults or has different structure

### 9. valentine-gift.config.ts ❌ NON-COMPLIANT
- Uses CUSTOM images:
  - `/images/valentine-hero-pillow.png` (custom hero)
  - `/images/valentine-unboxing.png` (custom unboxing)
  - `/images/valentine-couple-bed.png` (custom couple image)
  - `/images/valentine-gift-card.png` (custom gift card)
- Only 6 images instead of 7 (missing summary/hotel-comfort)
- Different badge text ("Gift Ready", "Shared Comfort", "Personal Touch")
- **DECISION NEEDED**: Keep as custom component OR adapt to standard system

## Action Items

1. **neck-pain-relief.config.ts** - Read full file to check gallery structure
2. **restorative-alignment.config.ts** - Read full file to check gallery structure
3. **side-sleeper.config.ts** - Read full file to check gallery structure
4. **valentine-gift.config.ts** - Decide: adapt to standard OR create custom component

## Standard Gallery Structure (7 images)

| Slot | Image | Thumbnail Tag | Purpose |
|------|-------|---------------|---------|
| 1 | hero-pillow.png | (none) | Intro/Hero |
| 2 | lifestyle-sleep.png | "3 tips" | Tips |
| 3 | engineering-detail-new.png | "3 layers" | Layers |
| 4 | comparison (component) | "VS" | VS Comparison |
| 5 | washing-machine.png | "care" | Care |
| 6 | hotel-comfort-packaging.png | "hotel" | Summary |
| 7 | hotel-comparison (component) | "5-star" | Hotel Compare |
