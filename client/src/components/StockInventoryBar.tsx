/**
 * StockInventoryBar - Unified stock inventory display component
 * Used across the site for consistent urgency messaging
 * 
 * Mobile: Hides "purchased today" to keep all text on one line
 * Desktop: Shows full stats (Limited stock · X viewing · Y purchased today)
 */

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface StockInventoryBarProps {
  stockLevel: number;
  countdown: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  timerExpired?: boolean;
}

export function StockInventoryBar({ stockLevel, countdown, timerExpired = false }: StockInventoryBarProps) {
  // Viewing counter state
  const [viewerCount, setViewerCount] = useState(46);
  const [displayedViewerCount, setDisplayedViewerCount] = useState(46);
  const [isViewerCountAnimating, setIsViewerCountAnimating] = useState(false);
  
  // Purchased today state
  const [purchasedToday, setPurchasedToday] = useState(191);
  const [displayedPurchasedToday, setDisplayedPurchasedToday] = useState(191);
  const [isPurchasedAnimating, setIsPurchasedAnimating] = useState(false);

  // Viewing counter animation
  useEffect(() => {
    const updateViewerCount = () => {
      const change = Math.random() > 0.5 ? 1 : -1;
      const newCount = Math.max(35, Math.min(65, viewerCount + change));
      setViewerCount(newCount);
    };
    
    const interval = setInterval(updateViewerCount, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [viewerCount]);

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

  // Purchased today counter (NYC timezone-based with weighted hourly growth)
  useEffect(() => {
    const calculatePurchasedToday = () => {
      // Get current time in NYC timezone
      const now = new Date();
      const nycTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const hours = nycTime.getHours();
      const minutes = nycTime.getMinutes();
      
      // Total range: 191 at midnight to 1204 at 11:59PM (1013 growth over 24h)
      const minPurchases = 191;
      const maxPurchases = 1204;
      const totalGrowth = maxPurchases - minPurchases; // 1013
      
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
    
    setPurchasedToday(calculatePurchasedToday());
    const interval = setInterval(() => setPurchasedToday(calculatePurchasedToday()), 120000);
    return () => clearInterval(interval);
  }, []);

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

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-1000 relative"
          style={{ width: `${stockLevel}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      </div>
      
      {/* Stats row - all on one line */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          {/* Pulsing dot */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
          </span>
          <span className="text-amber-600 font-medium">Limited stock</span>
          <span className="text-muted-foreground/40">·</span>
          <span>
            <span className={`font-medium tabular-nums inline-block transition-all duration-150 ${isViewerCountAnimating ? 'opacity-0 translate-y-0.5' : 'opacity-100 translate-y-0'}`}>
              {displayedViewerCount}
            </span> viewing
          </span>
          {/* Purchased today - hidden on mobile to keep text on one line */}
          <span className="hidden sm:inline text-muted-foreground/40">·</span>
          <span className="hidden sm:inline">
            <span className={`font-medium tabular-nums inline-block transition-all duration-150 ${isPurchasedAnimating ? 'opacity-0 translate-y-0.5' : 'opacity-100 translate-y-0'}`}>
              {displayedPurchasedToday}
            </span> sold today
          </span>
        </div>
        
        {/* Timer - hidden when expired */}
        {!timerExpired && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="tabular-nums font-medium">
              {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
            </span>
            <span className="text-muted-foreground/60">left</span>
          </div>
        )}
      </div>
    </div>
  );
}
