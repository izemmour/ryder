import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to show the shimmer animation instead of pulse
   * @default false
   */
  shimmer?: boolean;
}

/**
 * Skeleton component for loading states
 * Shows a pulsing or shimmering placeholder that matches the layout structure
 */
function Skeleton({ className, shimmer = false, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-accent rounded-md",
        shimmer ? "animate-shimmer bg-gradient-to-r from-accent via-accent/50 to-accent bg-[length:200%_100%]" : "animate-pulse",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
