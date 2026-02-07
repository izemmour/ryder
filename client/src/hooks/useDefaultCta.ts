/**
 * Custom hook to fetch the default CTA button configuration from the backend
 */

import { trpc } from "@/lib/trpc";

export interface CtaButtonConfig {
  text: string;
  variant: string;
}

export function useDefaultCta() {
  const { data: defaultCta, isLoading, error } = trpc.ctaButtons.getDefault.useQuery();

  // Return default fallback if no CTA is configured
  const ctaConfig: CtaButtonConfig = {
    text: defaultCta?.text || "Order Now",
    variant: defaultCta?.variant || "primary",
  };

  return {
    cta: ctaConfig,
    isLoading,
    error,
    hasCustomCta: !!defaultCta,
  };
}
