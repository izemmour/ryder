/**
 * ShippingMessage Component
 * 
 * Displays dynamic, location-specific shipping messaging to increase
 * conversion confidence and reduce purchase friction.
 * 
 * US visitors: Free shipping, 2-3 days
 * International visitors: Paid shipping, 5-8 days
 * 
 * Variants:
 * - "inline": Subtle text for hero/product info sections (matches stock bar styling)
 * - "badge": White background card for CTA sections (Choose Your Setup)
 * - "checkout": Prominent placement for checkout modals
 */

import { useGeolocation, getDeliveryEstimate, isShippingAvailable, useShippingSettings, isUSVisitor, getShippingCost, useNonUsBadgeText } from '@/hooks/useGeolocation';
import { Truck, MapPin, Check, Globe } from 'lucide-react';

interface ShippingMessageProps {
  variant?: 'inline' | 'badge' | 'checkout';
  className?: string;
  quantity?: number; // For calculating shipping cost
}

export function ShippingMessage({ variant = 'inline', className = '', quantity = 1 }: ShippingMessageProps) {
  const { country, countryCode, city, isLoading, error } = useGeolocation();
  const shippingSettings = useShippingSettings();
  const nonUsBadgeText = useNonUsBadgeText(); // Configurable badge for non-US visitors

  // Determine location display text
  const getLocationText = (): string => {
    if (isLoading) return '';
    if (error || !countryCode) return '';
    
    // For US, show city if available (more personal/specific)
    if (countryCode === 'US' && city) {
      return city;
    }
    
    return country || '';
  };

  const locationText = getLocationText();
  // Get delivery estimate - with prefix for standalone display, without for inline use
  const deliveryEstimateWithPrefix = countryCode ? getDeliveryEstimate(countryCode, shippingSettings, true) : `Delivers in ${shippingSettings?.shipping_time_us || '2-3 days'}`;
  const deliveryEstimateDaysOnly = countryCode ? getDeliveryEstimate(countryCode, shippingSettings, false) : (shippingSettings?.shipping_time_us || '2-3 days');
  const canShip = countryCode ? isShippingAvailable(countryCode) : true;
  const isUS = countryCode ? isUSVisitor(countryCode) : true; // Assume US if unknown
  const shippingCost = countryCode ? getShippingCost(countryCode, quantity) : 0;

  // Don't show anything while loading
  if (isLoading) {
    return null;
  }

  // Fallback message when location is unavailable - assume US (free shipping)
  if (!locationText) {
    return (
      <FallbackMessage variant={variant} className={className} shippingSettings={shippingSettings} />
    );
  }

  // Location-specific message - matches stock bar styling (text-xs, font-medium for numbers/location)
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
        <Truck className="w-3 h-3 flex-shrink-0" />
        <span>
          Ships to <span className="font-medium tabular-nums">{locationText}</span>
          {isUS ? (
            <span> · <span className="text-green-600 font-medium">Free shipping</span> · {deliveryEstimateWithPrefix}</span>
          ) : (
            <span> · {deliveryEstimateWithPrefix}</span>
          )}
        </span>
      </div>
    );
  }

  // Badge variant - white background card with full message
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-card border border-border shadow-sm text-sm ${className}`}>
        <Truck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">
          Ships to <span className="font-medium text-foreground">{locationText}</span>.
          {isUS ? (
            <span> <span className="text-green-600 font-medium">Free shipping</span>. {deliveryEstimateWithPrefix}.</span>
          ) : (
            <span> {deliveryEstimateWithPrefix}.</span>
          )}
        </span>
      </div>
    );
  }

  if (variant === 'checkout') {
    if (isUS) {
      return (
        <div className={`flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-border ${className}`}>
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Free shipping to {locationText}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium tabular-nums">{deliveryEstimateWithPrefix}</span>
            </p>
          </div>
        </div>
      );
    } else {
      // International - show shipping info without extra badge (badge is shown in trust badges)
      return (
        <div className={`flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-border ${className}`}>
          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
            <Globe className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Ships to {locationText}
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium tabular-nums">{deliveryEstimateWithPrefix}</span>
            </p>
          </div>
        </div>
      );
    }
  }

  return null;
}

/**
 * Fallback message when location cannot be determined
 * Assumes US (free shipping) as default
 */
function FallbackMessage({ variant, className = '', shippingSettings }: { variant: string; className?: string; shippingSettings: Record<string, string> }) {
  // Use US shipping time as default fallback
  const defaultDelivery = shippingSettings?.shipping_time_us || '2-3 days';
  
  // Inline variant - matches stock bar styling (text-xs, font-medium for numbers)
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-muted-foreground ${className}`}>
        <Truck className="w-3 h-3 flex-shrink-0" />
        <span>
          <span className="font-medium text-green-600">Free shipping</span> · Delivers in <span className="font-medium tabular-nums">{defaultDelivery}</span>
        </span>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-card border border-border shadow-sm text-sm ${className}`}>
        <Truck className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-muted-foreground">
          <span className="font-medium text-green-600">Free shipping</span>. Delivers in <span className="font-medium tabular-nums">{defaultDelivery}</span>.
        </span>
      </div>
    );
  }

  if (variant === 'checkout') {
    return (
      <div className={`flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-border ${className}`}>
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
          <Check className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Free shipping included</p>
          <p className="text-xs text-muted-foreground">
            Delivers in <span className="font-medium tabular-nums">{defaultDelivery}</span>
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default ShippingMessage;
