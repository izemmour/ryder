import { useState, useEffect, useRef } from 'react';

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  /** Fetch priority for LCP images - use 'high' for hero/LCP images */
  fetchPriority?: 'high' | 'low' | 'auto';
  /** Optional low-quality placeholder - if not provided, uses a blurred tiny version */
  placeholder?: string;
  /** Blur amount in pixels for the placeholder */
  blurAmount?: number;
  /** Transition duration in ms */
  transitionDuration?: number;
  /** Callback when image is fully loaded */
  onLoad?: () => void;
  /** Optional srcset for responsive images */
  srcSet?: string;
  /** Optional sizes attribute for responsive images */
  sizes?: string;
}

// Map of responsive srcsets for key images (400w, 800w, full)
const RESPONSIVE_SRCSETS: Record<string, string> = {
  // Hero images
  '/images/optimized/hero/hero-pillow.webp': '/images/optimized/hero/responsive/hero-pillow-400.webp 400w, /images/optimized/hero/responsive/hero-pillow-600.webp 600w, /images/optimized/hero/responsive/hero-pillow-720.webp 720w, /images/optimized/hero/responsive/hero-pillow-800.webp 800w, /images/optimized/hero/hero-pillow.webp 1200w',
  '/images/optimized/hero/hero-pillow.png': '/images/optimized/hero/responsive/hero-pillow-400.webp 400w, /images/optimized/hero/responsive/hero-pillow-600.webp 600w, /images/optimized/hero/responsive/hero-pillow-720.webp 720w, /images/optimized/hero/responsive/hero-pillow-800.webp 800w, /images/optimized/hero/hero-pillow.webp 1200w',
  '/images/optimized/hero/lifestyle-sleep.webp': '/images/optimized/hero/responsive/lifestyle-sleep-400.webp 400w, /images/optimized/hero/responsive/lifestyle-sleep-800.webp 800w, /images/optimized/hero/lifestyle-sleep.webp 1200w',
  '/images/optimized/hero/lifestyle-sleep.png': '/images/optimized/hero/responsive/lifestyle-sleep-400.webp 400w, /images/optimized/hero/responsive/lifestyle-sleep-800.webp 800w, /images/optimized/hero/lifestyle-sleep.webp 1200w',
  // Testimonial images
  '/images/optimized/testimonials/testimonial-1.webp': '/images/optimized/testimonials/responsive/testimonial-1-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-1-800.webp 800w, /images/optimized/testimonials/testimonial-1.webp 1200w',
  '/images/optimized/testimonials/testimonial-1.png': '/images/optimized/testimonials/responsive/testimonial-1-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-1-800.webp 800w, /images/optimized/testimonials/testimonial-1.webp 1200w',
  '/images/optimized/testimonials/testimonial-2.webp': '/images/optimized/testimonials/responsive/testimonial-2-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-2-800.webp 800w, /images/optimized/testimonials/testimonial-2.webp 1200w',
  '/images/optimized/testimonials/testimonial-2.png': '/images/optimized/testimonials/responsive/testimonial-2-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-2-800.webp 800w, /images/optimized/testimonials/testimonial-2.webp 1200w',
  '/images/optimized/testimonials/testimonial-3.webp': '/images/optimized/testimonials/responsive/testimonial-3-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-3-800.webp 800w, /images/optimized/testimonials/testimonial-3.webp 1200w',
  '/images/optimized/testimonials/testimonial-3.png': '/images/optimized/testimonials/responsive/testimonial-3-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-3-800.webp 800w, /images/optimized/testimonials/testimonial-3.webp 1200w',
  '/images/optimized/testimonials/testimonial-4.webp': '/images/optimized/testimonials/responsive/testimonial-4-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-4-800.webp 800w, /images/optimized/testimonials/testimonial-4.webp 1200w',
  '/images/optimized/testimonials/testimonial-4.png': '/images/optimized/testimonials/responsive/testimonial-4-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-4-800.webp 800w, /images/optimized/testimonials/testimonial-4.webp 1200w',
  '/images/optimized/testimonials/testimonial-5.webp': '/images/optimized/testimonials/responsive/testimonial-5-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-5-800.webp 800w, /images/optimized/testimonials/testimonial-5.webp 1200w',
  '/images/optimized/testimonials/testimonial-5.png': '/images/optimized/testimonials/responsive/testimonial-5-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-5-800.webp 800w, /images/optimized/testimonials/testimonial-5.webp 1200w',
  '/images/optimized/testimonials/testimonial-6.webp': '/images/optimized/testimonials/responsive/testimonial-6-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-6-800.webp 800w, /images/optimized/testimonials/testimonial-6.webp 1200w',
  '/images/optimized/testimonials/testimonial-6.png': '/images/optimized/testimonials/responsive/testimonial-6-400.webp 400w, /images/optimized/testimonials/responsive/testimonial-6-800.webp 800w, /images/optimized/testimonials/testimonial-6.webp 1200w',
  // Benefit/gallery images
  '/images/optimized/benefits/engineering-detail-new.webp': '/images/optimized/benefits/responsive/engineering-detail-new-400.webp 400w, /images/optimized/benefits/responsive/engineering-detail-new-800.webp 800w, /images/optimized/benefits/engineering-detail-new.webp 1200w',
  '/images/optimized/benefits/engineering-detail-new.png': '/images/optimized/benefits/responsive/engineering-detail-new-400.webp 400w, /images/optimized/benefits/responsive/engineering-detail-new-800.webp 800w, /images/optimized/benefits/engineering-detail-new.webp 1200w',
  '/images/optimized/benefits/washing-machine.webp': '/images/optimized/benefits/responsive/washing-machine-400.webp 400w, /images/optimized/benefits/responsive/washing-machine-800.webp 800w, /images/optimized/benefits/washing-machine.webp 1200w',
  '/images/optimized/benefits/washing-machine.png': '/images/optimized/benefits/responsive/washing-machine-400.webp 400w, /images/optimized/benefits/responsive/washing-machine-800.webp 800w, /images/optimized/benefits/washing-machine.webp 1200w',
  '/images/optimized/benefits/hotel-comfort-packaging.webp': '/images/optimized/benefits/responsive/hotel-comfort-packaging-400.webp 400w, /images/optimized/benefits/responsive/hotel-comfort-packaging-800.webp 800w, /images/optimized/benefits/hotel-comfort-packaging.webp 1200w',
  '/images/optimized/benefits/hotel-comfort-packaging.png': '/images/optimized/benefits/responsive/hotel-comfort-packaging-400.webp 400w, /images/optimized/benefits/responsive/hotel-comfort-packaging-800.webp 800w, /images/optimized/benefits/hotel-comfort-packaging.webp 1200w',
};

// Map of available LQIP placeholders (tiny 20px versions)
// These are pre-generated tiny versions of key gallery images for smooth blur-up loading
const LQIP_PLACEHOLDERS: Record<string, string> = {
  // Hero images
  '/images/optimized/hero/hero-pillow.webp': '/images/optimized/placeholders/hero-pillow-placeholder.webp',
  '/images/optimized/hero/hero-pillow.png': '/images/optimized/placeholders/hero-pillow-placeholder.webp',
  '/images/optimized/hero/lifestyle-sleep.webp': '/images/optimized/placeholders/lifestyle-sleep-placeholder.webp',
  '/images/optimized/hero/lifestyle-sleep.png': '/images/optimized/placeholders/lifestyle-sleep-placeholder.webp',
  // Benefits/gallery images
  '/images/optimized/benefits/engineering-detail-new.webp': '/images/optimized/placeholders/engineering-detail-new-placeholder.webp',
  '/images/optimized/benefits/engineering-detail-new.png': '/images/optimized/placeholders/engineering-detail-new-placeholder.webp',
  '/images/optimized/benefits/washing-machine.webp': '/images/optimized/placeholders/washing-machine-placeholder.webp',
  '/images/optimized/benefits/washing-machine.png': '/images/optimized/placeholders/washing-machine-placeholder.webp',
  '/images/optimized/benefits/hotel-comfort-packaging.webp': '/images/optimized/placeholders/hotel-comfort-packaging-placeholder.webp',
  '/images/optimized/benefits/hotel-comfort-packaging.png': '/images/optimized/placeholders/hotel-comfort-packaging-placeholder.webp',
  // Setup images (product selection area)
  '/images/optimized/setup/setup-1-pillow.webp': '/images/optimized/placeholders/setup-1-pillow-placeholder.webp',
  '/images/optimized/setup/setup-1-pillow.png': '/images/optimized/placeholders/setup-1-pillow-placeholder.webp',
  '/images/optimized/setup/setup-2-pillows.webp': '/images/optimized/placeholders/setup-2-pillows-placeholder.webp',
  '/images/optimized/setup/setup-2-pillows.png': '/images/optimized/placeholders/setup-2-pillows-placeholder.webp',
  '/images/optimized/setup/setup-4-pillows.webp': '/images/optimized/placeholders/setup-4-pillows-placeholder.webp',
  '/images/optimized/setup/setup-4-pillows.png': '/images/optimized/placeholders/setup-4-pillows-placeholder.webp',
  // Testimonial images (above the fold)
  '/images/optimized/testimonials/testimonial-1.webp': '/images/optimized/placeholders/testimonial-1-placeholder.webp',
  '/images/optimized/testimonials/testimonial-1.png': '/images/optimized/placeholders/testimonial-1-placeholder.webp',
  '/images/optimized/testimonials/testimonial-2.webp': '/images/optimized/placeholders/testimonial-2-placeholder.webp',
  '/images/optimized/testimonials/testimonial-2.png': '/images/optimized/placeholders/testimonial-2-placeholder.webp',
  '/images/optimized/testimonials/testimonial-3.webp': '/images/optimized/placeholders/testimonial-3-placeholder.webp',
  '/images/optimized/testimonials/testimonial-3.png': '/images/optimized/placeholders/testimonial-3-placeholder.webp',
  '/images/optimized/testimonials/testimonial-4.webp': '/images/optimized/placeholders/testimonial-4-placeholder.webp',
  '/images/optimized/testimonials/testimonial-4.png': '/images/optimized/placeholders/testimonial-4-placeholder.webp',
  '/images/optimized/testimonials/testimonial-5.webp': '/images/optimized/placeholders/testimonial-5-placeholder.webp',
  '/images/optimized/testimonials/testimonial-5.png': '/images/optimized/placeholders/testimonial-5-placeholder.webp',
  '/images/optimized/testimonials/testimonial-6.webp': '/images/optimized/placeholders/testimonial-6-placeholder.webp',
  '/images/optimized/testimonials/testimonial-6.png': '/images/optimized/placeholders/testimonial-6-placeholder.webp',
  '/images/optimized/testimonials/testimonial-7.webp': '/images/optimized/placeholders/testimonial-7-placeholder.webp',
  '/images/optimized/testimonials/testimonial-7.png': '/images/optimized/placeholders/testimonial-7-placeholder.webp',
  '/images/optimized/testimonials/testimonial-8.webp': '/images/optimized/placeholders/testimonial-8-placeholder.webp',
  '/images/optimized/testimonials/testimonial-8.png': '/images/optimized/placeholders/testimonial-8-placeholder.webp',
};

/**
 * Get the WebP version of an image path if it exists
 */
function getWebPSrc(src: string): string {
  // If already WebP, return as-is
  if (src.endsWith('.webp')) return src;
  
  // Convert to WebP path
  return src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
}

/**
 * BlurImage - Progressive image loading with blur-up effect
 * Shows a blurred placeholder while the full image loads, then smoothly transitions
 * 
 * Features:
 * - LQIP (Low Quality Image Placeholder) support with tiny pre-generated images
 * - Automatic WebP format detection and usage
 * - Smooth blur-to-sharp transition
 * - Shimmer animation while loading
 */
export function BlurImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
  placeholder,
  blurAmount = 20,
  transitionDuration = 500,
  onLoad,
  srcSet,
  sizes,
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // Get LQIP placeholder if available
  const lqipPlaceholder = placeholder || LQIP_PLACEHOLDERS[src] || LQIP_PLACEHOLDERS[getWebPSrc(src)];
  
  // Use WebP version if available
  const webpSrc = getWebPSrc(src);

  // Check if image is already cached
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current?.naturalHeight > 0) {
      setIsLoaded(true);
      // Delay hiding placeholder for smooth transition
      setTimeout(() => setShowPlaceholder(false), transitionDuration);
      onLoad?.();
    }
  }, [src, transitionDuration, onLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    // Delay hiding placeholder for smooth transition
    setTimeout(() => setShowPlaceholder(false), transitionDuration);
    onLoad?.();
  };

  // Generate a simple color placeholder based on the image path
  const getPlaceholderColor = () => {
    // Use a warm neutral color that works well with pillow/bedding imagery
    return '#e8e4df';
  };

  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* Placeholder layer - either LQIP image or solid color */}
      {showPlaceholder && (
        <div
          className="absolute inset-0 transition-opacity"
          style={{
            backgroundColor: lqipPlaceholder ? undefined : getPlaceholderColor(),
            backgroundImage: lqipPlaceholder ? `url(${lqipPlaceholder})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(${blurAmount}px)`,
            transform: 'scale(1.1)', // Prevent blur edge artifacts
            opacity: isLoaded ? 0 : 1,
            transitionDuration: `${transitionDuration}ms`,
          }}
        />
      )}
      
      {/* Shimmer animation while loading */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
          style={{
            backgroundSize: '200% 100%',
          }}
        />
      )}
      
      {/* Main image with picture element for WebP support and responsive srcset */}
      <picture>
        {webpSrc !== src && (
          <source 
            srcSet={srcSet || RESPONSIVE_SRCSETS[src] || RESPONSIVE_SRCSETS[webpSrc] || webpSrc} 
            type="image/webp"
            sizes={sizes || '(max-width: 480px) 400px, (max-width: 768px) 800px, 1200px'}
          />
        )}
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`${className} transition-opacity`}
          style={{
            opacity: isLoaded ? 1 : 0,
            transitionDuration: `${transitionDuration}ms`,
          }}
          loading={loading}
          fetchPriority={fetchPriority}
          onLoad={handleLoad}
          srcSet={srcSet || RESPONSIVE_SRCSETS[src]}
          sizes={sizes || '(max-width: 480px) 400px, (max-width: 768px) 800px, 1200px'}
        />
      </picture>
    </div>
  );
}

/**
 * Helper to create tiny placeholder URLs for LQIP
 * Returns the pre-generated placeholder if available, otherwise undefined
 */
export function getTinyPlaceholder(src: string): string | undefined {
  return LQIP_PLACEHOLDERS[src] || LQIP_PLACEHOLDERS[getWebPSrc(src)];
}

export default BlurImage;
