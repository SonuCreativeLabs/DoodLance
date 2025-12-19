"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Trash2, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useServices, type ServicePackage as CtxService } from '@/contexts/ServicesContext';
import { CategorySelect } from "@/components/common/CategoryBadge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Local form interface (different from context ServicePackage)
interface ServicePackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  deliveryTime: string;
  revisions: string;
  type?: 'online' | 'in-person' | 'hybrid';
  category?: string;
  skill?: string;
};

// Normalize various category labels to the fixed dropdown options
function normalizeCategory(input?: string): string | undefined {
  const c = (input || '').toLowerCase().trim();
  if (!c) return undefined;
  if (c.includes('match player')) return 'Match Player';
  if (c.includes('net bowler')) return 'Net Bowler';
  if (c.includes('net batsman')) return 'Net Batsman';
  if (c.includes('sidearm')) return 'Sidearm';
  if (c.includes('coach') || c.includes('batting')) return 'Coach';
  if (c.includes('sports conditioning') || c.includes('fitness') || c.includes('trainer')) return 'Trainer';
  if (c.includes('analyst')) return 'Analyst';
  if (c.includes('physio')) return 'Physio';
  if (c.includes('scorer')) return 'Scorer';
  if (c.includes('umpire')) return 'Umpire';
  if (c.includes('video') || c.includes('photo')) return 'Cricket Photo / Videography';
  if (c.includes('content')) return 'Cricket Content Creator';
  if (c.includes('commentator')) return 'Commentator';
  return input;
}

// Mapping helpers between UI package and ServicesContext service
const mapToCtx = (pkg: ServicePackage): CtxService => ({
  id: pkg.id,
  title: pkg.name,
  description: pkg.description,
  price: pkg.price.startsWith('₹') ? pkg.price : `₹${pkg.price}`,
  deliveryTime: pkg.deliveryTime,
  features: Array.isArray(pkg.features) ? pkg.features : [],
  type: pkg.type,
  category: pkg.category,
  skill: pkg.skill,
});

const mapToUI = (svc: CtxService): ServicePackage => ({
  id: svc.id,
  name: svc.title,
  price: (svc.price || '').replace(/^₹\s?/, '').replace(/,/g, ''),
  description: svc.description,
  features: Array.isArray(svc.features) ? svc.features : [],
  deliveryTime: svc.deliveryTime,
  revisions: '1 revision',
  popular: false,
  type: svc.type,
  category: normalizeCategory((svc as any).category),
  skill: (svc as any).skill,
});

// Package Form Component
function PackageForm({
  initialData,
  onSave,
  onCancel,
  hideActions,
  onValidationChange,
}: {
  initialData?: Partial<ServicePackage>;
  onSave: (pkg: Partial<ServicePackage>) => void;
  onCancel: () => void;
  hideActions?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}) {
  const [formData, setFormData] = useState<Partial<ServicePackage>>(() => {
    const defaultData = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      price: '',
      description: '',
      features: [''],
      deliveryTime: '',
      revisions: '1 revision',
      popular: false,
      type: 'online' as const,
      category: '',
      skill: '', // Add skill field
    };
    
    return {
      ...defaultData,
      ...initialData,
      features: Array.isArray(initialData?.features) && initialData.features.length > 0 
        ? initialData.features 
        : defaultData.features
    };
  });

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        features: initialData.features?.length ? [...initialData.features] : [''],
      }));
    }
  }, [initialData]);

  // Form validation
  useEffect(() => {
    const isValid = Boolean(
      formData.name?.trim() &&
      formData.category?.trim() &&
      formData.price?.trim() &&
      formData.deliveryTime?.trim() &&
      formData.description?.trim() &&
      (!String(formData.category || '').toLowerCase().includes('analytic') || formData.type) &&
      (!String(formData.category || '').toLowerCase().includes('match player') || formData.skill?.trim())
    );
    onValidationChange?.(isValid);
  }, [formData, onValidationChange]);
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Enforce numeric price only
    if (name === 'price') {
      const numeric = value.replace(/[^0-9]/g, '');
      setFormData(prev => ({ ...prev, price: numeric }));
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [''])];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData((prev: Partial<ServicePackage>) => ({
      ...prev,
      features: [...(Array.isArray(prev.features) ? prev.features : ['']), '']
    }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [''])];
    newFeatures.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      features: newFeatures.length ? newFeatures : ['']
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      name: formData.name?.trim() || 'New Package',
      description: formData.description?.trim() || '',
      price: formData.price?.trim() || '0',
      deliveryTime: formData.deliveryTime || '',
      revisions: formData.revisions || '1 revision',
      features: Array.isArray(formData.features) 
        ? formData.features.filter((f): f is string => Boolean(f && typeof f === 'string' && f.trim() !== ''))
        : [],
      type: formData.type,
      category: formData.category?.trim() || undefined,
      skill: formData.skill?.trim() || undefined,
    };
    onSave(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white/80">Package Name <span className="text-red-500">*</span></Label>
        <Input
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="Cricket Coaching - Batting Basics"
          className="h-11 bg-[#2A2A2A] border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all focus:outline-none rounded-lg"
          required
        />
      </div>

      {/* Category with dropdown */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-white/80">Category <span className="text-red-500">*</span></Label>
        <CategorySelect
          value={formData.category || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          type="service"
          placeholder="Select a category"
          required
        />
      </div>

      {/* Mode (only for analytics) */}
      {String(formData.category || '').toLowerCase().includes('analytic') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/80">Mode <span className="text-red-500">*</span></Label>
          <div className="relative">
            <select
              name="type"
              value={formData.type || 'online'}
              onChange={handleChange}
              className="flex h-11 w-full appearance-none rounded-lg border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
              required
            >
              <option value="online">Online</option>
              <option value="in-person">In-Person</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      )}

      {/* Player Skill (only for Match Player) */}
      {String(formData.category || '').toLowerCase().includes('match player') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/80">Player Skill <span className="text-red-500">*</span></Label>
          <div className="relative">
            <select
              name="skill"
              value={formData.skill || ''}
              onChange={handleChange}
              className="flex h-11 w-full appearance-none rounded-lg border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 cursor-pointer"
              required
            >
              <option value="" disabled>Select player skill</option>
              <option value="All-rounder">All-rounder</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="Wicket-keeper">Wicket-keeper</option>
              <option value="Opening Batsman">Opening Batsman</option>
              <option value="Middle-order Batsman">Middle-order Batsman</option>
              <option value="Fast Bowler">Fast Bowler</option>
              <option value="Spin Bowler">Spin Bowler</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price <span className="text-red-500">*</span></Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">₹</span>
            <Input
              name="price"
              type="number"
              value={formData.price || ''}
              onChange={handleChange}
              onBlur={(e) => {
                const numeric = e.target.value.replace(/[^0-9]/g, '');
                setFormData(prev => ({ ...prev, price: numeric }));
              }}
              placeholder="2500"
              inputMode="numeric"
              pattern="[0-9]*"
              className="pl-8 bg-[#2D2D2D] border-white/10 text-white placeholder-white/40 focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Service Duration <span className="text-red-500">*</span></Label>
          <Input
            name="deliveryTime"
            value={formData.deliveryTime || ''}
            onChange={handleChange}
            placeholder="2 hours"
            className="bg-[#2D2D2D] border-white/10 text-white placeholder-white/40 focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all w-full"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-white/80">Description <span className="text-red-500">*</span></Label>
        <Textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Personalized cricket coaching with drills, footwork, and technique refinement"
          className="bg-[#2A2A2A] border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all min-h-[100px] rounded-lg"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-white/80">Features</Label>
          <span className="text-xs text-white/40">(Optional)</span>
        </div>
        <div className="space-y-2">
          {formData.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder={`Footwork drills`}
                className="bg-[#2A2A2A] border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all rounded-lg h-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors h-9 w-9 rounded-lg"
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="mt-2">
            <button
              type="button"
              onClick={addFeature}
              className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg hover:bg-purple-500/10 transition-colors w-auto"
            >
              <Plus className="h-4 w-4" />
              Add another feature
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          type="button"
          role="switch"
          aria-checked={formData.popular || false}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${formData.popular ? 'bg-purple-600' : 'bg-[#2D2D2D]'}`}
          onClick={() => setFormData(prev => ({ ...prev, popular: !prev.popular }))}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              formData.popular ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
        <Label htmlFor="popular" className="text-sm font-medium text-white/80 cursor-pointer">
          Mark as Popular
        </Label>
      </div>

      {!hideActions && (
        <div className="pt-4 border-t border-white/5">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="h-10 px-6 rounded-lg border-white/10 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all"
            >
              {initialData?.id ? 'Update Package' : 'Create Package'}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}

interface ServicePackagesProps {
  services?: Array<{
    id: string;
    title: string;
    description: string;
    price: string;
    type: 'online' | 'in-person' | 'hybrid';
    deliveryTime: string;
    features: string[];
    category?: string;
  }>;
}

export function ServicePackages({ services = [] }: ServicePackagesProps) {
  const { services: ctxServices, addService, updateService, removeService } = useServices();
  // Convert services to the internal packages format
  const initialPackages = services.length > 0 
    ? services.map(service => ({
        id: service.id,
        name: service.title,
        // ensure numeric-only price for inputs (strip ₹ and commas)
        price: (service.price || '').replace(/^₹\s?/, '').replace(/,/g, ''),
        description: service.description,
        features: service.features || [],
        deliveryTime: service.deliveryTime || '',
        popular: false,
        revisions: '1 revision',
        // carry through type and category so dialog defaults are pre-selected
        type: service.type,
        category: normalizeCategory(service.category)
      }))
    : [];

  // Load packages from localStorage or use defaults
  const [packages, setPackages] = useState<ServicePackage[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('userPackages');
      if (saved) {
        try {
          const parsedPackages = JSON.parse(saved);
          return parsedPackages;
        } catch (error) {
          console.error('Failed to parse saved packages:', error);
        }
      }
    }

    // Fallback to initial packages or defaults
    return initialPackages.length > 0 ? initialPackages : [
      {
        id: "1",
        name: "Net Bowling Sessions",
        price: "500",
        description: "Professional net bowling sessions with personalized coaching",
        features: [
          "1-hour net session",
          "Ball analysis",
          "Technique improvement",
          "Q&A session"
        ],
        deliveryTime: "1 hour",
        revisions: "1 revision",
        category: "Net Bowler"
      },
      {
        id: "2",
        name: "Match Player",
        price: "1,500",
        description: "Professional match player ready to play for your team per match",
        features: [
          "Full match participation",
          "Team contribution",
          "Match commitment",
          "Performance guarantee"
        ],
        deliveryTime: "Per match",
        revisions: "1 revision",
        category: "Match Player"
      },
      {
        id: "3",
        name: "Match Videography",
        price: "800",
        description: "Professional match videography and reel content creation during games",
        features: [
          "Full match recording",
          "Highlight reel creation",
          "Social media content",
          "Priority editing"
        ],
        deliveryTime: "Same day",
        revisions: "Unlimited",
        category: "Cricket Photo / Videography"
      },
      {
        id: "4",
        name: "Sidearm Bowling",
        price: "1,500",
        description: "Professional sidearm bowler delivering 140km/h+ speeds for practice sessions",
        features: [
          "140km/h+ sidearm bowling",
          "Practice session delivery",
          "Consistent speed & accuracy",
          "Training session support"
        ],
        popular: true,
        deliveryTime: "per hour",
        revisions: "2 revisions",
        category: "Sidearm"
      },
      {
        id: "5",
        name: "Batting Coaching",
        price: "1,200",
        description: "Professional batting technique training and skill development",
        features: [
          "Batting technique analysis",
          "Footwork drills",
          "Shot selection training",
          "Mental preparation coaching"
        ],
        deliveryTime: "per hour",
        revisions: "2 revisions",
        category: "Coach"
      },
      {
        id: "6",
        name: "Performance Analysis",
        price: "2,000",
        description: "Comprehensive cricket performance analysis and improvement recommendations",
        features: [
          "Match statistics review",
          "Strength/weakness analysis",
          "Improvement recommendations",
          "Progress tracking"
        ],
        deliveryTime: "2-3 weeks",
        revisions: "3 revisions",
        category: "Analyst"
      }
    ];
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Save packages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPackages', JSON.stringify(packages));
    }
  }, [packages]);

  // Initialize UI packages from ServicesContext if local is empty
  useEffect(() => {
    if (packages.length === 0 && Array.isArray(ctxServices) && ctxServices.length > 0) {
      setPackages(ctxServices.map(mapToUI));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctxServices]);

  // Propagate UI package changes into ServicesContext (upsert)
  useEffect(() => {
    if (!Array.isArray(packages)) return;
    const mapped = packages.map(mapToCtx);
    mapped.forEach(svc => {
      const existing = ctxServices.find(s => s.id === svc.id);
      if (!existing) {
        addService(svc);
      } else {
        updateService(svc.id, svc);
      }
    });
  }, [packages]);

  const handleSavePackage = (pkg: Partial<ServicePackage>) => {
    // Ensure features is always an array and filter out empty strings
    const cleanFeatures = Array.isArray(pkg.features) 
      ? pkg.features.filter((f): f is string => Boolean(f && typeof f === 'string' && f.trim() !== ''))
      : [];
    
    setPackages(currentPackages => {
      if (pkg.id && currentPackages.some(p => p.id === pkg.id)) {
        // Update existing package
        return currentPackages.map(p => 
          p.id === pkg.id 
            ? { 
                ...pkg,
                features: cleanFeatures,
                id: p.id, // Preserve the original ID
                name: pkg.name?.trim() || p.name,
                description: pkg.description?.trim() || p.description,
                price: pkg.price?.trim() || p.price,
                deliveryTime: pkg.deliveryTime?.trim() || p.deliveryTime,
                popular: pkg.popular !== undefined ? pkg.popular : p.popular,
                revisions: pkg.revisions || p.revisions || '1 revision'
              } as ServicePackage 
            : p
        );
      } else {
        // Add new package with all required fields
        const newPackage: ServicePackage = {
          id: Math.random().toString(36).substr(2, 9),
          name: pkg.name?.trim() || 'New Package',
          description: pkg.description?.trim() || '',
          price: pkg.price?.trim() || '0',
          features: cleanFeatures,
          deliveryTime: pkg.deliveryTime?.trim() || '',
          popular: Boolean(pkg.popular),
          revisions: '1 revision',
          type: (pkg.type as any) || 'online',
          category: (pkg.category as any) || ''
        };
        return [...currentPackages, newPackage];
      }
    });
    
    setIsDialogOpen(false);
    setEditingPackage(null);
  };

  const handleDeletePackage = (id: string) => {
    setPackageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (packageToDelete) {
      setPackages(pkgs => pkgs.filter(p => p.id !== packageToDelete));
      // Also remove from ServicesContext
      removeService(packageToDelete);
    }
    setIsDeleteDialogOpen(false);
    setPackageToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setPackageToDelete(null);
  };

  const handleEditPackage = (pkg: ServicePackage) => {
    setEditingPackage(pkg);
    setIsDialogOpen(true);
  };

  const handleAddNewPackage = () => {
    setEditingPackage(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={handleAddNewPackage}
          variant="default"
          size="sm" 
          className="w-full h-10 gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center rounded-lg"
          style={{ borderRadius: '0.5rem' }}
        >
          <Plus className="h-4 w-4" />
          <span>Add Package</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`relative rounded-xl border ${pkg.popular ? 'border-purple-500/30 ring-1 ring-purple-500/20' : 'border-white/5'} bg-[#1E1E1E] pt-12 pb-6 px-6`}
          >
            <div className="absolute -top-3 right-3">
              <button
                type="button"
                className="group h-7 w-7 rounded-full flex items-center justify-center bg-red-500/80 hover:bg-red-600 border border-red-500 hover:border-red-400 transition-all duration-200 shadow-md hover:shadow-red-500/30"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePackage(pkg.id);
                }}
                title="Delete package"
              >
                <Trash2 className="h-3.5 w-3.5 text-white transition-colors" />
              </button>
            </div>
            
            <div className="absolute top-3 left-3">
              {pkg.category && (
                <Badge className="bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs">
                  {pkg.category}
                </Badge>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-baseline justify-center gap-1">
                  <p className="text-2xl font-bold text-white">
                    ₹{pkg.price.replace(/^₹/, '')}
                  </p>
                  <span className="text-sm font-normal text-white/60">/ {pkg.deliveryTime}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-white/60">{pkg.description}</p>
            </div>

            <ul className="mt-6 space-y-3">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-purple-400 mr-2 mt-0.5" />
                  <span className="text-sm text-white/80">{feature}</span>
                </li>
              ))}
            </ul>



            <div className="mt-6 space-y-2">
              <Button 
                className={`w-full ${pkg.popular ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' : 'bg-white/5 hover:bg-white/10'}`}
                size="sm"
                onClick={() => handleEditPackage(pkg)}
              >
                Edit Package
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Package Card */}
      <Card className="bg-[#1E1E1E] border-white/5">
        <CardContent className="p-6">
          <div 
            className="rounded-xl border-2 border-dashed border-white/10 p-8 hover:border-purple-500/50 transition-colors cursor-pointer flex flex-col items-center justify-center"
            onClick={handleAddNewPackage}
          >
            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center mb-4 hover:bg-white/10 transition-colors">
              <Plus className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-1">Add New Package</h3>
            <p className="text-sm text-white/60 text-center max-w-md">Click here to create a new service package for your clients</p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent aria-describedby={undefined} className="w-[320px] bg-[#1E1E1E] border-white/10 rounded-xl overflow-hidden p-0">
          <div className="p-5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10 mb-3">
              <Trash2 className="h-4 w-4 text-red-500" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white mb-1">
              Delete Package?
            </DialogTitle>
            <p className="text-[13px] text-white/70 mb-4 leading-snug">
              This will permanently delete the package and cannot be undone.
            </p>
            <div className="flex flex-col space-y-2 mt-4">
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500/90 hover:bg-red-600 text-white transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Yes, Delete It
              </button>
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-white/10 bg-transparent hover:bg-white/5 text-white/90 hover:text-white transition-all duration-200"
              >
                No, Keep It
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Package Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-[600px] w-[calc(100%-2rem)] max-h-[90vh] flex flex-col p-0 bg-[#1E1E1E] border-0 rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-white/10 bg-[#1E1E1E] px-5 py-3">
            <DialogHeader className="space-y-0.5">
              <DialogTitle className="text-lg font-semibold text-white">
                {editingPackage ? 'Edit Service Package' : 'Create New Package'}
              </DialogTitle>
              <p className="text-xs text-white/60">
                {editingPackage ? 'Update your service package details' : 'Create a new service package for your clients'}
              </p>
            </DialogHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-3">
            <PackageForm
              initialData={editingPackage || undefined}
              onSave={handleSavePackage}
              onCancel={() => setIsDialogOpen(false)}
              onValidationChange={setIsFormValid}
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
                disabled={!isFormValid}
                className="h-10 px-8 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingPackage ? 'Update Package' : 'Create Package'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
