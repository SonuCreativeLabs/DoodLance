'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Star, Shield, CheckCircle, XCircle
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
  const [controlsEnabled, setControlsEnabled] = useState(false);

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
                  <div>
                    <Badge variant="secondary" className="mt-1">{service.category}</Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-400">Price & Duration</Label>
                  <p className="text-white mt-1">₹{service.price} • {service.duration || 60} mins</p>
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
              <Link href={`/client/freelancer/${service.providerId}`} passHref target="_blank">
                <Button variant="outline" size="sm">View Profile</Button>
              </Link>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Service Controls</h3>
              <div className="flex items-center gap-2">
                <Label htmlFor="enable-controls" className="text-xs text-gray-500">Enable Actions</Label>
                <Switch
                  id="enable-controls"
                  checked={controlsEnabled}
                  onCheckedChange={setControlsEnabled}
                />
              </div>
            </div>

            <div className="space-y-4 opacity-100 transition-opacity">
              <div className="flex items-center justify-between">
                <Label htmlFor="active" className={`text-gray-300 ${!controlsEnabled && 'opacity-50'}`}>Service Active</Label>
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={!controlsEnabled}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={`text-gray-300 ${!controlsEnabled && 'opacity-50'}`}>Min Price</Label>
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
                    disabled={!controlsEnabled}
                  />
                </div>
                <div>
                  <Label className={`text-gray-300 ${!controlsEnabled && 'opacity-50'}`}>Max Price</Label>
                  <Input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-[#1a1a1a] border-gray-700 text-white mt-1"
                    disabled={!controlsEnabled}
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
