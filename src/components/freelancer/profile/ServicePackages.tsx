"use client";

import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, Zap, ShieldCheck, Star, Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type ServicePackage = {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  deliveryTime: string;
  revisions: string;
};

// Package Form Component
function PackageForm({
  initialData,
  onSave,
  onCancel,
}: {
  initialData?: Partial<ServicePackage>;
  onSave: (pkg: Partial<ServicePackage>) => void;
  onCancel: () => void;
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
      popular: false
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
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [''])];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures.filter(f => f.trim() !== '') // Remove empty features
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
        : []
    };
    onSave(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="space-y-2">
        <Label>Package Name</Label>
        <Input
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="e.g., Basic Coaching, AC Service, Consultation"
          className="bg-[#2D2D2D] border-white/10 text-white placeholder-white/40 focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all focus:outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Price</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">₹</span>
          <Input
            name="price"
            type="text"
            value={formData.price || ''}
            onChange={handleChange}
            placeholder="2,500"
            className="pl-8 bg-[#2D2D2D] border-white/10 text-white placeholder-white/40 focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all w-full"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Service Duration</Label>
        <Input
          name="deliveryTime"
          value={formData.deliveryTime || ''}
          onChange={handleChange}
          placeholder="e.g., 2 hours, 1 day, 1 week"
          className="bg-[#2D2D2D] border-white/10 text-white placeholder-white/40 focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all focus:outline-none"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Briefly describe what clients will receive in this package"
          className="bg-[#2D2D2D] border-white/10 text-white placeholder-white/40 focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all min-h-[100px]"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label>Features</Label>
          <span className="text-xs text-white/50">(Optional)</span>
        </div>
        <div className="space-y-2">
          {formData.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder={`Include key benefit or feature`}
                className="bg-[#2D2D2D] border-white/10 text-white placeholder-white/40 focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="mt-2">
            <button
              type="button"
              className="flex items-center text-sm text-white/60 hover:text-white transition-colors group"
              onClick={() => setFormData(prev => ({
                ...prev,
                features: [...(Array.isArray(prev.features) ? prev.features : ['']), '']
              }))}
            >
              <div className="flex items-center justify-center w-5 h-5 mr-1 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <Plus className="h-3 w-3" />
              </div>
              <span>Add another feature</span>
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

      <div className="flex justify-end space-x-3 pt-6">
        <button 
          type="button"
          onClick={onCancel}
          className="px-5 py-2 text-sm font-medium rounded-md text-white/80 hover:text-white transition-colors hover:bg-white/5"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-5 py-2 text-sm font-medium rounded-md bg-white text-[#1E1E1E] hover:bg-white/90 transition-colors shadow-sm"
        >
          {initialData?.id ? 'Update Package' : 'Create Package'}
        </button>
      </div>
    </form>
  );
}

interface ServicePackagesProps {
  services?: Array<{
    id: string;
    title: string;
    description: string;
    price: string;
    type: 'online' | 'in-person';
    deliveryTime: string;
    features: string[];
  }>;
}

export function ServicePackages({ services = [] }: ServicePackagesProps) {
  // Convert services to the internal packages format
  const initialPackages = services.length > 0 
    ? services.map(service => ({
        id: service.id,
        name: service.title,
        price: service.price,
        description: service.description,
        features: service.features || [],
        deliveryTime: service.deliveryTime || '',
        popular: false,
        revisions: '1 revision'
      }))
    : [];

  const [packages, setPackages] = useState<ServicePackage[]>(initialPackages.length > 0 ? initialPackages : [
    {
      id: "1",
      name: "AI Consultation",
      price: "2,500",
      description: "1-hour consultation to discuss your AI needs and solutions",
      features: [
        "Business process analysis",
        "AI solution recommendations",
        "Implementation roadmap",
        "Q&A session"
      ],
      deliveryTime: "",
      revisions: "1 revision"
    },
    {
      id: "2",
      name: "Process Automation",
      price: "15,000",
      description: "Automate repetitive business processes to save time and reduce errors",
      features: [
        "Process analysis & mapping",
        "Automation workflow design",
        "Basic automation setup",
        "1 month support"
      ],
      popular: true,
      deliveryTime: "1-2 weeks",
      revisions: "2 revisions"
    },
    {
      id: "3",
      name: "Custom AI Agent",
      price: "25,000",
      description: "Custom AI agent development tailored to your specific needs",
      features: [
        "Requirement analysis",
        "Custom development",
        "Testing & deployment",
        "1 month support"
      ],
      deliveryTime: "2-3 weeks",
      revisions: "3 revisions"
    },
    {
      id: "4",
      name: "AI Maintenance",
      price: "10,000/month",
      description: "Ongoing maintenance and support for your AI solutions",
      features: [
        "Monthly system checks",
        "Performance optimization",
        "Bug fixes & updates",
        "Priority support"
      ],
      deliveryTime: "Ongoing",
      revisions: "Unlimited"
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);

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
          revisions: '1 revision'
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
    <>
      <Card className="bg-[#1E1E1E] border-white/5">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-white">Service Packages</CardTitle>
            <p className="text-sm text-white/60">Manage your service offerings and pricing</p>
          </div>
          <div className="w-full sm:w-auto flex justify-end">
            <Button 
              onClick={handleAddNewPackage}
              size="sm" 
              className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Plus className="h-4 w-4" />
              Add Package
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative rounded-xl border ${pkg.popular ? 'border-purple-500/30 ring-1 ring-purple-500/20' : 'border-white/5'} bg-[#1E1E1E] p-6`}
            >
              <div className="absolute -top-3 right-3">
                <button
                  type="button"
                  className="group h-8 w-8 rounded-full flex items-center justify-center bg-[#2D2D2D] hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePackage(pkg.id);
                  }}
                  title="Delete package"
                >
                  <Trash2 className="h-4 w-4 text-white/60 group-hover:text-red-400 transition-colors" />
                </button>
              </div>
              {pkg.popular && (
                <div className="absolute -top-3 left-3">
                  <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-3 py-1 text-xs font-medium">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-white">
                    ₹{pkg.price.replace(/^₹/, '')}
                    <span className="text-sm font-normal text-white/60 ml-1">/gig</span>
                  </p>
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

              <div className="mt-6 text-xs text-white/60">
                <div className="flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{pkg.deliveryTime}</span>
                </div>
              </div>

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
      </CardContent>
    </Card>

    {/* Delete Confirmation Dialog */}
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="w-[320px] bg-[#1E1E1E] border-white/10 rounded-xl overflow-hidden p-0">
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

    {/* Add New Package Card - Separate */}
    <Card className="mt-6 bg-[#1E1E1E] border-white/5">
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

    {/* Add/Edit Package Dialog */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-[90%] max-w-md max-h-[75vh] overflow-y-auto bg-[#1E1E1E] border-white/10 p-6 pt-8">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {editingPackage ? 'Edit Service Package' : 'Create New Service Package'}
          </DialogTitle>
        </DialogHeader>
        
        <PackageForm
          initialData={editingPackage || undefined}
          onSave={handleSavePackage}
          onCancel={() => setIsDialogOpen(false)}
        />
      </DialogContent>
      </Dialog>
    </>
  );
}
