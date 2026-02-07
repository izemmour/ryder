/**
 * EventClosedPage - Displayed when an event landing page is outside its active date range
 * Shows a branded, simple page with a redirect to the main product page
 */

import { useLocation } from "wouter";
import FluffLogo from "@/components/FluffLogo";

interface EventClosedPageProps {
  eventName: string;
  eventId: string;
  status: 'not-started' | 'ended';
  startDate?: Date;
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

export function EventClosedPage({ eventName, status, startDate, colorScheme }: EventClosedPageProps) {
  const [, setLocation] = useLocation();
  
  // Default Valentine color scheme
  const colors = colorScheme || {
    primary: '#c41e3a',
    secondary: '#8b1a2d',
    accent: '#fff5f5',
    background: '#fff8f8'
  };

  const getHeadline = () => {
    if (status === 'not-started') {
      return "You're Early!";
    }
    return "This Deal Has Wrapped Up!";
  };

  const getSubheadline = () => {
    if (status === 'not-started' && startDate) {
      const now = new Date();
      const diff = startDate.getTime() - now.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      
      if (days === 1) {
        return `Our ${eventName} special starts tomorrow. Mark your calendar!`;
      } else if (days <= 7) {
        return `Our ${eventName} special starts in ${days} days. Get ready for something special!`;
      } else {
        const month = startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        return `Our ${eventName} special begins ${month}. We can't wait to see you then!`;
      }
    }
    return `Our ${eventName} special has ended, but great sleep never goes out of style.`;
  };

  const getButtonText = () => {
    if (status === 'not-started') {
      return "Browse Our Collection";
    }
    return "Shop the Regular Collection";
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: colors.background }}
    >
      {/* Logo */}
      <div className="mb-8">
        <FluffLogo className="h-8 w-auto" />
      </div>

      {/* Main Content Card */}
      <div 
        className="max-w-md w-full text-center p-8 rounded-2xl shadow-lg"
        style={{ backgroundColor: 'white' }}
      >
        {/* Icon */}
        <div 
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.accent }}
        >
          {status === 'not-started' ? (
            <svg className="w-10 h-10" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-10 h-10" style={{ color: colors.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          )}
        </div>

        {/* Headline */}
        <h1 
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: colors.secondary }}
        >
          {getHeadline()}
        </h1>

        {/* Subheadline */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          {getSubheadline()}
        </p>

        {/* CTA Button */}
        <button
          onClick={() => setLocation('/')}
          className="w-full py-3 px-6 rounded-full font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg"
          style={{ backgroundColor: colors.primary }}
        >
          {getButtonText()}
        </button>

        {/* Secondary Link - Only show contact for ended events */}
        {status === 'ended' && (
          <p className="mt-4 text-sm text-gray-500">
            Questions? <a href="mailto:hello@fluff.co" className="underline hover:no-underline" style={{ color: colors.primary }}>Contact us</a>
          </p>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} FluffCo. Premium sleep, always.
      </p>
    </div>
  );
}
