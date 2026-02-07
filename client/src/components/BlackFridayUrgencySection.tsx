/**
 * Black Friday Urgency Section
 * 
 * Displays above hero, below header on Black Friday page only
 * Features:
 * - Collapsible with quiz results-style animation
 * - Simple CSS-based animated planet with world map overlay
 * - Animated order flow arrows from 2-3 hub locations
 * - Live order counter with realistic 15% conversion rate (~125 orders/hour)
 * - Stock level indicator
 * - Smart collapsed state: keeps planet and key info visible
 * - Mobile optimized: responsive planet size and layout
 * - Matches page color scheme (light background, black/gold accents)
 * - Subtle, professional design
 */

import { useEffect, useState, lazy, Suspense } from 'react';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';

// Lazy load the COBE globe for better initial page load performance
const CobeGlobe = lazy(() => import('./CobeGlobe').then(module => ({ default: module.CobeGlobe })));

interface BlackFridayUrgencySectionProps {
  backgroundColor?: string; // Background color from event scheme (matches press section)
  primaryColor?: string; // Event primary color for globe
  textColor?: string; // Text color (replaces hardcoded black)
  accentColor?: string; // Accent color for warnings/highlights
  initialOrderCount?: number; // Initial order count for display
}

// Hub locations (warehouses) - [longitude, latitude] for map projection
const HUBS = [
  { name: 'US West', lon: -120, lat: 37, x: 15, y: 35 }, // California
  { name: 'US East', lon: -75, lat: 40, x: 25, y: 32 }, // New York
  { name: 'Europe', lon: 10, lat: 50, x: 52, y: 25 }, // Germany
];

// Generate random customer locations for order flow animation
function generateCustomerLocation() {
  // Weighted random: 60% US, 30% Europe, 10% Asia
  const region = Math.random();
  if (region < 0.6) {
    // US
    return { x: Math.random() * 15 + 12, y: Math.random() * 20 + 25 };
  } else if (region < 0.9) {
    // Europe
    return { x: Math.random() * 15 + 48, y: Math.random() * 20 + 20 };
  } else {
    // Asia
    return { x: Math.random() * 20 + 65, y: Math.random() * 25 + 20 };
  }
}

interface OrderFlow {
  id: number;
  hub: typeof HUBS[0];
  destination: { x: number; y: number };
  progress: number;
}

export function BlackFridayUrgencySection({ 
  backgroundColor = '#f5f0e8', 
  primaryColor = '#FFD700',
  textColor = '#1a1a1a',
  accentColor = '#FF6B6B',
  initialOrderCount = 127
}: BlackFridayUrgencySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [orderCount, setOrderCount] = useState(initialOrderCount);
  const [isVisible, setIsVisible] = useState(false);
  
  // Realistic live orders: 15% conversion rate of ~20k daily visitors = ~3k conversions/day
  // "Live orders" = orders currently being processed (last hour) = ~125
  const [totalOrders, setTotalOrders] = useState(127);
  const [stockPercentage, setStockPercentage] = useState(18.1);
  const [orderFlows, setOrderFlows] = useState<OrderFlow[]>([]);
  const [nextFlowId, setNextFlowId] = useState(0);

  // Smooth reveal animation on mount (matching quiz results pattern)
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(showTimer);
  }, []);

  // Auto-collapse after 5 seconds if user hasn't interacted
  useEffect(() => {
    const collapseTimer = setTimeout(() => {
      setIsExpanded(false);
    }, 5000);
    return () => clearTimeout(collapseTimer);
  }, []);

  // Realistic live orders: random order every 4-20 seconds
  useEffect(() => {
    const scheduleNextOrder = () => {
      // Random delay between 4-20 seconds
      const delay = Math.floor(Math.random() * (20000 - 4000 + 1)) + 4000;
      
      const timer = setTimeout(() => {
        setTotalOrders(prev => prev + 1);
        
        // Create new order flow animation
        const hub = HUBS[Math.floor(Math.random() * HUBS.length)];
        const destination = generateCustomerLocation();
        const newFlow: OrderFlow = {
          id: nextFlowId,
          hub,
          destination,
          progress: 0
        };
        setOrderFlows(prev => [...prev, newFlow]);
        setNextFlowId(prev => prev + 1);
        
        // Schedule next order
        scheduleNextOrder();
      }, delay);
      
      return timer;
    };
    
    const timer = scheduleNextOrder();
    return () => clearTimeout(timer);
  }, [nextFlowId]);
  
  // Deplete stock slowly
  useEffect(() => {
    const interval = setInterval(() => {
      setStockPercentage(prev => Math.max(12, prev - 0.01));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate order flows
  useEffect(() => {
    const interval = setInterval(() => {
      setOrderFlows(prev => 
        prev
          .map(flow => ({ ...flow, progress: flow.progress + 0.02 }))
          .filter(flow => flow.progress < 1) // Remove completed flows
      );
    }, 50); // 50ms = smooth 20fps animation

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      className="relative overflow-hidden border-b border-neutral-200"
      style={{
        backgroundColor,
        transformOrigin: 'top',
        maxHeight: isVisible ? (isExpanded ? '600px' : '100px') : '0px',
        opacity: isVisible ? 1 : 0,
        transition: 'max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out',
      }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${textColor} 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className={`container mx-auto px-4 relative z-10 transition-all duration-500 ${isExpanded ? 'py-6' : 'py-3'}`}>
        {/* Minimize/Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-3 right-4 z-20 p-2 rounded-full hover:bg-black/5 transition-colors"
          aria-label={isExpanded ? 'Minimize section' : 'Expand section'}
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" style={{ color: `${textColor}99` }} />
          ) : (
            <ChevronDown className="w-5 h-5" style={{ color: `${textColor}99` }} />
          )}
        </button>

        <div className={`max-w-5xl mx-auto flex ${isExpanded ? 'flex-col md:flex-row' : 'flex-row'} items-center gap-3 md:gap-6 transition-all duration-500`}>
          {/* Left: 3D COBE Globe */}
          <div className={`flex-shrink-0 relative transition-all duration-500 ${
            isExpanded 
              ? 'w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56' 
              : 'w-16 h-16 sm:w-20 sm:h-20'
          }`}>
            {/* COBE 3D Globe - Lazy loaded */}
            <div className="absolute inset-0">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <CobeGlobe 
                  className="w-full h-full"
                  primaryColor={primaryColor}
                  backgroundColor={textColor}
                  onOrderCountChange={setOrderCount}
                />
              </Suspense>
            </div>

            {/* Order counter overlay - Tag-like design with blur - adapts to collapse state */}
            <div className={`absolute left-1/2 -translate-x-1/2 z-20 rounded-full backdrop-blur-md transition-all duration-500 ${
              isExpanded 
                ? 'bottom-4 px-4 py-2.5' 
                : 'bottom-1 px-2 py-1'
            }`} style={{
              background: 'rgba(255, 255, 255, 0.3)',
              border: '1.5px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}>
              <div className={`flex items-center transition-all duration-500 ${
                isExpanded ? 'gap-2' : 'gap-1'
              }`}>
                <div className={`font-semibold whitespace-nowrap transition-all duration-500 ${
                  isExpanded ? 'text-sm' : 'text-[10px]'
                }`} style={{ color: `${textColor}cc` }}>
                  Live Orders
                </div>
                <div className={`font-bold tabular-nums transition-all duration-500 ${
                  isExpanded ? 'text-xl' : 'text-xs'
                }`} style={{ color: textColor }}>
                  {orderCount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className={`flex-1 transition-all duration-500 ${
            isExpanded 
              ? 'text-center md:text-left' 
              : 'text-left'
          }`}>
            <h3 className={`font-bold transition-all duration-500 ${
              isExpanded 
                ? 'text-base md:text-lg mb-2' 
                : 'text-xs sm:text-sm mb-1'
            }`} style={{ color: textColor }}>
              Black Friday Demand Is Unprecedented
            </h3>

            {isExpanded && (
            <>
              <p className="text-neutral-600 text-sm mb-4 max-w-xl">
                Our warehouse is operating at maximum capacity. Due to the overwhelming response, 
                customer support response times may be extended by 24-48 hours, and delivery may 
                take an additional 2-3 days beyond our standard timeframe.
              </p>

              {/* Stock indicator - compact inline */}
              <div className="inline-flex items-center gap-3 bg-white border border-neutral-200 rounded-lg px-4 py-2.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-neutral-500" />
                  <span className="text-neutral-700 text-sm font-medium">Current Stock Level</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFD700] transition-all duration-1000"
                      style={{ 
                        width: `${stockPercentage}%`
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold tabular-nums text-[#FF6B6B]">{stockPercentage.toFixed(1)}%</span>
                </div>
              </div>

              {/* Reassurance */}
              <p className="text-neutral-500 text-xs mt-3">
                All orders are still covered by our 100-night trial and free shipping guarantee.
              </p>
            </>
            )}
            
            {/* Collapsed state: Show stock level and status inline */}
            {!isExpanded && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <Package className="w-3 h-3 text-neutral-500" />
                  <span className="text-neutral-600">Stock:</span>
                  <span className="font-bold tabular-nums text-[#FF6B6B]">{stockPercentage.toFixed(1)}%</span>
                </div>
                <span className="text-neutral-300">•</span>
                <span className="text-neutral-600">High demand - orders processing</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes rotate {
          from { transform: translateX(0); }
          to { transform: translateX(-20px); }
        }
      `}</style>
    </section>
  );
}
