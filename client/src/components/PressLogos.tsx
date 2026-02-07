// PressLogos component - Seamless infinite scroll animation with real SVG logos
// Fixed: Using CSS animation with proper transform-gpu and backface-visibility
// Updated: Dynamic gradient background color for event pages

interface PressLogosProps {
  backgroundColor?: string; // CSS color value for gradient fade (e.g., 'rgb(255, 245, 245)' or '#fff5f5')
}

const PressLogos = ({ backgroundColor = 'rgb(243, 241, 236)' }: PressLogosProps) => {
  // All logos with uniform heights
  const logos = [
    { name: "Forbes", src: "/images/forbes-logo.svg", height: "h-6 lg:h-7" },
    { name: "Elle", src: "/images/elle-logo.svg", height: "h-7 lg:h-9" },
    { name: "Good Housekeeping", src: "/images/good-housekeeping-logo.svg", height: "h-6 lg:h-7" },
    { name: "Good Morning America", src: "/images/gma-logo.svg", height: "h-6 lg:h-8" },
    { name: "USA Today", src: "/images/usa-today-logo.svg", height: "h-7 lg:h-9" },
    { name: "Business Insider", src: "/images/business-insider-logo.svg", height: "h-5 lg:h-6" },
    { name: "Oprah Daily", src: "/images/oprah-daily-logo.svg", height: "h-6 lg:h-7" },
  ];

  // Convert hex to rgba for gradient transparency
  const hexToRgba = (hex: string, alpha: number = 1): string => {
    // If already rgb/rgba format, handle it
    if (hex.startsWith('rgb')) {
      const match = hex.match(/[\d.]+/g);
      if (match && match.length >= 3) {
        return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${alpha})`;
      }
      return hex;
    }
    
    // Handle hex format
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const solidColor = backgroundColor;
  const transparentColor = hexToRgba(backgroundColor, 0);

  const LogoSet = () => (
    <div className="flex items-center shrink-0">
      {logos.map((logo, index) => (
        <div
          key={index}
          className="px-8 lg:px-12 flex items-center justify-center shrink-0"
        >
          <img
            src={logo.src}
            alt={logo.name}
            className={`${logo.height} w-auto object-contain pointer-events-none select-none`}
            style={{ filter: 'brightness(0)' }}
            loading="eager"
            draggable="false"
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden py-6 lg:py-8">
      {/* Gradient fade on left */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-20 lg:w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${solidColor}, ${transparentColor})` }}
      />
      
      {/* Gradient fade on right */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-20 lg:w-32 z-10 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${solidColor}, ${transparentColor})` }}
      />
      
      {/* Scrolling container - two identical sets for seamless loop */}
      <div 
        className="flex animate-marquee"
        style={{ 
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          perspective: 1000,
          WebkitPerspective: 1000,
        }}
      >
        <LogoSet />
        <LogoSet />
      </div>
    </div>
  );
};

export default PressLogos;
