/**
 * Demo Page - Split Screen Comparison
 * Showcases context-aware customization with highlight toggle
 */

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Left iframe options (Angles, Events, Use Cases)
const leftOptions = [
  // Angles
  { id: 'down-alternative', label: 'Down Alternative (Default)', category: 'angle', url: '/' },
  { id: 'restorative-alignment', label: 'Restorative Alignment', category: 'angle', url: '/restorative-alignment-pillow' },
  { id: 'hotel-quality', label: 'Hotel Quality', category: 'angle', url: '/hotel-quality-pillow' },
  { id: 'neck-pain-relief', label: 'Neck Pain Relief', category: 'angle', url: '/neck-pain-relief-pillow' },
  
  // Events
  { id: 'valentine-gift', label: 'Valentine\'s Day Gift', category: 'event', url: '/valentine-gift' },
  { id: 'mothers-day', label: 'Mother\'s Day Gift', category: 'event', url: '/mothers-day-gift' },
  { id: 'fathers-day', label: 'Father\'s Day Gift', category: 'event', url: '/fathers-day-gift' },
  
  // Use Cases
  { id: 'side-sleeper', label: 'Side Sleeper Solution', category: 'use-case', url: '/side-sleeper-pillow' },
];

// Right iframe options (Quiz Results) - matching DebugQuiz exactly
const rightOptions = [
  { 
    id: 'all-selectors', 
    label: 'All Selectors', 
    url: '/?from=quiz&profile=side-sleeper&tags=side-sleeper,back-sleeper,stomach-sleeper,neck-pain,shoulder-pain,hot-sleeper,allergies,old-pillow,very-old-pillow&labels=Made%20for%20Side%20Sleepers,Neck%20Pain%20Relief,Cooling%20Technology,Hypoallergenic,Shoulder%20Pressure%20Relief,Hotel%20Grade%20Quality' 
  },
  { 
    id: 'side-sleeper', 
    label: 'Side Sleeper', 
    url: '/?from=quiz&profile=side-sleeper&tags=side-sleeper,neck-pain&labels=Made%20for%20Side%20Sleepers,Neck%20Pain%20Relief' 
  },
  { 
    id: 'back-sleeper', 
    label: 'Back Sleeper', 
    url: '/?from=quiz&profile=back-sleeper&tags=back-sleeper,neck-support&labels=Made%20for%20Back%20Sleepers,Neck%20Support' 
  },
  { 
    id: 'stomach-sleeper', 
    label: 'Stomach Sleeper', 
    url: '/?from=quiz&profile=stomach-sleeper&tags=stomach-sleeper,low-profile&labels=Made%20for%20Stomach%20Sleepers,Low%20Profile%20Support' 
  },
  { 
    id: 'hot-sleeper', 
    label: 'Hot Sleeper', 
    url: '/?from=quiz&profile=hot-sleeper&tags=hot-sleeper,cooling&labels=Cooling%20Technology,Temperature%20Regulation' 
  },
  { 
    id: 'neck-pain', 
    label: 'Neck Pain Sufferer', 
    url: '/?from=quiz&profile=neck-pain&tags=neck-pain,shoulder-pain&labels=Neck%20Pain%20Relief,Shoulder%20Pressure%20Relief' 
  },
  { 
    id: 'old-pillow', 
    label: 'Old Pillow (2-5 years)', 
    url: '/?from=quiz&profile=side-sleeper&tags=side-sleeper,old-pillow,neck-pain&labels=Made%20for%20Side%20Sleepers,Pillow%20Needs%20Replacing,Neck%20Pain%20Relief' 
  },
  { 
    id: 'very-old-pillow', 
    label: 'Very Old Pillow (5+ years)', 
    url: '/?from=quiz&profile=side-sleeper&tags=side-sleeper,very-old-pillow,neck-pain,allergies&labels=Made%20for%20Side%20Sleepers,Pillow%20Needs%20Replacing,Neck%20Pain%20Relief,Hypoallergenic' 
  },
  { 
    id: 'allergies', 
    label: 'Allergy Sufferer', 
    url: '/?from=quiz&profile=side-sleeper&tags=side-sleeper,allergies,old-pillow&labels=Hypoallergenic,Dust%20Mite%20Resistant,Pillow%20Needs%20Replacing' 
  },
  { 
    id: 'full-combo', 
    label: 'Full Combo (All Tags)', 
    url: '/?from=quiz&profile=side-sleeper&tags=side-sleeper,neck-pain,old-pillow,hot-sleeper,allergies&labels=Made%20for%20Side%20Sleepers,Neck%20Pain%20Relief,Pillow%20Needs%20Replacing,Cooling%20Technology,Hypoallergenic' 
  },
];

export default function DemoPage() {
  const [leftSelected, setLeftSelected] = useState(leftOptions[0].id);
  const [rightSelected, setRightSelected] = useState(rightOptions[0].id);
  const [contextHighlight, setContextHighlight] = useState(false);
  const [leftIframeKey, setLeftIframeKey] = useState(0);
  const [rightIframeKey, setRightIframeKey] = useState(0);
  
  const currentLeftOption = leftOptions.find(opt => opt.id === leftSelected) || leftOptions[0];
  const currentRightOption = rightOptions.find(opt => opt.id === rightSelected) || rightOptions[0];
  
  // Determine if current page is an event page
  const isEventPage = currentLeftOption.category === 'event' || currentRightOption.url.includes('event');
  
  // Inject context highlight styles into iframes
  useEffect(() => {
    if (!contextHighlight) return;
    
    const injectStyles = (iframe: HTMLIFrameElement) => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;
        
        // Remove existing style if present
        const existingStyle = iframeDoc.getElementById('context-highlight-style');
        if (existingStyle) existingStyle.remove();
        
        // Create style element
        const style = iframeDoc.createElement('style');
        style.id = 'context-highlight-style';
        
        // Define context-specific selectors (elements that should stay visible)
        // These are elements that are customized based on context (quiz results, angles, events)
        const contextSelectors = [
          '[data-context-badge]',
          '[data-quiz-badge]',
          '[data-angle-specific]',
          '[data-event-specific]',
          '[data-profile-banner]',
          '[data-customized]',
          '.profile-results-banner',
          '.quiz-mini-section',
          // Add more selectors as needed
        ].join(', ');
        
        // CSS for context highlight mode
        style.textContent = `
          /* Smooth transition for all elements */
          * {
            transition: opacity 2s ease, filter 2s ease !important;
          }
          
          /* Fade legacy elements */
          body > *:not(${contextSelectors}) {
            opacity: 0.3 !important;
          }
          
          /* Keep context-specific elements fully visible */
          ${contextSelectors} {
            opacity: 1 !important;
            position: relative;
            z-index: 10;
          }
          
          /* Black and white inversion for non-event pages */
          ${!isEventPage ? `
            body {
              filter: invert(1) hue-rotate(180deg);
            }
            
            /* Preserve image colors */
            img, video, picture, svg, canvas {
              filter: invert(1) hue-rotate(180deg);
            }
          ` : ''}
        `;
        
        iframeDoc.head.appendChild(style);
      } catch (error) {
        console.error('Failed to inject styles into iframe:', error);
      }
    };
    
    // Wait for iframes to load
    const leftIframe = document.getElementById('left-iframe') as HTMLIFrameElement;
    const rightIframe = document.getElementById('right-iframe') as HTMLIFrameElement;
    
    if (leftIframe) {
      leftIframe.addEventListener('load', () => injectStyles(leftIframe));
      if (leftIframe.contentDocument?.readyState === 'complete') {
        injectStyles(leftIframe);
      }
    }
    
    if (rightIframe) {
      rightIframe.addEventListener('load', () => injectStyles(rightIframe));
      if (rightIframe.contentDocument?.readyState === 'complete') {
        injectStyles(rightIframe);
      }
    }
  }, [contextHighlight, isEventPage, leftIframeKey, rightIframeKey]);
  
  // Remove styles when toggle is off
  useEffect(() => {
    if (contextHighlight) return;
    
    const removeStyles = (iframe: HTMLIFrameElement) => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;
        
        const style = iframeDoc.getElementById('context-highlight-style');
        if (style) style.remove();
      } catch (error) {
        console.error('Failed to remove styles from iframe:', error);
      }
    };
    
    const leftIframe = document.getElementById('left-iframe') as HTMLIFrameElement;
    const rightIframe = document.getElementById('right-iframe') as HTMLIFrameElement;
    
    if (leftIframe) removeStyles(leftIframe);
    if (rightIframe) removeStyles(rightIframe);
  }, [contextHighlight]);
  
  // Force iframe reload when selection changes
  const handleLeftChange = (value: string) => {
    setLeftSelected(value);
    setLeftIframeKey(prev => prev + 1);
  };
  
  const handleRightChange = (value: string) => {
    setRightSelected(value);
    setRightIframeKey(prev => prev + 1);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between max-w-[1800px] mx-auto">
          <h1 className="text-xl font-semibold">Context Customization Demo</h1>
          
          {/* Context Highlight Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Context Highlight</span>
            <button
              onClick={() => setContextHighlight(!contextHighlight)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                contextHighlight ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  contextHighlight ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Split Screen Layout */}
      <div className="flex-1 flex gap-6 p-6 overflow-hidden">
        {/* Left Iframe */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Left Selector */}
          <div className="relative">
            <select
              value={leftSelected}
              onChange={(e) => handleLeftChange(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer hover:border-muted-foreground transition-colors"
            >
              <optgroup label="Angles">
                {leftOptions.filter(opt => opt.category === 'angle').map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Events">
                {leftOptions.filter(opt => opt.category === 'event').map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Use Cases">
                {leftOptions.filter(opt => opt.category === 'use-case').map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          
          {/* Left Iframe */}
          <div className="flex-1 rounded-lg border border-border overflow-hidden bg-card">
            <iframe
              id="left-iframe"
              key={leftIframeKey}
              src={currentLeftOption.url}
              className="w-full h-full border-0"
              title="Left Preview"
            />
          </div>
        </div>

        {/* Right Iframe */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Right Selector */}
          <div className="relative">
            <select
              value={rightSelected}
              onChange={(e) => handleRightChange(e.target.value)}
              className="w-full px-4 py-2.5 pr-10 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer hover:border-muted-foreground transition-colors"
            >
              {rightOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          
          {/* Right Iframe */}
          <div className="flex-1 rounded-lg border border-border overflow-hidden bg-card">
            <iframe
              id="right-iframe"
              key={rightIframeKey}
              src={currentRightOption.url}
              className="w-full h-full border-0"
              title="Right Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
