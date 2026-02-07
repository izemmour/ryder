/**
 * Gallery Overlays Components
 * 
 * These are the overlay badges and pills that appear on gallery images.
 * They support customizable text while maintaining consistent positioning and styling.
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { OverlayPill, AwardItem } from './types';
import { DEFAULT_AWARDS } from './types';

interface OprahDailyBadgeProps {
  configId?: string;
}

/**
 * Oprah Daily Badge - Top left corner of intro image
 */
export function OprahDailyBadge({ configId }: OprahDailyBadgeProps) {
  return (
    <div className="absolute top-4 left-4 animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
      <img 
        src="/images/oprah-sleep-awards-2024.webp" 
        alt="Oprah Daily Sleep O-Wards 2024" 
        className="w-[95px] h-[95px] lg:w-[120px] lg:h-[120px] rounded-full shadow-md object-cover"
      />
    </div>
  );
}

interface AwardCarouselProps {
  awards?: AwardItem[];
  position?: 'top' | 'bottom';
}

/**
 * Award Carousel - Shows rotating awards at top or bottom of intro image
 */
export function AwardCarousel({ awards = DEFAULT_AWARDS, position = 'bottom' }: AwardCarouselProps) {
  const [awardIndex, setAwardIndex] = useState(0);
  
  // Auto-rotate awards
  useEffect(() => {
    const interval = setInterval(() => {
      setAwardIndex(prev => (prev + 1) % awards.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [awards.length]);
  
  const positionClass = position === 'top' 
    ? 'top-3 left-1/2 -translate-x-1/2' 
    : 'bottom-3 left-1/2 -translate-x-1/2';
  
  return (
    <div className={`absolute ${positionClass} animate-[fadeSlideIn_0.4s_ease-out_0.2s_both]`}>
      <div className="bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 lg:px-2.5 lg:py-1.5 shadow-md flex items-center gap-1.5">
        <button 
          onClick={(e) => { e.stopPropagation(); setAwardIndex(prev => prev === 0 ? awards.length - 1 : prev - 1); }}
          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronLeft className="w-3 h-3 text-gray-800" />
        </button>
        <div 
          key={awardIndex}
          className="flex items-center gap-1.5 whitespace-nowrap animate-[fadeInUp_0.4s_ease-out_both]"
        >
          <span className="text-gray-900 text-[11px] lg:text-xs font-semibold">
            {awards[awardIndex].award}
          </span>
          <span className="text-muted-foreground text-[10px] lg:text-[11px]">
            {awards[awardIndex].publication}
          </span>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setAwardIndex(prev => (prev + 1) % awards.length); }}
          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
        >
          <ChevronRight className="w-3 h-3 text-gray-800" />
        </button>
      </div>
    </div>
  );
}

interface TrialBadgeProps {
  days?: number;
}

/**
 * Trial Badge - Top right corner showing trial period
 */
export function TrialBadge({ days = 100 }: TrialBadgeProps) {
  return (
    <div className="absolute top-3 right-0 animate-[fadeSlideIn_0.4s_ease-out_0.15s_both]">
      <div className="bg-white rounded-l-lg shadow-md px-2 py-2 lg:px-3 lg:py-3 flex flex-col items-center border-l-4 border-[#2d3a5c]">
        <span className="text-xl lg:text-2xl font-bold text-[#2d3a5c] leading-none">{days}</span>
        <span className="text-[8px] lg:text-[9px] text-gray-600 font-medium">Nights</span>
        <span className="text-[8px] lg:text-[9px] text-gray-600 font-medium">Trial</span>
      </div>
    </div>
  );
}

interface OverlayPillsProps {
  pills: OverlayPill[];
  layout: 'tips' | 'layers' | 'care';
}

/**
 * Overlay Pills - Numbered info pills that appear on images
 * Layout determines positioning:
 * - tips: top-left, middle-right, bottom-left
 * - layers: top-right, middle-left, bottom-right
 * - care: top-left, top-right, bottom-left
 */
export function OverlayPills({ pills, layout }: OverlayPillsProps) {
  const getPositionClass = (index: number): string => {
    switch (layout) {
      case 'tips':
        if (index === 0) return 'top-3 left-3 lg:top-6 lg:left-6';
        if (index === 1) return 'top-1/3 right-3 lg:right-6';
        return 'bottom-3 left-3 lg:bottom-6 lg:left-6';
      case 'layers':
        if (index === 0) return 'top-3 right-3 lg:top-6 lg:right-6';
        if (index === 1) return 'top-1/2 -translate-y-1/2 left-3 lg:left-6';
        return 'bottom-3 right-3 lg:bottom-6 lg:right-6';
      case 'care':
        if (index === 0) return 'top-3 left-3 lg:top-6 lg:left-6';
        if (index === 1) return 'top-1/3 right-3 lg:right-6';
        return 'bottom-3 left-3 lg:bottom-6 lg:left-6';
      default:
        return '';
    }
  };
  
  const getAnimationDelay = (index: number): string => {
    const delays = ['0.1s', '0.25s', '0.4s'];
    return delays[index] || '0.1s';
  };
  
  return (
    <>
      {pills.map((pill, idx) => (
        <div 
          key={idx}
          className={`absolute ${getPositionClass(idx)} bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px]`}
          style={{ animation: `fadeSlideIn 0.4s ease-out ${getAnimationDelay(idx)} both` }}
        >
          <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
            <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">
              {pill.number}
            </span>
            <span className="text-[11px] lg:text-sm font-bold">{pill.title}</span>
          </div>
          <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">{pill.description}</p>
        </div>
      ))}
    </>
  );
}

interface SummaryHeadlineProps {
  headline?: string;
}

/**
 * Summary Headline - Top center headline for summary/packaging image
 */
export function SummaryHeadline({ headline = '5-Star Hotel Comfort at Home' }: SummaryHeadlineProps) {
  return (
    <div className="absolute top-4 left-0 right-0 text-center animate-[fadeSlideIn_0.3s_ease-out_0.1s_both]">
      <h3 className="text-lg lg:text-2xl font-bold text-foreground tracking-tight">{headline}</h3>
      <div className="inline-flex items-center gap-2 mt-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#00b67a">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          ))}
        </div>
        <span className="text-xs font-bold text-[#00b67a]">95/100</span>
        <span className="text-[10px] text-gray-500 font-medium">PureWow</span>
      </div>
    </div>
  );
}
