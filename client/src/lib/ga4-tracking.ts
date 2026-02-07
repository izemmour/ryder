/**
 * Google Analytics 4 E-commerce Tracking
 * 
 * Implements GA4 recommended e-commerce events following best practices:
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
 * 
 * Events implemented:
 * - view_item: When user views product page
 * - add_to_cart: When user adds main product or upsells
 * - remove_from_cart: When user removes upsells
 * - view_promotion: When upsells are displayed
 * - select_promotion: When user clicks on upsell
 * - begin_checkout: When checkout popup opens
 * - add_shipping_info: When shipping protection is toggled
 * 
 * Note: 'purchase' event should be tracked on Shopify thank-you page
 */

// Declare gtag on window for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

// GA4 Item interface (follows GA4 spec)
export interface GA4Item {
  item_id: string;          // Product/variant ID
  item_name: string;        // Product name
  item_brand?: string;      // Brand name
  item_category?: string;   // Product category
  item_variant?: string;    // Size variant (Standard/King)
  price: number;            // Unit price
  quantity: number;         // Quantity
  discount?: number;        // Discount amount
}

// GA4 Promotion interface
export interface GA4Promotion {
  promotion_id: string;     // Unique promotion ID
  promotion_name: string;   // Promotion name
  creative_name?: string;   // Creative name/slot
  creative_slot?: string;   // Position in list
  items: GA4Item[];         // Items in promotion
}

/**
 * Send event to GA4
 * Safe wrapper that checks if gtag is available
 */
function sendGA4Event(eventName: string, params: Record<string, unknown>): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
    console.log(`[GA4] ${eventName}:`, params);
  } else {
    console.log(`[GA4] Event queued (gtag not ready): ${eventName}`, params);
  }
}

/**
 * Track view_item event
 * Called when user lands on product page
 * Includes full product parameters for proper e-commerce tracking
 */
export function trackViewItem(item: GA4Item, value: number): void {
  sendGA4Event('view_item', {
    currency: 'USD',
    value: value,
    items: [{
      item_id: item.item_id,
      item_name: item.item_name,
      item_brand: item.item_brand || 'FluffCo',
      item_category: item.item_category || 'Pillows',
      item_variant: item.item_variant,
      price: item.price,
      quantity: item.quantity,
      discount: item.discount,
    }],
  });
}

/**
 * Track add_to_cart event
 * Called when user adds main product or upsells to cart
 * Includes full product parameters for proper e-commerce tracking
 */
export function trackAddToCart(items: GA4Item[], value: number): void {
  sendGA4Event('add_to_cart', {
    currency: 'USD',
    value: value,
    items: items.map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_brand: item.item_brand || 'FluffCo',
      item_category: item.item_category || 'Pillows',
      item_variant: item.item_variant,
      price: item.price,
      quantity: item.quantity,
      discount: item.discount,
    })),
  });
}

/**
 * Track remove_from_cart event
 * Called when user removes upsells from cart
 */
export function trackRemoveFromCart(items: GA4Item[], value: number): void {
  sendGA4Event('remove_from_cart', {
    currency: 'USD',
    value: value,
    items: items,
  });
}

/**
 * Track view_promotion event
 * Called when upsells are displayed to user
 */
export function trackViewPromotion(promotions: GA4Promotion[]): void {
  sendGA4Event('view_promotion', {
    promotions: promotions.map(promo => ({
      promotion_id: promo.promotion_id,
      promotion_name: promo.promotion_name,
      creative_name: promo.creative_name,
      creative_slot: promo.creative_slot,
      items: promo.items,
    })),
  });
}

/**
 * Track select_promotion event
 * Called when user clicks "Add to Order" on upsell
 */
export function trackSelectPromotion(promotion: GA4Promotion): void {
  sendGA4Event('select_promotion', {
    promotion_id: promotion.promotion_id,
    promotion_name: promotion.promotion_name,
    creative_name: promotion.creative_name,
    creative_slot: promotion.creative_slot,
    items: promotion.items,
  });
}

/**
 * Track begin_checkout event
 * Called when checkout popup opens (step 2)
 * Includes full product parameters for proper e-commerce tracking
 */
export function trackBeginCheckout(items: GA4Item[], value: number, coupon?: string): void {
  sendGA4Event('begin_checkout', {
    currency: 'USD',
    value: value,
    coupon: coupon,
    items: items.map(item => ({
      item_id: item.item_id,
      item_name: item.item_name,
      item_brand: item.item_brand || 'FluffCo',
      item_category: item.item_category || 'Pillows',
      item_variant: item.item_variant,
      price: item.price,
      quantity: item.quantity,
      discount: item.discount,
    })),
  });
}

/**
 * Track add_shipping_info event
 * Called when shipping protection is toggled
 */
export function trackAddShippingInfo(items: GA4Item[], value: number, shippingTier: string): void {
  sendGA4Event('add_shipping_info', {
    currency: 'USD',
    value: value,
    shipping_tier: shippingTier,
    items: items,
  });
}

/**
 * Track add_payment_info event (optional)
 * Called before redirect to Shopify checkout
 */
export function trackAddPaymentInfo(items: GA4Item[], value: number, paymentType: string = 'shopify'): void {
  sendGA4Event('add_payment_info', {
    currency: 'USD',
    value: value,
    payment_type: paymentType,
    items: items,
  });
}

// Product data helpers
export const GA4_PRODUCT_IDS = {
  standard: {
    1: 'fluffco-standard-1',
    2: 'fluffco-standard-2',
    4: 'fluffco-standard-4',
  },
  king: {
    1: 'fluffco-king-1',
    2: 'fluffco-king-2',
    4: 'fluffco-king-4',
  },
  upsells: {
    'standard-pillow': 'fluffco-upsell-standard',
    'king-pillow': 'fluffco-upsell-king',
    'pillowcases': 'fluffco-upsell-pillowcases',
  },
} as const;

/**
 * Create GA4 item for main product
 */
export function createMainProductItem(
  size: 'Standard' | 'King',
  quantity: 1 | 2 | 4,
  price: number,
  originalPrice: number
): GA4Item {
  const sizeKey = size.toLowerCase() as 'standard' | 'king';
  const discount = originalPrice - price;
  
  return {
    item_id: GA4_PRODUCT_IDS[sizeKey][quantity],
    item_name: `FluffCo ${size} Pillow`,
    item_brand: 'FluffCo',
    item_category: 'Pillows',
    item_variant: size,
    price: price / quantity, // Unit price
    quantity: quantity,
    discount: discount > 0 ? discount : undefined,
  };
}

/**
 * Create GA4 item for upsell
 */
export function createUpsellItem(
  upsellId: string,
  name: string,
  price: number,
  originalPrice: number,
  quantity: number = 1
): GA4Item {
  const discount = originalPrice - price;
  
  return {
    item_id: upsellId,
    item_name: name,
    item_brand: 'FluffCo',
    item_category: 'Upsells',
    price: price,
    quantity: quantity,
    discount: discount > 0 ? discount : undefined,
  };
}

/**
 * Create GA4 promotion for upsell
 */
export function createUpsellPromotion(
  promotionId: string,
  promotionName: string,
  item: GA4Item,
  slot: string = 'upsell_1'
): GA4Promotion {
  return {
    promotion_id: promotionId,
    promotion_name: promotionName,
    creative_name: `Checkout Upsell - ${promotionName}`,
    creative_slot: slot,
    items: [item],
  };
}
