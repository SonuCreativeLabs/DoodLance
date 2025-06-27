'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Upload, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  image: string;
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
  const [title, setTitle] = useState(portfolio?.title || '');
  const [category, setCategory] = useState(portfolio?.category || '');
  const [description, setDescription] = useState(portfolio?.description || '');
  const [url, setUrl] = useState(portfolio?.url || '');
  const [image, setImage] = useState(portfolio?.image || '');
  const [skills, setSkills] = useState(portfolio?.skills?.join(', ') || '');
  const [date, setDate] = useState(portfolio?.date || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category,
      description,
      image,
      url,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      date: date || new Date().toISOString().split('T')[0]
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // In a real app, you would upload the file to a server here
      // For now, we'll just create a local URL for the image
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., E-commerce Website"
          required
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Web Development, Graphic Design"
          required
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the project, your role, and the results..."
          rows={4}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label>Project Image *</Label>
        {image ? (
          <div className="relative group">
            <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
              <Image
                src={image}
                alt={title || 'Project thumbnail'}
                width={800}
                height={450}
                className="object-cover w-full h-full"
              />
            </div>
            <button
              type="button"
              onClick={() => setImage('')}
              className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full hover:bg-black/90 transition-colors"
            >
              <XCircle className="h-5 w-5 text-white" />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-white/10 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <ImageIcon className="h-8 w-8 text-white/40" />
              <div className="text-sm text-white/60">
                <label
                  htmlFor="image-upload"
                  className="relative cursor-pointer text-purple-400 hover:text-purple-300"
                >
                  <span>Upload an image</span>
                  <input
                    id="image-upload"
                    name="image-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
                <p className="text-xs text-white/40 mt-1">or drag and drop</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Project URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills Used</Label>
        <Input
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g., React, Node.js, MongoDB"
          className="bg-white/5 border-white/10 text-white"
        />
        <p className="text-xs text-white/40">Separate skills with commas</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Completion Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-white/5 border-white/10 text-white"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/10"
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
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
      image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      skills: ['Cricket', 'Leadership', 'Batting', 'Off-Spin Bowling', 'Team Player'],
      date: '2022-05-15'
    },
    {
      id: '2',
      title: 'State Level College Champion',
      category: 'Cricket Achievement',
      description: 'Led college team to victory in the State Level Inter-College Cricket Tournament. Scored 3 consecutive half-centuries in the knockout stages and took crucial wickets in the final match.',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      skills: ['Cricket', 'Captaincy', 'Batting', 'Off-Spin Bowling', 'Match-Winning Performances'],
      date: '2021-11-22'
    },
    {
      id: '3',
      title: 'Sports Quota Scholar',
      category: 'Academic Achievement',
      description: 'Awarded sports scholarship for outstanding cricket performance at the state level. Balanced academic responsibilities with rigorous training schedules while maintaining excellent performance in both areas.',
      image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1784?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      skills: ['Time Management', 'Discipline', 'Academic Excellence', 'Athletic Performance'],
      date: '2020-07-10'
    },
    {
      id: '4',
      title: 'AI-Powered Cricket Analytics',
      category: 'AI/ML Development',
      description: 'Developed a machine learning model to analyze cricket match data and predict outcomes with 85% accuracy. The system processes player statistics, pitch conditions, and historical match data to provide actionable insights for coaches and players.',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      url: 'https://github.com/sonu/cricket-ai',
      skills: ['Python', 'TensorFlow', 'Data Analysis', 'Cricket Analytics'],
      date: '2023-05-15'
    },
    {
      id: '5',
      title: 'Vibe Code Framework',
      category: 'Open Source AI',
      description: 'An open-source framework for building AI agents with personality and contextual awareness. The framework enables developers to create more human-like AI interactions with built-in emotional intelligence and contextual understanding.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      url: 'https://github.com/sonu/vibecode',
      skills: ['TypeScript', 'Node.js', 'AI', 'Open Source', 'Natural Language Processing'],
      date: '2023-03-10'
    }
  ] 
}: PortfolioSectionProps) {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(initialPortfolio);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewingItem, setViewingItem] = useState<PortfolioItem | null>(null);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  const handleAddWork = () => {
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
  };

  return (
    <div className="space-y-6">

      {/* View Portfolio Item Dialog */}
      <Dialog open={!!viewingItem} onOpenChange={(open) => !open && setViewingItem(null)}>
        <DialogContent className="bg-[#1E1E1E] border-white/10 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Portfolio Item Details</DialogTitle>
            </VisuallyHidden>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
                <Image
                  src={viewingItem.image}
                  alt={viewingItem.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{viewingItem.title}</h2>
                    <p className="text-purple-400">{viewingItem.category}</p>
                    {viewingItem.date && (
                      <p className="text-sm text-white/60 mt-1">
                        {new Date(viewingItem.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/5 border-white/10 hover:bg-white/10"
                      onClick={() => {
                        setEditingItem(viewingItem);
                        setViewingItem(null);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {viewingItem.url && (
                      <a 
                        href={viewingItem.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit Site
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                  <p className="text-white/80">{viewingItem.description}</p>
                </div>

                {viewingItem.skills && viewingItem.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Skills & Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingItem.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
              className="group relative aspect-video rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleViewWork(item)}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50">
                  <Image
                    src={item.image || '/placeholder-project.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover transition-all duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/placeholder-project.jpg';
                    }}
                    unoptimized={process.env.NODE_ENV !== 'production'}
                    priority={item.id === '1' || item.id === '2' || item.id === '3'}
                  />
                </div>
                <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-medium text-white">{item.title}</h3>
                      <p className="text-xs text-white/70">{item.category}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditWork(item);
                        }}
                        className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWork(item.id);
                        }}
                        className="p-1.5 bg-white/10 hover:bg-red-500/20 rounded-full transition-colors group/delete"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-white group-hover/delete:text-red-400 transition-colors" />
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
