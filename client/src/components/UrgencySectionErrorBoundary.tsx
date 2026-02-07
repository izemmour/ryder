import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for Urgency Section
 * 
 * Catches JavaScript errors in the urgency section (SVG animations, order counter, etc.)
 * and displays a fallback UI instead of crashing the entire page.
 * 
 * Usage:
 * ```tsx
 * <UrgencySectionErrorBoundary>
 *   <BlackFridayUrgencySection />
 * </UrgencySectionErrorBoundary>
 * ```
 */
export class UrgencySectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console for debugging
    console.error('[UrgencySectionErrorBoundary] Caught error:', error, errorInfo);
    
    // TODO: Send error to monitoring service (e.g., Sentry, LogRocket)
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI - minimal, non-intrusive error message
      return (
        <div className="w-full bg-gradient-to-br from-[#f5f1e8] to-[#e8dcc8] py-8 px-4 rounded-lg">
          <div className="container max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-[#8b7355]">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Limited stock available - order now to secure your Black Friday discount!
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper (for functional components)
 * 
 * Note: React doesn't support error boundaries as hooks yet,
 * so this is a wrapper around the class component.
 */
export function withUrgencySectionErrorBoundary<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WrappedComponent(props: P) {
    return (
      <UrgencySectionErrorBoundary>
        <Component {...props} />
      </UrgencySectionErrorBoundary>
    );
  };
}
