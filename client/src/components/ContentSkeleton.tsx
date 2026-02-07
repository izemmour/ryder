import { useState, useEffect, ReactNode } from 'react';

interface ContentSkeletonProps {
  /**
   * The actual content to show after loading
   */
  children: ReactNode;
  /**
   * The skeleton component to show during loading
   */
  skeleton: ReactNode;
  /**
   * Delay in ms before showing content (simulates initial load)
   * @default 100
   */
  delay?: number;
  /**
   * Whether to skip skeleton and show content immediately
   * Useful for cached/fast loads
   * @default false
   */
  skipSkeleton?: boolean;
}

/**
 * ContentSkeleton - Wrapper that shows skeleton during initial render
 * 
 * Provides a brief skeleton screen during the first ~100ms of page load
 * to improve perceived performance, especially on slower devices.
 * 
 * Usage:
 * ```tsx
 * <ContentSkeleton skeleton={<TestimonialSkeletonGrid />}>
 *   <TestimonialGrid testimonials={testimonials} />
 * </ContentSkeleton>
 * ```
 */
export function ContentSkeleton({
  children,
  skeleton,
  delay = 100,
  skipSkeleton = false,
}: ContentSkeletonProps) {
  const [isReady, setIsReady] = useState(skipSkeleton);

  useEffect(() => {
    if (skipSkeleton) return;
    
    const timer = setTimeout(() => {
      setIsReady(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, skipSkeleton]);

  if (!isReady) {
    return <>{skeleton}</>;
  }

  return (
    <div className="animate-fade-in-up">
      {children}
    </div>
  );
}
