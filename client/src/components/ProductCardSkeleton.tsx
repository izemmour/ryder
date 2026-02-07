import { Skeleton } from "@/components/ui/skeleton";

/**
 * ProductCardSkeleton - Loading placeholder for product selection cards
 * Matches the layout structure of setup image cards (1/2/4 pillows)
 */
export function ProductCardSkeleton() {
  return (
    <div className="relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Image area */}
      <Skeleton shimmer className="w-full aspect-square" />
      
      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton shimmer className="h-5 w-24 mx-auto" />
        
        {/* Price */}
        <div className="space-y-2">
          <Skeleton shimmer className="h-6 w-32 mx-auto" />
          <Skeleton shimmer className="h-4 w-40 mx-auto" />
        </div>
        
        {/* Savings badge */}
        <Skeleton shimmer className="h-8 w-full rounded-lg" />
      </div>
    </div>
  );
}

/**
 * ProductCardSkeletonRow - Row of product card skeletons
 * Shows 3 skeleton cards in a responsive row for quantity selection
 */
export function ProductCardSkeletonRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
