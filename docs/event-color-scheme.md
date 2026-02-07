# Event Color Scheme Documentation

This document defines the color scheme conventions for all event landing pages.

## Color Scheme Structure

Each event has 5 color values:

| Property | Usage | Examples |
|----------|-------|----------|
| `primary` | Main brand color for the event | Valentine red, Father's Day navy |
| `secondary` | Dark background color | Announcement bar, Premium Quality section |
| `accent` | Light background color | Pricing section, light alternating sections |
| `accentDark` | Slightly darker light color | Press logos bar, gradient endpoints |
| `background` | Page background tint | Subtle overall page tint |
| `textOnLight` | Text color for light backgrounds | For readability on accent backgrounds |

## Section Color Assignments

| Section | Color Property | Notes |
|---------|---------------|-------|
| Announcement Bar | `secondary` | Dark, high contrast with white text |
| Press Logos Bar | `accentDark` | Light, with gradient fade to match |
| Event Gift Section | `accent` | Light background |
| Premium Quality Section | `secondary` | Dark, matches announcement bar |
| Pricing Section | `accent` to `accentDark` gradient | Light background for readability |
| Feature Pills | `primary` | Event brand color |
| Checkmarks/Icons | `primary` | Event brand color |
| Selected Size/Quantity | `primary` border | Event brand color |

## CTA Button Styling Rules

### Unified Hover Effects (All Pages)

**Primary CTA Buttons (Filled)**:
- Default: `box-shadow: 0 2px 8px {primary}40`
- Hover: `box-shadow: 0 4px 20px {primary}70`, `filter: brightness(0.95)`, `transform: translateY(-1px)`
- Active: `transform: translateY(0)`

**Secondary CTA Buttons (Outline)**:
- Default: `background: transparent`, `border: 2px solid {primary}`, `color: {primary}`
- Hover: `background: {primary}`, `color: white`, `box-shadow: 0 4px 16px {primary}50`, `transform: translateY(-1px)`
- Active: `transform: translateY(0)`

### CSS Classes Available (index.css)

- `.cta-event-primary` - Filled button with glow, uses `--event-primary` CSS variable
- `.cta-event-outline` - Outline button that fills on hover, uses `--event-primary` CSS variable

---

### Pricing Section CTAs
| Option | Background | Border | Text |
|--------|------------|--------|------|
| 4 Pillows (Best Value) | `primary` solid | none | White |
| 1 & 2 Pillows | Transparent | 2px `primary` | `primary` |

### Pricing Card Borders
| Option | Border Color |
|--------|-------------|
| 4 Pillows (Best Value) | `primary` (not black) |
| 1 & 2 Pillows | Default border |

### Hero Section Selectors (Size/Quantity)
| State | Background | Border |
|-------|------------|--------|
| Unselected | Transparent | `primary` at 40% opacity |
| Selected | `primary` at 15% opacity | `primary` solid |

## Current Event Color Schemes

### Valentine's Day
```javascript
{
  primary: '#e63946',      // Valentine red
  secondary: '#3d0c11',    // Dark burgundy
  accent: '#ffe8e8',       // Light pink
  accentDark: '#ffd4d4',   // Slightly darker pink
  background: '#fffafa',   // Very light pink tint
  textOnLight: '#7a5454'   // Dark mauve for text
}
```

### Mother's Day
```javascript
{
  primary: '#9d6b7d',      // Mauve/dusty rose (darker for readability)
  secondary: '#4a2c3d',    // Dark plum
  accent: '#fdf2f5',       // Very light pink
  accentDark: '#f5e1e7',   // Light rose
  background: '#fffafa',   // Very light pink tint
  textOnLight: '#7a5454'   // Dark mauve for text
}
```

### Father's Day
```javascript
{
  primary: '#2c5282',      // Deep navy blue
  secondary: '#1a365d',    // Darker navy (announcement bar, Premium Quality)
  accent: '#f0f5ff',       // Very light blue (pricing section)
  accentDark: '#e2e8f0',   // Light slate (press bar)
  background: '#f8fafc'    // Lightest background
}
```

## Adding New Events

When creating a new event:

1. Choose a `primary` color that represents the event theme
2. Create a `secondary` that is significantly darker (for dark sections)
3. Create an `accent` that is very light (for light sections)
4. Create an `accentDark` slightly darker than accent (for gradients)
5. Set `background` to a very subtle tint
6. Add `textOnLight` if the primary color is too light for text

## Dynamic Color Application

All event colors are applied dynamically via:
- Inline styles using `eventColors.property`
- CSS variables set in `eventCssVars`

Never hardcode event-specific colors directly in components. Always reference `eventColors` for consistency.
