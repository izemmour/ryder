/**
 * CTA Buttons Manager Component
 * Admin interface for managing call-to-action buttons with CRUD operations and drag-and-drop sorting
 * Redesigned to match Marketing Angles Manager pattern with modal popup for create/edit
 */

import { useState } from "react";
import { Plus, Edit, Trash2, Star, Save, X, Check, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CtaButton {
  id: number;
  text: string;
  secondaryText: string | null;
  alternativeText: string | null;
  variant: string | null;
  isDefault: number | null;
  description: string | null;
  sortOrder: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Sortable Button Card Component
function SortableButtonCard({ button, editingButton, onEdit, onSave, onCancel, onDelete, onSetDefault, isUpdating, isDeleting, isSettingDefault }: {
  button: CtaButton;
  editingButton: CtaButton | null;
  onEdit: (button: CtaButton) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isSettingDefault: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: button.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = editingButton?.id === button.id;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${isDragging ? 'shadow-lg' : ''}`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Primary Text *
            </label>
            <input
              type="text"
              value={editingButton.text}
              onChange={(e) => onEdit({ ...editingButton, text: e.target.value })}
              placeholder="e.g., Order Now"
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Secondary Text
            </label>
            <input
              type="text"
              value={editingButton.secondaryText || ""}
              onChange={(e) => onEdit({ ...editingButton, secondaryText: e.target.value })}
              placeholder="e.g., Try Risk-Free"
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Alternative Text
            </label>
            <input
              type="text"
              value={editingButton.alternativeText || ""}
              onChange={(e) => onEdit({ ...editingButton, alternativeText: e.target.value })}
              placeholder="e.g., Shop Now"
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Button Style
            </label>
            <select
              value={editingButton.variant || "primary"}
              onChange={(e) => onEdit({ ...editingButton, variant: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="primary">Primary (Red)</option>
              <option value="secondary">Secondary (White)</option>
              <option value="outline">Outline</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              value={editingButton.description || ""}
              onChange={(e) => onEdit({ ...editingButton, description: e.target.value })}
              rows={2}
              placeholder="Internal description for this button"
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onSave}
              disabled={isUpdating}
              size="sm"
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button
              onClick={onCancel}
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
        <div className="flex items-start gap-3">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing pt-1"
          >
            <GripVertical className="w-5 h-5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {button.text}
              </h4>
              {button.isDefault === 1 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  default
                </span>
              )}
            </div>

            {/* Tags for secondary and alternative text */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {button.secondaryText && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  {button.secondaryText}
                </span>
              )}
              {button.alternativeText && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  {button.alternativeText}
                </span>
              )}
            </div>

            {button.description && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {button.description}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {button.isDefault !== 1 && (
              <Button
                onClick={() => onSetDefault(button.id)}
                disabled={isSettingDefault}
                variant="outline"
                size="sm"
                className="gap-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                title="Set as default"
              >
                <Star className="w-3.5 h-3.5" />
              </Button>
            )}
            <Button
              onClick={() => onEdit(button)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Edit className="w-3.5 h-3.5" />
            </Button>
            <Button
              onClick={() => onDelete(button.id)}
              disabled={isDeleting}
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
  );
}

export default function CtaButtonsManager() {
  const [editingButton, setEditingButton] = useState<CtaButton | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    secondaryText: "",
    alternativeText: "",
    variant: "primary",
    description: "",
  });

  // Fetch all CTA buttons
  const { data: buttons, refetch } = trpc.ctaButtons.getAll.useQuery();
  const sortedButtons = buttons ? [...buttons].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)) : [];

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Create mutation
  const createMutation = trpc.ctaButtons.create.useMutation({
    onSuccess: () => {
      toast.success("CTA button created successfully");
      setShowCreateModal(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create button: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = trpc.ctaButtons.update.useMutation({
    onSuccess: () => {
      toast.success("CTA button updated successfully");
      setEditingButton(null);
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update button: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = trpc.ctaButtons.delete.useMutation({
    onSuccess: () => {
      toast.success("CTA button deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete button: ${error.message}`);
    },
  });

  // Set default mutation
  const setDefaultMutation = trpc.ctaButtons.setDefault.useMutation({
    onSuccess: () => {
      toast.success("Default CTA button updated");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to set default: ${error.message}`);
    },
  });

  // Reorder mutation
  const reorderMutation = trpc.ctaButtons.reorder.useMutation({
    onSuccess: () => {
      toast.success("CTA buttons reordered successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to reorder buttons: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      text: "",
      secondaryText: "",
      alternativeText: "",
      variant: "primary",
      description: "",
    });
  };

  const handleCreate = () => {
    if (!formData.text.trim()) {
      toast.error("Primary text is required");
      return;
    }

    createMutation.mutate({
      text: formData.text,
      secondaryText: formData.secondaryText || undefined,
      alternativeText: formData.alternativeText || undefined,
      variant: formData.variant,
      description: formData.description || undefined,
    });
  };

  const handleUpdate = () => {
    if (!editingButton || !editingButton.text.trim()) {
      toast.error("Primary text is required");
      return;
    }

    updateMutation.mutate({
      id: editingButton.id,
      text: editingButton.text,
      secondaryText: editingButton.secondaryText || undefined,
      alternativeText: editingButton.alternativeText || undefined,
      variant: editingButton.variant || undefined,
      description: editingButton.description || undefined,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this button?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleSetDefault = (id: number) => {
    setDefaultMutation.mutate({ id });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedButtons.findIndex((b) => b.id === active.id);
      const newIndex = sortedButtons.findIndex((b) => b.id === over.id);

      const reorderedButtons = arrayMove(sortedButtons, oldIndex, newIndex);

      // Update sort order for all buttons
      const updates = reorderedButtons.map((button, index) => ({
        id: button.id,
        sortOrder: index,
      }));

      reorderMutation.mutate({ buttons: updates });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">CTA Buttons</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage call-to-action buttons displayed across landing pages
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Button
        </Button>
      </div>

      {/* Buttons List with Drag and Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedButtons.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sortedButtons.map((button) => (
              <SortableButtonCard
                key={button.id}
                button={button}
                editingButton={editingButton}
                onEdit={setEditingButton}
                onSave={handleUpdate}
                onCancel={() => setEditingButton(null)}
                onDelete={handleDelete}
                onSetDefault={handleSetDefault}
                isUpdating={updateMutation.isPending}
                isDeleting={deleteMutation.isPending}
                isSettingDefault={setDefaultMutation.isPending}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sortedButtons.length === 0 && (
        <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
          <p>No CTA buttons yet. Create one to get started.</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Add CTA Button</h3>
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
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Primary Text *
                </label>
                <input
                  type="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="e.g., Order Now"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Secondary Text
                </label>
                <input
                  type="text"
                  value={formData.secondaryText}
                  onChange={(e) => setFormData({ ...formData, secondaryText: e.target.value })}
                  placeholder="e.g., Try Risk-Free"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Alternative Text
                </label>
                <input
                  type="text"
                  value={formData.alternativeText}
                  onChange={(e) => setFormData({ ...formData, alternativeText: e.target.value })}
                  placeholder="e.g., Shop Now"
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Button Style
                </label>
                <select
                  value={formData.variant}
                  onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm transition-colors"
                >
                  <option value="primary">Primary (Red)</option>
                  <option value="secondary">Secondary (White)</option>
                  <option value="outline">Outline</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Internal description for this button"
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
                  disabled={createMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors text-sm font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending ? "Creating..." : "Create Button"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
