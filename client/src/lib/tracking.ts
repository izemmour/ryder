/**
 * Facebook Pixel Tracking Utilities
 * 
 * Provides type-safe functions for tracking Facebook Pixel events
 * with product data from Shopify.
 */

// Declare fbq on window for TypeScript
declare global {
  interface Window {
    fbq: (
      action: string,
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

// Product data interface
interface ProductData {
  id: string;           // Shopify product/variant ID
  name: string;         // Product name
  price: number;        // Price in dollars
  currency?: string;    // Currency code (default: USD)
  quantity?: number;    // Quantity (default: 1)
  size?: string;        // Size variant (Standard/King)
}

/**
 * Helper to safely call fbq with retry if not yet loaded
 */
function safeFbq(action: string, event: string, params: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  
  const tryTrack = () => {
    if (window.fbq) {
      window.fbq(action, event, params);
      console.log(`[FB Pixel] ${event} tracked:`, params);
      return true;
    }
    return false;
  };
  
  // Try immediately
  if (tryTrack()) return;
  
  // Retry after a short delay (FB Pixel loads on window.load)
  setTimeout(() => {
    if (!tryTrack()) {
      // Final retry after longer delay
      setTimeout(tryTrack, 2000);
    }
  }, 500);
}

/**
 * Track ViewContent event when user views a product
 * Called on page load for product landing pages
 */
export function trackViewContent(product: ProductData): void {
  safeFbq('track', 'ViewContent', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: product.currency || 'USD',
  });
}

/**
 * Track AddToCart event when user clicks Order Now / Add to Cart
 * Called when user initiates checkout (before redirect to Shopify)
 */
export function trackAddToCart(product: ProductData): void {
  safeFbq('track', 'AddToCart', {
    content_ids: [product.id],
    content_name: product.name,
    content_type: 'product',
    value: product.price,
    currency: product.currency || 'USD',
    num_items: product.quantity || 1,
  });
}

/**
 * Track InitiateCheckout event
 * Called when user is about to be redirected to Shopify checkout
 */
export function trackInitiateCheckout(products: ProductData[], totalValue: number): void {
  safeFbq('track', 'InitiateCheckout', {
    content_ids: products.map(p => p.id),
    content_type: 'product',
    value: totalValue,
    currency: 'USD',
    num_items: products.reduce((sum, p) => sum + (p.quantity || 1), 0),
  });
}

// Shopify variant IDs for FluffCo pillows
export const SHOPIFY_VARIANT_IDS = {
  standard: {
    1: '44533282324679', // 1x Standard
    2: '44533282357447', // 2x Standard
    4: '44533282390215', // 4x Standard
  },
  king: {
    1: '44533282422983', // 1x King
    2: '44533282455751', // 2x King
    4: '44533282488519', // 4x King
  },
} as const;

// Pricing data for tracking
export const PRODUCT_PRICES = {
  standard: {
    1: 69,
    2: 119,
    4: 199,
  },
  king: {
    1: 89,
    2: 159,
    4: 279,
  },
} as const;

/**
 * Helper to get product data for tracking
 */
export function getProductDataForTracking(
  size: 'standard' | 'king',
  quantity: 1 | 2 | 4
): ProductData {
  const variantId = SHOPIFY_VARIANT_IDS[size][quantity];
  const price = PRODUCT_PRICES[size][quantity];
  const sizeName = size === 'standard' ? 'Standard (20"×28")' : 'King (20"×36")';
  
  return {
    id: variantId,
    name: `FluffCo Down Pillow - ${sizeName} - ${quantity}x`,
    price,
    currency: 'USD',
    quantity,
    size: sizeName,
  };
}
