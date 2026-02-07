/**
 * Product Landing Page Template
 * 
 * Master template component that renders a complete landing page
 * based on the provided configuration. This is the main entry point
 * for all landing page variants.
 */

import { LandingPageProvider, useLandingPage } from '@/contexts/LandingPageContext';
import type { LandingPageConfig } from '@/config/types';

// Import the original Home page component
// We'll use it as the base until sections are fully extracted
import Home from '@/pages/Home';

interface ProductLandingTemplateProps {
  config: LandingPageConfig;
}

/**
 * Inner component that has access to the landing page context
 */
function ProductLandingContent() {
  const { config } = useLandingPage();
  
  // For now, render the original Home component
  // The Home component will be refactored to read from context
  // This allows for gradual migration without breaking the existing page
  return <Home configOverride={config} />;
}

/**
 * Main template component that wraps content with the config provider
 */
export function ProductLandingTemplate({ config }: ProductLandingTemplateProps) {
  return (
    <LandingPageProvider config={config}>
      <ProductLandingContent />
    </LandingPageProvider>
  );
}

export default ProductLandingTemplate;
