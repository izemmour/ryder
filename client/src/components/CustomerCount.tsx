/**
 * CustomerCount Component
 * 
 * A reusable component that displays the customer count with automatic
 * weekly increments. The count increases by a configurable amount every Monday.
 * Settings can be managed via the LP Manager.
 * 
 * Usage:
 *   <CustomerCount />           // Full format: "746,000+"
 *   <CustomerCount format="short" />  // Short format: "746K+"
 */

import { useMemo } from 'react';
import { trpc } from '@/lib/trpc';

// Default configuration (used as fallback if settings not loaded)
const DEFAULT_BASE_COUNT = 746000;
const DEFAULT_BASE_DATE = '2026-01-20';
const DEFAULT_WEEKLY_INCREMENT = 4000;

/**
 * Calculate the current customer count based on weeks elapsed since base date
 */
export function getCustomerCount(
  baseCount: number = DEFAULT_BASE_COUNT,
  baseDate: string = DEFAULT_BASE_DATE,
  weeklyIncrement: number = DEFAULT_WEEKLY_INCREMENT
): number {
  const now = new Date();
  const startDate = new Date(baseDate);
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  
  // Calculate weeks elapsed (counting from the Monday after base date)
  const msElapsed = now.getTime() - startDate.getTime();
  const weeksElapsed = Math.floor(msElapsed / msPerWeek);
  
  // Only count positive weeks (don't go below base count)
  const validWeeks = Math.max(0, weeksElapsed);
  
  return baseCount + (validWeeks * weeklyIncrement);
}

/**
 * Format number with commas (e.g., 546000 -> "546,000")
 */
function formatWithCommas(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format number in short form (e.g., 546000 -> "546K")
 */
function formatShort(num: number): string {
  if (num >= 1000000) {
    const millions = num / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }
  if (num >= 1000) {
    const thousands = num / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(0)}K`;
  }
  return num.toString();
}

interface CustomerCountProps {
  /** Display format: 'full' for "546,000+" or 'short' for "546K+" */
  format?: 'full' | 'short';
  /** Whether to show the "+" suffix (default: true) */
  showPlus?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** If true, shows short format on mobile (<640px) and full format on desktop */
  responsive?: boolean;
}

export function CustomerCount({ 
  format = 'full', 
  showPlus = true,
  className = '',
  responsive = false
}: CustomerCountProps) {
  // Fetch settings from database
  const { data: settings } = trpc.settings.getAll.useQuery({ category: 'social_proof' });
  
  // Extract settings values with fallbacks
  const baseCount = useMemo(() => {
    const setting = settings?.find(s => s.key === 'customer_count_base');
    return setting ? parseInt(setting.value, 10) : DEFAULT_BASE_COUNT;
  }, [settings]);
  
  const baseDate = useMemo(() => {
    const setting = settings?.find(s => s.key === 'customer_count_start_date');
    return setting?.value || DEFAULT_BASE_DATE;
  }, [settings]);
  
  const weeklyIncrement = useMemo(() => {
    const setting = settings?.find(s => s.key === 'customer_count_weekly_increment');
    return setting ? parseInt(setting.value, 10) : DEFAULT_WEEKLY_INCREMENT;
  }, [settings]);
  
  const count = useMemo(() => 
    getCustomerCount(baseCount, baseDate, weeklyIncrement), 
    [baseCount, baseDate, weeklyIncrement]
  );
  
  const displayValue = useMemo(() => {
    const formatted = format === 'short' 
      ? formatShort(count) 
      : formatWithCommas(count);
    return showPlus ? `${formatted}+` : formatted;
  }, [count, format, showPlus]);
  
  const shortDisplayValue = useMemo(() => {
    const formatted = formatShort(count);
    return showPlus ? `${formatted}+` : formatted;
  }, [count, showPlus]);
  
  const fullDisplayValue = useMemo(() => {
    const formatted = formatWithCommas(count);
    return showPlus ? `${formatted}+` : formatted;
  }, [count, showPlus]);
  
  // If responsive, render both formats with CSS visibility
  if (responsive) {
    return (
      <span className={className}>
        <span className="sm:hidden">{shortDisplayValue}</span>
        <span className="hidden sm:inline">{fullDisplayValue}</span>
      </span>
    );
  }
  
  return <span className={className}>{displayValue}</span>;
}

/**
 * Hook to get the current customer count value
 * Useful when you need the raw number or custom formatting
 */
export function useCustomerCount() {
  const { data: settings } = trpc.settings.getAll.useQuery({ category: 'social_proof' });
  
  return useMemo(() => {
    const baseCount = settings?.find(s => s.key === 'customer_count_base');
    const baseDate = settings?.find(s => s.key === 'customer_count_start_date');
    const weeklyIncrement = settings?.find(s => s.key === 'customer_count_weekly_increment');
    
    return getCustomerCount(
      baseCount ? parseInt(baseCount.value, 10) : DEFAULT_BASE_COUNT,
      baseDate?.value || DEFAULT_BASE_DATE,
      weeklyIncrement ? parseInt(weeklyIncrement.value, 10) : DEFAULT_WEEKLY_INCREMENT
    );
  }, [settings]);
}

export default CustomerCount;
