'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreatePromoModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (promo: any) => void;
}

export function CreatePromoModal({ open, onClose, onCreate, initialData }: CreatePromoModalProps & { initialData?: any }) {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'percentage',
    value: '',
    minAmount: '',
    maxDiscount: '',
    usageLimit: '',
    userLimit: '1',
    validFrom: '',
    validTo: '',
    applicableTo: 'all',
    isActive: true
  });

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        code: initialData.code,
        description: initialData.description || '',
        type: initialData.discountType?.toLowerCase() || 'percentage',
        value: initialData.discountValue?.toString() || '',
        minAmount: initialData.minOrderAmount?.toString() || '',
        maxDiscount: initialData.maxDiscount?.toString() || '',
        usageLimit: initialData.usageLimit?.toString() || '',
        userLimit: initialData.perUserLimit?.toString() || '1',
        validFrom: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        validTo: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        applicableTo: 'all', // TODO: Implement applicableTo mapping
        isActive: initialData.isActive
      });
    } else if (open && !initialData) {
      // Reset when opening in create mode
      setFormData({
        code: '',
        description: '',
        type: 'percentage',
        value: '',
        minAmount: '',
        maxDiscount: '',
        usageLimit: '',
        userLimit: '1',
        validFrom: '',
        validTo: '',
        applicableTo: 'all',
        isActive: true
      });
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    // Map to API structure
    const newPromo = {
      code: formData.code,
      description: formData.description,
      discountType: formData.type.toUpperCase(),
      discountValue: Number(formData.value),
      minOrderAmount: formData.minAmount ? Number(formData.minAmount) : null,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      perUserLimit: formData.userLimit ? Number(formData.userLimit) : 1,
      validFrom: formData.validFrom || new Date().toISOString(),
      validTo: formData.validTo || null,
      isActive: formData.isActive
    };
    onCreate(newPromo);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#1a1a1a] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">{initialData ? 'Edit Promo Code' : 'Create Promo Code'}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {initialData ? 'Update existing promo code details' : 'Create a new promotional code for customers'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Promo Code</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="NEWUSER20"
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the promo code..."
              className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-gray-300">
                {formData.type === 'percentage' ? 'Discount %' : 'Discount Amount'}
              </Label>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={formData.type === 'percentage' ? '20' : '100'}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Min Amount</Label>
              <Input
                type="number"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                placeholder="500"
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Max Discount</Label>
              <Input
                type="number"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                placeholder="1000"
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Usage Limit (Total)</Label>
              <Input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="100 (leave empty for unlimited)"
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Per User Limit</Label>
              <Input
                type="number"
                value={formData.userLimit}
                onChange={(e) => setFormData({ ...formData, userLimit: e.target.value })}
                placeholder="1"
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Valid From</Label>
              <Input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Valid To</Label>
              <Input
                type="date"
                value={formData.validTo}
                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
              />
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Applies To</Label>
            <Select
              value={formData.applicableTo}
              onValueChange={(value) => setFormData({ ...formData, applicableTo: value })}
            >
              <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="category">Specific Categories</SelectItem>
                <SelectItem value="service">Specific Services</SelectItem>
                <SelectItem value="user">Specific Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active" className="text-gray-300">Active</Label>
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {initialData ? 'Update Promo Code' : 'Create Promo Code'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
