/**
 * Marketing Angles Manager Component
 * 
 * Allows admins to create, edit, and delete marketing angles
 * Each angle defines product positioning (title, tags, description, color scheme)
 * Converted to use modal popup for create form
 */

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface MarketingAngle {
  id: number;
  slug: string;
  name: string;
  productTitle: string | null;
  tags: string | null;
  description: string | null;
  sortOrder: number | null;
  isActive: number | null;
}

export default function MarketingAnglesManager() {
  const [editingAngle, setEditingAngle] = useState<MarketingAngle | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    productTitle: '',
    tags: '',
    description: '',
  });

  // Fetch all angles
  const { data: angles, refetch } = trpc.marketingAngles.getAll.useQuery();

  // Initialize default angles
  const initDefaults = trpc.marketingAngles.initDefaults.useMutation({
    onSuccess: () => {
      toast.success('Default angles initialized');
      refetch();
    },
    onError: () => {
      toast.error('Failed to initialize default angles');
    },
  });

  // Create angle mutation
  const createAngle = trpc.marketingAngles.create.useMutation({
    onSuccess: () => {
      toast.success('Marketing angle created successfully');
      setShowCreateModal(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create angle: ${error.message}`);
    },
  });

  // Update angle mutation
  const updateAngle = trpc.marketingAngles.update.useMutation({
    onSuccess: () => {
      toast.success('Marketing angle updated successfully');
      setEditingAngle(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update angle: ${error.message}`);
    },
  });

  // Delete angle mutation
  const deleteAngle = trpc.marketingAngles.delete.useMutation({
    onSuccess: () => {
      toast.success('Marketing angle deleted successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete angle: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      name: '',
      productTitle: '',
      tags: '',
      description: '',
    });
  };

  const cancelEdit = () => {
    setEditingAngle(null);
    setShowCreateModal(false);
    resetForm();
  };

  const handleCreate = () => {
    if (!formData.slug || !formData.name) {
      toast.error('Slug and name are required');
      return;
    }

    createAngle.mutate({
      slug: formData.slug,
      name: formData.name,
      productTitle: formData.productTitle || undefined,
      tags: formData.tags || undefined,
      description: formData.description || undefined,
    });
  };

  const handleUpdate = () => {
    if (!editingAngle) return;

    updateAngle.mutate({
      id: editingAngle.id,
      slug: editingAngle.slug,
      name: editingAngle.name,
      productTitle: editingAngle.productTitle || undefined,
      tags: editingAngle.tags || undefined,
      description: editingAngle.description || undefined,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this angle?')) {
      deleteAngle.mutate({ id });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Marketing Angles</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Define product positioning and messaging for different customer segments
          </p>
        </div>
        <div className="flex gap-2">
          {angles?.length === 0 && (
            <Button
              onClick={() => initDefaults.mutate()}
              disabled={initDefaults.isPending}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Init Defaults
            </Button>
          )}
          <Button
            onClick={() => setShowCreateModal(true)}
            disabled={editingAngle !== null}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Angle
          </Button>
        </div>
      </div>

      {/* Angles List */}
      <div className="space-y-3">
        {angles?.map((angle) => (
          <Card key={angle.id} className="p-4">
            {editingAngle?.id === angle.id ? (
              // Edit Mode
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Slug (URL-friendly ID) *
                    </label>
                    <input
                      type="text"
                      value={editingAngle.slug}
                      onChange={(e) => setEditingAngle({ ...editingAngle, slug: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={editingAngle.name}
                      onChange={(e) => setEditingAngle({ ...editingAngle, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={editingAngle.productTitle || ''}
                    onChange={(e) => setEditingAngle({ ...editingAngle, productTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editingAngle.tags || ''}
                    onChange={(e) => setEditingAngle({ ...editingAngle, tags: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingAngle.description || ''}
                    onChange={(e) => setEditingAngle({ ...editingAngle, description: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    rows={2}
                  />
                </div>



                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdate}
                    disabled={updateAngle.isPending}
                    size="sm"
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                  <Button
                    onClick={cancelEdit}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // Display Mode
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">{angle.name}</h4>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">/{angle.slug}</span>
                  </div>

                  {angle.productTitle && (
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-2">{angle.productTitle}</p>
                  )}

                  {angle.tags && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {angle.tags.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {angle.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{angle.description}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingAngle(angle)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(angle.id)}
                    disabled={deleteAngle.isPending}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {angles?.length === 0 && (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          <p>No marketing angles yet. Create one or initialize defaults to get started.</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Add Marketing Angle</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Slug (URL ID) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="hotel-quality"
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Hotel Quality"
                    className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Product Title
                </label>
                <input
                  type="text"
                  value={formData.productTitle}
                  onChange={(e) => setFormData({ ...formData, productTitle: e.target.value })}
                  placeholder="The Same Pillows Used in 5-Star Hotels"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="100% Cotton,Skin Friendly,Award Winning"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="One-sentence summary of the unique value proposition"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                />
              </div>



              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={createAngle.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createAngle.isPending ? "Creating..." : "Create Angle"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
