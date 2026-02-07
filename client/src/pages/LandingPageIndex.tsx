import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Link } from 'wouter';
import { landingPageConfigs } from '@/config';
import { Eye, Copy, Check, Lock, ExternalLink, LogOut, Calendar, ChevronDown, Palette, Clock, Target, ChevronRight, X, Save } from 'lucide-react';

// Color scheme definitions for event landers
const colorSchemes = {
  'valentines-day': {
    name: "Valentine's",
    primary: '#c41e3a',
    secondary: '#fff5f5',
    accent: '#8b1538',
    preview: 'bg-gradient-to-r from-[#c41e3a] to-[#8b1538]'
  },
  'mothers-day': {
    name: "Mother's",
    primary: '#d4a5a5',
    secondary: '#fff9f9',
    accent: '#9b6b6b',
    preview: 'bg-gradient-to-r from-[#d4a5a5] to-[#9b6b6b]'
  },
  'fathers-day': {
    name: "Father's",
    primary: '#2c5282',
    secondary: '#f0f5ff',
    accent: '#1a365d',
    preview: 'bg-gradient-to-r from-[#2c5282] to-[#1a365d]'
  },
  'black-friday': {
    name: 'Black Friday',
    primary: '#1a1a1a',
    secondary: '#f5f5f5',
    accent: '#e63946',
    preview: 'bg-gradient-to-r from-[#1a1a1a] to-[#333]'
  },
  'christmas': {
    name: 'Christmas',
    primary: '#165b33',
    secondary: '#fef7f7',
    accent: '#bb2528',
    preview: 'bg-gradient-to-r from-[#165b33] to-[#bb2528]'
  },
};

type ColorSchemeKey = keyof typeof colorSchemes;

// Event date settings type
interface EventDateSettings {
  startDate: string;
  endDate: string;
}

// Marketing angle definitions for event pages
const marketingAngles = {
  '5-star-hotel': {
    name: '5-Star Hotel',
    description: 'Luxury hotel-grade',
    icon: '🏨'
  },
  'neck-pain': {
    name: 'Neck Pain',
    description: 'Alignment focus',
    icon: '💆'
  },
  'gift-focused': {
    name: 'Gift-Focused',
    description: 'Gifting aspects',
    icon: '🎁'
  },
  'restorative': {
    name: 'Restorative',
    description: 'Sleep quality',
    icon: '😴'
  }
};

type MarketingAngleKey = keyof typeof marketingAngles;

// Default event dates
const getDefaultEventDates = (eventType: string): EventDateSettings => {
  const year = new Date().getFullYear();
  switch (eventType) {
    case 'valentine-gift':
      return {
        startDate: `${year}-02-01`,
        endDate: `${year}-02-17`
      };
    case 'mothers-day':
      return {
        startDate: `${year}-04-15`,
        endDate: `${year}-05-15`
      };
    case 'fathers-day':
      return {
        startDate: `${year}-06-01`,
        endDate: `${year}-06-20`
      };
    case 'black-friday':
      return {
        startDate: `${year}-11-20`,
        endDate: `${year}-11-30`
      };
    case 'christmas':
      return {
        startDate: `${year}-12-01`,
        endDate: `${year}-12-26`
      };
    default:
      return {
        startDate: '',
        endDate: ''
      };
  }
};

// Categorize configs into Angles, Use Cases, and Events
const categorizeConfigs = () => {
  const eventConfigs = landingPageConfigs.filter(c => 
    c.id === 'valentine-gift' || c.id === 'mothers-day' || c.id === 'fathers-day' || c.slug.includes('holiday')
  );
  const useCaseConfigs = landingPageConfigs.filter(c =>
    c.id === 'side-sleeper'
  );
  const angleConfigs = landingPageConfigs.filter(c => 
    !eventConfigs.includes(c) && !useCaseConfigs.includes(c)
  );
  return { eventConfigs, angleConfigs, useCaseConfigs };
};

export default function LandingPageIndex() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedSchemes, setSelectedSchemes] = useState<Record<string, ColorSchemeKey>>({
    'valentine-gift': 'valentines-day',
    'mothers-day': 'mothers-day',
    'fathers-day': 'fathers-day'
  });
  const [selectedRedirectUrls, setSelectedRedirectUrls] = useState<Record<string, string>>(() => {
    const stored = localStorage.getItem('skyvane_redirect_urls');
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    return { 'side-sleeper': '/' };
  });
  const [eventDates, setEventDates] = useState<Record<string, EventDateSettings>>(() => {
    return {
      'valentine-gift': getDefaultEventDates('valentine-gift'),
      'mothers-day': getDefaultEventDates('mothers-day'),
      'fathers-day': getDefaultEventDates('fathers-day')
    };
  });
  const [pendingDates, setPendingDates] = useState<Record<string, EventDateSettings>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedAngles, setSelectedAngles] = useState<Record<string, MarketingAngleKey>>(() => {
    const stored = localStorage.getItem('skyvane_event_angles');
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    return {
      'valentine-gift': 'gift-focused',
      'mothers-day': 'neck-pain',
      'fathers-day': 'neck-pain'
    };
  });
  
  // Mobile tab state
  const [activeTab, setActiveTab] = useState<'angles' | 'events'>('angles');
  const [mobileExpanded, setMobileExpanded] = useState(false);
  
  // Time range filter for analytics
  const [timeRange, setTimeRange] = useState<180 | 30 | 7>(180);
  const [datesSaved, setDatesSaved] = useState<string | null>(null);

  const { eventConfigs, angleConfigs, useCaseConfigs } = categorizeConfigs();

  // Check for stored auth on mount
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('skyvane_lp_auth');
    if (storedAuth === 'authenticated') {
      setIsAuthenticated(true);
    }
    const storedDates = localStorage.getItem('skyvane_event_dates');
    if (storedDates) {
      try {
        const parsed = JSON.parse(storedDates);
        setEventDates(parsed);
        setPendingDates(parsed);
      } catch { /* ignore */ }
    } else {
      // Set defaults and save them
      const defaults = {
        'valentine-gift': getDefaultEventDates('valentine-gift'),
        'mothers-day': getDefaultEventDates('mothers-day'),
        'fathers-day': getDefaultEventDates('fathers-day')
      };
      setEventDates(defaults);
      setPendingDates(defaults);
      localStorage.setItem('skyvane_event_dates', JSON.stringify(defaults));
    }
  }, []);

  // Save selected angles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('skyvane_event_angles', JSON.stringify(selectedAngles));
  }, [selectedAngles]);

  // Save selected redirect URLs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('skyvane_redirect_urls', JSON.stringify(selectedRedirectUrls));
  }, [selectedRedirectUrls]);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Helper to close other dropdowns when one opens
  const handleDropdownToggle = (dropdownId: string) => {
    setOpenDropdown(prev => prev === dropdownId ? null : dropdownId);
  };

  const handleAngleChange = (configId: string, angle: MarketingAngleKey) => {
    setSelectedAngles(prev => ({ ...prev, [configId]: angle }));
    setOpenDropdown(null);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '#skyvane!funnel') {
      setIsAuthenticated(true);
      sessionStorage.setItem('skyvane_lp_auth', 'authenticated');
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('skyvane_lp_auth');
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleSchemeChange = (configId: string, scheme: ColorSchemeKey) => {
    setSelectedSchemes(prev => ({ ...prev, [configId]: scheme }));
    setOpenDropdown(null);
  };

  const handleRedirectUrlChange = (configId: string, url: string) => {
    setSelectedRedirectUrls(prev => ({ ...prev, [configId]: url }));
    setOpenDropdown(null);
  };

  const handlePendingDateChange = (configId: string, field: 'startDate' | 'endDate', value: string) => {
    setPendingDates(prev => ({
      ...prev,
      [configId]: {
        ...(prev[configId] || eventDates[configId] || getDefaultEventDates(configId)),
        [field]: value
      }
    }));
  };

  const handleSaveDates = (configId: string) => {
    const newDates = {
      ...eventDates,
      [configId]: pendingDates[configId] || eventDates[configId] || getDefaultEventDates(configId)
    };
    setEventDates(newDates);
    localStorage.setItem('skyvane_event_dates', JSON.stringify(newDates));
    setDatesSaved(configId);
    setTimeout(() => {
      setDatesSaved(null);
      setOpenDropdown(null);
    }, 1000);
  };



  const getEventStatusDisplay = (configId: string): { text: string; status: 'not-started' | 'active' | 'ended' } => {
    const dates = eventDates[configId];
    if (!dates?.startDate && !dates?.endDate) return { text: 'No dates', status: 'not-started' };
    
    const now = new Date();
    
    if (dates.startDate) {
      const startDate = new Date(dates.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (now < startDate) {
        const diff = startDate.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        
        if (months > 0) {
          const monthName = startDate.toLocaleDateString('en-US', { month: 'short' });
          return { text: `${monthName}`, status: 'not-started' };
        } else if (days > 0) {
          return { text: `${days}d`, status: 'not-started' };
        } else {
          return { text: 'Soon', status: 'not-started' };
        }
      }
    }
    
    if (dates.endDate) {
      const endDate = new Date(dates.endDate);
      endDate.setHours(23, 59, 59, 999);
      const diff = endDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        return { text: 'Ended', status: 'ended' };
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        return { text: `${days}d left`, status: 'active' };
      }
      return { text: `${hours}h`, status: 'active' };
    }
    
    return { text: '', status: 'active' };
  };

  // Check if dates are missing (for red highlight)
  const isDatesIncomplete = (configId: string): boolean => {
    const dates = eventDates[configId];
    return !dates?.startDate || !dates?.endDate;
  };

  // Calculate contextual information for a landing page
  const getContextualInfo = (config: typeof landingPageConfigs[0]) => {
    // Count sections (benefits, difference, technology, etc.)
    const sectionCount = [
      config.benefits?.benefits?.length > 0,
      config.difference?.standardPillowPoints?.length > 0,
      config.testimonials?.testimonials?.length > 0,
      config.faq?.items?.length > 0
    ].filter(Boolean).length;

    // FAQ count
    const faqCount = config.faq?.items?.length || 0;

    // Approximate word count (sum of all text content)
    const wordCount = [
      config.hero?.headline || '',
      config.hero?.subheadline || '',
      config.benefits?.sectionTitle || '',
      config.benefits?.sectionSubtitle || '',
      ...(config.benefits?.benefits?.map(b => b.title + ' ' + b.description) || []),
      ...(config.testimonials?.testimonials?.map(t => t.content) || []),
      ...(config.faq?.items?.map(f => f.question + ' ' + f.answer) || [])
    ].join(' ').split(/\s+/).length;

    // Last updated (mock - in real app would come from DB)
    const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return { sectionCount, faqCount, wordCount, lastUpdated };
  };

  // Render angle card (year-round landers)
  const renderAngleCard = (config: typeof landingPageConfigs[0]) => {
    const isUseCase = config.category === 'use-case';
    return (
      <div
        key={config.slug}
        className="bg-white border border-gray-200 rounded-xl p-4 transition-all"
      >
        {/* Main Layout: Preview + Content */}
        <div className="flex gap-4">
          {/* Preview Thumbnail - Left Side */}
          <div className="flex-shrink-0 w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
            <iframe
              src={`/${config.slug}`}
              className="w-[1280px] h-[800px] pointer-events-none"
              style={{ transform: 'scale(0.15)', transformOrigin: 'top left' }}
              title={`Preview of ${config.name}`}
            />
          </div>
          
          {/* Content - Right Side */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-[#1a1a1a]">{config.name}</h3>
            </div>
            <code className="text-xs text-[#999] font-mono">/{config.slug}</code>
            
            {/* URL Redirect Selector - Only for Use Cases */}
            {isUseCase && (
              <div className="mt-2 flex items-center gap-2">
                <div className="relative" data-dropdown>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDropdownToggle(`redirect-${config.id}`);
                    }}
                    className="px-2 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <ChevronRight className="w-3 h-3" />
                    {selectedRedirectUrls[config.id] || config.redirectUrl || '/'}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  
                  {openDropdown === `redirect-${config.id}` && (
                    <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-1">
                      {['/', '/valentine-gift', '/mothers-day', '/fathers-day'].map((url) => (
                        <button
                          key={url}
                          onClick={() => handleRedirectUrlChange(config.id, url)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                            (selectedRedirectUrls[config.id] || config.redirectUrl) === url
                              ? 'bg-gray-100 text-gray-900'
                              : 'hover:bg-gray-50 text-[#666]'
                          }`}
                        >
                          <code className="flex-1">{url}</code>
                          {(selectedRedirectUrls[config.id] || config.redirectUrl) === url && (
                            <Check className="w-3 h-3 ml-auto text-emerald-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Analytics Metrics with Time Range Toggle */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              {/* Time Range Toggle */}
              <div className="flex items-center justify-center gap-1 mb-2">
                {([180, 30, 7] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                      timeRange === range
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range}d
                  </button>
                ))}
              </div>
              
              {/* Analytics Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">Visits</div>
                  <div className="text-xs font-semibold text-gray-900">-</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">ATC Rate</div>
                  <div className="text-xs font-semibold text-gray-900">-%</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">CR Rate</div>
                  <div className="text-xs font-semibold text-gray-900">-%</div>
                </div>
              </div>
              
              {/* Contextual Info Cards */}
              {(() => {
                const info = getContextualInfo(config);
                return (
                  <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500">Sections</div>
                      <div className="text-xs font-semibold text-gray-900">{info.sectionCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500">FAQs</div>
                      <div className="text-xs font-semibold text-gray-900">{info.faqCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500">Words</div>
                      <div className="text-xs font-semibold text-gray-900">{info.wordCount.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500">Updated</div>
                      <div className="text-xs font-semibold text-gray-900">{info.lastUpdated}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(config.slug)}
              className="p-2 bg-[#f8f5f0] hover:bg-[#e5e0d8] text-[#666] rounded-lg transition-colors"
              title="Copy URL"
            >
              {copiedSlug === config.slug ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <Link href={`/${config.slug}`} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Preview">
              <Eye className="w-4 h-4" />
            </Link>
            <a
              href={`/${config.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#f8f5f0] hover:bg-[#e5e0d8] text-[#666] rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
          </div>
        </div>
      </div>
    );
  };

  // Render event card (date-based landers)
  const renderEventCard = (config: typeof landingPageConfigs[0]) => {
    const eventStatusDisplay = getEventStatusDisplay(config.id);
    const isActive = eventStatusDisplay.status === 'active';
    const isNotStarted = eventStatusDisplay.status === 'not-started';
    const dates = pendingDates[config.id] || eventDates[config.id] || getDefaultEventDates(config.id);
    const hasMissingDates = isDatesIncomplete(config.id);
    
    return (
      <div
        key={config.slug}
        className={`bg-white border rounded-xl p-4 transition-all ${
          isActive 
            ? 'border-green-300 hover:border-green-400 shadow-sm' 
            : isNotStarted
              ? 'border-blue-200 hover:border-blue-300'
              : 'border-gray-200 opacity-75'
        }`}
      >
        {/* Main Layout: Preview + Content */}
        <div className="flex gap-4">
          {/* Preview Thumbnail - Left Side */}
          <div className="flex-shrink-0 w-48 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden">
            <iframe
              src={`/${config.slug}`}
              className="w-[1280px] h-[800px] pointer-events-none"
              style={{ transform: 'scale(0.15)', transformOrigin: 'top left' }}
              title={`Preview of ${config.name}`}
            />
          </div>
          
          {/* Content - Right Side */}
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-[#1a1a1a]">{config.name}</h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                isActive 
                  ? 'bg-green-100 text-green-700' 
                  : isNotStarted
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {isActive ? 'Live' : isNotStarted ? 'Soon' : 'Ended'}
              </span>
            </div>
            <code className="text-xs text-[#999] font-mono">/{config.slug}</code>
            
            {/* Analytics Metrics with Time Range Toggle */}
            <div className="mt-2 pt-2 border-t border-gray-100">
              {/* Time Range Toggle */}
              <div className="flex items-center justify-center gap-1 mb-2">
                {([180, 30, 7] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                      timeRange === range
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range}d
                  </button>
                ))}
              </div>
              
              {/* Analytics Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">Visits</div>
                  <div className="text-xs font-semibold text-gray-900">-</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">ATC Rate</div>
                  <div className="text-xs font-semibold text-gray-900">-%</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">CR Rate</div>
                  <div className="text-xs font-semibold text-gray-900">-%</div>
                </div>
              </div>
              
              {/* Contextual Info Cards */}
              {(() => {
                const info = getContextualInfo(config);
                return (
                  <div className="mt-2 pt-2 border-t border-gray-100 grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500">Sections</div>
                      <div className="text-xs font-semibold text-gray-900">{info.sectionCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500">FAQs</div>
                      <div className="text-xs font-semibold text-gray-900">{info.faqCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500">Words</div>
                      <div className="text-xs font-semibold text-gray-900">{info.wordCount.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-gray-500">Updated</div>
                      <div className="text-xs font-semibold text-gray-900">{info.lastUpdated}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(config.slug)}
              className="p-2 bg-[#f8f5f0] hover:bg-[#e5e0d8] text-[#666] rounded-lg transition-colors"
              title="Copy URL"
            >
              {copiedSlug === config.slug ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <Link href={`/${config.slug}`} className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors" title="Preview">
              <Eye className="w-4 h-4" />
            </Link>
            <a
              href={`/${config.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#f8f5f0] hover:bg-[#e5e0d8] text-[#666] rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
          </div>

        {/* Settings Row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Badge */}
          {eventStatusDisplay.text && (
            <span className={`px-2 py-1 text-xs font-medium rounded-lg flex items-center gap-1 ${
              isActive 
                ? 'bg-amber-100 text-amber-700'
                : isNotStarted
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-100 text-gray-500'
            }`}>
              <Clock className="w-3 h-3" />
              {eventStatusDisplay.text}
            </span>
          )}
          
          {/* Color Scheme Dropdown */}
          <div className="relative" data-dropdown>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDropdownToggle(`color-${config.id}`);
              }}
              className="px-2 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <Palette className="w-3 h-3" />
              {colorSchemes[selectedSchemes[config.id] || 'valentines-day'].name}
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {openDropdown === `color-${config.id}` && (
              <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-1">
                {Object.entries(colorSchemes).map(([key, scheme]) => (
                  <button
                    key={key}
                    onClick={() => handleSchemeChange(config.id, key as ColorSchemeKey)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                      selectedSchemes[config.id] === key 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'hover:bg-gray-50 text-[#666]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${scheme.preview}`} />
                    <span>{scheme.name}</span>
                    {selectedSchemes[config.id] === key && (
                      <Check className="w-3 h-3 ml-auto text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Angle Selector */}
          <div className="relative" data-dropdown>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDropdownToggle(`angle-${config.id}`);
              }}
              className="px-2 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
            >
              <Target className="w-3 h-3" />
              {marketingAngles[selectedAngles[config.id] || 'gift-focused'].name}
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {openDropdown === `angle-${config.id}` && (
              <div className="absolute left-0 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-1">
                {Object.entries(marketingAngles).map(([key, angle]) => (
                  <button
                    key={key}
                    onClick={() => handleAngleChange(config.id, key as MarketingAngleKey)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                      selectedAngles[config.id] === key 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'hover:bg-gray-50 text-[#666]'
                    }`}
                  >
                    <span>{angle.icon}</span>
                    <span>{angle.name}</span>
                    {selectedAngles[config.id] === key && (
                      <Check className="w-3 h-3 ml-auto text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Date Picker */}
          <div className="relative" data-dropdown>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDropdownToggle(`dates-${config.id}`);
              }}
              className={`px-2 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                hasMissingDates
                  ? 'bg-red-100 text-red-700 hover:bg-red-200 ring-1 ring-red-300'
                  : 'bg-green-50 text-green-700 hover:bg-green-100'
              }`}
            >
              <Calendar className="w-3 h-3" />
              {hasMissingDates ? 'Set Dates' : 'Dates'}
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {openDropdown === `dates-${config.id}` && (
              <div className="absolute left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-30 p-3">
                <p className="text-xs text-[#999] mb-3">California timezone (PST/PDT)</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#666] mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dates.startDate}
                      onChange={(e) => handlePendingDateChange(config.id, 'startDate', e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-[#f8f5f0] border rounded-lg focus:outline-none focus:border-purple-400 ${
                        !dates.startDate ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#666] mb-1">End Date</label>
                    <input
                      type="date"
                      value={dates.endDate}
                      onChange={(e) => handlePendingDateChange(config.id, 'endDate', e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-[#f8f5f0] border rounded-lg focus:outline-none focus:border-purple-400 ${
                        !dates.endDate ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => handleSaveDates(config.id)}
                  className={`w-full mt-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    datesSaved === config.id
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {datesSaved === config.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Dates
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    );
  };

  // Password protection screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f8f5f0] to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/images/fluff-logo.svg" 
              alt="FluffCo" 
              className="h-10"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-center w-14 h-14 bg-[#1a1a1a]/5 rounded-full mx-auto mb-4">
              <Lock className="w-7 h-7 text-[#1a1a1a]" />
            </div>
            
            <h2 className="text-2xl font-bold text-center text-[#1a1a1a] mb-2">FluffCo Landers</h2>
            <p className="text-sm text-[#666] text-center mb-6">
              Enter your password to access the landing page dashboard.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 bg-[#f8f5f0] border rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a] transition-colors ${
                    passwordError ? 'border-red-400 bg-red-50' : 'border-gray-200'
                  }`}
                  autoFocus
                />
                {passwordError && (
                  <p className="mt-2 text-sm text-red-500">Incorrect password. Please try again.</p>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-[#1a1a1a] hover:bg-[#333] text-white font-medium rounded-xl transition-colors"
              >
                Access Dashboard
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-[#999]">
            Landing Page Management Portal
          </p>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f5f0] to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/images/fluff-logo.svg" 
              alt="FluffCo" 
              className="h-6"
            />
            <div className="h-5 w-px bg-[#e5e0d8]" />
            <span className="text-sm font-semibold text-[#1a1a1a]">Landers</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/settings">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#666] hover:text-[#1a1a1a] hover:bg-[#f8f5f0] rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                <span className="hidden sm:inline">Settings</span>
              </button>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#666] hover:text-[#1a1a1a] hover:bg-[#f8f5f0] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Summary Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left: Page counts */}
            <div className="flex items-center gap-4 md:gap-6 flex-wrap">
              <div className="text-center">
                <p className="text-3xl font-bold text-[#1a1a1a]">{landingPageConfigs.length + 1}</p>
                <p className="text-xs text-[#666] mt-0.5">Total Pages</p>
              </div>
              <div className="h-10 w-px bg-[#e5e0d8]" />
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{angleConfigs.length}</p>
                <p className="text-xs text-[#666] mt-0.5">Angles</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{useCaseConfigs.length}</p>
                <p className="text-xs text-[#666] mt-0.5">Use Cases</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{eventConfigs.length}</p>
                <p className="text-xs text-[#666] mt-0.5">Events</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">1</p>
                <p className="text-xs text-[#666] mt-0.5">Quiz</p>
              </div>
            </div>
            {/* Right: System status */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 text-xs font-medium">All Systems Live</span>
            </div>
          </div>
        </div>



          {/* All Sections - Full Width Stacked Layout */}
        <div className="space-y-6">
          {/* Left Column - Angles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-base font-bold text-[#1a1a1a]">Angles</h2>
              </div>
              {/* System Health Check */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-medium text-green-700">{angleConfigs.length}/{angleConfigs.length} Working</span>
              </div>
            </div>
            <div className="space-y-3">
              {angleConfigs.map((config) => renderAngleCard(config))}
            </div>
          </div>

          {/* Middle Column - Events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-base font-bold text-[#1a1a1a]">Events</h2>
              </div>
              {/* System Health Check */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-medium text-green-700">{eventConfigs.length}/{eventConfigs.length} Working</span>
              </div>
            </div>
            <div className="space-y-3">
              {eventConfigs.map((config) => renderEventCard(config))}
            </div>
          </div>

          {/* Right Column - Use Cases */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-base font-bold text-[#1a1a1a]">Use Cases</h2>
              </div>
              {/* System Health Check */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-medium text-green-700">{useCaseConfigs.length}/{useCaseConfigs.length} Working</span>
              </div>
            </div>
            <div className="space-y-3">
              {useCaseConfigs.map((config) => renderAngleCard(config))}
            </div>
          </div>
        </div>


        {/* Quiz Section - Full Width */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="text-base font-bold text-[#1a1a1a]">Quiz</h2>
            </div>
            {/* System Health Check */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs font-medium text-green-700">1/1 Working</span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1">Sleep Quiz</h3>
                <p className="text-xs text-[#666] mb-3">Multi-step quiz with personalized recommendations</p>
                
                <div className="flex items-center gap-2">
                  <a
                    href="/quiz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-[#1a1a1a] text-xs rounded-lg transition-colors font-medium"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Preview Quiz
                  </a>
                  <a
                    href="/debug-quiz"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors font-medium"
                    title="Debug all quiz result variations"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Debug
                  </a>
                </div>
              </div>
            </div>
            
            {/* URL Parameter Examples */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[#666]">Result URL Parameters</span>
                <button
                  onClick={() => {
                    setOpenDropdown(openDropdown === 'quiz-params' ? null : 'quiz-params');
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  {openDropdown === 'quiz-params' ? 'Hide' : 'Show'} Examples
                </button>
              </div>
              
              {openDropdown === 'quiz-params' && (
                <div className="space-y-2">
                  {[
                    { param: '?from=side-sleeper', desc: 'Side sleeper profile' },
                    { param: '?from=hot-sleeper', desc: 'Hot sleeper profile' },
                    { param: '?from=neck-pain', desc: 'Neck pain profile' },
                    { param: '?from=general', desc: 'General comfort profile' },
                  ].map(({ param, desc }) => (
                    <div key={param} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <code className="flex-1 text-xs font-mono text-[#1a1a1a]">{param}</code>
                      <span className="text-xs text-[#666]">{desc}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://yoursite.com/${param}`);
                          toast.success('URL copied!');
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                        title="Copy URL"
                      >
                        <svg className="w-3.5 h-3.5 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-[#999]">
          <p>All funnels are the property of Skyvane Limited ®</p>
        </div>
      </main>
    </div>
  );
}
