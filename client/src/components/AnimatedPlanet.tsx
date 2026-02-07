/**
 * AnimatedPlanet Component
 * 
 * Inspired by Shopify's BFCM page planet animation
 * Features a subtle, rotating planet with "Sales" text overlay
 */

interface AnimatedPlanetProps {
  className?: string;
  textColor?: string;
}

export function AnimatedPlanet({ className = "", textColor = "#000000" }: AnimatedPlanetProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Planet SVG */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ 
          animation: 'spin 60s linear infinite',
        }}
      >
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="planetGradient" cx="40%" cy="40%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#f5f5f5" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#e5e5e5" stopOpacity="0.05" />
          </radialGradient>
          
          {/* Ring gradient */}
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#f0f0f0" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#e0e0e0" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        {/* Planet sphere */}
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="url(#planetGradient)"
          stroke="#d0d0d0"
          strokeWidth="0.5"
          strokeOpacity="0.3"
        />
        
        {/* Subtle surface details */}
        <circle cx="70" cy="80" r="15" fill="#e8e8e8" fillOpacity="0.08" />
        <circle cx="120" cy="95" r="20" fill="#e8e8e8" fillOpacity="0.06" />
        <circle cx="90" cy="120" r="12" fill="#e8e8e8" fillOpacity="0.07" />
        
        {/* Ring (ellipse for perspective) */}
        <ellipse
          cx="100"
          cy="100"
          rx="90"
          ry="25"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="3"
          strokeOpacity="0.4"
        />
        
        {/* Ring shadow on planet */}
        <ellipse
          cx="100"
          cy="100"
          rx="50"
          ry="8"
          fill="#000000"
          fillOpacity="0.03"
        />
      </svg>
      
      {/* "Sales" text overlay */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ color: textColor }}
      >
        <span className="text-4xl font-bold tracking-wider opacity-60">
          SALES
        </span>
      </div>
    </div>
  );
}
