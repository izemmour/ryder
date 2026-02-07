/**
 * useGeolocation Hook
 * 
 * Detects user's location via IP-based geolocation API.
 * Uses ipwho.is as primary (no rate limit), ipapi.co as fallback.
 * Persists location to localStorage to avoid repeated API calls.
 * Falls back to US as default if all APIs fail.
 */

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';

interface GeoLocation {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  isLoading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'fluffco_geolocation';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface StoredLocation {
  data: Omit<GeoLocation, 'isLoading' | 'error'>;
  timestamp: number;
}

// Get cached location from localStorage
function getCachedLocation(): GeoLocation | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const parsed: StoredLocation = JSON.parse(stored);
    const now = Date.now();
    
    // Check if cache is still valid (24 hours)
    if (now - parsed.timestamp < CACHE_DURATION) {
      return {
        ...parsed.data,
        isLoading: false,
        error: null,
      };
    }
    
    // Cache expired, remove it
    localStorage.removeItem(STORAGE_KEY);
    return null;
  } catch {
    return null;
  }
}

// Save location to localStorage
function setCachedLocation(location: GeoLocation): void {
  try {
    const toStore: StoredLocation = {
      data: {
        country: location.country,
        countryCode: location.countryCode,
        region: location.region,
        regionName: location.regionName,
        city: location.city,
      },
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // localStorage might be full or disabled, ignore
  }
}

// In-memory cache for current session
let memoryCache: GeoLocation | null = null;

export function useGeolocation(): GeoLocation {
  const [location, setLocation] = useState<GeoLocation>(() => {
    // First check memory cache
    if (memoryCache) {
      return memoryCache;
    }
    
    // Then check localStorage
    const cached = getCachedLocation();
    if (cached) {
      memoryCache = cached;
      return cached;
    }
    
    return {
      country: '',
      countryCode: '',
      region: '',
      regionName: '',
      city: '',
      isLoading: true,
      error: null,
    };
  });

  useEffect(() => {
    // Skip if already have valid location in memory
    if (memoryCache && memoryCache.country) {
      return;
    }
    
    // Check localStorage again (in case it was set by another component)
    const cached = getCachedLocation();
    if (cached && cached.country) {
      memoryCache = cached;
      setLocation(cached);
      return;
    }

    const fetchLocation = async () => {
      // Try primary API first, then fallback
      const apis = [
        {
          url: 'https://ipwho.is/',
          parse: (data: any) => ({
            country: data.country || '',
            countryCode: data.country_code || '',
            region: data.region_code || '',
            regionName: data.region || '',
            city: data.city || '',
          }),
          validate: (data: any) => data.success !== false && data.country_code,
        },
        {
          url: 'https://ipapi.co/json/',
          parse: (data: any) => ({
            country: data.country_name || '',
            countryCode: data.country_code || '',
            region: data.region_code || '',
            regionName: data.region || '',
            city: data.city || '',
          }),
          validate: (data: any) => !data.error && (data.country_name || data.country_code),
        },
      ];

      for (const api of apis) {
        try {
          const response = await fetch(api.url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });

          if (!response.ok) continue;

          const data = await response.json();
          if (!api.validate(data)) continue;

          const parsed = api.parse(data);
          const newLocation: GeoLocation = {
            ...parsed,
            isLoading: false,
            error: null,
          };

          // Cache in memory and localStorage
          memoryCache = newLocation;
          setCachedLocation(newLocation);
          setLocation(newLocation);
          return; // Success, exit
        } catch {
          continue; // Try next API
        }
      }

      // All APIs failed - use US as default (most visitors)
      console.warn('[Geolocation] All APIs failed, defaulting to US');
      const defaultLocation: GeoLocation = {
        country: 'United States',
        countryCode: 'US',
        region: '',
        regionName: '',
        city: '',
        isLoading: false,
        error: null,
      };
      memoryCache = defaultLocation;
      setCachedLocation(defaultLocation);
      setLocation(defaultLocation);
    };

    fetchLocation();
  }, []);

  return location;
}

// Default shipping times (used as fallback if settings not loaded)
const DEFAULT_SHIPPING_TIMES: Record<string, string> = {
  US: '2-3 days',
  INTERNATIONAL: '5-8 days',
};

// Shipping costs for international orders
export const INTERNATIONAL_SHIPPING_COSTS: Record<number, number> = {
  1: 10,  // $10 for 1 pillow
  2: 15,  // $15 for 2 pillows
  3: 20,  // $20 for 3+ pillows
};

/**
 * Get shipping cost based on quantity (pillows + upsells)
 * US: Free shipping
 * International: $10 (1), $15 (2), $20 (3+)
 */
export function getShippingCost(countryCode: string, quantity: number): number {
  // US gets free shipping
  if (countryCode === 'US') {
    return 0;
  }
  
  // International shipping costs
  if (quantity <= 1) return 10;
  if (quantity === 2) return 15;
  return 20; // 3 or more
}

/**
 * Check if user is in the US (for free shipping badge visibility)
 */
export function isUSVisitor(countryCode: string): boolean {
  return countryCode === 'US';
}

/**
 * Get estimated delivery days based on country
 * US: 2-3 days, International: 5-8 days
 * @param includePrefix - If true, includes "Delivers in" prefix
 */
export function getDeliveryEstimate(countryCode: string, settings?: Record<string, string>, includePrefix: boolean = true): string {
  // US domestic shipping
  let days: string;
  if (countryCode === 'US') {
    days = settings?.shipping_time_us || DEFAULT_SHIPPING_TIMES.US;
  } else {
    // All other countries (international)
    days = settings?.shipping_time_international || DEFAULT_SHIPPING_TIMES.INTERNATIONAL;
  }
  
  return includePrefix ? `Delivers in ${days}` : days;
}

/**
 * Check if we ship to a country
 * We ship worldwide!
 */
export function isShippingAvailable(countryCode: string): boolean {
  // We ship to all countries worldwide
  return true;
}

/**
 * Hook to get shipping settings from database
 */
export function useShippingSettings() {
  const { data: settings } = trpc.settings.getAll.useQuery({ category: 'shipping' });
  
  // Convert array to key-value map
  const settingsMap: Record<string, string> = {};
  settings?.forEach(s => {
    settingsMap[s.key] = s.value;
  });
  
  return settingsMap;
}

/**
 * Hook to get the non-US badge text from settings
 * Returns the configured badge text or 'Free Returns' as default
 */
export function useNonUsBadgeText(): string {
  const settings = useShippingSettings();
  return settings?.non_us_badge_text || 'Free Returns';
}

/**
 * Hook to get the non-US alternative USP (replaces "Made in USA" for international visitors)
 * Returns the configured alternative USP or 'Award-Winning Quality' as default
 */
export function useNonUsAlternativeUsp(): { title: string; description: string } {
  const settings = useShippingSettings();
  return {
    title: settings?.non_us_alternative_usp_title || 'Award-Winning Quality',
    description: settings?.non_us_alternative_usp_description || 'Oprah Daily recognized'
  };
}
