'use client';

import { useState, useEffect } from 'react';
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

export default function PromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: debouncedSearch,
        status: statusFilter
      });
      const res = await fetch(`/api/admin/promos?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPromoCodes(data.promos);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching promos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearch, statusFilter]);

  const handleCreatePromo = async (newPromoData: any) => {
    try {
      // Map frontend fields to API expectations if necessary
      // Assuming modal sends: code, description, discountType, discountValue, validFrom, validTo, usageLimit
      const res = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromoData)
      });
      if (res.ok) {
        setCreateModalOpen(false);
        fetchPromos(); // Refresh list
      } else {
        console.error('Failed to create promo');
        // TODO: Toast
      }
    } catch (e) {
      console.error(e);
    }
  };

  const togglePromoStatus = async (promoId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/promos/${promoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        fetchPromos();
      }
    } catch (e) { console.error(e); }
  };

  const deletePromo = async (promoId: string) => {
    if (!confirm('Are you sure you want to delete this promo code?')) return;
    try {
      const res = await fetch(`/api/admin/promos/${promoId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchPromos();
      }
    } catch (e) { console.error(e); }
  };

  // Stats (Calculated on frontend for now based on current view/API response if available, 
  // ideally API should return this summary)
  const stats = {
    totalPromos: promoCodes.length, // Only current page? Should fetch total from API.
    activePromos: promoCodes.filter(p => p.isActive).length,
    totalUsage: promoCodes.reduce((sum, p) => sum + (p.usedCount || 0), 0),
    totalRevenue: promoCodes.reduce((sum, p) => sum + (p.stats?.totalRevenue || 0), 0),
    avgConversion: 0,
    totalSaved: 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Promo Codes</h1>
          <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage promotional codes and discounts</p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
          onClick={() => setCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Promo
        </Button>
      </div>

      {/* Stats Cards - Simplified for now */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Promos</p>
              <p className="text-2xl font-bold text-white">{stats.totalPromos}</p>
            </div>
            <Tag className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        {/* ... Other stats cards ... */}
        <Card className="bg-[#1a1a1a] border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-white">{stats.activePromos}</p>
            </div>
            <Gift className="w-8 h-8 text-green-500" />
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
        {loading ? (
          <p className="text-gray-400 p-4">Loading promos...</p>
        ) : promoCodes.map((promo, index) => (
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
                    {promo.discountType === 'PERCENTAGE' ? `${promo.discountValue}%` : `₹${promo.discountValue}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Usage:</span>
                  <span className="text-white">
                    {promo.usedCount || 0}/{promo.maxUses || '∞'}
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
                      ₹{((promo.stats?.totalRevenue || 0) / 1000).toFixed(1)}k
                    </p>
                  </div>
                  {/* ... other stats ... */}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => togglePromoStatus(promo.id, promo.isActive)}
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
        {!loading && promoCodes.length === 0 && <p className="text-gray-400 p-4">No promo codes found.</p>}
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
          <span className="text-sm text-gray-400">Page {currentPage} of {totalPages}</span>
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
