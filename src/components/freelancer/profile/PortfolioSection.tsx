'use client';

import { useState, useEffect, useCallback } from 'react';
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

interface PortfolioItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
  images: string[];
  url?: string;
  skills?: string[];
  date?: string;
}

interface PortfolioFormProps {
  portfolio: PortfolioItem | null;
  onSave: (item: Omit<PortfolioItem, 'id'>) => void;
  onCancel: () => void;
}

export function PortfolioForm({ portfolio, onSave, onCancel }: PortfolioFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [skills, setSkills] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setDescription('');
    setUrl('');
    setImages([]);
    setSkills('');
  };

  // Reset form when portfolio prop changes
  useEffect(() => {
    if (portfolio) {
      setTitle(portfolio.title || '');
      setCategory(portfolio.category || '');
      setDescription(portfolio.description || '');
      setUrl(portfolio.url || '');
      setImages(portfolio.images || []);
      setSkills(portfolio.skills?.join(', ') || '');
    } else {
      resetForm();
    }
  }, [portfolio]);

  // Handle image upload - this function is defined below

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category,
      description,
      images,
      url: url || undefined,
      skills: skills ? skills.split(',').map(skill => skill.trim()).filter(Boolean) : undefined
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // In a real app, you would upload the images to a server here
      // For now, we'll just use the file URLs
      const newImages = Array.from(files).slice(0, 10 - images.length).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
      // Clear the input to allow selecting the same file again
      e.target.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., E-commerce Website Redesign"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category <span className="text-white/50 text-xs">(optional)</span></Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Web Development, App Design"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project in detail..."
          className="min-h-[120px] bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Project Images <span className="text-white/50 text-xs">(optional)</span></Label>
          <span className="text-xs text-white/40">
            {images.length}/10 images
          </span>
        </div>
        
        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-white/10">
              <Image
                src={img}
                alt={`Project image ${index + 1}`}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-black/70 rounded-full hover:bg-red-500 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          ))}
          
          {images.length < 10 && (
            <label 
              htmlFor="image-upload"
              className={`aspect-square border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-400/50 transition-colors ${isUploading ? 'opacity-50' : ''}`}
            >
              <input
                id="image-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                onChange={handleImageUpload}
                multiple
                disabled={isUploading || images.length >= 10}
              />
              <Upload className="h-5 w-5 text-white/60 mb-1.5" />
              <span className="text-xs text-white/60">
                {isUploading ? 'Uploading...' : 'Add Image'}
              </span>
            </label>
          )}
        </div>
        
        {images.length === 0 && (
          <div className="text-xs text-white/40 mt-1">
            Upload up to 10 images to showcase your work (PNG, JPG, or WebP)
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Project URL <span className="text-white/50 text-xs">(optional)</span></Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills Used <span className="text-white/50 text-xs">(optional)</span></Label>
        <Input
          type="text"
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g., React, Node.js, UI/UX Design"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-1 focus-visible:ring-purple-500"
        />
        <p className="text-xs text-white/40">Separate skills with commas</p>
      </div>

      <div className="flex justify-center gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="rounded-full border-white/10 text-white/90 hover:text-white hover:bg-white/5 px-6 py-2"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="rounded-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2"
        >
          {portfolio ? 'Update Work' : 'Add Work'}
        </Button>
      </div>
    </form>
  );
}

interface PortfolioSectionProps {
  initialPortfolio?: PortfolioItem[];
}

export function PortfolioSection({ 
  initialPortfolio = [
    {
      id: '1',
      title: '3x Division Cricket Champion',
      category: 'Cricket Achievement',
      description: 'Won the Division Level Cricket Tournament three consecutive years (2020, 2021, 2022) as a top-order batsman and off-spin bowler. Demonstrated exceptional leadership and performance under pressure.',
      images: ['https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      skills: ['Cricket', 'Leadership', 'Batting', 'Off-Spin Bowling', 'Team Player'],
      date: '2022-05-15'
    } as PortfolioItem,
    {
      id: '2',
      title: 'State Level College Champion',
      category: 'Cricket Achievement',
      description: 'Led college team to victory in the State Level Inter-College Cricket Tournament. Scored 3 consecutive half-centuries in the knockout stages and took crucial wickets in the final match.',
      images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      skills: ['Cricket', 'Captaincy', 'Batting', 'Off-Spin Bowling', 'Match-Winning Performances'],
      date: '2021-11-22'
    } as PortfolioItem,
    {
      id: '3',
      title: 'Sports Quota Scholar',
      category: 'Academic Achievement',
      description: 'Awarded sports scholarship for outstanding cricket performance at the state level. Balanced academic responsibilities with rigorous training schedules while maintaining excellent performance in both areas.',
      images: ['https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      skills: ['Time Management', 'Discipline', 'Academic Excellence', 'Athletic Performance'],
      date: '2020-07-10'
    } as PortfolioItem,
    {
      id: '4',
      title: 'AI-Powered Cricket Analytics',
      category: 'AI/ML Development',
      description: 'Developed a machine learning model to analyze cricket match data and predict outcomes with 85% accuracy. The system processes player statistics, pitch conditions, and historical match data to provide actionable insights for coaches and players.',
      images: ['https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      url: 'https://github.com/sonu/cricket-ai',
      skills: ['Python', 'TensorFlow', 'Data Analysis', 'Cricket Analytics'],
      date: '2023-05-15'
    } as PortfolioItem,
    {
      id: '5',
      title: 'Vibe Code Framework',
      category: 'Open Source AI',
      description: 'An open-source framework for building AI agents with personality and contextual awareness. The framework enables developers to create more human-like AI interactions with built-in emotional intelligence and contextual understanding.',
      images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'],
      url: 'https://github.com/sonu/vibecode',
      skills: ['TypeScript', 'Node.js', 'AI', 'Open Source', 'Natural Language Processing'],
      date: '2023-03-10'
    } as PortfolioItem
  ] 
}: PortfolioSectionProps) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  const handleAddWork = () => {
    // Clear the editing item to indicate we're adding a new item
    setEditingItem(null);
    setIsDialogOpen(true);
  };

  const handleEditWork = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleSaveWork = (itemData: Omit<PortfolioItem, 'id'>) => {
    if (editingItem) {
      // Update existing item
      setPortfolio(portfolio.map(item => 
        item.id === editingItem.id ? { ...itemData, id: editingItem.id } : item
      ));
    } else {
      // Add new item
      setPortfolio([...portfolio, { ...itemData, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
  };

  const handleDeleteWork = (id: string) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
      setPortfolio(portfolio.filter(item => item.id !== id));
    }
  };

  const handleViewWork = (item: PortfolioItem) => {
    setViewingItem(item);
    setCurrentImageIndex(0);
  };

  const openLightbox = (index: number) => {
    setCurrentLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNextLightboxImage = useCallback(() => {
    if (!viewingItem?.images) return;
    setCurrentLightboxIndex(prev => (prev + 1) % viewingItem.images.length);
  }, [viewingItem?.images]);

  const goToPrevLightboxImage = useCallback(() => {
    if (!viewingItem?.images) return;
    setCurrentLightboxIndex(prev => 
      prev === 0 ? viewingItem.images.length - 1 : prev - 1
    );
  }, [viewingItem?.images]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          goToNextLightboxImage();
          break;
        case 'ArrowLeft':
          goToPrevLightboxImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToNextLightboxImage, goToPrevLightboxImage]);

  const goToNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!viewingItem?.images?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % viewingItem.images.length);  };

  const goToPrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!viewingItem?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? (viewingItem.images?.length || 1) - 1 : prev - 1
    );
  };
  
  // Handle keyboard navigation in lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevImage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentImageIndex]);

  // Lightbox component
  const Lightbox = () => {
    if (!lightboxOpen || !viewingItem) return null;

    return (
      <div 
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={closeLightbox}
      >
        <button 
          className="absolute top-4 right-4 text-white/80 hover:text-white z-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            closeLightbox();
          }}
          aria-label="Close lightbox"
        >
          <XIcon className="h-8 w-8" />
        </button>
        
        <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center" onClick={e => e.stopPropagation()}>
          {/* Previous Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); goToPrevLightboxImage(); }}
            className="absolute left-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          {/* Main Image */}
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={viewingItem.images[currentLightboxIndex]}
              alt={`${viewingItem.title} - Image ${currentLightboxIndex + 1}`}
              width={1920}
              height={1080}
              className="max-w-full max-h-[80vh] object-contain"
              priority
            />
          </div>
          
          {/* Next Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); goToNextLightboxImage(); }}
            className="absolute right-4 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-20 transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full z-20">
            {currentLightboxIndex + 1} / {viewingItem.images.length}
          </div>
          
          {/* Thumbnail Strip */}
          {viewingItem.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
              <div className="flex gap-2 overflow-x-auto justify-center">
                {viewingItem.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentLightboxIndex(idx);
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                      currentLightboxIndex === idx ? 'border-primary ring-2 ring-primary/50' : 'border-transparent'
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={img}
                      alt=""
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Lightbox />
      {/* Add/Edit Work Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] border-white/10 max-w-4xl w-[95vw] h-[90vh] p-0 rounded-2xl flex flex-col [&>button]:hidden">
          <div className="p-6 pb-0 relative">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white mb-2">
                {editingItem ? 'Edit Work' : 'Add New Work'}
              </DialogTitle>
            </DialogHeader>
            <DialogPrimitive.Close className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <XIcon className="h-5 w-5 text-white" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <PortfolioForm 
              portfolio={editingItem}
              onSave={handleSaveWork}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Modern View Portfolio Item Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={(open) => !open && setViewingItem(null)}>
        <DialogContent className="bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] border-white/10 max-w-4xl w-[95vw] max-h-[95vh] overflow-hidden p-0 rounded-2xl [&>button]:hidden">
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
                  <div 
                    className="relative w-full h-full cursor-zoom-in"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <Image
                      src={viewingItem.images[currentImageIndex]}
                      alt={`${viewingItem.title} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover transition-all duration-300 hover:scale-105"
                      priority
                      sizes="(max-width: 768px) 100vw, 80vw"
                    />
                    
                    {/* Navigation Arrows */}
                    {viewingItem.images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); goToPrevImage(e); }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 transition-all"
                          aria-label="Previous image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); goToNextImage(e); }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 transition-all"
                          aria-label="Next image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded z-20">
                      {currentImageIndex + 1} / {viewingItem.images.length}
                    </div>
                    
                    {/* Category */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/90">
                        {viewingItem.category}
                      </span>
                    </div>
                    
                    {/* Thumbnail Grid */}
                    {viewingItem.images.length > 1 && (
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent z-10">
                        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                          {viewingItem.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(idx);
                              }}
                              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                                currentImageIndex === idx ? 'border-primary ring-2 ring-primary/50' : 'border-transparent'
                              }`}
                              aria-label={`View image ${idx + 1}`}
                            >
                              <Image
                                src={img}
                                alt={`${viewingItem.title} - Image ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
                  {viewingItem.url && (
                    <a 
                      href={viewingItem.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Project
                    </a>
                  )}
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
            variant="outline" 
            size="sm" 
            className="mt-4 bg-white/5 border-white/10 hover:bg-white/10"
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
                  <div 
                    className="relative w-full h-full cursor-zoom-in group"
                    onClick={() => openLightbox(0)}
                  >
                    <Image
                      src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder-project.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105 rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder-project.jpg';
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
                      <p className="text-xs text-white/80 mt-0.5">{item.category}</p>
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
