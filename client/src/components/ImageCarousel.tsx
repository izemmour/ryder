/**
 * ImageCarousel Component
 * 
 * A reusable image carousel with native horizontal scrolling, 1:1 touch tracking,
 * and snap-to-slide behavior (like iOS Photos app).
 * 
 * Features:
 * - Native CSS scroll-snap for smooth slide transitions
 * - 1:1 finger tracking during swipe
 * - Momentum scrolling with natural deceleration
 * - Thumbnail navigation with active indicators
 * - Responsive design (mobile + desktop)
 * 
 * Usage:
 *   <ImageCarousel
 *     images={[
 *       { src: '/image1.jpg', alt: 'Description', thumbnail: <CustomThumbnail /> },
 *       { src: '/image2.jpg', alt: 'Description' }
 *     ]}
 *     aspectRatio="4/3"
 *     showThumbnails={true}
 *   />
 */

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselImage {
  /** Image source URL or component (for custom slides like comparison tables) */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** srcset for responsive images */
  srcset?: string;
  /** sizes attribute for responsive images */
  sizes?: string;
  /** Custom slide content (overrides src if provided) */
  content?: ReactNode;
  /** Custom thumbnail component (optional) */
  thumbnail?: ReactNode;
}

interface ImageCarouselProps {
  /** Array of images/slides to display */
  images: CarouselImage[];
  /** Aspect ratio for the carousel container (e.g., "4/3", "16/9") */
  aspectRatio?: string;
  /** Whether to show thumbnail navigation (default: true) */
  showThumbnails?: boolean;
  /** Whether to show arrow navigation on desktop (default: true) */
  showArrows?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Callback when active slide changes */
  onSlideChange?: (index: number) => void;
  /** Custom gradient color for event themes (defaults to 'background' CSS variable) */
  gradientColor?: string;
}

export function ImageCarousel({
  images,
  aspectRatio = '4/3',
  showThumbnails = true,
  showArrows = true,
  className = '',
  onSlideChange,
  gradientColor
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isWheelNavigatingRef = useRef(false);

  // Handle scroll to update active index
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const slideWidth = container.clientWidth;
    const scrollLeft = container.scrollLeft;
    const newIndex = Math.round(scrollLeft / slideWidth);
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
      onSlideChange?.(newIndex);
      
      // Auto-scroll thumbnail into view
      scrollThumbnailIntoView(newIndex);
    }
  };

  // Auto-scroll thumbnail to keep active one visible
  const scrollThumbnailIntoView = (index: number) => {
    if (!thumbnailContainerRef.current) return;
    
    const container = thumbnailContainerRef.current;
    const thumbnail = container.children[index] as HTMLElement;
    if (!thumbnail) return;
    
    const containerRect = container.getBoundingClientRect();
    const thumbnailRect = thumbnail.getBoundingClientRect();
    
    // Check if thumbnail is out of view or near the edges (with 50px buffer)
    const buffer = 50;
    const isOutOfViewLeft = thumbnailRect.left < containerRect.left + buffer;
    const isOutOfViewRight = thumbnailRect.right > containerRect.right - buffer;
    
    if (isOutOfViewLeft || isOutOfViewRight) {
      // Scroll to center the thumbnail
      const scrollLeft = thumbnail.offsetLeft - (container.clientWidth / 2) + (thumbnail.clientWidth / 2);
      container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Update gradient visibility based on thumbnail scroll position
  const updateThumbnailGradients = () => {
    if (!thumbnailContainerRef.current) return;
    
    const container = thumbnailContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    setShowLeftGradient(scrollLeft > 10);
    setShowRightGradient(scrollLeft < maxScroll - 10);
  };

  // Navigate to specific slide
  const navigateTo = (index: number) => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const slideWidth = container.clientWidth;
    container.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    });
  };

  // Arrow navigation
  const navigatePrev = () => {
    const newIndex = Math.max(0, activeIndex - 1);
    navigateTo(newIndex);
  };

  const navigateNext = () => {
    const newIndex = Math.min(images.length - 1, activeIndex + 1);
    navigateTo(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigatePrev();
      if (e.key === 'ArrowRight') navigateNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, images.length]);

  // Wheel event handler for controlled desktop navigation
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scrolling or shift+vertical scrolling
      const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!isHorizontalScroll) return;

      // Prevent default browser scroll
      e.preventDefault();

      // Debounce wheel events to prevent multiple navigations
      if (isWheelNavigatingRef.current) return;

      const delta = e.deltaX || e.deltaY;
      const threshold = 30; // Minimum scroll distance to trigger navigation

      if (Math.abs(delta) > threshold) {
        isWheelNavigatingRef.current = true;

        if (delta > 0) {
          navigateNext();
        } else {
          navigatePrev();
        }

        // Reset navigation flag after animation completes
        if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
        wheelTimeoutRef.current = setTimeout(() => {
          isWheelNavigatingRef.current = false;
        }, 500);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, [activeIndex, images.length]);

  // Initialize and update thumbnail gradients
  useEffect(() => {
    updateThumbnailGradients();
    
    const container = thumbnailContainerRef.current;
    if (!container) return;
    
    container.addEventListener('scroll', updateThumbnailGradients);
    window.addEventListener('resize', updateThumbnailGradients);
    
    return () => {
      container.removeEventListener('scroll', updateThumbnailGradients);
      window.removeEventListener('resize', updateThumbnailGradients);
    };
  }, [images.length]);

  return (
    <div className={`relative ${className}`}>
      {/* Main Carousel */}
      <div 
        className="relative w-full overflow-hidden rounded-lg"
        style={{ aspectRatio }}
      >
        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-hide h-full"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth'
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="w-full h-full flex-shrink-0 snap-center relative"
            >
              {image.content ? (
                // Custom slide content
                <div className="w-full h-full">
                  {image.content}
                </div>
              ) : (
                // Standard image slide
                <img
                  src={image.src}
                  srcSet={image.srcset}
                  sizes={image.sizes || '(max-width: 480px) 400px, 600px'}
                  alt={image.alt || `Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}
            </div>
          ))}
        </div>

        {/* Arrow Navigation (Desktop Only) */}
        {showArrows && images.length > 1 && (
          <>
            <button
              onClick={navigatePrev}
              disabled={activeIndex === 0}
              className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-[#2d3a5c]" />
            </button>
            <button
              onClick={navigateNext}
              disabled={activeIndex === images.length - 1}
              className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-[#2d3a5c]" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && images.length > 1 && (
        <div className="relative mt-4">
          {/* Left Gradient */}
          {showLeftGradient && (
            <div 
              className={`absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none ${!gradientColor ? 'bg-gradient-to-r from-background to-transparent' : ''}`}
              style={gradientColor ? {
                background: `linear-gradient(to right, ${gradientColor}, transparent)`
              } : undefined}
            />
          )}
          
          {/* Right Gradient */}
          {showRightGradient && (
            <div 
              className={`absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none ${!gradientColor ? 'bg-gradient-to-l from-background to-transparent' : ''}`}
              style={gradientColor ? {
                background: `linear-gradient(to left, ${gradientColor}, transparent)`
              } : undefined}
            />
          )}
          
          <div 
            ref={thumbnailContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide"
          >
            {images.map((image, index) => (
            <button
              key={index}
              onClick={() => navigateTo(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === index
                  ? 'border-foreground'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {image.thumbnail ? (
                // Custom thumbnail
                <div className="w-full h-full">
                  {image.thumbnail}
                </div>
              ) : image.content ? (
                // Thumbnail for custom content (show miniature version)
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                  {index + 1}
                </div>
              ) : (
                // Standard image thumbnail
                <img
                  src={image.src}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;
