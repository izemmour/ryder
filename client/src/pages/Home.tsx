/**
 * RESTORATIVE ALIGNMENT PILLOW - Enhanced PDP Landing Page
 * 
 * UI Refinements:
 * - Pillow images fill available space
 * - Redesigned pillowcase bonus as adjacent glued box
 * - Emotional testimonials with human touches
 * - New "cut the middlemen" savings section with comparison bar graphs
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Star, Check, Moon, Thermometer, Shield, MapPin, ChevronDown, ChevronUp, BadgeCheck,
  Clock, Sparkles, Droplets, Wind, RefreshCw, Layers, Gift, Store, Truck, Tag, X,
  ChevronLeft, ChevronRight, Heart, Bed
} from "lucide-react";
import FluffLogo from "@/components/FluffLogo";
import PressLogos from "@/components/PressLogos";
import OrderPopup from "@/components/OrderPopup";
import { StockInventoryBar } from "@/components/StockInventoryBar";
import { EventClosedPage } from "@/components/EventClosedPage";
import { ProfileResultsBanner } from '@/components/ProfileResultsBanner';
import { QuizMiniSection } from '@/components/QuizMiniSection';
import { QuizModal } from '@/components/QuizModal';
import { trackViewContent, trackAddToCart, getProductDataForTracking } from "@/lib/tracking";
import { trackViewItem, trackAddToCart as trackGA4AddToCart, createMainProductItem } from "@/lib/ga4-tracking";
import { CustomerCount } from "@/components/CustomerCount";
import { ShippingMessage } from "@/components/ShippingMessage";
import { useGeolocation, isUSVisitor, useNonUsBadgeText, useNonUsAlternativeUsp } from "@/hooks/useGeolocation";
import { AnimatedPlanet } from "@/components/AnimatedPlanet";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useDefaultCta } from "@/hooks/useDefaultCta";
import { trpc } from "@/lib/trpc";
import { BlurImage } from "@/components/BlurImage";
import { ImageCarousel, type CarouselImage } from "@/components/ImageCarousel";
import { LazyVideo } from "@/components/LazyVideo";
import ExpertPillowSlide, { ExpertPillowThumbnail } from "@/components/ExpertPillowSlide";
import CoupleSleepSlide, { CoupleSleepThumbnail } from "@/components/CoupleSleepSlide";
import DeliverySlide, { DeliveryThumbnail } from "@/components/DeliverySlide";
import SleepCompanionSlide, { SleepCompanionThumbnail } from "@/components/SleepCompanionSlide";
import EthicalMakingSlide, { EthicalMakingThumbnail } from "@/components/EthicalMakingSlide";

import { BlackFridayUrgencySection } from "@/components/BlackFridayUrgencySection";

/**
 * Helper function to convert PNG path to WebP with fallback
 * Returns WebP path if browser supports it, otherwise PNG
 */
const supportsWebP = typeof window !== 'undefined' && 
  document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;

const toWebP = (pngPath: string): string => {
  if (!supportsWebP) return pngPath;
  // Only convert optimized PNG images
  if (!pngPath.includes('/optimized/') || !pngPath.endsWith('.png')) return pngPath;
  return pngPath.replace('.png', '.webp');
};


/**
 * Comparison Slide Component - Fourth gallery image
 * Recreates the "Ruined Sleep vs VIP Slumber" comparison using page design system
 * Adapted for "Restorative Alignment" narrative targeting 45+ audience
 */
function ComparisonSlide() {
  const negativePoints = [
    "Waking up with neck stiffness",
    "Constant fluffing and adjusting",
    "Replacing pillows every few months",
    "Inconsistent support night to night",
    "Overheating and discomfort"
  ];
  
  const positivePoints = [
    "Wake aligned and pain-free",
    "Holds shape without adjustment",
    "Built to last for years",
    "Same reliable support every night",
    "Temperature-neutral comfort"
  ];

  return (
    <div className="w-full h-full flex overflow-hidden relative">
      {/* Left Side - Standard Pillows - Grey background to stand out */}
      <div className="w-1/2 h-full bg-[#e8e8e3] flex flex-col relative">
        <div className="p-4 lg:p-6 flex flex-col h-full">
          <h3 className="text-lg lg:text-xl font-semibold text-[#1a1a1a] mb-2">Standard Pillows</h3>
          <p className="text-xs lg:text-sm text-muted-foreground mb-4 lg:mb-6">The Nightly Struggle</p>
          
          {/* Negative Points */}
          <div className="space-y-2.5 lg:space-y-3">
            {negativePoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <X className="w-4 h-4 text-[#e63946] flex-shrink-0 mt-0.5" />
                <span className="text-xs lg:text-sm text-[#666]">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* VS Divider */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#f5c542] flex items-center justify-center shadow-lg">
          <span className="text-xs lg:text-sm font-bold text-[#1a1a1a]">VS</span>
        </div>
      </div>
      
      {/* Right Side - FluffCo Pillow */}
      <div className="w-1/2 h-full bg-[#2d3a5c] flex flex-col relative">
        <div className="p-4 lg:p-6 flex flex-col h-full">
          <h3 className="text-lg lg:text-xl font-semibold text-white mb-2">FluffCo Pillow</h3>
          <p className="text-xs lg:text-sm text-white/70 mb-4 lg:mb-6">Restorative Alignment</p>
          
          {/* Positive Points */}
          <div className="space-y-2.5 lg:space-y-3">
            {positivePoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-[#22c55e] flex-shrink-0 mt-0.5" />
                <span className="text-xs lg:text-sm text-white/90">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hotel Comparison Slide Component - Compares FluffCo vs luxury hotel brands
 * Shows price, savings, and feature comparison table
 * Logos rotate with fade in/out animation across all columns
 */
function HotelComparisonSlide({ fluffPrice = "$59" }: { fluffPrice?: string }) {
  // All hotel logos for rotation - unified semi-transparent styling
  const hotelLogos = useMemo(() => [
    { src: "/images/four-seasons-logo.svg", alt: "Four Seasons" },
    { src: "/images/ritz-carlton-logo.svg", alt: "Ritz-Carlton" },
    { src: "/images/optimized/marriott-logo-small.webp", alt: "Marriott" },
    { src: "/images/mandarin-oriental.svg", alt: "Mandarin Oriental" },
    { src: "/images/aman-logo.svg", alt: "Aman" },
    { src: "/images/rosewood-logo.svg", alt: "Rosewood" },
    { src: "/images/fairmont-logo.svg", alt: "Fairmont" },
    { src: "/images/hyatt-logo.svg", alt: "Hyatt" },
  ], []);

  // Preload all images before starting animation
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      const promises = hotelLogos.map((logo: { src: string; alt: string }) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Still resolve on error to not block
          img.src = logo.src;
        });
      });
      await Promise.all(promises);
      if (mounted) setImagesLoaded(true);
    };
    loadImages();
    return () => { mounted = false; };
  }, [hotelLogos]);

  // State for current logos in each column (indices into hotelLogos array)
  const [columnLogos, setColumnLogos] = useState([0, 1, 2]);
  const [fadeStates, setFadeStates] = useState([1, 1, 1]); // 1 = visible, 0 = hidden
  
  // Rotate logos with random desync timing for each column - only after images loaded
  useEffect(() => {
    if (!imagesLoaded) return;
    
    const visibleTime = 5000; // Time logo stays fully visible (5s - longer)
    const fadeTime = 2000; // Very slow fade transition (2s)
    const totalCycleTime = visibleTime + fadeTime * 2; // Full cycle: fade in + visible + fade out
    
    const rotateColumn = (columnIndex: number) => {
      // Start fade out (very slow)
      setFadeStates(prev => {
        const newStates = [...prev];
        newStates[columnIndex] = 0;
        return newStates;
      });
      
      // After fade out completes, change logo and fade in
      setTimeout(() => {
        setColumnLogos(prev => {
          const newLogos = [...prev];
          // Get next logo that's not currently shown in any column
          let nextIndex = (newLogos[columnIndex] + 3) % hotelLogos.length;
          while (newLogos.includes(nextIndex)) {
            nextIndex = (nextIndex + 1) % hotelLogos.length;
          }
          newLogos[columnIndex] = nextIndex;
          return newLogos;
        });
        
        // Fade in (very slow) - small delay to ensure logo changed
        setTimeout(() => {
          setFadeStates(prev => {
            const newStates = [...prev];
            newStates[columnIndex] = 1;
            return newStates;
          });
        }, 50);
      }, fadeTime);
    };
    
    // Create intervals with random offsets for desync effect
    const createRandomInterval = (colIdx: number) => {
      const randomOffset = Math.random() * 3000 + 1000; // Random 1-4s offset for initial desync
      const randomVariation = Math.random() * 1500 - 750; // +/- 750ms variation
      const interval = totalCycleTime + randomVariation;
      
      // Initial delay with random offset
      const initialTimeout = setTimeout(() => {
        rotateColumn(colIdx);
        // Then set up recurring interval with slight randomness
        const recurringInterval = setInterval(() => {
          rotateColumn(colIdx);
        }, interval + (Math.random() * 1000 - 500));
        intervalRefs.current[colIdx] = recurringInterval;
      }, randomOffset);
      
      return initialTimeout;
    };
    
    const intervalRefs = { current: [null, null, null] as (ReturnType<typeof setInterval> | null)[] };
    const timeouts = [0, 1, 2].map(createRandomInterval);
    
    return () => {
      timeouts.forEach(t => clearTimeout(t));
      intervalRefs.current.forEach(i => i && clearInterval(i));
    };
  }, [imagesLoaded, hotelLogos]);

  const features = [
    { name: "Price", fluff: fluffPrice, hotel: "$130-200" },
    { name: "Savings", fluff: null, hotel: "55-70%" },
    { name: "Free Trial", fluff: true, hotel: false },
    { name: "Sustainable", fluff: true, hotel: false },
    { name: "Cruelty-Free", fluff: true, hotel: false },
  ];

  return (
    <div className="w-full h-full bg-[#2d3a5c] flex flex-col p-2 lg:p-5 relative overflow-hidden">
      {/* Moon icon top left */}
      <div className="absolute top-2 left-2 lg:top-3 lg:left-3">
        <div className="relative">
          <Moon className="w-5 h-5 lg:w-6 lg:h-6 text-white/80" />
          <Sparkles className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-[#e63946] absolute -top-0.5 -right-0.5" />
        </div>
      </div>
      
      {/* Grid-based comparison table with unified FluffCo column */}
      <div className="flex-1 flex mt-6 lg:mt-8 relative min-w-0">
        {/* Feature labels column */}
        <div className="w-16 lg:w-24 flex flex-col pt-14 lg:pt-20 flex-shrink-0">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="flex-1 flex items-center text-[9px] lg:text-[11px] font-semibold text-white"
              style={{ animation: `fadeSlideIn 0.4s ease-out ${0.5 + idx * 0.1}s both` }}
            >
              {feature.name}
            </div>
          ))}
        </div>
        
        {/* FluffCo Column - Unified white background */}
        <div className="flex-1 flex flex-col bg-white rounded-lg lg:rounded-xl mx-1 lg:mx-2 shadow-xl shadow-white/30 animate-[fadeSlideIn_0.4s_ease-out_0.1s_both] relative z-10 min-w-0">
          <div className="h-14 lg:h-20 flex items-center justify-center bg-white rounded-t-lg lg:rounded-t-xl px-2 lg:px-4">
            <FluffLogo className="h-6 lg:h-8 w-auto" />
          </div>
          {features.map((feature, idx) => (
            <div key={idx} className="flex-1 flex items-center justify-center">
              {feature.fluff === true ? (
                <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-[#2d3a5c] flex items-center justify-center">
                  <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-white" />
                </div>
              ) : feature.fluff === null ? (
                <span className="text-[10px] lg:text-xs text-[#2d3a5c]/50">-</span>
              ) : (
                <span className="text-xs lg:text-sm font-bold text-[#2d3a5c]">{feature.fluff}</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Hotel Columns with rotating logos */}
        {[0, 1, 2].map((colIdx) => (
          <div key={colIdx} className="flex-1 flex flex-col mx-0.5 animate-[fadeSlideIn_0.4s_ease-out_0.2s_both] min-w-0">
            {/* Logo Header with fade animation - unified small size and semi-transparent */}
            <div className="h-14 lg:h-20 flex items-end justify-center pb-2">
              <img 
                src={hotelLogos[columnLogos[colIdx]].src}
                alt={hotelLogos[columnLogos[colIdx]].alt}
                className="h-4 lg:h-6 w-auto object-contain max-w-[90%] brightness-0 invert transition-opacity duration-[2000ms] ease-in-out"
                style={{ opacity: fadeStates[colIdx] * 0.6 }}
              />
            </div>
            {/* Values */}
            {features.map((feature, idx) => (
              <div key={idx} className="flex-1 flex items-center justify-center">
                {feature.hotel === false ? (
                  <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#e63946] flex items-center justify-center">
                    <X className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                  </div>
                ) : (
                  <span className="text-[9px] lg:text-[11px] text-white/70">{feature.hotel}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hotel Comparison Thumbnail - Shows mini table preview
 */
function HotelComparisonThumbnail() {
  return (
    <div className="w-full h-full bg-[#2d3a5c] flex flex-col items-center justify-center p-1">
      <div className="bg-white rounded px-1.5 py-0.5 mb-1">
        <span className="text-[6px] font-bold text-[#2d3a5c]">FLUFF<span className="text-[#d4a5a5]">Co</span></span>
      </div>
      <div className="flex gap-1">
        <div className="w-2 h-2 rounded-full bg-white/30" />
        <div className="w-2 h-2 rounded-full bg-white/30" />
        <div className="w-2 h-2 rounded-full bg-white/30" />
      </div>
      <div className="text-[5px] text-white/70 mt-1">vs hotels</div>
    </div>
  );
}

/**
 * Comparison Thumbnail - Shows mini version of comparison slide with X vs Check icons
 */
function ComparisonThumbnail() {
  return (
    <div className="w-full h-full flex relative">
      {/* Left side - grey with X */}
      <div className="w-1/2 h-full bg-[#e8e8e3] flex items-center justify-center">
        <X className="w-4 h-4 text-[#e63946]" />
      </div>
      {/* Right side - navy with check */}
      <div className="w-1/2 h-full bg-[#2d3a5c] flex items-center justify-center">
        <Check className="w-4 h-4 text-[#22c55e]" />
      </div>
      {/* VS badge in center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f5c542] flex items-center justify-center shadow-sm">
        <span className="text-[5px] font-bold text-[#1a1a1a]">VS</span>
      </div>
    </div>
  );
}

/**
 * Second Image Thumbnail - Shows preview with subtle overlay indicator
 */
function SecondImageThumbnail() {
  return (
    <div className="w-full h-full relative">
      <img 
        src={toWebP("/images/optimized/hero/lifestyle-sleep.png")} 
        alt="" 
        className="w-full h-full object-cover"
      />
      {/* Subtle corner indicator showing this image has overlays */}
      <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
        <span className="text-[7px] font-semibold text-[#2d3a5c]">why</span>
      </div>
    </div>
  );
}

/**
 * Third Image Thumbnail - Shows preview with "3 layers" indicator (same style as 2nd)
 */
function ThirdImageThumbnail() {
  return (
    <div className="w-full h-full relative">
      <img 
        src={toWebP("/images/optimized/benefits/engineering-detail-new.png")} 
        alt="" 
        className="w-full h-full object-cover"
      />
      {/* Subtle corner indicator showing this image has overlays - same style as 2nd */}
      <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
        <span className="text-[7px] font-semibold text-[#2d3a5c]">3 layers</span>
      </div>
    </div>
  );
}

/**
 * First Image Thumbnail - Shows "5-star" indicator
 */
function FirstImageThumbnail() {
  return (
    <div className="w-full h-full relative">
      <img 
        src={toWebP("/images/optimized/cards/pillow-hero.png")} 
        alt="" 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
        <span className="text-[7px] font-semibold text-[#2d3a5c]">5-star</span>
      </div>
    </div>
  );
}

/**
 * Fifth Image Thumbnail - Shows "3 care" indicator (washing machine)
 */
function FifthImageThumbnail() {
  return (
    <div className="w-full h-full relative">
      <img 
        src={toWebP("/images/optimized/benefits/washing-machine.png")} 
        alt="" 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
        <span className="text-[7px] font-semibold text-[#2d3a5c]">care</span>
      </div>
    </div>
  );
}

/**
 * Sixth Image Thumbnail - Shows "hotel" indicator (packaging)
 */
function SixthImageThumbnail() {
  return (
    <div className="w-full h-full relative">
      <img 
        src={toWebP("/images/optimized/benefits/hotel-comfort-packaging.png")} 
        alt="" 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
        <span className="text-[7px] font-semibold text-[#2d3a5c]">hotel</span>
      </div>
    </div>
  );
}

import type { LandingPageConfig } from '@/config/types';
import { useLandingPageConfig } from '@/contexts/LandingPageContext';
import { baseConfig } from '@/config/base.config';

interface HomeProps {
  configOverride?: LandingPageConfig;
  // Allow any additional props from wouter routing
  [key: string]: any;
}

export default function Home(props: HomeProps) {
  const { configOverride } = props || {};
  
  // Get config from context or use override/default
  const contextConfig = useLandingPageConfig();
  const config = configOverride || contextConfig || baseConfig;
  
  // Get site settings from database
  const { settings: siteSettings, getAngleCTA } = useSiteSettings();
  
  // Get default CTA button from database
  const { cta: defaultCta } = useDefaultCta();
  
  // Get landing page settings for this specific page
  const { data: landingPageSettings } = trpc.landingPages.get.useQuery({ pageId: config.id });
  console.log('[DEBUG] landingPageSettings for', config.id, ':', JSON.stringify(landingPageSettings, null, 2));
  
  // Get all CTA buttons to resolve ctaButtonId
  const { data: allCtaButtons } = trpc.ctaButtons.getAll.useQuery();
  
  // Helper function to get CTA button group with priority logic:
  // Returns object with primary and secondary text
  function getPageCTAGroup(): { primary: string; secondary: string } {
    console.log('[DEBUG getPageCTAGroup] landingPageSettings FULL:', JSON.stringify(landingPageSettings, null, 2));
    console.log('[DEBUG getPageCTAGroup] landingPageSettings.ctaButtonId:', landingPageSettings?.ctaButtonId);
    console.log('[DEBUG getPageCTAGroup] allCtaButtons:', allCtaButtons);
    // Priority 1: Selected CTA button for this page
    if (landingPageSettings?.ctaButtonId && allCtaButtons) {
      console.log('[DEBUG] Looking for button with ID:', landingPageSettings.ctaButtonId);
      console.log('[DEBUG] Available button IDs:', allCtaButtons.map((btn: any) => btn.id));
      const selectedButton = allCtaButtons.find((btn: any) => btn.id === landingPageSettings.ctaButtonId);
      console.log('[DEBUG] selectedButton found:', selectedButton);
      if (selectedButton) {
        return {
          primary: selectedButton.text || "Order Now",
          secondary: selectedButton.secondaryText || "& Save {discount}%"
        };
      }
    }
    
    // Priority 2: Default CTA button
    if (defaultCta.text) {
      return {
        primary: defaultCta.text,
        secondary: (defaultCta as any).secondaryText || "& Save {discount}%"
      };
    }
    
    // Priority 3: Hardcoded fallback
    return {
      primary: "Order Now",
      secondary: "& Save {discount}%"
    };
  };
  
  // Helper to get simple primary CTA text (backward compatibility)
  const getPageCTA = (isMobile: boolean = false): string => {
    const primaryText = getPageCTAGroup().primary;
    
    // Use shorter text on mobile to prevent overflow
    if (isMobile && primaryText === "End Your Pillow Battle") {
      return "Claim Deal";
    }
    
    return primaryText;
  };
  
  // Helper to get CTA with discount (uses secondary text template)
  const getPageCTAWithDiscount = (discount: number): string => {
    const group = getPageCTAGroup();
    
    // If primary text already contains a percentage or "Off", it's a complete CTA - don't append secondary
    if (group.primary.includes('%') || group.primary.toLowerCase().includes('off')) {
      return group.primary;
    }
    
    // If secondary text has {discount} placeholder, replace it
    if (group.secondary.includes('{discount}')) {
      return `${group.primary} ${group.secondary.replace('{discount}', discount.toString())}`;
    }
    // Otherwise just append the secondary text
    return `${group.primary} ${group.secondary}`;
  };
  
  const [selectedSize, setSelectedSize] = useState<"Standard" | "King">("Standard");
  const [selectedQuantity, setSelectedQuantity] = useState(4);
  const [hoveredQuantity, setHoveredQuantity] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [viewerCount, setViewerCount] = useState(47);
  const [displayedViewerCount, setDisplayedViewerCount] = useState(47);
  const [isViewerCountAnimating, setIsViewerCountAnimating] = useState(false);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const [showAllBenefitCards, setShowAllBenefitCards] = useState(false);
  const [pricingSectionSize, setPricingSectionSize] = useState<"Standard" | "King">("Standard");
  const [savingsQuantity, setSavingsQuantity] = useState<1 | 2 | 4>(4);
  const [isPricingSectionAnimating, setIsPricingSectionAnimating] = useState(false);
  const [prevPricingSectionSize, setPrevPricingSectionSize] = useState<"Standard" | "King">("Standard");
  const [expertGalleryIndex, setExpertGalleryIndex] = useState(0);
  const [expandedExpertAccordion, setExpandedExpertAccordion] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(true); // Track if current gallery image is loaded
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  
  // Haptic feedback utility for mobile devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      // Light tap feedback (10ms)
      navigator.vibrate(10);
    }
  };
  
  // Gallery carousel ref for programmatic scrolling
  const galleryScrollRef = useRef<HTMLDivElement | null>(null);
  const [awardIndex, setAwardIndex] = useState(0); // Award carousel index
  const [currentToast, setCurrentToast] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showWhatsIncluded, setShowWhatsIncluded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [stickyBarExpanded, setStickyBarExpanded] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [purchasedToday, setPurchasedToday] = useState(0);
  const [displayedPurchasedToday, setDisplayedPurchasedToday] = useState(0);
  const [isPurchasedAnimating, setIsPurchasedAnimating] = useState(false);
  const [isHeroPriceAnimating, setIsHeroPriceAnimating] = useState(false);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [stockLevel, setStockLevel] = useState(13); // Starts at 13%, decreases 1% per minute, min 7%
  const [showOrderPopup, setShowOrderPopup] = useState(false);
  const [oekoTexExpanded, setOekoTexExpanded] = useState(false);
  const oekoTexRef = useRef<HTMLButtonElement>(null);
  
  // Geo-detection for conditional shipping display
  const { countryCode } = useGeolocation();
  const isUS = countryCode ? isUSVisitor(countryCode) : true; // Default to US if unknown
  const nonUsBadgeText = useNonUsBadgeText(); // Configurable badge for non-US visitors
  const nonUsAlternativeUsp = useNonUsAlternativeUsp(); // Replacement for "Made in USA" for non-US visitors
  
  // FAQ micro-modal state
  const [showFaqMicroModal, setShowFaqMicroModal] = useState(false);
  const [faqMicroModalDismissed, setFaqMicroModalDismissed] = useState(false);
  
  // Checkout exit recovery modal state
  const [showExitRecoveryModal, setShowExitRecoveryModal] = useState(false);
  const [exitRecoveryShownThisSession, setExitRecoveryShownThisSession] = useState(false);
  const [exitRecoveryEmail, setExitRecoveryEmail] = useState('');
  const [exitRecoverySubmitted, setExitRecoverySubmitted] = useState(false);
  
  // Trust badges gradient visibility state
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true); // Default to true as design element
  const trustBadgesRef = useRef<HTMLDivElement | null>(null);
  
  // Contextual carousel state for quiz results
  const [contextualCarouselIndex, setContextualCarouselIndex] = useState(0);
  const [contextualCardsCount, setContextualCardsCount] = useState(0);
  
  // Trust badges scroll detection for gradient visibility
  useEffect(() => {
    const container = trustBadgesRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const isMobile = window.innerWidth < 768;
      
      // Check if content actually overflows
      const hasOverflow = scrollWidth > clientWidth;
      
      // Show left gradient if scrolled away from start (only when there's overflow)
      setShowLeftGradient(hasOverflow && scrollLeft > 5);
      
      // Show right gradient:
      // - On mobile: always show as design element (visual scroll indicator)
      // - On desktop: only show if there's overflow and not scrolled to end
      if (isMobile) {
        // On mobile, always show right gradient unless scrolled to end
        setShowRightGradient(hasOverflow ? scrollLeft < scrollWidth - clientWidth - 5 : true);
      } else {
        // On desktop, only show if there's actual overflow
        setShowRightGradient(hasOverflow && scrollLeft < scrollWidth - clientWidth - 5);
      }
    };
    
    // Initial check
    handleScroll();
    
    // Add scroll listener
    container.addEventListener('scroll', handleScroll);
    
    // Add resize listener to re-check on viewport changes
    window.addEventListener('resize', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);
  
  // Gallery pills gradient visibility - initial check on mount
  useEffect(() => {
    const checkGalleryGradients = () => {
      const container = document.querySelector('.flex.gap-2.overflow-x-auto.pb-2.scrollbar-hide');
      const leftGradient = document.getElementById('thumb-gradient-left');
      const rightGradient = document.getElementById('thumb-gradient-right');
      
      if (!container || !leftGradient || !rightGradient) return;
      
      const hasOverflow = container.scrollWidth > container.clientWidth;
      
      if (!hasOverflow) {
        // No overflow - hide both gradients
        leftGradient.style.opacity = '0';
        rightGradient.style.opacity = '0';
      } else {
        // Has overflow - show right gradient initially (at scroll start)
        leftGradient.style.opacity = '0';
        rightGradient.style.opacity = '1';
      }
    };
    
    // Check after a short delay to ensure DOM is ready
    setTimeout(checkGalleryGradients, 100);
    
    // Also check on window resize
    window.addEventListener('resize', checkGalleryGradients);
    
    return () => {
      window.removeEventListener('resize', checkGalleryGradients);
    };
  }, []);
  
  // Swipe/drag state for carousel
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const wheelAccumulatorRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const swipeCooldownRef = useRef(false);
  

  
  // Scroll to top when arriving from quiz (ensures page starts at top)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromQuiz = urlParams.get('from') === 'quiz';
    if (fromQuiz) {
      // Force scroll to top immediately
      window.scrollTo(0, 0);
      // Also set after a small delay to ensure it happens after any browser restoration
      setTimeout(() => window.scrollTo(0, 0), 0);
    }
  }, []);
  
  // Auto-switch contextual carousel every 6 seconds (one card at a time)
  useEffect(() => {
    if (contextualCardsCount <= 3) return; // Only auto-switch if more than 3 cards
    const interval = setInterval(() => {
      setContextualCarouselIndex((prev) => (prev + 1) % contextualCardsCount);
    }, 10000); // 10 seconds - much slower auto-switch
    return () => clearInterval(interval);
  }, [contextualCardsCount]);
  
  // Dynamic title and meta description
  useEffect(() => {
    const pageTitle = config.name || 'The Same Pillows Used in 5-Star Hotels - For Less';
    const pageDescription = 'Sleep like you\'re on vacation every night. Enjoy the same high-end luxury quality pillows used in Four Seasons and Ritz Carlton at just a fraction of the price!';
    
    document.title = `${pageTitle} | FluffCo`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageDescription);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', pageDescription);
      document.head.appendChild(metaDescription);
    }
  }, [config]);
  

  
  // Click outside to close OEKO-TEX badge
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (oekoTexRef.current && !oekoTexRef.current.contains(event.target as Node)) {
        setOekoTexExpanded(false);
      }
    };
    if (oekoTexExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [oekoTexExpanded]);
  
  // Event page IDs that have date-based availability
  const eventPageIds = ['valentine-gift', 'mothers-day', 'fathers-day', 'black-friday'];
  const isEventPage = eventPageIds.includes(config.id);
  
  // Event names for display
  const eventNames: Record<string, string> = {
    'valentine-gift': "Valentine's Day",
    'mothers-day': "Mother's Day",
    'fathers-day': "Father's Day",
    'black-friday': "Black Friday"
  };
  
  // Get selected marketing angle from localStorage (synced from LP Manager)
  const getSelectedAngle = (): string => {
    if (!isEventPage) return 'gift-focused';
    try {
      const stored = localStorage.getItem('skyvane_event_angles');
      if (stored) {
        const angles = JSON.parse(stored);
        return angles[config.id] || 'gift-focused';
      }
    } catch (e) {
      console.error('Error reading angle:', e);
    }
    // Default angles for event pages
    if (config.id === 'mothers-day') return 'neck-pain';
    if (config.id === 'black-friday') return 'black-friday';
    return 'gift-focused';
  };
  
  const selectedAngle = getSelectedAngle();
  
  // Angle-based content modifiers for event pages
  const angleModifiers: Record<string, {
    heroEmphasis?: string;
    benefitHighlight?: string;
    ctaText?: string;
    trustBadge?: string;
  }> = {
    '5-star-hotel': {
      heroEmphasis: 'Same pillows used in luxury hotels like Four Seasons and Ritz-Carlton.',
      benefitHighlight: 'hotel-quality',
      ctaText: 'Get Hotel-Quality Sleep',
      trustBadge: 'As seen in 5-star hotels'
    },
    'neck-pain': {
      heroEmphasis: 'Designed for proper neck alignment to help reduce morning stiffness and discomfort.',
      benefitHighlight: 'alignment',
      ctaText: 'Get Relief Tonight',
      trustBadge: 'Recommended for neck support'
    },
    'gift-focused': {
      heroEmphasis: 'The perfect gift that shows you care about their comfort and well-being.',
      benefitHighlight: 'gifting',
      ctaText: 'Give the Gift of Sleep',
      trustBadge: 'Premium gift packaging'
    },
    'restorative': {
      heroEmphasis: 'Wake up feeling truly refreshed with sleep that actually restores your body.',
      benefitHighlight: 'restoration',
      ctaText: 'Start Sleeping Better',
      trustBadge: 'For restorative rest'
    },
    'black-friday': {
      heroEmphasis: 'Limited time Black Friday pricing on hotel-quality pillows that hold their shape for years.',
      benefitHighlight: 'sale',
      ctaText: 'Claim Black Friday Deal',
      trustBadge: 'Up to 66% off'
    }
  };
  
  const currentAngleModifier = angleModifiers[selectedAngle] || angleModifiers['gift-focused'];
  
  // Event-specific content for the gift section
  const eventContent: Record<string, {
    headline: string;
    subheadline: string;
    description: string;
    image: string;
    features: { icon: 'gift' | 'check' | 'heart'; text: string }[];
    cards: { icon: 'moon' | 'gift' | 'sparkles'; title: string; description: string; image: string }[];
  }> = {
    'valentine-gift': {
      headline: "Better Than Flowers.",
      subheadline: "Softer Than Roses.",
      description: "Because rest is one of the most personal ways to show you care. Give a gift they'll enjoy every night, not just once.",
      image: '/images/optimized/events/valentine-unboxing.png',
      features: [
        { icon: 'gift', text: 'Premium Packaging' },
        { icon: 'check', text: 'No Wrapping Needed' },
        { icon: 'heart', text: '100-Night Guarantee' }
      ],
      cards: [
        { icon: 'moon', title: 'Enjoyed Every Night', description: "Unlike flowers that wilt or chocolates that disappear, this gift becomes part of their nightly routine.", image: '/images/optimized/events/valentine-couple-bed.png' },
        { icon: 'gift', title: 'Arrives Ready to Gift', description: "Premium packaging means no wrapping required. Just add a card and watch them unwrap something special.", image: '/images/optimized/events/valentine-unboxing.png' },
        { icon: 'sparkles', title: 'For Someone Special', description: "The perfect choice for the person who's hard to shop for. Everyone sleeps, and everyone deserves better sleep.", image: '/images/optimized/events/valentine-hero-pillow.png' }
      ]
    },
    'mothers-day': {
      headline: "More Than a Gift.",
      subheadline: "A Thank You She'll Feel Every Night.",
      description: "Mom spends every day taking care of others. This Mother's Day, give her the rest she truly deserves with hotel-quality comfort.",
      image: '/images/optimized/events/mothers-day-unboxing.png',
      features: [
        { icon: 'gift', text: 'Gift-Ready Packaging' },
        { icon: 'check', text: 'Neck & Back Support' },
        { icon: 'heart', text: '100 Night Better Sleep' }
      ],
      cards: [
        { icon: 'moon', title: 'Rest She Deserves', description: "After years of early mornings and late nights caring for everyone else, give mom the gift of truly restorative sleep.", image: '/images/optimized/events/mothers-day-comfort.png' },
        { icon: 'gift', title: 'Thoughtful & Practical', description: "Not another gift that sits in a drawer. This is something she'll use and appreciate every single night.", image: '/images/optimized/events/mothers-day-unboxing.png' },
        { icon: 'sparkles', title: 'Supports Her Comfort', description: "Designed for proper neck alignment, especially helpful for the aches and tension that come with years of caregiving.", image: '/images/optimized/events/mothers-day-hero.png' }
      ]
    },
    'fathers-day': {
      headline: "More Than a Gift.",
      subheadline: "Relief He'll Feel Every Morning.",
      description: "Dad never complains, but you know he wakes up stiff. This Father's Day, give him proper neck alignment and the rest he's earned.",
      image: '/images/optimized/events/fathers-day-unboxing-new.png',
      features: [
        { icon: 'gift', text: 'Gift-Ready Packaging' },
        { icon: 'check', text: 'Neck Pain Relief' },
        { icon: 'heart', text: '100 Night Better Sleep' }
      ],
      cards: [
        { icon: 'moon', title: 'Relief He Deserves', description: "After years of hard work and poor pillows, give dad the gift of waking up without the morning stiffness.", image: '/images/optimized/events/fathers-day-sleep-comfort.png' },
        { icon: 'gift', title: 'Practical & Appreciated', description: "Not another tie or gadget. This is something he'll use and appreciate every single night.", image: '/images/optimized/events/fathers-day-unboxing-new.png' },
        { icon: 'sparkles', title: 'Supports His Comfort', description: "Designed for proper neck alignment, especially helpful for the aches that come with years of hard work.", image: '/images/optimized/events/fathers-day-hero-pillow.png' }
      ]
    },
    'black-friday': {
      headline: "Black Friday Sale.",
      subheadline: "Premium Comfort at Unbeatable Prices.",
      description: "This Black Friday, experience hotel-quality sleep at prices that won't come around again. Limited time, limited stock.",
      image: '/images/optimized/events/black-friday-lifestyle-sleep-couple.png',
      features: [
        { icon: 'gift', text: 'Up to 66% Off' },
        { icon: 'check', text: 'Free Shipping' },
        { icon: 'heart', text: '100 Night Better Sleep' }
      ],
      cards: [
        { icon: 'moon', title: 'Hotel-Quality Sleep', description: "The same premium pillows used in 5-star hotels, now at Black Friday prices you won't see again.", image: '/images/optimized/events/black-friday-unboxing.png' },
        { icon: 'gift', title: 'Limited Time Only', description: "Once Black Friday ends, these prices disappear. Stock up now and upgrade every pillow in your home.", image: '/images/optimized/events/black-friday-packaging.png' },
        { icon: 'sparkles', title: 'Award-Winning Quality', description: "Oprah Daily recognized, Apartment Therapy Best Overall. Premium quality at sale prices.", image: '/images/optimized/events/black-friday-hero-pillow.png' }
      ]
    }
  };
  
  // California timezone (PST/PDT) utility
  const CALIFORNIA_TIMEZONE = 'America/Los_Angeles';
  
  // Get current time in California timezone
  const getCaliforniaTime = () => {
    return new Date(new Date().toLocaleString('en-US', { timeZone: CALIFORNIA_TIMEZONE }));
  };
  
  // Parse a date string and interpret it as California time
  const parseAsCaliforniaTime = (dateStr: string, endOfDay: boolean = false) => {
    const date = new Date(dateStr);
    // Create a date string in California timezone format
    const caDateStr = date.toLocaleDateString('en-US', { timeZone: CALIFORNIA_TIMEZONE });
    const caDate = new Date(caDateStr);
    if (endOfDay) {
      caDate.setHours(23, 59, 59, 999);
    } else {
      caDate.setHours(0, 0, 0, 0);
    }
    return caDate;
  };

  // Get event dates from localStorage (synced from LP Manager)
  // All dates are interpreted in California timezone
  const getEventDates = () => {
    if (!isEventPage) return null;
    try {
      const storedDates = localStorage.getItem('skyvane_event_dates');
      if (storedDates) {
        const dates = JSON.parse(storedDates);
        if (dates[config.id]) {
          const startDate = dates[config.id].startDate ? parseAsCaliforniaTime(dates[config.id].startDate, false) : null;
          const endDate = dates[config.id].endDate ? parseAsCaliforniaTime(dates[config.id].endDate, true) : null;
          return { startDate, endDate };
        }
      }
    } catch (e) {
      console.error('Error parsing event dates:', e);
    }
    // Default dates based on event type (California timezone)
    // For testing: all event pages accessible Jan 1 to May 15
    // In production, LP Manager will set actual dates
    const year = new Date().getFullYear();
    return {
      startDate: new Date(year, 0, 1, 0, 0, 0, 0), // Jan 1 (for testing)
      endDate: new Date(year, 4, 15, 23, 59, 59, 999) // May 15 (for testing)
    };
  };

  // Check event status (using California timezone)
  const getEventStatus = () => {
    const dates = getEventDates();
    if (!dates) return { status: 'active' as const, startDate: null, endDate: null };
    
    const now = getCaliforniaTime();
    const { startDate, endDate } = dates;
    
    if (startDate && now < startDate) {
      return { status: 'not-started' as const, startDate, endDate };
    }
    if (endDate && now > endDate) {
      return { status: 'ended' as const, startDate, endDate };
    }
    return { status: 'active' as const, startDate, endDate };
  };

  const eventStatus = getEventStatus();
  
  // Check for LP Manager auth (logged in users can access all event pages)
  const bypassActive = typeof window !== 'undefined' && sessionStorage.getItem('skyvane_lp_auth') === 'authenticated';

  // Fetch color schemes from backend
  const { data: backendColorSchemes } = trpc.colorSchemes.getAll.useQuery();
  
  // Hardcoded fallback color schemes (always available immediately)
  const hardcodedColorSchemes: Record<string, { primary: string; secondary: string; accent: string; accentDark: string; background: string; textOnLight?: string; secondaryLight: string; isDark?: boolean }> = {
    'valentine-gift': {
      primary: '#c41e3a',
      secondary: '#8b1a2d',
      accent: '#fff5f5',
      accentDark: '#ffe8e8',
      background: '#fff8f8',
      secondaryLight: '#fce8eb'
    },
    'mothers-day': {
      primary: '#9b6b6b',
      secondary: '#7a5454',
      accent: '#fff9f9',
      accentDark: '#f5e6e6',
      background: '#fffafa',
      textOnLight: '#7a5454',
      secondaryLight: '#f5eaea'
    },
    'fathers-day': {
      primary: '#2c5282',
      secondary: '#1a365d',
      accent: '#f0f5ff',
      accentDark: '#e2e8f0',
      background: '#f8fafc',
      secondaryLight: '#e8eef8'
    },
    'black-friday': {
      primary: '#d4a574',
      secondary: '#b8935f',
      accent: '#fff9f0',
      accentDark: '#ffe8cc',
      background: '#fffbf5',
      secondaryLight: '#fff3e0',
      isDark: false
    }
  };
  
  // Build event color schemes from backend data, with hardcoded fallback per event
  const eventColorSchemes: Record<string, { primary: string; secondary: string; accent: string; accentDark: string; background: string; textOnLight?: string; secondaryLight: string; isDark?: boolean }> = 
    backendColorSchemes?.reduce((acc, scheme) => {
      acc[scheme.slug] = {
        primary: scheme.primaryColor,
        secondary: scheme.secondaryColor,
        accent: scheme.accentColor,
        accentDark: scheme.accentDarkColor,
        background: scheme.backgroundColor,
        secondaryLight: scheme.secondaryLightColor,
        // textOnLight is optional, use secondaryColor as fallback
        textOnLight: scheme.secondaryColor,
        isDark: scheme.isDark === 1
      };
      return acc;
    }, { ...hardcodedColorSchemes } as Record<string, { primary: string; secondary: string; accent: string; accentDark: string; background: string; textOnLight?: string; secondaryLight: string; isDark?: boolean }>) || hardcodedColorSchemes;
  
  // Get colors for current event with proper fallback chain:
  // 1. Try backend color for this specific event
  // 2. Fall back to hardcoded color for this specific event
  // 3. Fall back to Valentine's as last resort
  const eventColors = isEventPage ? (eventColorSchemes[config.id] || hardcodedColorSchemes[config.id] || hardcodedColorSchemes['valentine-gift']) : null;
  
  // Determine if current color scheme is dark (for automatic text/border adaptation)
  const isDarkScheme = eventColors?.isDark === true;
  
  // Color helpers for dark/light scheme adaptation
  const accentColor = isDarkScheme && eventColors ? eventColors.secondary : (eventColors?.primary || '#e63946');
  const accentBg = isDarkScheme && eventColors ? eventColors.secondaryLight : (eventColors ? `${eventColors.primary}08` : 'rgba(230, 57, 70, 0.05)');
  // For dark schemes (Black Friday), use gold accent colors for borders
  // For light schemes (Valentine's, etc.), use primary red colors
  const borderColorSelected = isDarkScheme && eventColors ? '#FFD700' : (eventColors?.primary || '#e63946');
  const borderColorUnselected = isDarkScheme && eventColors ? 'rgba(255,215,0,0.3)' : (eventColors ? `${eventColors.primary}40` : 'var(--border)');
  
  // Helper function for closed page
  const getEventColorScheme = () => eventColors || eventColorSchemes['valentine-gift'];

  // If event is not active, show closed page
  if (isEventPage && eventStatus.status !== 'active' && !bypassActive) {
    return (
      <EventClosedPage
        eventName={eventNames[config.id] || 'Holiday'}
        eventId={config.id}
        status={eventStatus.status}
        startDate={eventStatus.startDate || undefined}
        colorScheme={getEventColorScheme()}
      />
    );
  }

  // Legacy function for timer compatibility
  const getEventEndDate = () => {
    const dates = getEventDates();
    return dates?.endDate || null;
  };

  // Check if current time is within the event's active period
  const isWithinEventPeriod = () => {
    if (!isEventPage) return false;
    const dates = getEventDates();
    if (!dates) return false;
    const now = getCaliforniaTime();
    const { startDate, endDate } = dates;
    // Must be after start date (if set) and before end date (if set)
    const afterStart = !startDate || now >= startDate;
    const beforeEnd = !endDate || now <= endDate;
    return afterStart && beforeEnd;
  };

  // Store the timer end time in a ref to persist across renders
  const timerEndTimeRef = useRef<number | null>(null);
  
  // Initialize timer end time from cookie on mount (client-side only)
  const initializeTimerEndTime = () => {
    if (timerEndTimeRef.current !== null) return; // Already initialized
    
    const COOKIE_NAME = 'fluff_timer_end';
    const DEFAULT_HOURS = 1;
    const DEFAULT_MINUTES = 27;
    const DEFAULT_SECONDS = 14;
    
    const now = Date.now();
    
    // Try to get existing timer end time from cookie
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith(COOKIE_NAME + '='));
    
    if (cookieValue) {
      const endTimeStr = cookieValue.split('=')[1];
      const parsedTime = parseInt(endTimeStr);
      if (!isNaN(parsedTime) && parsedTime > now) {
        timerEndTimeRef.current = parsedTime;
        return;
      }
    }
    
    // No valid cookie - create new timer
    timerEndTimeRef.current = now + (DEFAULT_HOURS * 3600 + DEFAULT_MINUTES * 60 + DEFAULT_SECONDS) * 1000;
    
    // Set cookie to expire in 30 days
    const expires = new Date(now + 30 * 24 * 60 * 60 * 1000);
    document.cookie = `${COOKIE_NAME}=${timerEndTimeRef.current}; expires=${expires.toUTCString()}; path=/`;
  };
  
  const calculateTimeRemaining = () => {
    const eventEndDate = getEventEndDate();
    const withinPeriod = isWithinEventPeriod();
    
    // Use legacy cookie-based timer if:
    // 1. Not an event page, OR
    // 2. Event page but outside the configured date range
    if (!eventEndDate || !withinPeriod) {
      // Initialize timer end time if not already done
      initializeTimerEndTime();
      
      const now = Date.now();
      const timerEndTime = timerEndTimeRef.current || now;
      
      // Check if timer has expired and needs reset
      if (timerEndTime <= now) {
        // Reset the timer
        const COOKIE_NAME = 'fluff_timer_end';
        const DEFAULT_HOURS = 1;
        const DEFAULT_MINUTES = 27;
        const DEFAULT_SECONDS = 14;
        
        timerEndTimeRef.current = now + (DEFAULT_HOURS * 3600 + DEFAULT_MINUTES * 60 + DEFAULT_SECONDS) * 1000;
        const expires = new Date(now + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `${COOKIE_NAME}=${timerEndTimeRef.current}; expires=${expires.toUTCString()}; path=/`;
      }
      
      // Calculate remaining time
      const diff = (timerEndTimeRef.current || now) - now;
      const totalSeconds = Math.max(0, Math.floor(diff / 1000));
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      return { hours, minutes, seconds, isExpired: false };
    }
    
    // Use California timezone for consistent timer display
    const now = getCaliforniaTime();
    const diff = eventEndDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // If more than 24 hours, show days in hours
    const displayHours = days * 24 + hours;
    
    return { hours: displayHours, minutes, seconds, isExpired: false };
  };

  const [countdown, setCountdown] = useState(calculateTimeRemaining);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    // Check if event page timer is expired
    const initial = calculateTimeRemaining();
    if (initial.isExpired) {
      setTimerExpired(true);
      return;
    }

    const timer = setInterval(() => {
      const timeRemaining = calculateTimeRemaining();
      
      if (timeRemaining.isExpired) {
        setTimerExpired(true);
        clearInterval(timer);
        return;
      }
      
      setCountdown(timeRemaining);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [config.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3;
        const newCount = prev + change;
        return Math.max(38, Math.min(72, newCount));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate viewer count when it changes
  useEffect(() => {
    if (viewerCount !== displayedViewerCount) {
      setIsViewerCountAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayedViewerCount(viewerCount);
        setIsViewerCountAnimating(false);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [viewerCount, displayedViewerCount]);

  // Calculate purchased today based on NYC timezone with non-linear growth curve
  const calculatePurchasedToday = () => {
    // Get current time in NYC timezone
    const now = new Date();
    const nycTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hours = nycTime.getHours();
    const minutes = nycTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // Total range: 20 at midnight to 720 at 11:59PM (700 growth over 24h)
    const minPurchases = 20;
    const maxPurchases = 720;
    const totalGrowth = maxPurchases - minPurchases; // 700
    
    // Define growth weights for each hour (higher during peak times)
    // Peak 1: 9-11AM, Peak 2: 5-8PM
    const hourlyWeights = [
      0.5, 0.5, 0.5, 0.5, 0.5, 0.5,  // 12AM-6AM: slow
      1.0, 1.5, 2.0,                  // 6AM-9AM: ramping up
      4.0, 4.0, 3.0,                  // 9AM-12PM: first peak (9-11AM)
      2.0, 2.0, 2.0, 2.0, 2.0,        // 12PM-5PM: moderate
      4.0, 4.5, 4.5, 4.0,             // 5PM-9PM: second peak (5-8PM)
      2.0, 1.5, 1.0                   // 9PM-12AM: winding down
    ];
    
    // Calculate cumulative weight up to current time
    const totalWeight = hourlyWeights.reduce((a, b) => a + b, 0);
    let cumulativeWeight = 0;
    
    for (let h = 0; h < hours; h++) {
      cumulativeWeight += hourlyWeights[h];
    }
    // Add partial hour weight
    cumulativeWeight += hourlyWeights[hours] * (minutes / 60);
    
    // Calculate purchases based on weighted progress
    const progress = cumulativeWeight / totalWeight;
    const purchases = Math.floor(minPurchases + (totalGrowth * progress));
    
    return purchases;
  };

  // Initialize and update purchased today
  useEffect(() => {
    const updatePurchased = () => {
      const newValue = calculatePurchasedToday();
      setPurchasedToday(newValue);
    };
    
    updatePurchased();
    // Update every 2 minutes (less frequent than viewing counter)
    const interval = setInterval(updatePurchased, 120000);
    return () => clearInterval(interval);
  }, []);

  // Animate purchased today when it changes
  useEffect(() => {
    if (purchasedToday !== displayedPurchasedToday) {
      setIsPurchasedAnimating(true);
      const timeout = setTimeout(() => {
        setDisplayedPurchasedToday(purchasedToday);
        setIsPurchasedAnimating(false);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [purchasedToday, displayedPurchasedToday]);

  // Stock level decreases 1% per minute, minimum 7%
  useEffect(() => {
    const timer = setInterval(() => {
      setStockLevel(prev => Math.max(7, prev - 1));
    }, 60000); // Every 60 seconds
    return () => clearInterval(timer);
  }, []);

  // Update document title and meta tags from config
  useEffect(() => {
    // Check if this is a landing page (has a config slug that's not the default)
    const isLandingPage = config.slug && config.slug !== 'default';
    
    // Update title - use "{title} – FluffCo" format for landing pages
    const pageTitle = config.seo?.title || config.hero?.headline || 'Down Alternative Pillow';
    document.title = `${pageTitle} – FluffCo`;
    
    // Add noindex/nofollow for landing pages to prevent SEO indexing
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (isLandingPage) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex, nofollow');
    } else if (robotsMeta) {
      // Remove noindex for main page
      robotsMeta.remove();
    }
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', config.seo?.description || config.hero?.subheadline || '');
    
    // Update Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', `${pageTitle} – FluffCo`);
    
    // Update Open Graph description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (!ogDescription) {
      ogDescription = document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescription);
    }
    ogDescription.setAttribute('content', config.seo?.description || config.hero?.subheadline || '');
    
    // Update Open Graph image (first gallery image)
    const firstImage = config.gallery?.images?.[0]?.src;
    if (firstImage) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      // Convert relative path to absolute URL
      const absoluteImageUrl = firstImage.startsWith('http') 
        ? firstImage 
        : `${window.location.origin}${firstImage}`;
      ogImage.setAttribute('content', absoluteImageUrl);
    }
    
    // Update Twitter Card tags
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
      twitterCard = document.createElement('meta');
      twitterCard.setAttribute('name', 'twitter:card');
      document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');
  }, [config.seo, config.hero, config.gallery]);

  // Analytics: Track page view on load
  useEffect(() => {
    // Facebook Pixel: Track ViewContent with default product (4x Standard - most popular)
    const productData = getProductDataForTracking('standard', 4);
    trackViewContent(productData);
    
    // GA4: Track view_item with current selection
    const pricing = currentPricing.find(p => p.quantity === selectedQuantity);
    if (pricing) {
      const ga4Item = createMainProductItem(
        selectedSize,
        selectedQuantity as 1 | 2 | 4,
        pricing.price,
        pricing.originalPrice
      );
      trackViewItem(ga4Item, pricing.price);
    }
  }, []);

  // Scroll detection for sticky bar and sticky header
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const ctaButton = document.getElementById('main-cta-button');
          const footer = document.querySelector('footer');
          const announcementBar = document.querySelector('[data-announcement-bar]');
          const announcementHeight = announcementBar?.getBoundingClientRect().height || 44;
          
          // Sticky bar logic
          if (ctaButton) {
            const rect = ctaButton.getBoundingClientRect();
            const footerRect = footer?.getBoundingClientRect();
            const ctaOutOfView = rect.bottom < 0;
            const footerVisible = footerRect ? footerRect.top < window.innerHeight + 100 : false;
            setShowStickyBar(ctaOutOfView && !footerVisible);
          }
          
          // Sticky header logic - show when scrolling up, hide when scrolling down
          // Only activate after scrolling past the announcement bar + header height
          // Also account for ProfileResultsBanner if present (on quiz results page)
          const profileBanner = document.querySelector('[data-profile-banner]');
          const profileBannerHeight = profileBanner ? profileBanner.getBoundingClientRect().height : 0;
          const scrollThreshold = announcementHeight + 56 + (profileBanner ? profileBannerHeight + 100 : 0); // announcement + header + banner if present
          
          if (currentScrollY > scrollThreshold) {
            // Scrolling up - show header
            if (currentScrollY < lastScrollY) {
              setShowStickyHeader(true);
            } 
            // Scrolling down - hide header
            else if (currentScrollY > lastScrollY) {
              setShowStickyHeader(false);
            }
          } else {
            // Near top of page or within banner area - hide sticky header
            setShowStickyHeader(false);
          }
          
          // FAQ micro-modal logic - show when FAQ section is in view
          const faqSection = document.getElementById('faq');
          if (faqSection) {
            const faqRect = faqSection.getBoundingClientRect();
            const faqInView = faqRect.top < window.innerHeight * 0.7 && faqRect.bottom > 0;
            // Show modal when FAQ is in view, hide when scrolling back above it
            // Only if not manually dismissed
            if (faqInView && !faqMicroModalDismissed) {
              setShowFaqMicroModal(true);
            } else if (faqRect.top > window.innerHeight) {
              // User scrolled back up above FAQ - hide modal and reset dismissed state
              setShowFaqMicroModal(false);
            }
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, faqMicroModalDismissed]);

  // Award carousel auto-rotation (every 5 seconds for smoother experience)
  const awardsList = [
    { publication: "Men's Health", award: "Best Down Pillow" },
    { publication: "Architectural Digest", award: "Best Soft Pillow" },
    { publication: "Apartment Therapy", award: "Best Overall Pillow" },
    { publication: "Healthline", award: "Editor's Pick" },
    { publication: "PureWow", award: "95/100 Rating" },
  ];

  useEffect(() => {
    const awardTimer = setInterval(() => {
      setAwardIndex(prev => (prev + 1) % awardsList.length);
    }, 5000);
    return () => clearInterval(awardTimer);
  }, [awardsList.length]);

  // Keyboard navigation for size and quantity selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if focus is within the product section
      const activeElement = document.activeElement;
      const isInProductSection = activeElement?.closest('[data-product-selector]');
      
      if (!isInProductSection) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        // Toggle size
        setSelectedSize(prev => prev === 'Standard' ? 'King' : 'Standard');
      }
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const quantities = [1, 2, 4];
        const currentIdx = quantities.indexOf(selectedQuantity);
        if (e.key === 'ArrowUp' && currentIdx > 0) {
          setSelectedQuantity(quantities[currentIdx - 1]);
        } else if (e.key === 'ArrowDown' && currentIdx < quantities.length - 1) {
          setSelectedQuantity(quantities[currentIdx + 1]);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedQuantity]);

  // Just purchased toast notifications - 20 diverse variants
  const purchaseToasts = [
    // US customers (80% - 16 entries)
    { name: "Sarah M.", location: "Austin, TX", flag: "🇺🇸", size: "King", quantity: 4 },
    { name: "James W.", location: "Denver, CO", flag: "🇺🇸", size: "King", quantity: 2 },
    { name: "Maria G.", location: "Phoenix, AZ", flag: "🇺🇸", size: "King", quantity: 4 },
    { name: "DeShawn J.", location: "Atlanta, GA", flag: "🇺🇸", size: "King", quantity: 2 },
    { name: "Yuki T.", location: "Seattle, WA", flag: "🇺🇸", size: "King", quantity: 4 },
    { name: "Priya P.", location: "San Jose, CA", flag: "🇺🇸", size: "King", quantity: 4 },
    { name: "Miguel R.", location: "Miami, FL", flag: "🇺🇸", size: "King", quantity: 2 },
    { name: "Jennifer L.", location: "Chicago, IL", flag: "🇺🇸", size: "Standard", quantity: 2 },
    { name: "Kwame A.", location: "Houston, TX", flag: "🇺🇸", size: "King", quantity: 4 },
    { name: "Aisha B.", location: "Brooklyn, NY", flag: "🇺🇸", size: "King", quantity: 2 },
    { name: "Chen W.", location: "Los Angeles, CA", flag: "🇺🇸", size: "King", quantity: 4 },
    { name: "Robert K.", location: "Portland, OR", flag: "🇺🇸", size: "King", quantity: 4 },
    { name: "Fatima H.", location: "Dallas, TX", flag: "🇺🇸", size: "King", quantity: 2 },
    { name: "David S.", location: "Boston, MA", flag: "🇺🇸", size: "Standard", quantity: 1 },
    { name: "Kenji M.", location: "San Francisco, CA", flag: "🇺🇸", size: "King", quantity: 4 },
    { name: "Olivia N.", location: "Nashville, TN", flag: "🇺🇸", size: "King", quantity: 2 },
    // Canada & UK (10% - 2 entries)
    { name: "Emma T.", location: "Toronto, ON", flag: "🇨🇦", size: "King", quantity: 4 },
    { name: "Oliver B.", location: "London", flag: "🇬🇧", size: "King", quantity: 2 },
    // Europe (10% - 2 entries)
    { name: "Sophie M.", location: "Paris", flag: "🇫🇷", size: "King", quantity: 4 },
    { name: "Lars E.", location: "Stockholm", flag: "🇸🇪", size: "King", quantity: 2 },
  ];

  // Toast notification rotation with randomized timing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let hideTimeoutId: NodeJS.Timeout;
    
    const showNextToast = () => {
      // Random delay between 15-40 seconds for natural feel
      const delay = 15000 + Math.random() * 25000;
      timeoutId = setTimeout(() => {
        setCurrentToast(Math.floor(Math.random() * purchaseToasts.length));
        setShowToast(true);
        // Auto-hide after 4-6 seconds (randomized)
        hideTimeoutId = setTimeout(() => {
          setShowToast(false);
        }, 4000 + Math.random() * 2000);
        // Schedule next toast
        showNextToast();
      }, delay);
    };
    
    // Initial delay before first toast (5-12 seconds)
    const initialDelay = setTimeout(() => {
      setCurrentToast(Math.floor(Math.random() * purchaseToasts.length));
      setShowToast(true);
      // Auto-hide first toast
      hideTimeoutId = setTimeout(() => {
        setShowToast(false);
      }, 4000 + Math.random() * 2000);
      // Start the rotation
      showNextToast();
    }, 5000 + Math.random() * 7000);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(timeoutId);
      clearTimeout(hideTimeoutId);
    };
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');
  
  // Calculate total seconds left for the pillowcase timer display
  const timeLeft = countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds;
  const formatTimeLeft = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${formatTime(h)}:${formatTime(m)}:${formatTime(s)}`;
  };

  const sizes = [
    { name: "Standard" as const, dimensions: "20\" × 28\"", image: "/images/optimized/sizes/size-standard.jpg", badge: null },
    { name: "King" as const, dimensions: "20\" × 36\"", image: "/images/optimized/sizes/size-king.jpg", badge: "Chosen by 81%", badgeColor: "green" }
  ];
  
  // Prices from Fluff screenshots - Standard prices
  const standardPricing = [
    { quantity: 1, price: 59.90, originalPrice: 115.00, savings: 55.10, discount: 48 },
    { quantity: 2, price: 98.90, originalPrice: 222.00, savings: 123.10, discount: 55, badge: "Most Popular" },
    { quantity: 4, price: 149.90, originalPrice: 444.00, savings: 294.10, discount: 66, badge: "Best Value", bonus: true }
  ];

  // King prices from screenshots
  const kingPricing = [
    { quantity: 1, price: 69.90, originalPrice: 125.00, savings: 55.10, discount: 44 },
    { quantity: 2, price: 119.90, originalPrice: 250.00, savings: 130.10, discount: 52, badge: "Most Popular" },
    { quantity: 4, price: 189.90, originalPrice: 500.00, savings: 310.10, discount: 62, badge: "Best Value", bonus: true }
  ];

  const getPricing = (size: "Standard" | "King") => size === "Standard" ? standardPricing : kingPricing;
  const currentPricing = getPricing(selectedSize);
  const pricingSectionPricing = getPricing(pricingSectionSize);
  
  // Animate prices when size changes
  useEffect(() => {
    if (prevPricingSectionSize !== pricingSectionSize) {
      setIsPricingSectionAnimating(true);
      const timeout = setTimeout(() => {
        setPrevPricingSectionSize(pricingSectionSize);
        setIsPricingSectionAnimating(false);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [pricingSectionSize, prevPricingSectionSize]);

  // Track price direction for animation (up or down)
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | null>(null);
  
  // Animate price tag when size or quantity changes
  useEffect(() => {
    const currentPrice = currentPricing.find(p => p.quantity === selectedQuantity)?.price || 0;
    const perPillowPrice = currentPrice / selectedQuantity;
    const prevPerPillow = prevPrice !== null ? prevPrice : perPillowPrice;
    
    if (prevPrice !== null && prevPerPillow !== perPillowPrice) {
      // Determine direction: price going up or down
      setPriceDirection(perPillowPrice > prevPerPillow ? 'up' : 'down');
      setIsHeroPriceAnimating(true);
      const timeout = setTimeout(() => {
        setIsHeroPriceAnimating(false);
        setPriceDirection(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
    setPrevPrice(perPillowPrice);
  }, [selectedSize, selectedQuantity, currentPricing, prevPrice]);

  // Helper function to get optimized thumbnail srcset for gallery images
  const getThumbnailSrcSet = (imagePath: string): string => {
    const thumbnailMap: Record<string, string> = {
      '/images/optimized/hero/hero-pillow.png': '/images/optimized/hero/responsive/thumbnails/hero-pillow-64.webp 64w, /images/optimized/hero/responsive/thumbnails/hero-pillow-128.webp 128w',
      '/images/optimized/hero/hero-pillow.webp': '/images/optimized/hero/responsive/thumbnails/hero-pillow-64.webp 64w, /images/optimized/hero/responsive/thumbnails/hero-pillow-128.webp 128w',
      '/images/optimized/lifestyle-sleep.png': '/images/optimized/hero/responsive/thumbnails/lifestyle-sleep-64.webp 64w, /images/optimized/hero/responsive/thumbnails/lifestyle-sleep-128.webp 128w',
      '/images/optimized/lifestyle-sleep.webp': '/images/optimized/hero/responsive/thumbnails/lifestyle-sleep-64.webp 64w, /images/optimized/hero/responsive/thumbnails/lifestyle-sleep-128.webp 128w',
      '/images/optimized/benefits/engineering-detail-new.png': '/images/optimized/hero/responsive/thumbnails/engineering-detail-new-64.webp 64w, /images/optimized/hero/responsive/thumbnails/engineering-detail-new-128.webp 128w',
      '/images/optimized/benefits/engineering-detail-new.webp': '/images/optimized/hero/responsive/thumbnails/engineering-detail-new-64.webp 64w, /images/optimized/hero/responsive/thumbnails/engineering-detail-new-128.webp 128w',
      '/images/optimized/benefits/washing-machine.png': '/images/optimized/hero/responsive/thumbnails/washing-machine-64.webp 64w, /images/optimized/hero/responsive/thumbnails/washing-machine-128.webp 128w',
      '/images/optimized/benefits/washing-machine.webp': '/images/optimized/hero/responsive/thumbnails/washing-machine-64.webp 64w, /images/optimized/hero/responsive/thumbnails/washing-machine-128.webp 128w',
      '/images/optimized/benefits/hotel-comfort-packaging.png': '/images/optimized/hero/responsive/thumbnails/hotel-comfort-packaging-64.webp 64w, /images/optimized/hero/responsive/thumbnails/hotel-comfort-packaging-128.webp 128w',
      '/images/optimized/benefits/hotel-comfort-packaging.webp': '/images/optimized/hero/responsive/thumbnails/hotel-comfort-packaging-64.webp 64w, /images/optimized/hero/responsive/thumbnails/hotel-comfort-packaging-128.webp 128w',
    };
    return thumbnailMap[imagePath] || '';
  };

  // Gallery images - reads from config.gallery.images if available
  // This ensures all pages use the standard gallery system with customizations from their configs
  const getGalleryImages = () => {
    // If config has gallery images defined, use them
    if (config.gallery?.images && config.gallery.images.length > 0) {
      return config.gallery.images.map(img => {
        if (img.type === 'comparison') return 'comparison';
        if (img.type === 'hotel-comparison') return 'hotel-comparison';
        return toWebP(img.src); // Apply WebP optimization
      });
    }
    // Default gallery for pages without gallery config
    // Order: 1-intro, 2-tips, 3-layers, 4-VS, 5-care, 6-hotel/summary, 7-pricing
    return [
      toWebP("/images/optimized/hero/hero-pillow.png"),
      toWebP("/images/optimized/hero/lifestyle-sleep.png"),
      toWebP("/images/optimized/benefits/engineering-detail-new.png"), // New image with overlay cards
      "comparison", // Custom comparison component
      toWebP("/images/optimized/benefits/washing-machine.png"), // With overlay badges
      toWebP("/images/optimized/benefits/hotel-comfort-packaging.png"), // 5-Star Hotel Comfort with overlay cards
      "hotel-comparison", // Hotel price comparison table (pricing)
    ];
  };
  const galleryImages = getGalleryImages();

  // Preload gallery images AFTER initial page load for better performance
  // This ensures the first image loads quickly, then remaining images load in background
  useEffect(() => {
    // Mark the first image as preloaded immediately (it's already being loaded)
    const firstImage = galleryImages[0];
    if (firstImage && firstImage !== 'comparison' && firstImage !== 'hotel-comparison') {
      setPreloadedImages(new Set([firstImage]));
    }

    // Delay preloading remaining images until after initial render and first image load
    const preloadRemainingImages = () => {
      const imagesToPreload = galleryImages.filter(
        (img, idx) => img !== 'comparison' && img !== 'hotel-comparison' && idx !== 0
      );
      
      // Preload images sequentially with small delays to avoid blocking
      imagesToPreload.forEach((src, index) => {
        setTimeout(() => {
          const img = new Image();
          img.onload = () => {
            setPreloadedImages(prev => {
              const newSet = new Set(Array.from(prev));
              newSet.add(src);
              return newSet;
            });
          };
          img.src = src;
        }, 100 * (index + 1)); // Stagger by 100ms each
      });
    };

    // Wait for page to be fully loaded before preloading remaining images
    if (document.readyState === 'complete') {
      // Page already loaded, start preloading after a short delay
      setTimeout(preloadRemainingImages, 500);
    } else {
      // Wait for page load event
      window.addEventListener('load', () => {
        setTimeout(preloadRemainingImages, 500);
      });
    }

    return () => {
      window.removeEventListener('load', preloadRemainingImages);
    };
  }, []);

  // Reset imageLoaded when switching gallery images
  useEffect(() => {
    const currentImage = galleryImages[activeImageIndex];
    if (currentImage === 'comparison' || currentImage === 'hotel-comparison') {
      // These are React components, no image to load
      setImageLoaded(true);
    } else if (preloadedImages.has(currentImage)) {
      // Image already preloaded
      setImageLoaded(true);
    } else {
      // Wait for image to load
      setImageLoaded(false);
    }
  }, [activeImageIndex, preloadedImages]);

  const handleGalleryImageLoad = () => {
    setImageLoaded(true);
  };

  // Navigate gallery programmatically (for thumbnail clicks)
  const navigateGallery = (index: number) => {
    if (galleryScrollRef.current) {
      const slideWidth = galleryScrollRef.current.offsetWidth;
      galleryScrollRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
    }
  };

  const navSections = [
    { id: "benefits", label: "Benefits" },
    { id: "difference", label: "The Difference" },
    { id: "technology", label: "Technology" },
    { id: "reviews", label: "Reviews" },
    { id: "faq", label: "FAQ" },
  ];

  // Emotional testimonials with human touches - use config testimonials or fallback to defaults
  // Note: Config testimonials are merged with default images and ratings
  const defaultTestimonialImages = [
    '/images/optimized/testimonials/testimonial-4.png',
    '/images/optimized/testimonials/testimonial-1.png',
    '/images/optimized/testimonials/testimonial-2.png',
    '/images/optimized/testimonials/testimonial-3.png',
    '/images/optimized/testimonials/testimonial-5.png',
    '/images/optimized/testimonials/testimonial-6.png',
    '/images/optimized/testimonials/testimonial-7.png',
    '/images/optimized/testimonials/testimonial-8.png',
    '/images/testimonial-9.png',
    '/images/testimonial-10.png',
    '/images/testimonial-11.png',
    '/images/testimonial-12.png',
  ];
  
  const configTestimonials = config.testimonials.testimonials.map((t, idx) => ({
    name: t.name,
    location: t.location,
    text: t.content,
    rating: 5,
    image: defaultTestimonialImages[idx] || defaultTestimonialImages[0],
    verified: t.verified,
  }));
  
  const testimonials = configTestimonials.length > 0 ? configTestimonials : [
    { 
      name: "David & Linda", 
      location: "Chicago, IL", 
      text: "We're both in our 60s and have tried EVERYTHING. Memory foam, buckwheat, water pillows... you name it. This is the first one that actually stays put all night. No more 3am pillow fluffing. Finally sleeping through the night again 🙌", 
      rating: 5, 
      image: "/images/optimized/testimonials/testimonial-4.png", 
      verified: true 
    },
    { 
      name: "Margaret T.", 
      location: "Portland, OR", 
      text: "I can't believe I waited so long... After 3 back surgeries, I'd given up on finding a pillow that actually works. This one just... holds me. I wake up and my neck isn't screaming at me anymore. That alone is worth everything 😭", 
      rating: 5, 
      image: "/images/optimized/testimonials/testimonial-1.png", 
      verified: true 
    },
    { 
      name: "Robert K.", 
      location: "Austin, TX", 
      text: "8 months now. Still perfect. I've washed it probably 15 times and it comes out exactly the same every single time. My wife stole mine so I had to order 2 more lol", 
      rating: 5, 
      image: "/images/optimized/testimonials/testimonial-2.png", 
      verified: true 
    },
    { 
      name: "Susan C.", 
      location: "Seattle, WA", 
      text: "My physical therapist actually asked what I changed!! Said my neck alignment improved dramatically. I almost cried in her office... years of pain and THIS is what finally helped. Worth every penny and then some ❤️", 
      rating: 5, 
      image: "/images/optimized/testimonials/testimonial-3.png", 
      verified: true 
    },
    { 
      name: "Jennifer H.", 
      location: "Denver, CO", 
      text: "okay I was SO skeptical... another \"miracle pillow\"? But my daughter kept insisting. Three weeks in and I get it now. The morning stiffness I thought was just \"getting older\"? Gone. Just... gone. I'm ordering more for Christmas gifts!!", 
      rating: 5, 
      image: "/images/optimized/testimonials/testimonial-5.png", 
      verified: true 
    },
    { 
      name: "Michael P.", 
      location: "Phoenix, AZ", 
      text: "Game. Changer. Woke up without that familiar neck tension for the first time in literally years. My wife thought I was being dramatic until she tried it herself. Now we have 4 😅", 
      rating: 5, 
      image: "/images/optimized/testimonials/testimonial-6.png", 
      verified: true 
    },
    { 
      name: "Patricia W.", 
      location: "Boston, MA", 
      text: "At 62, I've been through more pillows than I can count. Spent hundreds on \"premium\" options that went flat in weeks. This one? Still exactly like day one after 6 months. I read in bed every night and the support never wavers. Finally found my forever pillow 💙", 
      rating: 5, 
      image: "/images/optimized/testimonials/testimonial-7.png", 
      verified: true 
    },
    { 
      name: "James L.", 
      location: "San Francisco, CA", 
      text: "Best investment in my sleep. Period. Two months in and it's exactly like day one. No sagging, no adjusting. Just... consistent. Why did it take me 50 years to find a proper pillow?!", 
      rating: 5, 
      image: "/images/optimized/testimonials/testimonial-8.png", 
      verified: true 
    },

  ];

  const visibleTestimonials = showAllTestimonials ? testimonials : testimonials.slice(0, 4);

  // FAQs from config or defaults
  const configFaqs = config.faq.items.map(item => ({ q: item.question, a: item.answer }));
  const defaultFaqs = [
    { q: "What makes FluffCo Pillow so special?", a: "Our FluffCo Zen Pillow offers the luxury of 5-star hotel sleep at a sensible price. With our custom Fluff™ blends and supportive pillow design, we replicate the plush, supportive feel of hotel pillows you adore, but without the hefty markup." },
    { q: "How are FluffCo Pillows more affordable than hotel brand pillows?", a: "We partner directly with the manufacturers that supply to luxury hotels. This eliminates unnecessary markups and enables us to provide a premium soft pillow at a fraction of the cost of brands like Four Seasons, Ritz Carlton, and Marriott." },
    { q: "Can these pillows help improve my sleep quality?", a: "Yes! Our soft yet firm pillow provides superior comfort and support, helping to alleviate neck pain and enhance overall sleep quality. It's perfect for side, back, and stomach sleepers alike." },
    { q: "How do I clean and maintain my pillow?", a: "While we recommend avoiding machine washing for our FluffCo Zen Pillow, it comes with a FREE washable 100% cotton protector. For the microfiber pillow itself, spot cleaning or professional dry cleaning is best. Regular airing can also help keep your pillow fresh." },
    { q: "Are these pillows ethically and sustainably made?", a: "Absolutely. We adhere to the Responsible Down Standard (RDS) for all products, ensuring they're humanely and ethically made." },
    { q: "What is your Good Sleep Guarantee?", a: "If you're not completely satisfied within the 100-Night Better Sleep Guarantee, we're happy to offer you hassle-free returns so your purchase is risk free." },
    { q: "How long until I receive my order?", a: "Processing takes 1-3 business days, Monday through Friday not including holidays. Shipping times vary, but most orders will be received in 4-8 business days." },
  ];
  const faqs = configFaqs.length > 0 ? configFaqs : defaultFaqs;

  const scrollToSection = (id: string) => {
    // Map nav IDs to actual section IDs
    const sectionIdMap: Record<string, string> = {
      'reviews': 'reviews-section',
    };
    const targetId = sectionIdMap[id] || id;
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToPricing = () => {
    const element = document.getElementById('hero-pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const selectOptionAndScroll = (quantity: number, size: "Standard" | "King") => {
    setSelectedSize(size);
    setSelectedQuantity(quantity);
    scrollToPricing();
  };

  const benefitCards = [
    { title: "Holds Shape for Years", desc: "Sanforized construction maintains loft and structure. No flattening, no sagging.", icon: Clock, image: "/images/optimized/hero/hero-pillow.png" },
    { title: "No Daily Fluffing", desc: "The structural core holds its position. Make your bed once and forget about it.", icon: Sparkles, image: "/images/optimized/benefits/benefit-fluffing.png" },
    { title: "Machine Washable", desc: "Reinforced seams handle regular cleaning. Proper hygiene without compromise.", icon: Droplets, image: "/images/optimized/benefits/benefit-washable.png" },
    { title: "Hypoallergenic", desc: "Down alternative fill provides luxury feel without allergens or ethical concerns.", icon: Shield, image: "/images/optimized/benefits/benefit-hypoallergenic.png" },
    { title: "Temperature Neutral", desc: "Breathable cotton cover stays comfortable. No overheating, no cold spots.", icon: Wind, image: "/images/optimized/benefits/benefit-temperature.png" },
    { title: "Consistent Support", desc: "Same feel on night 1,000 as night 1. Your neck knows what to expect.", icon: RefreshCw, image: "/images/optimized/hero/lifestyle-sleep.png" },
  ];

  // CSS variables for event colors
  const eventCssVars = isEventPage && eventColors ? {
    '--event-primary': eventColors.primary,
    '--event-secondary': eventColors.secondary,
    '--event-accent': eventColors.accent,
    '--event-accent-dark': eventColors.accentDark,
    '--event-background': eventColors.background,
  } as React.CSSProperties : {};

  // Check for quiz profile parameter and use-case source
  const urlParams = new URLSearchParams(window.location.search);
  const profileId = urlParams.get('profile');
  const userEmail = urlParams.get('email');
  const fromUseCase = urlParams.get('from'); // e.g., 'side-sleeper-pillow'
  const quizTags = urlParams.get('tags')?.split(',').filter(Boolean) || []; // Parse quiz tags for badges
  const quizLabels = urlParams.get('labels')?.split(',').filter(Boolean) || []; // Human-readable labels for results
  
  // Convert use-case slug to display name
  const getUseCaseName = (slug: string | null) => {
    // Don't show badge for generic 'quiz' source - use quizLabels instead
    if (!slug || slug === 'quiz') return null;
    const names: Record<string, string> = {
      'side-sleeper-pillow': 'Side Sleepers',
      'hot-sleeper': 'Hot Sleepers',
      'neck-pain': 'Neck Pain Relief',
    };
    return names[slug] || null; // Don't fallback to slug parsing, only show known use cases
  };
  
  const useCaseName = getUseCaseName(fromUseCase);

  return (
    <div className="min-h-screen bg-background" style={eventCssVars}>
      <main id="main-content">

      {/* Profile Results Banner - shown when user arrives from quiz */}
      {profileId && <ProfileResultsBanner profileId={profileId} email={userEmail || undefined} tags={quizTags} labels={quizLabels} onRestartQuiz={() => setIsQuizModalOpen(true)} pageId={config.id} />}
      {/* STICKY ANNOUNCEMENT BAR - clickable on mobile */}
      <div 
        data-announcement-bar
        className="sticky top-0 z-[60] text-white py-1.5 sm:py-2.5 px-3 sm:px-4 text-center text-sm sm:cursor-default cursor-pointer transition-colors pointer-events-auto"
        style={{ backgroundColor: isEventPage && eventColors ? eventColors.primary : '#1a1a2e' }}
        onClick={(e) => {
          // Only trigger on mobile (when Claim Now button is hidden)
          if (window.innerWidth < 640) {
            // Haptic feedback for mobile devices
            if (navigator.vibrate) {
              navigator.vibrate(10);
            }
            scrollToPricing();
          }
        }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span>{config.announcementBar.text}</span>
          {!timerExpired && (
            <div className="flex items-center gap-1 font-mono text-xs bg-white/10 px-2 py-1 rounded">
              <span className="tabular-nums">{formatTime(countdown.hours)}</span>
              <span>:</span>
              <span className="tabular-nums">{formatTime(countdown.minutes)}</span>
              <span>:</span>
              <span className="tabular-nums">{formatTime(countdown.seconds)}</span>
            </div>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              scrollToPricing();
            }}
            className="hidden sm:block text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors animate-cta-shimmer"
            style={isEventPage && eventColors ? {
              backgroundColor: eventColors.secondary,
            } : {
              backgroundColor: '#e63946'
            }}
            onMouseEnter={(e) => {
              if (isEventPage && eventColors) {
                // Darken the secondary color by 10% on hover
                const color = eventColors.secondary;
                const darkened = color.replace('#', '');
                const r = Math.max(0, parseInt(darkened.substr(0, 2), 16) - 25);
                const g = Math.max(0, parseInt(darkened.substr(2, 2), 16) - 25);
                const b = Math.max(0, parseInt(darkened.substr(4, 2), 16) - 25);
                e.currentTarget.style.backgroundColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              } else {
                e.currentTarget.style.backgroundColor = '#d62839';
              }
            }}
            onMouseLeave={(e) => {
              if (isEventPage && eventColors) {
                e.currentTarget.style.backgroundColor = eventColors.secondary;
              } else {
                e.currentTarget.style.backgroundColor = '#e63946';
              }
            }}
          >
            {config.announcementBar.ctaText}
          </button>
        </div>
      </div>

      {/* STICKY HEADER - Shows on scroll up, hides on scroll down (desktop only) */}
      {/* Positioned below the sticky announcement bar (top-[44px] accounts for announcement bar height) */}
      <header 
        className={`fixed top-[44px] left-0 right-0 z-50 border-b border-border hidden md:block transition-transform duration-300 ${isEventPage ? 'bg-white' : 'bg-background'} ${showStickyHeader ? 'translate-y-0' : '-translate-y-[calc(100%+44px)]'}`}
        style={{ boxShadow: showStickyHeader ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}
      >
        <div className="container px-4 flex items-center justify-between h-14">
          <FluffLogo className="h-5 w-auto" color="currentColor" />
          <nav className="flex items-center gap-6">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {section.label}
              </button>
            ))}
          </nav>
          <button 
            onClick={scrollToPricing}
            className="text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 animate-cta-shimmer hover:-translate-y-px active:translate-y-0"
            style={{ 
              backgroundColor: isEventPage && eventColors ? eventColors.primary : '#e63946',
              boxShadow: `0 2px 6px ${isEventPage && eventColors ? eventColors.primary : '#e63946'}40`
            }}
          >
            {`${getPageCTA()} →`}
          </button>
        </div>
      </header>

      {/* HEADER - Normal (not sticky) */}
      <header className={`border-b border-border ${isEventPage ? 'bg-white' : 'bg-background'}`}>
        <div className="container px-4 flex items-center justify-between h-14">
          <FluffLogo className="h-5 w-auto" color="currentColor" />
          <nav className="hidden md:flex items-center gap-6">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {section.label}
              </button>
            ))}
          </nav>
          <button 
            onClick={scrollToPricing}
            className="text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 animate-cta-shimmer hover:-translate-y-px active:translate-y-0"
            style={{ 
              backgroundColor: isEventPage && eventColors ? eventColors.primary : '#e63946',
              boxShadow: `0 2px 6px ${isEventPage && eventColors ? eventColors.primary : '#e63946'}40`
            }}
            onMouseEnter={(e) => {
              const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
              e.currentTarget.style.boxShadow = `0 2px 8px ${color}35`;
              e.currentTarget.style.filter = 'brightness(0.97)';
            }}
            onMouseLeave={(e) => {
              const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
              e.currentTarget.style.boxShadow = `0 2px 6px ${color}40`;
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            {`${getPageCTA()} →`}
          </button>
        </div>
      </header>

      {/* BLACK FRIDAY URGENCY SECTION - Only shown on Black Friday page */}
      {config.id === 'black-friday' && <BlackFridayUrgencySection backgroundColor={eventColors?.accentDark || '#f8f8f6'} primaryColor={eventColors?.primary || '#FFD700'} textColor={eventColors?.textOnLight || eventColors?.primary || '#1a1a1a'} accentColor={eventColors?.accent || '#FF6B6B'} />}

      {/* HERO SECTION */}
      <section 
        data-hero-section
        className="pt-0 pb-8 md:py-12 md:pt-5 overflow-x-clip"
        style={isEventPage && eventColors ? {
          background: `linear-gradient(to bottom, ${eventColors.background}, white)`
        } : {}}
      >
        <div className="container px-0 md:px-4 lg:px-4 max-w-full overflow-x-hidden md:overflow-x-visible">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-12 max-w-full">
            {/* LEFT: Product Gallery - Sticky on desktop/tablet */}
            <div className="space-y-2 md:space-y-4 md:sticky md:top-[88px] md:self-start md:h-fit w-full min-w-0 relative md:pl-0 overflow-visible">
              {/* 100 Night Better Sleep Badge - Desktop only here, Mobile is fixed positioned via JS */}
              {/* Desktop badge - positioned at top-right corner overlapping gallery */}
              <div className="hidden md:block absolute -top-5 -right-5 z-30 animate-[fadeSlideIn_0.4s_ease-out_0.15s_both]">
                <div className="relative">
                  {/* Scalloped badge shape - slightly larger for better readability */}
                  <svg viewBox="0 0 80 80" className="w-[80px] h-[80px] lg:w-[88px] lg:h-[88px] drop-shadow-md">
                    <path d="M40 2 L44 8 L52 6 L54 14 L62 14 L62 22 L70 24 L68 32 L76 38 L70 44 L74 52 L66 54 L66 62 L58 62 L54 70 L46 68 L40 76 L34 68 L26 70 L22 62 L14 62 L14 54 L6 52 L10 44 L4 38 L12 32 L10 24 L18 22 L18 14 L26 14 L28 6 L36 8 Z" fill={isEventPage ? eventColors?.accent : '#ffffff'} stroke={isEventPage ? eventColors?.primary : '#e0ddd5'} strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
                  </svg>
                  {/* Badge text content - unified design across breakpoints */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{paddingBottom: '4px'}}>
                    {(() => {
                      const trialText = siteSettings.trial_period_text || '100 Night Better Sleep';
                      const match = trialText.match(/(\d+)[\-\s]*(\w+)\s*(\w*)\s*(\w*)/i);
                      const num = match ? match[1] : '100';
                      const word1 = match ? match[2] : 'Night';
                      const word2 = match ? match[3] : 'Better';
                      const word3 = match ? match[4] : 'Sleep';
                      const primaryColor = isEventPage ? eventColors?.primary : '#2d3a5c';
                      return (
                        <div className="flex flex-col items-center justify-center gap-0" style={{marginTop: '2px'}}>
                          {/* 100 NIGHTS - prominent in blue */}
                          <span className="text-2xl lg:text-[28px] font-black leading-none" style={{ color: primaryColor, marginBottom: '-5px' }}>{num}</span>
                          <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider leading-none mt-0.5" style={{ color: primaryColor, fontSize: '12px', marginBottom: '1px' }}>{word1}S</span>
                          {/* BETTER SLEEP - same style, no opacity reduction */}
                          <div className="flex flex-col items-center mt-0.5" style={{marginTop: '0px'}}>
                            <span className="text-[7px] lg:text-[8px] font-semibold uppercase tracking-wide leading-none" style={{ color: primaryColor }}>{word2}</span>
                            <span className="text-[7px] lg:text-[8px] font-semibold uppercase tracking-wide leading-none" style={{ color: primaryColor }}>{word3}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <div 
                className="aspect-square bg-secondary rounded-none md:rounded-lg overflow-hidden relative"
              >
                {/* 100 Night Better Sleep Badge - Mobile only, first slide only */}
                {activeImageIndex === 0 && (
                  <div className="md:hidden absolute top-2 right-2 z-30 animate-[fadeSlideIn_0.4s_ease-out_0.15s_both]">
                    <div className="relative">
                      {/* Scalloped badge shape - same size as desktop (80px) */}
                      <svg viewBox="0 0 80 80" className="w-[80px] h-[80px] drop-shadow-md">
                        <path d="M40 2 L44 8 L52 6 L54 14 L62 14 L62 22 L70 24 L68 32 L76 38 L70 44 L74 52 L66 54 L66 62 L58 62 L54 70 L46 68 L40 76 L34 68 L26 70 L22 62 L14 62 L14 54 L6 52 L10 44 L4 38 L12 32 L10 24 L18 22 L18 14 L26 14 L28 6 L36 8 Z" fill={isEventPage ? eventColors?.accent : '#ffffff'} stroke={isEventPage ? eventColors?.primary : '#e0ddd5'} strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
                      </svg>
                      {/* Badge text content - exact same as desktop */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {(() => {
                          const trialText = siteSettings.trial_period_text || '100 Night Better Sleep';
                          const match = trialText.match(/(\d+)[\-\s]*(\w+)\s*(\w*)\s*(\w*)/i);
                          const num = match ? match[1] : '100';
                          const word1 = match ? match[2] : 'Night';
                          const word2 = match ? match[3] : 'Better';
                          const word3 = match ? match[4] : 'Sleep';
                          const primaryColor = isEventPage ? eventColors?.primary : '#2d3a5c';
                          return (
                            <div className="flex flex-col items-center justify-center gap-0" style={{marginTop: '2px'}}>
                              {/* 100 NIGHTS - same as desktop */}
                              <span className="text-2xl font-black leading-none" style={{ color: primaryColor, marginBottom: '-5px' }}>{num}</span>
                              <span className="text-[9px] font-bold uppercase tracking-wider leading-none mt-0.5" style={{ color: primaryColor, fontSize: '12px', marginBottom: '1px' }}>{word1}S</span>
                              {/* BETTER SLEEP - same as desktop */}
                              <div className="flex flex-col items-center mt-0.5" style={{marginTop: '0px'}}>
                                <span className="text-[7px] font-semibold uppercase tracking-wide leading-none" style={{ color: primaryColor }}>{word2}</span>
                                <span className="text-[7px] font-semibold uppercase tracking-wide leading-none" style={{ color: primaryColor }}>{word3}</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )}
                {/* Horizontal scroll carousel - all images laid out side-by-side */}
                <div 
                  className="flex w-full h-full overflow-x-scroll snap-x snap-mandatory scrollbar-hide"
                  style={{
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                  }}
                  onScroll={(e) => {
                    const container = e.currentTarget;
                    const scrollLeft = container.scrollLeft;
                    const slideWidth = container.offsetWidth;
                    const newIndex = Math.round(scrollLeft / slideWidth);
                    if (newIndex !== activeImageIndex) {
                      setActiveImageIndex(newIndex);
                    }
                  }}
                  ref={(el) => {
                    if (el && galleryScrollRef.current !== el) {
                      galleryScrollRef.current = el;
                    }
                  }}
                >
                  {/* Render all gallery images side-by-side */}
                  {galleryImages.map((image, index) => (
                    <div 
                      key={index}
                      className="w-full h-full flex-shrink-0 snap-center"
                    >
                      {image === 'comparison' ? (
                        <ComparisonSlide />
                      ) : image === 'hotel-comparison' ? (
                        <HotelComparisonSlide fluffPrice={`$${((currentPricing.find(p => p.quantity === selectedQuantity)?.price || 0) / selectedQuantity).toFixed(0)}`} />
                      ) : (
                        <BlurImage 
                          src={image} 
                          alt="Product" 
                          className="w-full h-full object-cover"
                          blurAmount={15}
                          transitionDuration={400}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          fetchPriority={index === 0 ? 'high' : undefined}
                          onLoad={() => {
                            if (index === activeImageIndex) {
                              handleGalleryImageLoad();
                            }
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                {/* First Image Badges - Base page only (exclude neck-pain-relief and restorative-alignment which have their own overlays) */}
                {activeImageIndex === 0 && imageLoaded && config.id !== 'neck-pain-relief' && config.id !== 'restorative-alignment' && (
                  <>
                    {/* Event Headline Overlay - Top Right for event pages */}
                    {isEventPage && config.hero.eventHeadline && (
                      <div className="absolute top-4 right-4 lg:top-6 lg:right-6 max-w-[280px] lg:max-w-[380px] animate-[fadeSlideIn_0.4s_ease-out_0.15s_both] z-20 text-right">
                        <p 
                          className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                          style={{ color: '#ffffff' }}
                        >
                          {/* Support line breaks in eventHeadline using <br> tag or newline */}
                          {config.hero.eventHeadline.split('\n').map((line, idx, arr) => (
                            <span key={idx}>
                              {line}
                              {idx < arr.length - 1 && <br />}
                            </span>
                          ))}
                        </p>
                      </div>
                    )}
                    {/* Profile-Based Contextual Badge - Top Right for quiz profiles (same design as event headline) */}
                    {!isEventPage && quizTags.length > 0 && (() => {
                      // Define playful sentences for each profile tag
                      const profileMessages: Record<string, string> = {
                        'neck-pain': 'Finally, mornings\nwithout the ouch',
                        'hot-sleeper': 'No more flipping\nfor the cool side',
                        'restless': 'Sleep through\nthe night, finally',
                        'stomach': 'Designed for\nface-down dreamers',
                        'back': 'Perfect support,\nzero pressure points',
                        'side': 'Made for\nside sleepers like you',
                      };
                      // Find the first matching tag
                      const matchedTag = quizTags.find(tag => profileMessages[tag]);
                      if (!matchedTag) return null;
                      const message = profileMessages[matchedTag];
                      return (
                        <div className="absolute top-4 right-4 lg:top-6 lg:right-6 max-w-[280px] lg:max-w-[380px] animate-[fadeSlideIn_0.4s_ease-out_0.15s_both] z-20 text-right">
                          <p 
                            className="text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                            style={{ color: '#ffffff' }}
                          >
                            {message.split('\n').map((line, idx, arr) => (
                              <span key={idx}>
                                {line}
                                {idx < arr.length - 1 && <br />}
                              </span>
                            ))}
                          </p>
                        </div>
                      );
                    })()}
                    {/* Dynamic Price Tag Overlay - Only for hotel-quality page */}
                    {config.id === 'hotel-quality' && (
                      <div className="absolute bottom-16 right-4 lg:bottom-20 lg:right-6 animate-[fadeSlideIn_0.4s_ease-out_0.3s_both] z-20">
                        <div className="relative">
                          {/* Price tag shape */}
                          <div className="bg-white shadow-xl rounded-lg px-4 py-3 border-2 border-amber-400 relative">
                            {/* Tag hole */}
                            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full border-2 border-white shadow-sm"></div>
                            {/* String */}
                            <div className="absolute -left-4 top-1/2 w-3 h-0.5 bg-amber-600/50"></div>
                            
                            {/* Price per unit with animation */}
                            <div className="text-center">
                              <div className="text-[10px] text-gray-500 uppercase tracking-wide font-medium mb-0.5">Per Pillow</div>
                              <div className="flex items-baseline justify-center gap-1">
                                <span 
                                  className="text-2xl lg:text-3xl font-bold text-gray-900 inline-block"
                                  style={{
                                    transition: 'transform 0.25s ease-out, opacity 0.2s ease',
                                    transform: isHeroPriceAnimating ? 'scale(1.05)' : 'scale(1)',
                                    opacity: isHeroPriceAnimating ? 0.85 : 1
                                  }}
                                >
                                  ${((currentPricing.find(p => p.quantity === selectedQuantity)?.price || 0) / selectedQuantity).toFixed(0)}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  ${((currentPricing.find(p => p.quantity === selectedQuantity)?.originalPrice || 0) / selectedQuantity).toFixed(0)}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-500 mt-0.5">
                                Total: ${(currentPricing.find(p => p.quantity === selectedQuantity)?.price || 0).toFixed(0)} for {selectedQuantity}
                              </div>
                              <div className="mt-1 bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block">
                                Save ${(currentPricing.find(p => p.quantity === selectedQuantity)?.savings || 0).toFixed(0)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Oprah Daily Badge - Top Left - Brand-approved WebP image */}
                    <div className="absolute top-4 left-4 animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <img 
                        src="/images/oprah-sleep-awards-2024.webp" 
                        srcSet="/images/oprah-sleep-awards-2024-small.webp 120w, /images/oprah-sleep-awards-2024-150.webp 150w, /images/oprah-sleep-awards-2024-170.webp 170w, /images/oprah-sleep-awards-2024.webp 400w"
                        sizes="(max-width: 640px) 95px, (max-width: 1024px) 120px, 120px"
                        alt="Oprah Daily Sleep O-Wards 2024" 
                        className="w-[95px] h-[95px] lg:w-[120px] lg:h-[120px] rounded-full shadow-md object-cover"
                      />
                    </div>

                    {/* Award Carousel Badge - Bottom Center */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-[fadeSlideIn_0.4s_ease-out_0.2s_both]">
                      <div className="bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 lg:px-2.5 lg:py-1.5 shadow-md flex items-center gap-1.5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAwardIndex(prev => prev === 0 ? awardsList.length - 1 : prev - 1); }}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Previous award"
                        >
                          <ChevronLeft className="w-3 h-3 text-gray-800" />
                        </button>
                        <div 
                          key={awardIndex}
                          className="flex items-center gap-1.5 whitespace-nowrap animate-[fadeInUp_0.4s_ease-out_both]"
                        >
                          <span className="text-gray-900 text-[11px] lg:text-xs font-semibold">
                            {awardsList[awardIndex].award}
                          </span>
                          <span className="text-muted-foreground text-[10px] lg:text-[11px]">
                            {awardsList[awardIndex].publication}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAwardIndex(prev => (prev + 1) % awardsList.length); }}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Next award"
                        >
                          <ChevronRight className="w-3 h-3 text-gray-800" />
                        </button>
                      </div>
                    </div>

                  </>
                )}
                {/* Neck Pain Relief - First Image Overlay */}
                {activeImageIndex === 0 && config.id === 'neck-pain-relief' && imageLoaded && (
                  <>
                    {/* Oprah Daily Badge - Top Left - Brand-approved WebP image */}
                    <div className="absolute top-4 left-4 animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <img 
                        src="/images/oprah-sleep-awards-2024.webp" 
                        srcSet="/images/oprah-sleep-awards-2024-small.webp 120w, /images/oprah-sleep-awards-2024-150.webp 150w, /images/oprah-sleep-awards-2024-170.webp 170w, /images/oprah-sleep-awards-2024.webp 400w"
                        sizes="(max-width: 640px) 95px, (max-width: 1024px) 120px, 120px"
                        alt="Oprah Daily Sleep O-Wards 2024" 
                        className="w-[95px] h-[95px] lg:w-[120px] lg:h-[120px] rounded-full shadow-md object-cover"
                      />
                    </div>
                    {/* Bottom Left Badge - Neutral Alignment */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-3 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[160px] lg:max-w-[200px] animate-[fadeSlideIn_0.4s_ease-out_0.2s_both]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2563eb] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">1</span>
                        <span className="text-[11px] lg:text-sm font-bold">Neutral Alignment</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Maintains natural spine curvature</p>
                    </div>
                    {/* Bottom Right Badge - Proper Support */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-3 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[160px] lg:max-w-[200px] animate-[fadeSlideIn_0.4s_ease-out_0.35s_both]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2563eb] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">2</span>
                        <span className="text-[11px] lg:text-sm font-bold">Proper Support</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Consistent support night after night</p>
                    </div>
                    {/* Award Badge - Top Center (same style as base page) */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 animate-[fadeSlideIn_0.4s_ease-out_0.2s_both]">
                      <div className="bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 lg:px-2.5 lg:py-1.5 shadow-md flex items-center gap-1.5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAwardIndex(prev => prev === 0 ? awardsList.length - 1 : prev - 1); }}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Previous award"
                        >
                          <ChevronLeft className="w-3 h-3 text-gray-800" />
                        </button>
                        <div 
                          key={awardIndex}
                          className="flex items-center gap-1.5 whitespace-nowrap animate-[fadeInUp_0.4s_ease-out_both]"
                        >
                          <span className="text-gray-900 text-[11px] lg:text-xs font-semibold">
                            {awardsList[awardIndex].award}
                          </span>
                          <span className="text-muted-foreground text-[10px] lg:text-[11px]">
                            {awardsList[awardIndex].publication}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAwardIndex(prev => (prev + 1) % awardsList.length); }}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Next award"
                        >
                          <ChevronRight className="w-3 h-3 text-gray-800" />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Restorative Alignment - First Image Overlay */}
                {activeImageIndex === 0 && config.id === 'restorative-alignment' && imageLoaded && (
                  <>
                    {/* Oprah Daily Badge - Top Left - Brand-approved WebP image */}
                    <div className="absolute top-4 left-4 animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <img 
                        src="/images/oprah-sleep-awards-2024.webp" 
                        srcSet="/images/oprah-sleep-awards-2024-small.webp 120w, /images/oprah-sleep-awards-2024-150.webp 150w, /images/oprah-sleep-awards-2024-170.webp 170w, /images/oprah-sleep-awards-2024.webp 400w"
                        sizes="(max-width: 640px) 95px, (max-width: 1024px) 120px, 120px"
                        alt="Oprah Daily Sleep O-Wards 2024" 
                        className="w-[95px] h-[95px] lg:w-[120px] lg:h-[120px] rounded-full shadow-md object-cover"
                      />
                    </div>
                    {/* Bottom Left Badge - Neutral Alignment */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-3 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[160px] lg:max-w-[200px] animate-[fadeSlideIn_0.4s_ease-out_0.2s_both]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#c9a962] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">1</span>
                        <span className="text-[11px] lg:text-sm font-bold">Neutral Alignment</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Maintains natural spine curvature</p>
                    </div>
                    {/* Bottom Right Badge - Proper Support */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-3 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[160px] lg:max-w-[200px] animate-[fadeSlideIn_0.4s_ease-out_0.35s_both]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#c9a962] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">2</span>
                        <span className="text-[11px] lg:text-sm font-bold">Proper Support</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Consistent support night after night</p>
                    </div>
                    {/* Award Badge - Top Center (same style as base page) */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 animate-[fadeSlideIn_0.4s_ease-out_0.2s_both]">
                      <div className="bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 lg:px-2.5 lg:py-1.5 shadow-md flex items-center gap-1.5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAwardIndex(prev => prev === 0 ? awardsList.length - 1 : prev - 1); }}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Previous award"
                        >
                          <ChevronLeft className="w-3 h-3 text-gray-800" />
                        </button>
                        <div 
                          key={awardIndex}
                          className="flex items-center gap-1.5 whitespace-nowrap animate-[fadeInUp_0.4s_ease-out_both]"
                        >
                          <span className="text-gray-900 text-[11px] lg:text-xs font-semibold">
                            {awardsList[awardIndex].award}
                          </span>
                          <span className="text-muted-foreground text-[10px] lg:text-[11px]">
                            {awardsList[awardIndex].publication}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAwardIndex(prev => (prev + 1) % awardsList.length); }}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
                          aria-label="Next award"
                        >
                          <ChevronRight className="w-3 h-3 text-gray-800" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {/* Tips Overlay Badges - dynamically detects tips slide based on image path */}
                {galleryImages[activeImageIndex]?.includes?.('lifestyle-sleep') && galleryImages[activeImageIndex] !== 'comparison' && galleryImages[activeImageIndex] !== 'hotel-comparison' && imageLoaded && (
                  <>
                    {/* Top Left Badge - Responsive sizing */}
                    <div className="absolute top-3 left-3 lg:top-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">1</span>
                        <span className="text-[11px] lg:text-sm font-bold">{config.gallery?.slotOverrides?.tips?.pills?.[0]?.title || 'Elevate Your Sleep'}</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">{config.gallery?.slotOverrides?.tips?.pills?.[0]?.description || 'Same 5-star quality as luxury resorts'}</p>
                    </div>
                    {/* Right Badge - Responsive sizing - Positioned at bottom third to avoid covering face */}
                    <div className="absolute bottom-1/3 right-3 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.25s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">2</span>
                        <span className="text-[11px] lg:text-sm font-bold">{config.gallery?.slotOverrides?.tips?.pills?.[1]?.title || 'Custom Support'}</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">{config.gallery?.slotOverrides?.tips?.pills?.[1]?.description || 'Adapts to your sleep position all night'}</p>
                    </div>
                    {/* Bottom Left Badge - Responsive sizing */}
                    <div className="absolute bottom-3 left-3 lg:bottom-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.4s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">3</span>
                        <span className="text-[11px] lg:text-sm font-bold">{config.gallery?.slotOverrides?.tips?.pills?.[2]?.title || 'Wake Refreshed'}</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">{config.gallery?.slotOverrides?.tips?.pills?.[2]?.description || 'Clear-eyed, pain free, ready for the day'}</p>
                    </div>
                  </>
                )}
                {/* Engineering Detail Overlay Badges for engineering-detail image - ALTERNATE POSITIONS with animations */}
                {(galleryImages[activeImageIndex] === '/images/optimized/benefits/engineering-detail-new.png' || galleryImages[activeImageIndex] === '/images/optimized/benefits/engineering-detail-new.webp') && imageLoaded && (
                  <>
                    {/* Top Right Badge - Cotton Shell - Responsive */}
                    <div className="absolute top-3 right-3 lg:top-6 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">1</span>
                        <span className="text-[11px] lg:text-sm font-bold">Cotton Shell</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">100% breathable cotton exterior</p>
                    </div>
                    {/* Middle Left Badge - Microfiber Fill - Responsive */}
                    <div className="absolute top-1/2 -translate-y-1/2 left-3 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.25s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">2</span>
                        <span className="text-[11px] lg:text-sm font-bold">Microfiber Fill</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">5x thinner than human hair for plush feel</p>
                    </div>
                    {/* Bottom Right Badge - Structural Core - Responsive */}
                    <div className="absolute bottom-3 right-3 lg:bottom-6 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.4s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">3</span>
                        <span className="text-[11px] lg:text-sm font-bold">Structural Core</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Sanforized for lasting shape retention</p>
                    </div>
                  </>
                )}
                {/* Built for Real Life Overlay Badges for washing machine image with animations */}
                {(galleryImages[activeImageIndex] === '/images/optimized/benefits/washing-machine.png' || galleryImages[activeImageIndex] === '/images/optimized/benefits/washing-machine.webp') && imageLoaded && (
                  <>
                    {/* Top Left Badge - Responsive */}
                    <div className="absolute top-3 left-3 lg:top-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">1</span>
                        <span className="text-[11px] lg:text-sm font-bold">Machine Washable</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Toss it in, comes out perfect</p>
                    </div>
                    {/* Right Badge - Responsive */}
                    <div className="absolute top-1/3 right-3 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.25s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">2</span>
                        <span className="text-[11px] lg:text-sm font-bold">Shape Retention</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Maintains loft after every wash</p>
                    </div>
                    {/* Bottom Left Badge - Responsive */}
                    <div className="absolute bottom-3 left-3 lg:bottom-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.4s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">3</span>
                        <span className="text-[11px] lg:text-sm font-bold">Practical Hygiene</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Clean sleep without compromise</p>
                    </div>
                  </>
                )}
                {/* 5-Star Hotel Comfort Overlay - Three icon cards at bottom */}
                {(galleryImages[activeImageIndex] === '/images/optimized/benefits/hotel-comfort-packaging.png' || galleryImages[activeImageIndex] === '/images/optimized/benefits/hotel-comfort-packaging.webp' || galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.png' || galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.webp') && imageLoaded && (
                  <>
                    {/* Top Banner - Main Headline with PureWow Badge */}
                    <div className="absolute top-4 left-0 right-0 text-center animate-[fadeSlideIn_0.3s_ease-out_0.1s_both]">
                      <h3 className={`text-lg lg:text-2xl font-bold tracking-tight ${
                        (galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.png' || galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.webp')
                          ? 'text-white' 
                          : 'text-[#2d3a5c]'
                      }`}>5-Star Hotel Comfort at Home</h3>
                      {/* PureWow 95/100 Badge - Trustpilot style */}
                      <div className="inline-flex items-center gap-2 mt-2 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={i < 5 ? '#00b67a' : '#dcdce6'}>
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#00b67a]">95/100</span>
                        <span className="text-[10px] text-gray-500 font-medium">PureWow</span>
                      </div>
                    </div>
                    
                    {/* Three Icon Cards Row - Bottom area */}
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2 lg:gap-4">
                      {/* Ethical Down Alternative */}
                      <div className="flex flex-col items-center text-center flex-1 animate-[fadeSlideIn_0.4s_ease-out_0.15s_both]">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 mb-1 text-[#d4a5a5]">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M8.5 5A1.5 1.5 0 0 0 7 6.5c0 .5.2.9.5 1.2L9 9l-1.5 1.3c-.3.3-.5.7-.5 1.2a1.5 1.5 0 0 0 3 0c0-.5-.2-.9-.5-1.2L8 9l1.5-1.3c.3-.3.5-.7.5-1.2A1.5 1.5 0 0 0 8.5 5zM12 12c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2h-8z"/></svg>
                        </div>
                        <span className={`text-[10px] lg:text-xs font-semibold leading-tight ${
                          (galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.png' || galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.webp')
                            ? 'text-white' 
                            : 'text-[#2d3a5c]'
                        }`}>Ethical Down</span>
                        <span className={`text-[10px] lg:text-xs font-semibold leading-tight ${
                          (galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.png' || galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.webp')
                            ? 'text-white' 
                            : 'text-[#2d3a5c]'
                        }`}>Alternative</span>
                      </div>
                      {/* 300 Thread Count */}
                      <div className="flex flex-col items-center text-center flex-1 animate-[fadeSlideIn_0.4s_ease-out_0.25s_both]">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 mb-1 text-[#d4a5a5]">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><rect x="4" y="6" width="16" height="12" rx="2"/><line x1="4" y1="10" x2="20" y2="10"/></svg>
                        </div>
                        <span className={`text-[10px] lg:text-xs font-semibold leading-tight ${
                          (galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.png' || galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.webp')
                            ? 'text-white' 
                            : 'text-[#2d3a5c]'
                        }`}>300 Thread</span>
                        <span className={`text-[10px] lg:text-xs font-semibold leading-tight ${
                          (galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.png' || galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.webp')
                            ? 'text-white' 
                            : 'text-[#2d3a5c]'
                        }`}>Count Cotton</span>
                      </div>
                      {/* 5-Star Quality */}
                      <div className="flex flex-col items-center text-center flex-1 animate-[fadeSlideIn_0.4s_ease-out_0.35s_both]">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 mb-1 text-[#d4a5a5]">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/></svg>
                        </div>
                        <span className={`text-[10px] lg:text-xs font-semibold leading-tight ${
                          (galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.png' || galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.webp')
                            ? 'text-white' 
                            : 'text-[#2d3a5c]'
                        }`}>5-Star Luxury</span>
                        <span className={`text-[10px] lg:text-xs font-semibold leading-tight ${
                          (galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.png' || galleryImages[activeImageIndex] === '/images/optimized/events/black-friday-packaging.webp')
                            ? 'text-white' 
                            : 'text-[#2d3a5c]'
                        }`}>Quality</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              {/* Thumbnail container with hidden scrollbar and gradient indicators */}
              <div className="relative -mx-0 lg:mx-0">
                {/* Left gradient indicator - adapts to event color scheme */}
                <div 
                  className="absolute left-0 top-0 bottom-2 w-12 pointer-events-none z-10 opacity-0 transition-opacity duration-200" 
                  id="thumb-gradient-left"
                  style={{ background: `linear-gradient(to right, ${isEventPage && eventColors ? eventColors.background : 'var(--background)'}, transparent)` }}
                />
                {/* Right gradient indicator - adapts to event color scheme */}
                <div 
                  className="absolute right-0 top-0 bottom-2 w-12 pointer-events-none z-10" 
                  id="thumb-gradient-right"
                  style={{ background: `linear-gradient(to left, ${isEventPage && eventColors ? eventColors.background : 'var(--background)'}, transparent)` }}
                />
                <div 
                  className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0"
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const leftGradient = document.getElementById('thumb-gradient-left');
                    const rightGradient = document.getElementById('thumb-gradient-right');
                    
                    // Only show gradients if content actually overflows
                    const hasOverflow = el.scrollWidth > el.clientWidth;
                    
                    if (!hasOverflow) {
                      // No overflow - hide both gradients
                      if (leftGradient) leftGradient.style.opacity = '0';
                      if (rightGradient) rightGradient.style.opacity = '0';
                    } else {
                      // Has overflow - show gradients based on scroll position
                      if (leftGradient) leftGradient.style.opacity = el.scrollLeft > 10 ? '1' : '0';
                      if (rightGradient) rightGradient.style.opacity = el.scrollLeft < el.scrollWidth - el.clientWidth - 10 ? '1' : '0';
                    }
                  }}
                >
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigateGallery(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      {/* Thumbnail with dynamic image and tag indicator - detect comparison slides by content */}
                      {galleryImages[idx] === 'comparison' ? (
                        <ComparisonThumbnail />
                      ) : galleryImages[idx] === 'hotel-comparison' ? (
                        <HotelComparisonThumbnail />
                      ) : (
                        <div className="w-full h-full relative">
                          <img 
                            src={galleryImages[idx]} 
                            srcSet={getThumbnailSrcSet(galleryImages[idx])}
                            sizes="64px"
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                          {/* Tag indicators based on image content */}
                          {idx === 0 && config.id === 'hotel-quality' && (
                            <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                              <span className="text-[7px] font-semibold text-[#2d3a5c]">50% off</span>
                            </div>
                          )}
                          {idx === 0 && config.id === 'neck-pain-relief' && (
                            <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                              <span className="text-[7px] font-semibold text-[#2d3a5c]">align</span>
                            </div>
                          )}
                          {idx === 0 && config.id === 'restorative-alignment' && (
                            <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                              <span className="text-[7px] font-semibold text-[#2d3a5c]">align</span>
                            </div>
                          )}
                          {idx === 0 && config.id !== 'hotel-quality' && config.id !== 'neck-pain-relief' && config.id !== 'restorative-alignment' && (
                            <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                              <span className="text-[7px] font-semibold text-[#2d3a5c]">5-star</span>
                            </div>
                          )}
                          {galleryImages[idx].includes('hotel-comfort-packaging') && (
                            <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                              <span className="text-[7px] font-semibold text-[#2d3a5c]">hotel</span>
                            </div>
                          )}
                          {/* Gallery 2 - tips slot (index 1) - works for any image including custom event images */}
                          {idx === 1 && galleryImages[idx] !== 'comparison' && galleryImages[idx] !== 'hotel-comparison' && (
                            <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                              <span className="text-[7px] font-semibold text-[#2d3a5c]">why</span>
                            </div>
                          )}
                          {/* Gallery 3 - engineering-detail */}
                          {galleryImages[idx].includes('engineering-detail') && (
                            <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                              <span className="text-[7px] font-semibold text-[#2d3a5c]">3 layers</span>
                            </div>
                          )}
                          {/* Gallery 5 - washing-machine */}
                          {galleryImages[idx].includes('washing-machine') && (
                            <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                              <span className="text-[7px] font-semibold text-[#2d3a5c]">care</span>
                            </div>
                          )}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="space-y-6 px-4 md:px-0 overflow-hidden md:overflow-visible max-w-full" id="hero-pricing" data-hero-section>
              <div className="flex flex-wrap items-center gap-2 md:gap-3" style={{marginBottom: '12px'}}>
                {/* Hotel Quality: Show 5-Star Secret badge instead of stars */}
                {config.id === 'hotel-quality' ? (
                  <div className="flex items-center gap-2 relative">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#2d3a5c]/5 rounded-full">
                      <svg className="w-3.5 h-3.5 text-[#c9a962]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      <span className="text-xs font-semibold text-[#2d3a5c]">The 5-Star Secret</span>
                    </div>
                    <span className="text-xs text-muted-foreground"><CustomerCount responsive /> Happy Sleepers</span>

                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      const reviewsSection = document.getElementById('reviews-section');
                      if (reviewsSection) {
                        reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground"><CustomerCount responsive /> Happy Sleepers</span>
                  </button>
                )}
                {/* PureWow Badge with Hover Info-box - hidden on mobile */}
                <div className="hidden sm:block relative group">
                  <div 
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full cursor-pointer"
                    style={isEventPage ? { backgroundColor: `${eventColors?.primary}1a` } : { backgroundColor: 'rgba(0, 182, 122, 0.1)' }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill={isEventPage ? eventColors?.primary : '#00b67a'}>
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-xs font-bold" style={isEventPage ? { color: eventColors?.primary } : { color: '#00b67a' }}>95/100</span>
                    <span className="text-xs text-muted-foreground font-medium">PureWow</span>
                  </div>
                  {/* Hover Info-box - desktop only, centered with viewport bounds, reduced hover zone */}
                  <div className="hidden sm:block absolute top-full left-1/2 -translate-x-1/2 w-72 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" style={{ minWidth: '288px', maxWidth: 'calc(100vw - 24px)', paddingTop: '5px' }}>
                    <div className="bg-white dark:bg-card rounded-xl shadow-xl border border-border p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <svg viewBox="0 0 2010 350" className="h-4 w-auto flex-shrink-0" fill="#000">
                        <path d="M2.49,341.4V16.01h52.27v30.49c21.78-24.39,50.53-37.03,79.28-37.03,51.4,0,100.62,40.08,100.62,122.84s-56.63,142.01-124.15,142.01c-18.3,0-37.03-4.79-55.76-14.81v81.89H2.49ZM185.44,135.8c0-69.26-30.06-113.26-69.7-113.26-20.91,0-43.12,11.33-60.98,31.8v198.2c15.25,8.71,30.49,12.63,44,12.63,53.14,0,86.68-58.81,86.68-129.37Z"/>
                        <path d="M269.18,197.22V16.01h52.27v200.38c0,32.23,16.99,47.48,37.9,47.48,36.59,0,74.92-47.04,82.76-114.13V16.01h52.27v251.78h-52.27v-84.94h-1.31c-17.42,58.81-52.71,91.91-94.53,91.91s-77.1-25.7-77.1-77.54Z"/>
                        <path d="M523.68,267.78V16.01h52.27v123.71h.44c22.22-90.6,72.31-145.49,131.55-123.71l-6.53,34.85c-60.11-28.31-103.24,16.99-125.45,107.59v109.34h-52.27Z"/>
                        <path d="M839.61,267.36c-38.92,0-70.27-33.11-79.81-91.01,12.22-12.03,91.52-47.34,181.26-36.95.4.06.83.11,1.25.17l5.2.7c2.61-10.88,2.31-17.96,2.31-27.55,0-69.7-54.89-104.12-112.81-104.12-64.05,0-131.99,42.7-131.99,127.64s64.9,137.65,138.95,137.65c35.29,0,72.3-11.77,104.99-37.48l-10.9-34.85c-33.98,44.43-68.83,65.79-98.43,65.79ZM756.85,143.62v-.15c.87-80.15,42.67-127.9,80.58-127.9,33.53,0,64.48,30.48,64.48,94.09v3.29c0,11.71-2.31,19.49-16.73,20.11,0,0-2.97.17-7.36.57-.64.06-1.29.13-1.97.19-45.18,4.28-98.1,20.83-117.01,35.89-1.1-8.23-1.76-16.93-1.97-26.07v-.02Z"/>
                        <path d="M1048.47,267.78l-97.14-251.78h51.84l78.84,202.56,77.97-202.56h23.52l84.94,218.67,45.74-116.74c13.07-32.67,14.81-65.78,10.45-101.93h34.85l-97.57,251.78h-33.11l-80.59-206.48-79.72,206.48h-20.04Z"/>
                        <path d="M1413.65,256.46c-19.45-11.77-34.75-27.8-45.88-48.11-11.14-20.3-16.7-42.57-16.7-66.8s5.62-46.09,16.86-66.28c11.24-20.19,26.59-36.17,46.05-47.94,19.45-11.77,41.07-17.65,64.85-17.65s45.72,5.88,65.17,17.65c19.46,11.77,34.75,27.81,45.88,48.11,11.13,20.31,16.7,42.46,16.7,66.45s-5.62,46.15-16.86,66.46c-11.24,20.31-26.59,36.34-46.04,48.11-19.46,11.77-41.07,17.65-64.85,17.65s-45.72-5.88-65.18-17.65ZM1546.92,236.21c12.1-16.49,18.16-37.9,18.16-64.2,0-23.76-4.22-47.3-12.65-70.61-8.43-23.3-20.1-42.4-35.02-57.28-14.92-14.88-31.56-22.32-49.93-22.32-3.24,0-6.7.35-10.38,1.04-21.19,2.31-37.29,11.77-48.31,28.38-11.02,16.61-16.54,37.38-16.54,62.3.21,24,4.59,47.36,13.13,70.09,8.54,22.73,20.43,41.31,35.67,55.72,15.24,14.42,32.15,21.63,50.75,21.63,24.64,0,43.01-8.25,55.12-24.75Z"/>
                        <path d="M1696.49,267.78l-97.14-251.78h51.84l78.84,202.56,77.97-202.56h23.52l84.94,218.67,45.74-116.74c13.07-32.67,14.81-65.78,10.45-101.93h34.85l-97.57,251.78h-33.11l-80.59-206.48-79.72,206.48h-20.04Z"/>
                      </svg>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-sm text-foreground">PureWow</span>
                          {/* Twitter-style verified checkmark */}
                          <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 22 22" fill="none">
                            <circle cx="11" cy="11" r="11" fill="#1D9BF0"/>
                            <path d="M9.5 14.25L6.75 11.5L7.8125 10.4375L9.5 12.125L14.1875 7.4375L15.25 8.5L9.5 14.25Z" fill="white"/>
                          </svg>
                        </div>
                        <div className="text-xs text-muted-foreground">By Abby Hepworth</div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Value</span>
                        <span className="font-semibold text-foreground">19/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Functionality</span>
                        <span className="font-semibold text-foreground">19/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quality</span>
                        <span className="font-semibold text-foreground">20/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Aesthetics</span>
                        <span className="font-semibold text-foreground">18/20</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fluffiness Over Time</span>
                        <span className="font-semibold text-foreground">19/20</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-border mt-2">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="font-bold text-[#00b67a]">95/100</span>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h1 
                  className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight"
                  style={isEventPage ? { color: eventColors?.primary } : {}}
                >
                  {config.hero.headline}
                </h1>
                {/* Product Tags - Inline under title (desktop only) */}
                <div className="mt-2 hidden md:flex flex-wrap items-center gap-2">
                  {['100% Cotton', 'Skin Friendly', 'Award Winning', '300 Thread Count'].map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: isEventPage && eventColors ? eventColors.secondaryLight : 'rgba(0,0,0,0.04)',
                        color: isEventPage && eventColors ? (isDarkScheme ? eventColors.secondary : eventColors.primary) : 'inherit'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Made for Use Case Badge - Only for specific use-case pages, not quiz */}
                {useCaseName && !quizLabels.length && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-[#1d9bf0]/10 rounded-full">
                    <span className="w-3 h-3 rounded-full bg-[#1d9bf0] flex items-center justify-center flex-shrink-0">
                      <Check className="w-2 h-2 text-white stroke-[3]" />
                    </span>
                    <span className="text-xs font-semibold text-[#1d9bf0]">
                      Made for {useCaseName}
                    </span>
                  </div>
                )}
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {config.hero.subheadline}
                </p>
                {/* Angle-based emphasis for event pages */}
                {isEventPage && currentAngleModifier.heroEmphasis && (
                  <p className="mt-2 text-sm font-medium" style={{ color: eventColors?.primary }}>
                    {currentAngleModifier.heroEmphasis}
                  </p>
                )}
                {/* Hotel Quality additional reinforcement */}
                {config.id === 'hotel-quality' && (
                  <p className="mt-2 text-sm font-medium text-green-700">
                    Same suppliers as Four Seasons & Ritz-Carlton, 50%+ less.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {config.hero.usps
                  .map(usp => {
                    // Replace "Made in USA" / "Made in the USA" with alternative for non-US visitors
                    if (!isUS && (usp.title.toLowerCase().includes('made in usa') || usp.title.toLowerCase().includes('made in the usa'))) {
                      return { ...usp, title: nonUsAlternativeUsp.title, description: nonUsAlternativeUsp.description };
                    }
                    return usp;
                  })
                  .map((usp, idx) => {
                  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                    'support': Moon,
                    'temperature': Thermometer,
                    'hypoallergenic': Shield,
                    'location': MapPin,
                    'shield': Shield,
                    'clock': Clock,
                  };
                  const IconComponent = iconMap[usp.icon] || Moon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isEventPage ? '' : 'bg-secondary'}`}
                        style={isEventPage ? { backgroundColor: `${eventColors?.primary}1a` } : {}}
                      >
                        <span style={isEventPage ? { color: eventColors?.primary } : {}}>
                          <IconComponent className="w-4 h-4" />
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{usp.title}</div>
                        <div className="text-xs text-muted-foreground">{usp.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Contextual Carousel - Only shown when user has quiz tags */}
              {(() => {
                // Build contextual cards based on quiz tags
                const contextualCards: { id: string; title: string; description: string; image: string; icon: React.ReactNode }[] = [];
                
                // Sleep position card - only show user's specific position
                if (quizTags.includes('side-sleeper')) {
                  contextualCards.push({
                    id: 'side-sleeper',
                    title: 'Made for Side Sleepers',
                    description: 'Higher loft fills the shoulder gap, keeping your spine perfectly aligned all night.',
                    image: '/images/optimized/cards/sleep-position-side.png',
                    icon: <Bed className="w-4 h-4" />
                  });
                } else if (quizTags.includes('back-sleeper')) {
                  contextualCards.push({
                    id: 'back-sleeper',
                    title: 'Perfect for Back Sleepers',
                    description: 'Cradles your neck curve with just the right support for natural spinal alignment.',
                    image: '/images/optimized/cards/sleep-position-back.png',
                    icon: <Bed className="w-4 h-4" />
                  });
                } else if (quizTags.includes('stomach-sleeper')) {
                  contextualCards.push({
                    id: 'stomach-sleeper',
                    title: 'Designed for Stomach Sleepers',
                    description: 'Low profile support prevents neck strain while keeping you comfortable face-down.',
                    image: '/images/optimized/cards/sleep-position-stomach.png',
                    icon: <Bed className="w-4 h-4" />
                  });
                } else if (quizTags.includes('mixed-sleeper')) {
                  contextualCards.push({
                    id: 'mixed-sleeper',
                    title: 'Adapts to Any Position',
                    description: 'Responsive fill adjusts as you move, providing perfect support in every position.',
                    image: '/images/optimized/cards/sleep-alignment.png',
                    icon: <RefreshCw className="w-4 h-4" />
                  });
                }
                
                // Note: Pillow replacement messaging is now shown in a separate section above the CTA button
                
                // Neck pain card
                if (quizTags.includes('neck-pain') || quizTags.includes('alignment-issues')) {
                  contextualCards.push({
                    id: 'neck-support',
                    title: 'Neck Pain Relief',
                    description: 'Proper cervical alignment eliminates morning stiffness. Wake up without that familiar ache.',
                    image: '/images/optimized/cards/card-neck-relief.png',
                    icon: <Shield className="w-4 h-4" />
                  });
                }
                
                // Shoulder pain card
                if (quizTags.includes('shoulder-pain') || quizTags.includes('circulation-issues')) {
                  contextualCards.push({
                    id: 'shoulder-relief',
                    title: 'Shoulder Pressure Relief',
                    description: 'Contoured support reduces pressure points, preventing that 3am wake-up to switch sides.',
                    image: '/images/optimized/cards/card-shoulder-relief.png',
                    icon: <Heart className="w-4 h-4" />
                  });
                }
                
                // Temperature card
                if (quizTags.includes('hot-sleeper') || quizTags.includes('temperature') || quizTags.includes('warm-sleeper')) {
                  contextualCards.push({
                    id: 'cooling',
                    title: 'Cooling Technology',
                    description: 'Breathable materials and airflow design keep you cool all night. No more flipping to the cool side.',
                    image: '/images/optimized/cards/card-cooling-closeup.png',
                    icon: <Thermometer className="w-4 h-4" />
                  });
                }
                
                // Allergy card
                if (quizTags.includes('allergies') || quizTags.includes('dust-mites') || quizTags.includes('congested')) {
                  contextualCards.push({
                    id: 'hypoallergenic',
                    title: 'Hypoallergenic Protection',
                    description: 'Dust mite resistant materials reduce allergens by up to 80%. Breathe easier, sleep better.',
                    image: '/images/optimized/cards/card-hypoallergenic.png',
                    icon: <Shield className="w-4 h-4" />
                  });
                }
                
                // Support issues card
                if (quizTags.includes('poor-support') || quizTags.includes('compression') || quizTags.includes('severe-support-issues')) {
                  contextualCards.push({
                    id: 'lasting-support',
                    title: 'Lasting Support',
                    description: 'Premium fill maintains shape night after night. No more constant fluffing or adjusting.',
                    image: '/images/optimized/cards/card-lasting-support.png',
                    icon: <Layers className="w-4 h-4" />
                  });
                }
                
                // Hotel quality card
                if (quizTags.includes('hotel-quality') || quizTags.includes('pillow-issue')) {
                  contextualCards.push({
                    id: 'hotel-quality',
                    title: 'Hotel-Grade Quality',
                    description: 'Same suppliers as Four Seasons and Ritz-Carlton. Luxury hotel sleep at a fraction of the price.',
                    image: '/images/optimized/cards/card-hotel-quality.png',
                    icon: <Star className="w-4 h-4" />
                  });
                }
                
                // Only render if we have cards
                if (contextualCards.length === 0) return null;
                
                // Only enable auto-switch if more than 3 cards
                const shouldAnimate = contextualCards.length > 3;
                
                // Update cards count for auto-switch (only if animating)
                const totalSlides = contextualCards.length;
                if (shouldAnimate && totalSlides !== contextualCardsCount) {
                  setTimeout(() => setContextualCardsCount(totalSlides), 0);
                }
                
                // Calculate visible cards based on screen size
                // Desktop: 3 cards, Mobile: 2 cards
                // If 3 or fewer cards, show all without animation
                const visibleStartIndex = shouldAnimate ? (contextualCarouselIndex % contextualCards.length) : 0;
                
                // Get cards to display
                const visibleCards = shouldAnimate 
                  ? [
                      contextualCards[visibleStartIndex],
                      contextualCards[(visibleStartIndex + 1) % contextualCards.length],
                      contextualCards[(visibleStartIndex + 2) % contextualCards.length]
                    ].filter(Boolean)
                  : contextualCards.slice(0, 3);
                
                // Swipe/drag handlers for carousel
                const handleDragStart = (clientX: number) => {
                  if (!shouldAnimate) return;
                  setIsDragging(true);
                  setDragStartX(clientX);
                  setDragCurrentX(clientX);
                };
                
                const handleDragMove = (clientX: number) => {
                  if (!isDragging) return;
                  setDragCurrentX(clientX);
                };
                
                const handleDragEnd = () => {
                  if (!isDragging) return;
                  
                  // Skip if in cooldown period
                  if (swipeCooldownRef.current) {
                    setIsDragging(false);
                    setDragStartX(0);
                    setDragCurrentX(0);
                    return;
                  }
                  
                  const diff = dragStartX - dragCurrentX;
                  const threshold = 50; // Minimum drag distance to trigger slide change
                  
                  if (Math.abs(diff) > threshold) {
                    // Set cooldown to prevent rapid triggers
                    swipeCooldownRef.current = true;
                    
                    if (diff > 0) {
                      // Swiped left - go to next
                      setSlideDirection('left');
                      setContextualCarouselIndex((prev) => (prev + 1) % contextualCards.length);
                    } else {
                      // Swiped right - go to previous
                      setSlideDirection('right');
                      setContextualCarouselIndex((prev) => (prev - 1 + contextualCards.length) % contextualCards.length);
                    }
                    
                    // Reset direction after animation and clear cooldown
                    setTimeout(() => {
                      setSlideDirection(null);
                      swipeCooldownRef.current = false;
                    }, 500);
                  }
                  
                  setIsDragging(false);
                  setDragStartX(0);
                  setDragCurrentX(0);
                };
                
                // Wheel handler for Apple Magic Mouse / trackpad horizontal swipe
                const handleWheel = (e: React.WheelEvent) => {
                  if (!shouldAnimate) return;
                  
                  // Skip if in cooldown period (prevents rapid multiple triggers)
                  if (swipeCooldownRef.current) return;
                  
                  // Check if this is a horizontal scroll (Magic Mouse/trackpad)
                  const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
                  if (!isHorizontalScroll) return;
                  
                  // Prevent page scroll when swiping carousel
                  e.preventDefault();
                  
                  const now = Date.now();
                  const timeSinceLastWheel = now - lastWheelTimeRef.current;
                  
                  // Reset accumulator if too much time has passed (gesture ended)
                  if (timeSinceLastWheel > 200) {
                    wheelAccumulatorRef.current = 0;
                  }
                  
                  lastWheelTimeRef.current = now;
                  wheelAccumulatorRef.current += e.deltaX;
                  
                  const threshold = 100; // Accumulated scroll needed to trigger slide change
                  
                  if (Math.abs(wheelAccumulatorRef.current) > threshold) {
                    // Set cooldown to prevent rapid triggers
                    swipeCooldownRef.current = true;
                    
                    if (wheelAccumulatorRef.current > 0) {
                      // Scrolled right - go to next
                      setSlideDirection('left');
                      setContextualCarouselIndex((prev) => (prev + 1) % contextualCards.length);
                    } else {
                      // Scrolled left - go to previous
                      setSlideDirection('right');
                      setContextualCarouselIndex((prev) => (prev - 1 + contextualCards.length) % contextualCards.length);
                    }
                    
                    // Reset direction after animation and clear cooldown
                    setTimeout(() => {
                      setSlideDirection(null);
                      swipeCooldownRef.current = false;
                    }, 500);
                    wheelAccumulatorRef.current = 0;
                  }
                };
                
                return (
                  <div className="mt-5">
                    {/* Carousel Container - Refined design matching page aesthetic */}
                    <div 
                      className="relative overflow-hidden rounded-xl bg-secondary/30 border border-border select-none"
                      style={{ cursor: shouldAnimate ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                      onMouseDown={(e) => handleDragStart(e.clientX)}
                      onMouseMove={(e) => handleDragMove(e.clientX)}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                      onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                      onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                      onTouchEnd={handleDragEnd}
                      onWheel={handleWheel}
                    >
                      {/* Title Header - Clean, minimal */}
                      <div className="px-4 pt-4 pb-3 border-b border-border/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#1d9bf0] rounded-full"></div>
                            <h4 className="text-sm font-semibold text-foreground">Why FluffCo is Right for You</h4>
                          </div>
                          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">Based on your profile</span>
                        </div>
                      </div>
                      
                      {/* Cards Grid - Responsive based on card count */}
                      <div className="p-4">
                        <div className={`grid gap-3 ${
                          visibleCards.length === 1 
                            ? 'grid-cols-1' 
                            : visibleCards.length === 2 
                              ? 'grid-cols-2' 
                              : 'grid-cols-2 md:grid-cols-3'
                        }`}>
                          {visibleCards.map((card, idx) => (
                            <div 
                              key={`${card.id}-${shouldAnimate ? contextualCarouselIndex : 'static'}-${idx}`} 
                              className={`group flex flex-col rounded-lg border border-border bg-background overflow-hidden hover:border-[#1d9bf0]/30 transition-all duration-200 ${
                                visibleCards.length >= 3 && idx === 2 ? 'hidden md:flex' : ''
                              }`}
                              style={shouldAnimate ? { 
                                animation: `${slideDirection === 'right' ? 'slideInFromLeft' : 'slideInFromRight'} 0.4s ease-out forwards`,
                                animationDelay: `${idx * 0.05}s`,
                                opacity: 0
                              } : {}}
                            >
                              {/* Image - Compact with subtle overlay */}
                              <div className="relative w-full h-24 md:h-28 overflow-hidden bg-secondary">
                                <img 
                                  src={card.image} 
                                  alt={card.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                {/* Subtle gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                              </div>
                              {/* Content */}
                              <div className="p-3">
                                <h4 className="text-xs font-semibold text-foreground leading-tight mb-1">{card.title}</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-4">{card.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Dots Navigation - Refined style */}
                      {shouldAnimate && (
                        <div 
                          className="flex justify-center gap-1.5 pb-4"
                          onMouseDown={(e) => e.stopPropagation()}
                          onTouchStart={(e) => e.stopPropagation()}
                        >
                          {contextualCards.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setContextualCarouselIndex(idx);
                              }}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === contextualCarouselIndex 
                                  ? 'bg-[#1d9bf0] w-4' 
                                  : 'bg-border hover:bg-muted-foreground/50 w-1.5'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* OEKO-TEX Standard 100 Badge - Full width drawer style */}
              <div className="mt-3 mb-4">
                <button 
                  ref={oekoTexRef}
                  onClick={() => setOekoTexExpanded(!oekoTexExpanded)}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 text-left"
                  style={{
                    boxShadow: oekoTexExpanded ? '0 4px 12px -2px rgba(0, 0, 0, 0.08)' : 'none',
                  }}
                >
                  {/* Badge header - thinner padding */}
                  <div className="flex items-center justify-between px-3 py-2 cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      {/* OEKO-TEX Logo/Icon */}
                      <div className="flex flex-col items-center bg-white rounded px-1.5 py-0.5 border border-gray-200">
                        <span className="text-[6px] text-gray-500 font-medium tracking-wide leading-tight">STANDARD 100</span>
                        <span className="text-[9px] text-[#1a5c3a] font-bold tracking-wider leading-tight">OEKO-TEX®</span>
                      </div>
                      <span className="text-sm text-gray-700">Certified Safe Materials</span>
                    </div>
                    {/* Arrow indicator */}
                    <svg 
                      className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-300"
                      style={{ 
                        transform: oekoTexExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                  {/* Expanded content - conditionally rendered for iOS Safari compatibility */}
                  {oekoTexExpanded && (
                    <div className="border-t border-gray-200 animate-[fadeSlideIn_0.3s_ease-out]">
                      <div className="px-3 py-3">
                      {/* Trust headline */}
                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        <span className="font-semibold text-[#1a5c3a]">World's leading textile safety label since 1992.</span> Every FluffCo pillow is independently tested by accredited labs against 1,000+ regulated and non-regulated substances.
                      </p>
                      {/* Key certifications */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[#1a5c3a] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                          <span className="text-sm text-gray-700"><strong>Class II Certified:</strong> Direct skin contact safe (8+ hours nightly)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[#1a5c3a] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                          <span className="text-sm text-gray-700"><strong>No formaldehyde, pesticides, or heavy metals</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[#1a5c3a] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                          <span className="text-sm text-gray-700"><strong>EU REACH & CPSIA compliant:</strong> Meets strictest global standards</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-[#1a5c3a] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5L20 7"/></svg>
                          <span className="text-sm text-gray-700"><strong>Safe for sensitive skin & allergies</strong></span>
                        </div>
                      </div>
                      {/* Footer note */}
                      <p className="text-xs text-gray-500 border-t border-gray-100 pt-2">
                        Standards reviewed annually. 35,000+ certified companies worldwide.
                      </p>
                      </div>
                    </div>
                  )}
                </button>
              </div>

              {/* Size Selector with images - IMAGES FILL SPACE */}
              {/* min-h prevents CLS by reserving space before images load */}
              <div data-product-selector className="min-h-[180px]">
                <div className="flex items-center justify-between mb-2" style={{marginBottom: '0px'}}>
                  <span className="text-sm font-medium">Select Size</span>
                  <button 
                    onClick={() => setShowSizeGuide(true)}
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {sizes.map((size) => (
                    <div key={size.name} className="relative pt-3">
                      {size.badge && (
                        <span 
                          className="absolute top-0.5 left-1/2 -translate-x-1/2 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap z-20"
                          style={isEventPage && eventColors ? {
                            backgroundColor: eventColors.primary,
                            color: 'white'
                          } : {
                            backgroundColor: 'var(--foreground)',
                            color: 'var(--background)'
                          }}
                        >
                          {size.badge}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedSize(size.name);
                          triggerHapticFeedback();
                        }}
                        className={`w-full rounded-xl border-2 transition-all duration-300 overflow-hidden hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${
                          selectedSize === size.name
                            ? 'shadow-md'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                        style={selectedSize === size.name && isEventPage && eventColors ? {
                          borderColor: isDarkScheme ? eventColors.secondary : eventColors.primary,
                          backgroundColor: isDarkScheme ? eventColors.secondaryLight : `${eventColors.primary}08`
                        } : selectedSize === size.name ? {
                          borderColor: '#e63946',
                          backgroundColor: 'rgba(230, 57, 70, 0.05)'
                        } : {}}
                      >
                        <div className="aspect-[16/5] overflow-hidden bg-[#f5f5e8]">
                          <img 
                            src={size.image} 
                            alt={size.name} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                            width="200"
                            height="62"
                          />
                        </div>
                        <div className="p-3">
                          <div className="font-medium text-sm">{size.name}</div>
                          <div className="text-xs text-muted-foreground">{size.dimensions}</div>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity/Pricing Options - REDESIGNED PILLOWCASE BONUS */}
              <div data-product-selector>
                <div className="text-sm font-medium mb-2" style={{marginBottom: '12px'}}>Select Quantity</div>
              <div className="space-y-3">
                {currentPricing.map((option) => (
                  <div 
                    key={option.quantity} 
                    className={`group transition-all duration-200 ${option.bonus ? 'hover:scale-[1.01] hover:shadow-md rounded-xl' : ''} ${option.badge ? 'mt-1' : ''}`}
                    onMouseEnter={() => setHoveredQuantity(option.quantity)}
                    onMouseLeave={() => setHoveredQuantity(null)}
                  >
                    <button
                      onClick={() => setSelectedQuantity(option.quantity)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 relative ${
                        !option.bonus ? 'hover:scale-[1.01] hover:shadow-md' : ''
                      } ${
                        option.bonus ? 'rounded-b-none border-b' : ''
                      } ${
                        selectedQuantity === option.quantity
                          ? 'shadow-sm'
                          : isEventPage && eventColors ? '' : 'border-border group-hover:border-muted-foreground'
                      }`}
                    style={selectedQuantity === option.quantity && isEventPage && eventColors ? {
                      borderColor: borderColorSelected,
                      backgroundColor: accentBg
                    } : selectedQuantity === option.quantity ? {
                      borderColor: '#e63946',
                      backgroundColor: 'rgba(230, 57, 70, 0.05)'
                    } : isEventPage && eventColors && hoveredQuantity === option.quantity ? {
                      borderColor: borderColorSelected,
                      backgroundColor: isDarkScheme ? accentBg : `${eventColors.primary}05`
                    } : isEventPage && eventColors ? {
                      borderColor: borderColorUnselected
                    } : {}}
                    >
                      {/* Badges container - flex layout for consistent spacing */}
                      <div className="absolute -top-2.5 right-3 flex items-center gap-1.5">
                        {option.badge && (
                          <span 
                            className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                            style={isEventPage && eventColors ? {
                              backgroundColor: eventColors.primary,
                              color: 'white'
                            } : {
                              backgroundColor: option.badge === 'Best Value' ? '#e63946' : 'var(--foreground)',
                              color: option.badge === 'Best Value' ? 'white' : 'var(--background)'
                            }}
                          >
                            {option.badge}
                          </span>
                        )}
                        {/* Discount badge - always shown */}
                        <span 
                          className="text-xs font-medium px-2.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: '#22c55e',
                            color: 'white'
                          }}
                        >
                          -{option.discount}%
                        </span>
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{option.quantity} Pillow{option.quantity > 1 ? 's' : ''}</div>
                          <div className={`text-xs text-muted-foreground transition-opacity duration-200 ${
                            selectedQuantity === option.quantity ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            ${(option.price / option.quantity).toFixed(2)}/pillow
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">${option.price.toFixed(2)}</span>
                            <span className="text-sm text-muted-foreground line-through">${option.originalPrice.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-green-600 font-medium">Save ${option.savings.toFixed(2)}</div>
                        </div>
                      </div>
                    </button>
                    
                    {/* Adjacent Pillowcase Bonus Box - Part of the selector, clickable */}
                    {option.bonus && (
                      <button
                        onClick={() => setSelectedQuantity(option.quantity)}
                        className={`w-full px-4 py-2 rounded-b-xl border-2 border-t-0 transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          selectedQuantity === option.quantity
                            ? ''
                            : isEventPage && eventColors ? '' : 'border-border bg-secondary/20 group-hover:border-muted-foreground'
                        }`}
                        style={selectedQuantity === option.quantity && isEventPage && eventColors ? {
                          borderColor: borderColorSelected,
                          backgroundColor: accentBg
                        } : selectedQuantity === option.quantity ? {
                          borderColor: '#e63946',
                          backgroundColor: 'rgba(230, 57, 70, 0.05)'
                        } : isEventPage && eventColors && hoveredQuantity === option.quantity ? {
                          borderColor: borderColorSelected,
                          backgroundColor: accentBg
                        } : isEventPage && eventColors ? {
                          borderColor: borderColorUnselected,
                          backgroundColor: accentBg
                        } : {}}
                      >
                        <div className="flex items-center gap-1.5">
                          <Gift 
                            className="w-3.5 h-3.5" 
                            style={selectedQuantity === option.quantity && isEventPage && eventColors ? {
                              color: eventColors.primary
                            } : selectedQuantity === option.quantity ? {
                              color: '#e63946'
                            } : {
                              color: 'var(--muted-foreground)'
                            }}
                          />
                          <span 
                            className="text-xs"
                            style={selectedQuantity === option.quantity && isEventPage && eventColors ? {
                              color: eventColors.primary,
                              fontWeight: 500
                            } : selectedQuantity === option.quantity ? {
                              color: '#e63946',
                              fontWeight: 500
                            } : {
                              color: 'var(--muted-foreground)'
                            }}
                          >+ 2 Free Pillowcases</span>
                          {/* Timer on desktop only */}
                          {!timerExpired && (
                            <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-muted-foreground ml-1">
                              <Clock className="w-2.5 h-2.5" />
                              <span className="tabular-nums">{formatTimeLeft(timeLeft)}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground line-through">$116</span>
                          <span className="text-xs font-medium text-green-600">FREE</span>
                        </div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              </div>

              {/* Why Your Pillow Needs Replacing + CTA - Unified element for quiz users with old pillow */}
              {(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const quizTagsForReplace = urlParams.get('tags')?.split(',').filter(Boolean) || [];
                const needsReplacement = quizTagsForReplace.includes('old-pillow') || quizTagsForReplace.includes('very-old-pillow') || quizTagsForReplace.includes('danger');
                
                if (!needsReplacement) return null;
                
                return (
                  <div className="rounded-xl overflow-hidden bg-secondary/30 border border-border">
                    {/* Why Your Pillow Needs Replacing - Top part */}
                    <div className="px-4 pt-4 pb-3 border-b border-border/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-4 bg-[#1d9bf0] rounded-full"></div>
                          <h4 className="text-sm font-semibold text-foreground">Why Your Pillow Needs Replacing</h4>
                        </div>
                        {/* Alarm-style pillow age badge - light background with black text */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          quizTagsForReplace.includes('very-old-pillow') 
                            ? 'bg-[#e63946]/10 text-foreground border border-[#e63946]/20' 
                            : 'bg-[#f5c542]/10 text-foreground border border-[#f5c542]/20'
                        }`}>
                          <span className={`w-2 h-2 rounded-full animate-pulse ${
                            quizTagsForReplace.includes('very-old-pillow') ? 'bg-[#e63946]' : 'bg-[#f5c542]'
                          }`}></span>
                          {quizTagsForReplace.includes('very-old-pillow') ? '5+ years old' : '2-5 years old'}
                        </div>
                      </div>
                    </div>
                    {/* Content section - matching carousel padding */}
                    <div className="p-4">
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#1d9bf0] flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground/80"><span className="font-semibold">60% support loss</span> – Old pillows lose structural integrity</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#1d9bf0] flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground/80"><span className="font-semibold">2 million dust mites</span> – Accumulate in pillows over 2 years</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#1d9bf0] flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground/80"><span className="font-semibold">Neck strain increases</span> – Poor support leads to morning pain</p>
                        </div>
                      </div>
                    </div>
                    {/* CTA Button - Bottom part, visually attached */}
                    <div className="px-4 pb-4">
                      <button 
                        id="main-cta-button" 
                        onClick={() => {
                          const size = selectedSize === 'Standard' ? 'standard' : 'king';
                          const qty = selectedQuantity as 1 | 2 | 4;
                          const productData = getProductDataForTracking(size, qty);
                          trackAddToCart(productData);
                          
                          // GA4: Track add_to_cart
                          const pricing = currentPricing.find(p => p.quantity === selectedQuantity);
                          if (pricing) {
                            const ga4Item = createMainProductItem(selectedSize, qty, pricing.price, pricing.originalPrice);
                            trackGA4AddToCart([ga4Item], pricing.price);
                          }
                          
                          setShowOrderPopup(true);
                        }}
                        className="w-full text-white font-semibold py-4 rounded-full text-lg transition-all duration-300 animate-cta-shimmer hover:-translate-y-px active:translate-y-0"
                        style={{ 
                          backgroundColor: isEventPage && eventColors ? eventColors.primary : '#e63946',
                          boxShadow: `0 2px 8px ${isEventPage && eventColors ? eventColors.primary : '#e63946'}40`,
                          ['--event-primary' as string]: isEventPage && eventColors ? eventColors.primary : '#e63946'
                        }}
                        onMouseEnter={(e) => {
                          const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                          e.currentTarget.style.boxShadow = `0 4px 20px ${color}70`;
                          e.currentTarget.style.filter = 'brightness(0.95)';
                        }}
                        onMouseLeave={(e) => {
                          const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                          e.currentTarget.style.boxShadow = `0 2px 8px ${color}40`;
                          e.currentTarget.style.filter = 'brightness(1)';
                        }}
                      >
                        {getPageCTAWithDiscount(currentPricing.find(p => p.quantity === selectedQuantity)?.discount || 0)}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Regular CTA button - Only show when pillow replacement section is not shown */}
              {(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const quizTagsForReplace = urlParams.get('tags')?.split(',').filter(Boolean) || [];
                const needsReplacement = quizTagsForReplace.includes('old-pillow') || quizTagsForReplace.includes('very-old-pillow') || quizTagsForReplace.includes('danger');
                
                if (needsReplacement) return null;
                
                return (
                  <button 
                    id="main-cta-button" 
                    onClick={() => {
                      const size = selectedSize === 'Standard' ? 'standard' : 'king';
                      const qty = selectedQuantity as 1 | 2 | 4;
                      const productData = getProductDataForTracking(size, qty);
                      trackAddToCart(productData);
                      
                      // GA4: Track add_to_cart
                      const pricing = currentPricing.find(p => p.quantity === selectedQuantity);
                      if (pricing) {
                        const ga4Item = createMainProductItem(selectedSize, qty, pricing.price, pricing.originalPrice);
                        trackGA4AddToCart([ga4Item], pricing.price);
                      }
                      
                      setShowOrderPopup(true);
                    }}
                    className="w-full text-white font-semibold py-4 rounded-full text-lg transition-all duration-300 animate-cta-shimmer hover:-translate-y-px active:translate-y-0"
                style={{ 
                  backgroundColor: isEventPage && eventColors ? eventColors.primary : '#e63946',
                  boxShadow: `0 2px 8px ${isEventPage && eventColors ? eventColors.primary : '#e63946'}40`,
                  ['--event-primary' as string]: isEventPage && eventColors ? eventColors.primary : '#e63946'
                }}
                onMouseEnter={(e) => {
                  const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${color}70`;
                  e.currentTarget.style.filter = 'brightness(0.95)';
                }}
                onMouseLeave={(e) => {
                  const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                  e.currentTarget.style.boxShadow = `0 2px 8px ${color}40`;
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                {getPageCTAWithDiscount(currentPricing.find(p => p.quantity === selectedQuantity)?.discount || 0)}
              </button>
              );
            })()}

              {/* Compact urgency module - visually attached to CTA */}
              <div className="-mt-1">
                {/* Dynamic location-based shipping message - aligned left, above stock bar */}
                <div className="mb-2">
                  <ShippingMessage variant="inline" />
                </div>
                <StockInventoryBar stockLevel={stockLevel} countdown={countdown} timerExpired={timerExpired} />
              </div>

              {/* Checkmark badges - scrollable on mobile with gradient fade */}
              <div className="relative -mx-4 md:mx-0">
                {/* Left gradient fade for scroll indication */}
                <div 
                  className={`absolute left-0 top-0 bottom-1 w-8 z-10 pointer-events-none transition-opacity duration-200 ${showLeftGradient ? 'opacity-100' : 'opacity-0'}`}
                  style={{ 
                    background: isEventPage && eventColors 
                      ? `linear-gradient(to right, ${eventColors.background || 'hsl(var(--background))'}, transparent)`
                      : 'linear-gradient(to right, hsl(var(--background)), transparent)'
                  }}
                />
                <div 
                  ref={trustBadgesRef}
                  className="flex items-center justify-start gap-2 text-xs text-muted-foreground overflow-x-auto scrollbar-hide pb-1 px-4 md:px-0"
                >
                  <span 
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${isEventPage && eventColors ? 'bg-white/80 dark:bg-white/10' : 'bg-secondary/30'}`}
                    style={{ 
                      borderColor: isEventPage && eventColors ? `${eventColors.primary}25` : undefined
                    }}
                  >
                    <Check className="w-3 h-3" style={{ color: isEventPage && eventColors ? eventColors.primary : '#16a34a' }} /> {siteSettings.guarantee_text}
                  </span>
                  <span 
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${isEventPage && eventColors ? 'bg-white/80 dark:bg-white/10' : 'bg-secondary/30'}`}
                    style={{ 
                      borderColor: isEventPage && eventColors ? `${eventColors.primary}25` : undefined
                    }}
                  >
                    <Check className="w-3 h-3" style={{ color: isEventPage && eventColors ? eventColors.primary : '#16a34a' }} /> {siteSettings.shipping_text}
                  </span>
                  <span 
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border whitespace-nowrap flex-shrink-0 ${isEventPage && eventColors ? 'bg-white/80 dark:bg-white/10' : 'bg-secondary/30'}`}
                    style={{ 
                      borderColor: isEventPage && eventColors ? `${eventColors.primary}25` : undefined
                    }}
                  >
                    <Check className="w-3 h-3" style={{ color: isEventPage && eventColors ? eventColors.primary : '#16a34a' }} /> {siteSettings.origin_text}
                  </span>
                </div>
                {/* Right gradient fade for scroll indication */}
                <div 
                  className={`absolute right-0 top-0 bottom-1 w-8 pointer-events-none transition-opacity duration-200 ${showRightGradient ? 'opacity-100' : 'opacity-0'}`}
                  style={{ 
                    background: isEventPage && eventColors 
                      ? `linear-gradient(to left, ${eventColors.background || 'hsl(var(--background))'}, transparent)`
                      : 'linear-gradient(to left, hsl(var(--background)), transparent)'
                  }}
                />
              </div>

              <div className="border-t border-border pt-4 space-y-0" style={{paddingTop: '0px'}}>
                {/* What's Included - First accordion item */}
                <div className="border-b border-border">
                  <button
                    onClick={() => setExpandedAccordion(expandedAccordion === 'whats-included' ? null : 'whats-included')}
                    className="w-full flex items-center justify-between py-3 text-sm font-medium"
                  >
                    What's Included
                    {expandedAccordion === 'whats-included' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {expandedAccordion === 'whats-included' && (
                    <div className="pb-3 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div>
                          <span className="text-sm">{selectedQuantity} FluffCo {selectedSize} Pillow{selectedQuantity > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      {selectedQuantity === 4 && (
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Gift className="w-3.5 h-3.5 text-green-600" />
                          </div>
                          <div>
                            <span className="text-sm">2 Matching Pillowcases</span>
                            <span className="text-xs text-green-600 ml-1">(FREE)</span>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-muted-foreground">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-sm">Care Instructions Card</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm">100-Night Satisfaction Guarantee</span>
                      </div>
                    </div>
                  )}
                </div>
                {[
                  { id: 'care', title: 'Care Instructions', content: null },
                  { id: 'materials', title: 'Materials & Sizes', content: null },
                  { id: 'returns', title: '100-Night Returns', content: null },
                ].map((item) => (
                  <div key={item.id} className="border-b border-border">
                    <button
                      onClick={() => setExpandedAccordion(expandedAccordion === item.id ? null : item.id)}
                      className="w-full flex items-center justify-between py-3 text-sm font-medium"
                    >
                      {item.title}
                      {expandedAccordion === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedAccordion === item.id && (
                      <div className="pb-3 text-sm text-muted-foreground">
                        {item.id === 'care' && (
                          <p>FluffCo Down Alternative pillows are 100% machine washable for easy maintenance. Machine wash cold with a gentle detergent. Tumble dry on low with a few dryer balls. Fluff up before using.</p>
                        )}
                        {item.id === 'materials' && (
                          <div className="space-y-3">
                            <p className="mb-2">Premium Quality Pillows made with unique Fluff™ down alternative microfiber filling.</p>
                            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600 flex-shrink-0" /> Vegan & Cruelty-Free</li>
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600 flex-shrink-0" /> Hypoallergenic</li>
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600 flex-shrink-0" /> Machine Washable</li>
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600 flex-shrink-0" /> 100% Cotton Shell</li>
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600 flex-shrink-0" /> 300 Thread Count</li>
                              <li className="flex items-center gap-1.5"><Check className="w-3 h-3 text-green-600 flex-shrink-0" /> OEKO-TEX® Certified</li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-2 mt-3">
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary text-sm font-medium"><span className="font-semibold mr-1.5">Standard</span> 20" × 28"</span>
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary text-sm font-medium"><span className="font-semibold mr-1.5">King</span> 20" × 36"</span>
                            </div>
                          </div>
                        )}
                        {item.id === 'returns' && (
                          <p>Not satisfied? Return within 100 nights for a full refund. No questions asked.</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Quiz Link - Hide when user already came from quiz */}
              {quizTags.length === 0 && (
                <div className="mt-4">
                  {/* Desktop: Single line */}
                  <button
                    onClick={() => setIsQuizModalOpen(true)}
                    className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    Not sure if you need a new pillow? Find out in 60 seconds →
                  </button>
                  {/* Mobile: Two lines with emphasis */}
                  <div className="sm:hidden flex flex-col items-center gap-1">
                    <span className="text-sm text-muted-foreground">Not sure if you need a new pillow?</span>
                    <button
                      onClick={() => setIsQuizModalOpen(true)}
                      className="text-sm font-medium text-foreground underline underline-offset-4 transition-colors"
                    >
                      Find out in 60 seconds →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PRESS BAR */}
      <section 
        className="py-8 border-y"
        style={isEventPage && eventColors ? {
          borderColor: `${eventColors.primary}33`,
          backgroundColor: eventColors.accentDark
        } : {
          borderColor: 'var(--border)',
          backgroundColor: 'rgb(243, 241, 236)'
        }}
      >
        <div className="container px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
              ))}
            </div>
            <span className="text-sm font-medium"><CustomerCount responsive /> Happy Sleepers</span>
            <span className="text-muted-foreground text-sm">• As Seen In</span>
          </div>
          <PressLogos backgroundColor={isEventPage ? (eventColors?.accentDark || '#ffe8e8') : 'rgb(243, 241, 236)'} />
        </div>
      </section>

      {/* EVENT GIFT SECTION - Dynamic content based on event type */}
      {isEventPage && eventContent[config.id] && (() => {
        const content = eventContent[config.id];
        const colors = eventColors || eventColorSchemes['valentine-gift'];
        const FeatureIcon = ({ icon }: { icon: 'gift' | 'check' | 'heart' }) => {
          switch (icon) {
            case 'gift': return <Gift className="w-4 h-4" />;
            case 'check': return <Check className="w-4 h-4" />;
            case 'heart': return <Heart className="w-4 h-4" />;
          }
        };
        const CardIcon = ({ icon }: { icon: 'moon' | 'gift' | 'sparkles' }) => {
          switch (icon) {
            case 'moon': return <Moon className="w-8 h-8" style={{ color: colors.primary }} />;
            case 'gift': return <Gift className="w-8 h-8" style={{ color: colors.primary }} />;
            case 'sparkles': return <Sparkles className="w-8 h-8" style={{ color: colors.primary }} />;
          }
        };
        
        return (
          <section className="py-12 bg-white">
            <div className="container px-4">
              {/* Event Banner */}
              <div 
                className="relative overflow-hidden rounded-2xl p-8 md:p-12 text-white"
                style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})` }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
                  {/* Left: Gift Image */}
                  <div className="w-full lg:w-1/3 flex-shrink-0">
                    <div className="relative">
                      <img 
                        src={content.image} 
                        alt="Gift-Ready Packaging" 
                        className="w-full rounded-xl shadow-2xl"
                      />
                      <div 
                        className="absolute -bottom-3 -right-3 bg-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                        style={{ color: colors.primary }}
                      >
                        Gift-Ready
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                      <Heart className="w-4 h-4 fill-current" />
                      <span>A Thoughtful {eventNames[config.id] || 'Holiday'} Gift</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      <span className="block md:inline">{content.headline}</span>
                      <br className="hidden md:block" />
                      <span className="md:hidden"> </span>
                      <span className="block md:inline">{content.subheadline}</span>
                    </h2>
                    
                    <p className="text-white/90 text-lg mb-6 max-w-xl">
                      {content.description}
                    </p>
                    
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                      {content.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                          <FeatureIcon icon={feature.icon} />
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Why It's the Perfect Gift - Swipeable on mobile, grid on desktop */}
              {(() => {
                const [activeCardIndex, setActiveCardIndex] = useState(0);
                const carouselRef = useRef<HTMLDivElement>(null);
                const [isGiftDragging, setIsGiftDragging] = useState(false);
                const [giftDragStartX, setGiftDragStartX] = useState(0);
                const [giftScrollStart, setGiftScrollStart] = useState(0);
                
                const handleScroll = () => {
                  if (carouselRef.current && !isGiftDragging) {
                    const scrollLeft = carouselRef.current.scrollLeft;
                    const cardWidth = carouselRef.current.offsetWidth;
                    const newIndex = Math.round(scrollLeft / cardWidth);
                    setActiveCardIndex(newIndex);
                  }
                };
                
                const scrollToCard = (index: number) => {
                  if (carouselRef.current) {
                    const cardWidth = carouselRef.current.offsetWidth;
                    carouselRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
                  }
                };
                
                // Mouse drag handlers for desktop
                const handleGiftDragStart = (e: React.MouseEvent) => {
                  if (!carouselRef.current) return;
                  setIsGiftDragging(true);
                  setGiftDragStartX(e.clientX);
                  setGiftScrollStart(carouselRef.current.scrollLeft);
                };
                
                const handleGiftDragMove = (e: React.MouseEvent) => {
                  if (!isGiftDragging || !carouselRef.current) return;
                  e.preventDefault();
                  const diff = giftDragStartX - e.clientX;
                  carouselRef.current.scrollLeft = giftScrollStart + diff;
                };
                
                const handleGiftDragEnd = () => {
                  if (!isGiftDragging || !carouselRef.current) return;
                  setIsGiftDragging(false);
                  // Snap to nearest card
                  const cardWidth = carouselRef.current.offsetWidth;
                  const newIndex = Math.round(carouselRef.current.scrollLeft / cardWidth);
                  scrollToCard(newIndex);
                  setActiveCardIndex(newIndex);
                };
                
                return (
                  <div className="mt-12">
                    {/* Mobile: Swipeable carousel */}
                    <div className="md:hidden">
                      <div 
                        ref={carouselRef}
                        onScroll={handleScroll}
                        onMouseDown={handleGiftDragStart}
                        onMouseMove={handleGiftDragMove}
                        onMouseUp={handleGiftDragEnd}
                        onMouseLeave={handleGiftDragEnd}
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 select-none"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: isGiftDragging ? 'grabbing' : 'grab' }}
                      >
                        {content.cards.map((card, idx) => (
                          <div key={idx} className="flex-shrink-0 w-full snap-center px-2">
                            <div className="text-center">
                              {card.image ? (
                                <div className="w-full aspect-video mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                                  <img 
                                    src={card.image} 
                                    alt={card.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                              ) : (
                                <div 
                                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: colors.accent }}
                                >
                                  <CardIcon icon={card.icon} />
                                </div>
                              )}
                              <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                              <p className="text-muted-foreground text-sm px-4">
                                {card.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Dot indicators */}
                      <div className="flex justify-center gap-2 mt-6">
                        {content.cards.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => scrollToCard(idx)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${activeCardIndex === idx ? 'w-6' : 'w-2.5 opacity-50'}`}
                            style={{ backgroundColor: colors.primary }}
                            aria-label={`Go to card ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Desktop: Grid layout */}
                    <div className="hidden md:grid md:grid-cols-3 gap-8">
                      {content.cards.map((card, idx) => (
                        <div key={idx} className="text-center">
                          {card.image ? (
                            <div className="w-full aspect-video mx-auto mb-4 rounded-xl overflow-hidden shadow-lg">
                              <img 
                                src={card.image} 
                                alt={card.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          ) : (
                            <div 
                              className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: colors.accent }}
                            >
                              <CardIcon icon={card.icon} />
                            </div>
                          )}
                          <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                          <p className="text-muted-foreground text-sm">
                            {card.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>
        );
      })()}

      {/* BENEFITS SECTION */}
      <section id="benefits" className="py-16" style={isEventPage ? { backgroundColor: eventColors?.accent } : {}}>
        <div className="container px-4">
          <div className="text-center mb-12">
            {/* Angle-based trust badge for event pages */}
            {isEventPage && currentAngleModifier.trustBadge && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ backgroundColor: `${eventColors?.primary}15` }}>
                <Check className="w-4 h-4" style={{ color: eventColors?.primary }} />
                <span className="text-sm font-medium" style={{ color: eventColors?.primary }}>
                  {currentAngleModifier.trustBadge}
                </span>
              </div>
            )}
            <h2 className="text-3xl font-semibold tracking-tight">{config.benefits.sectionTitle}</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              {config.benefits.sectionSubtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {(() => {
              const benefitImages = [
                { src: '/images/optimized/benefits-large/sleep-alignment.webp', srcset: '/images/optimized/benefits-large/responsive/sleep-alignment-400.webp 400w, /images/optimized/benefits-large/responsive/sleep-alignment-800.webp 800w' },
                { src: '/images/optimized/benefits-large/wake-refreshed.webp', srcset: '/images/optimized/benefits-large/responsive/wake-refreshed-400.webp 400w, /images/optimized/benefits-large/responsive/wake-refreshed-800.webp 800w' },
                { src: '/images/optimized/benefits-large/washing-machine.webp', srcset: '/images/optimized/benefits-large/responsive/washing-machine-400.webp 400w, /images/optimized/benefits-large/responsive/washing-machine-800.webp 800w' }
              ];
              return config.benefits.benefits.map((benefit, idx) => (
                <div key={idx} className="text-center">
                  <div className="aspect-square md:aspect-[3/4] bg-secondary rounded-xl mb-4 overflow-hidden">
                    <img 
                      src={benefitImages[idx]?.src || benefitImages[0].src} 
                      srcSet={benefitImages[idx]?.srcset || benefitImages[0].srcset}
                      sizes="(max-width: 768px) 400px, 800px"
                      alt={benefit.title} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      {/* SLEEP POSITION GUIDE - Matching Press Bar Design */}
      {(() => {
        // Get quiz tags for contextual content
        const urlParams = new URLSearchParams(window.location.search);
        const positionTags = urlParams.get('tags')?.split(',').filter(Boolean) || [];
        
        // Determine user's sleep position from quiz
        const isSideSleeper = positionTags.includes('side-sleeper');
        const isBackSleeper = positionTags.includes('back-sleeper');
        const isStomachSleeper = positionTags.includes('stomach-sleeper');
        const isMixedSleeper = positionTags.includes('mixed-sleeper') || positionTags.includes('combination-sleeper');
        const hasQuizPosition = isSideSleeper || isBackSleeper || isStomachSleeper || isMixedSleeper;
        
        // Contextualized title and subtitle based on quiz
        const getContextualTitle = () => {
          if (isSideSleeper) return { title: 'Perfect for Side Sleepers', subtitle: 'Like You' };
          if (isBackSleeper) return { title: 'Perfect for Back Sleepers', subtitle: 'Like You' };
          if (isStomachSleeper) return { title: 'Perfect for Stomach Sleepers', subtitle: 'Like You' };
          if (isMixedSleeper) return { title: 'Perfect for Combination Sleepers', subtitle: 'Like You' };
          return { title: 'Works for Every Sleeper', subtitle: 'Adapts to Your Position' };
        };
        
        const { title, subtitle } = getContextualTitle();
        
        // Get position-specific benefits
        const getPositionBenefits = (position: string) => {
          const benefits: Record<string, { highlight: string; description: string }> = {
            back: { highlight: 'Cradles neck curve', description: 'Maintains natural spine alignment' },
            side: { highlight: 'Fills shoulder gap', description: 'Reduces pressure on shoulders' },
            stomach: { highlight: 'Low profile support', description: 'Prevents neck strain' }
          };
          return benefits[position] || { highlight: '', description: '' };
        };
        
        return (
          <section 
            className={`py-8 border-y ${isEventPage ? '' : 'border-border bg-secondary/30'}`}
            style={isEventPage ? { borderColor: `${eventColors?.primary}33`, backgroundColor: eventColors?.accentDark } : {}}
          >
            <div className="container px-4">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-sm font-medium">{title}</span>
                <span className="text-muted-foreground text-sm">• {subtitle}</span>
              </div>
              
              {/* Images Row - Mobile: divide space by 3 for larger images */}
              <div className="flex items-stretch justify-between sm:justify-center gap-2 sm:gap-6 md:gap-10 px-2 sm:px-0">
                {/* Back Sleeper */}
                <div className={`flex-1 sm:flex-initial flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 ${isBackSleeper ? 'ring-2 ring-[#1d9bf0] ring-offset-2 rounded-lg p-1' : ''}`}>
                  <div className="relative w-full sm:w-auto">
                    <div className="aspect-square sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src="/images/optimized/cards/sleep-position-back-100.webp"
                        srcSet="/images/optimized/cards/sleep-position-back-100.webp 100w, /images/optimized/cards/sleep-position-back.webp 400w"
                        sizes="80px"
                        alt="Back sleeper" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${isBackSleeper ? 'bg-[#1d9bf0]' : 'bg-foreground'}`}>
                      <Check className="w-3 h-3 text-background" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className={`text-xs sm:text-sm font-medium ${isBackSleeper ? 'text-[#1d9bf0]' : ''}`}>
                      {isBackSleeper ? 'Back (You)' : 'Back'}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{getPositionBenefits('back').highlight}</p>
                  </div>
                </div>
                
                <div className="w-px h-12 bg-border hidden md:block" />
                
                {/* Side Sleeper */}
                <div className={`flex-1 sm:flex-initial flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 ${isSideSleeper ? 'ring-2 ring-[#1d9bf0] ring-offset-2 rounded-lg p-1' : ''}`}>
                  <div className="relative w-full sm:w-auto">
                    <div className="aspect-square sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src="/images/optimized/cards/sleep-position-side-100.webp"
                        srcSet="/images/optimized/cards/sleep-position-side-100.webp 100w, /images/optimized/cards/sleep-position-side.webp 400w"
                        sizes="80px"
                        alt="Side sleeper" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${isSideSleeper ? 'bg-[#1d9bf0]' : 'bg-foreground'}`}>
                      <Check className="w-3 h-3 text-background" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className={`text-xs sm:text-sm font-medium ${isSideSleeper ? 'text-[#1d9bf0]' : ''}`}>
                      {isSideSleeper ? 'Side (You)' : 'Side'}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{getPositionBenefits('side').highlight}</p>
                  </div>
                </div>
                
                <div className="w-px h-12 bg-border hidden md:block" />
                
                {/* Stomach Sleeper */}
                <div className={`flex-1 sm:flex-initial flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3 ${isStomachSleeper ? 'ring-2 ring-[#1d9bf0] ring-offset-2 rounded-lg p-1' : ''}`}>
                  <div className="relative w-full sm:w-auto">
                    <div className="aspect-square sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src="/images/optimized/cards/sleep-position-stomach-100.webp"
                        srcSet="/images/optimized/cards/sleep-position-stomach-100.webp 100w, /images/optimized/cards/sleep-position-stomach.webp 400w"
                        sizes="80px"
                        alt="Stomach sleeper" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${isStomachSleeper ? 'bg-[#1d9bf0]' : 'bg-foreground'}`}>
                      <Check className="w-3 h-3 text-background" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className={`text-xs sm:text-sm font-medium ${isStomachSleeper ? 'text-[#1d9bf0]' : ''}`}>
                      {isStomachSleeper ? 'Stomach (You)' : 'Stomach'}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">{getPositionBenefits('stomach').highlight}</p>
                  </div>
                </div>
              </div>
              
              {/* Contextualized message for mixed sleepers */}
              {isMixedSleeper && (
                <div className="mt-4 text-center">
                  <p className="text-xs text-[#1d9bf0] font-medium bg-[#1d9bf0]/10 inline-block px-3 py-1.5 rounded-full">
                    ✨ Our adaptive fill adjusts as you change positions throughout the night
                  </p>
                </div>
              )}
              
              {/* Trust badges below images */}
              <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Pain Free Sleep</span>
                <span className="flex items-center gap-1.5"><Moon className="w-3.5 h-3.5" /> Restful Nights</span>
              </div>
            </div>
          </section>
        );
      })()}

      {/* WHY WE'RE CHEAPER - Cut the Middlemen Section */}
      <section 
        className="py-16 text-white"
        style={{ backgroundColor: isEventPage && eventColors ? eventColors.secondary : '#1a1a2e' }}
      >
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Explanation */}
            <div>
              <div 
                className="text-sm font-medium mb-2"
                style={{ color: isEventPage && eventColors ? eventColors.accent : '#e63946' }}
              >Direct to You</div>
              <h2 className="text-3xl font-semibold tracking-tight mb-6">
                Premium Quality.<br />Without the Premium Markup.
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                Traditional retail adds layers of cost that have nothing to do with quality. Distributors, showroom rent, sales commissions. You pay for all of it. We cut them out.
              </p>
              <p className="text-white/70 leading-relaxed mb-8">
                By selling directly online, we deliver the same hotel-grade construction at a fraction of the price. No middlemen. No markups. Just a better pillow, shipped straight to your door.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5" style={{ color: isEventPage && eventColors ? eventColors.accent : '#e63946' }} />
                  <span>No retail markup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" style={{ color: isEventPage && eventColors ? eventColors.accent : '#e63946' }} />
                  <span>{isUS ? 'Free shipping' : nonUsBadgeText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" style={{ color: isEventPage && eventColors ? eventColors.accent : '#e63946' }} />
                  <span>Factory direct</span>
                </div>
              </div>
            </div>

            {/* Right: Comparison Bar Graphs */}
            <div className="space-y-8">
              {/* Retail Price Breakdown - $119 total */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white/60">Retail Store Price</span>
                  <span className="text-lg font-bold">$119.00</span>
                </div>
                <div className="relative">
                  <div className="h-14 bg-white/10 rounded-lg overflow-hidden flex">
                    {/* Manufacturing: $17.50 / $119 = 14.7% */}
                    <div className="h-full bg-red-500/80 flex items-center justify-center text-sm font-medium" style={{ width: '14.7%' }}>
                      <span className="px-1">Mfg</span>
                    </div>
                    {/* Distributor: $20.50 / $119 = 17.2% */}
                    <div className="h-full bg-red-400/80 flex items-center justify-center text-sm font-medium" style={{ width: '17.2%' }}>
                      <span className="px-1">Distributor</span>
                    </div>
                    {/* Store Rent: $25.00 / $119 = 21% */}
                    <div className="h-full bg-red-300/80 flex items-center justify-center text-sm font-medium text-gray-800" style={{ width: '21%' }}>
                      <span className="px-1">Store Rent</span>
                    </div>
                    {/* Staff: $16.00 / $119 = 13.4% */}
                    <div className="h-full bg-red-200/80 flex items-center justify-center text-sm font-medium text-gray-800" style={{ width: '13.4%' }}>
                      <span className="px-1">Staff</span>
                    </div>
                    {/* Margin: $40.00 / $119 = 33.6% */}
                    <div className="h-full bg-red-100/80 flex items-center justify-center text-sm font-medium text-gray-800" style={{ width: '33.6%' }}>
                      <span className="px-1">Margin</span>
                    </div>
                  </div>
                  {/* Price labels aligned under each segment */}
                  <div className="flex mt-2 text-xs text-white/40">
                    <span style={{ width: '14.7%' }} className="text-left">$17.50</span>
                    <span style={{ width: '17.2%' }} className="text-left">$20.50</span>
                    <span style={{ width: '21%' }} className="text-left">$25.00</span>
                    <span style={{ width: '13.4%' }} className="text-left">$16.00</span>
                    <span style={{ width: '33.6%' }} className="text-left">$40.00</span>
                  </div>
                </div>
              </div>

              {/* FluffCo Direct Price - scaled to ~50% of bar width for better readability */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-medium ${isEventPage ? 'text-white' : 'text-green-400'}`}>FluffCo Direct Price</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/40 line-through">$119.00</span>
                    <span className={`text-lg font-bold ${isEventPage ? 'text-white' : 'text-green-400'}`}>$37.48</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-14 bg-white/10 rounded-lg overflow-hidden flex">
                    {/* Manufacturing: $17.50 - scaled up for readability (actual ~15%, display ~24%) */}
                    <div className={`h-full flex items-center justify-center text-sm font-medium ${isEventPage ? 'bg-white/90 text-gray-800' : 'bg-green-500'}`} style={{ width: '24%' }}>
                      <span className="px-1">Mfg</span>
                    </div>
                    {/* Shipping: $8.50 - scaled up (actual ~7%, display ~12%) */}
                    <div className={`h-full flex items-center justify-center text-sm font-medium ${isEventPage ? 'bg-white/70 text-gray-800' : 'bg-green-400'}`} style={{ width: '12%' }}>
                      <span className="px-1">Ship</span>
                    </div>
                    {/* Our Margin: $11.48 - scaled up (actual ~10%, display ~15%) */}
                    <div className={`h-full flex items-center justify-center text-sm font-medium text-gray-800 ${isEventPage ? 'bg-white/50' : 'bg-green-300'}`} style={{ width: '15%' }}>
                      <span className="px-1">Us</span>
                    </div>
                  </div>
                  <div className="flex mt-2 text-xs text-white/40">
                    <span style={{ width: '24%' }}>$17.50</span>
                    <span style={{ width: '12%' }}>$8.50</span>
                    <span style={{ width: '15%' }}>$11.48</span>
                  </div>
                </div>
              </div>

              {/* Savings Highlight with Quantity Switcher */}
              <div className={`rounded-xl p-6 ${isEventPage ? 'bg-white/10 border border-white/20' : 'bg-green-500/20 border border-green-500/30'}`}>
                {/* Quantity Switcher - Stacked on mobile */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <span className="text-xs text-white/60">Savings per deal:</span>
                  <div className="flex bg-white/10 rounded-full p-0.5">
                    {([1, 2, 4] as const).map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setSavingsQuantity(qty)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                          savingsQuantity === qty
                            ? isEventPage ? 'bg-white text-gray-800' : 'bg-green-500 text-white'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {qty} Pillow{qty > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Savings Display */}
                <div className="text-center">
                  <div className={`text-sm mb-1 ${isEventPage ? 'text-white/80' : 'text-green-400'}`}>Total Savings vs. Retail</div>
                  <div className="text-4xl font-bold text-white mb-2">
                    ${savingsQuantity === 1 ? '59.10' : savingsQuantity === 2 ? '139.10' : '326.10'}
                  </div>
                  <div className="text-sm text-white/60">
                    {savingsQuantity === 1 && 'You pay $59.90 instead of $119.00'}
                    {savingsQuantity === 2 && 'You pay $98.90 instead of $238.00'}
                    {savingsQuantity === 4 && 'You pay $149.90 instead of $476.00'}
                  </div>
                  <div className={`mt-4 pt-4 border-t ${isEventPage ? 'border-white/20' : 'border-green-500/20'}`}>
                    <div className="text-xs text-white/40 mb-1">Price per pillow</div>
                    <div className={`text-2xl font-bold ${isEventPage ? 'text-white' : 'text-green-400'}`}>
                      ${savingsQuantity === 1 ? '59.90' : savingsQuantity === 2 ? '49.45' : '37.48'}
                      <span className="text-sm font-normal text-white/60">/pillow</span>
                    </div>
                    <div className="text-xs text-white/40 mt-1">vs. $119.00 retail average</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE DIFFERENCE SECTION */}
      <section id="difference" className={`py-16 ${isEventPage ? '' : 'bg-secondary/30'}`} style={isEventPage ? { backgroundColor: eventColors?.accentDark } : {}}>
        <div className="container px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">The Difference Is Clear</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl xl:max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
              {/* Video above Standard Pillows - square with padding */}
              <div className="p-6" style={isEventPage && eventColors ? { backgroundColor: eventColors.accent } : { backgroundColor: '#f0ebe5' }}>
                <div className="aspect-square max-w-[280px] mx-auto rounded-xl overflow-hidden bg-secondary">
                  <LazyVideo
                    src="https://framerusercontent.com/assets/f3DSNqcmzcpkC7PEkDHcnxtezak.mp4"
                    className="w-full h-full"
                    ariaLabel="Standard pillow losing shape over time"
                    captionSrc="/captions/standard-pillow.vtt"
                  />
                </div>
              </div>
              <div className="p-8">
              <h3 className="font-semibold text-lg mb-4 text-muted-foreground">{config.difference.standardPillowTitle}</h3>
              <ul className="space-y-3">
                {config.difference.standardPillowPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="text-[#e63946]">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden border-2 border-foreground relative">
              {/* Oprah Daily Sleep O-Wards Badge - Brand-approved WebP image */}
              <div className="absolute top-4 right-4 z-10">
                <img 
                  src="/images/oprah-sleep-awards-2024-150.webp" 
                  srcSet="/images/oprah-sleep-awards-2024-small.webp 80w, /images/oprah-sleep-awards-2024-150.webp 150w"
                  sizes="80px"
                  alt="Oprah Daily Sleep O-Wards 2024" 
                  className="w-20 h-20 rounded-full shadow-lg"
                  loading="lazy"
                />
              </div>
              {/* Video above Restorative Pillow - square with padding */}
              <div className="p-6" style={isEventPage && eventColors ? { backgroundColor: eventColors.accent } : { backgroundColor: '#e8f4e8' }}>
                <div className="aspect-square max-w-[280px] mx-auto rounded-xl overflow-hidden bg-secondary">
                  <LazyVideo
                    src="https://framerusercontent.com/assets/YpJ8WilBOfL6WcDkFULQlVzncns.mp4"
                    className="w-full h-full"
                    ariaLabel="FluffCo pillow maintaining shape with consistent support"
                    captionSrc="/captions/fluffco-pillow.vtt"
                  />
                </div>
              </div>
              <div className="p-8">
              <h3 className="font-semibold text-lg mb-4">{config.difference.fluffcoPillowTitle}</h3>
              <ul className="space-y-3">
                {config.difference.fluffcoPillowPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-green-600">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SLEEP EXPERTS SECTION - Gallery with Collapsibles */}
      <section className="py-16" style={isEventPage ? { backgroundColor: eventColors?.accent } : {}}>
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left: Gallery */}
            <div className="max-w-full overflow-hidden">
              <ImageCarousel
                images={[
                  { content: <ExpertPillowSlide />, thumbnail: <ExpertPillowThumbnail />, alt: 'FluffCo pillow features overview' },
                  { content: <CoupleSleepSlide />, thumbnail: <CoupleSleepThumbnail />, alt: 'Couple sleeping peacefully with FluffCo pillows' },
                  { content: <DeliverySlide />, thumbnail: <DeliveryThumbnail />, alt: 'Free shipping delivery to your door' },
                  { content: <HotelComparisonSlide fluffPrice="$59" />, thumbnail: <HotelComparisonThumbnail />, alt: 'FluffCo vs luxury hotel pillows comparison' },
                  { content: <SleepCompanionSlide />, thumbnail: <SleepCompanionThumbnail />, alt: 'Woman sleeping peacefully - Sound Sleep, Skin Friendly, Ethically Sourced, Breathable' },
                  { content: <EthicalMakingSlide />, thumbnail: <EthicalMakingThumbnail />, alt: 'Ethically made in USA - Vegan Microfiber, Allergy-Free' },
                ]}
                aspectRatio="1/1"
                showThumbnails={true}
                showArrows={false}
                onSlideChange={(index) => setExpertGalleryIndex(index)}
              />
            </div>
            
            {/* Right: Content with Collapsibles */}
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">The Pillow Sleep Experts Recommend</h2>
              <p className="text-lg text-muted-foreground mb-8">Luxury Comfort, Zero Guilt (or Allergies!)</p>
              
              {/* Collapsible Accordions */}
              <div className="space-y-0 border-t border-border">
                {[
                  {
                    id: 'vegan',
                    title: 'Soft, Plush, and Ethically Made',
                    content: 'Our vegan microfiber pillows feel just like down, without the feathers, the guilt, or the allergies. Sleep well knowing your comfort doesn\'t come at a compromise.'
                  },
                  {
                    id: 'sustainable',
                    title: 'Sustainable and 100% Cruelty-Free',
                    content: 'Crafted from eco-conscious materials, FluffCo pillows deliver a dreamy, guilt-free sleep. Because luxury should feel good in every way.'
                  },
                  {
                    id: 'sweats',
                    title: 'No More Night Sweats',
                    content: 'Breathable construction and temperature-neutral fill keep you comfortable all night. No more waking up overheated.'
                  },
                  {
                    id: 'baby',
                    title: 'Sleep Like a Baby',
                    content: 'Supportive yet soft, our pillows help you wake up refreshed, recharged, and ready to tackle the day.'
                  },
                  {
                    id: 'lasts',
                    title: 'Built to Last, Night After Night',
                    content: 'No flat, lumpy pillows here. FluffCo pillows keep their shape and support for years. Because great sleep is an investment worth making.'
                  }
                ].map((item) => (
                  <div key={item.id} className="border-b border-border">
                    <button
                      onClick={() => setExpandedExpertAccordion(expandedExpertAccordion === item.id ? null : item.id)}
                      className="w-full py-4 flex items-center justify-between text-left font-medium hover:text-foreground/80 transition-colors"
                    >
                      {item.title}
                      {expandedExpertAccordion === item.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {expandedExpertAccordion === item.id && (
                      <div className="pb-4 text-sm text-muted-foreground leading-relaxed">{item.content}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECHNOLOGY SECTION - 16:9 image */}
      <section id="technology" className={`py-16 ${isEventPage ? '' : 'bg-secondary/30'}`} style={isEventPage ? { backgroundColor: eventColors?.accentDark } : {}}>
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2">The Engineering</div>
              <h2 className="text-3xl font-semibold tracking-tight mb-6">Why It Lasts</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5" />
                    <h3 className="font-semibold">Sanforized Construction</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A specialized process used by luxury hotel suppliers. Pre-shrinks and stabilizes the fabric, preventing the compression and shape loss that plagues standard pillows.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["Holds Shape", "More Durable", "Easy to Clean", "Crisp Texture"].map((tag) => (
                      <span 
                        key={tag} 
                        className={`inline-flex items-center px-3 py-1.5 text-sm rounded-full ${isEventPage ? '' : 'bg-secondary'}`}
                        style={isEventPage ? { backgroundColor: `${eventColors?.primary}15`, color: eventColors?.primary } : {}}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-semibold">Microfiber Fill</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Fibers 5x thinner than human hair create plush, down-like support without the allergens. Maintains loft while providing consistent resistance.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["Hypoallergenic", "High Loft", "Temperature Neutral", "Wear Resistant"].map((tag) => (
                      <span 
                        key={tag} 
                        className={`inline-flex items-center px-3 py-1.5 text-sm rounded-full ${isEventPage ? '' : 'bg-secondary'}`}
                        style={isEventPage ? { backgroundColor: `${eventColors?.primary}15`, color: eventColors?.primary } : {}}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="aspect-video bg-secondary rounded-2xl overflow-hidden">
              <img src={toWebP("/images/optimized/benefits/engineering-detail.png")} alt="Engineering detail" className="w-full h-full object-cover" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* NECK PAIN ANGLE SECTION - Only for neck pain relief config */}
      {config.id === 'neck-pain-relief' && (
        <section className="py-16 bg-gradient-to-b from-[#e8f4fc] to-[#f0f8ff]">
          <div className="container px-4">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-[#2563eb]/10 text-[#2563eb] text-sm font-medium rounded-full mb-4">Designed for Pain Relief</span>
              <h2 className="text-3xl font-semibold tracking-tight mb-4">Why Your Current Pillow Causes Neck Pain</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Most pillows fail to support your cervical spine properly, leading to strain, stiffness, and chronic discomfort. Here's how we engineered a solution.</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Cervical Alignment */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#2563eb]/20 shadow-sm">
                <div className="aspect-[4/3] bg-[#f0f8ff]">
                  <img src={toWebP("/images/optimized/benefits/neck-pain-cervical-alignment.png")} alt="Proper cervical alignment" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="font-semibold text-lg">Proper Cervical Alignment</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">Our pillow maintains your neck's natural C-curve throughout the night, preventing the strain that causes morning stiffness.</p>
                  <ul className="space-y-2">
                    {["Supports natural spine curvature", "Reduces muscle tension", "Prevents nerve compression"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-[#2563eb]">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Morning Relief */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#2563eb]/20 shadow-sm">
                <div className="aspect-[4/3] bg-[#f0f8ff]">
                  <img src={toWebP("/images/optimized/benefits/neck-pain-morning-relief.png")} alt="Wake up without pain" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" /></svg>
                    </div>
                    <h3 className="font-semibold text-lg">Wake Up Pain-Free</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">Customers report significant reduction in morning neck stiffness within the first week of switching to our pillow.</p>
                  <ul className="space-y-2">
                    {["No more morning stiffness", "Reduced headaches", "Better range of motion"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-[#2563eb]">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Support Zones */}
              <div className="bg-white rounded-2xl overflow-hidden border border-[#2563eb]/20 shadow-sm">
                <div className="aspect-[4/3] bg-[#f0f8ff]">
                  <img src={toWebP("/images/optimized/benefits/neck-pain-support-diagram.png")} alt="Support zones diagram" className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h3 className="font-semibold text-lg">3-Zone Support System</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">Engineered with distinct support zones for your head, neck, and shoulders, each optimized for its specific function.</p>
                  <ul className="space-y-2">
                    {["Head cradle zone", "Cervical support core", "Shoulder transition zone"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="text-[#2563eb]">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Therapist Recommendation Banner */}
            <div className="mt-12 bg-white rounded-2xl border border-[#2563eb]/20 p-6 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-[#2563eb]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-8 h-8 text-[#2563eb]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-semibold text-lg mb-1">Recommended by Physical Therapists & Chiropractors</h3>
                  <p className="text-muted-foreground text-sm">Healthcare professionals recommend our pillow for patients with chronic neck issues. The consistent support and proper alignment help complement treatment plans.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FLUFFCO SECRET SECTION - Hidden for neck pain relief config */}
      {config.id !== 'neck-pain-relief' && (
      <section className="py-16" style={isEventPage ? { backgroundColor: eventColors?.accent } : {}}>
        <div className="container px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">What is the FluffCo Secret?</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl xl:max-w-5xl mx-auto">
            {/* Lasting Shape and Comfort */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
              <div className="aspect-video bg-secondary">
                <img 
                  src="/images/optimized/lasting-shape/lasting-shape.webp" 
                  srcSet="/images/optimized/lasting-shape/lasting-shape-400.webp 400w, /images/optimized/lasting-shape/lasting-shape-800.webp 800w, /images/optimized/lasting-shape/lasting-shape.webp 1200w"
                  sizes="(max-width: 768px) 400px, 800px"
                  alt="Hand pressing pillow showing lasting shape and comfort" 
                  className="w-full h-full object-cover" 
                  loading="lazy" 
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-3">Lasting Shape and Comfort</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  "Sanforizing" is a special and rare way to make pillows that only the 5-star suppliers do. This unique method of craftsmanship allows these pillows to hold their shape night in and night out - as luxury pillows should!
                </p>
                <ul className="space-y-2">
                  {["Holds Their Shape", "More Durable", "Easy to Clean", "Extra Crisp Texture", "Softer to the Touch"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span style={isEventPage ? { color: eventColors?.primary } : {}} className={isEventPage ? '' : 'text-green-600'}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* 5x Thinner Than a Hair */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
              <div className="aspect-video bg-secondary">
                <img src={toWebP("/images/optimized/benefits/microfiber-closeup.png")} alt="Microfiber close-up" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-3">5x Thinner Than a Hair</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  The best pillows are made with the thinnest threads. Hotel-pillows use super thin fibers to make the inside of the pillow feel squishy but also firm at the same time.
                </p>
                <ul className="space-y-2">
                  {["Plush, Down-Like Softness", "Higher Loft (height and fluffiness)", "Cooler Temperatures", "Resistant to Wear and Tear", "Hypoallergenic"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span style={isEventPage ? { color: eventColors?.primary } : {}} className={isEventPage ? '' : 'text-green-600'}>✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* BUILT FOR THE LONG RUN - Cards with images */}
      <section className={`py-16 ${isEventPage ? '' : 'bg-secondary/30'}`} style={isEventPage ? { backgroundColor: eventColors?.accentDark } : {}}>
        <div className="container px-4">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">Built for the Long Run</h2>
          
          {/* Desktop: Show all cards in grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-full xl:max-w-6xl mx-auto">
            {benefitCards.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div key={idx} className="bg-card rounded-xl border border-border overflow-hidden flex min-w-0">
                    <div className="w-20 lg:w-28 flex-shrink-0 bg-secondary">
                      <img 
                        src={benefit.image} 
                        alt={benefit.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <h3 className="font-semibold text-sm">{benefit.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Mobile: Show 3 cards + partial 4th with overlay button */}
          <div className="md:hidden relative">
            <div className="flex flex-col gap-2.5">
              {benefitCards.map((benefit, idx) => {
                const Icon = benefit.icon;
                // Show first 3 fully, 4th partially (for overlay effect), hide rest when collapsed
                const isHidden = !showAllBenefitCards && idx >= 4;
                const isPartial = !showAllBenefitCards && idx === 3;
                
                if (isHidden) return null;
                
                return (
                  <div 
                    key={idx} 
                    className={`bg-card rounded-xl border border-border overflow-hidden flex min-w-0 transition-all duration-300 relative ${
                      isPartial ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="w-20 flex-shrink-0 bg-secondary">
                      <img 
                        src={benefit.image} 
                        alt={benefit.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 flex flex-col justify-center flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <h3 className="font-semibold text-sm">{benefit.title}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{benefit.desc}</p>
                    </div>
                    
                    {/* Overlay button on 4th card with gradient blur */}
                    {isPartial && (
                      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px]">
                        {/* Gradient overlay for smooth fade effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
                        <button 
                          onClick={() => setShowAllBenefitCards(true)}
                          className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium bg-card shadow-lg hover:bg-secondary transition-colors"
                        >
                          See All {benefitCards.length} Benefits
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS - Emotional with human touches */}
      <section id="reviews-section" className="py-16" style={isEventPage && eventColors ? { backgroundColor: eventColors.accent } : { backgroundColor: 'var(--background)' }}>
        <div className="container px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]" />
              ))}
            </div>
            <span className="font-semibold text-lg">{config.testimonials.sectionTitle}</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">{config.testimonials.sectionSubtitle}</h2>
          
          {/* Desktop: Show 4 testimonials in grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleTestimonials.map((t, idx) => (
              <div key={idx} className="bg-card p-5 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">{t.name}</span>
                      {t.verified && (
                        <span className="flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#1d9bf0] flex items-center justify-center flex-shrink-0">
                            <Check className="w-2 h-2 text-white stroke-[3]" />
                          </span>
                          <span className="text-[10px] text-[#1d9bf0] font-medium">Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{t.location}</div>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed">"{t.text}"</p>
              </div>
            ))}
          </div>
          
          {/* Desktop: Show More/Less button */}
          <div className="hidden md:block text-center mt-8">
            <button 
              onClick={() => setShowAllTestimonials(!showAllTestimonials)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              {showAllTestimonials ? 'Show Less' : 'See More Testimonials'}
              {showAllTestimonials ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Mobile: Show 3 testimonials + 4th with overlay button */}
          <div className="md:hidden relative">
            <div className="flex flex-col gap-2.5">
              {testimonials.map((t, idx) => {
                // Show first 3 fully, 4th partially (for overlay effect), hide rest when collapsed
                const isHidden = !showAllTestimonials && idx >= 4;
                const isPartial = !showAllTestimonials && idx === 3;
                
                if (isHidden) return null;
                
                return (
                  <div 
                    key={idx} 
                    className={`bg-card p-4 rounded-lg border border-border transition-all duration-300 relative ${
                      isPartial ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                        <img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-medium">{t.name}</span>
                          {t.verified && (
                            <span className="w-3.5 h-3.5 rounded-full bg-[#1d9bf0] flex items-center justify-center flex-shrink-0">
                              <Check className="w-2 h-2 text-white stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                            ))}
                          </div>
                          <span className="text-[10px] text-muted-foreground">{t.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed line-clamp-3">"{t.text}"</p>
                    
                    {/* Overlay button on 4th card with gradient blur */}
                    {isPartial && (
                      <div className="absolute inset-0 flex items-center justify-center backdrop-blur-[2px] rounded-lg">
                        {/* Gradient overlay for smooth fade effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50 rounded-lg" />
                        <button 
                          onClick={() => setShowAllTestimonials(true)}
                          className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium bg-card shadow-lg hover:bg-secondary transition-colors"
                        >
                          See All {testimonials.length} Reviews
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION with Size Selector */}
      <section 
        className="py-16"
        style={isEventPage && eventColors ? {
          background: `linear-gradient(to bottom, ${eventColors.accent}, ${eventColors.accentDark})`
        } : {
          backgroundColor: 'var(--secondary)'
        }}
      >
        <div className="container px-4 xl:max-w-4xl">
          <div className="text-center mb-8">
            {isEventPage && eventColors && (
              <span 
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{ backgroundColor: `${eventColors.primary}15`, color: eventColors.primary }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                A Thoughtful {eventNames[config.id] || 'Holiday'} Gift
              </span>
            )}
            <h2 className="text-3xl font-semibold tracking-tight">{isEventPage ? `${eventNames[config.id] || 'Holiday'} Pricing` : 'Choose Your Setup'}</h2>
            <p className="mt-3 text-muted-foreground">{isEventPage ? 'Give the gift of better sleep at exclusive seasonal pricing.' : (isUS ? 'Online-only pricing. Free shipping on all orders.' : `Online-only pricing. ${nonUsBadgeText}.`)}</p>
          </div>

          {/* Size Toggle - horizontal on both mobile and desktop */}
          <div className="flex justify-center mb-8">
            <div 
              className="inline-flex rounded-full p-1"
              style={isEventPage && eventColors ? {
                backgroundColor: eventColors.secondaryLight,
                border: `1px solid ${eventColors.primary}40`
              } : {
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)'
              }}
            >
              <button
                onClick={() => {
                  setPricingSectionSize("Standard");
                  triggerHapticFeedback();
                }}
                className="px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex flex-col sm:flex-row items-center gap-0 sm:gap-1 relative overflow-hidden active:scale-95"
                style={pricingSectionSize === "Standard" 
                  ? (isEventPage && eventColors ? {
                      backgroundColor: eventColors.primary,
                      color: 'white',
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    } : {
                      backgroundColor: 'var(--foreground)',
                      color: 'var(--background)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    })
                  : (isEventPage && eventColors ? {
                      color: eventColors.primary
                    } : {
                      color: 'var(--muted-foreground)'
                    })
                }
              >
                <span>Standard</span>
                <span className="text-[10px] sm:text-sm opacity-70">(20"×28")</span>
              </button>
              <button
                onClick={() => {
                  setPricingSectionSize("King");
                  triggerHapticFeedback();
                }}
                className="px-4 sm:px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex flex-col sm:flex-row items-center gap-0 sm:gap-1 relative overflow-hidden active:scale-95"
                style={pricingSectionSize === "King" 
                  ? (isEventPage && eventColors ? {
                      backgroundColor: eventColors.primary,
                      color: 'white',
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    } : {
                      backgroundColor: 'var(--foreground)',
                      color: 'var(--background)',
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    })
                  : (isEventPage && eventColors ? {
                      color: eventColors.primary
                    } : {
                      color: 'var(--muted-foreground)'
                    })
                }
              >
                <span>King</span>
                <span className="text-[10px] sm:text-sm opacity-70">(20"×36")</span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 relative">
            {pricingSectionPricing.map((option) => {
              const setupImage = option.quantity === 1 
                ? '/images/optimized/setup/setup-1-pillow.png' 
                : option.quantity === 2 
                  ? '/images/optimized/setup/setup-2-pillows.png' 
                  : '/images/optimized/setup/setup-4-pillows.png';
              return (
                <div
                  key={option.quantity}
                  className={`rounded-2xl border-2 relative overflow-visible flex flex-col ${
                    option.quantity === 4 ? 'border-foreground bg-card' : 'border-border bg-card'
                  }`}
                  style={option.quantity === 4 && isEventPage && eventColors ? {
                    borderColor: eventColors.primary
                  } : {}}
                >
                  {/* Badges container - flex layout for consistent spacing */}
                  <div className="absolute -top-3 right-4 z-20 flex items-center gap-1.5">
                    {option.badge && (
                      <span 
                        className="text-xs font-medium px-3 py-1 rounded-full shadow-md"
                        style={isEventPage && eventColors ? {
                          backgroundColor: eventColors.primary,
                          color: 'white'
                        } : {
                          backgroundColor: option.badge === 'Best Value' ? '#e63946' : 'var(--foreground)',
                          color: option.badge === 'Best Value' ? 'white' : 'var(--background)'
                        }}
                      >
                        {option.badge}
                      </span>
                    )}
                    {/* Discount badge - always shown */}
                    <span 
                      className="text-xs font-medium px-3 py-1 rounded-full shadow-md"
                      style={{
                        backgroundColor: '#22c55e',
                        color: 'white'
                      }}
                    >
                      -{option.discount}%
                    </span>
                  </div>
                  {/* 16:9 Image at top, touching edges - zoomed to focus on pillows */}
                  <div className="relative aspect-video w-full bg-secondary rounded-t-[14px] overflow-hidden">
                    <img 
                      src={setupImage} 
                      alt={`${option.quantity} pillow setup`} 
                      className="w-full h-full object-cover object-top scale-[1.4] origin-top"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Content area with flex-grow to push button to bottom */}
                  <div className="p-6 flex flex-col flex-grow text-left">
                    <div className="text-xl font-semibold mb-2">{option.quantity} Pillow{option.quantity > 1 ? 's' : ''}</div>
                    
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold tabular-nums overflow-hidden">
                        <span 
                          key={`${pricingSectionSize}-${option.price}`}
                          className="inline-block animate-[slideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]"
                          style={{ animationDelay: '0ms' }}
                        >
                          ${option.price.toFixed(2)}
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground tabular-nums overflow-hidden">
                        <span 
                          key={`${pricingSectionSize}-${option.originalPrice}`}
                          className="inline-block line-through animate-[slideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]"
                          style={{ animationDelay: '50ms' }}
                        >
                          ${option.originalPrice.toFixed(2)}
                        </span>
                      </span>
                    </div>
                    <div className="text-sm text-green-600 font-medium mb-4 tabular-nums overflow-hidden">
                      <span 
                        key={`${pricingSectionSize}-${option.savings}`}
                        className="inline-block animate-[slideIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)_both]"
                        style={{ animationDelay: '100ms' }}
                      >
                        Save ${option.savings.toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Pillowcase bonus - horizontal bar style matching hero */}
                    {option.bonus && (
                      <div className="border-t border-b border-border py-2 my-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">+ 2 Free Pillowcases</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground line-through">$116</span>
                          <span className="text-xs font-medium text-green-600">FREE</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Spacer to push button to bottom */}
                    <div className="flex-grow"></div>
                    
                    <button 
                      onClick={() => {
                        setSelectedQuantity(option.quantity);
                        setSelectedSize(pricingSectionSize);
                        // Track AddToCart event (Meta)
                        const size = pricingSectionSize === 'Standard' ? 'standard' : 'king';
                        const qty = option.quantity as 1 | 2 | 4;
                        const productData = getProductDataForTracking(size, qty);
                        trackAddToCart(productData);
                        
                        // GA4: Track add_to_cart
                        const ga4Item = createMainProductItem(pricingSectionSize, qty, option.price, option.originalPrice);
                        trackGA4AddToCart([ga4Item], option.price);
                        
                        setShowOrderPopup(true);
                      }}
                      className={`w-full py-3 rounded-full font-medium transition-all duration-300 hover:-translate-y-px active:translate-y-0 ${
                        option.quantity === 4 
                          ? 'text-white' 
                          : 'bg-foreground text-background'
                      }`}
                      style={option.quantity === 4 ? { 
                        backgroundColor: isEventPage && eventColors ? eventColors.primary : '#e63946',
                        boxShadow: `0 2px 8px ${isEventPage && eventColors ? eventColors.primary : '#e63946'}40`
                      } : (isEventPage && eventColors ? {
                        backgroundColor: 'transparent',
                        border: `2px solid ${eventColors.primary}`,
                        color: eventColors.primary
                      } : {})}
                      onMouseEnter={(e) => {
                        if (option.quantity === 4) {
                          const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                          e.currentTarget.style.boxShadow = `0 4px 20px ${color}70`;
                          e.currentTarget.style.filter = 'brightness(0.95)';
                        } else if (isEventPage && eventColors) {
                          e.currentTarget.style.backgroundColor = eventColors.primary;
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.boxShadow = `0 2px 8px ${eventColors.primary}30`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (option.quantity === 4) {
                          const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                          e.currentTarget.style.boxShadow = `0 2px 8px ${color}40`;
                          e.currentTarget.style.filter = 'brightness(1)';
                        } else if (isEventPage && eventColors) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = eventColors.primary;
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {getPageCTAWithDiscount(option.discount)}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Check className="w-4 h-4" /> 100-Night Guarantee</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4" /> {isUS ? 'Free Shipping' : nonUsBadgeText}</span>
            <span className="flex items-center gap-1"><Check className="w-4 h-4" /> {isUS ? 'Made in USA' : nonUsAlternativeUsp.title}</span>
          </div>
          
          {/* Award Badges - Mentions prominent, publications below */}
          {/* Desktop: horizontal with separators, Mobile: vertical list aligned left */}
          <div className="hidden sm:flex flex-wrap justify-center items-center gap-6 mt-8">
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold text-foreground">"Best Soft Pillow"</span>
              <span className="text-[10px] text-muted-foreground">Architectural Digest</span>
            </div>
            <span className="text-muted-foreground/30">|</span>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold text-foreground">"Best Overall Pillow"</span>
              <span className="text-[10px] text-muted-foreground">Apartment Therapy</span>
            </div>
            <span className="text-muted-foreground/30">|</span>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold text-foreground">"Best Down Pillow"</span>
              <span className="text-[10px] text-muted-foreground">Men's Health</span>
            </div>
            <span className="text-muted-foreground/30">|</span>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold text-foreground">"Editor's Pick"</span>
              <span className="text-[10px] text-muted-foreground">Healthline</span>
            </div>
            <span className="text-muted-foreground/30">|</span>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold text-foreground">"95/100"</span>
              <span className="text-[10px] text-muted-foreground">PureWow</span>
            </div>
          </div>
          {/* Mobile: clean 2x2 grid layout */}
          <div className="grid sm:hidden grid-cols-2 gap-3 mt-6 px-4 max-w-sm mx-auto">
            <div className="bg-card border border-border rounded-lg px-3 py-2 text-center">
              <span className="text-xs font-semibold text-foreground block">"Best Soft Pillow"</span>
              <span className="text-[10px] text-muted-foreground">Architectural Digest</span>
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-2 text-center">
              <span className="text-xs font-semibold text-foreground block">"Best Overall"</span>
              <span className="text-[10px] text-muted-foreground">Apartment Therapy</span>
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-2 text-center">
              <span className="text-xs font-semibold text-foreground block">"Best Down Pillow"</span>
              <span className="text-[10px] text-muted-foreground">Men's Health</span>
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-2 text-center">
              <span className="text-xs font-semibold text-foreground block">"95/100 Rating"</span>
              <span className="text-[10px] text-muted-foreground">PureWow</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION - Closed by default, openable/closable */}
      <section id="faq" className="py-16" style={isEventPage ? { backgroundColor: eventColors?.accent } : {}}>
        <div className="container px-4 xl:max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">{config.faq.sectionTitle}</h2>
          
          <div 
            className="rounded-2xl border overflow-hidden"
            style={isEventPage && eventColors ? {
              backgroundColor: 'white',
              borderColor: `${eventColors.primary}33`
            } : {
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)'
            }}
          >
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="last:border-b-0 transition-colors border-b"
                style={isEventPage && eventColors ? {
                  borderColor: `${eventColors.primary}1a`,
                  backgroundColor: expandedFaq === idx ? eventColors.background : undefined
                } : {
                  borderColor: 'var(--border)'
                }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left"
                >
                  <h3 className="font-medium pr-4 text-sm sm:text-base">{faq.q}</h3>
                  {expandedFaq === idx ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0 text-muted-foreground" />
                  )}
                </button>
                {expandedFaq === idx && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-6 -mt-2">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* FOOTER */}
      <footer 
        className="py-12 border-t"
        style={isEventPage && eventColors ? {
          borderColor: `${eventColors.primary}33`,
          backgroundColor: 'white'
        } : {
          borderColor: 'var(--border)'
        }}
      >
        <div className="container px-4 text-center">
          <FluffLogo className="h-5 w-auto mx-auto mb-4" color="currentColor" />
          <p className="text-sm text-muted-foreground mb-4">Consistent support. Night after night.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="https://fluff.co/pages/terms-conditions" target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms & Conditions</a>
            <a href="https://fluff.co/policies/terms-of-service" target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
            <a href="https://fluff.co/pages/shipping-returns" target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Return Policy</a>
            <a href="https://fluff.co/pages/privacy" target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2026 FluffCo. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSizeGuide(false)}
          />
          {/* Modal */}
          <div className="relative bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-auto animate-[fadeSlideIn_0.3s_ease-out]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Pillow Size Guide</h3>
              <button 
                onClick={() => setShowSizeGuide(false)}
                className="p-1 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Content */}
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">Choose the right pillow size based on your bed:</p>
              
              {/* Standard Recommendation */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedSize === 'Standard' ? 'border-foreground bg-secondary/50' : 'border-border hover:border-muted-foreground'
                }`}
                onClick={() => { setSelectedSize('Standard'); setShowSizeGuide(false); }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-muted-foreground">
                      <rect x="2" y="6" width="20" height="12" rx="2"/>
                      <line x1="8" y1="6" x2="8" y2="18"/>
                      <line x1="16" y1="6" x2="16" y2="18"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Standard</span>
                      <span className="text-xs text-muted-foreground">20" × 28"</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Best for Twin, Twin XL, Full, and Queen beds</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">Twin</span>
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">Twin XL</span>
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">Full</span>
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">Queen</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* King Recommendation */}
              <div 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedSize === 'King' ? 'border-foreground bg-secondary/50' : 'border-border hover:border-muted-foreground'
                }`}
                onClick={() => { setSelectedSize('King'); setShowSizeGuide(false); }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 text-muted-foreground">
                      <rect x="1" y="6" width="22" height="12" rx="2"/>
                      <line x1="6" y1="6" x2="6" y2="18"/>
                      <line x1="12" y1="6" x2="12" y2="18"/>
                      <line x1="18" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">King</span>
                      <span className="text-xs text-muted-foreground">20" × 36"</span>
                      <span className="text-[10px] bg-foreground text-background px-2 py-0.5 rounded-full">Chosen by 81%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Best for King and California King beds</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">King</span>
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">Cal King</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pro Tip - Hidden as per requirements */}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Add to Cart Bar */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-lg transform transition-all duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={isEventPage && eventColors ? {
          borderColor: `${eventColors.primary}33`
        } : {
          borderColor: 'var(--border)'
        }}
      >
          {/* Desktop Layout */}
          <div className="hidden sm:block container px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Product info - Fixed width to prevent layout shift */}
              <div className="flex items-center gap-3" style={{ minWidth: '220px' }}>
                <img 
                  src={toWebP("/images/optimized/hero/hero-pillow.png")} 
                  alt="FluffCo Pillow" 
                  className="w-12 h-12 object-contain flex-shrink-0"
                />
                <div style={{ minWidth: '160px' }}>
                  <div className="flex items-center gap-1.5">
                    {/* Fixed width for price to prevent shift when switching quantities */}
                    <p className="text-sm font-semibold">${currentPricing.find(p => p.quantity === selectedQuantity)?.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground line-through">${currentPricing.find(p => p.quantity === selectedQuantity)?.originalPrice.toFixed(2)}</p>
                    <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap">-{currentPricing.find(p => p.quantity === selectedQuantity)?.discount}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground" style={{ minWidth: '80px' }}>
                      {selectedQuantity} × {selectedSize}
                    </p>
                    <span className="text-xs font-medium text-green-600">
                      Instant saving: ${((currentPricing.find(p => p.quantity === selectedQuantity)?.originalPrice || 0) - (currentPricing.find(p => p.quantity === selectedQuantity)?.price || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Compact selectors */}
              <div className="flex items-center gap-2">
                {/* Size selector */}
                <div 
                  className="flex items-center gap-1 rounded-full p-0.5"
                  style={isEventPage && eventColors ? {
                    backgroundColor: eventColors.secondaryLight
                  } : {
                    backgroundColor: 'var(--secondary)'
                  }}
                >
                  {sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size.name)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-150 ${
                        selectedSize !== size.name ? 'hover:bg-black/8 dark:hover:bg-white/15' : ''
                      }`}
                      style={selectedSize === size.name
                        ? (isEventPage && eventColors ? {
                            backgroundColor: eventColors.primary,
                            color: 'white'
                          } : {
                            backgroundColor: 'var(--foreground)',
                            color: 'var(--background)'
                          })
                        : (isEventPage && eventColors ? {
                            color: eventColors.primary
                          } : {
                            color: 'var(--muted-foreground)'
                          })
                      }
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                
                {/* Quantity selector */}
                <div 
                  className="flex items-center gap-1 rounded-full p-0.5"
                  style={isEventPage && eventColors ? {
                    backgroundColor: eventColors.secondaryLight
                  } : {
                    backgroundColor: 'var(--secondary)'
                  }}
                >
                  {[1, 2, 4].map((qty) => (
                    <button
                      key={qty}
                      onClick={() => setSelectedQuantity(qty)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-150 ${
                        selectedQuantity !== qty ? 'hover:bg-black/8 dark:hover:bg-white/15' : ''
                      }`}
                      style={selectedQuantity === qty
                        ? (isEventPage && eventColors ? {
                            backgroundColor: eventColors.primary,
                            color: 'white'
                          } : {
                            backgroundColor: 'var(--foreground)',
                            color: 'var(--background)'
                          })
                        : (isEventPage && eventColors ? {
                            color: eventColors.primary
                          } : {
                            color: 'var(--muted-foreground)'
                          })
                      }
                    >
                      {qty}{qty === 4 && ' +🎁'}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* CTA button */}
              <button 
                onClick={() => {
                  // Track AddToCart event (Meta)
                  const size = selectedSize === 'Standard' ? 'standard' : 'king';
                  const qty = selectedQuantity as 1 | 2 | 4;
                  const productData = getProductDataForTracking(size, qty);
                  trackAddToCart(productData);
                  
                  // GA4: Track add_to_cart
                  const pricing = currentPricing.find(p => p.quantity === selectedQuantity);
                  if (pricing) {
                    const ga4Item = createMainProductItem(selectedSize, qty, pricing.price, pricing.originalPrice);
                    trackGA4AddToCart([ga4Item], pricing.price);
                  }
                  
                  // Open unified checkout popup
                  setShowOrderPopup(true);
                }}
                className="text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all duration-300 whitespace-nowrap animate-cta-shimmer hover:-translate-y-px active:translate-y-0"
                style={{ 
                  backgroundColor: isEventPage && eventColors ? eventColors.primary : '#e63946',
                  boxShadow: `0 2px 8px ${isEventPage && eventColors ? eventColors.primary : '#e63946'}40`
                }}
                onMouseEnter={(e) => {
                  const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                  e.currentTarget.style.boxShadow = `0 4px 20px ${color}70`;
                  e.currentTarget.style.filter = 'brightness(0.95)';
                }}
                onMouseLeave={(e) => {
                  const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                  e.currentTarget.style.boxShadow = `0 2px 8px ${color}40`;
                  e.currentTarget.style.filter = 'brightness(1)';
                }}
              >
                {getPageCTA()}
              </button>
            </div>
          </div>
          
          {/* Mobile Layout */}
          <div className="sm:hidden">
            {/* Expanded state - Selection interface */}
            {stickyBarExpanded && (
              <div 
                className="px-4 pt-4 pb-2 border-b"
                style={isEventPage && eventColors ? {
                  backgroundColor: `${eventColors.accent}`,
                  borderColor: `${eventColors.primary}33`
                } : {
                  backgroundColor: 'hsl(var(--secondary) / 0.3)',
                  borderColor: 'var(--border)'
                }}
              >
                {/* Size selector */}
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-2">Size</p>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-150 border relative ${selectedSize !== size.name ? 'active:opacity-80' : ''}`}
                        style={selectedSize === size.name ? {
                          backgroundColor: isEventPage && eventColors ? eventColors.primary : 'var(--foreground)',
                          color: 'white',
                          borderColor: isEventPage && eventColors ? eventColors.primary : 'var(--foreground)'
                        } : (isEventPage && eventColors ? {
                          backgroundColor: eventColors.secondaryLight,
                          color: eventColors.primary,
                          borderColor: `${eventColors.primary}40`
                        } : {
                          backgroundColor: 'var(--card)',
                          color: 'var(--foreground)',
                          borderColor: 'var(--border)'
                        })}
                      >
                        {size.name}
                        <span className="block text-[10px] opacity-70">{size.dimensions}</span>
                        {size.name === 'King' && (
                          <span 
                            className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] px-1.5 py-0.5 rounded-full whitespace-nowrap border-2 border-background"
                            style={isEventPage && eventColors ? {
                              backgroundColor: eventColors.primary,
                              color: 'white'
                            } : {
                              backgroundColor: 'var(--foreground)',
                              color: 'white'
                            }}
                          >
                            Chosen by 81%
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Quantity selector */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Quantity</p>
                  <div className="flex gap-2">
                    {currentPricing.map((option) => (
                      <button
                        key={option.quantity}
                        onClick={() => setSelectedQuantity(option.quantity)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-150 border relative ${selectedQuantity !== option.quantity ? 'active:opacity-80' : ''}`}
                        style={selectedQuantity === option.quantity ? {
                          backgroundColor: isEventPage && eventColors ? eventColors.primary : 'var(--foreground)',
                          color: 'white',
                          borderColor: isEventPage && eventColors ? eventColors.primary : 'var(--foreground)'
                        } : (isEventPage && eventColors ? {
                          backgroundColor: eventColors.secondaryLight,
                          color: eventColors.primary,
                          borderColor: `${eventColors.primary}40`
                        } : {
                          backgroundColor: 'var(--card)',
                          color: 'var(--foreground)',
                          borderColor: 'var(--border)'
                        })}
                      >
                        {option.quantity}{option.quantity === 4 && ' +🎁'}
                        <span className="block text-[10px] opacity-70">${option.price.toFixed(2)}</span>
                        {option.badge && (
                          <span 
                            className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[8px] px-1.5 py-0.5 rounded-full whitespace-nowrap border-2 border-background"
                            style={isEventPage && eventColors ? {
                              backgroundColor: eventColors.primary,
                              color: 'white'
                            } : {
                              backgroundColor: 'var(--foreground)',
                              color: 'white'
                            }}
                          >
                            {option.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Collapsed/Main bar */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                {/* Summary - tappable to expand */}
                <button 
                  onClick={() => setStickyBarExpanded(!stickyBarExpanded)}
                  className="flex items-center gap-2 flex-1 text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">${currentPricing.find(p => p.quantity === selectedQuantity)?.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground line-through">${currentPricing.find(p => p.quantity === selectedQuantity)?.originalPrice.toFixed(2)}</p>
                      <span className="text-[10px] bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-medium">-{currentPricing.find(p => p.quantity === selectedQuantity)?.discount}%</span>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-muted-foreground">
                        {selectedQuantity} × {selectedSize} {selectedQuantity === 4 && '+ 2 Free Pillowcases'}
                      </p>
                      <span className="text-[10px] font-medium text-green-600">
                        Instant saving: ${((currentPricing.find(p => p.quantity === selectedQuantity)?.originalPrice || 0) - (currentPricing.find(p => p.quantity === selectedQuantity)?.price || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform ${stickyBarExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {/* CTA button */}
                <button 
                  onClick={() => {
                    // Track AddToCart event (Meta)
                    const size = selectedSize === 'Standard' ? 'standard' : 'king';
                    const qty = selectedQuantity as 1 | 2 | 4;
                    const productData = getProductDataForTracking(size, qty);
                    trackAddToCart(productData);
                    
                    // GA4: Track add_to_cart
                    const pricing = currentPricing.find(p => p.quantity === selectedQuantity);
                    if (pricing) {
                      const ga4Item = createMainProductItem(selectedSize, qty, pricing.price, pricing.originalPrice);
                      trackGA4AddToCart([ga4Item], pricing.price);
                    }
                    
                    setShowOrderPopup(true);
                  }}
                  className="text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-all duration-300 whitespace-nowrap animate-cta-shimmer hover:-translate-y-px active:translate-y-0"
                  style={{ 
                    backgroundColor: isEventPage && eventColors ? eventColors.primary : '#e63946',
                    boxShadow: `0 2px 8px ${isEventPage && eventColors ? eventColors.primary : '#e63946'}40`
                  }}
                  onMouseEnter={(e) => {
                    const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                    e.currentTarget.style.boxShadow = `0 4px 20px ${color}70`;
                    e.currentTarget.style.filter = 'brightness(0.95)';
                  }}
                  onMouseLeave={(e) => {
                    const color = isEventPage && eventColors ? eventColors.primary : '#e63946';
                    e.currentTarget.style.boxShadow = `0 2px 8px ${color}40`;
                    e.currentTarget.style.filter = 'brightness(1)';
                  }}
                >
                  {getPageCTA(true)}
                </button>
              </div>
            </div>
          </div>
        </div>

      {/* Just Purchased Toast Notification */}
      {showToast && currentToast !== null && (
        <div className={`fixed left-4 z-50 animate-toast-in-out transition-all duration-300 ${showStickyBar ? (stickyBarExpanded ? 'hidden sm:block sm:bottom-20' : 'bottom-20') : 'bottom-4'}`}>
          <div className="bg-card border border-border rounded-lg shadow-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">{purchaseToasts[currentToast].name}</span>
                  <span className="text-[10px]">{purchaseToasts[currentToast].flag}</span>
                  <span className="text-[10px] text-muted-foreground">{purchaseToasts[currentToast].location}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-muted-foreground">Just purchased</span>
                  <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded font-medium">
                    {purchaseToasts[currentToast].quantity} {purchaseToasts[currentToast].size} Pillow{purchaseToasts[currentToast].quantity > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setShowToast(false)}
                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                aria-label="Close notification"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Popup */}
      <OrderPopup
        isOpen={showOrderPopup}
        onClose={() => setShowOrderPopup(false)}
        // Exit recovery disabled - no longer showing unlock 10% popup on close
        selectedSize={selectedSize}
        selectedQuantity={selectedQuantity}
        stockLevel={stockLevel}
        countdown={countdown}
      />

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      {/* FAQ Micro-Modal - Appears when FAQ section is in view, hidden for quiz users */}
      {/* Positioned directly below announcement bar - mobile: ~38px, desktop: ~48px */}
      {showFaqMicroModal && quizTags.length === 0 && (
        <div 
          className="fixed left-0 right-0 z-[55] animate-[slideDown_0.3s_ease-out]"
          style={{ 
            top: typeof window !== 'undefined' 
              ? `${document.querySelector('[data-announcement-bar]')?.getBoundingClientRect().height || 44}px`
              : '44px'
          }}
        >
          <div className="bg-background border-b border-border shadow-sm">
            <div className="container px-4 py-3 flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-sm text-muted-foreground">Not sure if you need a new pillow?</span>
                <button
                  onClick={() => {
                    setIsQuizModalOpen(true);
                    setShowFaqMicroModal(false);
                    setFaqMicroModalDismissed(true);
                  }}
                  className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
                >
                  Find out in 60 seconds →
                </button>
              </div>
              <button
                onClick={() => {
                  setShowFaqMicroModal(false);
                  setFaqMicroModalDismissed(true);
                }}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Exit Recovery Modal */}
      {showExitRecoveryModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowExitRecoveryModal(false)}
          />
          {/* Modal */}
          <div className="relative bg-background rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 animate-[fadeSlideIn_0.3s_ease-out]">
            <button
              onClick={() => setShowExitRecoveryModal(false)}
              className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            {!exitRecoverySubmitted ? (
              <>
                <h3 className="text-xl font-semibold mb-2">Not sure yet?</h3>
                <p className="text-muted-foreground mb-4">
                  Get an extra <span className="font-semibold text-foreground">10% off</span> — only available right now, in exchange for your email.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={exitRecoveryEmail}
                    onChange={(e) => setExitRecoveryEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  />
                  <button
                    onClick={() => {
                      if (exitRecoveryEmail) {
                        // TODO: Save email to backend
                        setExitRecoverySubmitted(true);
                      }
                    }}
                    disabled={!exitRecoveryEmail}
                    className="w-full text-white font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      backgroundColor: isEventPage && eventColors ? eventColors.primary : '#e63946'
                    }}
                  >
                    Unlock 10% Off
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  No spam, just your exclusive discount code.
                </p>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Check your inbox!</h3>
                <p className="text-muted-foreground">
                  Your exclusive 10% discount code is on its way.
                </p>
                <button
                  onClick={() => setShowExitRecoveryModal(false)}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
