'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
    "#": string;
    service: string;
    provider: string;
    freelancerId?: string;
    serviceId?: string; // Optional service ID for API reference
    image: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled' | 'COMPLETED_BY_CLIENT' | 'COMPLETED_BY_FREELANCER';
    location: string;
    price: string;
    rating: number;
    completedJobs: number;
    description: string;
    category: string;
    providerPhone?: string;
    paymentMethod?: 'cod' | 'upi' | 'card' | 'wallet';
    notes?: string; // Client notes for the freelancer
    otp?: string; // 4-digit OTP for job verification
    couponCode?: string; // Coupon code applied for this booking
    services?: {
        id: string;
        title: string;
        price: string | number;
        quantity: number;
        duration?: number;
        deliveryTime?: string;
    }[];
    completedAt?: string;
    transactionId?: string;
    paymentStatus?: string;
    scheduledAt?: string; // ISO String for exact scheduling
}

interface BookingsContextType {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
    refreshBookings: () => Promise<void>;
    addBooking: (booking: Omit<Booking, "#">) => Promise<string>;
    rescheduleBooking: (id: string, newDate: string, newTime: string) => Promise<void>;
}

const BookingsContext = createContext<BookingsContextType | undefined>(undefined);

// Initial state
const initialBookings: Booking[] = [];

export function BookingsProvider({ children }: { children: ReactNode }) {
    const [bookings, setBookings] = useState<Booking[]>(initialBookings);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { user, isAuthenticated } = useAuth();

    const fetchBookings = async () => {
        if (!user) {
            console.log('⏳ BookingsContext: Waiting for user auth...');
            return;
        }

        // ✅ Guard: Prevent concurrent fetches
        if (loading) {
            console.log('⏭️ Skipping fetch - already loading bookings');
            return;
        }

        // Only show loading state if we don't have data yet
        // This prevents the flicker when refreshing data
        if (bookings.length === 0) {
            setLoading(true);
        }

        try {
            console.log('🔄 Fetching bookings for user:', user.email);
            const response = await fetch('/api/bookings');
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Bookings API Data:', data);

                const mapped: Booking[] = (data.bookings || []).map((b: any) => {
                    // Robust parsing using Date constructor with ISO string
                    // b.date is the ISO string from server (scheduledAt)
                    const dateObj = b.date ? new Date(b.date) : null;
                    const isValidDate = dateObj && !isNaN(dateObj.getTime());

                    // Manually format to YYYY-MM-DD using local time to ensure consistency across browsers
                    const formattedDate = isValidDate ? (() => {
                        const year = dateObj.getFullYear();
                        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                        const day = String(dateObj.getDate()).padStart(2, '0');
                        return `${year}-${month}-${day}`;
                    })() : '';

                    return {
                        "#": b.id, // Ensure this matches the Booking interface
                        service: b.title,
                        provider: b.freelancerName || 'Unknown',
                        providerPhone: b.freelancerPhone,
                        image: b.freelancerAvatar || '/images/default-avatar.svg',
                        // Store as YYYY-MM-DD for consistency with input fields
                        date: formattedDate,
                        // Format time to 12-hour format "h:mm AM/PM"
                        time: isValidDate ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '',
                        status: (b.status?.toLowerCase() as any) || 'pending',
                        location: b.location || 'Remote',
                        price: `₹${b.price}`,
                        rating: 0,
                        completedJobs: 0,
                        description: '',
                        category: b.category || b.serviceCategory || 'Freelancer',
                        otp: b.otp,
                        completedAt: b.completedAt ? new Date(b.completedAt).toLocaleDateString() : undefined,
                        notes: b.notes,
                        services: b.services,
                        freelancerId: b.freelancerId,
                        scheduledAt: b.scheduledAt,
                    };
                });

                // Only update state if JSON stringified data is different to avoid re-renders
                // or just set it (React handles ref equality check usually, but new array always triggers)
                // For now, simple setBookings is fine as long as we don't flicker loading
                setBookings(mapped);
            } else {
                if (response.status === 401) {
                    console.log('⚠️ 401 fetching bookings - User might be logged out or session invalid');
                    setBookings([]);
                }
                else setError('Failed to fetch bookings');
            }
        } catch (err) {
            console.error('Error fetching bookings:', err);
            setError('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    // Load bookings only when user ID changes (login/logout), not when user object reference changes
    useEffect(() => {
        if (user?.id) {
            fetchBookings();
        } else {
            setBookings([]); // Clear bookings on logout
        }
    }, [user?.id]); // ✅ Stable dependency

    const refreshBookings = fetchBookings;

    // Add a new booking
    const addBooking = async (bookingData: Omit<Booking, '#'>): Promise<string> => {
        // Note: The caller might expect synchronous return of ID. 
        // We changed signature to Promise<string> to handle API.
        // Ensure consumers await this.

        // Convert context data to API payload
        // bookingData has 'service' (title), 'provider', etc.
        // API needs 'serviceId'. 
        // PROBLEM: The current 'addBooking' in frontend works with pre-defined Booking object that might NOT have serviceId!
        // We need to pass serviceId. The `Booking` interface needs to support `serviceId`.

        // For now, assume bookingData contains `serviceId` or we can't create it meaningfully in DB.
        // Looking at `Booking` interface:
        // services?: { id, ... }[]

        // If the Caller passes `services` array (cart?), we pick the first one?
        const serviceId = bookingData.services?.[0]?.id || (bookingData as any).serviceId;

        if (!serviceId) {
            throw new Error("Service ID missing for booking");
        }

        try {
            console.log('Sending booking request with serviceId:', serviceId);
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId,
                    scheduledAt: bookingData.date ? new Date(`${bookingData.date} ${bookingData.time}`) : undefined,
                    notes: bookingData.notes,
                    otp: bookingData.otp, // Pass the client-generated OTP
                    location: bookingData.location, // Pass the location
                    services: bookingData.services,
                    couponCode: bookingData.couponCode, // Pass coupon code
                    transactionId: bookingData.transactionId,
                    paymentMethod: bookingData.paymentMethod,
                    paymentStatus: bookingData.paymentStatus,
                    // Pass other fields if API supports
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const newId = data.booking.id;
                await refreshBookings(); // Reload to get full state
                return newId;
            } else {
                const err = await response.json();
                throw new Error(err.error || 'Failed to create booking');
            }
        } catch (err) {
            console.error('Error adding booking:', err);
            throw err;
        }
    };

    // Reschedule an existing booking
    const rescheduleBooking = async (id: string, newDate: string, newTime: string) => {
        try {
            // Optimistic
            setBookings(prev => prev.map(booking => {
                if (booking['#'] === id) {
                    return {
                        ...booking,
                        date: newDate,
                        time: newTime,
                        status: 'confirmed'
                    };
                }
                return booking;
            }));

            const response = await fetch(`/api/bookings/${id}`, {
                method: 'PUT', // or PATCH
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'confirmed',
                    scheduledAt: new Date(`${newDate} ${newTime}`),
                    // We might need a specific 'reschedule' field or just update logic.
                }),
            });

            if (!response.ok) fetchBookings(); // Revert/Reload
        } catch (err) {
            console.error('Error rescheduling:', err);
            fetchBookings();
        }
    };

    const value = {
        bookings,
        loading,
        error,
        refreshBookings: fetchBookings,
        // Cast appropriately or update Interface in Step 1
        addBooking: addBooking,
        rescheduleBooking,
    };

    return (
        <BookingsContext.Provider value={value}>
            {children}
        </BookingsContext.Provider>
    );
}

export function useBookings() {
    const context = useContext(BookingsContext);
    if (context === undefined) {
        throw new Error('useBookings must be used within a BookingsProvider');
    }
    return context;
}
