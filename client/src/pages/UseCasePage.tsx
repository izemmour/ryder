import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { QuizModal } from '@/components/QuizModal';
import type { LandingPageConfig } from '../config/types';
import FluffLogo from '@/components/FluffLogo';
import { Star, Check, Microscope, Store, Truck, Tag, ChevronUp, ChevronDown, Moon, Thermometer, Shield, MapPin, Clock, Gift, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { ProductGallery, convertConfigToGalleryProps, getGalleryPreset } from '@/components/gallery';
import { CustomerCount } from '@/components/CustomerCount';

/**
 * Comparison Slide Component - Standard vs FluffCo comparison
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
    <div className="w-full h-full flex overflow-hidden">
      {/* Left Side - Standard Pillows */}
      <div className="w-1/2 h-full bg-[#e8e8e3] flex flex-col relative">
        <div className="p-4 lg:p-6 flex flex-col h-full">
          <h3 className="text-lg lg:text-xl font-semibold text-[#1a1a1a] mb-2">Standard Pillows</h3>
          <p className="text-xs lg:text-sm text-muted-foreground mb-4 lg:mb-6">The Nightly Struggle</p>
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
 * Hotel Comparison Slide Component - FluffCo vs luxury hotel brands
 */
function HotelComparisonSlide() {
  const features = [
    { name: "Price", fluff: "$59", fourSeasons: "$200", ritz: "$140", marriott: "$130" },
    { name: "Savings", fluff: null, fourSeasons: "70%", ritz: "58%", marriott: "55%" },
    { name: "Free Trial", fluff: true, fourSeasons: false, ritz: false, marriott: false },
    { name: "Sustainable", fluff: true, fourSeasons: false, ritz: false, marriott: false },
    { name: "Cruelty-Free", fluff: true, fourSeasons: false, ritz: false, marriott: false },
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
      {/* Grid-based comparison table */}
      <div className="flex-1 flex mt-6 lg:mt-8 relative min-w-0">
        {/* Feature labels column */}
        <div className="w-12 lg:w-20 flex flex-col pt-14 lg:pt-20 flex-shrink-0">
          {features.map((feature, idx) => (
            <div key={idx} className="flex-1 flex items-center text-[9px] lg:text-[11px] font-semibold text-white"
              style={{ animation: `fadeSlideIn 0.4s ease-out ${0.5 + idx * 0.1}s both` }}>
              {feature.name}
            </div>
          ))}
        </div>
        {/* FluffCo Column */}
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
        {/* Four Seasons Column */}
        <div className="flex-1 flex flex-col mx-0.5 animate-[fadeSlideIn_0.4s_ease-out_0.2s_both] min-w-0">
          <div className="h-14 lg:h-20 flex items-end justify-center pb-2">
            <img src="/images/four-seasons-logo.svg" alt="Four Seasons" className="h-4 lg:h-8 w-auto object-contain max-w-full" />
          </div>
          {features.map((feature, idx) => (
            <div key={idx} className="flex-1 flex items-center justify-center">
              {feature.fourSeasons === false ? (
                <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#e63946] flex items-center justify-center">
                  <X className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                </div>
              ) : (
                <span className="text-[9px] lg:text-[11px] text-white/70">{feature.fourSeasons}</span>
              )}
            </div>
          ))}
        </div>
        {/* Ritz-Carlton Column */}
        <div className="flex-1 flex flex-col mx-0.5 animate-[fadeSlideIn_0.4s_ease-out_0.3s_both] min-w-0">
          <div className="h-14 lg:h-20 flex items-end justify-center pb-2">
            <img src="/images/ritz-carlton-logo.svg" alt="The Ritz-Carlton" className="h-4 lg:h-8 w-auto object-contain max-w-full" />
          </div>
          {features.map((feature, idx) => (
            <div key={idx} className="flex-1 flex items-center justify-center">
              {feature.ritz === false ? (
                <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#e63946] flex items-center justify-center">
                  <X className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                </div>
              ) : (
                <span className="text-[9px] lg:text-[11px] text-white/70">{feature.ritz}</span>
              )}
            </div>
          ))}
        </div>
        {/* Marriott Column */}
        <div className="flex-1 flex flex-col mx-0.5 animate-[fadeSlideIn_0.4s_ease-out_0.4s_both] min-w-0">
          <div className="h-14 lg:h-20 flex items-end justify-center pb-2">
            <img src="/images/marriott-logo.png" alt="Marriott" className="h-4 lg:h-6 w-auto object-contain brightness-0 invert opacity-70" />
          </div>
          {features.map((feature, idx) => (
            <div key={idx} className="flex-1 flex items-center justify-center">
              {feature.marriott === false ? (
                <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-[#e63946] flex items-center justify-center">
                  <X className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white" />
                </div>
              ) : (
                <span className="text-[9px] lg:text-[11px] text-white/70">{feature.marriott}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Comparison Thumbnail - Mini version with X vs Check icons
 */
function ComparisonThumbnail() {
  return (
    <div className="w-full h-full flex relative">
      <div className="w-1/2 h-full bg-[#e8e8e3] flex items-center justify-center">
        <X className="w-4 h-4 text-[#e63946]" />
      </div>
      <div className="w-1/2 h-full bg-[#2d3a5c] flex items-center justify-center">
        <Check className="w-4 h-4 text-[#22c55e]" />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#f5c542] flex items-center justify-center shadow-sm">
        <span className="text-[5px] font-bold text-[#1a1a1a]">VS</span>
      </div>
    </div>
  );
}

/**
 * Hotel Comparison Thumbnail - Mini table preview
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

interface UseCasePageProps {
  config: LandingPageConfig;
}

// Simple timer calculation - no cookies, resets on each page load
const calculateTimeRemaining = () => {
  const DEFAULT_HOURS = 1;
  const DEFAULT_MINUTES = 27;
  const DEFAULT_SECONDS = 14;
  
  // Calculate end time based on current time + default duration
  const now = Date.now();
  const endTime = now + (DEFAULT_HOURS * 3600 + DEFAULT_MINUTES * 60 + DEFAULT_SECONDS) * 1000;
  
  const diff = endTime - now;
  
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return { hours, minutes, seconds };
};

export default function UseCasePage({ config }: UseCasePageProps) {
  // Dynamic title and meta description
  useEffect(() => {
    const pageTitle = config.name || 'Sleep Solutions';
    const pageDescription = config.hero?.headline || 'Discover the perfect pillow solution for your sleep needs.';
    
    document.title = `${pageTitle} – FluffCo`;
    
    // Add noindex/nofollow for use case pages to prevent SEO indexing
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');
    
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
  
  // Simple countdown timer - starts at 1:27:14 and counts down
  const [countdown, setCountdown] = useState({ hours: 1, minutes: 27, seconds: 14 });
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [savingsQuantity, setSavingsQuantity] = useState<1 | 2 | 4>(4);
  const footerRef = useRef<HTMLElement>(null);

  // Timer logic - simple countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        let { hours, minutes, seconds } = prev;
        
        // Decrement seconds
        seconds--;
        
        // Handle minute rollover
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        
        // Handle hour rollover
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        
        // Stop at zero
        if (hours < 0) {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Sticky header and CTA logic with footer detection
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show header when scrolling up and past 200px
          if (currentScrollY < lastScrollY && currentScrollY > 200) {
            setShowStickyHeader(true);
          } else if (currentScrollY > lastScrollY || currentScrollY <= 200) {
            setShowStickyHeader(false);
          }
          
          // Check if footer is in viewport
          let footerInView = false;
          if (footerRef.current) {
            const footerRect = footerRef.current.getBoundingClientRect();
            footerInView = footerRect.top < window.innerHeight;
          }
          
          // Show sticky CTA when scrolled past hero (800px) and footer not in view
          setShowStickyCTA(currentScrollY > 800 && !footerInView);
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  const redirectToProduct = () => {
    // Use config.redirectUrl if specified, otherwise default to legacy page
    const targetUrl = config.redirectUrl || '/';
    // Add use-case parameter to URL
    const useCaseParam = config.slug; // e.g., 'side-sleeper-pillow'
    const separator = targetUrl.includes('?') ? '&' : '?';
    window.location.href = `${targetUrl}${separator}from=${useCaseParam}`;
  };

  // Show 4 reviews initially, expand to 8 on button click
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Product selector state
  const [selectedSize, setSelectedSize] = useState<"Standard" | "King">("Standard");
  const [selectedQuantity, setSelectedQuantity] = useState(4);
  const [awardIndex, setAwardIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Gallery images for product section - read from config or use defaults
  // This ensures angle pages can customize their gallery while maintaining consistency
  const galleryImages = config.gallery?.images?.map(img => {
    // Handle comparison and hotel-comparison types
    if (img.type === 'comparison') return 'comparison';
    if (img.type === 'hotel-comparison') return 'hotel-comparison';
    return img.src;
  }) || [
    '/images/hero-pillow.png',
    '/images/lifestyle-sleep.png',
    '/images/engineering-detail-new.png',
    'comparison',
    '/images/washing-machine.png',
    '/images/hotel-comfort-packaging.png',
    'hotel-comparison',
  ];
  const [oekoTexExpanded, setOekoTexExpanded] = useState(false);
  const oekoTexRef = useRef<HTMLButtonElement>(null);
  const reviews = config.testimonials?.testimonials || [];
  const displayReviews = showAllReviews ? reviews.slice(0, 8) : reviews.slice(0, 4);

  // Smooth scroll to product section
  const scrollToProduct = () => {
    const productSection = document.getElementById('product');
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Pricing data
  const standardPricing = [
    { quantity: 1, price: 59, originalPrice: 79, savings: 20, discount: 25 },
    { quantity: 2, price: 99, originalPrice: 158, savings: 59, discount: 37, badge: 'Popular' },
    { quantity: 4, price: 149, originalPrice: 316, savings: 167, discount: 53, badge: 'Best Value', bonus: true },
  ];
  const kingPricing = [
    { quantity: 1, price: 69, originalPrice: 89, savings: 20, discount: 22 },
    { quantity: 2, price: 119, originalPrice: 178, savings: 59, discount: 33, badge: 'Popular' },
    { quantity: 4, price: 179, originalPrice: 356, savings: 177, discount: 50, badge: 'Best Value', bonus: true },
  ];
  const currentPricing = selectedSize === 'Standard' ? standardPricing : kingPricing;

  // Size options
  const sizes = [
    { name: 'Standard' as const, dimensions: '20" × 26"', image: '/images/size-standard.png' },
    { name: 'King' as const, dimensions: '20" × 36"', image: '/images/size-king.png', badge: 'Most Popular' },
  ];

  // Awards list for carousel
  const awardsList = [
    { award: 'Best Down Pillow', publication: 'Good Housekeeping' },
    { award: 'Best Soft Pillow', publication: 'Architectural Digest' },
    { award: 'Best Hotel Pillow', publication: 'Travel + Leisure' },
    { award: 'Editor\'s Choice', publication: 'Sleep Foundation' },
  ];

  // Auto-rotate awards
  useEffect(() => {
    const interval = setInterval(() => {
      setAwardIndex(prev => (prev + 1) % awardsList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [awardsList.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* STICKY ANNOUNCEMENT BAR */}
      <div 
        data-announcement-bar
        className="sticky top-0 z-[60] bg-[#1a1a2e] text-white py-1.5 sm:py-2.5 px-3 sm:px-4 text-center text-sm sm:cursor-default cursor-pointer transition-colors pointer-events-auto"
        onClick={(e) => {
          if (window.innerWidth < 640) {
            if (navigator.vibrate) {
              navigator.vibrate(10);
            }
            scrollToProduct();
          }
        }}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <span>{config.announcementBar?.text || "Buy 4 Pillows, Get 4 Pillowcases Free"}</span>
          <div className="flex items-center gap-1 font-mono text-xs bg-white/10 px-2 py-1 rounded">
            <span className="tabular-nums">{formatTime(countdown.hours)}</span>
            <span>:</span>
            <span className="tabular-nums">{formatTime(countdown.minutes)}</span>
            <span>:</span>
            <span className="tabular-nums">{formatTime(countdown.seconds)}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              scrollToProduct();
            }}
            className="hidden sm:block bg-[#e63946] hover:bg-[#d62839] text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors"
          >
            {config.announcementBar?.ctaText || "Claim Now →"}
          </button>
        </div>
      </div>

      {/* DEFAULT HEADER - Always visible at top */}
      <header className="border-b border-border bg-background">
        <div className="container px-4 flex items-center justify-between h-14">
          <FluffLogo className="h-5 w-auto" color="currentColor" />
          <nav className="hidden md:flex items-center gap-6">
            <a href="#problem" className="text-sm text-muted-foreground hover:text-foreground transition-colors">The Problem</a>
            <a href="#science" className="text-sm text-muted-foreground hover:text-foreground transition-colors">The Science</a>
            <a href="#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
            <a href="#product" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Product</a>
            <button
              onClick={scrollToProduct}
              className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Order Now →
            </button>
          </nav>
          <button
            onClick={scrollToProduct}
            className="md:hidden bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Order Now
          </button>
        </div>
      </header>

      {/* STICKY HEADER - Shows on scroll up (desktop only) */}
      <header 
        className={`fixed top-[44px] left-0 right-0 z-50 bg-background border-b border-border hidden md:block transition-transform duration-300 ${showStickyHeader ? 'translate-y-0' : '-translate-y-[calc(100%+44px)]'}`}
        style={{ boxShadow: showStickyHeader ? '0 2px 8px rgba(0,0,0,0.08)' : 'none' }}
      >
        <div className="container px-4 flex items-center justify-between h-14">
          <FluffLogo className="h-5 w-auto" color="currentColor" />
          <nav className="flex items-center gap-6">
            <a href="#problem" className="text-sm text-muted-foreground hover:text-foreground transition-colors">The Problem</a>
            <a href="#science" className="text-sm text-muted-foreground hover:text-foreground transition-colors">The Science</a>
            <a href="#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</a>
            <a href="#product" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Product</a>
            <button
              onClick={scrollToProduct}
              className="bg-foreground text-background px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Order Now →
            </button>
          </nav>
        </div>
      </header>

      {/* ARTICLE-STYLE HERO */}
      <section className="py-12 md:py-16 bg-background" style={{paddingBottom: '0px'}}>
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            {/* Category Tag - Scientific Style with Quiz Link */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground">Sleep Science</span>
              <span className="text-muted-foreground">·</span>
              <button
                onClick={() => setIsQuizModalOpen(true)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1d9bf0]/10 hover:bg-[#1d9bf0]/20 transition-colors"
              >
                <span className="text-xs font-medium text-[#1d9bf0]">Take the Sleep Quiz</span>
                <svg className="w-3 h-3 text-[#1d9bf0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Headline - Reduced size */}
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight mb-4">
              {config.hero.headline}
            </h1>
            
            {/* Subheadline - Reduced size */}
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
              {config.hero.subheadline}
            </p>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 mb-8 pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground"><CustomerCount responsive /> Happy Sleepers</span>
              </div>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">8 min read</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">Updated Jan 2026</span>
            </div>
            
            {/* Hero Image */}
            <div className="relative rounded-xl overflow-hidden mb-10">
              <img
                src="/images/side-sleeper-hero.jpg"
                alt="Side sleeping challenges"
                className="w-full h-auto object-cover"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE CONTENT - Narrative Flow */}
      <article className="pb-12 bg-background">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            {/* Opening Paragraph */}
            <div className="prose max-w-none mb-10">
              <p className="text-base leading-relaxed text-foreground mb-4">
                Every night, millions of side sleepers wake up with the same question: <em>Why does my shoulder hurt so much?</em> The answer isn't complicated, but it's one that most people never discover until they spend a night in a luxury hotel.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                It's not the thread count. It's not the mattress. It's not even the quiet. <strong>It's the pillow.</strong>
              </p>
            </div>

            {/* Stats Infographic */}
            <div id="problem" className="my-12">
              <img
                src="/images/side-sleeper-stats-infographic.jpg"
                alt="Side sleeper statistics"
                className="w-full rounded-xl"
              />
            </div>

            {/* The Problem Section */}
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">The Three Problems Every Side Sleeper Knows</h2>
              <p className="text-base leading-relaxed text-foreground mb-6">
                If you sleep on your side, you know these issues intimately. You probably think they're just part of life. They're not.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. The 3am Shoulder Wake-Up</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    You wake up because your shoulder is screaming. You flip to the other side. An hour later, same thing. Your pillow flattens under your head weight, forcing your shoulder to bear all the pressure. This isn't normal. It's your pillow failing.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">2. The Numb Arm Shake-Out</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    That tingling, dead-arm feeling when you wake up. You shake it out, flex your fingers, wait for the pins and needles to stop. It's not "sleeping funny"—it's poor circulation from your head dropping too low and compressing nerves. Hotels don't let this happen to their guests.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">3. The Morning Neck Stiffness</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    You wake up and can't turn your head properly for the first hour. Your spine spent 8 hours curved unnaturally because your pillow lost its shape. Physical therapists see this every day. It's preventable.
                  </p>
                </div>
              </div>
            </div>

            {/* Hotel Comparison Image */}
            <div className="my-12">
              <img
                src="/images/side-sleeper-hotel-comparison.jpg"
                alt="Home vs hotel sleep comparison"
                className="w-full rounded-xl"
              />
            </div>

            {/* The Mystery Section */}
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">The Hotel Sleep Phenomenon</h2>
              <p className="text-base leading-relaxed text-foreground mb-4">
                Ask any frequent traveler and they'll tell you the same thing: they sleep better in hotels. For years, people attributed this to being on vacation, to the quiet, to the expensive sheets. But research from the Journal of Clinical Sleep Medicine tells a different story.
              </p>
              <p className="text-base leading-relaxed text-foreground mb-4">
                Hotels figured out something decades ago that most people still don't know: <strong>the pillow makes or breaks side sleeper comfort.</strong>
              </p>
              <p className="text-base leading-relaxed text-foreground">
                Your shoulder creates a gap between your head and the mattress—typically 4-6 inches depending on your body type. If your pillow doesn't fill that gap perfectly, your neck bends. Your spine twists. And you wake up with pain.
              </p>
            </div>

            {/* Alignment Diagram */}
            <div id="science" className="my-12">
              <img
                src="/images/side-sleeper-alignment-diagram.jpg"
                alt="Proper vs improper side sleeping alignment"
                className="w-full rounded-xl"
              />
            </div>

            {/* The Science Section */}
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">The Engineering Behind Hotel Pillows</h2>
              <p className="text-base leading-relaxed text-foreground mb-4">
                Four Seasons and Ritz-Carlton don't use expensive pillows because they're luxurious. They use them because <strong>they work.</strong>
              </p>
              <p className="text-base leading-relaxed text-foreground mb-4">
                These pillows are engineered with a specific loft height (5-7 inches) and compression resistance that fills the shoulder gap for side sleepers without collapsing under head weight. The fill density is calibrated to provide consistent support throughout the night, preventing the gradual flattening that causes shoulder pressure.
              </p>
              <p className="text-base leading-relaxed text-foreground">
                The same suppliers who make pillows for luxury hotels also make ours. Same construction. Same materials. Same comfort. Just without the hotel markup.
              </p>
            </div>



            {/* NO MARKUP SECTION - Within Article Width */}
            <div className="my-16 p-8 rounded-xl bg-[#1a1a2e] text-white relative">
              {/* Quiz Mini-Section - Attached/Sliding Effect */}
              <div className="absolute -bottom-12 left-0 right-0 mx-4">
                <button
                  onClick={() => setIsQuizModalOpen(true)}
                  className="w-full text-left bg-gradient-to-r from-[#1d9bf0] to-[#0c7abf] hover:from-[#0c7abf] hover:to-[#1d9bf0] text-white p-4 rounded-lg shadow-lg transition-all hover:shadow-xl group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-semibold">Not sure if this is right for you?</div>
                        <div className="text-xs opacity-90">Take our 2-minute sleep quiz to find your perfect match</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
              <div className="mb-8">
                <div className="text-sm font-medium mb-2 text-[#e63946]">Direct to You</div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                  Premium Quality.<br />Without the Premium Markup.
                </h2>
                <p className="text-white/70 leading-relaxed mb-4 text-sm">
                  Traditional retail adds layers of cost that have nothing to do with quality. Distributors, showroom rent, sales commissions. You pay for all of it. We cut them out.
                </p>
                <p className="text-white/70 leading-relaxed text-sm">
                  By selling directly online, we deliver the same hotel-grade construction at a fraction of the price. No middlemen. No markups. Just a better pillow, shipped straight to your door.
                </p>
              </div>

              {/* Comparison Bar Graphs */}
              <div className="space-y-6 mb-8">
                {/* Retail Price Breakdown */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-white/60">Retail Store Price</span>
                    <span className="text-base font-bold">$119.00</span>
                  </div>
                  <div className="relative">
                    <div className="h-12 bg-white/10 rounded-lg overflow-hidden flex">
                      <div className="h-full bg-red-500/80 flex items-center justify-center text-xs font-medium" style={{ width: '14.7%' }}>
                        <span className="px-1">Mfg</span>
                      </div>
                      <div className="h-full bg-red-400/80 flex items-center justify-center text-xs font-medium" style={{ width: '17.2%' }}>
                        <span className="px-1">Dist</span>
                      </div>
                      <div className="h-full bg-red-300/80 flex items-center justify-center text-xs font-medium text-gray-800" style={{ width: '21%' }}>
                        <span className="px-1">Rent</span>
                      </div>
                      <div className="h-full bg-red-200/80 flex items-center justify-center text-xs font-medium text-gray-800" style={{ width: '13.4%' }}>
                        <span className="px-1">Staff</span>
                      </div>
                      <div className="h-full bg-red-100/80 flex items-center justify-center text-xs font-medium text-gray-800" style={{ width: '33.6%' }}>
                        <span className="px-1">Margin</span>
                      </div>
                    </div>
                    <div className="flex mt-1 text-[10px] text-white/40">
                      <span style={{ width: '14.7%' }}>$17.50</span>
                      <span style={{ width: '17.2%' }}>$20.50</span>
                      <span style={{ width: '21%' }}>$25</span>
                      <span style={{ width: '13.4%' }}>$16</span>
                      <span style={{ width: '33.6%' }}>$40</span>
                    </div>
                  </div>
                </div>

                {/* FluffCo Direct Price */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-green-400">FluffCo Direct Price</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40 line-through">$119.00</span>
                      <span className="text-base font-bold text-green-400">$37.48</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-12 bg-white/10 rounded-lg overflow-hidden flex">
                      <div className="h-full bg-green-500 flex items-center justify-center text-xs font-medium" style={{ width: '24%' }}>
                        <span className="px-1">Mfg</span>
                      </div>
                      <div className="h-full bg-green-400 flex items-center justify-center text-xs font-medium" style={{ width: '12%' }}>
                        <span className="px-1">Ship</span>
                      </div>
                      <div className="h-full bg-green-300 flex items-center justify-center text-xs font-medium text-gray-800" style={{ width: '15%' }}>
                        <span className="px-1">Us</span>
                      </div>
                    </div>
                    <div className="flex mt-1 text-[10px] text-white/40">
                      <span style={{ width: '24%' }}>$17.50</span>
                      <span style={{ width: '12%' }}>$8.50</span>
                      <span style={{ width: '15%' }}>$11.48</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="rounded-xl p-4 bg-green-500/20 border border-green-500/30">
                <div className="flex flex-col items-center gap-2 mb-3">
                  <span className="text-xs text-white/60">Savings per deal:</span>
                  <div className="flex bg-white/10 rounded-full p-0.5">
                    {([1, 2, 4] as const).map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setSavingsQuantity(qty)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all ${
                          savingsQuantity === qty
                            ? 'bg-green-500 text-white'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        {qty} Pillow{qty > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs mb-1 text-green-400">Total Savings vs. Retail</div>
                  <div className="text-3xl font-bold text-white mb-2">
                    ${savingsQuantity === 1 ? '59.10' : savingsQuantity === 2 ? '139.10' : '326.10'}
                  </div>
                  <div className="text-xs text-white/60">
                    {savingsQuantity === 1 && 'You pay $59.90 instead of $119.00'}
                    {savingsQuantity === 2 && 'You pay $98.90 instead of $238.00'}
                    {savingsQuantity === 4 && 'You pay $149.90 instead of $476.00'}
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-500/20">
                    <div className="text-[10px] text-white/40 mb-1">Price per pillow</div>
                    <div className="text-xl font-bold text-green-400">
                      ${savingsQuantity === 1 ? '59.90' : savingsQuantity === 2 ? '49.45' : '37.48'}
                      <span className="text-xs font-normal text-white/60">/pillow</span>
                    </div>
                    <div className="text-[10px] text-white/40 mt-1">vs. $119.00 retail average</div>
                  </div>
                </div>
              </div>

              {/* Icons */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#e63946]" />
                  <span>No retail markup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#e63946]" />
                  <span>Free shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#e63946]" />
                  <span>Factory direct</span>
                </div>
              </div>
            </div>


          </div>
        </div>
      </article>

      {/* PRODUCT HERO SECTION - Full product form */}
      <section id="product" className="py-12 md:py-16 bg-secondary/30">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* LEFT: Product Gallery with badges */}
            <div className="relative space-y-2 md:space-y-4">
              {/* 100 Nights Trial Badge - Corner positioned */}
              <div className={`absolute top-2 right-2 md:-top-6 md:-right-6 z-30 animate-[fadeSlideIn_0.4s_ease-out_0.15s_both] ${activeImageIndex !== 0 ? 'hidden md:block' : ''}`}>
                <div className="relative">
                  <svg viewBox="0 0 80 80" className="w-16 h-16 lg:w-20 lg:h-20 drop-shadow-md">
                    <path d="M40 2 L44 8 L52 6 L54 14 L62 14 L62 22 L70 24 L68 32 L76 38 L70 44 L74 52 L66 54 L66 62 L58 62 L54 70 L46 68 L40 76 L34 68 L26 70 L22 62 L14 62 L14 54 L6 52 L10 44 L4 38 L12 32 L10 24 L18 22 L18 14 L26 14 L28 6 L36 8 Z" fill="#f5f5f0" stroke="#e0ddd5" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl lg:text-2xl font-bold leading-none text-[#2d3a5c]">100</span>
                    <span className="text-[8px] lg:text-[10px] font-medium leading-tight text-[#2d3a5c]">Night</span>
                    <span className="text-[8px] lg:text-[10px] font-medium leading-tight text-[#2d3a5c]">Better</span>
                  </div>
                </div>
              </div>
              <div className="aspect-square bg-secondary rounded-none md:rounded-lg overflow-hidden relative">
                {/* Skeleton loading state */}
                {!imageLoaded && galleryImages[activeImageIndex] !== 'comparison' && galleryImages[activeImageIndex] !== 'hotel-comparison' && (
                  <div className="absolute inset-0 bg-secondary animate-pulse">
                    <div className="w-full h-full bg-gradient-to-r from-secondary via-muted to-secondary bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
                  </div>
                )}
                {/* Render comparison components or regular images */}
                {galleryImages[activeImageIndex] === 'comparison' ? (
                  <ComparisonSlide />
                ) : galleryImages[activeImageIndex] === 'hotel-comparison' ? (
                  <HotelComparisonSlide />
                ) : (
                  <img 
                    src={galleryImages[activeImageIndex]} 
                    alt="FluffCo Pillow" 
                    className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                )}
                {/* First Image Badges - Oprah Daily + Award Carousel */}
                {activeImageIndex === 0 && imageLoaded && (
                  <>
                    {/* Oprah Daily Badge - Top Left */}
                    <div className="absolute top-4 left-4 animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <div className="relative">
                        <svg viewBox="0 0 100 100" className="w-19 h-19 lg:w-24 lg:h-24" style={{ width: '76px', height: '76px' }}>
                          <circle cx="50" cy="50" r="48" fill="none" stroke="#c9a962" strokeWidth="2"/>
                          <circle cx="50" cy="50" r="44" fill="white"/>
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#2d3a5c" strokeWidth="1"/>
                          <defs>
                            <path id="circleTextPathUseCase" d="M 50,50 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" fill="none"/>
                          </defs>
                          <text fill="#2d3a5c" fontSize="6.5" fontWeight="700" letterSpacing="3.5" fontFamily="sans-serif">
                            <textPath href="#circleTextPathUseCase" startOffset="0%">SLEEP O-WARDS - SLEEP O-WARDS -</textPath>
                          </text>
                          <text x="50" y="46" textAnchor="middle" fill="#2d3a5c" fontSize="12" fontWeight="300" fontStyle="italic" fontFamily="Georgia, serif">Oprah</text>
                          <text x="50" y="60" textAnchor="middle" fill="#2d3a5c" fontSize="12" fontWeight="300" fontStyle="italic" fontFamily="Georgia, serif">Daily</text>
                          <rect x="38" y="68" width="24" height="10" rx="2" fill="#c9a962"/>
                          <text x="50" y="76" textAnchor="middle" fill="white" fontSize="6" fontWeight="700">2024</text>
                        </svg>
                      </div>
                    </div>
                    {/* Award Carousel Badge - Bottom Center */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-[fadeSlideIn_0.4s_ease-out_0.2s_both]">
                      <div className="bg-white/95 backdrop-blur-sm rounded-md px-2 py-1 lg:px-2.5 lg:py-1.5 shadow-md flex items-center gap-1.5">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setAwardIndex(prev => prev === 0 ? awardsList.length - 1 : prev - 1); }}
                          className="p-0.5 hover:bg-gray-100 rounded transition-colors"
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
                        >
                          <ChevronRight className="w-3 h-3 text-gray-800" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
                {/* Lifestyle Sleep Overlay Badges */}
                {galleryImages[activeImageIndex] === '/images/lifestyle-sleep.png' && imageLoaded && (
                  <>
                    <div className="absolute top-3 left-3 lg:top-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">1</span>
                        <span className="text-[11px] lg:text-sm font-bold">Elevate Your Sleep</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Same 5-star quality as luxury resorts</p>
                    </div>
                    <div className="absolute top-1/3 right-3 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.25s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">2</span>
                        <span className="text-[11px] lg:text-sm font-bold">Custom Support</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Pillow-in-pillow design for cloud comfort</p>
                    </div>
                    <div className="absolute bottom-3 left-3 lg:bottom-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.4s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">3</span>
                        <span className="text-[11px] lg:text-sm font-bold">Wake Refreshed</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Clear-eyed, pain free, ready for the day</p>
                    </div>
                  </>
                )}
                {/* Engineering Detail Overlay Badges */}
                {galleryImages[activeImageIndex] === '/images/engineering-detail-new.png' && imageLoaded && (
                  <>
                    <div className="absolute top-3 right-3 lg:top-6 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">1</span>
                        <span className="text-[11px] lg:text-sm font-bold">Cotton Shell</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">100% breathable cotton exterior</p>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-3 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.25s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">2</span>
                        <span className="text-[11px] lg:text-sm font-bold">Microfiber Fill</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">5x thinner than human hair for plush feel</p>
                    </div>
                    <div className="absolute bottom-3 right-3 lg:bottom-6 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.4s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">3</span>
                        <span className="text-[11px] lg:text-sm font-bold">Structural Core</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Sanforized for lasting shape retention</p>
                    </div>
                  </>
                )}
                {/* Washing Machine Overlay Badges */}
                {galleryImages[activeImageIndex] === '/images/washing-machine.png' && imageLoaded && (
                  <>
                    <div className="absolute top-3 left-3 lg:top-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.1s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">1</span>
                        <span className="text-[11px] lg:text-sm font-bold">Machine Washable</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Toss it in, comes out perfect</p>
                    </div>
                    <div className="absolute top-1/3 right-3 lg:right-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.25s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">2</span>
                        <span className="text-[11px] lg:text-sm font-bold">Shape Retention</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Maintains loft after every wash</p>
                    </div>
                    <div className="absolute bottom-3 left-3 lg:bottom-6 lg:left-6 bg-white/95 backdrop-blur-sm text-[#2d3a5c] px-2.5 py-2 lg:px-4 lg:py-3 rounded-lg lg:rounded-xl shadow-lg max-w-[140px] lg:max-w-[180px] animate-[fadeSlideIn_0.4s_ease-out_0.4s_both]">
                      <div className="flex items-center gap-1.5 lg:gap-2 mb-1 lg:mb-1.5">
                        <span className="w-5 h-5 lg:w-6 lg:h-6 bg-[#2d3a5c] text-white rounded-full text-[11px] lg:text-sm flex items-center justify-center font-semibold">3</span>
                        <span className="text-[11px] lg:text-sm font-bold">Practical Hygiene</span>
                      </div>
                      <p className="text-[10px] lg:text-xs text-gray-600 leading-snug">Clean sleep without compromise</p>
                    </div>
                  </>
                )}
                {/* Hotel Comfort Packaging Overlay */}
                {galleryImages[activeImageIndex] === '/images/hotel-comfort-packaging.png' && imageLoaded && (
                  <>
                    <div className="absolute top-4 left-0 right-0 text-center animate-[fadeSlideIn_0.3s_ease-out_0.1s_both]">
                      <h3 className="text-lg lg:text-2xl font-bold text-[#2d3a5c] tracking-tight">5-Star Hotel Comfort at Home</h3>
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
                  </>
                )}
              </div>
              {/* Thumbnail Gallery */}
              <div className="relative -mx-0 lg:mx-0">
                <div 
                  className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 md:px-0"
                >
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setActiveImageIndex(idx); setImageLoaded(false); }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
                      }`}
                    >
                      <div className="w-full h-full relative">
                        {/* Render comparison thumbnails or regular images */}
                        {img === 'comparison' ? (
                          <ComparisonThumbnail />
                        ) : img === 'hotel-comparison' ? (
                          <HotelComparisonThumbnail />
                        ) : (
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        )}
                        {/* Tag indicators */}
                        {idx === 0 && (
                          <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                            <span className="text-[7px] font-semibold text-[#2d3a5c]">5-star</span>
                          </div>
                        )}
                        {img.includes('lifestyle-sleep') && (
                          <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                            <span className="text-[7px] font-semibold text-[#2d3a5c]">why</span>
                          </div>
                        )}
                        {img.includes('engineering-detail') && (
                          <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                            <span className="text-[7px] font-semibold text-[#2d3a5c]">3 layers</span>
                          </div>
                        )}
                        {img.includes('washing-machine') && (
                          <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                            <span className="text-[7px] font-semibold text-[#2d3a5c]">care</span>
                          </div>
                        )}
                        {img.includes('hotel-comfort-packaging') && (
                          <div className="absolute bottom-0 right-0 bg-white/90 rounded-tl-lg px-1.5 py-1">
                            <span className="text-[7px] font-semibold text-[#2d3a5c]">hotel</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Product Info & Selectors */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <span className="text-sm font-semibold"><CustomerCount responsive /> Happy Sleepers</span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold tracking-tight leading-tight">
                  {config.hero?.headline || 'The Same Pillows Used in 5-Star Hotels'}
                </h2>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {config.hero?.subheadline || 'Sleep like you\'re on vacation every night with hotel-quality comfort at a fraction of the price.'}
                </p>
              </div>

              {/* USPs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Perfect Support</div>
                    <div className="text-xs text-muted-foreground">Maintains shape all night</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Always Cool</div>
                    <div className="text-xs text-muted-foreground">Breathable materials</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Hypoallergenic</div>
                    <div className="text-xs text-muted-foreground">Safe for sensitive skin</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Made in USA</div>
                    <div className="text-xs text-muted-foreground">Premium materials only</div>
                  </div>
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Select Size</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {sizes.map((size) => (
                    <div key={size.name} className="relative pt-3">
                      {size.badge && (
                        <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap z-20 bg-foreground text-background">
                          {size.badge}
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedSize(size.name)}
                        className={`w-full rounded-xl border-2 transition-all duration-200 overflow-hidden hover:scale-[1.02] hover:shadow-lg ${
                          selectedSize === size.name
                            ? 'shadow-md border-[#e63946] bg-[rgba(230,57,70,0.05)]'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="aspect-[16/5] overflow-hidden bg-[#f5f5e8]">
                          <img 
                            src={size.image} 
                            alt={size.name} 
                            className="w-full h-full object-cover"
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

              {/* Quantity Selector */}
              <div>
                <div className="text-sm font-medium mb-3">Select Quantity</div>
                <div className="space-y-3">
                  {currentPricing.map((option) => (
                    <div 
                      key={option.quantity} 
                      className={`group transition-all duration-200 ${option.bonus ? 'hover:scale-[1.01] hover:shadow-md rounded-xl' : ''}`}
                    >
                      <button
                        onClick={() => setSelectedQuantity(option.quantity)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 relative ${
                          !option.bonus ? 'hover:scale-[1.01] hover:shadow-md' : ''
                        } ${
                          option.bonus ? 'rounded-b-none border-b' : ''
                        } ${
                          selectedQuantity === option.quantity
                            ? 'shadow-sm border-[#e63946] bg-[rgba(230,57,70,0.05)]'
                            : 'border-border group-hover:border-muted-foreground'
                        }`}
                      >
                        {option.badge && (
                          <span className={`absolute -top-2.5 right-4 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            option.badge === 'Best Value' ? 'bg-[#e63946] text-white' : 'bg-foreground text-background'
                          }`}>
                            {option.badge}
                          </span>
                        )}
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
                      
                      {/* Pillowcase Bonus */}
                      {option.bonus && (
                        <button
                          onClick={() => setSelectedQuantity(option.quantity)}
                          className={`w-full px-4 py-2 rounded-b-xl border-2 border-t-0 transition-all duration-200 flex items-center justify-between cursor-pointer ${
                            selectedQuantity === option.quantity
                              ? 'border-[#e63946] bg-[rgba(230,57,70,0.05)]'
                              : 'border-border bg-secondary/20 group-hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <Gift className={`w-3.5 h-3.5 ${
                              selectedQuantity === option.quantity ? 'text-[#e63946]' : 'text-muted-foreground'
                            }`} />
                            <span className={`text-xs ${
                              selectedQuantity === option.quantity ? 'text-[#e63946] font-medium' : 'text-muted-foreground'
                            }`}>+ 4 Free Pillowcases</span>
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

              {/* CTA Button */}
              <button 
                onClick={() => {
                  // Navigate to checkout or show order popup
                  const targetUrl = config.redirectUrl || '/';
                  const useCaseParam = config.slug;
                  const separator = targetUrl.includes('?') ? '&' : '?';
                  window.location.href = `${targetUrl}${separator}from=${useCaseParam}&size=${selectedSize.toLowerCase()}&qty=${selectedQuantity}`;
                }}
                className="w-full text-white font-semibold py-4 rounded-full text-lg transition-all duration-300 hover:-translate-y-px active:translate-y-0"
                style={{ 
                  backgroundColor: '#e63946',
                  boxShadow: '0 2px 8px rgba(230, 57, 70, 0.4)'
                }}
              >
                Order Now & Save {currentPricing.find(p => p.quantity === selectedQuantity)?.discount}%
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>100-Night Trial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span>Best Price</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - Matching Home 1:1 */}
      <section id="reviews" className="py-16 bg-background">
        <div className="container px-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-[#f59e0b] text-[#f59e0b]" />
              ))}
            </div>
            <span className="font-semibold text-lg">{config.testimonials?.sectionTitle || 'Side Sleepers Love It'}</span>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-center mb-4">{config.testimonials?.sectionSubtitle || 'Real Stories from Real Sleepers'}</h2>
          <p className="text-center text-muted-foreground mb-12">Join the community who finally found their pillow</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayReviews.map((review: any, idx: number) => (
              <div key={idx} className="bg-card p-5 rounded-xl border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary">
                    {review.image ? (
                      <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-semibold text-sm">
                        {review.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">{review.name}</span>
                      {review.verified !== false && (
                        <span className="flex items-center gap-1">
                          <span className="w-3.5 h-3.5 rounded-full bg-[#1d9bf0] flex items-center justify-center flex-shrink-0">
                            <Check className="w-2 h-2 text-white stroke-[3]" />
                          </span>
                          <span className="text-[10px] text-[#1d9bf0] font-medium">Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{review.location}</div>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed">"{review.content}"</p>
              </div>
            ))}
          </div>

          {/* View More Reviews Button */}
          {!showAllReviews && reviews.length > 4 && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAllReviews(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary transition-colors"
              >
                See More Testimonials
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ SECTION - Accordion Design with Different Background */}
      {config.faq && config.faq.items && config.faq.items.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">
                {config.faq.sectionTitle || 'Common Questions'}
              </h2>
              
              <div className="space-y-3">
                {config.faq.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-background rounded-xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                    >
                      <h3 className="text-base font-semibold pr-4">{item.question}</h3>
                      {expandedFaq === idx ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === idx && (
                      <div className="px-6 pb-5 animate-[fadeIn_0.2s_ease-out]">
                        <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quiz Modal */}
      <QuizModal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} />

      {/* FOOTER */}
      <footer ref={footerRef} className="py-10 border-t border-border">
        <div className="container px-4 text-center">
          <FluffLogo className="h-5 w-auto mx-auto mb-3" color="currentColor" />
          <p className="text-xs text-muted-foreground mb-3">Consistent support. Night after night.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-3">
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

      {/* STICKY CTA BAR - "Ready to Sleep" Section */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white border-t border-white/10 shadow-2xl transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="container px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 max-w-4xl mx-auto">
            <div className="text-center md:text-left">
              <div className="text-base font-semibold mb-0.5">Ready to Sleep Like You're on Vacation?</div>
              <div className="text-xs text-white/70">Join <CustomerCount responsive /> side sleepers who found their perfect pillow</div>
            </div>
            <button
              onClick={scrollToProduct}
              className="bg-[#e63946] hover:bg-[#d62839] text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap shadow-lg"
            >
              Shop Now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
