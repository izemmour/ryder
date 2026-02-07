/**
 * Color Schemes Manager Component
 * 
 * Manages event page color schemes with 6 standardized colors:
 * - primaryColor: Main CTA buttons, titles, highlights
 * - secondaryColor: Announcement bar, Premium Quality section
 * - accentColor: Very light backgrounds for contrast sections
 * - accentDarkColor: Press bar, alternating sections
 * - backgroundColor: Main page background tint
 * - secondaryLightColor: Badges, pills, subtle highlights
 * 
 * System colors (#1d9bf0, #00b67a, #f59e0b, #2d3a5c, #c9a962) are hardcoded and never overridden.
 * Converted to use modal popup for create/edit forms
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Check, X, Palette } from "lucide-react";
import { toast } from "sonner";

interface ColorScheme {
  id: number;
  slug: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  accentDarkColor: string;
  backgroundColor: string;
  secondaryLightColor: string;
  description: string | null;
  sortOrder: number | null;
  isActive: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ColorSchemeFormData {
  slug: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  accentDarkColor: string;
  backgroundColor: string;
  secondaryLightColor: string;
  description: string;
  isDark: boolean;
}

const emptyFormData: ColorSchemeFormData = {
  slug: "",
  name: "",
  primaryColor: "#000000",
  secondaryColor: "#000000",
  accentColor: "#ffffff",
  accentDarkColor: "#f0f0f0",
  backgroundColor: "#ffffff",
  secondaryLightColor: "#f5f5f5",
  description: "",
  isDark: false,
};

export function ColorSchemesManager() {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ColorSchemeFormData>(emptyFormData);

  const { data: colorSchemes = [] } = trpc.colorSchemes.getAll.useQuery();

  const createMutation = trpc.colorSchemes.create.useMutation({
    onSuccess: () => {
      toast.success("Color scheme created successfully");
      closeModal();
    },
    onError: (error) => {
      toast.error(`Failed to create color scheme: ${error.message}`);
    },
  });

  const updateMutation = trpc.colorSchemes.update.useMutation({
    onSuccess: () => {
      toast.success("Color scheme updated successfully");
      closeModal();
    },
    onError: (error) => {
      toast.error(`Failed to update color scheme: ${error.message}`);
    },
  });

  const deleteMutation = trpc.colorSchemes.delete.useMutation({
    onSuccess: () => {
      toast.success("Color scheme deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete color scheme: ${error.message}`);
    },
  });

  const handleCreate = () => {
    if (!formData.slug || !formData.name) {
      toast.error("Slug and name are required");
      return;
    }

    createMutation.mutate({
      slug: formData.slug,
      name: formData.name,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      accentColor: formData.accentColor,
      accentDarkColor: formData.accentDarkColor,
      backgroundColor: formData.backgroundColor,
      secondaryLightColor: formData.secondaryLightColor,
      description: formData.description || undefined,
      isDark: formData.isDark,
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;

    updateMutation.mutate({
      id: editingId,
      data: {
        slug: formData.slug,
        name: formData.name,
        primaryColor: formData.primaryColor,
        secondaryColor: formData.secondaryColor,
        accentColor: formData.accentColor,
        accentDarkColor: formData.accentDarkColor,
        backgroundColor: formData.backgroundColor,
        secondaryLightColor: formData.secondaryLightColor,
        description: formData.description || undefined,
        isDark: formData.isDark,
      },
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this color scheme?")) {
      deleteMutation.mutate({ id });
    }
  };

  const openCreateModal = () => {
    setFormData(emptyFormData);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (scheme: ColorScheme) => {
    setEditingId(scheme.id);
    setFormData({
      slug: scheme.slug,
      name: scheme.name,
      primaryColor: scheme.primaryColor,
      secondaryColor: scheme.secondaryColor,
      accentColor: scheme.accentColor,
      accentDarkColor: scheme.accentDarkColor,
      backgroundColor: scheme.backgroundColor,
      secondaryLightColor: scheme.secondaryLightColor,
      description: scheme.description || "",
      isDark: (scheme as any).isDark === 1,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setEditingId(null);
    setShowModal(false);
    setFormData(emptyFormData);
  };

  const ColorInput = ({ label, value, onChange, description }: { label: string; value: string; onChange: (v: string) => void; description: string }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</Label>
      <div className="flex gap-2 items-center">
        <div
          className="w-10 h-10 rounded border-2 border-zinc-200 dark:border-zinc-700 flex-shrink-0"
          style={{ backgroundColor: value }}
        />
        <div className="flex-1">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
            className="font-mono text-sm px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Color Schemes</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Define color palettes for event pages with 6 standardized colors per theme
          </p>
        </div>
        <Button onClick={openCreateModal} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Color Scheme
        </Button>
      </div>

      <div className="space-y-4">
        {/* Color Schemes List */}
        <div className="space-y-3">
          {colorSchemes.map((scheme: ColorScheme) => (
            <Card key={scheme.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{scheme.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {scheme.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openEditModal(scheme)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(scheme.id)}
                      disabled={deleteMutation.isPending}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { label: "Primary", value: scheme.primaryColor },
                    { label: "Secondary", value: scheme.secondaryColor },
                    { label: "Accent", value: scheme.accentColor },
                    { label: "Accent Dark", value: scheme.accentDarkColor },
                    { label: "Background", value: scheme.backgroundColor },
                    { label: "Secondary Light", value: scheme.secondaryLightColor },
                  ].map((color, idx) => (
                    <div key={idx} className="space-y-1">
                      <div
                        className="w-full h-12 rounded border-2 border-zinc-200 dark:border-zinc-700"
                        style={{ backgroundColor: color.value }}
                      />
                      <p className="text-[10px] text-zinc-500 dark:text-zinc-400 text-center">{color.label}</p>
                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500 text-center font-mono">{color.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {colorSchemes.length === 0 && (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No color schemes yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
                {editingId ? "Edit Color Scheme" : "Add Color Scheme"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Slug (URL ID) *
                  </Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="valentine-gift"
                    disabled={editingId !== null}
                    className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Display Name *
                  </Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Valentine's Day"
                    className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Description
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this color scheme..."
                  rows={2}
                  className="px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              {/* Dark/Light Scheme Toggle */}
              <div className="flex items-center gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800">
                <input
                  type="checkbox"
                  id="isDark"
                  checked={formData.isDark}
                  onChange={(e) => setFormData({ ...formData, isDark: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 focus:ring-2 focus:ring-offset-0 cursor-pointer"
                />
                <div className="flex-1">
                  <Label htmlFor="isDark" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    Dark Color Scheme
                  </Label>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Enable for dark-themed events (Black Friday, Cyber Monday). Uses primary color for backgrounds and secondary for accents.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ColorInput
                  label="Primary Color"
                  value={formData.primaryColor}
                  onChange={(v) => setFormData({ ...formData, primaryColor: v })}
                  description="Main CTA buttons, titles, highlights"
                />
                <ColorInput
                  label="Secondary Color"
                  value={formData.secondaryColor}
                  onChange={(v) => setFormData({ ...formData, secondaryColor: v })}
                  description="Announcement bar, Premium Quality section"
                />
                <ColorInput
                  label="Accent Color"
                  value={formData.accentColor}
                  onChange={(v) => setFormData({ ...formData, accentColor: v })}
                  description="Very light backgrounds for contrast sections"
                />
                <ColorInput
                  label="Accent Dark Color"
                  value={formData.accentDarkColor}
                  onChange={(v) => setFormData({ ...formData, accentDarkColor: v })}
                  description="Press bar, alternating sections"
                />
                <ColorInput
                  label="Background Color"
                  value={formData.backgroundColor}
                  onChange={(v) => setFormData({ ...formData, backgroundColor: v })}
                  description="Main page background tint"
                />
                <ColorInput
                  label="Secondary Light Color"
                  value={formData.secondaryLightColor}
                  onChange={(v) => setFormData({ ...formData, secondaryLightColor: v })}
                  description="Badges, pills, subtle highlights"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleUpdate : handleCreate}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Create Scheme"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
