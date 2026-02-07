/**
 * Shopify Checkout URL Generation Utility
 * 
 * Generates checkout URLs for FluffCo products with proper variant IDs and discount codes.
 * Store URL: fluffco-llc.myshopify.com
 * 
 * Checkout link pattern: /cart/{variant_id}:{qty}[,{variant_id}:{qty}...] then optionally '?discount=CODE&ref=SOURCE'
 */

const STORE_URL = 'https://fluffco-llc.myshopify.com';

// Primary product: Fluff Pillow (product_id: 10004703805734)
export const PILLOW_VARIANTS = {
  // Single pillows (main product, NOT upsell)
  standard_1: '51712144179494',
  king_1: '51712144212262',
  // Single pillows (UPSELL ONLY - Updated Jan 27, 2026)
  standard_1_upsell: '52010146758950',
  king_1_upsell: '52010147479846',
  // 2-pack pillows
  standard_2: '50146656551206',
  king_2: '51712143163686',
  // 4-pack pillows (Updated Jan 27, 2026)
  standard_4: '50146656616742',
  king_4: '51712143229222',
} as const;

// Discount codes
export const DISCOUNT_CODES = {
  // 1x Pillow upsell discount (Standard: $39.90, King: $49.90) - NO LONGER USED
  single_pillow_upsell: 'RRDF2F8NZ39Q',
  // Free pillowcase for 4x pillow purchases (Updated Jan 28, 2026 - size-specific)
  // These codes have fixed max discount amounts - first pillowcase free, second charged
  free_pillowcase_4x_standard: '5N8F5Y9KRPG2',
  free_pillowcase_4x_king: 'M3ZMVFQVF5Y3',
  // Legacy silk pillowcase discounts (for 4x silk pillowcase upsell)
  silk_pillowcase_standard_4x: 'RPV50436RR0B',
  silk_pillowcase_king_4x: '5EJYPB8JG7Q3',
  // Legacy silk eyemask discount
  silk_eyemask: 'X56D7N4CHHD5',
} as const;

// Upsell: Pillowcase Set (2x pack) - Updated Jan 27, 2026
// Standard: $19 (was $39), King: $29 (was $49) with discount code Y7QCKQF68C27
export const PILLOWCASE_SET_VARIANTS = {
  standard: {
    variant_id: '43591587856618',
    discount_code: 'Y7QCKQF68C27', // Standard: $19 (was $39)
  },
  king: {
    variant_id: '43591587922154',
    discount_code: 'Y7QCKQF68C27', // King: $29 (was $49)
  },
} as const;

// Legacy upsell variants (kept for backward compatibility)
export const SILK_PILLOWCASE_4X_VARIANTS = {
  standard: {
    variant_id: '43591587856618',
    discount_code: DISCOUNT_CODES.silk_pillowcase_standard_4x,
  },
  king: {
    variant_id: '43591587922154',
    discount_code: DISCOUNT_CODES.silk_pillowcase_king_4x,
  },
} as const;

export const SILK_EYEMASK_VARIANT = {
  variant_id: '43591588217066',
  discount_code: DISCOUNT_CODES.silk_eyemask,
} as const;

// Shipping Insurance (product_id: 10055310541094)
export const SHIPPING_INSURANCE_VARIANT = {
  variant_id: '50283956896038',
  price: 5.00,
} as const;

// Tracking parameters
export const TRACKING_PARAMS = {
  referrer: 'skyvane', // UTM source for Shopify attribution
} as const;

export type PillowSize = 'Standard' | 'King';
export type UpsellType = 'single-pillow' | 'pillowcase-set' | 'silk-pillowcase-4x' | 'silk-eyemask' | null;

export interface CheckoutConfig {
  size: PillowSize;
  quantity: 1 | 2 | 4;
  upsell?: UpsellType;
  secondUpsell?: boolean; // Whether second upsell (pillowcase set) is added
  shippingInsurance?: boolean; // Whether shipping insurance is added
}

interface CartItem {
  variant_id: string;
  quantity: number;
}

/**
 * Get the correct pillow variant ID based on size and quantity
 */
function getPillowVariantId(size: PillowSize, quantity: 1 | 2 | 4): string {
  const sizeKey = size.toLowerCase() as 'standard' | 'king';
  
  if (quantity === 1) {
    return PILLOW_VARIANTS[`${sizeKey}_1`];
  } else if (quantity === 2) {
    return PILLOW_VARIANTS[`${sizeKey}_2`];
  } else {
    // 4 pillows (updated variant IDs)
    return PILLOW_VARIANTS[`${sizeKey}_4`];
  }
}

/**
 * Generate a Shopify checkout URL based on the cart configuration
 */
export function generateCheckoutUrl(config: CheckoutConfig): string {
  const { size, quantity, upsell, secondUpsell = false, shippingInsurance = false } = config;
  const sizeKey = size.toLowerCase() as 'standard' | 'king';
  
  const cartItems: CartItem[] = [];
  let discountCode: string | null = null;
  
  // Add pillow to cart
  const pillowVariantId = getPillowVariantId(size, quantity);
  cartItems.push({
    variant_id: pillowVariantId,
    quantity: 1, // The variant itself represents the quantity bundle
  });
  
  // For 4x pillow purchases, automatically add free pillowcase set
  if (quantity === 4) {
    const freePillowcaseVariant = PILLOWCASE_SET_VARIANTS[sizeKey];
    cartItems.push({
      variant_id: freePillowcaseVariant.variant_id,
      quantity: 1,
    });
    // Apply size-specific free pillowcase discount code (Updated Jan 28, 2026)
    // These codes have fixed max discount amounts - allows second pillowcase to be charged
    discountCode = sizeKey === 'standard' 
      ? DISCOUNT_CODES.free_pillowcase_4x_standard 
      : DISCOUNT_CODES.free_pillowcase_4x_king;
  }
  
  // Add first upsell if selected
  if (upsell === 'single-pillow') {
    // 1x Pillow upsell (Standard: $39.90, King: $49.90)
    // Use UPSELL-SPECIFIC variant IDs (Updated Jan 27, 2026)
    // NOTE: These variants are already priced correctly in Shopify backend - no discount code needed
    const singlePillowUpsellVariantId = PILLOW_VARIANTS[`${sizeKey}_1_upsell`];
    cartItems.push({
      variant_id: singlePillowUpsellVariantId,
      quantity: 1,
    });
    // No discount code needed - variants are pre-priced at $39.90/$49.90
  } else if (upsell === 'silk-pillowcase-4x') {
    // Legacy: 4x Silk Pillowcase upsell
    const silkPillowcaseVariant = SILK_PILLOWCASE_4X_VARIANTS[sizeKey];
    cartItems.push({
      variant_id: silkPillowcaseVariant.variant_id,
      quantity: 1,
    });
    discountCode = silkPillowcaseVariant.discount_code;
  } else if (upsell === 'silk-eyemask') {
    // Legacy: Silk Eyemask upsell
    cartItems.push({
      variant_id: SILK_EYEMASK_VARIANT.variant_id,
      quantity: 1,
    });
    discountCode = SILK_EYEMASK_VARIANT.discount_code;
  }
  
  // Add second upsell if selected (Pillowcase Set)
  if (secondUpsell) {
    const pillowcaseSetVariant = PILLOWCASE_SET_VARIANTS[sizeKey];
    cartItems.push({
      variant_id: pillowcaseSetVariant.variant_id,
      quantity: 1,
    });
    // Apply pillowcase discount code if no other discount is active
    // Priority: M3ZMVFQVF5Y3 (4x free pillowcase) > Y7QCKQF68C27 (pillowcase upsell)
    if (!discountCode && pillowcaseSetVariant.discount_code) {
      discountCode = pillowcaseSetVariant.discount_code;
    }
  }
  
  // Add shipping insurance if selected
  if (shippingInsurance) {
    cartItems.push({
      variant_id: SHIPPING_INSURANCE_VARIANT.variant_id,
      quantity: 1,
    });
  }
  
  // Build cart URL path
  const cartPath = cartItems
    .map(item => `${item.variant_id}:${item.quantity}`)
    .join(',');
  
  // Build query parameters
  const queryParams: string[] = [];
  
  // Add discount code if applicable
  if (discountCode) {
    queryParams.push(`discount=${discountCode}`);
  }
  
  // Add referrer tracking (utm_source equivalent for Shopify)
  queryParams.push(`ref=${TRACKING_PARAMS.referrer}`);
  
  // Construct final URL
  const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
  return `${STORE_URL}/cart/${cartPath}${queryString}`;
}

/**
 * Example usage:
 * 
 * // 1x Pillow Standard with 1x Pillow upsell
 * generateCheckoutUrl({ size: 'Standard', quantity: 1, upsell: 'single-pillow' })
 * // Returns: https://fluffco-llc.myshopify.com/cart/51712144179494:1,52010146758950:1?discount=RRDF2F8NZ39Q&ref=skyvane
 * 
 * // 2x Pillow King with Pillowcase Set upsell
 * generateCheckoutUrl({ size: 'King', quantity: 2, upsell: 'single-pillow', secondUpsell: true })
 * // Returns: https://fluffco-llc.myshopify.com/cart/51712143163686:1,52010147479846:1,43591587922154:1?discount=RRDF2F8NZ39Q&ref=skyvane
 * 
 * // 4x Pillow Standard (auto-adds free pillowcase)
 * generateCheckoutUrl({ size: 'Standard', quantity: 4 })
 * // Returns: https://fluffco-llc.myshopify.com/cart/50146656616742:1,43591587856618:1?discount=M3ZMVFQVF5Y3&ref=skyvane
 */
