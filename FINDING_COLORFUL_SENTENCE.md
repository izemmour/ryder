# Finding: "Colorful One-Line Sentence Under Description"

**Location**: Valentine page hero section, below the main subheadline

**Text**: "The perfect gift that shows you care about their comfort and well-being."

**Visual Characteristics**:
- Red/pink color (matches Valentine theme)
- Positioned between the main subheadline and the USP icons
- Single line of text
- Appears to be styled differently from the main subheadline

**Source Investigation**:

Looking at valentine-gift.config.ts, this text is NOT in the config file. Checked:
- Line 69: `subheadline` = "A gift they'll enjoy every night, not just once. Give the thoughtful luxury of hotel-quality sleep this Valentine's Day, beautifully packaged and ready to unwrap."
- No additional field for this sentence

**Hypothesis**: This sentence might be:
1. Part of the `hero.usps` section (but those are icon-based)
2. A separate UI element in Home.tsx that's conditionally rendered for event pages
3. Part of the database `landing_page_settings` table
4. Generated dynamically based on event type

**Next Step**: Search Home.tsx for this exact text or a field that could contain it.
