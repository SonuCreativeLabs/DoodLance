'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Package, Plus, Search, Filter, MoreVertical, Eye, Edit,
  CheckCircle, XCircle, AlertCircle, TrendingUp, Star,
  MapPin, Clock, DollarSign, Tag, Download, RefreshCw,
  ChevronLeft, ChevronRight, Image, BarChart, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ServiceDetailsModal } from '@/components/admin/ServiceDetailsModal';

interface EditServiceModalProps {
  service: any;
  open: boolean;
  onClose: () => void;
  onSave: (serviceId: string, data: any) => Promise<void>;
  categories: any[];
}

function EditServiceModal({ service, open, onClose, onSave, categories }: EditServiceModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    categoryId: '',
    description: '',
    deliveryTime: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        price: service.price ? service.price.toString() : '',
        categoryId: service.categoryId || '',
        description: service.description || '',
        deliveryTime: service.deliveryTime || ''
      });
    }
  }, [service]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(service.id, {
        ...formData,
        price: parseFloat(formData.price) || 0
      });
      onClose();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-[#1a1a1a] border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Service</DialogTitle>
          <DialogDescription className="text-gray-400">
            Update service details for {service.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Price (₹)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Delivery Time</Label>
              <Input
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white"
                placeholder="e.g. 3 days"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Category</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
            >
              <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#2a2a2a] border-gray-700 text-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ServiceManagementPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddService, setShowAddService] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<any>(null);
  const itemsPerPage = 10;

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Stats state
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    pendingApproval: 0,
    totalRevenue: 0,
    avgRating: '0.0',
    totalOrders: 0,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: debouncedSearch,
        category: categoryFilter,
        active: activeFilter
      });
      const res = await fetch(`/api/admin/services?${params}`);
      if (res.ok) {
        const data = await res.json();
        setServices(data.services);
        setTotalPages(data.totalPages);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      // Assuming a public categories endpoint exists, if not we might need /api/admin/categories
      // Checking existing codebase, usually /api/categories is used for dropdowns.
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, categoryFilter, activeFilter]);

  const handleApprove = async (serviceId: string) => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      });
      if (res.ok) fetchServices();
    } catch (e) { console.error(e); }
  };

  const handleReject = async (serviceId: string) => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' })
      });
      if (res.ok) fetchServices();
    } catch (e) { console.error(e); }
  };

  const toggleActive = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.isActive })
      });
      if (res.ok) fetchServices();
    } catch (e) { console.error(e); }
  };

  const handleUpdateService = async (serviceId: string, data: any) => {
    try {
      const res = await fetch(`/api/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) fetchServices();
    } catch (e) { console.error(e); }
  };

  const statusColors: Record<string, string> = {
    approved: 'bg-green-500',
    pending: 'bg-yellow-500',
    'under-review': 'bg-blue-500',
    rejected: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Service Management</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage and approve freelancer services</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="text-gray-300 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Services</p>
              <p className="text-2xl font-bold text-white">{stats.totalServices}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-white">{stats.activeServices}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pendingApproval}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Avg Rating</p>
              <p className="text-2xl font-bold text-white">{stats.avgRating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-gray-800 p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2a2a2a] border-gray-700 text-white"
              />
            </div>
          </div>

          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setActiveFilter('all');
            }}
            className="text-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Services Table */}
      <Card className="bg-[#1a1a1a] border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr className="text-left">
                <th className="p-4 text-sm font-medium text-gray-400">Service</th>
                <th className="p-4 text-sm font-medium text-gray-400">Provider</th>
                <th className="p-4 text-sm font-medium text-gray-400">Category</th>
                <th className="p-4 text-sm font-medium text-gray-400">Price</th>
                <th className="p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="p-4 text-sm font-medium text-gray-400">Performance</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-4 text-center text-gray-400">Loading...</td></tr>
              ) : services.map((service, index) => (
                <motion.tr
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium line-clamp-1">{service.title}</p>
                      <p className="text-xs text-gray-400">ID: {service.id.substring(0, 8)}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-white text-sm">{service.providerName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-400">{service.providerRating.toFixed(1)}</span>
                          {service.providerVerified && (
                            <Shield className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{service.category}</Badge>
                  </td>
                  <td className="p-4">
                    <p className="text-white">₹{service.price}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <Badge className={`${statusColors[service.status]} text-white w-fit`}>
                        {service.status}
                      </Badge>
                      <Badge variant={service.isActive ? 'outline' : 'secondary'} className="w-fit">
                        {service.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-sm text-white">{service.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({service.reviewCount})</span>
                      </div>
                      <p className="text-xs text-gray-400">{service.totalOrders} orders</p>
                    </div>
                  </td>

                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-gray-800">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedService(service);
                            setDetailsModalOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setServiceToEdit(service);
                            setEditModalOpen(true);
                          }}
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Service
                        </DropdownMenuItem>
                        {!service.isActive && (
                          <DropdownMenuItem
                            className="cursor-pointer text-green-400"
                            onClick={() => handleApprove(service.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {service.isActive && (
                          <DropdownMenuItem
                            className="cursor-pointer text-red-400"
                            onClick={() => handleReject(service.id)}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Deactivate
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
              {!loading && services.length === 0 && (
                <tr><td colSpan={8} className="p-4 text-center text-gray-400">No services found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 p-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Service Details Modal */}
      <ServiceDetailsModal
        service={selectedService}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedService(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      <EditServiceModal
        service={serviceToEdit}
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setServiceToEdit(null);
        }}
        onSave={handleUpdateService}
        categories={categories}
      />
    </div>
  );
}
