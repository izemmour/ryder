/**
 * Landing Page Manager
 * 
 * Admin interface for creating and managing landing page configurations
 * Features:
 * - Create/edit/delete landing pages
 * - Live screenshot previews
 * - Configure hero, benefits, testimonials, FAQ
 * - SEO settings
 */

import { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Save, X, RefreshCw } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import type { LandingPageConfig } from '@shared/landingPageTypes';
import { defaultLandingPageConfig } from '@shared/defaultLandingPageConfig';

export default function LandingPageManager() {
  const [landingPages, setLandingPages] = useState<LandingPageConfig[]>([]);
  const [selectedPage, setSelectedPage] = useState<LandingPageConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [screenshots, setScreenshots] = useState<Record<string, string>>({});

  // Load landing pages from localStorage (will be replaced with database later)
  useEffect(() => {
    const stored = localStorage.getItem('landing_pages');
    if (stored) {
      setLandingPages(JSON.parse(stored));
    } else {
      // Initialize with default
      setLandingPages([defaultLandingPageConfig]);
      localStorage.setItem('landing_pages', JSON.stringify([defaultLandingPageConfig]));
    }
  }, []);

  // Generate screenshots for all pages
  const generateScreenshots = async () => {
    const baseUrl = window.location.origin;
    // TODO: Call screenshot service via tRPC
    console.log('Generating screenshots for', baseUrl);
  };

  const createNewPage = () => {
    const newPage: LandingPageConfig = {
      ...defaultLandingPageConfig,
      id: `page-${Date.now()}`,
      name: 'New Landing Page',
      slug: `/page-${Date.now()}`
    };
    setSelectedPage(newPage);
    setIsEditing(true);
  };

  const savePage = () => {
    if (!selectedPage) return;
    
    const existingIndex = landingPages.findIndex(p => p.id === selectedPage.id);
    let updated: LandingPageConfig[];
    
    if (existingIndex >= 0) {
      updated = [...landingPages];
      updated[existingIndex] = selectedPage;
    } else {
      updated = [...landingPages, selectedPage];
    }
    
    setLandingPages(updated);
    localStorage.setItem('landing_pages', JSON.stringify(updated));
    setIsEditing(false);
  };

  const deletePage = (id: string) => {
    if (confirm('Are you sure you want to delete this landing page?')) {
      const updated = landingPages.filter(p => p.id !== id);
      setLandingPages(updated);
      localStorage.setItem('landing_pages', JSON.stringify(updated));
      if (selectedPage?.id === id) {
        setSelectedPage(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Landing Page Manager</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={generateScreenshots}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Screenshots
              </button>
              <button
                onClick={createNewPage}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Landing Page
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Landing Pages List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">All Landing Pages</h2>
            <div className="space-y-3">
              {landingPages.map((page) => (
                <div
                  key={page.id}
                  className={`bg-white rounded-lg border-2 transition-all cursor-pointer ${
                    selectedPage?.id === page.id
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPage(page)}
                >
                  {/* Screenshot Preview */}
                  <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                    {screenshots[page.id] ? (
                      <img
                        src={screenshots[page.id]}
                        alt={page.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Eye className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  
                  {/* Page Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{page.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{page.slug}</p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPage(page);
                          setIsEditing(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(page.slug, '_blank');
                        }}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Preview
                      </button>
                      {page.id !== 'default' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePage(page.id);
                          }}
                          className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editor Panel */}
          <div className="lg:col-span-2">
            {selectedPage ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {isEditing ? 'Edit Landing Page' : 'Landing Page Details'}
                  </h2>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setSelectedPage(landingPages.find(p => p.id === selectedPage.id) || null);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={savePage}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save Changes
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Name
                    </label>
                    <input
                      type="text"
                      value={selectedPage.name}
                      onChange={(e) => setSelectedPage({ ...selectedPage, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={selectedPage.slug}
                      onChange={(e) => setSelectedPage({ ...selectedPage, slug: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {/* Hero Section */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={selectedPage.hero.headline}
                        onChange={(e) => setSelectedPage({
                          ...selectedPage,
                          hero: { ...selectedPage.hero, headline: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subheadline
                      </label>
                      <textarea
                        value={selectedPage.hero.subheadline}
                        onChange={(e) => setSelectedPage({
                          ...selectedPage,
                          hero: { ...selectedPage.hero, subheadline: e.target.value }
                        })}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={selectedPage.hero.ctaText}
                        onChange={(e) => setSelectedPage({
                          ...selectedPage,
                          hero: { ...selectedPage.hero, ctaText: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Page Title
                      </label>
                      <input
                        type="text"
                        value={selectedPage.seo.title}
                        onChange={(e) => setSelectedPage({
                          ...selectedPage,
                          seo: { ...selectedPage.seo, title: e.target.value }
                        })}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Meta Description
                      </label>
                      <textarea
                        value={selectedPage.seo.description}
                        onChange={(e) => setSelectedPage({
                          ...selectedPage,
                          seo: { ...selectedPage.seo, description: e.target.value }
                        })}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Page Selected
                </h3>
                <p className="text-gray-500 mb-6">
                  Select a landing page from the list or create a new one to get started.
                </p>
                <button
                  onClick={createNewPage}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Page
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
