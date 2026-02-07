/**
 * CoupleSleepSlide Component
 * 
 * Displays the couple sleeping image (top of bed view) with 2 animated overlay cards at the top.
 * Cards animate on viewport entry with staggered delays.
 */

import { useState, useEffect, useRef } from 'react';

interface CoupleSleepSlideProps {
  className?: string;
}

export default function CoupleSleepSlide({ className = '' }: CoupleSleepSlideProps) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to trigger animations when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            // Reset animation when out of view so it plays again
            setIsInView(false);
          }
        });
      },
      { threshold: 0.3 } // Trigger when 30% visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-square overflow-hidden ${className}`}
    >
      {/* Background Image - Couple sleeping top view */}
      <img
        src="/images/optimized/events/black-friday-lifestyle-sleep-couple.webp"
        srcSet="/images/optimized/events/black-friday-lifestyle-sleep-couple-200.webp 200w, /images/optimized/events/black-friday-lifestyle-sleep-couple-400.webp 400w, /images/optimized/events/black-friday-lifestyle-sleep-couple-800.webp 800w, /images/optimized/events/black-friday-lifestyle-sleep-couple.webp 1024w"
        sizes="(max-width: 320px) 200px, (max-width: 480px) 400px, (max-width: 768px) 800px, 1024px"
        alt="Couple sleeping peacefully on FluffCo pillows"
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Card 1 - Top Left: Elevate Your Sleep Game */}
      <div 
        className={`absolute top-3 left-3 lg:top-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '100ms' : '0ms' }}
      >
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
          <span 
            className="bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold flex-shrink-0"
            style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
          >
            1
          </span>
          <span className="text-[11px] lg:text-sm font-bold">Elevate Your Sleep Game</span>
        </div>
        <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Get the same high quality 5-star pillows as the big luxury resorts</p>
      </div>

      {/* Card 2 - Top Right: Wake Up Rejuvenated */}
      <div 
        className={`absolute top-3 right-3 lg:top-6 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '250ms' : '0ms' }}
      >
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
          <span 
            className="bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold flex-shrink-0"
            style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
          >
            2
          </span>
          <span className="text-[11px] lg:text-sm font-bold">Wake Up Rejuvenated</span>
        </div>
        <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Clear-eyed, pain free, rested and ready for the day</p>
      </div>
    </div>
  );
}

/**
 * Thumbnail component for the carousel
 * Just shows the couple sleeping image without text overlay
 */
export function CoupleSleepThumbnail() {
  return (
    <div className="w-full h-full relative">
      <img 
        src="/images/optimized/events/black-friday-lifestyle-sleep-couple-100.webp" 
        alt="" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}
