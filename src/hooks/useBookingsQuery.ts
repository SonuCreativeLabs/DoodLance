import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import type { Booking } from '@/contexts/BookingsContext'
import { useEffect } from 'react'

interface UseBookingsQueryReturn {
    bookings: Booking[]
    loading: boolean
    error: string | null
    refreshBookings: () => Promise<void>
    rescheduleBooking: (id: string, newDate: string, newTime: string) => Promise<void>
}

async function fetchBookings(): Promise<Booking[]> {
    console.log('🔄 [React Query] Fetching bookings from API')

    const response = await fetch('/api/bookings')

    if (!response.ok) {
        throw new Error('Failed to fetch bookings')
    }

    const data = await response.json()
    console.log('✅ [React Query] Bookings API Data:', data)

    const mapped: Booking[] = (data.bookings || []).map((b: any) => {
        const dateObj = b.date ? new Date(b.date) : null
        return {
            '#': b.id,
            service: b.title,
            provider: b.freelancerName || 'Unknown',
            image: b.freelancerAvatar || '/images/default-avatar.svg',
            date: dateObj ? dateObj.toISOString().split('T')[0] : '',
            time: b.time || (dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : ''),
            status: (b.status?.toLowerCase() as Booking['status']) || 'pending',
            location: b.location || 'Remote',
            price: `₹${b.price}`,
            rating: 0,
            completedJobs: 0,
            description: '',
            category: 'General',
            otp: b.otp,
            completedAt: b.completedAt ? new Date(b.completedAt).toLocaleDateString() : undefined,
            notes: b.notes,
            services: b.services,
            providerPhone: b.freelancerPhone,
            freelancerId: b.freelancerId,
            paymentMethod: b.paymentMethod,
        }
    })

    console.log(`✅ [React Query] Mapped ${mapped.length} bookings`)
    return mapped
}

/**
 * React Query hook for bookings - Drop-in replacement for useBookings() from BookingsContext
 * 
 * Benefits:
 * - Automatic caching (5-minute TTL)
 * - Background refetching
 * - Optimistic updates
 * - Request deduplication
 */
export function useBookingsQuery(): UseBookingsQueryReturn {
    const { authUser } = useAuth()
    const queryClient = useQueryClient()

    // 🔍 Debug: Log authUser to see if it's actually stable
    useEffect(() => {
        console.log('🔑 [React Query] authUser changed:', authUser?.id)
    }, [authUser])

    const {
        data: bookings = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['bookings', authUser?.id],
        queryFn: fetchBookings,
        enabled: !!authUser?.id, // Only fetch when user is authenticated
    })

    // 🔍 Debug: Log when query state changes
    useEffect(() => {
        console.log('📊 [React Query] Query state:', {
            hasData: bookings.length > 0,
            isLoading,
            authUserId: authUser?.id
        })
    }, [bookings.length, isLoading, authUser?.id])

    const refreshBookings = async () => {
        console.log('♻️ [React Query] Manual refresh triggered')
        await refetch()
    }

    const rescheduleBooking = async (id: string, newDate: string, newTime: string) => {
        console.log('📅 [React Query] Rescheduling booking:', id, newDate, newTime)

        try {
            const response = await fetch('/api/bookings/reschedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, date: newDate, time: newTime }),
            })

            if (!response.ok) {
                throw new Error('Failed to reschedule booking')
            }

            // Invalidate and refetch bookings after reschedule
            await queryClient.invalidateQueries({ queryKey: ['bookings', authUser?.id] })
            console.log('✅ [React Query] Booking rescheduled successfully')
        } catch (err) {
            console.error('❌ [React Query] Reschedule failed:', err)
            throw err
        }
    }

    return {
        bookings,
        loading: isLoading,
        error: error ? String(error) : null,
        refreshBookings,
        rescheduleBooking,
    }
}
