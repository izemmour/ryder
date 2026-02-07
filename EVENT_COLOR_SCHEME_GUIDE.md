# Event Color Scheme Guide

## Problem: Hardcoded Colors Overwriting Event Theme

When building event pages (Black Friday, Christmas, etc.), hardcoded colors in Tailwind classes can overwrite the dynamic event color scheme, causing inconsistent branding.

## Root Cause

Using conditional Tailwind classes like:
```tsx
className={`${isEventPage ? 'bg-white/20' : 'bg-[#e63946]'}`}
```

This hardcodes `bg-white/20` instead of using the event's `secondary` or `accent` color.

## Solution Pattern

**❌ WRONG - Hardcoded colors:**
```tsx
<button 
  className={`${isEventPage ? 'bg-white/20 hover:bg-white/30' : 'bg-[#e63946]'}`}
>
  Click Me
</button>
```

**✅ CORRECT - Dynamic event colors:**
```tsx
<button 
  className="text-white px-4 py-2 rounded transition-colors"
  style={isEventPage && eventColors ? {
    backgroundColor: eventColors.secondary,
  } : {
    backgroundColor: '#e63946'
  }}
  onMouseEnter={(e) => {
    if (isEventPage && eventColors) {
      e.currentTarget.style.backgroundColor = eventColors.accent;
    } else {
      e.currentTarget.style.backgroundColor = '#d62839';
    }
  }}
  onMouseLeave={(e) => {
    if (isEventPage && eventColors) {
      e.currentTarget.style.backgroundColor = eventColors.secondary;
    } else {
      e.currentTarget.style.backgroundColor = '#e63946';
    }
  }}
>
  Click Me
</button>
```

## Available Event Colors

From `eventColors` object:
- `primary` - Main brand color (e.g., gold for Black Friday)
- `secondary` - Secondary accent color
- `accent` - Highlight/hover color
- `accentDark` - Darker accent for backgrounds
- `background` - Page background color
- `textOnLight` - Text color for light backgrounds
- `secondaryLight` - Light version of secondary color
- `isDark` - Boolean indicating if scheme is dark

## Checklist for New Event Pages

- [ ] Search for hardcoded Tailwind colors: `bg-[#`, `text-[#`, `bg-white/`
- [ ] Replace with inline `style` using `eventColors` props
- [ ] Add hover states using `onMouseEnter`/`onMouseLeave` if needed
- [ ] Pass `textColor` and `accentColor` props to custom components
- [ ] Test color changes by switching between event configs

## Components That Need Props

When creating reusable components for event pages, accept these props:

```tsx
interface EventComponentProps {
  backgroundColor?: string;
  primaryColor?: string;
  textColor?: string;
  accentColor?: string;
}
```

Then pass them from Home.tsx:
```tsx
<MyComponent 
  backgroundColor={eventColors?.accentDark}
  primaryColor={eventColors?.primary}
  textColor={eventColors?.textOnLight || eventColors?.primary}
  accentColor={eventColors?.accent}
/>
```

## Examples Fixed

1. **Announcement Bar Button** (Home.tsx:1813)
   - Before: `bg-white/20 hover:bg-white/30`
   - After: `style={{ backgroundColor: eventColors.secondary }}`

2. **BlackFridayUrgencySection** (multiple locations)
   - Before: Hardcoded `#1a1a1a`, `#FF6B6B`, `#FFD700`
   - After: Uses `textColor`, `accentColor`, `primaryColor` props

3. **Gift Section Badge** (Home.tsx:3680)
   - Before: `bg-white/20`
   - After: `style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}`

## Testing

After implementing event color scheme:
1. Navigate to `/black-friday` page
2. Open browser DevTools
3. Check that colors match the event theme
4. Verify no hardcoded colors override the scheme
5. Test hover states on buttons

## Prevention

Before committing new event page code:
```bash
# Search for potential hardcoded colors
grep -r "bg-\[#" client/src/pages/
grep -r "text-\[#" client/src/pages/
grep -r "bg-white/" client/src/pages/
```

If matches found, evaluate if they should use `eventColors` instead.
