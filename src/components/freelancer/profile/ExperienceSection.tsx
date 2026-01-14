'use client';

import { useState } from 'react';

import { Plus, Trophy, Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useExperience } from '@/contexts/ExperienceContext';
import { EmptyState } from '@/components/freelancer/profile/EmptyState';
import { Skeleton } from "@/components/ui/skeleton";

export interface Experience {
  id: string;
  title: string;
  company: string;
}

export function ExperienceSection() {
  const { experiences, addExperience, updateExperience, removeExperience, isLoading } = useExperience();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  const [newExperience, setNewExperience] = useState<Omit<Experience, 'id'>>({
    title: '',
    company: ''
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-10 rounded-xl mb-6" />
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="w-px h-full bg-white/10 my-2"></div>
              </div>
              <div className="flex-1 space-y-3 pb-6">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-60" />
                <Skeleton className="h-16 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();

    const experienceToSave = {
      ...newExperience
    };

    if (!experienceToSave.title || !experienceToSave.company) {
      return;
    }

    if (editingExperience) {
      updateExperience(editingExperience.id, {
        title: experienceToSave.title,
        company: experienceToSave.company
      });
    } else {
      const newExpId = Date.now().toString();
      addExperience({
        id: newExpId,
        title: experienceToSave.title,
        company: experienceToSave.company
      });
    }

    setNewExperience({
      title: '',
      company: ''
    });
    setEditingExperience(null);
    setIsDialogOpen(false);
  };

  const handleEditClick = (exp: Experience) => {
    setEditingExperience(exp);
    setNewExperience({
      title: exp.title,
      company: exp.company
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (exp: Experience) => {
    setExperienceToDelete(exp);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (experienceToDelete) {
      removeExperience(experienceToDelete.id);
      setIsDeleteDialogOpen(false);
      setExperienceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setExperienceToDelete(null);
  };

  return (
    <div className="space-y-3">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-[500px] w-[calc(100%-2rem)] p-0 bg-[#1E1E1E] border-0 rounded-xl shadow-xl overflow-hidden">
          <div className="border-b border-white/10 bg-[#1E1E1E] px-5 py-3">
            <DialogHeader className="space-y-0.5">
              <DialogTitle className="text-lg font-semibold text-white">
                {editingExperience ? 'Edit Achievement' : 'Add Achievement'}
              </DialogTitle>
              <p className="text-xs text-white/60">
                Add your key sports stats and team history
              </p>
            </DialogHeader>
          </div>

          <div className="px-5 py-4">
            <form id="experience-form" onSubmit={handleAddExperience} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-white/80 mb-1 block">
                  Achievements & Key Stats <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={newExperience.title}
                  onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
                  placeholder="e.g. Man of the Match, Scored 50 Runs"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-sm font-medium text-white/80 mb-1.5 block">
                  Team / Club / Tournament <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
                  placeholder="e.g. District Finals 2024, Mumbai Indians"
                  required
                />
              </div>

            </form>
          </div>

          <div className="border-t border-white/10 p-4 bg-[#1E1E1E]">
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="h-10 px-8 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="experience-form"
                disabled={!newExperience.title?.trim() || !newExperience.company?.trim()}
                className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all"
              >
                <span className="whitespace-nowrap">{editingExperience ? 'Update' : 'Save'}</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-[400px] w-[calc(100%-2rem)] p-0 bg-[#1E1E1E] border-0 rounded-xl shadow-xl overflow-hidden">
          <div className="p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mb-3">
              <Trash2 className="h-5 w-5 text-red-500" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white mb-1">
              Delete Milestone?
            </DialogTitle>
            <p className="text-sm text-white/70 mb-6 leading-snug">
              This will permanently delete this career entry and cannot be undone.
            </p>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-red-500/90 hover:bg-red-600 text-white transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Yes, Delete It
              </button>
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-white/10 bg-transparent hover:bg-white/5 text-white/90 hover:text-white transition-all duration-200"
              >
                No, Keep It
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {experiences.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No achievements added yet"
            description="Add your sports stats, awards, and team history"
            action={
              <Button
                variant="default"
                size="sm"
                className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center rounded-xl"
                onClick={() => {
                  setNewExperience({
                    title: '',
                    company: ''
                  });
                  setEditingExperience(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                <span>Add Achievement</span>
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            <div className="w-full mb-6">
              <Button
                variant="default"
                size="sm"
                className="w-full h-10 gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center rounded-xl border border-purple-500/20"
                onClick={() => {
                  setNewExperience({
                    title: '',
                    company: ''
                  });
                  setEditingExperience(null);
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                <span>Add Achievement</span>
              </Button>
            </div>
            {experiences.map((exp) => (
              <div key={exp.id} className="flex gap-4 group relative">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>

                </div>
                <div className="absolute right-0 top-0 flex gap-2">
                  <button
                    onClick={() => handleEditClick(exp)}
                    className="p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full"
                    aria-label="Edit experience"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(exp)}
                    className="p-1.5 text-red-400/80 hover:text-red-400 hover:bg-white/10 rounded-full"
                    aria-label="Delete experience"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex-1 pb-6 pr-16">
                  <h3 className="font-medium text-white text-lg">{exp.title}</h3>
                  <p className="text-white/60 text-sm mt-0.5">{exp.company}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
