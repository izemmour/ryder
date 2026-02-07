/**
 * Auto-Generation System for Event Page Content
 * 
 * Generates angle-driven content:
 * - Gallery images (1-3) aligned with angle narrative
 * - Sub-sentences under product description
 * - Event-specific color schemes
 */

import { invokeLLM } from "./_core/llm";
import type { MarketingAngle, LandingPageSetting } from "../drizzle/schema";

export interface GalleryImage {
  /** Image URL or path */
  url: string;
  /** Alt text for accessibility */
  alt: string;
  /** Caption or description */
  caption?: string;
  /** Position in gallery (1-based) */
  position: number;
}

export interface GeneratedContent {
  /** Array of gallery images */
  galleryImages: GalleryImage[];
  /** Sub-sentence under product description */
  subSentence: string;
  /** Generated color scheme identifier */
  colorScheme: string;
}

/**
 * Event-specific color scheme definitions
 */
const EVENT_COLOR_SCHEMES: Record<string, { primary: string; secondary: string; scheme: string }[]> = {
  'black-friday': [
    { primary: '#000000', secondary: '#e63946', scheme: 'black-red' },
    { primary: '#1a1a1a', secondary: '#f5c542', scheme: 'black-gold' },
    { primary: '#2d1b1b', secondary: '#c41e3a', scheme: 'dark-crimson' },
  ],
  'valentine-gift': [
    { primary: '#e63946', secondary: '#ffc0cb', scheme: 'red-pink' },
    { primary: '#b76e79', secondary: '#f5c542', scheme: 'rose-gold' },
    { primary: '#800020', secondary: '#ffb6c1', scheme: 'burgundy-blush' },
  ],
  'mothers-day': [
    { primary: '#ffc0cb', secondary: '#e6e6fa', scheme: 'pink-lavender' },
    { primary: '#ff69b4', secondary: '#fff5ee', scheme: 'rose-cream' },
    { primary: '#ffb6c1', secondary: '#f0e6ef', scheme: 'soft-pink' },
  ],
  'fathers-day': [
    { primary: '#2d3a5c', secondary: '#8b7355', scheme: 'navy-brown' },
    { primary: '#36454f', secondary: '#4682b4', scheme: 'charcoal-blue' },
    { primary: '#708090', secondary: '#d2b48c', scheme: 'slate-tan' },
  ],
};

/**
 * Generates event-specific color scheme
 */
export function generateColorScheme(pageId: string, eventName?: string): string {
  const schemes = EVENT_COLOR_SCHEMES[pageId];
  
  if (!schemes || schemes.length === 0) {
    // Default to navy-gold for unknown events
    return 'navy-gold';
  }

  // Return the first (primary) color scheme for the event
  return schemes[0].scheme;
}

/**
 * Generates sub-sentence aligned with marketing angle
 */
export async function generateSubSentence(
  angle: MarketingAngle,
  pageType: 'event' | 'angle' | 'use-case' | 'default',
  eventContext?: string
): Promise<string> {
  const prompt = `Generate a compelling one-sentence sub-headline for a pillow product landing page.

Marketing Angle: ${angle.name}
Angle Description: ${angle.description || 'Premium pillow product'}
Page Type: ${pageType}
${eventContext ? `Event Context: ${eventContext}` : ''}

Requirements:
- Must be ONE sentence only (no periods at the end)
- Should reinforce the angle's unique value proposition
- Should create emotional connection with the target audience
- Should feel natural and conversational, not salesy
- Should be 10-20 words long
${pageType === 'event' ? '- Should tie into the event theme naturally' : ''}

Examples of good sub-sentences:
- "The same pillows trusted by luxury hotels worldwide, now available for your home"
- "Wake up pain-free with proper neck alignment that lasts all night"
- "Give the gift of better sleep this Valentine's Day"

Generate only the sub-sentence, no quotes or additional text:`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "You are a professional copywriter specializing in e-commerce product descriptions." },
      { role: "user", content: prompt }
    ],
  });

  const content = response.choices[0].message.content;
  const subSentence = typeof content === 'string' ? content.trim() : '';
  
  // Remove quotes if present
  return subSentence.replace(/^["']|["']$/g, '').replace(/\.$/, '');
}

/**
 * Generates gallery image prompts aligned with angle narrative
 */
export async function generateGalleryImagePrompts(
  angle: MarketingAngle,
  pageType: 'event' | 'angle' | 'use-case' | 'default',
  eventContext?: string
): Promise<Array<{ prompt: string; alt: string; caption: string; position: number }>> {
  const systemPrompt = `You are a creative director specializing in e-commerce product photography. Generate image prompts for a pillow product gallery that showcase the marketing angle effectively.`;

  const userPrompt = `Generate 3 product gallery image prompts for a pillow landing page.

Marketing Angle: ${angle.name}
Angle Description: ${angle.description || 'Premium pillow product'}
Product Title: ${angle.productTitle || 'Premium Down Alternative Pillow'}
Page Type: ${pageType}
${eventContext ? `Event Context: ${eventContext}` : ''}

Requirements:
- Image 1: Hero shot showcasing the pillow in context that reinforces the angle
- Image 2: Lifestyle shot showing the pillow in use (person sleeping comfortably)
- Image 3: Detail shot highlighting key features aligned with the angle

For each image, provide:
1. A detailed image generation prompt (2-3 sentences)
2. Alt text for accessibility (one sentence)
3. A short caption (5-10 words)

Format your response as JSON:
{
  "images": [
    {
      "position": 1,
      "prompt": "...",
      "alt": "...",
      "caption": "..."
    },
    ...
  ]
}`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "gallery_images",
        strict: true,
        schema: {
          type: "object",
          properties: {
            images: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  position: { type: "number" },
                  prompt: { type: "string" },
                  alt: { type: "string" },
                  caption: { type: "string" }
                },
                required: ["position", "prompt", "alt", "caption"],
                additionalProperties: false
              }
            }
          },
          required: ["images"],
          additionalProperties: false
        }
      }
    }
  });

  const content = response.choices[0].message.content;
  const result = JSON.parse(typeof content === 'string' ? content : '{}');
  return result.images;
}

/**
 * Generates complete angle-driven content for a landing page
 */
export async function generateAngleDrivenContent(
  pageSettings: LandingPageSetting,
  angle: MarketingAngle,
  pageType: 'event' | 'angle' | 'use-case' | 'default',
  eventContext?: string
): Promise<GeneratedContent> {
  // Generate sub-sentence
  const subSentence = await generateSubSentence(angle, pageType, eventContext);

  // Color schemes are now managed via Color Schemes Manager at page level
  // Default to 'default' scheme for non-event pages
  const colorScheme = pageType === 'event' 
    ? generateColorScheme(pageSettings.pageId, eventContext)
    : 'default';

  // Generate gallery image prompts
  const imagePrompts = await generateGalleryImagePrompts(angle, pageType, eventContext);

  // Convert prompts to gallery images (URLs would be generated via image generation service)
  const galleryImages: GalleryImage[] = imagePrompts.map(img => ({
    url: `/images/generated/${pageSettings.pageId}-${img.position}.png`, // Placeholder
    alt: img.alt,
    caption: img.caption,
    position: img.position
  }));

  return {
    galleryImages,
    subSentence,
    colorScheme
  };
}

/**
 * Auto-fixes missing elements for a landing page
 */
export async function autoFixMissingElements(
  pageSettings: LandingPageSetting,
  angle: MarketingAngle,
  pageType: 'event' | 'angle' | 'use-case' | 'default',
  missingElements: string[]
): Promise<Partial<LandingPageSetting>> {
  const updates: Partial<LandingPageSetting> = {};

  // Determine event context if applicable
  const eventContext = pageType === 'event' ? pageSettings.pageId : undefined;

  // Generate missing sub-sentence
  if (missingElements.includes('subSentence') || !pageSettings.subSentence) {
    updates.subSentence = await generateSubSentence(angle, pageType, eventContext);
  }

  // Color schemes are now managed via Color Schemes Manager
  // Auto-fix for color schemes is not supported - must be manually assigned

  // Generate missing gallery images
  if (missingElements.includes('galleryImages') || !pageSettings.galleryImages) {
    const imagePrompts = await generateGalleryImagePrompts(angle, pageType, eventContext);
    const galleryImages = imagePrompts.map(img => ({
      url: `/images/generated/${pageSettings.pageId}-${img.position}.png`,
      alt: img.alt,
      caption: img.caption,
      position: img.position
    }));
    updates.galleryImages = JSON.stringify(galleryImages);
  }

  return updates;
}

/**
 * Regenerates all angle-driven content when angle is changed
 */
export async function regenerateContentForAngle(
  pageSettings: LandingPageSetting,
  newAngle: MarketingAngle,
  pageType: 'event' | 'angle' | 'use-case' | 'default'
): Promise<GeneratedContent> {
  const eventContext = pageType === 'event' ? pageSettings.pageId : undefined;
  return generateAngleDrivenContent(pageSettings, newAngle, pageType, eventContext);
}
