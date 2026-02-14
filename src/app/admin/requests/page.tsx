'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Loader2, Mail, User, Trophy, Calendar, MoreVertical, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface ServiceRequest {
    id: string;
    name: string | null;
    email: string | null;
    sport: string;
    details: string;
    status: string;
    createdAt: string;
    user?: {
        name: string | null;
        email: string | null;
        avatar: string | null;
    };
}

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/admin/requests/services');
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Failed to fetch requests', error);
            toast.error('Failed to load requests');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/requests/services/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setRequests(requests.map(req =>
                    req.id === id ? { ...req, status: newStatus } : req
                ));
                toast.success(`Request marked as ${newStatus}`);
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Failed to update status', error);
            toast.error('Error updating status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/50';
            default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
        }
    };

    const openDetails = (request: ServiceRequest) => {
        setSelectedRequest(request);
        setIsDetailsOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Service Requests</h1>
                    <p className="text-gray-400">Manage new service requests from clients</p>
                </div>
                <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                    Total: {requests.length}
                </Badge>
            </div>

            <Card className="bg-[#1a1a1a] border-gray-800">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {requests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No service requests found.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800 hover:bg-transparent">
                                    <TableHead className="text-gray-400 text-sm">User / Contact</TableHead>
                                    <TableHead className="text-gray-400 text-sm">Description & Request Details</TableHead>
                                    <TableHead className="text-gray-400 text-sm">Status</TableHead>
                                    <TableHead className="text-gray-400 text-sm">Date & Time</TableHead>
                                    <TableHead className="text-gray-400 text-right text-sm">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.map((req) => (
                                    <TableRow
                                        key={req.id}
                                        className="border-gray-800 hover:bg-[#252525] cursor-pointer"
                                        onClick={() => openDetails(req)}
                                    >
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-white font-medium">
                                                    <User className="w-3 h-3 text-purple-400" />
                                                    {req.user?.name || req.name || 'Anonymous'}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <Mail className="w-3 h-3" />
                                                    {req.user?.email || req.email || 'N/A'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xl">
                                            <p className="text-sm text-gray-300 line-clamp-2" title={req.details}>
                                                {req.details}
                                            </p>
                                        </TableCell>
                                        <TableCell onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="outline-none">
                                                        <Badge variant="outline" className={`${getStatusColor(req.status)} border cursor-pointer hover:opacity-80`}>
                                                            {req.status}
                                                        </Badge>
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'PENDING')}>
                                                        <Clock className="w-4 h-4 mr-2" /> Pending
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'APPROVED')}>
                                                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Approve
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusUpdate(req.id, 'REJECTED')}>
                                                        <XCircle className="w-4 h-4 mr-2 text-red-500" /> Reject
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell className="text-gray-400 text-sm whitespace-nowrap">
                                            <div className="flex flex-col text-xs">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(req.createdAt), 'MMM d, yyyy')}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-gray-500 mt-0.5 ml-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(req.createdAt), 'h:mm a')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                            <button
                                                onClick={() => openDetails(req)}
                                                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                                            >
                                                <Eye className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                        <DialogDescription>Full details of the service request.</DialogDescription>
                    </DialogHeader>
                    {selectedRequest && (
                        <div className="space-y-6 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-gray-400">Client</h4>
                                    <p className="text-white flex items-center gap-2">
                                        <User className="w-4 h-4 text-purple-400" />
                                        {selectedRequest.user?.name || selectedRequest.name || 'Anonymous'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-medium text-gray-400">Contact</h4>
                                    <p className="text-white flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {selectedRequest.user?.email || selectedRequest.email || 'N/A'}
                                    </p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <h4 className="text-sm font-medium text-gray-400">Submitted On</h4>
                                    <p className="text-white flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        {format(new Date(selectedRequest.createdAt), 'PPP p')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 bg-[#252525] p-4 rounded-lg border border-gray-800">
                                <h4 className="text-sm font-medium text-gray-400">Description / Details</h4>
                                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                                    {selectedRequest.details}
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className={`px-4 py-2 rounded-md font-medium text-sm border ${getStatusColor(selectedRequest.status)}`}>
                                            current status: {selectedRequest.status}
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onClick={() => {
                                            handleStatusUpdate(selectedRequest.id, 'PENDING');
                                            setIsDetailsOpen(false);
                                        }}>
                                            Pending
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                            handleStatusUpdate(selectedRequest.id, 'APPROVED');
                                            setIsDetailsOpen(false);
                                        }}>
                                            Approve
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                            handleStatusUpdate(selectedRequest.id, 'REJECTED');
                                            setIsDetailsOpen(false);
                                        }}>
                                            Reject
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
