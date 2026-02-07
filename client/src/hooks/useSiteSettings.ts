/**
 * useSiteSettings Hook
 * 
 * Fetches site settings from the database and provides them to components.
 * Settings are cached and shared across all components using this hook.
 */

import { trpc } from '@/lib/trpc';
import { useGeolocation, isUSVisitor } from './useGeolocation';

export interface SiteSettings {
  // Shipping settings
  shipping_time_us: string;
  shipping_time_ca: string;
  shipping_time_eu: string;
  shipping_time_au: string;
  shipping_time_row: string;
  shipping_time_worldwide: string;
  
  // Social proof settings
  customer_count_base: string;
  customer_count_start_date: string;
  customer_count_weekly_increment: string;
  
  // Product settings
  trial_period_text: string;
  guarantee_text: string;
  shipping_text: string;
  origin_text: string;
  
  // CTA text settings - Global defaults
  cta_primary_text: string;
  cta_secondary_text: string;
  cta_event_primary: string;
  cta_event_secondary: string;
  
  // CTA text settings - Per-angle overrides (empty = use global default)
  cta_angle_hotel_quality: string;
  cta_angle_restorative_alignment: string;
  cta_angle_neck_pain_relief: string;
  cta_angle_down_alternative: string;
  
  // CTA text settings - Per-event overrides
  cta_event_valentines: string;
  cta_event_mothers_day: string;
  cta_event_fathers_day: string;
  
  // Quiz result redirect settings (page slug for each profile)
  quiz_redirect_the_restless_sleeper: string;
  quiz_redirect_the_pain_sufferer: string;
  quiz_redirect_the_hot_sleeper: string;
  quiz_redirect_the_allergy_prone: string;
  quiz_redirect_the_pillow_stacker: string;
  quiz_redirect_the_quality_seeker: string;
}

// Default values used when settings haven't been initialized
const DEFAULT_SETTINGS: SiteSettings = {
  shipping_time_us: '4–6 days',
  shipping_time_ca: '6–10 days',
  shipping_time_eu: '8–14 days',
  shipping_time_au: '12–18 days',
  shipping_time_row: '12–22 days',
  shipping_time_worldwide: '10–20 days',
  customer_count_base: '546000',
  customer_count_start_date: '2026-01-20',
  customer_count_weekly_increment: '4000',
  trial_period_text: '100 Night Better Sleep',
  guarantee_text: '100-Night Guarantee',
  shipping_text: 'Free Shipping',
  origin_text: 'Made in USA',
  
  // CTA text defaults - Global
  cta_primary_text: 'Order Now',
  cta_secondary_text: 'Claim Now',
  cta_event_primary: 'Gift Now',
  cta_event_secondary: 'Shop the Gift',
  
  // CTA text defaults - Per-angle overrides (matching config files)
  cta_angle_hotel_quality: 'Get Hotel Quality',
  cta_angle_restorative_alignment: 'Order Now',
  cta_angle_neck_pain_relief: 'Try It Now',
  cta_angle_down_alternative: 'Order Now',
  
  // CTA text defaults - Per-event overrides (matching config files)
  cta_event_valentines: 'Gift Now',
  cta_event_mothers_day: 'Gift Mom',
  cta_event_fathers_day: 'Gift Dad',
  
  // Quiz result redirect defaults (fallback to legacy page)
  quiz_redirect_the_restless_sleeper: '/',
  quiz_redirect_the_pain_sufferer: '/neck-pain-relief',
  quiz_redirect_the_hot_sleeper: '/',
  quiz_redirect_the_allergy_prone: '/',
  quiz_redirect_the_pillow_stacker: '/',
  quiz_redirect_the_quality_seeker: '/hotel-quality',
};

export function useSiteSettings() {
  const { data: settingsArray, isLoading, error } = trpc.settings.getAll.useQuery({});
  const { countryCode } = useGeolocation();
  const isUS = countryCode ? isUSVisitor(countryCode) : true; // Default to US if unknown
  
  // Convert array to object map with defaults
  const settings: SiteSettings = { ...DEFAULT_SETTINGS };
  
  if (settingsArray) {
    settingsArray.forEach(s => {
      if (s.key in settings) {
        (settings as unknown as Record<string, string>)[s.key] = s.value;
      }
    });
  }
  
  // Override shipping_text and origin_text based on geo-location
  // For non-US visitors, use the configurable non-US badge and alternative USP
  if (!isUS) {
    const nonUsBadgeText = (settingsArray?.find(s => s.key === 'non_us_badge_text')?.value) || 'Free Returns';
    const nonUsAlternativeUspTitle = (settingsArray?.find(s => s.key === 'non_us_alternative_usp_title')?.value) || 'Award-Winning Quality';
    settings.shipping_text = nonUsBadgeText;
    settings.origin_text = nonUsAlternativeUspTitle;
  }
  
  // Helper to get CTA text for a specific angle (falls back to global default if empty)
  const getAngleCTA = (angleId: string): string => {
    const angleKey = `cta_angle_${angleId.replace(/-/g, '_')}` as keyof SiteSettings;
    const angleCTA = settings[angleKey];
    // If angle-specific CTA is set and not empty, use it; otherwise use global default
    if (angleCTA && angleCTA.trim() !== '') {
      return angleCTA;
    }
    return settings.cta_primary_text || DEFAULT_SETTINGS.cta_primary_text;
  };
  
  // Helper to get CTA text for a specific event (falls back to global event default if empty)
  const getEventCTA = (eventId: string): string => {
    const eventKey = `cta_event_${eventId.replace(/-/g, '_')}` as keyof SiteSettings;
    const eventCTA = settings[eventKey];
    // If event-specific CTA is set and not empty, use it; otherwise use global event default
    if (eventCTA && eventCTA.trim() !== '') {
      return eventCTA;
    }
    return settings.cta_event_primary || DEFAULT_SETTINGS.cta_event_primary;
  };
  
  // Helper to get quiz redirect URL for a specific profile (falls back to "/" if empty)
  const getQuizRedirect = (profileId: string): string => {
    const profileKey = `quiz_redirect_${profileId.replace(/-/g, '_').replace(/\s+/g, '_').toLowerCase()}` as keyof SiteSettings;
    const redirect = settings[profileKey];
    if (redirect && redirect.trim() !== '') {
      return redirect;
    }
    return '/';
  };
  
  return {
    settings,
    isLoading,
    error,
    // Helper to get a specific setting with fallback
    getSetting: (key: keyof SiteSettings): string => {
      return settings[key] || DEFAULT_SETTINGS[key];
    },
    // Helper to get CTA text for a specific angle
    getAngleCTA,
    // Helper to get CTA text for a specific event
    getEventCTA,
    // Helper to get quiz redirect URL for a specific profile
    getQuizRedirect,
  };
}

export default useSiteSettings;
