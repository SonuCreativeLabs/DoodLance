"use client";

import React, { useState, useEffect } from 'react';
import { ServiceVideoCarousel } from '@/components/common/ServiceVideoCarousel';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, Trash2, Plus, Star, FileText, CheckCircle, XCircle, Play, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useServices, type ServicePackage as CtxService } from '@/contexts/ServicesContext';
import { CategorySelect } from "@/components/common/CategoryBadge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from '@/components/freelancer/profile/EmptyState';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { VideoEmbed, getVideoAspectRatio } from '@/components/common/VideoEmbed';

// Local form interface (different from context ServicePackage)
// Local form interface (different from context ServicePackage)
interface ServicePackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  videoUrls?: string[];
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
  videoUrls: pkg.videoUrls || [],
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
  videoUrls: (svc.videoUrls && svc.videoUrls.length > 0) ? svc.videoUrls : [''],
  deliveryTime: svc.deliveryTime,
  revisions: '1 revision',
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
      videoUrls: [''],
      deliveryTime: '',
      revisions: '1 revision',
      type: 'online' as const,
      category: '',
      skill: '', // Add skill field
    };

    return {
      ...defaultData,
      ...initialData,
      features: Array.isArray(initialData?.features) && initialData.features.length > 0
        ? initialData.features
        : defaultData.features,
      videoUrls: Array.isArray(initialData?.videoUrls) && initialData.videoUrls.length > 0
        ? initialData.videoUrls
        : defaultData.videoUrls
    };
  });

  // Form validation state
  const [isFormValid, setIsFormValid] = useState(false);
  const [urlValidation, setUrlValidation] = useState<{ isValid: boolean; message: string } | null>(null);

  // URL validation function
  const validateVideoUrl = (url: string): { isValid: boolean; message: string } => {
    if (!url.trim()) {
      return { isValid: false, message: '' };
    }

    const urlPatterns = {
      youtube: /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([^#&?]*)/,
      vimeo: /vimeo\.com/,
      instagram: /instagram\.com\/(?:p|reel|stories)\//,
      facebook: /facebook\.com/,
      twitter: /(?:twitter\.com|x\.com)/,
      tiktok: /tiktok\.com/,
      googleDrive: /drive\.google\.com\/file\/d\/([^/]+)/
    };

    for (const [platform, pattern] of Object.entries(urlPatterns)) {
      if (pattern.test(url)) {
        return { isValid: true, message: `Valid ${platform.charAt(0).toUpperCase() + platform.slice(1)} URL` };
      }
    }

    // Generic valid URL check for any other platform
    try {
      new URL(url);
      return { isValid: true, message: 'Valid Video URL' };
    } catch {
      return { isValid: false, message: 'Please enter a valid URL' };
    }
  };

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
    // Validate at least one URL is valid
    const hasValidUrl = formData.videoUrls?.some(url => url.trim() && validateVideoUrl(url).isValid) || false;

    const isValid = Boolean(
      formData.name?.trim() &&
      formData.category?.trim() &&
      formData.price?.trim() &&
      formData.deliveryTime?.trim() &&
      formData.description?.trim() &&
      formData.videoUrls?.some(url => url.trim()) &&
      hasValidUrl &&
      (!String(formData.category || '').toLowerCase().includes('analytic') || formData.type) &&
      (!String(formData.category || '').toLowerCase().includes('match player') || formData.skill?.trim())
    );
    setIsFormValid(isValid);
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

  const handleVideoUrlChange = (index: number, value: string) => {
    const newUrls = [...(formData.videoUrls || [''])];
    newUrls[index] = value;
    setFormData(prev => ({
      ...prev,
      videoUrls: newUrls
    }));
  };

  const addVideoUrl = () => {
    setFormData((prev: Partial<ServicePackage>) => ({
      ...prev,
      videoUrls: [...(Array.isArray(prev.videoUrls) ? prev.videoUrls : ['']), '']
    }));
  };

  const removeVideoUrl = (index: number) => {
    const newUrls = [...(formData.videoUrls || [''])];
    newUrls.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      videoUrls: newUrls.length ? newUrls : ['']
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.videoUrls?.some(url => url.trim())) {
      toast.error("At least one video URL is required");
      return;
    }

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
      videoUrls: Array.isArray(formData.videoUrls)
        ? formData.videoUrls.filter((u): u is string => Boolean(u && typeof u === 'string' && u.trim() !== ''))
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
          style={{ borderRadius: '0.5rem' }}
          className="h-11 bg-[#2A2A2A] border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all focus:outline-none"
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
              style={{ borderRadius: '0.5rem' }}
              className="flex h-11 w-full appearance-none border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
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
              style={{ borderRadius: '0.5rem' }}
              className="flex h-11 w-full appearance-none border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 cursor-pointer"
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
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Coach Specialization (only for Coach) */}
      {String(formData.category || '').toLowerCase().includes('coach') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/80">Coaching Specialization <span className="text-red-500">*</span></Label>
          <div className="relative">
            <select
              name="skill"
              value={formData.skill || ''}
              onChange={handleChange}
              style={{ borderRadius: '0.5rem' }}
              className="flex h-11 w-full appearance-none border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 cursor-pointer"
              required
            >
              <option value="" disabled>Select coaching type</option>
              <option value="Batting Coach">Batting Coach</option>
              <option value="Bowling Coach">Bowling Coach</option>
              <option value="Fielding Coach">Fielding Coach</option>
              <option value="Mental Coach">Mental Coach</option>
              <option value="Fitness Coach">Fitness Coach</option>
              <option value="General Coach">General Coach</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Analyst Specialization */}
      {String(formData.category || '').toLowerCase().includes('analyst') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/80">Analyst Type <span className="text-red-500">*</span></Label>
          <div className="relative">
            <select
              name="skill"
              value={formData.skill || ''}
              onChange={handleChange}
              style={{ borderRadius: '0.5rem' }}
              className="flex h-11 w-full appearance-none border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 cursor-pointer"
              required
            >
              <option value="" disabled>Select analyst type</option>
              <option value="Performance Analyst">Performance Analyst</option>
              <option value="Video Analyst">Video Analyst</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Technical Analyst">Technical Analyst</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Trainer Specialization */}
      {String(formData.category || '').toLowerCase().includes('trainer') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/80">Trainer Type <span className="text-red-500">*</span></Label>
          <div className="relative">
            <select
              name="skill"
              value={formData.skill || ''}
              onChange={handleChange}
              style={{ borderRadius: '0.5rem' }}
              className="flex h-11 w-full appearance-none border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 cursor-pointer"
              required
            >
              <option value="" disabled>Select trainer type</option>
              <option value="Strength & Conditioning">Strength & Conditioning</option>
              <option value="Speed & Agility">Speed & Agility</option>
              <option value="Flexibility Trainer">Flexibility Trainer</option>
              <option value="Injury Prevention">Injury Prevention</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Commentator Specialization */}
      {String(formData.category || '').toLowerCase().includes('commentator') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/80">Commentator Type <span className="text-red-500">*</span></Label>
          <div className="relative">
            <select
              name="skill"
              value={formData.skill || ''}
              onChange={handleChange}
              style={{ borderRadius: '0.5rem' }}
              className="flex h-11 w-full appearance-none border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 cursor-pointer"
              required
            >
              <option value="" disabled>Select commentator type</option>
              <option value="TV Commentator">TV Commentator</option>
              <option value="Radio Commentator">Radio Commentator</option>
              <option value="Digital/Streaming">Digital/Streaming</option>
              <option value="Regional Language">Regional Language</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Physio Specialization */}
      {String(formData.category || '').toLowerCase().includes('physio') && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white/80">Physio Type <span className="text-red-500">*</span></Label>
          <div className="relative">
            <select
              name="skill"
              value={formData.skill || ''}
              onChange={handleChange}
              style={{ borderRadius: '0.5rem' }}
              className="flex h-11 w-full appearance-none border border-white/10 bg-[#2D2D2D] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30 cursor-pointer"
              required
            >
              <option value="" disabled>Select physio type</option>
              <option value="Sports Physiotherapist">Sports Physiotherapist</option>
              <option value="Injury Rehabilitation">Injury Rehabilitation</option>
              <option value="Sports Massage Therapist">Sports Massage Therapist</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
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
              style={{ borderRadius: '0.5rem' }}
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
            style={{ borderRadius: '0.5rem' }}
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
          style={{ borderRadius: '0.5rem' }}
          className="bg-[#2A2A2A] border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-white/80">Video URLs <span className="text-red-500">*</span></Label>
        </div>
        <div className="space-y-2">
          {formData.videoUrls?.map((url, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={url}
                  onChange={(e) => handleVideoUrlChange(index, e.target.value)}
                  placeholder="https://instagram.com/p/..."
                  style={{ borderRadius: '0.5rem' }}
                  className={`h-11 bg-[#2A2A2A] border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all pr-10 ${url.trim() && validateVideoUrl(url).isValid ? 'border-green-500/50' :
                    url.trim() && !validateVideoUrl(url).isValid ? 'border-red-500/50' : ''
                    }`}
                  required={index === 0}
                />
                {url.trim() && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {validateVideoUrl(url).isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {index === 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-white bg-white/10 hover:bg-white/20 transition-colors h-11 w-11 rounded-lg border border-white/20"
                  onClick={addVideoUrl}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors h-11 w-11 rounded-lg"
                  onClick={() => removeVideoUrl(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        {formData.videoUrls && formData.videoUrls[0]?.trim() && (
          <p className={`text-xs ${validateVideoUrl(formData.videoUrls[0]).isValid ? 'text-green-500' : 'text-red-500'
            }`}>
            {validateVideoUrl(formData.videoUrls[0]).message}
          </p>
        )}
        {!formData.videoUrls?.[0]?.trim() && (
          <p className="text-xs text-white/40">Supported: YouTube, Instagram, Facebook, Twitter, TikTok, Google Drive (Public)</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-white/80">What's Included</Label>
          <span className="text-xs text-white/40">(Optional)</span>
        </div>
        <div className="space-y-2">
          {formData.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  placeholder={`Footwork drills`}
                  style={{ borderRadius: '0.5rem' }}
                  className="bg-[#2A2A2A] border-white/10 text-white placeholder-white/40 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all h-11"
                />
              </div>
              {index === 0 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-white bg-white/10 hover:bg-white/20 transition-colors h-11 w-11 rounded-lg border border-white/20"
                  onClick={addFeature}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors h-11 w-11 rounded-lg"
                  onClick={() => removeFeature(index)}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          ))}
        </div>
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
              disabled={!isFormValid}
              className="h-10 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-purple-500"
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
  const { services: ctxServices, addService, updateService, removeService, isLoading } = useServices();

  // Use context services as the source of truth
  const packages = ctxServices.map(mapToUI);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>('');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative rounded-xl border border-white/5 bg-[#1E1E1E] pt-12 pb-6 px-6 space-y-4">
              <div className="space-y-2 text-center">
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-8 w-1/2 mx-auto" />
                <Skeleton className="h-4 w-5/6 mx-auto" />
              </div>
              <div className="space-y-2 mt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="h-9 w-full rounded-md mt-6" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleSavePackage = (pkg: Partial<ServicePackage>) => {
    // Ensure features is always an array and filter out empty strings
    const cleanFeatures = Array.isArray(pkg.features)
      ? pkg.features.filter((f): f is string => Boolean(f && typeof f === 'string' && f.trim() !== ''))
      : [];

    if (pkg.id && packages.some(p => p.id === pkg.id)) {
      // Update existing package
      const existingPkg = packages.find(p => p.id === pkg.id);
      if (existingPkg) {
        const updatedPkg: ServicePackage = {
          ...existingPkg,
          ...pkg,
          features: cleanFeatures,
          name: pkg.name?.trim() || existingPkg.name,
          description: pkg.description?.trim() || existingPkg.description,
          price: pkg.price?.trim() || existingPkg.price,
          deliveryTime: pkg.deliveryTime?.trim() || existingPkg.deliveryTime,
          revisions: pkg.revisions || existingPkg.revisions,
          videoUrls: pkg.videoUrls !== undefined && pkg.videoUrls.length > 0 ? pkg.videoUrls : existingPkg.videoUrls,
          skill: pkg.skill || existingPkg.skill,
        } as ServicePackage;

        updateService(pkg.id, mapToCtx(updatedPkg));
      }
    } else {
      // Add new package
      const newPkg: ServicePackage = {
        id: Math.random().toString(36).substr(2, 9),
        name: pkg.name?.trim() || 'New Package',
        price: pkg.price?.trim() || '0',
        description: pkg.description?.trim() || '',
        features: cleanFeatures,
        deliveryTime: pkg.deliveryTime?.trim() || '',
        revisions: '1 revision',
        videoUrls: pkg.videoUrls || [''],
        type: (pkg.type as any) || 'online',
        category: (pkg.category as any) || '',
        skill: (pkg.skill as any) || '',
      };

      addService(mapToCtx(newPkg));
    }

    setIsDialogOpen(false);
    setEditingPackage(null);
  };

  const handleDeletePackage = (id: string) => {
    setPackageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (packageToDelete) {
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
      {packages.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No service packages"
          description="Create packages to display your services and pricing to potential clients."
          action={
            <Button
              onClick={handleAddNewPackage}
              variant="default"
              size="sm"
              className="gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center rounded-lg"
              style={{ borderRadius: '0.5rem' }}
            >
              <Plus className="h-4 w-4" />
              <span>Add Package</span>
            </Button>
          }
        />
      ) : (
        <>
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
                className="relative rounded-xl border border-white/5 bg-[#1E1E1E] overflow-hidden cursor-pointer hover:border-white/10 transition-colors"
                onClick={() => handleEditPackage(pkg)}
              >
                {/* Video Cover */}
                <ServiceVideoCarousel
                  videoUrls={pkg.videoUrls?.filter(url => url) || []}
                  onVideoClick={(url) => window.open(url, '_blank')}
                  className="rounded-t-xl"
                />

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                  <button
                    type="button"
                    className="group h-7 w-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-200 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditPackage(pkg);
                    }}
                    title="Edit package"
                  >
                    <Pencil className="h-3.5 w-3.5 text-white/90 group-hover:text-white transition-colors" />
                  </button>
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

                {/* Category Badge */}


                {/* Content */}
                <div className="pt-6 pb-6 px-6">
                  <div className="text-left">
                    {pkg.category && (
                      <div className="mb-4 flex justify-start">
                        <Badge className="bg-white/10 text-white/80 border-white/20 px-2 py-0.5 text-xs">
                          {pkg.category}
                        </Badge>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2">{pkg.name}</h3>

                    <p className="text-sm text-white/60 mb-6 line-clamp-3">{pkg.description}</p>
                  </div>

                  <ul className="mb-6 space-y-2.5">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0 text-purple-400 mr-2.5 mt-0.5" />
                        <span className="text-sm text-white/80 leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-4 relative mt-auto">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-white">
                        ₹{pkg.price.replace(/^₹/, '')}
                      </div>
                      <div className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        {pkg.deliveryTime}
                      </div>
                    </div>
                  </div>
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
        </>
      )}
      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="max-w-4xl w-full bg-[#1E1E1E] border-white/10 p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-white">Video Preview</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            {selectedVideoUrl && (
              <VideoEmbed url={selectedVideoUrl} className="w-full" />
            )}
          </div>
        </DialogContent>
      </Dialog>

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
    </div >
  );
}
