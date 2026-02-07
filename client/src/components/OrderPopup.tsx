/**
 * ORDER POPUP COMPONENT - SMART UPSELL SYSTEM
 * 
 * Full-screen, two-step popup flow with psychological triggers:
 * - Step 1: Warehouse stock verification animation
 * - Step 2: Order summary with inline "Searching for Deals" animation in upsell section + 15-min timer
 * 
 * Upsell Logic:
 * - Qty 1: Silk Eyemask ($24 special - 51% off) - perfect solo sleeper add-on
 * - Qty 2: Hotel Pillowcase Set ($19 special - 51% off) - one for each pillow
 * - Qty 4: 4× Silk Pillowcase ($119 Standard / $139 King - 62% off) - one for each pillow
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { 
  X, Check, ChevronDown, ChevronUp, Gift, Shield, Truck, 
  MapPin, Clock, Package, Sparkles, Search, Zap, Star, Info, Lock
} from "lucide-react";
import { generateCheckoutUrl, type UpsellType } from "@/lib/shopifyCheckout";
import { StockInventoryBar } from "@/components/StockInventoryBar";
import { ShippingMessage } from "@/components/ShippingMessage";
import { useGeolocation, isUSVisitor, getShippingCost, useNonUsBadgeText } from "@/hooks/useGeolocation";
import { 
  trackViewPromotion, 
  trackSelectPromotion, 
  trackAddToCart as trackGA4AddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  createUpsellItem,
  createUpsellPromotion,
  createMainProductItem,
  GA4_PRODUCT_IDS
} from "@/lib/ga4-tracking";

interface OrderPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onExitRecovery?: () => void; // Called when user closes checkout without completing
  selectedSize: "Standard" | "King";
  selectedQuantity: number;
  stockLevel: number;
  countdown: { hours: number; minutes: number; seconds: number };

}

interface Warehouse {
  id: string;
  name: string;
  location: string;
  status: "checking" | "unavailable" | "available";
}

interface UserLocation {
  city: string | null;
  country: string | null;
  countryCode: string | null;
  state: string | null;
}

interface SmartUpsell {
  id: string;
  name: string;
  headline: string;
  description: string;
  whyItMakesSense: string[];
  price: number;
  originalPrice: number;
  savings: number;
  savingsPercent: number;
  image: string;
  badge?: string;
  limitedQty?: number;
}

// Base warehouses - the last one will be dynamically set based on user location
const baseWarehouses: Omit<Warehouse, 'status'>[] = [
  { id: "nj", name: "New Jersey DC", location: "Newark, NJ" },
  { id: "tx", name: "Texas Fulfillment", location: "Dallas, TX" },
];

// Location to warehouse mapping
const locationWarehouseMap: Record<string, { name: string; location: string }> = {
  "America/New_York": { name: "Northeast Distribution", location: "New York, NY" },
  "America/Chicago": { name: "Midwest Fulfillment", location: "Chicago, IL" },
  "America/Denver": { name: "Mountain Region DC", location: "Denver, CO" },
  "America/Los_Angeles": { name: "West Coast Hub", location: "Los Angeles, CA" },
  "America/Phoenix": { name: "Southwest Center", location: "Phoenix, AZ" },
  "America/Toronto": { name: "Canada Distribution", location: "Toronto, ON" },
  "America/Vancouver": { name: "Pacific Northwest DC", location: "Vancouver, BC" },
  "Europe/London": { name: "UK Fulfillment", location: "London, UK" },
  "Europe/Paris": { name: "EU Distribution", location: "Paris, FR" },
  "Europe/Berlin": { name: "Central EU Hub", location: "Berlin, DE" },
  "Australia/Sydney": { name: "Australia Center", location: "Sydney, AU" },
};

// Pricing data (same as Home.tsx)
const standardPricing = [
  { quantity: 1, price: 59.90, originalPrice: 115.00, savings: 55.10, discount: 48 },
  { quantity: 2, price: 98.90, originalPrice: 222.00, savings: 123.10, discount: 55 },
  { quantity: 4, price: 149.90, originalPrice: 444.00, savings: 294.10, discount: 66 }
];

const kingPricing = [
  { quantity: 1, price: 69.90, originalPrice: 125.00, savings: 55.10, discount: 44 },
  { quantity: 2, price: 119.90, originalPrice: 250.00, savings: 130.10, discount: 52 },
  { quantity: 4, price: 189.90, originalPrice: 500.00, savings: 310.10, discount: 62 }
];

// Country flag mapping
const countryFlags: Record<string, string> = {
  US: "🇺🇸", CA: "🇨🇦", GB: "🇬🇧", UK: "🇬🇧", AU: "🇦🇺", DE: "🇩🇪", FR: "🇫🇷",
  IT: "🇮🇹", ES: "🇪🇸", NL: "🇳🇱", BE: "🇧🇪", SE: "🇸🇪", NO: "🇳🇴", DK: "🇩🇰",
  FI: "🇫🇮", AT: "🇦🇹", CH: "🇨🇭", IE: "🇮🇪", NZ: "🇳🇿", JP: "🇯🇵", KR: "🇰🇷",
  SG: "🇸🇬", HK: "🇭🇰", MX: "🇲🇽", BR: "🇧🇷", AR: "🇦🇷", CL: "🇨🇱", CO: "🇨🇴",
};

// Timezone to location mapping
const timezoneMap: Record<string, { city: string; country: string; countryCode: string; state: string }> = {
  "America/New_York": { city: "New York", country: "United States", countryCode: "US", state: "NY" },
  "America/Chicago": { city: "Chicago", country: "United States", countryCode: "US", state: "IL" },
  "America/Denver": { city: "Denver", country: "United States", countryCode: "US", state: "CO" },
  "America/Los_Angeles": { city: "Los Angeles", country: "United States", countryCode: "US", state: "CA" },
  "America/Phoenix": { city: "Phoenix", country: "United States", countryCode: "US", state: "AZ" },
  "America/Toronto": { city: "Toronto", country: "Canada", countryCode: "CA", state: "ON" },
  "America/Vancouver": { city: "Vancouver", country: "Canada", countryCode: "CA", state: "BC" },
  "Europe/London": { city: "London", country: "United Kingdom", countryCode: "GB", state: "" },
  "Europe/Paris": { city: "Paris", country: "France", countryCode: "FR", state: "" },
  "Europe/Berlin": { city: "Berlin", country: "Germany", countryCode: "DE", state: "" },
  "Australia/Sydney": { city: "Sydney", country: "Australia", countryCode: "AU", state: "NSW" },
};

// Deal search messages for inline animation
const dealSearchMessages = [
  { text: "Analyzing your order...", icon: Search },
  { text: "Checking bundle combinations...", icon: Package },
  { text: "Finding exclusive discounts...", icon: Zap },
  { text: "Deal found!", icon: Gift },
];

// Upsell 1: Extra pillow (same size) at $39 fixed price
const getFirstUpsell = (size: "Standard" | "King"): SmartUpsell => {
  // Updated pricing: Standard $39.90, King $49.90 (with discount code RRDF2F8NZ39Q)
  const price = size === "King" ? 49.90 : 39.90;
  const originalPrice = size === "King" ? 125.00 : 115.00;
  const savings = originalPrice - price;
  const savingsPercent = Math.round((savings / originalPrice) * 100);
  
  return {
    id: "extra-pillow",
    name: `FluffCo ${size} Pillow`,
    headline: "Add Another Pillow at a Special Price",
    description: `Get an extra ${size} pillow at our exclusive bundle price. Same hotel-quality comfort.`,
    whyItMakesSense: [
      "Perfect for guest rooms or as a backup",
      "Same premium quality at a fraction of the price",
      "Never run out of fresh, supportive pillows",
      "Exclusive bundle-only pricing"
    ],
    price,
    originalPrice,
    savings,
    savingsPercent,
    image: size === "King" ? "/images/optimized/products/pillow-king-new.png" : "/images/optimized/products/pillow-standard-final.png",
    badge: "BUNDLE SPECIAL",
    limitedQty: 15
  };
};

// Upsell 2: Pillow Cases 2-pack with size-specific pricing
const getSecondUpsell = (size: "Standard" | "King"): SmartUpsell => {
  // Updated pricing with discount code Y7QCKQF68C27:
  // Standard: $19 (was $39), King: $29 (was $49)
  const price = size === "Standard" ? 19.00 : 29.00;
  const originalPrice = size === "Standard" ? 39.00 : 49.00;
  const savings = originalPrice - price;
  const discountPercent = Math.round((savings / originalPrice) * 100);
  
  return {
    id: "pillowcase-2pack",
    name: "Pillow Cases 2-Pack",
    headline: "Complete Your Sleep Setup",
    description: "Set of 2 premium hotel-quality pillowcases. 400 thread count Egyptian cotton.",
    whyItMakesSense: [
      "Protect your investment & extend pillow life",
      "Same luxurious cotton used by 5-star hotels",
      "Hypoallergenic and machine washable",
      "75% off - today only with your order"
    ],
    price,
    originalPrice,
    savings,
    savingsPercent: discountPercent,
    image: "/images/optimized/upsell/upsell-pillowcase-set.png",
    badge: "PREMIUM PILLOWCASES",
    limitedQty: 12
  };
};

// Legacy function for compatibility - returns first upsell
const getSmartUpsell = (quantity: number, size: "Standard" | "King"): SmartUpsell => {
  return getFirstUpsell(size);
};

export default function OrderPopup({ 
  isOpen, 
  onClose,
  onExitRecovery,
  selectedSize, 
  selectedQuantity,
  stockLevel,
  countdown,
}: OrderPopupProps) {
  
  const [step, setStep] = useState<1 | 2>(1);
  const [warehouseStatuses, setWarehouseStatuses] = useState<Record<string, "checking" | "unavailable" | "available">>({});
  const [foundWarehouse, setFoundWarehouse] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation>({ city: null, country: null, countryCode: null, state: null });
  const [selectedUpsell, setSelectedUpsell] = useState<boolean>(false); // First upsell: extra pillow
  const [selectedSecondUpsell, setSelectedSecondUpsell] = useState<boolean>(false); // Second upsell: pillowcase pack
  const [firstUpsellCollapsed, setFirstUpsellCollapsed] = useState<boolean>(false); // Collapse animation state for first upsell
  const [secondUpsellCollapsed, setSecondUpsellCollapsed] = useState<boolean>(false); // Collapse animation state for second upsell
  const [showSecondUpsell, setShowSecondUpsell] = useState<boolean>(false); // Controls second upsell visibility (stays true once shown)
  const [secondUpsellRevealing, setSecondUpsellRevealing] = useState<boolean>(false); // Animation state for second upsell reveal
  const [shippingInsurance, setShippingInsurance] = useState<boolean>(true); // Pre-checked by default
  const [expandedDetails, setExpandedDetails] = useState<boolean>(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [warehouses, setWarehouses] = useState<Omit<Warehouse, 'status'>[]>([]);
  
  // Inline deal search state
  const [dealSearchActive, setDealSearchActive] = useState(true);
  const [dealSearchIndex, setDealSearchIndex] = useState(0);
  const [dealSearchComplete, setDealSearchComplete] = useState(false);
  
  const [dealTimer, setDealTimer] = useState({ minutes: 15, seconds: 0 });
  
  // Viewing and purchased today state (matching product form)
  const [viewerCount, setViewerCount] = useState(46);
  const [displayedViewerCount, setDisplayedViewerCount] = useState(46);
  const [isViewerCountAnimating, setIsViewerCountAnimating] = useState(false);
  const [purchasedToday, setPurchasedToday] = useState(50);
  const [displayedPurchasedToday, setDisplayedPurchasedToday] = useState(50);
  const [isPurchasedAnimating, setIsPurchasedAnimating] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isFirstUpsellAnimating, setIsFirstUpsellAnimating] = useState(false); // Lock to prevent double-click
  const [isSecondUpsellAnimating, setIsSecondUpsellAnimating] = useState(false); // Lock to prevent double-click
  
  const scrollPositionRef = useRef(0);
  const modalRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Get pricing based on size
  const getPricing = (size: "Standard" | "King") => size === "Standard" ? standardPricing : kingPricing;
  const currentPricing = getPricing(selectedSize);
  const selectedPricing = currentPricing.find(p => p.quantity === selectedQuantity) || currentPricing[0];

  // Get both upsells
  const firstUpsell = getFirstUpsell(selectedSize);
  const secondUpsell = getSecondUpsell(selectedSize);
  const smartUpsell = firstUpsell; // For backward compatibility
  
  // Geo-detection for shipping cost
  const { countryCode } = useGeolocation();
  const isUS = countryCode ? isUSVisitor(countryCode) : true; // Default to US if unknown
  const nonUsBadgeText = useNonUsBadgeText(); // Configurable badge for non-US visitors
  
  // Calculate total items for shipping (pillows + upsell items)
  const totalItemsForShipping = selectedQuantity + (selectedUpsell ? 1 : 0) + (selectedSecondUpsell ? 2 : 0);
  const shippingCost = countryCode ? getShippingCost(countryCode, totalItemsForShipping) : 0;
  const insuranceCost = shippingInsurance ? 5.00 : 0;

  // Calculate total with both upsells
  const firstUpsellPrice = selectedUpsell ? firstUpsell.price : 0;
  const secondUpsellPrice = selectedSecondUpsell ? secondUpsell.price : 0;
  const subtotalPrice = selectedPricing.price + firstUpsellPrice + secondUpsellPrice;
  const totalPrice = subtotalPrice + shippingCost + insuranceCost;
  const totalOriginalPrice = selectedPricing.originalPrice + (selectedUpsell ? firstUpsell.originalPrice : 0) + (selectedSecondUpsell ? secondUpsell.originalPrice : 0);
  const totalSavings = selectedPricing.savings + (selectedUpsell ? firstUpsell.savings : 0) + (selectedSecondUpsell ? secondUpsell.savings : 0);
  
  // GA4 Tracking Helper Functions
  const trackUpsell1Add = useCallback(() => {
    const upsell1Item = createUpsellItem(
      GA4_PRODUCT_IDS.upsells['standard-pillow'],
      firstUpsell.name,
      firstUpsell.price,
      firstUpsell.originalPrice
    );
    const promotion1 = createUpsellPromotion('upsell_pillow', firstUpsell.headline, upsell1Item, 'upsell_1');
    trackSelectPromotion(promotion1);
    trackGA4AddToCart([upsell1Item], firstUpsell.price);
  }, [firstUpsell]);
  
  const trackUpsell1Remove = useCallback(() => {
    const upsell1Item = createUpsellItem(
      GA4_PRODUCT_IDS.upsells['standard-pillow'],
      firstUpsell.name,
      firstUpsell.price,
      firstUpsell.originalPrice
    );
    trackRemoveFromCart([upsell1Item], firstUpsell.price);
  }, [firstUpsell]);
  
  const trackUpsell2Add = useCallback(() => {
    const upsell2Item = createUpsellItem(
      GA4_PRODUCT_IDS.upsells['pillowcases'],
      secondUpsell.name,
      secondUpsell.price,
      secondUpsell.originalPrice
    );
    const promotion2 = createUpsellPromotion('upsell_pillowcases', secondUpsell.headline, upsell2Item, 'upsell_2');
    trackSelectPromotion(promotion2);
    trackGA4AddToCart([upsell2Item], secondUpsell.price);
  }, [secondUpsell]);
  
  const trackUpsell2Remove = useCallback(() => {
    const upsell2Item = createUpsellItem(
      GA4_PRODUCT_IDS.upsells['pillowcases'],
      secondUpsell.name,
      secondUpsell.price,
      secondUpsell.originalPrice
    );
    trackRemoveFromCart([upsell2Item], secondUpsell.price);
  }, [secondUpsell]);

  // 15-minute countdown timer
  useEffect(() => {
    if (isOpen && step === 2 && dealSearchComplete) {
      timerRef.current = setInterval(() => {
        setDealTimer(prev => {
          if (prev.seconds === 0) {
            if (prev.minutes === 0) {
              if (timerRef.current) clearInterval(timerRef.current);
              return prev;
            }
            return { minutes: prev.minutes - 1, seconds: 59 };
          }
          return { ...prev, seconds: prev.seconds - 1 };
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isOpen, step, dealSearchComplete]);

  // Detect user location and set up warehouses
  useEffect(() => {
    if (isOpen) {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        if (timezoneMap[timezone]) {
          setUserLocation(timezoneMap[timezone]);
        }

        const localWarehouse = locationWarehouseMap[timezone];
        if (localWarehouse) {
          setWarehouses([
            ...baseWarehouses,
            { id: "local", name: localWarehouse.name, location: localWarehouse.location }
          ]);
        } else {
          setWarehouses([
            ...baseWarehouses,
            { id: "ga", name: "Georgia Center", location: "Atlanta, GA" }
          ]);
        }
      } catch {
        setWarehouses([
          ...baseWarehouses,
          { id: "ga", name: "Georgia Center", location: "Atlanta, GA" }
        ]);
      }
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPositionRef.current);
    }
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isOpen]);

  // Run warehouse animation when popup opens (Step 1)
  useEffect(() => {
    if (isOpen && step === 1 && warehouses.length > 0) {
      setWarehouseStatuses({});
      setFoundWarehouse(null);
      setIsTransitioning(false);

      const getDelay = (index: number): number => {
        if (index === 0) return 400;
        if (index === 1) return 1600;
        return 3200;
      };

      const getCheckDuration = (index: number): number => {
        if (index === 0) return 600;
        if (index === 1) return 900;
        return 1200;
      };

      const availableIndex = warehouses.length - 1;
      
      warehouses.forEach((warehouse, index) => {
        const delay = getDelay(index);
        const checkDuration = getCheckDuration(index);

        setTimeout(() => {
          setWarehouseStatuses(prev => ({
            ...prev,
            [warehouse.id]: "checking"
          }));
        }, delay);

        setTimeout(() => {
          const status = index === availableIndex ? "available" : "unavailable";
          setWarehouseStatuses(prev => ({
            ...prev,
            [warehouse.id]: status
          }));
          
          if (status === "available") {
            setFoundWarehouse(warehouse.id);
          }
        }, delay + checkDuration);
      });

      // Transition to step 2
      const lastDelay = getDelay(warehouses.length - 1);
      const lastCheckDuration = getCheckDuration(warehouses.length - 1);
      const totalDuration = lastDelay + lastCheckDuration + 800;
      
      setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setStep(2);
          setIsTransitioning(false);
          // Reset deal search state for step 2
          setDealSearchActive(true);
          setDealSearchIndex(0);
          setDealSearchComplete(false);
          
          // GA4: Track begin_checkout when reaching step 2
          const qty = selectedQuantity as 1 | 2 | 4;
          const ga4Item = createMainProductItem(
            selectedSize, 
            qty, 
            selectedPricing.price, 
            selectedPricing.originalPrice
          );
          trackBeginCheckout([ga4Item], selectedPricing.price);
        }, 300);
      }, totalDuration);
    }
  }, [isOpen, step, warehouses]);

  // Run inline deal search animation when step 2 loads
  useEffect(() => {
    if (isOpen && step === 2 && dealSearchActive && !dealSearchComplete) {
      // Slower intervals toward the end for dramatic effect
      const messageIntervals = [600, 900, 1200, 1500];
      let totalDelay = 0;

      messageIntervals.forEach((interval, i) => {
        totalDelay += interval;
        setTimeout(() => {
          setDealSearchIndex(i + 1);
          if (i === messageIntervals.length - 1) {
            setTimeout(() => {
              setDealSearchComplete(true);
              setDealSearchActive(false);
              
              // GA4: Track view_promotion when upsells are revealed
              const upsell1Item = createUpsellItem(
                GA4_PRODUCT_IDS.upsells['standard-pillow'],
                firstUpsell.name,
                firstUpsell.price,
                firstUpsell.originalPrice
              );
              const upsell2Item = createUpsellItem(
                GA4_PRODUCT_IDS.upsells['pillowcases'],
                secondUpsell.name,
                secondUpsell.price,
                secondUpsell.originalPrice
              );
              
              const promotions = [
                createUpsellPromotion('upsell_pillow', firstUpsell.headline, upsell1Item, 'upsell_1'),
                createUpsellPromotion('upsell_pillowcases', secondUpsell.headline, upsell2Item, 'upsell_2')
              ];
              
              trackViewPromotion(promotions);
            }, 400);
          }
        }, totalDelay);
      });
    }
  }, [isOpen, step, dealSearchActive, dealSearchComplete]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Viewing counter animation (matching product form)
  useEffect(() => {
    if (!isOpen || step !== 2) return;
    
    const updateViewerCount = () => {
      const change = Math.random() > 0.5 ? 1 : -1;
      const newCount = Math.max(35, Math.min(65, viewerCount + change));
      setViewerCount(newCount);
    };
    
    const interval = setInterval(updateViewerCount, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [isOpen, step, viewerCount]);

  // Animate viewer count changes
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

  // Purchased today counter (matching product form logic)
  useEffect(() => {
    if (!isOpen || step !== 2) return;
    
    const calculatePurchasedToday = () => {
      const now = new Date();
      const nycTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const hours = nycTime.getHours();
      const minutes = nycTime.getMinutes();
      
      const minPurchases = 23;
      const maxPurchases = 89;
      const totalGrowth = maxPurchases - minPurchases;
      
      // Non-linear growth curve
      const totalMinutes = hours * 60 + minutes;
      const maxMinutes = 24 * 60;
      let progress = totalMinutes / maxMinutes;
      
      // Peak hours adjustment
      if (hours >= 9 && hours <= 11) progress *= 1.3;
      else if (hours >= 19 && hours <= 22) progress *= 1.2;
      
      progress = Math.min(1, progress);
      return Math.floor(minPurchases + (totalGrowth * progress));
    };
    
    setPurchasedToday(calculatePurchasedToday());
    const interval = setInterval(() => setPurchasedToday(calculatePurchasedToday()), 120000);
    return () => clearInterval(interval);
  }, [isOpen, step]);

  // Animate purchased today changes
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

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      window.addEventListener("keydown", handleTab);
      firstElement?.focus();
      
      return () => window.removeEventListener("keydown", handleTab);
    }
  }, [isOpen, step]);

  const handleClose = useCallback(() => {
    setStep(1);
    setSelectedUpsell(false);
    setExpandedDetails(false);
    setExpandedAccordion(null);
    setDealTimer({ minutes: 15, seconds: 0 });
    setDealSearchActive(true);
    setDealSearchIndex(0);
    setDealSearchComplete(false);
    if (timerRef.current) clearInterval(timerRef.current);
    // Trigger exit recovery modal if user closes without completing checkout
    if (onExitRecovery && step === 2) {
      onExitRecovery();
    }
    onClose();
  }, [onClose, onExitRecovery, step]);

  const handleProceedToCheckout = () => {
    // Set loading state immediately
    setIsCheckoutLoading(true);
    
    // Determine upsell type based on selection
    // All quantities use the same upsell system:
    // - First upsell: 1x Pillow (single-pillow)
    // - Second upsell: 2x Pillowcase Set (pillowcase-set)
    let upsellType: UpsellType = null;
    
    if (selectedUpsell) {
      upsellType = 'single-pillow';
    }
    
    // Generate Shopify checkout URL with both upsells and shipping insurance
    const checkoutUrl = generateCheckoutUrl({
      size: selectedSize,
      quantity: selectedQuantity as 1 | 2 | 4,
      upsell: upsellType,
      secondUpsell: selectedSecondUpsell, // Pass second upsell selection
      shippingInsurance: shippingInsurance, // Pass shipping insurance selection
    });
    
    // Log for debugging
    console.log('Checkout URL:', checkoutUrl);
    console.log('Cart:', {
      size: selectedSize,
      quantity: selectedQuantity,
      upsell: upsellType,
      total: totalPrice.toFixed(2),
      savings: totalSavings.toFixed(2),
    });
    
    // Small delay to show loading state before redirect
    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 100);
  };

  if (!isOpen) return null;

  const getShippingText = () => {
    // Use correct delivery times: US = 2-3 days, International = 5-8 days
    const deliveryDays = isUS ? "2-3" : "5-8";
    if (userLocation.city && userLocation.countryCode) {
      const flag = countryFlags[userLocation.countryCode] || "";
      return (
        <span className="flex items-center gap-1.5">
          {flag && <span>{flag}</span>}
          Ships to {userLocation.city}, delivers in {deliveryDays} days
        </span>
      );
    }
    return `Ready to ship, delivers in ${deliveryDays} days`;
  };

  // What's included items
  const whatsIncluded = [
    `${selectedQuantity}x FluffCo ${selectedSize} Down Alternative Pillow${selectedQuantity > 1 ? 's' : ''}`,
    ...(selectedQuantity === 4 ? ["2x Matching Pillowcases (FREE - $116 value)"] : []),
    "100 Night Better Sleep",
    // Note: Shipping text is dynamically set below based on location
    "Lifetime Warranty"
  ];

  return (
    <div 
      className="fixed inset-0 z-[9999] backdrop-blur-sm flex items-center justify-center bg-background/95"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-popup-title"
    >
      <div 
        ref={modalRef}
        className={`w-full h-full overflow-y-auto transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
      >

        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="fixed top-4 right-4 z-[10000] w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-secondary hover:bg-secondary/80"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step 1: Warehouse Stock Verification */}
        {step === 1 && (
          <div className="min-h-full flex flex-col items-center justify-center px-4 py-12">
            <div className="max-w-lg w-full text-center">
              <h2 id="order-popup-title" className="text-2xl lg:text-3xl font-semibold mb-2">
                Verifying Stock Levels
              </h2>
              <p className="text-muted-foreground mb-8">
                Checking availability across our distribution network...
              </p>

              {/* Warehouse Cards */}
              <div className="space-y-3">
                {warehouses.map((warehouse) => {
                  const status = warehouseStatuses[warehouse.id];
                  const isLocal = warehouse.id === "local";
                  return (
                    <div
                      key={warehouse.id}
                      className={`bg-card border rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${
                        status === "available" 
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30" 
                          : status === "unavailable"
                          ? "border-border opacity-60"
                          : status === "checking"
                          ? "border-amber-400"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          status === "available" 
                            ? "bg-green-500" 
                            : status === "unavailable"
                            ? "bg-secondary"
                            : status === "checking"
                            ? "bg-amber-400"
                            : "bg-secondary"
                        }`}>
                          {status === "checking" ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : status === "available" ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : status === "unavailable" ? (
                            <X className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Package className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{warehouse.name}</span>
                            {isLocal && status === "available" && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                Near You
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{warehouse.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {status === "checking" && (
                          <span className="text-sm text-amber-600">Checking...</span>
                        )}
                        {status === "available" && (
                          <span className="text-sm text-green-600 font-medium">In Stock!</span>
                        )}
                        {status === "unavailable" && (
                          <span className="text-sm text-muted-foreground">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stock found message */}
              {foundWarehouse && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl animate-in fade-in duration-500">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-green-700 dark:text-green-400 text-center">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">Stock confirmed!</span>
                    </div>
                    <span className="font-medium sm:font-normal">Preparing your order...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Order Summary with Inline Deal Search in Upsell Section */}
        {step === 2 && (
          <div className="min-h-full flex flex-col items-center px-4 py-8 lg:py-12">
            <div className="max-w-2xl w-full">
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl lg:text-3xl font-semibold mb-2">
                  Complete Your Order
                </h2>
                <p className="text-muted-foreground">
                  Review your selection and proceed to checkout
                </p>
              </div>

              {/* Order Summary Card */}
              <div className="bg-card border rounded-2xl p-4 sm:p-5 mb-4">
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded overflow-hidden bg-[#f5f0e6] flex-shrink-0">
                    <img 
                      src={selectedSize === "King" ? "/images/optimized/products/pillow-king-new.png" : "/images/optimized/products/pillow-standard-final.png"}
                      alt="FluffCo Pillow"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 text-sm sm:text-base">FluffCo {selectedSize} Pillow × {selectedQuantity}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                      <span className="text-base sm:text-lg font-bold">${selectedPricing.price.toFixed(2)}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">${selectedPricing.originalPrice.toFixed(2)}</span>
                      <span className="text-xs bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
                        Save ${selectedPricing.savings.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      {getShippingText()}
                    </div>
                  </div>
                </div>

                {/* What's Included Accordion */}
                <button
                  onClick={() => setExpandedAccordion(expandedAccordion === "included" ? null : "included")}
                  className="w-full flex items-center justify-between py-3 border-t border-border text-sm" style={{paddingBottom: '0px'}}
                >
                  <span className="font-medium">What's Included</span>
                  {expandedAccordion === "included" ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {expandedAccordion === "included" && (
                  <div className="pb-3 space-y-2">
                    {whatsIncluded.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Upsell Section - With Inline Deal Search Animation */}
              <div className={`relative border-2 rounded-2xl overflow-hidden transition-all duration-500 mb-4 ${
                dealSearchComplete && selectedUpsell 
                  ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-500" 
                  : "bg-gradient-to-br from-[#f8f6f3] to-[#f3f1ec] dark:from-[#1a2744]/50 dark:to-[#2d3a5c]/50 border-[#2d3a5c]/30"
              }`}>
                
                {/* Inline Deal Search Animation - Shows while searching */}
                {!dealSearchComplete && (
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2d3a5c] to-[#1a2744] flex items-center justify-center">
                        <Search className="w-5 h-5 text-[#f5c542] animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Searching for Additional Deals</h3>
                        <p className="text-sm text-muted-foreground">Finding the best offer for your order...</p>
                      </div>
                    </div>

                    {/* Search progress */}
                    <div className="space-y-2">
                      {dealSearchMessages.map((message, index) => {
                        const Icon = message.icon;
                        const isActive = index === dealSearchIndex;
                        const isComplete = index < dealSearchIndex;
                        
                        return (
                          <div
                            key={index}
                            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                              isActive 
                                ? "bg-[#2d3a5c]/10" 
                                : isComplete
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "opacity-40"
                            }`}
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isActive 
                                ? "bg-[#2d3a5c]" 
                                : isComplete
                                ? "bg-green-500"
                                : "bg-secondary"
                            }`}>
                              {isComplete ? (
                                <Check className="w-3 h-3 text-white" />
                              ) : isActive ? (
                                <div className="w-3 h-3 border-2 border-[#f5c542] border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Icon className="w-3 h-3 text-muted-foreground" />
                              )}
                            </div>
                            <span className={`text-sm ${isActive ? "font-medium" : ""}`}>
                              {message.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Revealed Upsell Card - Shows after search completes */}
                {dealSearchComplete && (
                  <>
                    {/* Badge with integrated timer - always visible */}
                    {firstUpsell.badge && (
                      <div className={`absolute top-0 left-0 right-0 z-10 text-white text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 px-3 sm:px-4 flex items-center justify-between transition-all duration-400 ease-out ${
                        selectedUpsell 
                          ? "bg-gradient-to-r from-green-600 to-emerald-600" 
                          : "bg-gradient-to-r from-[#2d3a5c] to-[#1a2744]"
                      }`}>
                        <span className="truncate">
                          {selectedUpsell ? `${firstUpsell.name} Secured` : `${firstUpsell.badge} - ${firstUpsell.savingsPercent}% OFF`}
                        </span>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                          {selectedUpsell ? (
                            <>
                              <span className="hidden sm:inline text-white/80 font-normal">OFFER SECURED</span>
                              <div className="flex items-center gap-0.5 sm:gap-1 font-mono">
                                <span className="bg-white/20 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">{String(dealTimer.minutes).padStart(2, '0')}</span>
                                <span className="text-[#f5c542]">:</span>
                                <span className="bg-white/20 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">{String(dealTimer.seconds).padStart(2, '0')}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <span className="hidden sm:inline text-white/80 font-normal">OFFER RESERVED FOR</span>
                              <div className="flex items-center gap-0.5 sm:gap-1 font-mono">
                                <span className="bg-white/20 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">{String(dealTimer.minutes).padStart(2, '0')}</span>
                                <span className="text-[#f5c542]">:</span>
                                <span className="bg-white/20 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">{String(dealTimer.seconds).padStart(2, '0')}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Single container with smooth resize animation - like Black Friday globe section */}
                    <div 
                      className="overflow-hidden"
                      style={{
                        maxHeight: firstUpsellCollapsed ? '120px' : '800px',
                        background: selectedUpsell 
                          ? 'linear-gradient(135deg, rgb(22, 163, 74) 0%, rgb(5, 150, 105) 50%, rgb(16, 185, 129) 100%)' 
                          : 'transparent',
                        transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.5s ease-out',
                      }}
                    >
                      {/* Content that smoothly resizes - same elements, different sizes based on collapsed state */}
                      <div className={`${
                        firstUpsellCollapsed 
                          ? 'p-3 sm:p-4 pt-10 sm:pt-12' 
                          : 'p-4 sm:p-5 pt-12 sm:pt-14'
                      }`}
                      style={{
                        transition: 'padding 0.3s ease-out'
                      }}>
                        <div className={`flex items-start ${
                          firstUpsellCollapsed 
                            ? 'flex-row gap-3 sm:gap-4' 
                            : 'flex-col sm:flex-row gap-4 sm:gap-5'
                        }`}
                        style={{
                          transition: 'gap 0.3s ease-out'
                        }}>
                          {/* Product Image - resizes based on collapsed state */}
                          <div className={`flex-shrink-0 ${
                            firstUpsellCollapsed 
                              ? 'w-14 h-14 sm:w-16 sm:h-16' 
                              : 'flex gap-4 sm:block'
                          }`}>
                            <div className={`overflow-hidden ${
                              firstUpsellCollapsed 
                                ? 'w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded' 
                                : 'w-24 h-24 sm:w-40 sm:h-40 bg-[#f5f0e6] rounded-lg'
                            }`}>
                              <img 
                                src={firstUpsell.image}
                                alt={firstUpsell.name}
                                className={`w-full h-full ${
                                  firstUpsellCollapsed ? 'object-contain' : 'object-cover'
                                }`}
                              />
                            </div>
                            {/* Mobile: show details next to image - hidden when collapsed */}
                            {!firstUpsellCollapsed && (
                              <div className="sm:hidden flex-1">
                                <div className="inline-flex items-center gap-1.5 bg-[#2d3a5c]/10 dark:bg-[#f5c542]/20 text-[#2d3a5c] dark:text-[#f5c542] px-2 py-0.5 rounded-full text-[10px] font-medium mb-1">
                                  <Gift className="w-2.5 h-2.5" />
                                  Exclusive Deal Found!
                                </div>
                                <h3 className="text-base font-bold leading-tight">{firstUpsell.headline}</h3>
                                <p className="text-sm font-semibold text-foreground/80">{firstUpsell.name}</p>
                              </div>
                            )}
                            {!firstUpsellCollapsed && firstUpsell.limitedQty && (
                              <div className="hidden sm:block mt-2 text-center text-xs text-orange-600 dark:text-orange-400 font-medium">
                                Only {firstUpsell.limitedQty} left at this price
                              </div>
                            )}
                          </div>

                          {/* Product Details - adapts based on collapsed state */}
                          <div className="flex-1 min-w-0">
                            {/* Collapsed state: compact info with improved text contrast */}
                            {firstUpsellCollapsed ? (
                              <>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-bold text-sm sm:text-base text-white drop-shadow-sm truncate">{firstUpsell.badge} - {firstUpsell.name}</span>
                                  <span className="flex-shrink-0 inline-flex items-center gap-1 bg-white/25 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                                    <Check className="w-3 h-3" />
                                    Secured
                                  </span>
                                </div>
                                <p className="text-xs sm:text-sm text-white/90 truncate">{firstUpsell.description.split('.')[0]}.</p>
                              </>
                            ) : (
                              <>
                                {/* Desktop header - hidden on mobile */}
                                <div className="hidden sm:block">
                                  <div className="inline-flex items-center gap-2 bg-[#2d3a5c]/10 dark:bg-[#f5c542]/20 text-[#2d3a5c] dark:text-[#f5c542] px-2 py-1 rounded-full text-xs font-medium mb-2">
                                    <Gift className="w-3 h-3" />
                                    Exclusive Deal Found!
                                  </div>
                                  <h3 className="text-xl font-bold mb-1">{firstUpsell.headline}</h3>
                                  <p className="text-lg font-semibold text-foreground/80 mb-2">{firstUpsell.name}</p>
                                </div>
                                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{firstUpsell.description}</p>

                                {/* Why it makes sense */}
                                <button
                                  onClick={() => setExpandedDetails(!expandedDetails)}
                                  className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#2d3a5c] dark:text-[#f5c542] mb-3"
                                >
                                  <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  Why this makes sense for you
                                  {expandedDetails ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                </button>
                                
                                {expandedDetails && (
                                  <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2">
                                    {firstUpsell.whyItMakesSense.map((reason, i) => (
                                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span>{reason}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}

                            {/* Price and Add Button - adapts based on collapsed state */}
                            <div className={`transition-all duration-400 ease-out ${
                              firstUpsellCollapsed 
                                ? 'hidden' 
                                : 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'
                            }`}>
                              <div className="flex items-center sm:block gap-3">
                                <div className="flex items-baseline gap-1.5 sm:gap-2">
                                  <span className="text-xl sm:text-2xl font-bold text-green-600">${firstUpsell.price.toFixed(2)}</span>
                                  <span className="text-sm sm:text-lg text-muted-foreground line-through">${firstUpsell.originalPrice.toFixed(2)}</span>
                                </div>
                                <div className="text-xs sm:text-sm text-green-600 font-medium">
                                  You save ${firstUpsell.savings.toFixed(2)}
                                </div>
                              </div>

                              <button
                                onClick={(e) => {
                                  // Prevent double-click during animation
                                  if (isFirstUpsellAnimating) return;
                                  
                                  if (!selectedUpsell) {
                                    // Lock button during animation
                                    setIsFirstUpsellAnimating(true);
                                    
                                    // Accept upsell - trigger collapse animation with confetti
                                    setSelectedUpsell(true);
                                    
                                    // GA4: Track select_promotion and add_to_cart
                                    trackUpsell1Add();
                                    
                                    setTimeout(() => {
                                      setFirstUpsellCollapsed(true);
                                      // Show second upsell with reveal animation after collapse
                                      setTimeout(() => {
                                        setShowSecondUpsell(true);
                                        setTimeout(() => setSecondUpsellRevealing(true), 50);
                                      }, 400);
                                      // Unlock button after animation completes
                                      setTimeout(() => setIsFirstUpsellAnimating(false), 500);
                                    }, 600);
                                  } else {
                                    // Lock button during animation
                                    setIsFirstUpsellAnimating(true);
                                    
                                    // Remove upsell - expand back
                                    setFirstUpsellCollapsed(false);
                                    setSelectedUpsell(false);
                                    
                                    // GA4: Track remove_from_cart
                                    trackUpsell1Remove();
                                    
                                    // Unlock button after animation completes
                                    setTimeout(() => setIsFirstUpsellAnimating(false), 600);
                                  }
                                }}
                                className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold transition-all text-sm sm:text-base ${
                                  selectedUpsell
                                    ? "bg-green-500 text-white"
                                    : "bg-gradient-to-r from-[#2d3a5c] to-[#1a2744] text-white hover:from-[#3d4a6c] hover:to-[#2a3a54]"
                                }`}
                              >
                                {selectedUpsell ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                    Added!
                                  </span>
                                ) : (
                                  "Add to Order"
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Price info and remove button - only visible when collapsed */}
                          {firstUpsellCollapsed && (
                            <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
                              <div className="text-right">
                                <div className="flex items-baseline gap-1">
                                  <span className="text-sm sm:text-base font-bold text-white">${firstUpsell.price.toFixed(2)}</span>
                                  <span className="text-[10px] sm:text-xs text-white/40 line-through">${firstUpsell.originalPrice.toFixed(2)}</span>
                                </div>
                                <div className="text-[9px] sm:text-[10px] text-green-200 font-medium">
                                  Save ${firstUpsell.savings.toFixed(2)}
                                </div>
                              </div>
                              {/* Remove button */}
                              <button
                                onClick={() => {
                                  setFirstUpsellCollapsed(false);
                                  setSelectedUpsell(false);
                                  
                                  // GA4: Track remove_from_cart
                                  trackUpsell1Remove();
                                }}
                                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                                title="Remove from order"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Second Upsell - Shows when first upsell is accepted, stays visible even if declined */}
              {dealSearchComplete && showSecondUpsell && (
                <div 
                  className={`relative border-2 rounded-2xl overflow-hidden mb-4 transition-all duration-400 ease-out ${
                    secondUpsellRevealing 
                      ? "opacity-100 translate-y-0 max-h-[800px]" 
                      : "opacity-0 -translate-y-4 max-h-0"
                  } ${
                    selectedSecondUpsell 
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-500" 
                      : "bg-gradient-to-br from-[#f8f6f3] to-[#f3f1ec] dark:from-[#1a2744]/50 dark:to-[#2d3a5c]/50 border-[#2d3a5c]/30"
                  }`}
                  style={{ transitionProperty: 'opacity, transform, max-height, background-color, border-color' }}
                >
                  {/* Badge with timer - always visible */}
                  {secondUpsell.badge && (
                    <div className={`absolute top-0 left-0 right-0 z-10 text-white text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 px-3 sm:px-4 flex items-center justify-between transition-all duration-400 ease-out ${
                      selectedSecondUpsell 
                        ? "bg-gradient-to-r from-green-600 to-emerald-600" 
                        : "bg-gradient-to-r from-[#2d3a5c] to-[#1a2744]"
                    }`}>
                      <span className="truncate">
                        {selectedSecondUpsell ? `${secondUpsell.name} Secured` : `${secondUpsell.badge} - ${secondUpsell.savingsPercent}% OFF`}
                      </span>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 ml-2">
                        {selectedSecondUpsell ? (
                          <>
                            <span className="hidden sm:inline text-white/80 font-normal">OFFER SECURED</span>
                            <div className="flex items-center gap-0.5 sm:gap-1 font-mono">
                              <span className="bg-white/20 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">{String(dealTimer.minutes).padStart(2, '0')}</span>
                              <span className="text-[#f5c542]">:</span>
                              <span className="bg-white/20 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">{String(dealTimer.seconds).padStart(2, '0')}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline text-white/80 font-normal">OFFER RESERVED FOR</span>
                            <div className="flex items-center gap-0.5 sm:gap-1 font-mono">
                              <span className="bg-white/20 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">{String(dealTimer.minutes).padStart(2, '0')}</span>
                              <span className="text-[#f5c542]">:</span>
                              <span className="bg-white/20 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs">{String(dealTimer.seconds).padStart(2, '0')}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Single container with smooth resize animation - like Black Friday globe section */}
                  <div 
                    className="overflow-hidden"
                    style={{
                      maxHeight: secondUpsellCollapsed ? '120px' : '800px',
                      background: selectedSecondUpsell 
                        ? 'linear-gradient(135deg, rgb(22, 163, 74) 0%, rgb(5, 150, 105) 50%, rgb(16, 185, 129) 100%)' 
                        : 'transparent',
                      transition: 'max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.5s ease-out',
                    }}
                  >
                    {/* Content that smoothly resizes - same elements, different sizes based on collapsed state */}
                    <div className={`${
                      secondUpsellCollapsed 
                        ? 'p-3 sm:p-4 pt-10 sm:pt-12' 
                        : 'p-4 sm:p-5 pt-12 sm:pt-14'
                    }`}
                    style={{
                      transition: 'padding 0.3s ease-out'
                    }}>
                      <div className={`flex items-start ${
                        secondUpsellCollapsed 
                          ? 'flex-row gap-3 sm:gap-4' 
                          : 'flex-col sm:flex-row gap-4 sm:gap-5'
                      }`}
                      style={{
                        transition: 'gap 0.3s ease-out'
                      }}>
                        {/* Product Image - resizes based on collapsed state */}
                        <div className={`flex-shrink-0 ${
                          secondUpsellCollapsed 
                            ? 'w-14 h-14 sm:w-16 sm:h-16' 
                            : 'flex gap-4 sm:block'
                        }`}>
                          <div className={`overflow-hidden ${
                            secondUpsellCollapsed 
                              ? 'w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded' 
                              : 'w-24 h-24 sm:w-40 sm:h-40 bg-[#f5f0e6] rounded-lg'
                          }`}>
                            <img 
                              src={secondUpsell.image}
                              alt={secondUpsell.name}
                              className={`w-full h-full ${
                                secondUpsellCollapsed ? 'object-contain' : 'object-cover'
                              }`}
                            />
                          </div>
                          {/* Mobile: show details next to image - hidden when collapsed */}
                          {!secondUpsellCollapsed && (
                            <div className="sm:hidden flex-1">
                              <div className="inline-flex items-center gap-1.5 bg-[#2d3a5c]/10 dark:bg-[#f5c542]/20 text-[#2d3a5c] dark:text-[#f5c542] px-2 py-0.5 rounded-full text-[10px] font-medium mb-1">
                                <Gift className="w-2.5 h-2.5" />
                                Complete Your Setup!
                              </div>
                              <h3 className="text-base font-bold leading-tight">{secondUpsell.headline}</h3>
                              <p className="text-sm font-semibold text-foreground/80">{secondUpsell.name}</p>
                            </div>
                          )}
                          {!secondUpsellCollapsed && secondUpsell.limitedQty && (
                            <div className="hidden sm:block mt-2 text-center text-xs text-orange-600 dark:text-orange-400 font-medium">
                              Only {secondUpsell.limitedQty} left at this price
                            </div>
                          )}
                        </div>

                        {/* Product Details - adapts based on collapsed state */}
                        <div className="flex-1 min-w-0">
                          {/* Collapsed state: compact info with improved text contrast */}
                          {secondUpsellCollapsed ? (
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm sm:text-base text-white drop-shadow-sm truncate">{secondUpsell.badge} - {secondUpsell.name}</span>
                                <span className="flex-shrink-0 inline-flex items-center gap-1 bg-white/25 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                                  <Check className="w-3 h-3" />
                                  Secured
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-white/90 truncate">{secondUpsell.description.split('.')[0]}.</p>
                            </>
                          ) : (
                            <>
                              {/* Desktop header */}
                              <div className="hidden sm:block">
                                <div className="inline-flex items-center gap-2 bg-[#2d3a5c]/10 dark:bg-[#f5c542]/20 text-[#2d3a5c] dark:text-[#f5c542] px-2 py-1 rounded-full text-xs font-medium mb-2">
                                  <Gift className="w-3 h-3" />
                                  Complete Your Setup!
                                </div>
                                <h3 className="text-xl font-bold mb-1">{secondUpsell.headline}</h3>
                                <p className="text-lg font-semibold text-foreground/80 mb-2">{secondUpsell.name}</p>
                              </div>
                              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">{secondUpsell.description}</p>

                              {/* Why it makes sense - collapsible like first upsell */}
                              <button
                                onClick={() => setExpandedDetails(!expandedDetails)}
                                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-[#2d3a5c] dark:text-[#f5c542] mb-3"
                              >
                                <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Why this makes sense for you
                                {expandedDetails ? <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                              </button>
                              
                              {expandedDetails && (
                                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4 space-y-1.5 sm:space-y-2">
                                  {secondUpsell.whyItMakesSense.map((reason, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                      <span>{reason}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          {/* Price and Add Button - adapts based on collapsed state */}
                          <div className={`transition-all duration-400 ease-out ${
                            secondUpsellCollapsed 
                              ? 'hidden' 
                              : 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'
                          }`}>
                            <div className="flex items-center sm:block gap-3">
                              <div className="flex items-baseline gap-1.5 sm:gap-2">
                                <span className="text-xl sm:text-2xl font-bold text-green-600">${secondUpsell.price.toFixed(2)}</span>
                                <span className="text-sm sm:text-lg text-muted-foreground line-through">${secondUpsell.originalPrice.toFixed(2)}</span>
                              </div>
                              <div className="text-xs sm:text-sm text-green-600 font-medium">
                                You save ${secondUpsell.savings.toFixed(2)}
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                // Prevent double-click during animation
                                if (isSecondUpsellAnimating) return;
                                
                                if (!selectedSecondUpsell) {
                                  // Lock button during animation
                                  setIsSecondUpsellAnimating(true);
                                  
                                  // Accept upsell - trigger collapse animation with confetti
                                  setSelectedSecondUpsell(true);
                                  
                                  // GA4: Track select_promotion and add_to_cart
                                  trackUpsell2Add();
                                  
                                  setTimeout(() => {
                                    setSecondUpsellCollapsed(true);
                                    // Unlock button after animation completes
                                    setTimeout(() => setIsSecondUpsellAnimating(false), 500);
                                  }, 600);
                                } else {
                                  // Lock button during animation
                                  setIsSecondUpsellAnimating(true);
                                  
                                  // Remove upsell - expand back
                                  setSecondUpsellCollapsed(false);
                                  setSelectedSecondUpsell(false);
                                  
                                  // GA4: Track remove_from_cart
                                  trackUpsell2Remove();
                                  
                                  // Unlock button after animation completes
                                  setTimeout(() => setIsSecondUpsellAnimating(false), 600);
                                }
                              }}
                              className={`w-full sm:w-auto px-6 py-3 rounded-full font-semibold transition-all text-sm sm:text-base ${
                                selectedSecondUpsell
                                  ? "bg-green-500 text-white"
                                  : "bg-gradient-to-r from-[#2d3a5c] to-[#1a2744] text-white hover:from-[#3d4a6c] hover:to-[#2a3a54]"
                              }`}
                            >
                              {selectedSecondUpsell ? (
                                <span className="flex items-center justify-center gap-2">
                                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                                  Added!
                                </span>
                              ) : (
                                "Add to Order"
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Price info and remove button - only visible when collapsed */}
                        {secondUpsellCollapsed && (
                          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
                            <div className="text-right">
                              <div className="flex items-baseline gap-1">
                                <span className="text-sm sm:text-base font-bold text-white">${secondUpsell.price.toFixed(2)}</span>
                                <span className="text-[10px] sm:text-xs text-white/40 line-through">${secondUpsell.originalPrice.toFixed(2)}</span>
                              </div>
                              <div className="text-[9px] sm:text-[10px] text-green-200 font-medium">
                                Save ${secondUpsell.savings.toFixed(2)}
                              </div>
                            </div>
                            {/* Remove button */}
                            <button
                              onClick={() => {
                                setSecondUpsellCollapsed(false);
                                setSelectedSecondUpsell(false);
                                
                                // GA4: Track remove_from_cart
                                trackUpsell2Remove();
                              }}
                              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                              title="Remove from order"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Shipping Protection - Standalone Section Above Summary */}
              <div 
                className="bg-card border rounded-2xl p-4 sm:p-5 mb-4 cursor-pointer transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600"
                onClick={() => setShippingInsurance(!shippingInsurance)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    shippingInsurance 
                      ? 'bg-[#2d3a5c] border-[#2d3a5c]' 
                      : 'border-gray-400 dark:border-gray-500'
                  }`}>
                    {shippingInsurance && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#2d3a5c] dark:text-gray-300" />
                        <span className="font-semibold text-sm sm:text-base">Shipping Protection</span>
                        <div className="relative group">
                          <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                            <div className="font-semibold mb-1">What's covered:</div>
                            <ul className="space-y-0.5 text-gray-200">
                              <li>• Lost packages - full replacement</li>
                              <li>• Damaged items - free reshipping</li>
                              <li>• Stolen deliveries - covered</li>
                              <li>• Hassle-free claims process</li>
                            </ul>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                      <span className="font-bold">$5.00</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Protect your order against loss, damage & theft during shipping
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">Lost packages</span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">Damaged items</span>
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">Stolen deliveries</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">FluffCo Pillow × {selectedQuantity}</span>
                  <div className="text-right">
                    <span className="text-muted-foreground line-through text-sm mr-2">${selectedPricing.originalPrice.toFixed(2)}</span>
                    <span>${selectedPricing.price.toFixed(2)}</span>
                  </div>
                </div>
                {selectedUpsell && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">{firstUpsell.name}</span>
                    <div className="text-right">
                      <span className="text-muted-foreground line-through text-sm mr-2">${firstUpsell.originalPrice.toFixed(2)}</span>
                      <span>${firstUpsell.price.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                {selectedSecondUpsell && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">{secondUpsell.name}</span>
                    <div className="text-right">
                      <span className="text-muted-foreground line-through text-sm mr-2">${secondUpsell.originalPrice.toFixed(2)}</span>
                      <span>${secondUpsell.price.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Shipping</span>
                  {isUS ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    <span className="font-medium">${shippingCost.toFixed(2)}</span>
                  )}
                </div>
                {shippingInsurance && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">
                      Shipping Protection
                    </span>
                    <span>$5.00</span>
                  </div>
                )}
                
                <div className="border-t border-border pt-3 mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">Total</span>
                    <div className="text-right">
                      <span className="text-muted-foreground line-through text-sm mr-2">${totalOriginalPrice.toFixed(2)}</span>
                      <span className="text-xl font-bold">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-lg py-2 px-3 mt-2 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      You're saving ${totalSavings.toFixed(2)} on this order!
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic location-based shipping confirmation */}
              <div className="mb-4">
                <ShippingMessage variant="checkout" />
              </div>

              {/* Proceed CTA */}
              <button
                onClick={handleProceedToCheckout}
                disabled={isCheckoutLoading}
                className={`w-full bg-[#e63946] hover:bg-[#d62839] text-white font-semibold py-4 rounded-full text-lg transition-colors flex items-center justify-center gap-2 ${isCheckoutLoading ? 'opacity-90 cursor-wait' : ''}`}
              >
                {isCheckoutLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Redirecting to Checkout...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Proceed to Checkout
                  </>
                )}
              </button>

              {/* Payment gateway images */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <img src="https://framerusercontent.com/images/bSFFCTtjkmIaGlqPy3PO43DkkGk.svg" alt="Visa" className="h-6" />
                <img src="https://framerusercontent.com/images/I7xg6lxhvJVKnwM1mN1dLJdEhZ0.svg" alt="Mastercard" className="h-6" />
                <img src="https://framerusercontent.com/images/jtf0I9r1qAZRg8faEptmYKSoa2c.svg" alt="Amex" className="h-6" />
                <img src="https://framerusercontent.com/images/ek75tbpQfCRJCnfpssG54DCS7dQ.svg" alt="Discover" className="h-6" />
                <img src="https://framerusercontent.com/images/FWqnr8Dbq9J8XTeq33tlleuWmlg.svg" alt="PayPal" className="h-6" />
                <img src="https://framerusercontent.com/images/GA26KH0kgksFTAmZKPUPQxI53k.svg" alt="Apple Pay" className="h-6" />
              </div>

              {/* Trust badges - SSL and Safe Checkout */}
              <div className="flex items-center justify-center gap-8 text-xs text-muted-foreground mt-3">
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <Lock className="w-4 h-4" />
                  <span className="flex flex-col leading-tight">
                    <span className="font-semibold">Secure</span>
                    <span>SSL Encryption</span>
                  </span>
                </span>
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <Shield className="w-4 h-4" />
                  <span className="flex flex-col leading-tight">
                    <span className="font-semibold">Guaranteed</span>
                    <span>Safe Checkout</span>
                  </span>
                </span>
              </div>

              {/* Stock & urgency bar - unified component */}
              <div className="mt-4">
                <StockInventoryBar stockLevel={stockLevel} countdown={countdown} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
