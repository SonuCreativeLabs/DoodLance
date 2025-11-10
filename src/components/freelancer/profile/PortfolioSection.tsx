'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Upload, XCircle, ExternalLink, ChevronLeft, ChevronRight, Maximize2, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { usePortfolio, PortfolioItem } from '@/contexts/PortfolioContext';
import { CategorySelect, CategoryBadge } from '@/components/common/CategoryBadge';

interface PortfolioFormProps {
  portfolio: PortfolioItem | null;
  onSave: (item: Omit<PortfolioItem, 'id'>) => void;
  onCancel: () => void;
  onValidationChange?: (isValid: boolean) => void;
  hideActions?: boolean;
}

interface PortfolioSectionProps {
  initialPortfolio?: PortfolioItem[];
}

export function PortfolioForm({ portfolio, onSave, onCancel, onValidationChange, hideActions = false }: PortfolioFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [skills, setSkills] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setUrl('');
    setImage('');
    setSkills('');
  };

  // Reset form when portfolio prop changes
  useEffect(() => {
    if (portfolio) {
      setTitle(portfolio.title || '');
      setCategory(portfolio.category || '');
      setDescription(portfolio.description || '');
      setUrl(portfolio.url || '');
      setImage(portfolio.image || '');
      setSkills(portfolio.skills?.join(', ') || '');
    } else {
      resetForm();
    }
  }, [portfolio]);

  // Check if form is valid (required fields filled)
  const isFormValid = title.trim() !== '' && description.trim() !== '' && skills.trim() !== '';

  // Notify parent component about validation state changes
  useEffect(() => {
    onValidationChange?.(isFormValid);
  }, [isFormValid, onValidationChange]);

  // Handle image upload - this function is defined below

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category: category || 'General', // Provide default if empty
      description,
      image,
      url: url || undefined,
      skills: skills ? skills.split(',').map(skill => skill.trim()).filter(Boolean) : undefined
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // In a real app, you would upload the image to a server here
      // For now, we'll just use the file URL
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
      // Clear the input to allow selecting the same file again
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-sm font-medium text-white/80 mb-1.5 block">
          Project Title <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="State Championship Highlights Video"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-medium text-white/80 mb-1.5 block">
          Category <span className="text-white/50 text-xs">(optional)</span>
        </Label>
        <CategorySelect
          value={category}
          onChange={setCategory}
          type="portfolio"
          placeholder="Select a category (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-white/80 mb-1.5 block">
          Project Description <span className="text-red-400 text-xs">*</span>
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the cricket project, your role, and key achievements (batting analysis, training drills, match strategy)."
          className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder-white/40"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-white/80">Project Image <span className="text-white/50 text-xs">(optional)</span></Label>
        </div>
        <div className="mt-1 grid grid-cols-1 gap-2">
          {image && (
            <div className="relative group aspect-video">
              <div className="w-full h-full rounded-lg overflow-hidden border border-white/10 bg-white/5">
                <Image
                  src={image}
                  alt="Preview"
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage('');
                }}
                className="absolute -top-1 -right-1 p-0.5 bg-red-500/90 rounded-full text-white hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          )}
        </div>
        
        {!image && (
          <div className="mt-4">
            <div className="space-y-2 w-full">
              <label
                className={`flex items-center justify-center w-full py-2.5 px-4 rounded-md border border-dashed border-white/20 hover:border-white/40 text-white/80 hover:text-white text-sm transition-colors cursor-pointer ${isUploading ? 'opacity-70' : ''}`}
                htmlFor="image-upload"
              >
                <Upload className="h-3.5 w-3.5 mr-2 text-inherit" />
                {isUploading ? 'Uploading...' : 'Upload Image'}
                <VisuallyHidden>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </VisuallyHidden>
              </label>
              <p className="text-xs text-white/50 text-center font-light">
                Supported formats: JPG, PNG, GIF • Maximum file size: 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url" className="text-sm font-medium text-white/80 mb-1.5 block">
          Project URL <span className="text-white/50 text-xs">(optional)</span>
        </Label>
        <Input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=... or any link to match highlights"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills" className="text-sm font-medium text-white/80 mb-1.5 block">
          Skills Used <span className="text-red-400 text-xs">*</span>
        </Label>
        <Input
          type="text"
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Batting, Off-Spin, Match Strategy, Video Analysis"
          className="bg-white/5 border-white/10 text-white placeholder-white/40"
          required
        />
        <p className="text-xs text-white/40">Separate skills with commas</p>
      </div>

      {!hideActions && (
        <div className="border-t border-white/10 pt-6 mt-6">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-10 px-6 rounded-xl border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="h-10 px-6 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 shadow-md transition-all"
              disabled={!isFormValid}
            >
              {portfolio ? 'Update Work' : 'Add Work'}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}

export function PortfolioSection({ 
  initialPortfolio = []
}: PortfolioSectionProps) {
  const { portfolio, addPortfolioItem, removePortfolioItem, updatePortfolioItem } = usePortfolio();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<PortfolioItem | null>(null);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  const handleAddWork = () => {
    // Clear the editing item to indicate we're adding a new item
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditWork = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteWork = (id: string) => {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
      removePortfolioItem(id);
    }
  };

  const handleSaveWork = (itemData: Omit<PortfolioItem, 'id'>) => {
    if (editingItem) {
      // Update existing item
      updatePortfolioItem(editingItem.id, itemData);
    } else {
      // Add new item with generated ID
      const newItem: PortfolioItem = {
        ...itemData,
        id: Date.now().toString() // Generate unique ID
      };
      addPortfolioItem(newItem);
    }
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleViewWork = (item: PortfolioItem) => {
    setViewingItem(item);
  };

  const handleValidationChange = (isValid: boolean) => {
    setIsFormValid(isValid);
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Work Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-[800px] w-[calc(100%-2rem)] max-h-[90vh] flex flex-col p-0 bg-[#1E1E1E] border border-white/10 rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-white/10 bg-[#1E1E1E] px-5 py-3">
            <DialogHeader className="space-y-0.5">
              <DialogTitle className="text-lg font-semibold text-white">
                {editingItem ? 'Edit Work' : 'Add New Work'}
              </DialogTitle>
              <p className="text-xs text-white/60">
                {editingItem ? 'Update your portfolio work details' : 'Add a new project to your portfolio'}
              </p>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            <PortfolioForm 
              portfolio={editingItem}
              onSave={handleSaveWork}
              onCancel={() => setIsDialogOpen(false)}
              onValidationChange={handleValidationChange}
              hideActions={true}
            />
          </div>
          
          {/* Fixed Footer with Actions */}
          <div className="border-t border-white/10 p-4 bg-[#1E1E1E] flex-shrink-0">
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
                type="button"
                onClick={() => {
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
                className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all"
                disabled={!isFormValid}
              >
                {editingItem ? 'Update Work' : 'Add Work'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Portfolio Item Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={(open) => !open && setViewingItem(null)}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-[900px] w-[calc(100%-2rem)] max-h-[90vh] flex flex-col p-0 bg-[#1E1E1E] border-0 rounded-xl shadow-xl overflow-hidden">
          {viewingItem && (
            <div className="flex flex-col h-full">
              <div className="relative">
                <DialogPrimitive.Close className="absolute right-4 top-4 z-50 rounded-full p-2 bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors">
                  <XIcon className="h-5 w-5 text-white" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
                <DialogHeader className="sr-only">
                  <DialogTitle>Portfolio Item: {viewingItem.title || 'Project Details'}</DialogTitle>
                </DialogHeader>
                <div className="relative w-full aspect-video bg-black/50 overflow-hidden">
                  {/* Main Image */}
                  <div className="relative w-full h-full">
                    <Image
                      src={viewingItem.image || '/images/default-avatar.svg'}
                      alt={viewingItem.title}
                      fill
                      className="object-cover transition-all duration-300 hover:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                    
                    {/* Category */}
                    <div className="absolute top-4 left-4 z-10">
                      <CategoryBadge
                        category={viewingItem.category}
                        type="portfolio"
                        size="sm"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                    <h2 className="text-2xl font-bold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.8)]">{viewingItem.title}</h2>
                  </div>
                </div>
              </div>
              
              {/* Content with smooth scrolling */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Description */}
                {viewingItem.description && (
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                      <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3"></span>
                      Overview
                    </h3>
                    <p className="text-white/80 leading-relaxed">{viewingItem.description}</p>
                  </div>
                )}

                {/* Skills */}
                {viewingItem.skills && viewingItem.skills.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white flex items-center">
                      <span className="w-1.5 h-6 bg-purple-500 rounded-full mr-3"></span>
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {viewingItem.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/80 hover:bg-white/10 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    className="bg-transparent border-white/20 hover:bg-white/5 hover:border-white/30"
                    onClick={() => {
                      setViewingItem(null);
                      handleEditWork(viewingItem);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Project
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Portfolio Items Grid */}
      {portfolio.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-white/30 mb-2" />
          <h3 className="text-white/80 font-medium">No portfolio items yet</h3>
          <p className="text-sm text-white/50 mt-1 max-w-md mx-auto">
            Showcase your best work to attract potential clients. Add your first project to get started.
          </p>
          <Button 
            variant="default" 
            size="lg" 
            className="mt-4 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors rounded-xl h-11 px-6"
            onClick={handleAddWork}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolio.map((item) => (
            <div 
              key={item.id} 
              className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-300"
              onClick={() => handleViewWork(item)}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-xl">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image || '/images/default-avatar.svg'}
                      alt={item.title}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105 rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/images/default-avatar.svg';
                      }}
                      unoptimized={process.env.NODE_ENV !== 'production'}
                      priority={item.id === '1' || item.id === '2' || item.id === '3'}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/40 to-transparent rounded-xl">
                  <div className="flex justify-between items-end">
                    <div className="pr-2">
                      <h3 className="font-medium text-white line-clamp-1">{item.title}</h3>
                      <CategoryBadge category={item.category} type="portfolio" size="sm" className="mt-1" />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWork(item);
                        }}
                        className="p-1.5 text-white/70 hover:text-white transition-all duration-200 hover:scale-105"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWork(item.id);
                        }}
                        className="p-1.5 text-red-400/70 hover:text-red-400 transition-all duration-200 hover:scale-105"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
