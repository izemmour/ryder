# Pillow Image Analysis for Size Selector

## Standard Pillow (pillow-standard-final.png)
- Image dimensions: Square format (approximately 1:1 ratio)
- Pillow position: Centered vertically with significant yellow background above
- Top of pillow starts at approximately 15% from top of image
- Pillow occupies roughly 70% of vertical space

## King Pillow (pillow-king-new.png)
- Image dimensions: Wide format (approximately 16:9 ratio)
- Pillow position: Centered vertically with yellow background above
- Top of pillow starts at approximately 20% from top of image
- Pillow occupies roughly 60% of vertical space

## Current Issue
- The Standard pillow appears higher in its container than the King pillow
- This is because the Standard image has a different aspect ratio and the pillow starts at a different relative position

## Solution
- Reduce image container height by 30% (from aspect-[16/9] to aspect-[16/6] or similar)
- Use object-position to align the TOP of both pillows at the same level
- Standard: needs to be shifted down so top of pillow aligns with King
- King: use object-top to show from top of pillow
- Both should show approximately half of the pillow (top half visible, bottom half hidden)
