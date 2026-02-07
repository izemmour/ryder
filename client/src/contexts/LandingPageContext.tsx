/**
 * Landing Page Context
 * 
 * Provides the current landing page configuration to all child components.
 * This allows sections to access their specific configuration without prop drilling.
 */

import { createContext, useContext, ReactNode } from 'react';
import type { LandingPageConfig } from '@/config/types';
import { baseConfig } from '@/config/base.config';

interface LandingPageContextValue {
  config: LandingPageConfig;
  // Utility functions
  isSectionEnabled: (sectionId: string) => boolean;
  getSectionOrder: (sectionId: string) => number;
}

const LandingPageContext = createContext<LandingPageContextValue | undefined>(undefined);

interface LandingPageProviderProps {
  config: LandingPageConfig;
  children: ReactNode;
}

export function LandingPageProvider({ config, children }: LandingPageProviderProps) {
  const value: LandingPageContextValue = {
    config,
    isSectionEnabled: (sectionId: string) => {
      return config.sections.includes(sectionId as any);
    },
    getSectionOrder: (sectionId: string) => {
      const index = config.sections.indexOf(sectionId as any);
      return index === -1 ? 999 : index;
    },
  };

  return (
    <LandingPageContext.Provider value={value}>
      {children}
    </LandingPageContext.Provider>
  );
}

export function useLandingPage(): LandingPageContextValue {
  const context = useContext(LandingPageContext);
  if (!context) {
    // Return default config if no provider (for backwards compatibility)
    return {
      config: baseConfig,
      isSectionEnabled: () => true,
      getSectionOrder: () => 0,
    };
  }
  return context;
}

export function useLandingPageConfig(): LandingPageConfig {
  return useLandingPage().config;
}

export default LandingPageContext;
