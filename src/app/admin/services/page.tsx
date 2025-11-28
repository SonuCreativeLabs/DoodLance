'use client';

import { useState } from 'react';
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
import { mockServices } from '@/lib/mock/services-data';
import { ServiceDetailsModal } from '@/components/admin/ServiceDetailsModal';

export default function ServiceManagementPage() {
  const [services, setServices] = useState(mockServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedService, setSelectedService] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    category: 'Net Bowler',
    price: '',
    duration: '60',
    location: '',
    providerName: '',
  });
  const itemsPerPage = 10;

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    const matchesActive = activeFilter === 'all' || 
                         (activeFilter === 'active' && service.isActive) ||
                         (activeFilter === 'inactive' && !service.isActive);
    
    return matchesSearch && matchesCategory && matchesStatus && matchesActive;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = (serviceId: string) => {
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, status: 'approved', isActive: true } : s
    ));
  };

  const handleReject = (serviceId: string) => {
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, status: 'rejected', isActive: false } : s
    ));
  };

  const toggleActive = (serviceId: string) => {
    setServices(services.map(s => 
      s.id === serviceId ? { ...s, isActive: !s.isActive } : s
    ));
  };

  // Stats
  const stats = {
    totalServices: services.length,
    activeServices: services.filter(s => s.isActive).length,
    pendingApproval: services.filter(s => s.status === 'pending').length,
    totalRevenue: services.reduce((sum, s) => sum + (s.price * s.totalOrders), 0),
    avgRating: (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1),
    totalOrders: services.reduce((sum, s) => sum + s.totalOrders, 0),
  };

  // Get unique categories
  const categories = Array.from(new Set(services.map(s => s.category)));

  const statusColors: Record<string, string> = {
    approved: 'bg-green-500',
    pending: 'bg-yellow-500',
    'under-review': 'bg-blue-500',
    rejected: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Service Management</h1>
          <p className="text-gray-400 mt-1">Manage and approve freelancer services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-gray-300">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => setShowAddService(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
              <p className="text-2xl font-bold text-white">₹{(stats.totalRevenue / 1000).toFixed(0)}k</p>
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
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

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
              setStatusFilter('all');
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
                <th className="p-4 text-sm font-medium text-gray-400">Location</th>
                <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.map((service, index) => (
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
                      <p className="text-xs text-gray-400">ID: {service.id}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-white text-sm">{service.providerName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-xs text-gray-400">{service.providerRating}</span>
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
                    {service.packages && (
                      <p className="text-xs text-gray-400">{service.packages.length} packages</p>
                    )}
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
                        <span className="text-sm text-white">{service.rating}</span>
                        <span className="text-xs text-gray-400">({service.reviewCount})</span>
                      </div>
                      <p className="text-xs text-gray-400">{service.totalOrders} orders</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-white">{service.location}</span>
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
                        <DropdownMenuItem className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Service
                        </DropdownMenuItem>
                        {service.status === 'pending' && (
                          <>
                            <DropdownMenuItem 
                              className="cursor-pointer text-green-400"
                              onClick={() => handleApprove(service.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-400"
                              onClick={() => handleReject(service.id)}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        {service.status === 'approved' && (
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => toggleActive(service.id)}
                          >
                            {service.isActive ? (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-400">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Flag Service
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} services
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="text-gray-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'bg-purple-600' : 'text-gray-300'}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="text-gray-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
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

      {/* Add Service Dialog */}
      <Dialog open={showAddService} onOpenChange={setShowAddService}>
        <DialogContent className="bg-[#1a1a1a] border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Service</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add a new service to the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label className="text-gray-300">Service Title</Label>
              <Input
                value={newService.title}
                onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                placeholder="Enter service title"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Provider Name</Label>
              <Input
                value={newService.providerName}
                onChange={(e) => setNewService({ ...newService, providerName: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                placeholder="Enter provider name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Category</Label>
                <Select value={newService.category} onValueChange={(value) => setNewService({ ...newService, category: value })}>
                  <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net Bowler">Net Bowler</SelectItem>
                    <SelectItem value="Coach">Coach</SelectItem>
                    <SelectItem value="Match Player">Match Player</SelectItem>
                    <SelectItem value="Physio">Physio</SelectItem>
                    <SelectItem value="Analyst">Analyst</SelectItem>
                    <SelectItem value="Cricket Photo/Videography">Cricket Photo/Videography</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-gray-300">Price (₹)</Label>
                <Input
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                  placeholder="Enter price"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Duration (minutes)</Label>
                <Input
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                  placeholder="60"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Location</Label>
                <Input
                  value={newService.location}
                  onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                  className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                  placeholder="Enter location"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="bg-[#2a2a2a] border-gray-700 text-white mt-1"
                placeholder="Enter service description"
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAddService(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                const serviceId = `SRV${String(services.length + 1).padStart(3, '0')}`;
                const service = {
                  id: serviceId,
                  ...newService,
                  price: parseFloat(newService.price),
                  duration: parseInt(newService.duration),
                  status: 'pending',
                  isActive: false,
                  rating: 0,
                  totalOrders: 0,
                  completionRate: 0,
                  responseTime: '0 mins',
                  providerId: `PRV${Math.floor(Math.random() * 100)}`,
                  tags: [newService.category],
                  images: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };
                setServices([service, ...services]);
                setShowAddService(false);
                setNewService({
                  title: '',
                  description: '',
                  category: 'Net Bowler',
                  price: '',
                  duration: '60',
                  location: '',
                  providerName: '',
                });
              }}
            >
              Add Service
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
