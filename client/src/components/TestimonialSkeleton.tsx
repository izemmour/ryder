import { Skeleton } from "@/components/ui/skeleton";

/**
 * TestimonialSkeleton - Loading placeholder for testimonial cards
 * Matches the layout structure of actual testimonial cards with shimmer animation
 */
export function TestimonialSkeleton() {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg lg:rounded-xl shadow-sm border border-gray-100">
      {/* Header with avatar and name */}
      <div className="flex items-center gap-3 mb-3">
        {/* Avatar */}
        <Skeleton shimmer className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          {/* Name */}
          <Skeleton shimmer className="h-4 w-32 mb-2" />
          {/* Verified badge */}
          <Skeleton shimmer className="h-3 w-20" />
        </div>
      </div>
      
      {/* Star rating */}
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} shimmer className="w-4 h-4" />
        ))}
      </div>
      
      {/* Testimonial text - 3 lines */}
      <div className="space-y-2">
        <Skeleton shimmer className="h-3 w-full" />
        <Skeleton shimmer className="h-3 w-full" />
        <Skeleton shimmer className="h-3 w-3/4" />
      </div>
    </div>
  );
}

/**
 * TestimonialSkeletonGrid - Grid of testimonial skeletons
 * Shows 6 skeleton cards in a responsive grid
 */
export function TestimonialSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {[...Array(6)].map((_, i) => (
        <TestimonialSkeleton key={i} />
      ))}
    </div>
  );
}
