"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBookings } from "@/contexts/BookingsContext";
import { RescheduleModal } from "@/components/client/bookings/RescheduleModal";

// Types for history job data
interface HistoryJobData {
    "#": string;
    title: string;
    freelancer: {
        name: string;
        image: string;
        rating: number;
        completedJobs?: number;
    };
    earnedMoney: string;
    location?: string;
    description?: string;
    category?: string;
}

interface UseBookAgainReturn {
    showBookAgain: boolean;
    setShowBookAgain: (show: boolean) => void;
    BookAgainModal: React.FC;
}

/**
 * Hook for Book Again functionality
 * Consolidates the Book Again modal logic for reuse in HistoryCard and History detail page
 */
export function useBookAgain(historyJob: HistoryJobData | null, options?: { useReplace?: boolean }): UseBookAgainReturn {
    const router = useRouter();
    const { addBooking } = useBookings();
    const [showBookAgain, setShowBookAgain] = useState(false);

    // Create the temporary booking object for the modal
    const tempBooking = historyJob ? {
        "#": historyJob["#"],
        service: historyJob.title,
        provider: historyJob.freelancer.name,
        image: historyJob.freelancer.image,
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM',
        status: 'confirmed' as const,
        location: historyJob.location || '',
        price: historyJob.earnedMoney,
        rating: historyJob.freelancer.rating,
        completedJobs: historyJob.freelancer.completedJobs || 50,
        description: historyJob.description || historyJob.title,
        category: historyJob.category || 'service',
    } : null;

    // Handle the book again action
    const handleBookAgain = async (_id: string, date: string, time: string, bookingLocation?: string) => {
        if (!historyJob) return;

        try {
            const newBookingId = await addBooking({
                service: historyJob.title,
                provider: historyJob.freelancer.name,
                image: historyJob.freelancer.image,
                date: date,
                time: time,
                status: 'confirmed',
                location: bookingLocation || historyJob.location || '',
                price: historyJob.earnedMoney,
                rating: historyJob.freelancer.rating,
                completedJobs: historyJob.freelancer.completedJobs || 50,
                description: historyJob.description || historyJob.title,
                category: historyJob.category || 'service',
            });

            setShowBookAgain(false);

            // Navigate to the new booking
            const bookingUrl = `/client/bookings/${encodeURIComponent(newBookingId)}`;
            if (options?.useReplace) {
                router.replace(bookingUrl);
            } else {
                router.push(bookingUrl);
            }
        } catch (error) {
            console.error('Failed to create new booking:', error);
        }
    };

    // The modal component
    const BookAgainModal: React.FC = () => {
        if (!historyJob || !tempBooking) return null;

        return (
            <RescheduleModal
                isOpen={showBookAgain}
                onClose={() => setShowBookAgain(false)}
                booking={tempBooking}
                onReschedule={handleBookAgain}
                mode="book_again"
            />
        );
    };

    return {
        showBookAgain,
        setShowBookAgain,
        BookAgainModal,
    };
}
