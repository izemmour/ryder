/**
 * Configuration Utilities
 * 
 * Helper functions for working with landing page configurations.
 */

import type { LandingPageConfig, PartialLandingPageConfig } from './types';
import { baseConfig } from './base.config';

/**
 * Deep merge two objects, with source values overriding target values.
 * Arrays are replaced entirely, not merged.
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = target[key];
      
      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        // Recursively merge objects
        (result as any)[key] = deepMerge(targetValue, sourceValue);
      } else if (sourceValue !== undefined) {
        // Replace value (including arrays)
        (result as any)[key] = sourceValue;
      }
    }
  }
  
  return result;
}

/**
 * Create a complete landing page configuration by merging
 * a partial config with the base configuration.
 */
export function createConfig(partial: PartialLandingPageConfig): LandingPageConfig {
  return deepMerge(baseConfig, partial as Partial<LandingPageConfig>);
}

/**
 * Get a specific section's configuration from a landing page config.
 */
export function getSectionConfig<K extends keyof LandingPageConfig>(
  config: LandingPageConfig,
  sectionKey: K
): LandingPageConfig[K] {
  return config[sectionKey];
}

/**
 * Check if a section is enabled in the current configuration.
 */
export function isSectionEnabled(
  config: LandingPageConfig,
  sectionId: string
): boolean {
  return config.sections.includes(sectionId as any);
}

/**
 * Get the order index of a section (for sorting).
 */
export function getSectionOrder(
  config: LandingPageConfig,
  sectionId: string
): number {
  const index = config.sections.indexOf(sectionId as any);
  return index === -1 ? 999 : index;
}
