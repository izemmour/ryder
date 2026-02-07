/**
 * Profile Results Banner Component
 * 
 * Displays personalized quiz results at the top of product pages
 * when user arrives via quiz funnel with profile parameter
 * 
 * Features:
 * - Multiple badges based on quiz tags (side sleeper, hot sleeper, etc.)
 * - Two-step reveal animation: banner appears collapsed, page fades in, then expands
 * - Danger reminder section above CTA based on quiz answers
 * - No dismiss button - section always stays visible
 * - Mobile-optimized CTA layout (button stays inline, text wraps)
 */

import { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, CheckCircle2, Clock, ChevronDown, Moon, Thermometer, Bed, Shield, AlertCircle, Info } from 'lucide-react';

interface ProfileData {
  id: string;
  name: string;
  description: string;
  overallScore: number; // 0-100 score
  dangerScore: number;
  insights: string[];
  stats: { label: string; value: string; danger?: boolean; score?: number }[]; // score 0-100 for progress bar
}

// Map quiz slugs to profile IDs
const slugToProfileId: Record<string, string> = {
  'side-sleeper-pillow': 'side-sleeper',
  'neck-pain-relief-pillow': 'neck-pain',
  'hotel-quality-pillow': 'hotel-quality',
};

// Badge definitions based on quiz tags
interface BadgeConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  tags: string[]; // Tags that trigger this badge
  color: string;
}

const badgeConfigs: BadgeConfig[] = [
  { 
    id: 'side-sleeper', 
    label: 'Side Sleeper', 
    icon: <Bed className="w-3 h-3" />, 
    tags: ['side-sleeper'],
    color: 'bg-blue-100 text-blue-700'
  },
  { 
    id: 'back-sleeper', 
    label: 'Back Sleeper', 
    icon: <Bed className="w-3 h-3" />, 
    tags: ['back-sleeper'],
    color: 'bg-indigo-100 text-indigo-700'
  },
  { 
    id: 'hot-sleeper', 
    label: 'Hot Sleeper', 
    icon: <Thermometer className="w-3 h-3" />, 
    tags: ['hot-sleeper', 'warm-sleeper', 'temperature'],
    color: 'bg-orange-100 text-orange-700'
  },
  { 
    id: 'neck-pain', 
    label: 'Neck Pain', 
    icon: <AlertCircle className="w-3 h-3" />, 
    tags: ['neck-pain', 'alignment-issues'],
    color: 'bg-red-100 text-red-700'
  },
  { 
    id: 'shoulder-pain', 
    label: 'Shoulder Pain', 
    icon: <AlertCircle className="w-3 h-3" />, 
    tags: ['shoulder-pain'],
    color: 'bg-rose-100 text-rose-700'
  },
  { 
    id: 'old-pillow', 
    label: 'Pillow Needs Replacing', 
    icon: <Clock className="w-3 h-3" />, 
    tags: ['old-pillow', 'very-old-pillow', 'danger'],
    color: 'bg-amber-100 text-amber-700'
  },
  { 
    id: 'allergies', 
    label: 'Allergy Concerns', 
    icon: <Shield className="w-3 h-3" />, 
    tags: ['allergies', 'dust-mites'],
    color: 'bg-purple-100 text-purple-700'
  },
  { 
    id: 'night-wakeups', 
    label: 'Sleep Disruption', 
    icon: <Moon className="w-3 h-3" />, 
    tags: ['poor-support', 'compression', 'night-wakeups'],
    color: 'bg-slate-100 text-slate-700'
  },
];

// Danger reminders based on quiz tags
interface DangerReminder {
  tags: string[];
  title: string;
  message: string;
}

const dangerReminders: DangerReminder[] = [
  {
    tags: ['old-pillow', 'very-old-pillow'],
    title: 'Time for a Change',
    message: 'Sleep experts recommend replacing pillows every 1-2 years. Old pillows lose up to 60% of their support and accumulate dust mites, dead skin cells, and allergens.'
  },
  {
    tags: ['neck-pain', 'alignment-issues', 'morning-stiffness'],
    title: 'Your Neck Needs Support',
    message: 'Waking up with neck pain or stiffness is a sign your pillow isn\'t providing proper cervical alignment. The right pillow can eliminate morning discomfort.'
  },
  {
    tags: ['hot-sleeper', 'temperature', 'warm-sleeper'],
    title: 'Temperature Affects Sleep Quality',
    message: 'Overheating disrupts deep sleep cycles. A breathable pillow with temperature-neutral materials can reduce night sweats and improve sleep quality by up to 30%.'
  },
  {
    tags: ['allergies', 'dust-mites', 'congested'],
    title: 'Allergens May Be the Culprit',
    message: 'An average pillow can contain millions of dust mites after 2 years. Hypoallergenic materials and regular replacement can significantly reduce allergy symptoms.'
  },
  {
    tags: ['poor-support', 'compression', 'night-wakeups'],
    title: 'Support Matters',
    message: 'Waking up multiple times to adjust your pillow indicates it\'s not maintaining proper support. Quality pillows hold their shape throughout the night.'
  },
  {
    tags: ['side-sleeper'],
    title: 'Side Sleepers Need Extra Loft',
    message: 'Side sleeping requires 4-6 inches of loft to keep your spine aligned. Most standard pillows compress too much, causing shoulder and neck strain.'
  },
];

const profileConfigs: Record<string, ProfileData> = {
  'side-sleeper-urgent': {
    id: 'side-sleeper-urgent',
    name: 'Side Sleeper with Severe Issues',
    description: 'Your quiz results show significant sleep disruption from improper pillow support.',
    overallScore: 28,
    dangerScore: 85,
    insights: [
      'You wake up multiple times per night due to shoulder pressure',
      'Your current pillow is likely causing circulation issues',
      'Hotels use pillows specifically engineered for side sleepers',
    ],
    stats: [
      { label: 'Sleep Quality', value: 'Severe Disruption', danger: true, score: 25 },
      { label: 'Spinal Alignment', value: 'Critical Misalignment', danger: true, score: 20 },
      { label: 'Circulation Health', value: 'Arm Numbness', danger: true, score: 30 },
    ],
  },
  'side-sleeper': {
    id: 'side-sleeper',
    name: 'Side Sleeper',
    description: 'Your sleeping position requires specific pillow support that you\'re not currently getting.',
    overallScore: 55,
    dangerScore: 60,
    insights: [
      'Side sleeping requires 4-6 inches of loft for proper alignment',
      'Your pillow likely compresses too much during the night',
      '74% of adults are side sleepers, but most pillows aren\'t designed for it',
    ],
    stats: [
      { label: 'Support Level', value: 'Insufficient Loft', danger: true, score: 50 },
      { label: 'Compression Issue', value: 'Moderate Loss', danger: true, score: 55 },
      { label: 'Alignment Score', value: 'Needs Improvement', danger: false, score: 60 },
    ],
  },
  'neck-pain': {
    id: 'neck-pain',
    name: 'Neck Pain Sufferer',
    description: 'Your neck pain is likely caused by poor pillow support and alignment.',
    overallScore: 35,
    dangerScore: 70,
    insights: [
      'Morning stiffness indicates your spine is misaligned during sleep',
      'Physical therapists see this issue daily - it\'s preventable',
      'Proper cervical support can eliminate morning neck pain',
    ],
    stats: [
      { label: 'Pain Level', value: 'Moderate-High', danger: true, score: 30 },
      { label: 'Cervical Support', value: 'Inadequate', danger: true, score: 35 },
      { label: 'Morning Stiffness', value: 'Persistent', danger: true, score: 40 },
    ],
  },
  'hot-sleeper': {
    id: 'hot-sleeper',
    name: 'Hot Sleeper',
    description: 'Temperature regulation is critical for your sleep quality.',
    overallScore: 48,
    dangerScore: 50,
    insights: [
      'Waking up hot disrupts deep sleep cycles',
      'Your current pillow likely traps heat',
      'Breathable materials can reduce night sweats by 60%',
    ],
    stats: [
      { label: 'Temperature Control', value: 'Poor Regulation', danger: true, score: 40 },
      { label: 'Night Sweats', value: 'Frequent', danger: true, score: 45 },
      { label: 'Sleep Cycles', value: 'Disrupted', danger: true, score: 50 },
    ],
  },
  'pillow-danger': {
    id: 'pillow-danger',
    name: 'Pillow Danger Zone',
    description: 'Your old pillow is a health hazard and affecting your sleep quality.',
    overallScore: 18,
    dangerScore: 90,
    insights: [
      'Pillows over 2 years old contain millions of dust mites',
      'Old pillows lose 60% of their support capacity',
      'Dust mites can trigger allergies and respiratory issues',
    ],
    stats: [
      { label: 'Hygiene Risk', value: 'Critical - Dust Mites', danger: true, score: 10 },
      { label: 'Support Degradation', value: 'Severe - 60%+ Lost', danger: true, score: 15 },
      { label: 'Health Impact', value: 'Respiratory Risk', danger: true, score: 20 },
    ],
  },
  'hotel-quality': {
    id: 'hotel-quality',
    name: 'Hotel Quality Seeker',
    description: 'You know what good sleep feels like - you just need it at home.',
    overallScore: 62,
    dangerScore: 40,
    insights: [
      'Hotels invest heavily in pillow quality - you can too',
      'The "hotel sleep" phenomenon is real and replicable',
      'Same suppliers, direct pricing - no markup',
    ],
    stats: [
      { label: 'Current Quality', value: 'Below Hotel Standard', danger: false, score: 60 },
      { label: 'Upgrade Potential', value: 'High', danger: false, score: 65 },
      { label: 'Value Match', value: 'Excellent', danger: false, score: 70 },
    ],
  },
  'chronic-pain': {
    id: 'chronic-pain',
    name: 'Chronic Pain Sufferer',
    description: 'Your chronic pain may be significantly worsened by inadequate sleep support.',
    overallScore: 25,
    dangerScore: 85,
    insights: [
      'Poor pillow support can amplify existing pain conditions',
      'Proper alignment reduces pressure points by up to 70%',
      'Many chronic pain patients report relief after switching pillows',
    ],
    stats: [
      { label: 'Pain Amplification', value: 'Significant', danger: true, score: 20 },
      { label: 'Pressure Points', value: 'Multiple Areas', danger: true, score: 25 },
      { label: 'Recovery Impact', value: 'Severely Hindered', danger: true, score: 30 },
    ],
  },
  'allergy-sufferer': {
    id: 'allergy-sufferer',
    name: 'Allergy Sufferer',
    description: 'Your pillow may be triggering allergic reactions and respiratory issues.',
    overallScore: 32,
    dangerScore: 75,
    insights: [
      'Old pillows harbor millions of dust mites and allergens',
      'Hypoallergenic materials can reduce symptoms by 80%',
      'Most people don\'t realize their pillow is the source',
    ],
    stats: [
      { label: 'Allergen Exposure', value: 'High Risk', danger: true, score: 25 },
      { label: 'Dust Mite Level', value: 'Critical', danger: true, score: 30 },
      { label: 'Respiratory Impact', value: 'Moderate-Severe', danger: true, score: 35 },
    ],
  },
  'poor-sleep': {
    id: 'poor-sleep',
    name: 'Poor Sleep Quality',
    description: 'Your overall sleep quality is suffering due to inadequate pillow support.',
    overallScore: 38,
    dangerScore: 65,
    insights: [
      'Tossing and turning indicates your pillow isn\'t working',
      'Quality sleep requires consistent support throughout the night',
      'Most people adapt to bad pillows without realizing the impact',
    ],
    stats: [
      { label: 'Sleep Efficiency', value: 'Below Average', danger: true, score: 35 },
      { label: 'Night Disruptions', value: 'Frequent', danger: true, score: 40 },
      { label: 'Morning Energy', value: 'Low', danger: true, score: 45 },
    ],
  },
};

interface ProfileResultsBannerProps {
  profileId: string;
  email?: string;
  tags?: string[]; // Quiz tags for multiple badges
  labels?: string[]; // Human-readable labels from quiz (e.g., "Made for Side Sleepers")
  onRestartQuiz?: () => void; // Callback to restart the quiz
  pageId?: string; // Page ID to detect Black Friday and apply dark theme
}

export function ProfileResultsBanner({ profileId, email, tags = [], labels = [], onRestartQuiz, pageId }: ProfileResultsBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // Two-step reveal animation:
  // 1. Banner appears collapsed (isVisible = true)
  // 2. Page content fades in (pageLoaded = true) 
  // 3. Banner expands (isExpanded = true)
  useEffect(() => {
    // Step 1: Show banner collapsed
    const showBannerTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    // Step 2: Page content starts loading (simulated)
    const pageLoadTimer = setTimeout(() => {
      setPageLoaded(true);
    }, 600);
    
    // Step 3: Expand banner after page loads
    const expandTimer = setTimeout(() => {
      setIsExpanded(true);
    }, 1800); // 1.2s after page starts loading
    
    return () => {
      clearTimeout(showBannerTimer);
      clearTimeout(pageLoadTimer);
      clearTimeout(expandTimer);
    };
  }, []);
  
  // Try to match profile by ID or by slug
  const resolvedProfileId = slugToProfileId[profileId] || profileId;
  const profile = profileConfigs[resolvedProfileId];
  
  if (!profile) return null;

  // Determine which badges to show based on tags
  const matchedBadges = badgeConfigs.filter(badge => 
    badge.tags.some(tag => tags.includes(tag))
  );
  
  // Only show badges if we have clear matches (at least 1)
  const showBadges = matchedBadges.length > 0;

  // Find matching danger reminders based on user's tags
  const matchedReminders = dangerReminders.filter(reminder =>
    reminder.tags.some(tag => tags.includes(tag))
  );
  // Show at most 2 reminders
  const displayReminders = matchedReminders.slice(0, 2);

  const dangerLevel = profile.dangerScore >= 75 ? 'high' : profile.dangerScore >= 50 ? 'medium' : 'low';
  const dangerColor = dangerLevel === 'high' ? 'red' : dangerLevel === 'medium' ? 'amber' : 'yellow';
  
  // Determine overall score color
  const getScoreColor = (score: number) => {
    if (score < 40) return { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' };
    if (score < 60) return { bg: 'bg-amber-100', text: 'text-amber-700', bar: 'bg-amber-500' };
    return { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' };
  };
  
  const scoreColors = getScoreColor(profile.overallScore);
  
  // Detect Black Friday page for dark theme
  const isBlackFriday = pageId === 'black-friday';

  return (
    <div 
      data-profile-banner
      className={`border-b-2 overflow-hidden ${
        isBlackFriday ? 'bg-black border-[#FFD700]' :
        dangerLevel === 'high' ? 'bg-red-50/30 border-red-200/50' :
        dangerLevel === 'medium' ? 'bg-amber-50/30 border-amber-200/50' :
        'bg-yellow-50/30 border-yellow-200/50'
      }`}
      style={{
        transformOrigin: 'top',
        maxHeight: isVisible ? '1500px' : '0px',
        opacity: isVisible ? 1 : 0,
        transition: 'max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out',
      }}
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4 flex-1">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
              dangerLevel === 'high' ? 'bg-red-100/50' :
              dangerLevel === 'medium' ? 'bg-amber-100/50' :
              'bg-yellow-100/50'
            }`}>
              {dangerLevel === 'high' ? (
                <AlertTriangle className={`w-7 h-7 text-${dangerColor}-600`} />
              ) : (
                <TrendingUp className={`w-7 h-7 text-${dangerColor}-600`} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-xl font-bold text-[#1a1a1a] tracking-tight">
                  Your Sleep Analysis
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                  dangerLevel === 'high' ? 'bg-red-100/60 text-red-700' :
                  dangerLevel === 'medium' ? 'bg-amber-100/60 text-amber-700' :
                  'bg-yellow-100/60 text-yellow-700'
                }`}>
                  {dangerLevel === 'high' ? 'Urgent' : dangerLevel === 'medium' ? 'Important' : 'Attention Needed'}
                </span>
              </div>
              
              {/* Multiple Badges - Only show on desktop if we have clear profile matches */}
              {showBadges && (
                <div className="hidden md:flex flex-wrap gap-2 mb-3">
                  {matchedBadges.map((badge) => (
                    <span 
                      key={badge.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badge.color}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-base text-[#555] leading-relaxed">{profile.description}</p>
              {email && (
                <p className="text-sm text-[#888] mt-2">
                  Full report sent to {email}
                </p>
              )}
            </div>
          </div>
          {/* Action buttons - restart and expand/collapse */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Restart Analysis button */}
            {onRestartQuiz && (
              <button
                onClick={onRestartQuiz}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                title="Restart Analysis"
              >
                <svg className="w-5 h-5 text-[#666]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
            )}
            {/* Expand/collapse button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <ChevronDown className={`w-5 h-5 text-[#666] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Expanded Content with smooth animation */}
        <div 
          className={`grid md:grid-cols-2 gap-6 overflow-hidden transition-all duration-500 ease-out ${
            isExpanded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            maxHeight: isExpanded ? '600px' : '0px',
            marginTop: isExpanded ? '0' : '-16px',
          }}
        >
            {/* LEFT COLUMN: Stats with Overall Score and Progress Bars */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5">
              <h4 className="text-base font-bold text-[#1a1a1a] mb-4 flex items-center gap-2 uppercase tracking-wide">
                <Clock className="w-5 h-5" />
                Your Sleep Profile
              </h4>
              
              {/* Overall Score */}
              <div className={`${scoreColors.bg} rounded-lg p-4 mb-5`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#444]">Overall Sleep Health</span>
                  <span className={`text-3xl font-bold ${scoreColors.text}`}>
                    {profile.overallScore}<span className="text-lg">/100</span>
                  </span>
                </div>
                <div className="relative h-2.5 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${scoreColors.bar} transition-all duration-1000 ease-out`}
                    style={{ width: isExpanded ? `${profile.overallScore}%` : '0%' }}
                  />
                </div>
              </div>
              
              {/* Individual Stats with Progress Bars */}
              <div className="space-y-4">
                {profile.stats.map((stat, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-[#444]">{stat.label}</span>
                      <span className={`text-sm font-bold ${
                        stat.danger ? 'text-red-600' : 'text-[#1a1a1a]'
                      }`}>
                        {stat.value}
                      </span>
                    </div>
                    {stat.score !== undefined && (
                      <div className="relative h-2 bg-white/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ease-out ${
                            stat.danger ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: isExpanded ? `${stat.score}%` : '0%',
                            transitionDelay: `${index * 100}ms`
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: Key Insights */}
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-5">
              <h4 className="text-base font-bold text-[#1a1a1a] mb-4 flex items-center gap-2 uppercase tracking-wide">
                <CheckCircle2 className="w-5 h-5" />
                Key Insights
              </h4>
              <ul className="space-y-3">
                {profile.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-[#555] flex items-start gap-3 leading-relaxed">
                    <span className="text-[#1a1a1a] font-bold text-base mt-0.5">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
        </div>

        {/* CTA - Mobile optimized: button stays inline, text wraps */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-sm text-[#666] flex-1 min-w-0">
            👇 Scroll down to see the solution recommended for your profile
          </p>
          <button 
            onClick={() => {
              // Scroll to hero section (product info)
              const heroSection = document.querySelector('[data-hero-section]');
              if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                // Fallback: scroll down to show content below banner
                window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
              }
            }}
            className="px-4 py-2 text-sm font-semibold rounded-full border border-[#1a1a1a] text-[#1a1a1a] bg-transparent hover:bg-[#1a1a1a] hover:text-white transition-colors whitespace-nowrap flex-shrink-0"
          >
            Get My Pillow
          </button>
        </div>
      </div>
    </div>
  );
}
