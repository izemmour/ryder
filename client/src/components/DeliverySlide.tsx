/**
 * DeliverySlide Component
 * 
 * Displays the FedEx delivery scene with "Free Shipping" and delivery time overlays.
 * Delivery time can be customized for different regions.
 * Design unified with CoupleSleepSlide cards.
 */

import { useState, useEffect, useRef } from 'react';
import { Truck, Clock } from 'lucide-react';

interface DeliverySlideProps {
  deliveryTime?: string; // e.g., "2-5 Business Days" for US, "7-14 Business Days" for international
  className?: string;
}

export default function DeliverySlide({ 
  deliveryTime = "2-5 Business Days",
  className = '' 
}: DeliverySlideProps) {
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
      {/* Background Image - Delivery scene */}
      <img
        src="/images/optimized/gallery/delivery-scene.webp"
        srcSet="/images/optimized/gallery/responsive/delivery-scene-200.webp 200w, /images/optimized/gallery/responsive/delivery-scene-400.webp 400w, /images/optimized/gallery/responsive/delivery-scene-800.webp 800w, /images/optimized/gallery/delivery-scene.webp 1024w"
        sizes="(max-width: 320px) 200px, (max-width: 480px) 400px, (max-width: 768px) 800px, 1024px"
        alt="FedEx delivery of FluffCo pillow to happy customer"
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Card 1 - Bottom Left: Free Shipping */}
      <div 
        className={`absolute bottom-3 left-3 lg:bottom-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '100ms' : '0ms' }}
      >
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
          <span 
            className="bg-[#2d3a5c] text-white rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
          >
            <Truck className="w-3 h-3" />
          </span>
          <span className="text-[11px] lg:text-sm font-bold">Free Shipping</span>
        </div>
        <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Delivered straight to your door</p>
      </div>

      {/* Card 2 - Bottom Right: Delivery Time */}
      <div 
        className={`absolute bottom-3 right-3 lg:bottom-6 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] transition-all duration-500 ${
          isInView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: isInView ? '250ms' : '0ms' }}
      >
        <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
          <span 
            className="bg-[#2d3a5c] text-white rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
          >
            <Clock className="w-3 h-3" />
          </span>
          <span className="text-[11px] lg:text-sm font-bold">{deliveryTime}</span>
        </div>
        <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Fast & reliable delivery</p>
      </div>
    </div>
  );
}

/**
 * Thumbnail component for the carousel
 */
export function DeliveryThumbnail() {
  return (
    <div className="w-full h-full relative">
      <img 
        src="/images/optimized/gallery/responsive/delivery-scene-100.webp" 
        alt="" 
        className="w-full h-full object-cover"
      />
    </div>
  );
}
