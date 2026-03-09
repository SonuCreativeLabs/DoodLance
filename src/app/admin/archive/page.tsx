'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Archive,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Database,
    History,
    Trash2,
    Calendar,
    User,
    Info
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ArchivePage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;

    const fetchArchive = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: itemsPerPage.toString(),
                type: typeFilter
            });
            const res = await fetch(`/api/admin/archive?${params}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data.items);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            console.error('Error fetching archive:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArchive();
    }, [currentPage, typeFilter]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                        <Archive className="w-8 h-8 mr-3 text-purple-500" />
                        Archive Center
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm sm:text-base">View all deleted and archived platform records</p>
                </div>
                <Button
                    variant="outline"
                    onClick={fetchArchive}
                    className="text-gray-300 w-full sm:w-auto"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <Card className="bg-[#1a1a1a] border-gray-800 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Database className="w-4 h-4" />
                        <span className="text-sm">Filter by Type:</span>
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[180px] bg-[#2a2a2a] border-gray-700 text-white">
                            <SelectValue placeholder="Resource Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-gray-800 text-white">
                            <SelectItem value="all">All Resources</SelectItem>
                            <SelectItem value="BOOKING">Bookings</SelectItem>
                            <SelectItem value="USER">Users</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-800">
                            <tr className="text-left text-gray-400 text-sm">
                                <th className="p-4 font-medium">Deleted Date</th>
                                <th className="p-4 font-medium">Resource Type</th>
                                <th className="p-4 font-medium">Original ID</th>
                                <th className="p-4 font-medium">Details</th>
                                <th className="p-4 font-medium">Deleted By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b border-gray-800">
                                        <td className="p-4"><Skeleton className="h-4 w-32 bg-gray-800" /></td>
                                        <td className="p-4"><Skeleton className="h-6 w-20 rounded-full bg-gray-800" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-24 bg-gray-800" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-48 bg-gray-800" /></td>
                                        <td className="p-4"><Skeleton className="h-4 w-20 bg-gray-800" /></td>
                                    </tr>
                                ))
                            ) : items.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center text-sm text-gray-300">
                                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                            {formatDate(item.deletedAt)}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant="outline" className="border-purple-500/50 text-purple-400 bg-purple-500/10">
                                            {item.resourceType}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <code className="text-xs text-blue-400 font-mono bg-blue-500/5 px-2 py-1 rounded">
                                            {item.resourceId}
                                        </code>
                                    </td>
                                    <td className="p-4">
                                        <div className="max-w-md truncate text-sm text-gray-400">
                                            {item.resourceType === 'BOOKING' ? (
                                                <>
                                                    Booking for <span className="text-white">{item.data.service?.title || 'Unknown Service'}</span>
                                                    <span className="block text-xs opacity-70">Client: {item.data.client?.name || 'Unknown'}</span>
                                                </>
                                            ) : (
                                                JSON.stringify(item.data).substring(0, 100) + '...'
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-white">
                                        <div className="flex items-center">
                                            <User className="w-4 h-4 mr-2 text-gray-500" />
                                            {item.deletedBy || 'System'}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                            {!loading && items.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <History className="w-12 h-12 mx-auto text-gray-700 mb-4" />
                                        <p className="text-gray-500">No archived records found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 p-4 border-t border-gray-800">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="bg-[#2a2a2a] border-gray-700 text-white"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-400">Page {currentPage} of {totalPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="bg-[#2a2a2a] border-gray-700 text-white"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </Card>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-4">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                    <h4 className="text-blue-400 font-medium mb-1">Archival Policy</h4>
                    <p className="text-sm text-blue-300/80 leading-relaxed">
                        All records deleted via the admin panel are stored here for 30 days before permanent deletion.
                        This ensures data integrity and provides a safety net for accidental deletions.
                    </p>
                </div>
            </div>
        </div>
    );
}
