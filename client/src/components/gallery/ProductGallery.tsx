/**
 * ProductGallery Component
 * 
 * A reusable gallery component that maintains consistent structure across all landing pages
 * while allowing customization of text content (pills, headlines) per angle page.
 * 
 * GALLERY SLOTS:
 * 1. INTRO - Hero pillow with Oprah Daily badge, Trial badge, and Award carousel
 * 2. TIPS - Lifestyle image with 3 customizable tip pills
 * 3. LAYERS - Engineering detail with 3 customizable layer pills
 * 4. VS - Standard vs FluffCo comparison slide (fixed content)
 * 5. CARE - Washing machine with 3 customizable care pills
 * 6. HOTEL_COMPARE - Price comparison vs hotels (fixed content)
 * 7. SUMMARY - Hotel comfort packaging with customizable headline
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { GallerySlotConfig, GallerySlotType, OverlayPill, AwardItem } from './types';
import { 
  DEFAULT_SLOT_IMAGES, 
  DEFAULT_THUMBNAIL_TAGS, 
  DEFAULT_TIPS_PILLS, 
  DEFAULT_LAYERS_PILLS, 
  DEFAULT_CARE_PILLS,
  DEFAULT_AWARDS,
  STANDARD_GALLERY_ORDER 
} from './types';
import { ComparisonSlide, HotelComparisonSlide, ComparisonThumbnail, HotelComparisonThumbnail } from './ComparisonSlides';
import { OprahDailyBadge, AwardCarousel, TrialBadge, OverlayPills, SummaryHeadline } from './GalleryOverlays';

export interface ProductGalleryProps {
  /** Configuration ID for unique element IDs */
  configId?: string;
  /** Custom slot configurations - override default images/text */
  slots?: Partial<Record<GallerySlotType, GallerySlotConfig>>;
  /** Custom gallery order - reorder or omit slots */
  order?: GallerySlotType[];
  /** Custom awards list for the carousel */
  awards?: AwardItem[];
  /** Callback when active image changes */
  onImageChange?: (index: number) => void;
  /** Initial active image index */
  initialIndex?: number;
}

/**
 * Get the image source for a slot, using custom config or default
 */
function getSlotImage(type: GallerySlotType, slots?: Partial<Record<GallerySlotType, GallerySlotConfig>>): string {
  const customConfig = slots?.[type];
  return customConfig?.image || DEFAULT_SLOT_IMAGES[type];
}

/**
 * Get the thumbnail tag for a slot, using custom config or default
 */
function getSlotThumbnailTag(type: GallerySlotType, slots?: Partial<Record<GallerySlotType, GallerySlotConfig>>): string {
  const customConfig = slots?.[type];
  return customConfig?.thumbnailTag || DEFAULT_THUMBNAIL_TAGS[type];
}

/**
 * Get the pills for a slot, using custom config or default
 */
function getSlotPills(type: GallerySlotType, slots?: Partial<Record<GallerySlotType, GallerySlotConfig>>): OverlayPill[] {
  const customConfig = slots?.[type];
  if (customConfig?.pills) return customConfig.pills;
  
  switch (type) {
    case 'tips': return DEFAULT_TIPS_PILLS;
    case 'layers': return DEFAULT_LAYERS_PILLS;
    case 'care': return DEFAULT_CARE_PILLS;
    default: return [];
  }
}

/**
 * ProductGallery - Main gallery component
 */
export function ProductGallery({
  configId = 'default',
  slots,
  order = STANDARD_GALLERY_ORDER,
  awards = DEFAULT_AWARDS,
  onImageChange,
  initialIndex = 0,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  
  // Build gallery images array based on order
  const galleryImages = order.map(type => getSlotImage(type, slots));
  
  // Preload all images on mount
  useEffect(() => {
    const imagesToPreload = galleryImages.filter(img => img !== 'comparison' && img !== 'hotel-comparison');
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.onload = () => {
        setPreloadedImages(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.add(src);
          return newSet;
        });
      };
      img.src = src;
    });
  }, []);
  
  // Handle image loading state
  useEffect(() => {
    const currentImage = galleryImages[activeIndex];
    if (currentImage === 'comparison' || currentImage === 'hotel-comparison') {
      setImageLoaded(true);
    } else if (preloadedImages.has(currentImage)) {
      setImageLoaded(true);
    } else {
      setImageLoaded(false);
    }
  }, [activeIndex, preloadedImages, galleryImages]);
  
  // Notify parent of image change
  useEffect(() => {
    onImageChange?.(activeIndex);
  }, [activeIndex, onImageChange]);
  
  const handlePrevImage = () => {
    setActiveIndex(prev => prev === 0 ? galleryImages.length - 1 : prev - 1);
  };
  
  const handleNextImage = () => {
    setActiveIndex(prev => (prev + 1) % galleryImages.length);
  };
  
  const currentSlotType = order[activeIndex];
  const currentImage = galleryImages[activeIndex];
  
  return (
    <div className="w-full">
      {/* Main Gallery Image */}
      <div className="relative aspect-square bg-[#f5f5f0] rounded-xl lg:rounded-2xl overflow-hidden">
        {/* Loading skeleton */}
        {!imageLoaded && currentImage !== 'comparison' && currentImage !== 'hotel-comparison' && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Render based on slot type */}
        {currentImage === 'comparison' ? (
          <ComparisonSlide />
        ) : currentImage === 'hotel-comparison' ? (
          <HotelComparisonSlide />
        ) : (
          <>
            <img
              src={currentImage}
              alt="Product gallery"
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Slot-specific overlays */}
            {currentSlotType === 'intro' && (
              <>
                <OprahDailyBadge configId={configId} />
                <TrialBadge />
                <AwardCarousel awards={awards} position="bottom" />
              </>
            )}
            
            {currentSlotType === 'tips' && (
              <OverlayPills pills={getSlotPills('tips', slots)} layout="tips" />
            )}
            
            {currentSlotType === 'layers' && (
              <OverlayPills pills={getSlotPills('layers', slots)} layout="layers" />
            )}
            
            {currentSlotType === 'care' && (
              <OverlayPills pills={getSlotPills('care', slots)} layout="care" />
            )}
            
            {currentSlotType === 'summary' && (
              <SummaryHeadline headline={slots?.summary?.headline} />
            )}
          </>
        )}
        
        {/* Navigation arrows */}
        <button
          onClick={handlePrevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 lg:w-10 lg:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      
      {/* Thumbnail Gallery */}
      <div className="mt-3 lg:mt-4 flex gap-2 lg:gap-3 overflow-x-auto pb-2">
        {order.map((type, idx) => {
          const image = getSlotImage(type, slots);
          const tag = getSlotThumbnailTag(type, slots);
          const isActive = idx === activeIndex;
          
          return (
            <button
              key={`${type}-${idx}`}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-14 h-14 lg:w-16 lg:h-16 rounded-lg overflow-hidden transition-all ${
                isActive 
                  ? 'ring-2 ring-[#2d3a5c] ring-offset-2' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {/* Thumbnail content */}
              {image === 'comparison' ? (
                <ComparisonThumbnail />
              ) : image === 'hotel-comparison' ? (
                <HotelComparisonThumbnail />
              ) : (
                <img
                  src={image}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Tag indicator */}
              <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-0.5">
                <span className="text-[7px] font-semibold text-[#2d3a5c]">{tag}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ProductGallery;
