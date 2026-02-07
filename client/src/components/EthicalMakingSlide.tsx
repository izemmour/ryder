/**
 * EthicalMakingSlide Component
 * 
 * Displays the US factory scene with pillow making.
 * Features animated badges: Vegan Microfiber, Allergy-Free, Ethically Made
 * Design matches main gallery slide 2 style.
 */

import { useState, useEffect, useRef } from 'react';
import { Leaf, Shield, Heart } from 'lucide-react';

interface EthicalMakingSlideProps {
  className?: string;
}

export default function EthicalMakingSlide({ className = '' }: EthicalMakingSlideProps) {
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
      {/* Background Image - Factory scene */}
      <img
        src="/images/optimized/gallery/factory-pillow-making.webp"
        srcSet="/images/optimized/gallery/responsive/factory-pillow-making-200.webp 200w, /images/optimized/gallery/responsive/factory-pillow-making-400.webp 400w, /images/optimized/gallery/responsive/factory-pillow-making-800.webp 800w, /images/optimized/gallery/factory-pillow-making.webp 1024w"
        sizes="(max-width: 320px) 200px, (max-width: 480px) 400px, (max-width: 768px) 800px, 1024px"
        alt="American factory worker crafting FluffCo pillow"
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Title - Top Left */}
      <div 
        className={`absolute top-3 left-3 lg:top-6 lg:left-6 max-w-[180px] lg:max-w-[220px] transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '0ms' : '0ms' }}
      >
        <p className="text-[#2d3a5c] text-sm lg:text-lg font-light leading-tight">Soft, Plush, and</p>
        <p className="text-[#2d3a5c] text-base lg:text-xl font-bold leading-tight">Ethically Made</p>
      </div>

      {/* Card 1 - Top Right: Vegan Microfiber */}
      <div 
        className={`absolute top-3 right-3 lg:top-6 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-4'
        }`}
        style={{ transitionDelay: isInView ? '100ms' : '0ms' }}
      >
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
          <span 
            className="bg-[#2d3a5c] text-white rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
          >
            <Leaf className="w-3 h-3" />
          </span>
          <span className="text-[11px] lg:text-sm font-bold">Vegan Microfiber</span>
        </div>
        <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Feels just like down, without the feathers</p>
      </div>

      {/* Card 2 - Bottom Left: Allergy-Free */}
      <div 
        className={`absolute bottom-12 left-3 lg:bottom-16 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '200ms' : '0ms' }}
      >
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
          <span 
            className="bg-[#2d3a5c] text-white rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
          >
            <Shield className="w-3 h-3" />
          </span>
          <span className="text-[11px] lg:text-sm font-bold">Allergy-Free</span>
        </div>
        <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">No allergies, no guilt, just comfort</p>
      </div>

      {/* Card 3 - Bottom Right: Ethically Made */}
      <div 
        className={`absolute bottom-3 right-3 lg:bottom-6 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '300ms' : '0ms' }}
      >
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
          <span 
            className="bg-[#2d3a5c] text-white rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
          >
            <Heart className="w-3 h-3" />
          </span>
          <span className="text-[11px] lg:text-sm font-bold">Ethically Made</span>
        </div>
        <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Made in USA with pride</p>
      </div>
    </div>
  );
}

/**
 * Thumbnail component for the carousel
 */
export function EthicalMakingThumbnail() {
  return (
    <div className="w-full h-full relative">
      <img 
        src="/images/optimized/gallery/responsive/factory-pillow-making-100.webp" 
        alt="" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}
