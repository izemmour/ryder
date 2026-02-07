/**
 * LP Manager - Unified Admin Panel
 * Stripe-inspired dashboard design with refined aesthetics
 */

import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Eye, Edit, ExternalLink, Settings, Save, LogOut, X, CheckCircle, 
  LayoutGrid, Sliders, ChevronRight, Zap, Copy, Calendar, Check
} from "lucide-react";
import { toast } from "sonner";
import FluffLogo from "@/components/FluffLogo";
import CtaButtonsManager from "@/components/CtaButtonsManager";
import MarketingAnglesManager from "@/components/MarketingAnglesManager";
import { ColorSchemesManager } from "@/components/ColorSchemesManager";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { 
  landingPageConfigs, 
  type LandingPageConfig 
} from "@/config";
import { validateAllLandingPages, type PageValidationReport, type ValidationResult } from '@shared/validation';
import { useMemo } from 'react';
import { AlertTriangle, RefreshCw, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Base URL for published site
const PUBLISHED_BASE_URL = 'https://get.fluff.co';

// Compliance Content Component
function ComplianceContent() {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [isValidating, setIsValidating] = useState(false);
  
  // Fetch validation results from backend
  const { data: validationResults, refetch, isLoading } = trpc.landingPages.validateAll.useQuery();
  const autoFixMutation = trpc.landingPages.autoFix.useMutation({
    onSuccess: () => {
      toast.success('Auto-fix completed successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Auto-fix failed: ${error.message}`);
    }
  });
  
  // Convert validation results to reports format
  const validationReports = useMemo(() => {
    if (!validationResults) return [];
    
    return Object.entries(validationResults).map(([pageId, result]) => {
      const config = landingPageConfigs.find(c => c.id === pageId);
      const criticalIssues = result.issues.filter((i: any) => i.severity === 'critical');
      const warningIssues = result.issues.filter((i: any) => i.severity === 'warning');
      
      return {
        pageId,
        pageTitle: config?.seo?.title || pageId,
        status: criticalIssues.length > 0 ? 'fail' : warningIssues.length > 0 ? 'warning' : 'pass',
        issues: result.issues,
        isCompliant: result.isCompliant,
        autoFixableCount: result.autoFixableCount,
      };
    });
  }, [validationResults]);
  
  // Calculate overall stats
  const stats = useMemo(() => {
    const total = validationReports.length;
    const passed = validationReports.filter(r => r.status === 'pass').length;
    const warnings = validationReports.filter(r => r.status === 'warning').length;
    const failed = validationReports.filter(r => r.status === 'fail').length;
    
    return { total, passed, warnings, failed };
  }, [validationReports]);
  
  const handleRunValidation = async () => {
    setIsValidating(true);
    await refetch();
    setIsValidating(false);
  };
  
  const handleAutoFix = async (pageId: string, pageType: string, missingElements: string[]) => {
    await autoFixMutation.mutateAsync({
      pageId,
      pageType: pageType as 'event' | 'angle' | 'use-case' | 'default',
      missingElements,
    });
  };
  
  const togglePageExpansion = (pageId: string) => {
    setExpandedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Compliance Status</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Landing page validation against LANDING_PAGE_GUIDELINES.md
          </p>
        </div>
        <Button
          onClick={handleRunValidation}
          disabled={isValidating}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
          Run Validation
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Total Pages</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className="p-4 border-green-500/20 bg-green-500/5">
          <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Passed</div>
          <div className="text-2xl font-bold text-green-600">{stats.passed}</div>
        </Card>
        <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
          <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Warnings</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
        </Card>
        <Card className="p-4 border-red-500/20 bg-red-500/5">
          <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Failed</div>
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
        </Card>
      </div>
      
      {/* Validation Results */}
      <div className="space-y-4">
        {validationReports.map(report => (
          <PageValidationCard
            key={report.pageId}
            report={report}
            isExpanded={expandedPages.has(report.pageId)}
            onToggle={() => togglePageExpansion(report.pageId)}
            onAutoFix={handleAutoFix}
          />
        ))}
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-8">
          Loading validation results...
        </div>
      )}
    </div>
  );
}

// Page Validation Card Component
interface PageValidationCardProps {
  report: any; // Changed from PageValidationReport to support new structure
  isExpanded: boolean;
  onToggle: () => void;
  onAutoFix?: (pageId: string, pageType: string, missingElements: string[]) => void;
}

function PageValidationCard({ report, isExpanded, onToggle, onAutoFix }: PageValidationCardProps) {
  const statusConfig = {
    pass: {
      color: 'green',
      icon: Check,
      label: 'Passed',
      bgClass: 'bg-green-500/10 border-green-500/20',
      textClass: 'text-green-600',
    },
    warning: {
      color: 'yellow',
      icon: AlertTriangle,
      label: 'Needs Attention',
      bgClass: 'bg-yellow-500/10 border-yellow-500/20',
      textClass: 'text-yellow-600',
    },
    fail: {
      color: 'red',
      icon: X,
      label: 'Failed',
      bgClass: 'bg-red-500/10 border-red-500/20',
      textClass: 'text-red-600',
    },
  };
  
  const status = report.status as 'pass' | 'warning' | 'fail';
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  
  // Group issues by severity
  const errors = report.issues?.filter((i: any) => i.severity === 'critical') || [];
  const warnings = report.issues?.filter((i: any) => i.severity === 'warning') || [];
  const infos = report.issues?.filter((i: any) => i.severity === 'info') || [];
  
  // Get auto-fixable issues
  const autoFixableIssues = report.issues?.filter((i: any) => i.autoFixAvailable) || [];
  const missingElements = autoFixableIssues.map((i: any) => i.field);
  
  return (
    <Card className={`overflow-hidden ${config.bgClass}`}>
      {/* Card Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-center justify-between hover:bg-accent/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Status Icon */}
          <div className={`w-10 h-10 rounded-full ${config.bgClass} flex items-center justify-center`}>
            <StatusIcon className={`w-5 h-5 ${config.textClass}`} />
          </div>
          
          {/* Page Info */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{report.pageTitle}</h3>
              {report.pageId && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {report.pageType}
                </span>
              )}
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {report.isCompliant ? 'All checks passed' : `${errors.length} critical issues`}
              {warnings.length > 0 && ` • ${warnings.length} warnings`}
              {report.autoFixableCount > 0 && ` • ${report.autoFixableCount} auto-fixable`}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.textClass} ${config.bgClass}`}>
            {config.label}
          </span>
          
          {/* Expand Icon */}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          )}
        </div>
      </button>
      
      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="p-6 space-y-6">
            {/* Critical Errors */}
            {errors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Critical Issues ({errors.length})
                </h4>
                <div className="space-y-3">
                  {errors.map((result: any, idx: number) => (
                    <ValidationResultItem 
                      key={idx} 
                      result={result}
                      onAutoFix={result.autoFixAvailable && onAutoFix ? () => {
                        const pageConfig = landingPageConfigs.find(c => c.id === report.pageId);
                        const pageType = pageConfig?.pageType || 'default';
                        onAutoFix(report.pageId, pageType, [result.field]);
                      } : undefined}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Warnings */}
            {warnings.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Warnings ({warnings.length})
                </h4>
                <div className="space-y-3">
                  {warnings.map((result: any, idx: number) => (
                    <ValidationResultItem 
                      key={idx} 
                      result={result}
                      onAutoFix={result.autoFixAvailable && onAutoFix ? () => {
                        const pageConfig = landingPageConfigs.find(c => c.id === report.pageId);
                        const pageType = pageConfig?.pageType || 'default';
                        onAutoFix(report.pageId, pageType, [result.field]);
                      } : undefined}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Info/Recommendations */}
            {infos.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  Recommendations ({infos.length})
                </h4>
                <div className="space-y-3">
                  {infos.map((result: any, idx: number) => (
                    <ValidationResultItem 
                      key={idx} 
                      result={result}
                      onAutoFix={result.autoFixAvailable && onAutoFix ? () => {
                        const pageConfig = landingPageConfigs.find(c => c.id === report.pageId);
                        const pageType = pageConfig?.pageType || 'default';
                        onAutoFix(report.pageId, pageType, [result.field]);
                      } : undefined}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* All Passed */}
            {errors.length === 0 && warnings.length === 0 && infos.length === 0 && (
              <div className="text-center py-4 text-green-600">
                <Check className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">All checks passed!</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  This page meets all guideline requirements
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// Validation Result Item Component
interface ValidationResultItemProps {
  result: any; // Support new issue structure
  onAutoFix?: () => void;
}

function ValidationResultItem({ result, onAutoFix }: ValidationResultItemProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="font-medium text-sm mb-1">{result.message || result.check}</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
            Field: <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{result.field}</code>
          </div>
          
          {result.suggestedAction && (
            <div className="text-xs bg-blue-500/10 text-blue-600 rounded px-2 py-1 flex items-start gap-2 mb-2">
              <span className="font-semibold">Suggested Action:</span>
              <span>{result.suggestedAction}</span>
            </div>
          )}
        </div>
        
        {result.autoFixAvailable && onAutoFix && (
          <Button
            size="sm"
            variant="outline"
            onClick={onAutoFix}
            className="gap-2 shrink-0"
          >
            <Zap className="w-3 h-3" />
            Auto-Fix
          </Button>
        )}
      </div>
    </div>
  );
}

export default function LPManager() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'pages' | 'settings' | 'compliance'>('pages');
  const [editingConfig, setEditingConfig] = useState<LandingPageConfig | null>(null);
  const [editRedirectUrl, setEditRedirectUrl] = useState('');
  
  // Site settings state
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const [modifiedSettings, setModifiedSettings] = useState<Set<string>>(new Set());
  const [savingSettings, setSavingSettings] = useState(false);
  
  // Get all configs
  const allConfigs = landingPageConfigs;
  
  // Fetch site settings
  const { data: siteSettings, refetch: refetchSettings } = trpc.settings.getAll.useQuery();
  const updateSettingMutation = trpc.settings.update.useMutation({
    onSuccess: () => {
      refetchSettings();
    }
  });
  
  // Initialize local settings from fetched data
  useEffect(() => {
    if (siteSettings) {
      const settingsMap: Record<string, string> = {};
      siteSettings.forEach((s: { key: string; value: string }) => {
        settingsMap[s.key] = s.value;
      });
      setLocalSettings(settingsMap);
    }
  }, [siteSettings]);
  
  // Handle setting change
  const handleSettingChange = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setModifiedSettings(prev => new Set(prev).add(key));
  };
  
  // Save a single setting
  const handleSaveSetting = async (key: string) => {
    setSavingSettings(true);
    try {
      await updateSettingMutation.mutateAsync({ 
        key, 
        value: localSettings[key] || '' 
      });
      setModifiedSettings(prev => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
    setSavingSettings(false);
  };
  
  // Get setting value
  const getSettingValue = (key: string) => localSettings[key] || '';
  const isSettingModified = (key: string) => modifiedSettings.has(key);
  
  // Handle edit redirect URL
  const handleEditRedirectUrl = (config: LandingPageConfig) => {
    setEditingConfig(config);
    setEditRedirectUrl(config.redirectUrl || '/');
  };
  
  // Copy URL to clipboard
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const handleCopyUrl = async (slug: string) => {
    const fullUrl = slug === '/' ? PUBLISHED_BASE_URL : `${PUBLISHED_BASE_URL}/${slug}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(slug);
      toast.success('URL copied to clipboard');
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };
  
  // Quiz profiles with all possible outcomes
  const quizProfiles = [
    { id: 'side-sleeper-urgent', name: 'Side Sleeper (Severe)', description: 'Severe pain from improper side sleeping support', badge: 'Urgent', badgeColor: 'red', defaultRedirect: '/side-sleeper-pillow' },
    { id: 'side-sleeper', name: 'Side Sleeper', description: 'Needs specific pillow support for side sleeping', badge: 'Profile', badgeColor: 'blue', defaultRedirect: '/side-sleeper-pillow' },
    { id: 'neck-pain', name: 'Neck Pain Sufferer', description: 'Neck pain from poor pillow support', badge: 'Pain', badgeColor: 'orange', defaultRedirect: '/neck-pain-relief-pillow' },
    { id: 'hot-sleeper', name: 'Hot Sleeper', description: 'Temperature regulation is critical', badge: 'Temp', badgeColor: 'amber', defaultRedirect: '/hotel-quality-pillow' },
    { id: 'pillow-danger', name: 'Pillow Danger Zone', description: 'Old pillow is a health hazard', badge: 'Danger', badgeColor: 'red', defaultRedirect: '/hotel-quality-pillow' },
    { id: 'hotel-seeker', name: 'Hotel Sleep Seeker', description: 'Wants hotel-quality sleep at home', badge: 'Hotel', badgeColor: 'emerald', defaultRedirect: '/hotel-quality-pillow' },
    { id: 'back-sleeper', name: 'Back Sleeper', description: 'Needs proper cervical alignment for back sleeping', badge: 'Profile', badgeColor: 'blue', defaultRedirect: '/' },
    { id: 'stomach-sleeper', name: 'Stomach Sleeper', description: 'Requires low-profile support for stomach sleeping', badge: 'Profile', badgeColor: 'blue', defaultRedirect: '/' },
    { id: 'combo-sleeper', name: 'Combination Sleeper', description: 'Switches positions throughout the night', badge: 'Profile', badgeColor: 'purple', defaultRedirect: '/' },
    { id: 'allergy-sufferer', name: 'Allergy Sufferer', description: 'Needs hypoallergenic materials', badge: 'Health', badgeColor: 'teal', defaultRedirect: '/' },
    { id: 'snorer', name: 'Snorer', description: 'Needs elevation to reduce snoring', badge: 'Health', badgeColor: 'indigo', defaultRedirect: '/' },
    { id: 'general', name: 'General Sleeper', description: 'No specific issues, wants quality sleep', badge: 'Default', badgeColor: 'zinc', defaultRedirect: '/' },
  ];
  
  // Quiz redirect state - initialized from site settings
  const [quizRedirects, setQuizRedirects] = useState<Record<string, string>>({});
  const [quizRedirectsModified, setQuizRedirectsModified] = useState<Set<string>>(new Set());
  
  // Initialize quiz redirects from settings
  useEffect(() => {
    if (siteSettings) {
      const redirects: Record<string, string> = {};
      const settingKeyToProfileId: Record<string, string> = {
        'quiz_redirect_the_restless_sleeper': 'side-sleeper',
        'quiz_redirect_the_pain_sufferer': 'neck-pain',
        'quiz_redirect_the_hot_sleeper': 'hot-sleeper',
        'quiz_redirect_the_allergy_prone': 'pillow-danger',
        'quiz_redirect_the_pillow_stacker': 'side-sleeper-urgent',
        'quiz_redirect_the_quality_seeker': 'hotel-quality',
      };
      siteSettings.forEach((s: { key: string; value: string }) => {
        const profileId = settingKeyToProfileId[s.key];
        if (profileId && s.value) {
          redirects[profileId] = s.value;
        }
      });
      setQuizRedirects(redirects);
    }
  }, [siteSettings]);
  
  // Save quiz redirect to database
  const handleSaveQuizRedirect = async (profileId: string) => {
    const profileIdToSettingKey: Record<string, string> = {
      'side-sleeper': 'quiz_redirect_the_restless_sleeper',
      'side-sleeper-urgent': 'quiz_redirect_the_pillow_stacker',
      'neck-pain': 'quiz_redirect_the_pain_sufferer',
      'hot-sleeper': 'quiz_redirect_the_hot_sleeper',
      'pillow-danger': 'quiz_redirect_the_allergy_prone',
      'hotel-quality': 'quiz_redirect_the_quality_seeker',
      'general': 'quiz_redirect_the_quality_seeker',
      'allergies': 'quiz_redirect_the_allergy_prone',
      'pillow-stacker': 'quiz_redirect_the_pillow_stacker',
    };
    const settingKey = profileIdToSettingKey[profileId];
    if (!settingKey) return;
    
    try {
      await updateSettingMutation.mutateAsync({
        key: settingKey,
        value: quizRedirects[profileId] || '/'
      });
      setQuizRedirectsModified(prev => {
        const next = new Set(prev);
        next.delete(profileId);
        return next;
      });
      toast.success('Quiz redirect saved');
    } catch (error) {
      console.error('Failed to save quiz redirect:', error);
      toast.error('Failed to save redirect');
    }
  };
  
  // Handle quiz redirect change
  const handleQuizRedirectChange = (profileId: string, value: string) => {
    setQuizRedirects(prev => ({ ...prev, [profileId]: value }));
    setQuizRedirectsModified(prev => new Set(prev).add(profileId));
  };
  
  // Available pages for redirect dropdown
  const availablePages = [
    { slug: '/', name: 'Home (Default)' },
    ...allConfigs.map(c => ({ slug: `/${c.slug}`, name: c.name }))
  ];
  
  // Quiz Profile Card Component
  const QuizProfileCard = ({ profile }: { profile: typeof quizProfiles[0] }) => {
    const badgeColors: Record<string, string> = {
      red: 'text-red-600 bg-red-100 dark:bg-red-900/30',
      blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      orange: 'text-orange-600 bg-orange-100 dark:bg-orange-900/30',
      amber: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
      emerald: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
      purple: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
      teal: 'text-teal-600 bg-teal-100 dark:bg-teal-900/30',
      indigo: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30',
      zinc: 'text-zinc-600 bg-zinc-100 dark:bg-zinc-700/30',
    };
    
    const currentRedirect = quizRedirects[profile.id] || profile.defaultRedirect;
    const isModified = quizRedirectsModified.has(profile.id);
    
    return (
      <div className={`rounded-xl border ${isModified ? 'border-indigo-400 dark:border-indigo-500' : 'border-zinc-200 dark:border-zinc-700'} bg-zinc-50 dark:bg-zinc-800/50 p-4 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors`}>
        <div className="flex items-start justify-between mb-2">
          <span className={`text-[10px] font-bold ${badgeColors[profile.badgeColor]} px-2 py-0.5 rounded-full uppercase tracking-wide`}>
            {profile.badge}
          </span>
          {isModified && (
            <button
              onClick={() => handleSaveQuizRedirect(profile.id)}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          )}
        </div>
        <h5 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 mb-1">{profile.name}</h5>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed line-clamp-2">{profile.description}</p>
        
        {/* Redirect URL Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-600 dark:text-emerald-400 text-xs">→</span>
          <select
            className="flex-1 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            value={currentRedirect}
            onChange={(e) => handleQuizRedirectChange(profile.id, e.target.value)}
          >
            {availablePages.map(page => (
              <option key={page.slug} value={page.slug}>
                {page.slug}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };
  
  // Config Card Component - Stripe-inspired design with CTA management
  const ConfigCard = ({ config }: { config: LandingPageConfig }): React.ReactElement => {
    // Get saved settings from database
    const savedSettings = landingPageSettings?.find((s: { pageId: string }) => s.pageId === config.id);
    
    const [ctaButtonId, setCtaButtonId] = useState<number | null>(savedSettings?.ctaButtonId || null);
    const [hasChanges, setHasChanges] = useState(false);
    
    // Fetch CTA buttons for selector
    const { data: ctaButtons } = trpc.ctaButtons.getAll.useQuery();
    
    // Update local state when database settings load
    useEffect(() => {
      if (savedSettings) {
        if (savedSettings.ctaButtonId !== undefined) setCtaButtonId(savedSettings.ctaButtonId);
      }
    }, [savedSettings]);
    
    const handleSaveSettings = () => {
      updateLandingPageMutation.mutate({
        pageId: config.id,
        ctaButtonId: ctaButtonId,
      });
      setHasChanges(false);
    };
    
    return (
      <div className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 overflow-hidden">
        {/* Live Preview */}
        <div className="aspect-[16/10] bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 relative overflow-hidden">
          <iframe
            src={`/${config.slug}`}
            title={`Preview of ${config.name}`}
            className="absolute inset-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none border-0"
            loading="lazy"
          />
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          {/* Title */}
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1 truncate">{config.name}</h4>
          
          {/* Slug - Clickable to copy */}
          <button
            onClick={() => handleCopyUrl(config.slug)}
            className="group/url flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-3 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors w-full text-left"
            title={`Click to copy: ${PUBLISHED_BASE_URL}/${config.slug}`}
          >
            <span className="truncate">/{config.slug}</span>
            {copiedSlug === config.slug ? (
              <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            ) : (
              <Copy className="w-3 h-3 opacity-0 group-hover/url:opacity-100 transition-opacity flex-shrink-0" />
            )}
          </button>
          
          {/* Settings Row */}
          <div className="space-y-2 mb-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            {/* CTA Button Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 w-12 flex-shrink-0">CTA</span>
              <select
                className="flex-1 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md pl-2 pr-8 py-1.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={ctaButtonId || ''}
                onChange={(e) => { setCtaButtonId(e.target.value ? Number(e.target.value) : null); setHasChanges(true); }}
              >
                <option value="">Use default</option>
                {ctaButtons?.map((btn: { id: number; text: string }) => (
                  <option key={btn.id} value={btn.id}>
                    {btn.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            {hasChanges && (
              <button 
                onClick={handleSaveSettings}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-xs font-medium"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            )}
            <Link href={`/${config.slug}`} className="flex-1">
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-xs font-medium">
                <Eye className="w-3.5 h-3.5" />
                View
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  // Fetch landing page settings from database
  const { data: landingPageSettings, refetch: refetchLandingPageSettings } = trpc.landingPages.getAll.useQuery();
  
  // Sync all event end dates to localStorage on load
  useEffect(() => {
    if (landingPageSettings && landingPageSettings.length > 0) {
      try {
        const storedDates = localStorage.getItem('skyvane_event_dates');
        const dates = storedDates ? JSON.parse(storedDates) : {};
        
        landingPageSettings.forEach(setting => {
          if (setting.eventEndDate) {
            dates[setting.pageId] = {
              ...dates[setting.pageId],
              endDate: setting.eventEndDate
            };
          }
        });
        
        localStorage.setItem('skyvane_event_dates', JSON.stringify(dates));
      } catch (e) {
        console.error('Failed to sync event dates from database:', e);
      }
    }
  }, [landingPageSettings]);
  
  const regenerateContentMutation = trpc.landingPages.regenerateContent.useMutation({
    onSuccess: () => {
      refetchLandingPageSettings();
    },
  });
  
  const updateLandingPageMutation = trpc.landingPages.update.useMutation({
    onSuccess: (_, variables) => {
      refetchLandingPageSettings();
      toast.success('Event settings saved');
      
      // Sync event end date to localStorage for countdown timer
      if (variables.eventEndDate) {
        try {
          const storedDates = localStorage.getItem('skyvane_event_dates');
          const dates = storedDates ? JSON.parse(storedDates) : {};
          dates[variables.pageId] = {
            ...dates[variables.pageId],
            endDate: variables.eventEndDate
          };
          localStorage.setItem('skyvane_event_dates', JSON.stringify(dates));
        } catch (e) {
          console.error('Failed to sync event dates to localStorage:', e);
        }
      }
    },
    onError: (error) => {
      console.error('Failed to save event settings:', error);
      toast.error('Failed to save settings');
    }
  });
  
  // Event Card Component - With inline settings
  const EventCard = ({ config }: { config: LandingPageConfig }): React.ReactElement => {
    // Fetch color schemes from database
    const { data: backendColorSchemes } = trpc.colorSchemes.getAll.useQuery();
    
    // Build color schemes array from backend data with fallback to hardcoded
    const colorSchemes = backendColorSchemes?.map(scheme => ({
      id: scheme.slug,
      name: scheme.name,
      color: scheme.primaryColor // Use primaryColor for preview dot
    })) || [
      { id: 'valentine-gift', name: 'Valentine Gift', color: '#e63946' },
      { id: 'mothers-day', name: "Mother's Day", color: '#d4a5a5' },
      { id: 'fathers-day', name: "Father's Day", color: '#2d3a5c' },
      { id: 'default', name: 'Default', color: '#1a1a1a' },
    ];
    
    // Fetch marketing angles from database
    const { data: marketingAngles } = trpc.marketingAngles.getAll.useQuery();
    
    // Get default color scheme based on config id
    const getDefaultScheme = () => {
      if (config.id.includes('valentine')) return 'valentine-gift';
      if (config.id.includes('mothers')) return 'mothers-day';
      if (config.id.includes('fathers')) return 'fathers-day';
      return 'default';
    };
    
    // Get saved settings from database
    const savedSettings = landingPageSettings?.find((s: { pageId: string }) => s.pageId === config.id);
    
    const [selectedScheme, setSelectedScheme] = useState(savedSettings?.colorScheme || getDefaultScheme());
    const [angleId, setAngleId] = useState<number | null>(savedSettings?.angleId || null);
    const [eventEndDate, setEventEndDate] = useState(savedSettings?.eventEndDate || '');
    const [ctaButtonId, setCtaButtonId] = useState<number | null>(savedSettings?.ctaButtonId || null);
    const [hasChanges, setHasChanges] = useState(false);
    
    // Fetch CTA buttons for selector
    const { data: ctaButtons } = trpc.ctaButtons.getAll.useQuery();
    
    // Update local state when database settings load
    useEffect(() => {
      if (savedSettings) {
        if (savedSettings.colorScheme) setSelectedScheme(savedSettings.colorScheme);
        if (savedSettings.angleId !== undefined) setAngleId(savedSettings.angleId);
        if (savedSettings.eventEndDate) setEventEndDate(savedSettings.eventEndDate);
        if (savedSettings.ctaButtonId !== undefined) setCtaButtonId(savedSettings.ctaButtonId);
      }
    }, [savedSettings]);
    
    const handleSchemeChange = (value: string) => {
      setSelectedScheme(value);
      setHasChanges(true);
    };
    
    const handleAngleChange = async (value: string) => {
      const newAngleId = value ? parseInt(value) : null;
      setAngleId(newAngleId);
      setHasChanges(true);
      
      // Trigger content regeneration if angle is selected
      if (newAngleId) {
        try {
          await regenerateContentMutation.mutateAsync({
            pageId: config.id,
            angleId: newAngleId,
            pageType: 'event', // EventCard is only used for event pages
          });
          toast.success('Content regenerated based on new angle');
        } catch (error) {
          toast.error('Failed to regenerate content');
        }
      }
    };
    
    const handleEndDateChange = (value: string) => {
      setEventEndDate(value);
      setHasChanges(true);
    };
    
    const handleSaveSettings = () => {
      updateLandingPageMutation.mutate({
        pageId: config.id,
        colorScheme: selectedScheme,
        eventEndDate: eventEndDate,
        ctaButtonId: ctaButtonId,
        angleId: angleId,
      });
      setHasChanges(false);
    };
    
    const currentScheme = colorSchemes.find(s => s.id === selectedScheme) || colorSchemes[3];
    
    return (
      <div className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 transition-all duration-300 overflow-hidden">
        {/* Live Preview - No badge */}
        <div className="aspect-[16/10] bg-gradient-to-br from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 relative overflow-hidden">
          <iframe
            src={`/${config.slug}`}
            title={`Preview of ${config.name}`}
            className="absolute inset-0 w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none border-0"
            loading="lazy"
          />
        </div>
        
        {/* Card Content */}
        <div className="p-4">
          {/* Title */}
          <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-1 truncate">{config.name}</h4>
          
          {/* Slug - Clickable to copy */}
          <button
            onClick={() => handleCopyUrl(config.slug)}
            className="group/url flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-3 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors w-full text-left"
            title={`Click to copy: ${PUBLISHED_BASE_URL}/${config.slug}`}
          >
            <span className="truncate">/{config.slug}</span>
            {copiedSlug === config.slug ? (
              <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            ) : (
              <Copy className="w-3 h-3 opacity-0 group-hover/url:opacity-100 transition-opacity flex-shrink-0" />
            )}
          </button>
          
          {/* Settings Row */}
          <div className="space-y-2 mb-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            {/* Color Scheme Selector with inline color preview */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 w-12 flex-shrink-0">Theme</span>
              <div className="flex-1 relative">
                <div 
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full ring-1 ring-white dark:ring-zinc-700 shadow-sm z-10"
                  style={{ backgroundColor: currentScheme.color }}
                />
                <select 
                  className="w-full text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md pl-6 pr-8 py-1.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={selectedScheme}
                  onChange={(e) => handleSchemeChange(e.target.value)}
                >
                  {colorSchemes.map(scheme => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Angle Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 w-12 flex-shrink-0">Angle</span>
              <select 
                className="flex-1 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md pl-2 pr-8 py-1.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={angleId?.toString() || ''}
                onChange={(e) => handleAngleChange(e.target.value)}
              >
                <option value="">No angle selected</option>
                {marketingAngles?.map(angle => (
                  <option key={angle.id} value={angle.id}>
                    {angle.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Event End Date Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 w-12 flex-shrink-0">Ends</span>
              <div className="flex-1 relative">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
                <input
                  type="date"
                  className="w-full text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md pl-6 pr-2 py-1.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={eventEndDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                />
              </div>
            </div>
            
            {/* CTA Button Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 w-12 flex-shrink-0">CTA</span>
              <select
                className="flex-1 text-xs bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-md pl-2 pr-8 py-1.5 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                value={ctaButtonId || ''}
                onChange={(e) => { setCtaButtonId(e.target.value ? Number(e.target.value) : null); setHasChanges(true); }}
              >
                <option value="">Use default</option>
                {ctaButtons?.map((btn: { id: number; text: string }) => (
                  <option key={btn.id} value={btn.id}>
                    {btn.text}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2">
            {hasChanges && (
              <button 
                onClick={handleSaveSettings}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-xs font-medium"
              >
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
            )}
            <Link href={`/${config.slug}`} className="flex-1">
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-xs font-medium">
                <Eye className="w-3.5 h-3.5" />
                View
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  // Setting input component - Stripe style
  const SettingInput = ({ settingKey, label, description }: { settingKey: string; label: string; description?: string }): React.ReactElement => (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex-1">
        <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{label}</label>
        {description && <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{description}</p>}
        <input
          type="text"
          value={getSettingValue(settingKey)}
          onChange={(e) => handleSettingChange(settingKey, e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
        />
      </div>
      {isSettingModified(settingKey) && (
        <button
          onClick={() => handleSaveSetting(settingKey)}
          disabled={savingSettings}
          className="mt-6 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      )}
    </div>
  );
  
  // Section Header Component
  const SectionHeader = ({ icon: Icon, title, count, color }: { icon: React.ElementType; title: string; count: number; color: string }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{count} {count === 1 ? 'page' : 'pages'}</p>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header - Stripe-inspired */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <FluffLogo className="h-6 w-auto" color="currentColor" />
              </Link>
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">LP Manager</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* System Status */}
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Operational</span>
                <span className="text-emerald-500 dark:text-emerald-500">·</span>
                <span className="text-emerald-600/70 dark:text-emerald-400/70">{allConfigs.length} pages</span>
              </div>
              
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
              
              <Link href="/">
                <button className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Site
                </button>
              </Link>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-2 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('pages')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'pages'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Landing Pages
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Site Settings
            </button>
            <button
              onClick={() => setActiveTab('compliance')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'compliance'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Compliance
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'pages' ? (
          <div className="space-y-12">
            {/* Legacy/Default Page */}
            {allConfigs.filter((c: LandingPageConfig) => c.category === 'legacy').length > 0 && (
              <section>
                <SectionHeader icon={Zap} title="Default Page" count={1} color="bg-amber-500" />
                
                {allConfigs
                  .filter((config: LandingPageConfig) => config.category === 'legacy')
                  .map((config: LandingPageConfig) => (
                    <div key={config.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-amber-200 dark:border-amber-800/50 overflow-hidden shadow-sm">
                        {/* Details */}
                        <div className="p-6 lg:p-8 flex flex-col justify-between">
                          <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-full mb-4">
                              <Zap className="w-3 h-3" />
                              Primary Route
                            </div>
                            <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{config.name}</h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
                              This is the main landing page displayed at the root URL. It uses the "5-Star Hotel" marketing angle to convert visitors.
                            </p>
                            <div className="inline-flex items-center text-xs font-mono text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg">
                              <span className="text-emerald-600 dark:text-emerald-400 mr-2">→</span>
                              /
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-3 mt-6">
                            <Link href="/" className="flex-1">
                              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors text-sm font-medium">
                                <Eye className="w-4 h-4" />
                                View Page
                              </button>
                            </Link>
                            <button
                              onClick={() => handleEditRedirectUrl(config)}
                              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300"
                            >
                              <Settings className="w-4 h-4" />
                              Settings
                            </button>
                          </div>
                        </div>
                    </div>
                  ))}
              </section>
            )}
            
            {/* Angle Pages */}
            <section>
              <SectionHeader 
                icon={ChevronRight} 
                title="Angle Pages" 
                count={allConfigs.filter((c: LandingPageConfig) => c.category === 'angle').length} 
                color="bg-emerald-500" 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {allConfigs
                  .filter((config: LandingPageConfig) => config.category === 'angle')
                  .map((config: LandingPageConfig) => (
                    <ConfigCard key={config.id} config={config} />
                  ))}
              </div>
            </section>
            
            {/* Event Pages */}
            <section>
              <SectionHeader 
                icon={ChevronRight} 
                title="Event Pages" 
                count={allConfigs.filter((c: LandingPageConfig) => c.category === 'event').length} 
                color="bg-purple-500" 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {allConfigs
                  .filter((config: LandingPageConfig) => config.category === 'event')
                  .map((config: LandingPageConfig) => (
                    <EventCard key={config.id} config={config} />
                  ))}
              </div>
            </section>
            
            {/* Use Case Pages */}
            <section>
              <SectionHeader 
                icon={ChevronRight} 
                title="Use Case Pages" 
                count={allConfigs.filter((c: LandingPageConfig) => c.category === 'use-case').length} 
                color="bg-blue-500" 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {allConfigs
                  .filter((config: LandingPageConfig) => config.category === 'use-case')
                  .map((config: LandingPageConfig) => (
                    <ConfigCard key={config.id} config={config} />
                  ))}
              </div>
            </section>
            
            {/* Quiz Results Section */}
            <section>
              <SectionHeader 
                icon={ChevronRight} 
                title="Sleep Quiz" 
                count={quizProfiles.length} 
                color="bg-cyan-500" 
              />
              
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {/* Quiz Header */}
                <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-r from-cyan-50 to-transparent dark:from-cyan-900/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">12-Question Sleep Quiz</h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Each result profile redirects users to a specific landing page. Use the dropdown to change redirects.
                      </p>
                    </div>
                    <Link href="/quiz">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-colors text-xs font-medium shadow-sm">
                        <Eye className="w-3.5 h-3.5" />
                        Preview Quiz
                      </button>
                    </Link>
                  </div>
                </div>
                
                {/* Quiz Result Profiles */}
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {quizProfiles.map(profile => (
                      <QuizProfileCard key={profile.id} profile={profile} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="space-y-8 max-w-full">
            {/* CTA Buttons Manager */}
            <CtaButtonsManager />
            
            {/* Marketing Angles Manager */}
            <MarketingAnglesManager />
            
            {/* Color Schemes Manager */}
            <ColorSchemesManager />
            
            {/* Shipping Settings */}
            <section>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Shipping Messages</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
                Configure shipping time messages displayed on the product page.
              </p>
              <div className="space-y-3">
                <SettingInput
                  settingKey="shipping_time_us"
                  label="US Shipping Time"
                  description="Example: '2-4 business days'"
                />
                <SettingInput
                  settingKey="shipping_time_eu"
                  label="EU Shipping Time"
                  description="Example: '5-7 business days'"
                />
                <SettingInput
                  settingKey="shipping_time_default"
                  label="Default Shipping Time"
                  description="Used for other regions. Example: '7-14 business days'"
                />
                <SettingInput
                  settingKey="non_us_badge_text"
                  label="Non-US Badge Text"
                  description="Badge shown to international visitors instead of 'Free Shipping'. Example: 'Free Returns'"
                />
                <SettingInput
                  settingKey="non_us_alternative_usp_title"
                  label="Non-US Alternative USP Title"
                  description="Replaces 'Made in USA' for international visitors. Example: 'Award-Winning Quality'"
                />
                <SettingInput
                  settingKey="non_us_alternative_usp_description"
                  label="Non-US Alternative USP Description"
                  description="Description for the alternative USP. Example: 'Oprah Daily recognized'"
                />
              </div>
            </section>
            
            {/* Product Settings */}
            <section>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">Product Settings</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">
                Configure product-related text and messaging.
              </p>
              <div className="space-y-3">
                <SettingInput
                  settingKey="trial_period_text"
                  label="Trial Period Badge"
                  description="Example: '100 Night Better Sleep'"
                />
                <SettingInput
                  settingKey="customer_count_base"
                  label="Customer Count Base"
                  description="Starting number for 'Happy Sleepers' count"
                />
                <SettingInput
                  settingKey="customer_count_weekly_increment"
                  label="Weekly Increment"
                  description="Number of customers added per week"
                />
              </div>
            </section>
          </div>
        ) : (
          <ComplianceContent />
        )}
      </div>
      
      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center">
            All Rights Reserved © 2026 Skyvane Funnels
          </p>
        </div>
      </footer>
      
      {/* Edit Modal */}
      {editingConfig && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Edit {editingConfig.name}</h3>
              <button
                onClick={() => setEditingConfig(null)}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Redirect URL</label>
                <input
                  type="text"
                  value={editRedirectUrl}
                  onChange={(e) => setEditRedirectUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                  placeholder="/"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditingConfig(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setEditingConfig(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm font-medium shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
