import { useRef, useState, useEffect } from 'react';

interface LazyVideoProps {
  src: string;
  className?: string;
  ariaLabel?: string;
  captionSrc?: string;
  captionLabel?: string;
  captionLang?: string;
  poster?: string;
}

/**
 * LazyVideo - A video component that only loads when visible in viewport
 * Uses IntersectionObserver to defer video loading until needed
 * Reduces initial page weight and improves LCP
 */
export function LazyVideo({
  src,
  className = '',
  ariaLabel,
  captionSrc,
  captionLabel = 'English',
  captionLang = 'en',
  poster
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before entering viewport
        threshold: 0.1
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [hasLoaded]);

  // Auto-play when video becomes visible
  useEffect(() => {
    if (isVisible && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked by browser, ignore error
      });
    }
  }, [isVisible]);

  return (
    <div ref={containerRef} className={className}>
      {isVisible ? (
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          aria-label={ariaLabel}
          poster={poster}
        >
          {captionSrc && (
            <track 
              kind="captions" 
              src={captionSrc} 
              label={captionLabel} 
              srcLang={captionLang} 
              default 
            />
          )}
        </video>
      ) : (
        // Placeholder while video is not loaded
        <div 
          className="w-full h-full bg-secondary animate-pulse flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-12 h-12 rounded-full bg-muted/50" />
        </div>
      )}
    </div>
  );
}
