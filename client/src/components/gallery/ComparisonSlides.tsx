/**
 * Comparison Slides Components
 * 
 * These are the VS and Hotel Comparison slides used in the gallery.
 * They are consistent across all pages and don't need customization.
 */

import { Check, X, Moon, Sparkles } from 'lucide-react';
import FluffLogo from '@/components/FluffLogo';

/**
 * Comparison Slide - Standard Pillows vs FluffCo
 * Gallery slot 4 (VS)
 */
export function ComparisonSlide() {
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
 * Hotel Comparison Slide - FluffCo vs Luxury Hotels
 * Gallery slot 6 (hotel-compare)
 */
export function HotelComparisonSlide() {
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
            <div 
              key={idx} 
              className="flex-1 flex items-center text-[9px] lg:text-[11px] font-semibold text-white"
              style={{ animation: `fadeSlideIn 0.4s ease-out ${0.5 + idx * 0.1}s both` }}
            >
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
            <img 
              src="/images/four-seasons-logo.svg" 
              alt="Four Seasons" 
              className="h-4 lg:h-8 w-auto object-contain max-w-full"
            />
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
            <img 
              src="/images/ritz-carlton-logo.svg" 
              alt="The Ritz-Carlton" 
              className="h-4 lg:h-8 w-auto object-contain max-w-full"
            />
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
            <img 
              src="/images/optimized/marriott-logo-small.webp" 
              alt="Marriott" 
              className="h-4 lg:h-6 w-auto object-contain brightness-0 invert opacity-70"
            />
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
 * Comparison Thumbnail - Mini preview for VS slide
 */
export function ComparisonThumbnail() {
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
 * Hotel Comparison Thumbnail - Mini preview for hotel comparison slide
 */
export function HotelComparisonThumbnail() {
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
