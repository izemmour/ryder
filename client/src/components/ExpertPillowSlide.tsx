/**
 * Expert Pillow Slide Component
 * 
 * Displays the pillow on feather background with text overlays
 * and a magnifying glass effect on the pillow corner.
 * Texts are customizable for different languages.
 * 
 * Animations trigger when the component enters the viewport.
 */

import { useState, useEffect, useRef } from 'react';

interface ExpertPillowSlideProps {
  // Text labels - customizable for different languages
  topLabel?: {
    title: string;
    subtitle: string;
    detail?: string;
  };
  leftLabel?: {
    title: string;
    subtitle: string;
  };
  rightLabel?: {
    title: string;
    subtitle: string;
  };
  bottomLabel?: {
    title: string;
    subtitle: string;
    detail?: string;
  };
  className?: string;
}

export default function ExpertPillowSlide({
  topLabel = {
    title: 'ULTRA-RESISTANT SHELL',
    subtitle: 'Pure Combed Cotton',
    detail: '(300 Thread Count)'
  },
  leftLabel = {
    title: 'EXCEPTIONAL COMFORT',
    subtitle: 'Perfect for All Sleep Positions'
  },
  rightLabel = {
    title: 'PREMIUM QUALITY',
    subtitle: 'Built to Last for Years'
  },
  bottomLabel = {
    title: '100% MICROFIBER FILL',
    subtitle: 'Hypoallergenic & Cruelty-Free',
    detail: 'For Unmatched Softness'
  },
  className = ''
}: ExpertPillowSlideProps) {
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

  // Circle position: mathematically centered on pillow corner
  const circleCenter = { x: 50, y: 69 };
  const circleRadius = 12; // percentage of container

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-square overflow-hidden ${className}`}
    >
      {/* Background Image */}
      <img
        src="/images/optimized/expert/expert-pillow-feathers.webp"
        srcSet="/images/optimized/expert/expert-pillow-feathers-200.webp 200w, /images/optimized/expert/expert-pillow-feathers-400.webp 400w, /images/optimized/expert/expert-pillow-feathers-800.webp 800w, /images/optimized/expert/expert-pillow-feathers.webp 2048w"
        sizes="(max-width: 320px) 200px, (max-width: 480px) 400px, (max-width: 768px) 800px, 2048px"
        alt="FluffCo pillow on feather background"
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Circle highlight on Pillow Corner */}
      <div 
        className={`absolute rounded-full border-2 border-[#2d3a5c] bg-transparent transition-all duration-700 ease-out ${
          isInView 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-50'
        }`}
        style={{
          left: `${circleCenter.x}%`,
          top: `${circleCenter.y}%`,
          transform: 'translate(-50%, -50%)',
          width: 'min(140px, 25%)',
          height: 'min(140px, 25%)',
        }}
      />

      {/* Connection dots from loupe to labels */}
      <svg 
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${
          isInView ? 'opacity-100' : 'opacity-0'
        }`} 
        style={{ zIndex: 5, transitionDelay: '300ms' }}
      >
        {/* Top dot - at circle top edge */}
        <circle cx={`${circleCenter.x}%`} cy={`${circleCenter.y - circleRadius}%`} r="4" fill="#2d3a5c" />
        {/* Left dot - at circle left edge */}
        <circle cx={`${circleCenter.x - circleRadius}%`} cy={`${circleCenter.y}%`} r="4" fill="#2d3a5c" />
        {/* Right dot - at circle right edge */}
        <circle cx={`${circleCenter.x + circleRadius}%`} cy={`${circleCenter.y}%`} r="4" fill="#2d3a5c" />
        {/* Bottom dot - at circle bottom edge */}
        <circle cx={`${circleCenter.x}%`} cy={`${circleCenter.y + circleRadius}%`} r="4" fill="#2d3a5c" />
      </svg>

      {/* Top Label */}
      <div 
        className={`absolute text-center transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-6'
        }`}
        style={{
          top: '38%',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '80%',
          transitionDelay: isInView ? '400ms' : '0ms'
        }}
      >
        <div className="text-[#2d3a5c] font-bold text-xs sm:text-sm tracking-wider uppercase">
          {topLabel.title}
        </div>
        <div className="text-[#2d3a5c]/80 text-[10px] sm:text-xs mt-0.5">
          {topLabel.subtitle}
        </div>
        {topLabel.detail && (
          <div className="text-[#2d3a5c]/60 text-[10px] sm:text-xs">
            {topLabel.detail}
          </div>
        )}
      </div>

      {/* Left Label */}
      <div 
        className={`absolute text-right transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 -translate-x-8'
        }`}
        style={{
          left: '4%',
          top: `${circleCenter.y - 5}%`,
          maxWidth: '30%',
          transitionDelay: isInView ? '500ms' : '0ms'
        }}
      >
        <div className="text-[#2d3a5c] font-bold text-xs sm:text-sm tracking-wider uppercase leading-tight">
          {leftLabel.title}
        </div>
        <div className="text-[#2d3a5c]/80 text-[10px] sm:text-xs mt-0.5 leading-tight">
          {leftLabel.subtitle}
        </div>
      </div>

      {/* Right Label */}
      <div 
        className={`absolute text-left transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-8'
        }`}
        style={{
          right: '4%',
          top: `${circleCenter.y - 5}%`,
          maxWidth: '30%',
          transitionDelay: isInView ? '600ms' : '0ms'
        }}
      >
        <div className="text-[#2d3a5c] font-bold text-xs sm:text-sm tracking-wider uppercase leading-tight">
          {rightLabel.title}
        </div>
        <div className="text-[#2d3a5c]/80 text-[10px] sm:text-xs mt-0.5 leading-tight">
          {rightLabel.subtitle}
        </div>
      </div>

      {/* Bottom Label */}
      <div 
        className={`absolute text-center transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-6'
        }`}
        style={{
          bottom: '4%',
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '80%',
          transitionDelay: isInView ? '700ms' : '0ms'
        }}
      >
        <div className="text-[#2d3a5c] font-bold text-xs sm:text-sm tracking-wider uppercase">
          {bottomLabel.title}
        </div>
        <div className="text-[#2d3a5c]/80 text-[10px] sm:text-xs mt-0.5">
          {bottomLabel.subtitle}
        </div>
        {bottomLabel.detail && (
          <div className="text-[#2d3a5c]/60 text-[10px] sm:text-xs">
            {bottomLabel.detail}
          </div>
        )}
      </div>
    </div>
  );
}


/**
 * Thumbnail component for ExpertPillowSlide
 * Shows a miniature version with the circle highlight
 */
export function ExpertPillowThumbnail() {
  // Same circle position as main slide
  const circleCenter = { x: 50, y: 69 };
  
  return (
    <div className="w-full h-full relative">
      <img 
        src="/images/optimized/expert/expert-pillow-feathers-100.webp" 
        alt="" 
        className="w-full h-full object-cover"
      />
      {/* Mini circle highlight - scaled for thumbnail */}
      <div 
        className="absolute rounded-full border border-[#2d3a5c] bg-transparent"
        style={{
          left: `${circleCenter.x}%`,
          top: `${circleCenter.y}%`,
          transform: 'translate(-50%, -50%)',
          width: '25%',
          height: '25%',
        }}
      />
    </div>
  );
}
