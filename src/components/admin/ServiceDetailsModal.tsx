'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Star, Shield, MapPin, CheckCircle, XCircle
} from 'lucide-react';

interface ServiceDetailsModalProps {
  service: any;
  open: boolean;
  onClose: () => void;
  onApprove: (serviceId: string) => void;
  onReject: (serviceId: string) => void;
}

export function ServiceDetailsModal({ service, open, onClose, onApprove, onReject }: ServiceDetailsModalProps) {
  const [isActive, setIsActive] = useState(service?.isActive || false);
  const [minPrice, setMinPrice] = useState('500');
  const [maxPrice, setMaxPrice] = useState('50000');

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#1a1a1a] border-gray-800 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">Service Details</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant={service.status === 'approved' ? 'default' : service.status === 'pending' ? 'secondary' : 'destructive'}>
                {service.status}
              </Badge>
              <Badge variant={service.isActive ? 'default' : 'secondary'}>
                {service.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-gray-400">
            Service ID: {service.id} | Created: {service.createdAt}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Service Info */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Service Information</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-gray-400">Title</Label>
                <p className="text-white">{service.title}</p>
              </div>
              <div>
                <Label className="text-gray-400">Description</Label>
                <p className="text-white text-sm">{service.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Category</Label>
                  <Badge variant="secondary" className="mt-1">{service.category}</Badge>
                </div>
                <div>
                  <Label className="text-gray-400">Service Type</Label>
                  <p className="text-white">{service.serviceType}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Provider Info */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Provider Information</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {service.providerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{service.providerName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-400">{service.providerRating}</span>
                    </div>
                    {service.providerVerified && (
                      <Badge variant="outline" className="border-green-600 text-green-400">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">View Profile</Button>
            </div>
          </Card>

          {/* Pricing & Packages */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Pricing & Packages</h3>
            {service.packages ? (
              <div className="grid grid-cols-3 gap-3">
                {service.packages.map((pkg: any, index: number) => (
                  <Card key={index} className="bg-[#1a1a1a] border-gray-700 p-3">
                    <h4 className="text-sm font-medium text-white mb-2">{pkg.name}</h4>
                    <p className="text-xl font-bold text-purple-400 mb-1">₹{pkg.price}</p>
                    <p className="text-xs text-gray-400 mb-2">{pkg.duration} min</p>
                    <div className="space-y-1">
                      {pkg.features.map((feature: string, i: number) => (
                        <p key={i} className="text-xs text-gray-300">• {feature}</p>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">₹{service.price}</p>
                  <p className="text-sm text-gray-400">Base price</p>
                </div>
                <div>
                  <p className="text-white">{service.duration} minutes</p>
                  <p className="text-sm text-gray-400">Duration</p>
                </div>
                <div>
                  <p className="text-white">{service.deliveryTime}</p>
                  <p className="text-sm text-gray-400">Delivery</p>
                </div>
              </div>
            )}
          </Card>

          {/* Location */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Location & Availability</h3>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4 text-gray-400" />
              {service.location}
            </div>
          </Card>

          {/* Tags */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Tags & Requirements</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-gray-400">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {service.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-gray-400">Requirements</Label>
                <p className="text-white text-sm mt-1">{service.requirements}</p>
              </div>
            </div>
          </Card>

          {/* Performance */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Performance Metrics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4" />
                  <span className="text-xl font-bold text-white">{service.rating}</span>
                </div>
                <p className="text-xs text-gray-400">Rating</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{service.reviewCount}</p>
                <p className="text-xs text-gray-400">Reviews</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{service.totalOrders}</p>
                <p className="text-xs text-gray-400">Total Orders</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">₹{(service.price * service.totalOrders / 1000).toFixed(1)}k</p>
                <p className="text-xs text-gray-400">Revenue</p>
              </div>
            </div>
          </Card>

          {/* Controls */}
          <Card className="bg-[#2a2a2a] border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Service Controls</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="active" className="text-gray-300">Service Active</Label>
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Min Price</Label>
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Max Price</Label>
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {service.status === 'pending' && (
            <>
              <Button 
                variant="destructive"
                onClick={() => {
                  onReject(service.id);
                  onClose();
                }}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  onApprove(service.id);
                  onClose();
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          )}
          {service.status === 'approved' && (
            <Button className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
