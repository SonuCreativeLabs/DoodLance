'use client';

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface User {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    username: string | null;
    avatar: string | null;
    role: string;
    area: string | null;
    city: string | null;
    freelancerTitle?: string | null;
}

interface Service {
    id: string;
    title?: string; // Made optional as it's not in the provided snippet, but likely still needed
    description: string;
    price: number | string;
    duration: number;
    serviceType: string; // Retained from original, not in snippet but likely needed
    sport?: string;
    deliveryTime?: string;
}

export default function ConnectUsersPage() {
    const { admin } = useAdminAuth();

    // Search States
    const [clientSearch, setClientSearch] = useState('');
    const [clientResults, setClientResults] = useState<User[]>([]);
    const [isSearchingClient, setIsSearchingClient] = useState(false);
    const [selectedClient, setSelectedClient] = useState<User | null>(null);

    const [freelancerSearch, setFreelancerSearch] = useState('');
    const [freelancerResults, setFreelancerResults] = useState<User[]>([]);
    const [isSearchingFreelancer, setIsSearchingFreelancer] = useState(false);
    const [selectedFreelancer, setSelectedFreelancer] = useState<User | null>(null);

    // Service States
    const [services, setServices] = useState<Service[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState('');

    // Custom Package States
    const [categories, setCategories] = useState<any[]>([]);
    const [customSport, setCustomSport] = useState('');
    const [customCategoryId, setCustomCategoryId] = useState('');

    // Form States
    const [scheduledAt, setScheduledAt] = useState('');
    const [duration, setDuration] = useState('');
    const [totalPrice, setTotalPrice] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('PENDING');
    const [bookingStatus, setBookingStatus] = useState('PENDING');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // --- Handlers for User Search ---
    const handleClientSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setClientSearch(val);
        if (val.length < 3) {
            setClientResults([]);
            return;
        }
        setIsSearchingClient(true);
        try {
            const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(val)}&role=client`);
            const data = await res.json();
            if (res.ok) setClientResults(data);
        } catch (error) {
            console.error('Failed to search clients:', error);
        } finally {
            setIsSearchingClient(false);
        }
    };

    const handleFreelancerSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setFreelancerSearch(val);
        if (val.length < 3) {
            setFreelancerResults([]);
            return;
        }
        setIsSearchingFreelancer(true);
        try {
            const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(val)}&role=freelancer`);
            const data = await res.json();
            if (res.ok) setFreelancerResults(data);
        } catch (error) {
            console.error('Failed to search freelancers:', error);
        } finally {
            setIsSearchingFreelancer(false);
        }
    };

    // --- Fetch Services when a Freelancer is Selected ---
    useEffect(() => {
        const fetchServices = async () => {
            if (!selectedFreelancer) {
                setServices([]);
                setSelectedServiceId('');
                return;
            }
            setIsLoadingServices(true);
            try {
                const res = await fetch(`/api/admin/services/search?providerId=${selectedFreelancer.id}`);
                const data = await res.json();
                if (res.ok) {
                    setServices(data);
                    setSelectedServiceId('');
                } else {
                    toast.error(data.error || 'Failed to load services');
                }
            } catch (error) {
                console.error('Error loading services:', error);
                toast.error('Failed to load services');
            } finally {
                setIsLoadingServices(false);
            }
        };
        fetchServices();
    }, [selectedFreelancer]);

    // Autofil duration and price when a service is selected
    useEffect(() => {
        if (selectedServiceId) {
            if (selectedServiceId === 'custom') {
                setDuration('');
                setTotalPrice('');
                return;
            }
            const svc = services.find(s => s.id === selectedServiceId);
            if (svc) {
                const parsedDuration = parseInt(String(svc.deliveryTime || svc.duration).replace(/[^0-9]/g, ''), 10);
                setDuration(isNaN(parsedDuration) ? '60' : parsedDuration.toString());
                setTotalPrice(svc.price.toString());
            }
        }
    }, [selectedServiceId, services]);

    // Computed Service logic
    const filteredServices = services;

    // --- Form Submission ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient || !selectedFreelancer || !selectedServiceId || !scheduledAt || !duration || !totalPrice) {
            toast.error('Please fill out all required fields.');
            return;
        }

        if (selectedServiceId === 'custom' && (!customSport || !customCategoryId)) {
            toast.error('Please provide both Sport and Service Category for a custom package.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                clientId: selectedClient.id,
                freelancerId: selectedFreelancer.id,
                serviceId: selectedServiceId,
                customSport,
                customCategoryId,
                scheduledAt,
                duration: parseInt(duration),
                totalPrice: parseFloat(totalPrice),
                status: bookingStatus,
                paymentStatus,
                paymentMethod: paymentMode || null,
                location: location || null,
                notes: notes || null,
            };

            const res = await fetch('/api/admin/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to connect users');

            toast.success('Successfully connected client and freelancer!');
            // Reset form
            setSelectedClient(null);
            setClientSearch('');
            setSelectedFreelancer(null);
            setFreelancerSearch('');
            setSelectedServiceId('');
            setCustomSport('');
            setCustomCategoryId('');
            setScheduledAt('');
            setDuration('');
            setTotalPrice('');
            setPaymentMode('');
            setLocation('');
            setNotes('');
            setBookingStatus('PENDING');
            setPaymentStatus('PENDING');

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'An error occurred while connecting users.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Connect Users</h1>
                    <p className="text-gray-400">Manually link a client to a freelancer's service and create a booking.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Column - User Selection */}
                <div className="space-y-6">
                    {/* Client Selection */}
                    <Card className="bg-[#1a1a1a] border-gray-800 relative z-30 overflow-visible">
                        <CardHeader>
                            <CardTitle className="text-purple-400">1. Select Client</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedClient ? (
                                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={selectedClient.avatar || '/placeholder-user.jpg'}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full object-cover bg-gray-800"
                                        />
                                        <div>
                                            <p className="text-white font-medium flex items-center gap-2">
                                                {selectedClient.name || selectedClient.username}
                                                <span className="text-[10px] uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                                                    {selectedClient.freelancerTitle || selectedClient.role}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-400">{selectedClient.email} • {selectedClient.phone || 'No phone'}</p>
                                            {(selectedClient.area || selectedClient.city) && (
                                                <p className="text-xs text-gray-500 mt-0.5">📍 {[selectedClient.area, selectedClient.city].filter(Boolean).join(', ')}</p>
                                            )}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedClient(null)} className="text-red-400 hover:text-red-300">
                                        Change
                                    </Button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {isSearchingClient ? <Loader2 className="h-4 w-4 text-gray-400 animate-spin" /> : <Search className="h-4 w-4 text-gray-400" />}
                                    </div>
                                    <Input
                                        placeholder="Search client by name, email, or phone (min 3 chars)..."
                                        value={clientSearch}
                                        onChange={handleClientSearch}
                                        className="pl-10 bg-[#2a2a2a] border-gray-700 text-white"
                                    />
                                    {clientResults.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                                            {clientResults.map(user => (
                                                <div
                                                    key={user.id}
                                                    className="px-4 py-3 hover:bg-purple-600/20 cursor-pointer text-white flex items-center gap-3 border-b border-gray-800 last:border-0"
                                                    onClick={() => {
                                                        setSelectedClient(user);
                                                        setClientResults([]);
                                                        setClientSearch('');
                                                    }}
                                                >
                                                    <img
                                                        src={user.avatar || '/placeholder-user.jpg'}
                                                        alt="avatar"
                                                        className="w-10 h-10 rounded-full object-cover bg-gray-700"
                                                    />
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {user.name || user.username}
                                                            <span className="text-[10px] uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                                                                {user.freelancerTitle || user.role}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-0.5">{user.email} • {user.phone}</div>
                                                        {(user.area || user.city) && (
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                📍 {[user.area, user.city].filter(Boolean).join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Freelancer Selection */}
                    <Card className="bg-[#1a1a1a] border-gray-800 relative z-20 overflow-visible">
                        <CardHeader>
                            <CardTitle className="text-purple-400">2. Select Freelancer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {selectedFreelancer ? (
                                <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={selectedFreelancer.avatar || '/placeholder-user.jpg'}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full object-cover bg-gray-800"
                                        />
                                        <div>
                                            <p className="text-white font-medium flex items-center gap-2">
                                                {selectedFreelancer.name || selectedFreelancer.username}
                                                <span className="text-[10px] uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                                                    {selectedFreelancer.freelancerTitle || selectedFreelancer.role}
                                                </span>
                                            </p>
                                            <p className="text-sm text-gray-400">{selectedFreelancer.email} • {selectedFreelancer.phone || 'No phone'}</p>
                                            {(selectedFreelancer.area || selectedFreelancer.city) && (
                                                <p className="text-xs text-gray-500 mt-0.5">📍 {[selectedFreelancer.area, selectedFreelancer.city].filter(Boolean).join(', ')}</p>
                                            )}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedFreelancer(null)} className="text-red-400 hover:text-red-300">
                                        Change
                                    </Button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        {isSearchingFreelancer ? <Loader2 className="h-4 w-4 text-gray-400 animate-spin" /> : <Search className="h-4 w-4 text-gray-400" />}
                                    </div>
                                    <Input
                                        placeholder="Search freelancer by name, email, or phone..."
                                        value={freelancerSearch}
                                        onChange={handleFreelancerSearch}
                                        className="pl-10 bg-[#2a2a2a] border-gray-700 text-white"
                                    />
                                    {freelancerResults.length > 0 && (
                                        <div className="absolute z-50 w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                                            {freelancerResults.map(user => (
                                                <div
                                                    key={user.id}
                                                    className="px-4 py-3 hover:bg-purple-600/20 cursor-pointer text-white flex items-center gap-3 border-b border-gray-800 last:border-0"
                                                    onClick={() => {
                                                        setSelectedFreelancer(user);
                                                        setFreelancerResults([]);
                                                        setFreelancerSearch('');
                                                    }}
                                                >
                                                    <img
                                                        src={user.avatar || '/placeholder-user.jpg'}
                                                        alt="avatar"
                                                        className="w-10 h-10 rounded-full object-cover bg-gray-700"
                                                    />
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {user.name || user.username}
                                                            <span className="text-[10px] uppercase tracking-wider bg-gray-800 px-2 py-0.5 rounded text-gray-400">
                                                                {user.freelancerTitle || user.role}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-400 mt-0.5">{user.email} • {user.phone}</div>
                                                        {(user.area || user.city) && (
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                📍 {[user.area, user.city].filter(Boolean).join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Service Packages Selection */}
                    <Card className="bg-[#1a1a1a] border-gray-800 relative z-10 overflow-visible">
                        <CardHeader>
                            <CardTitle className="text-purple-400">3. Select Service Package</CardTitle>
                            <CardDescription>Select an existing service package or create a custom one.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Service Packages */}
                            <div>
                                {!selectedFreelancer ? (
                                    <p className="text-sm text-gray-400 italic bg-[#2a2a2a] p-4 rounded-md border border-gray-700 border-dashed">Please select a freelancer first to view their packages.</p>
                                ) : isLoadingServices ? (
                                    <div className="flex justify-center p-8 bg-[#2a2a2a] rounded-md border border-gray-700"><Loader2 className="w-6 h-6 animate-spin text-purple-400" /></div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {filteredServices.map((svc) => (
                                            <div
                                                key={svc.id}
                                                onClick={() => setSelectedServiceId(svc.id)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedServiceId === svc.id
                                                    ? 'bg-purple-900/40 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                                    : 'bg-[#2a2a2a] border-gray-700 hover:border-gray-500'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-white line-clamp-2 pr-2">{svc.title}</h4>
                                                    {selectedServiceId === svc.id && <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />}
                                                </div>
                                                <div className="text-sm text-gray-400 space-y-1">
                                                    <p className="flex justify-between"><span>Duration:</span> <span>{svc.deliveryTime || `${svc.duration} mins`}</span></p>
                                                    <p className="flex justify-between"><span>Price:</span> <span>{svc.price}</span></p>
                                                </div>
                                                {svc.sport && (
                                                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                                                        <span className="text-[10px] uppercase tracking-wider bg-gray-800 px-2 py-1 rounded text-gray-400 font-medium">{svc.sport}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Custom Package Card */}
                                        <div
                                            onClick={() => setSelectedServiceId('custom')}
                                            className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-center items-center min-h-[150px] ${selectedServiceId === 'custom'
                                                ? 'bg-green-900/20 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                                                : 'bg-[#2a2a2a] border-gray-700 hover:border-dashed hover:border-gray-400 border-dashed'
                                                }`}
                                        >
                                            <div className={`p-3 rounded-full mb-3 ${selectedServiceId === 'custom' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
                                                {selectedServiceId === 'custom' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                                            </div>
                                            <h4 className={`font-medium ${selectedServiceId === 'custom' ? 'text-green-400' : 'text-gray-300'}`}>Custom Package</h4>
                                            <p className="text-xs text-gray-500 mt-1 text-center">Set duration and price below</p>
                                            {/* Custom Package Form Expansion */}
                                            {selectedServiceId === 'custom' && (
                                                <div className="col-span-1 sm:col-span-2 mt-2 p-4 border border-green-500/30 bg-green-900/10 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                                                    <h4 className="text-green-400 font-medium">Custom Package Details</h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-gray-300 mb-2 block">Sport</Label>
                                                            <Input
                                                                placeholder="e.g. Cricket, Yoga"
                                                                value={customSport}
                                                                onChange={(e) => setCustomSport(e.target.value)}
                                                                className="bg-[#2a2a2a] border-gray-700 text-white"
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label className="text-gray-300 mb-2 block">Service Category</Label>
                                                            <Select value={customCategoryId} onValueChange={setCustomCategoryId}>
                                                                <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                                                                    <SelectValue placeholder="Select Category" />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white max-h-48 overflow-y-auto">
                                                                    {categories.map((c: any) => (
                                                                        <SelectItem key={c.id} value={c.id} className="text-white hover:bg-purple-600/20">{c.name}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Booking Details */}
                <div className="space-y-6">
                    <Card className="bg-[#1a1a1a] border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-purple-400">4. Booking Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div>
                                <Label className="text-gray-300">Scheduled Date & Time (Required)</Label>
                                <Input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={(e) => setScheduledAt(e.target.value)}
                                    className="bg-[#2a2a2a] border-gray-700 text-white"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-300">Duration (mins)</Label>
                                    <Input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="bg-[#2a2a2a] border-gray-700 text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label className="text-gray-300">Total Price (₹)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={totalPrice}
                                        onChange={(e) => setTotalPrice(e.target.value)}
                                        className="bg-[#2a2a2a] border-gray-700 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="text-gray-300">Location / Address (Optional)</Label>
                                <Input
                                    placeholder="E.g., Chennai Cricket Ground"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="bg-[#2a2a2a] border-gray-700 text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-gray-300">Booking Status</Label>
                                    <Select value={bookingStatus} onValueChange={setBookingStatus}>
                                        <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                                            <SelectItem value="PENDING">PENDING</SelectItem>
                                            <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
                                            <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                                            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label className="text-gray-300">Payment Status</Label>
                                    <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                        <SelectTrigger className="bg-[#2a2a2a] border-gray-700 text-white">
                                            <SelectValue placeholder="Payment" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#2a2a2a] border-gray-700 text-white">
                                            <SelectItem value="PENDING">PENDING</SelectItem>
                                            <SelectItem value="VERIFIED">VERIFIED</SelectItem>
                                            <SelectItem value="FAILED">FAILED</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {paymentStatus === 'VERIFIED' && (
                                <div>
                                    <Label className="text-gray-300">Payment Mode (e.g., UPI, Cash, Bank Transfer)</Label>
                                    <Input
                                        placeholder="Payment method used"
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        className="bg-[#2a2a2a] border-gray-700 text-white"
                                    />
                                </div>
                            )}

                            <div>
                                <Label className="text-gray-300">Admin Notes (Optional)</Label>
                                <Textarea
                                    placeholder="Internal notes about this manual connection..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="bg-[#2a2a2a] border-gray-700 text-white min-h-[100px]"
                                />
                            </div>

                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white h-12 text-lg font-medium"
                        disabled={isSubmitting || !selectedClient || !selectedFreelancer || !selectedServiceId}
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Creating Connection...</>
                        ) : (
                            <><LinkIcon className="w-5 h-5 mr-2" /> Connect Users & Create Booking</>
                        )}
                    </Button>

                </div>
            </form>
        </div>
    );
}
