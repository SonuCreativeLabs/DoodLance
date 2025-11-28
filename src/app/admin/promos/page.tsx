'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tag, Plus, Search, Filter, Copy, Edit, Trash2,
  TrendingUp, Gift, Percent, Users, DollarSign,
  Calendar, RefreshCw, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { CreatePromoModal } from '@/components/admin/CreatePromoModal';
import { mockPromoCodes } from '@/lib/mock/promo-data';

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState(mockPromoCodes);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Filter promo codes
  const filteredPromos = promoCodes.filter(promo => {
    const matchesSearch = 
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && promo.isActive) ||
      (statusFilter === 'inactive' && !promo.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPromos.length / itemsPerPage);
  const paginatedPromos = filteredPromos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleCreatePromo = (newPromo: any) => {
    setPromoCodes([newPromo, ...promoCodes]);
  };

  const togglePromoStatus = (promoId: string) => {
    setPromoCodes(promoCodes.map(p => 
      p.id === promoId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const deletePromo = (promoId: string) => {
    setPromoCodes(promoCodes.filter(p => p.id !== promoId));
  };

  // Stats
  const stats = {
    totalPromos: promoCodes.length,
    activePromos: promoCodes.filter(p => p.isActive).length,
    totalUsage: promoCodes.reduce((sum, p) => sum + p.usageCount, 0),
    totalRevenue: promoCodes.reduce((sum, p) => sum + p.stats.totalRevenue, 0),
    avgConversion: Math.round(promoCodes.reduce((sum, p) => sum + p.stats.conversionRate, 0) / promoCodes.length),
    totalSaved: promoCodes.reduce((sum, p) => sum + (p.value * p.usageCount), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Promo Codes</h1>
          <p className="text-gray-400 mt-1">Manage promotional codes and discounts</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Promo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Promos</p>
              <p className="text-2xl font-bold text-white">{stats.totalPromos}</p>
            </div>
            <Tag className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-white">{stats.activePromos}</p>
            </div>
            <Gift className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Usage</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsage}</p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-white">₹{(stats.totalRevenue / 1000).toFixed(0)}k</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Conversion</p>
              <p className="text-2xl font-bold text-white">{stats.avgConversion}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-500" />
          </div>
        </Card>
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Saved</p>
              <p className="text-2xl font-bold text-white">₹{(stats.totalSaved / 1000).toFixed(0)}k</p>
            </div>
            <Percent className="w-8 h-8 text-orange-500" />
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
                placeholder="Search promo codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#2a2a2a] border-gray-700 text-white"
              />
            </div>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-[#2a2a2a] border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="text-gray-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>

      {/* Promo Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedPromos.map((promo, index) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-[#1a1a1a] border-gray-800 p-4 hover:border-purple-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white font-mono">{promo.code}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(promo.code)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{promo.description}</p>
                </div>
                <Badge variant={promo.isActive ? 'default' : 'secondary'}>
                  {promo.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-white">
                    {promo.type === 'percentage' ? `${promo.value}%` : `₹${promo.value}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Usage:</span>
                  <span className="text-white">
                    {promo.usageCount}/{promo.usageLimit || '∞'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Valid:</span>
                  <span className="text-white text-xs">
                    {promo.validFrom} to {promo.validTo}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-gray-400">Revenue</p>
                    <p className="text-sm font-bold text-white">
                      ₹{(promo.stats.totalRevenue / 1000).toFixed(1)}k
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Avg Order</p>
                    <p className="text-sm font-bold text-white">
                      ₹{promo.stats.averageOrderValue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Conversion</p>
                    <p className="text-sm font-bold text-white">
                      {promo.stats.conversionRate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => togglePromoStatus(promo.id)}
                >
                  {promo.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deletePromo(promo.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
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
      )}

      {/* Create Promo Modal */}
      <CreatePromoModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={handleCreatePromo}
      />
    </div>
  );
}
