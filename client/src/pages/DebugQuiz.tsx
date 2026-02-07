/**
 * Quiz Results Debugger
 * Simple selector + iframe to preview quiz result pages
 */

import { useState } from 'react';

const resultOptions = [
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

export default function DebugQuiz() {
  const [selectedResult, setSelectedResult] = useState(resultOptions[0].id);
  
  const currentOption = resultOptions.find(opt => opt.id === selectedResult) || resultOptions[0];

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header with Selector */}
      <header className="border-b border-border bg-card px-4 py-3 flex items-center justify-center">
        <select
          value={selectedResult}
          onChange={(e) => setSelectedResult(e.target.value)}
          className="w-full max-w-md px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          {resultOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </header>

      {/* Iframe */}
      <div className="flex-1 w-full">
        <iframe
          key={currentOption.id}
          src={currentOption.url}
          className="w-full h-full border-0"
          title="Quiz Result Preview"
        />
      </div>
    </div>
  );
}
