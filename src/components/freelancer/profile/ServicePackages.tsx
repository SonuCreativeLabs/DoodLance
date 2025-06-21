"use client";

import { useState } from 'react';
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
  onCancel 
}: { 
  initialData?: Partial<ServicePackage>;
  onSave: (pkg: Partial<ServicePackage>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<ServicePackage>>(
    initialData || {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      price: '',
      description: '',
      features: [''],
      deliveryTime: '',
      revisions: '0',
      popular: false
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), '']
    }));
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Package Name</Label>
        <Input
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="e.g., Basic Package"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Price (₹)</Label>
          <Input
            name="price"
            type="text"
            value={formData.price || ''}
            onChange={handleChange}
            placeholder="e.g., 2,500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Delivery Time</Label>
          <Input
            name="deliveryTime"
            value={formData.deliveryTime || ''}
            onChange={handleChange}
            placeholder="e.g., 1-2 weeks"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          placeholder="Describe what's included in this package"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Features</Label>
          <Button type="button" variant="outline" size="sm" onClick={addFeature}>
            <Plus className="h-4 w-4 mr-1" /> Add Feature
          </Button>
        </div>
        <div className="space-y-2">
          {formData.features?.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                placeholder={`Feature ${index + 1}`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="popular"
          checked={formData.popular || false}
          onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, popular: checked }))}
        />
        <Label htmlFor="popular">Mark as Popular</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData?.id ? 'Update' : 'Create'} Package
        </Button>
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
        features: service.features,
        deliveryTime: service.deliveryTime,
        revisions: 'Unlimited',
        popular: false
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
      deliveryTime: "1 day",
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
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);

  const handleSavePackage = (pkg: Partial<ServicePackage>) => {
    if (pkg.id) {
      // Update existing package
      setPackages(pkgs => 
        pkgs.map(p => p.id === pkg.id ? { ...p, ...pkg } as ServicePackage : p)
      );
    } else {
      // Add new package
      setPackages(pkgs => [
        ...pkgs,
        {
          ...pkg,
          id: Math.random().toString(36).substr(2, 9),
          popular: pkg.popular || false
        } as ServicePackage
      ]);
    }
    setIsDialogOpen(false);
    setEditingPackage(null);
  };

  const handleDeletePackage = (id: string) => {
    setPackages(pkgs => pkgs.filter(p => p.id !== id));
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
    <Card className="bg-[#1E1E1E] border-white/5">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-white">Service Packages</CardTitle>
            <p className="text-sm text-white/60">Manage your service offerings and pricing</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Clock className="h-4 w-4" />
              <span>Prices in INR</span>
            </div>
            <Button 
              onClick={handleAddNewPackage}
              size="sm" 
              className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <Plus className="h-4 w-4" />
              Add Package
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative rounded-xl border ${pkg.popular ? 'border-purple-500/30 ring-1 ring-purple-500/20' : 'border-white/5'} bg-[#1E1E1E] p-6`}
            >
              <div className="absolute -top-3 left-3 flex gap-2">
                {pkg.popular && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-3 py-1 text-xs font-medium">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPackage(pkg);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 rounded-full bg-white/5 hover:bg-red-500/10 text-red-400/70 hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this package?')) {
                      handleDeletePackage(pkg.id);
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
                <div className="mt-2 flex items-baseline justify-center gap-x-1">
                  <span className="text-3xl font-bold text-white">₹{pkg.price}</span>
                  {!pkg.price.includes('month') && <span className="text-sm text-white/60">one-time</span>}
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

              <div className="mt-6 flex items-center justify-between text-xs text-white/60">
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{pkg.deliveryTime}</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                  <span>{pkg.revisions}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button 
                  className={`w-full ${pkg.popular ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' : 'bg-white/5 hover:bg-white/10'}`}
                  size="sm"
                  onClick={() => handleEditPackage(pkg)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Package
                </Button>
                <div className="text-xs text-center text-white/50">
                  {pkg.deliveryTime} • {pkg.revisions}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      {/* Add/Edit Package Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#1E1E1E] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
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
    </Card>
  );
}
