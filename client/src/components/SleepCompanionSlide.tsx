/**
 * SleepCompanionSlide Component
 * 
 * Displays the sunrise sleep scene with woman wearing blue sleep mask.
 * Features animated badges arranged on a circular arc from top-right to bottom-left:
 * Sound Sleep, Skin Friendly, Breathable, Ethically Sourced
 * Design unified with FluffCo brand direction.
 */

import { useState, useEffect, useRef } from 'react';
import { Moon, Heart, Leaf, Wind } from 'lucide-react';

interface SleepCompanionSlideProps {
  className?: string;
}

export default function SleepCompanionSlide({ className = '' }: SleepCompanionSlideProps) {
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
            setIsInView(false);
          }
        });
      },
      { threshold: 0.3 }
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
      {/* Background Image - Sunrise sleep scene */}
      <img
        src="/images/optimized/gallery/sunrise-sleep-woman.webp"
        srcSet="/images/optimized/gallery/responsive/sunrise-sleep-woman-200.webp 200w, /images/optimized/gallery/responsive/sunrise-sleep-woman-400.webp 400w, /images/optimized/gallery/responsive/sunrise-sleep-woman-800.webp 800w, /images/optimized/gallery/sunrise-sleep-woman.webp 1024w"
        sizes="(max-width: 320px) 200px, (max-width: 480px) 400px, (max-width: 768px) 800px, 1024px"
        alt="Woman peacefully sleeping at sunrise with FluffCo pillow"
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Title - Top Left - No italic */}
      <div 
        className={`absolute top-3 left-3 lg:top-6 lg:left-6 max-w-[160px] lg:max-w-[200px] transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '0ms' : '0ms' }}
      >
        <p className="text-[#2d3a5c] text-sm lg:text-lg font-light leading-tight">Not Just A Pillow,</p>
        <p className="text-[#2d3a5c] text-base lg:text-xl font-bold leading-tight">But A Sleeping Companion</p>
      </div>

      {/* Badges arranged on circular arc from top-right to bottom-left */}
      
      {/* Badge 1 - Sound Sleep - Top Right (start of arc) */}
      <div 
        className={`absolute top-[12%] right-[8%] lg:top-[10%] lg:right-[6%] bg-[#2d3a5c] text-white px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-lg lg:rounded-xl shadow-lg transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-4'
        }`}
        style={{ transitionDelay: isInView ? '100ms' : '0ms' }}
      >
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="text-[11px] lg:text-sm font-semibold">Sound Sleep</span>
        </div>
      </div>

      {/* Badge 2 - Skin Friendly - Upper right area (continuing arc) */}
      <div 
        className={`absolute top-[32%] right-[5%] lg:top-[30%] lg:right-[4%] bg-[#2d3a5c] text-white px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-lg lg:rounded-xl shadow-lg transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-4'
        }`}
        style={{ transitionDelay: isInView ? '200ms' : '0ms' }}
      >
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="text-[11px] lg:text-sm font-semibold">Skin Friendly</span>
        </div>
      </div>

      {/* Badge 3 - Breathable - Middle area (arc continues) */}
      <div 
        className={`absolute bottom-[24%] left-[40%] lg:bottom-[24%] lg:left-[40%] bg-[#2d3a5c] text-white px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-lg lg:rounded-xl shadow-lg transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '300ms' : '0ms' }}
      >
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="text-[11px] lg:text-sm font-semibold">Breathable</span>
        </div>
      </div>

      {/* Badge 4 - Ethically Sourced - Bottom Left (end of arc) */}
      <div 
        className={`absolute bottom-[15%] left-[8%] lg:bottom-[12%] lg:left-[6%] bg-[#2d3a5c] text-white px-2.5 py-2 lg:px-3 lg:py-2.5 rounded-lg lg:rounded-xl shadow-lg transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '400ms' : '0ms' }}
      >
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="text-[11px] lg:text-sm font-semibold">Ethically Sourced</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Thumbnail component for the carousel
 */
export function SleepCompanionThumbnail() {
  return (
    <div className="w-full h-full relative">
      <img 
        src="/images/optimized/gallery/responsive/sunrise-sleep-woman-100.webp" 
        alt="" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}
