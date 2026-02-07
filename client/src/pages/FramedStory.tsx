/**
 * FRAMED STORY - 5-Star Hotel Comfort Conversion Funnel
 * 
 * A 6-screen slide-style conversion funnel that tells a story from problem to solution.
 * Matches existing landing page design system: colors, typography, spacing, shadows, CTAs.
 * 
 * Design System:
 * - Brand Colors: #2d3a5c (navy), #c9a962 (gold), #e63946 (red CTA)
 * - Typography: Inter font, antialiased, standard text classes (text-base, text-lg, text-xl, etc.)
 * - Spacing: Consistent padding/margins matching Home.tsx
 * - CTAs: cta-primary class (red, rounded-full)
 * - Shadows: Subtle (0 1px 4px rgba)
 * - Radius: 0.5rem (md), 1rem (lg)
 */

import { useState, useEffect } from "react";
import { ChevronDown, Check, X, Star, Shield, Thermometer, Wind, Heart, Sparkles, Droplets, RefreshCw, Store, Truck, Tag, Gift, Clock, TrendingDown } from "lucide-react";
import FluffLogo from "@/components/FluffLogo";
import PressLogos from "@/components/PressLogos";
import { useLocation } from "wouter";
import { useGeolocation, isUSVisitor, useNonUsBadgeText, useNonUsAlternativeUsp } from '@/hooks/useGeolocation';
import type { FramedStoryConfig } from "@/config/types";

interface FramedStoryProps {
  config: FramedStoryConfig;
}

export default function FramedStory({ config }: FramedStoryProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [userResponse, setUserResponse] = useState<string | null>(null);
  const [showInventorySearch, setShowInventorySearch] = useState(false);
  const [, setLocation] = useLocation();
  
  // Geo-detection for conditional shipping display
  const { countryCode } = useGeolocation();
  const isUS = countryCode ? isUSVisitor(countryCode) : true; // Default to US if unknown
  const nonUsBadgeText = useNonUsBadgeText(); // Configurable badge for non-US visitors

  // Auto-show continue button after animations complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContinue(true);
    }, 3000); // 3s for text animations
    return () => clearTimeout(timer);
  }, [currentScreen]);

  const handleContinue = () => {
    // Show inventory search animation before Screen 6
    if (currentScreen === 4) {
      setShowInventorySearch(true);
      setTimeout(() => {
        setShowInventorySearch(false);
        setCurrentScreen(5);
        setShowContinue(false);
        setUserResponse(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 3000); // 3s inventory search
    } else if (currentScreen < 5) {
      setCurrentScreen(currentScreen + 1);
      setShowContinue(false);
      setUserResponse(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleResponse = (response: string) => {
    setUserResponse(response);
    setTimeout(() => {
      setShowContinue(true);
    }, 1500);
  };

  const handleFinalCTA = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with white logo on white background */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="bg-white px-3 py-2 rounded">
            <FluffLogo className="h-8 w-auto" />
          </div>
          <button
            onClick={() => setLocation("/")}
            className="text-[#2d3a5c] text-sm font-medium hover:opacity-80 transition-opacity"
          >
            Skip to Shop
          </button>
        </div>
      </header>

      {/* Inventory Search Animation Overlay */}
      {showInventorySearch && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md px-4">
            <div className="w-16 h-16 border-4 border-[#2d3a5c] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-2xl font-semibold text-[#2d3a5c]">Checking Inventory...</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="animate-[fadeIn_0.5s_ease-out_0.5s_both]">✓ New York warehouse</p>
              <p className="animate-[fadeIn_0.5s_ease-out_1s_both]">✓ Los Angeles warehouse</p>
              <p className="animate-[fadeIn_0.5s_ease-out_1.5s_both]">✓ Dallas warehouse</p>
            </div>
          </div>
        </div>
      )}

      {/* Main content - full viewport sections */}
      <main>
        {currentScreen === 0 && <Screen1 onContinue={handleContinue} showContinue={showContinue} onResponse={handleResponse} userResponse={userResponse} />}
        {currentScreen === 1 && <Screen2 onContinue={handleContinue} showContinue={showContinue} onResponse={handleResponse} userResponse={userResponse} />}
        {currentScreen === 2 && <Screen3 onContinue={handleContinue} showContinue={showContinue} />}
        {currentScreen === 3 && <Screen4 onContinue={handleContinue} showContinue={showContinue} />}
        {currentScreen === 4 && <Screen5 onContinue={handleContinue} showContinue={showContinue} />}
        {currentScreen === 5 && <Screen6 onContinue={() => {}} showContinue={showContinue} />}
      </main>


    </div>
  );
}

// Screen 1: The Problem
function Screen1({ onContinue, showContinue, onResponse, userResponse }: any) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden text-white">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/framed-story-luxury-hotel-bed.png" 
          alt="Luxury hotel bed" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2d3a5c]/90 to-[#1a2438]/95"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
          <span className="block animate-[fadeIn_0.8s_ease-out_0.2s_both]">
            Remember that 5-star hotel bed?
          </span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-white/90">
          <span className="block animate-[fadeIn_0.8s_ease-out_0.8s_both]">
            Plush pillows, cloud-like bedding…
          </span>
          <span className="block animate-[fadeIn_0.8s_ease-out_1.2s_both]">
            pure bliss.
          </span>
        </p>
        
        <p className="text-base md:text-lg text-white/70">
          <span className="block animate-[fadeIn_0.8s_ease-out_1.6s_both]">
            Then you came home to <em>your</em> bed…
          </span>
          <span className="block animate-[fadeIn_0.8s_ease-out_2s_both]">
            Not quite the same, is it?
          </span>
        </p>
        
        <p className="text-xl md:text-2xl lg:text-3xl font-medium text-[#c9a962] animate-[fadeIn_0.8s_ease-out_2.4s_both]">
          Why can't every night feel that good?
        </p>

        {!userResponse && (
          <div className="pt-8 animate-[fadeIn_1s_ease-out_2s_both]">
            <p className="text-base md:text-lg mb-4">Ever felt this difference?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onResponse("yes")}
                className="bg-white text-[#2d3a5c] px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-all shadow-md text-base"
              >
                Yes, I have
              </button>
              <button
                onClick={() => onResponse("no")}
                className="bg-white/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all border-2 border-white/40 text-base"
              >
                Not really
              </button>
            </div>
          </div>
        )}

        {/* Popup Modal for Response */}
        {userResponse && (
          <div className="fixed inset-0 z-50 flex items-end justify-center animate-[slideUp_0.5s_ease-out]">
            <div className="bg-white rounded-t-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full mx-4 mb-0">
              <div className="text-center space-y-4 md:space-y-6">
                {userResponse === "yes" && (
                  <>
                    <div className="text-4xl md:text-5xl mb-4">👍</div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#2d3a5c]">
                      You're not alone!
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600">
                      Most of us have felt this difference. Let's fix it.
                    </p>
                  </>
                )}
                {userResponse === "no" && (
                  <>
                    <div className="text-4xl md:text-5xl mb-4">🤔</div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#2d3a5c]">
                      Lucky you!
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600">
                      But keep reading – you're about to discover what you're missing.
                    </p>
                  </>
                )}
                {showContinue && (
                  <button
                    onClick={onContinue}
                    className="cta-primary mt-4 text-base md:text-lg px-8 md:px-12 py-3 md:py-4"
                  >
                    Find Out Why →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <ChevronDown className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-8 text-white/50 animate-bounce" />
    </section>
  );
}

// Screen 2: The Realization
function Screen2({ onContinue, showContinue, onResponse, userResponse }: any) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-[#1a1a1a]">
          <span className="block animate-[fadeIn_0.8s_ease-out_0.2s_both]">
            It's not you — it's your pillow (and your sheets).
          </span>
        </h2>
        
        <p className="text-base md:text-lg text-gray-700 animate-[fadeIn_0.8s_ease-out_0.8s_both]">
          5-star hotels spend a fortune to make their beds heavenly.
        </p>
        <p className="text-sm md:text-base text-gray-500 animate-[fadeIn_0.8s_ease-out_1.2s_both]">
          (They know a great pillow makes guests come back!)
        </p>
        
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 md:p-8 my-8 animate-[fadeIn_0.8s_ease-out_1.6s_both]">
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#e63946] mb-4">
            $150–$200+ EACH
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-2">
            Those exact hotel pillows can cost this much if you try to buy one.
          </p>
          <p className="text-sm md:text-base text-gray-500">
            (No joke – the pillow used by the Four Seasons starts at $200.)
          </p>
        </div>
        
        <p className="text-base md:text-lg text-gray-600 animate-[fadeIn_0.8s_ease-out_2s_both]">
          So, you go for $20 big-box store pillows... and you get $20 sleep.
        </p>
        
        <p className="text-xl md:text-2xl lg:text-3xl font-medium text-[#c9a962] animate-[fadeIn_0.8s_ease-out_2.4s_both]">
          What if you could get that 5-star luxury without the 5-star price?
        </p>

        {!userResponse && (
          <div className="pt-8 animate-[fadeIn_1s_ease-out_2s_both]">
            <p className="text-base md:text-lg mb-4">Be honest, would you ever spend $200 on a pillow?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onResponse("no")}
                className="bg-[#e63946] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d32f3c] transition-all shadow-md text-base"
              >
                No way!
              </button>
              <button
                onClick={() => onResponse("maybe")}
                className="bg-gray-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-700 transition-all text-base"
              >
                If it was that good… maybe
              </button>
            </div>
          </div>
        )}

        {/* Popup Modal for Response */}
        {userResponse && (
          <div className="fixed inset-0 z-50 flex items-end justify-center animate-[slideUp_0.5s_ease-out]">
            <div className="bg-white rounded-t-3xl shadow-2xl p-6 md:p-8 max-w-2xl w-full mx-4 mb-0">
              <div className="text-center space-y-4 md:space-y-6">
                {userResponse === "no" && (
                  <>
                    <div className="text-4xl md:text-5xl mb-4">🤷</div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#2d3a5c]">
                      We don't blame you!
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600">
                      That price is crazy. But what if you didn't have to pay it?
                    </p>
                  </>
                )}
                {userResponse === "maybe" && (
                  <>
                    <div className="text-4xl md:text-5xl mb-4">💭</div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-[#2d3a5c]">
                      Fair enough!
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600">
                      Quality matters. But what if you could get it for way less?
                    </p>
                  </>
                )}
                {showContinue && (
                  <button
                    onClick={onContinue}
                    className="cta-primary mt-4 text-base md:text-lg px-8 md:px-12 py-3 md:py-4"
                  >
                    See How It's Possible →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// Screen 3: The Solution
function Screen3({ onContinue, showContinue }: any) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-[#1a1a1a]">
          <span className="block animate-[fadeIn_0.8s_ease-out_0.2s_both]">
            Good news: You can have 5-star hotel comfort at home.
          </span>
        </h2>
        
        <p className="text-base md:text-lg text-gray-700 animate-[fadeIn_0.8s_ease-out_0.8s_both]">
          We went straight to the source – the same factories that supply 5-star hotels.
        </p>
        <p className="text-sm md:text-base text-[#c9a962] font-medium animate-[fadeIn_0.8s_ease-out_1.2s_both]">
          (Yes, the exact ones that make those $200 pillows!)
        </p>
        
        <p className="text-base md:text-lg text-gray-600 animate-[fadeIn_0.8s_ease-out_1.6s_both]">
          No outrageous hotel markups – just honest pricing for you.
        </p>
        
        <div className="my-8 animate-[fadeIn_0.8s_ease-out_2s_both]">
          <h3 className="text-xl md:text-2xl font-semibold text-[#2d3a5c] mb-4">
            That's why we created FluffCo.
          </h3>
          <FluffLogo className="h-12 md:h-16 w-auto mx-auto mb-6" />
        </div>
        
        <div className="rounded-2xl overflow-hidden shadow-xl animate-[fadeIn_0.8s_ease-out_2.4s_both]">
          <img 
            src="/images/framed-story-product-lifestyle.png" 
            alt="FluffCo pillows on bed" 
            className="w-full h-auto"
          />
        </div>
        
        <p className="text-xl md:text-2xl font-medium text-[#2d3a5c] pt-6 animate-[fadeIn_0.8s_ease-out_2.8s_both]">
          5-star Hotel Quality, at home — without the 5-star price.
        </p>

        {showContinue && (
          <button
            onClick={onContinue}
            className="cta-primary mt-8 text-base md:text-lg px-8 md:px-12 py-3 md:py-4"
          >
            Meet the Pillows →
          </button>
        )}
      </div>
    </section>
  );
}

// Screen 4: Product Introduction
function Screen4({ onContinue, showContinue }: any) {
    const benefits = [
      { 
        icon: <Sparkles className="w-6 h-6" />, 
        title: "Forever Fluffy", 
        description: "Maintains perfect loft night after night",
        image: "/images/benefit-forever-fluffy.png"
      },
      { 
        icon: <Wind className="w-6 h-6" />, 
        title: "Cool & Breathable", 
        description: "Temperature-regulating for all-night comfort",
        image: "/images/lifestyle-sleep.png"
      },
      { 
        icon: <Shield className="w-6 h-6" />, 
        title: "Pain-Free Sleep", 
        description: "Proper neck and spine alignment",
        image: "/images/neck-pain-cervical-alignment.png"
      },
      { 
        icon: <Droplets className="w-6 h-6" />, 
        title: "Hypoallergenic", 
        description: "Certified allergen-free materials",
        image: "/images/benefit-hypoallergenic.png"
      },
      { 
        icon: <RefreshCw className="w-6 h-6" />, 
        title: "Risk-Free Trial", 
        description: "100 nights to fall in love or return it",
        image: "/images/benefit-risk-free.png"
      }
    ];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-[#1a1a1a] mb-4">
            Meet Your 5<Star className="w-6 h-6 md:w-8 md:h-8 inline-block text-[#f5c542] fill-[#f5c542]" /> Pillow
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] opacity-0"
              style={{ 
                animation: `slideInUp 0.6s ease-out ${0.3 + index * 0.15}s forwards`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
              }}
            >
              <div className="flex items-start gap-4 p-0">
                {/* Left: Image */}
                <div className="w-1/3 flex-shrink-0 h-full">
                  <img 
                    src={benefit.image} 
                    alt={benefit.title} 
                    className="w-full h-full object-cover min-h-[120px]"
                  />
                </div>
                
                {/* Right: Content */}
                <div className="flex-1 py-5 pr-5">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="text-[#2d3a5c] opacity-80">
                      {benefit.icon}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-[#1a1a1a]">
                      {benefit.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showContinue && (
          <div className="text-center">
            <button
              onClick={onContinue}
              className="cta-primary text-base md:text-lg px-8 md:px-12 py-3 md:py-4"
            >
              See What Others Say →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// Screen 5: Social Proof (Reusing Homepage Design)
function Screen5({ onContinue, showContinue }: any) {
  // Geo-detection for conditional display
  const { countryCode } = useGeolocation();
  const isUS = countryCode ? isUSVisitor(countryCode) : true; // Default to US if unknown
  const nonUsAlternativeUsp = useNonUsAlternativeUsp(); // Replacement for "Made in USA" for non-US visitors
  
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 opacity-10">
        <img 
          src="/images/framed-story-happy-waking.png" 
          alt="Happy waking" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#1a1a1a] mb-4">
            746,000+ Happy Sleepers
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 md:w-8 md:h-8 text-[#f5c542] fill-[#f5c542]" />
            ))}
            <span className="text-xl md:text-2xl font-bold ml-2">4.9/5.0</span>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
              <Shield className="w-5 h-5 text-[#2d3a5c]" />
              <span className="text-sm font-medium">100 Night Better Sleep</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
              <Check className="w-5 h-5 text-[#22c55e]" />
              <span className="text-sm font-medium">Verified Buyers</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
              <Heart className="w-5 h-5 text-[#e63946]" />
              <span className="text-sm font-medium">{isUS ? 'Made in USA' : nonUsAlternativeUsp.title}</span>
            </div>
          </div>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-[#f5c542] fill-[#f5c542]" />
              ))}
            </div>
            <p className="text-base md:text-lg text-gray-800 mb-4 italic">
              "I've tried $200 hotel pillows and these are just as good. Can't believe the price!"
            </p>
            <p className="text-sm text-gray-500">— Sarah M., Verified Buyer</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-[#f5c542] fill-[#f5c542]" />
              ))}
            </div>
            <p className="text-base md:text-lg text-gray-800 mb-4 italic">
              "My neck pain is gone. Best investment in my sleep I've ever made."
            </p>
            <p className="text-sm text-gray-500">— Michael R., Verified Buyer</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-[#f5c542] fill-[#f5c542]" />
              ))}
            </div>
            <p className="text-base md:text-lg text-gray-800 mb-4 italic">
              "Stays fluffy for months. No more flattening after a few weeks like my old pillows."
            </p>
            <p className="text-sm text-gray-500">— Jennifer L., Verified Buyer</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-[#f5c542] fill-[#f5c542]" />
              ))}
            </div>
            <p className="text-base md:text-lg text-gray-800 mb-4 italic">
              "Ordered 4, got 4 free. Whole family is sleeping better. Amazing deal!"
            </p>
            <p className="text-sm text-gray-500">— David K., Verified Buyer</p>
          </div>
        </div>
        
        {/* Featured Badge */}
        <div className="bg-gradient-to-r from-[#f5f5f0] to-white rounded-xl p-6 mb-8 border border-gray-200 text-center">
          <Star className="w-8 h-8 text-[#f5c542] fill-[#f5c542] mx-auto mb-2" />
          <p className="text-lg md:text-xl font-semibold text-[#2d3a5c] mb-1">Featured in Oprah Daily</p>
          <p className="text-sm text-gray-600">"Best Sleep Award 2024"</p>
        </div>
        
        {/* Press Logos */}
        <div className="mb-8">
          <p className="text-center text-sm text-gray-500 mb-4">As seen in:</p>
          <PressLogos />
        </div>

        {showContinue && (
          <div className="text-center">
            <button
              onClick={onContinue}
              className="cta-primary text-base md:text-lg px-8 md:px-12 py-3 md:py-4"
            >
              Get Your Pillows →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

// Screen 6: Complete Offer Flow with Direct to You, Choose Your Setup, and Urgency
function Screen6({ onContinue, showContinue }: any) {
  const [selectedSize, setSelectedSize] = useState<"Standard" | "King">("Standard");
  const [stockPercentage, setStockPercentage] = useState(7);
  const [timeRemaining, setTimeRemaining] = useState(15 * 60); // 15 minutes in seconds
  
  // Geo-detection for conditional shipping display
  const { countryCode } = useGeolocation();
  const isUS = countryCode ? isUSVisitor(countryCode) : true; // Default to US if unknown
  const nonUsBadgeText = useNonUsBadgeText(); // Configurable badge for non-US visitors
  const nonUsAlternativeUsp = useNonUsAlternativeUsp(); // Replacement for "Made in USA" for non-US visitors

  // Stock countdown effect (drops from 7% to ~3%)
  useEffect(() => {
    const stockInterval = setInterval(() => {
      setStockPercentage(prev => {
        const newValue = prev - 0.1;
        return newValue > 3 ? newValue : 3;
      });
    }, 5000); // Drop every 5 seconds

    return () => clearInterval(stockInterval);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const pricing = {
    Standard: [
      { quantity: 1, price: 59.00, originalPrice: 119.00, savings: 60.00, discount: 50 },
      { quantity: 2, price: 89.00, originalPrice: 238.00, savings: 149.00, discount: 63, badge: "Most Popular" },
      { quantity: 4, price: 149.92, originalPrice: 476.00, savings: 326.08, discount: 69, bonus: true, badge: "Best Value" }
    ],
    King: [
      { quantity: 1, price: 69.00, originalPrice: 139.00, savings: 70.00, discount: 50 },
      { quantity: 2, price: 109.00, originalPrice: 278.00, savings: 169.00, discount: 61, badge: "Most Popular" },
      { quantity: 4, price: 179.92, originalPrice: 556.00, savings: 376.08, discount: 68, bonus: true, badge: "Best Value" }
    ]
  };

  const currentPricing = pricing[selectedSize];

  return (
    <div className="bg-white">
      {/* Direct to You Pricing Component */}
      <section className="py-16 bg-[#1a1a2e] text-white">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Explanation */}
            <div>
              <div className="text-sm font-medium mb-2 text-[#e63946]">Direct to You</div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-6">
                Premium Quality.<br />Without the Premium Markup.
              </h2>
              <p className="text-white/70 leading-relaxed mb-6 text-base">
                Traditional retail adds layers of cost that have nothing to do with quality. Distributors, showroom rent, sales commissions. You pay for all of it. We cut them out.
              </p>
              <p className="text-white/70 leading-relaxed mb-8 text-base">
                By selling directly online, we deliver the same hotel-grade construction at a fraction of the price. No middlemen. No markups. Just a better pillow, shipped straight to your door.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#e63946]" />
                  <span>No retail markup</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#e63946]" />
                  <span>{isUS ? 'Free shipping' : nonUsBadgeText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#e63946]" />
                  <span>Factory direct</span>
                </div>
              </div>
            </div>

            {/* Right: Comparison Bar Graphs */}
            <div className="space-y-8">
              {/* Retail Price Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white/60">Retail Store Price</span>
                  <span className="text-lg font-bold">$119.00</span>
                </div>
                <div className="relative">
                  <div className="h-14 bg-white/10 rounded-lg overflow-hidden flex">
                    <div className="h-full bg-red-500/80 flex items-center justify-center text-xs md:text-sm font-medium" style={{ width: '14.7%' }}>
                      <span className="px-1">Mfg</span>
                    </div>
                    <div className="h-full bg-red-400/80 flex items-center justify-center text-xs md:text-sm font-medium" style={{ width: '17.2%' }}>
                      <span className="px-1">Dist</span>
                    </div>
                    <div className="h-full bg-red-300/80 flex items-center justify-center text-xs md:text-sm font-medium text-gray-800" style={{ width: '21%' }}>
                      <span className="px-1">Rent</span>
                    </div>
                    <div className="h-full bg-red-200/80 flex items-center justify-center text-xs md:text-sm font-medium text-gray-800" style={{ width: '13.4%' }}>
                      <span className="px-1">Staff</span>
                    </div>
                    <div className="h-full bg-red-100/80 flex items-center justify-center text-xs md:text-sm font-medium text-gray-800" style={{ width: '33.6%' }}>
                      <span className="px-1">Margin</span>
                    </div>
                  </div>
                  <div className="flex mt-2 text-xs text-white/40">
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
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white">FluffCo Direct Price</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/40 line-through">$119.00</span>
                    <span className="text-lg font-bold text-white">$37.48</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="h-14 bg-white/10 rounded-lg overflow-hidden flex">
                    <div className="h-full bg-white/90 flex items-center justify-center text-xs md:text-sm font-medium text-gray-800" style={{ width: '24%' }}>
                      <span className="px-1">Mfg</span>
                    </div>
                    <div className="h-full bg-white/70 flex items-center justify-center text-xs md:text-sm font-medium text-gray-800" style={{ width: '12%' }}>
                      <span className="px-1">Ship</span>
                    </div>
                    <div className="h-full bg-white/50 flex items-center justify-center text-xs md:text-sm font-medium text-gray-800" style={{ width: '15%' }}>
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

              {/* Savings Highlight */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-center">
                <p className="text-sm text-white/60 mb-2">You Save</p>
                <p className="text-3xl md:text-4xl font-bold text-white">$81.52</p>
                <p className="text-sm text-white/60 mt-1">per pillow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Your Setup */}
      <section className="py-16 bg-white">
        <div className="container px-4 max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1a1a1a] mb-3">Choose Your Setup</h2>
            <p className="text-base text-gray-600">{isUS ? 'Online-only pricing. Free shipping on all orders.' : `Online-only pricing. ${nonUsBadgeText}.`}</p>
          </div>

          {/* Size Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full p-1 bg-gray-100 border border-gray-200">
              <button
                onClick={() => setSelectedSize("Standard")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSize === "Standard"
                    ? "bg-[#2d3a5c] text-white shadow-md"
                    : "text-gray-600"
                }`}
              >
                Standard (20"×28")
              </button>
              <button
                onClick={() => setSelectedSize("King")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedSize === "King"
                    ? "bg-[#2d3a5c] text-white shadow-md"
                    : "text-gray-600"
                }`}
              >
                King (20"×36")
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {currentPricing.map((option) => {
              const setupImage = option.quantity === 1 
                ? '/images/optimized/setup/setup-1-pillow.png' 
                : option.quantity === 2 
                  ? '/images/optimized/setup/setup-2-pillows.png' 
                  : '/images/optimized/setup/setup-4-pillows.png';
              
              return (
                <div
                  key={option.quantity}
                  className={`rounded-2xl border-2 relative overflow-visible flex flex-col ${
                    option.quantity === 4 ? 'border-[#2d3a5c] bg-white shadow-lg' : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* Badge */}
                  {option.badge && (
                    <div className="absolute -top-3 right-4 z-20">
                      <span 
                        className="text-xs font-medium px-3 py-1 rounded-full shadow-md"
                        style={{
                          backgroundColor: option.badge === 'Best Value' ? '#e63946' : '#2d3a5c',
                          color: 'white'
                        }}
                      >
                        {option.badge}
                      </span>
                    </div>
                  )}
                  
                  {/* Image */}
                  <div className="relative aspect-video w-full bg-gray-100 rounded-t-[14px] overflow-hidden">
                    <img 
                      src={setupImage} 
                      alt={`${option.quantity} pillow setup`} 
                      className="w-full h-full object-cover object-top scale-[1.4] origin-top"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow text-left">
                    <div className="text-xl font-semibold mb-2">{option.quantity} Pillow{option.quantity > 1 ? 's' : ''}</div>
                    
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold">${option.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through">${option.originalPrice.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-green-600 font-medium mb-4">
                      Save ${option.savings.toFixed(2)}
                    </div>
                    
                    {/* Pillowcase bonus */}
                    {option.bonus && (
                      <div className="border-t border-b border-gray-200 py-2 my-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Gift className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-600">+ 2 Free Pillowcases</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-500 line-through">$116</span>
                          <span className="text-xs font-medium text-green-600">FREE</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex-grow"></div>
                    
                    <div className="text-center py-3 text-sm font-medium text-gray-500 border border-gray-200 rounded-full">
                      ${(option.price / option.quantity).toFixed(2)} per pillow
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-12 bg-gradient-to-b from-[#2d3a5c] to-[#1a2438] text-white">
        <div className="container px-4 max-w-4xl mx-auto">
          {/* Stock Warning */}
          <div className="bg-[#e63946]/20 border-2 border-[#e63946] rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <TrendingDown className="w-6 h-6 text-[#e63946] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">Limited Stock Alert</h3>
                <p className="text-white/80 mb-4 text-sm">
                  This exclusive offer is running low. Only <strong>{stockPercentage.toFixed(1)}%</strong> of inventory remaining.
                </p>
                
                {/* Stock Bar */}
                <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-[#e63946] h-full transition-all duration-1000 ease-out"
                    style={{ width: `${stockPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-6 h-6 text-[#f5c542]" />
              <p className="text-lg">Offer expires in:</p>
            </div>
            <div className="text-5xl md:text-6xl font-bold text-[#f5c542] mb-2">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-white/60">Don't miss out on hotel-quality sleep</p>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <a 
              href="/" 
              className="cta-primary text-lg px-12 py-5 inline-block no-underline shadow-2xl"
            >
              Claim Your Offer Now →
            </a>
            <p className="text-xs text-white/50 mt-4">100 Night Better Sleep • {isUS ? 'Free Shipping' : nonUsBadgeText} • Lifetime Warranty</p>
          </div>
        </div>
      </section>
    </div>
  );
}
