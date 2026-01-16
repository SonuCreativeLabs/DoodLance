"use client"

import { useState, useEffect } from "react"
import { format, isValid } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Booking } from "@/contexts/BookingsContext"
import { Calendar as CalendarIcon, Clock, Check, MapPin, IndianRupee } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "./CustomCalendar"
import { DayAvailability } from "@/contexts/AvailabilityContext"

interface RescheduleModalProps {
    isOpen: boolean
    onClose: () => void
    booking: Booking | null
    onReschedule: (id: string, newDate: string, newTime: string, location?: string) => Promise<void>
    mode?: 'reschedule' | 'book_again'
}

// Generate all 24-hour time slots
const generateTimeSlots = (): string[] => {
    const slots: string[] = []
    for (let hour = 0; hour < 24; hour++) {
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        const period = hour < 12 ? 'AM' : 'PM'
        slots.push(`${displayHour}:00 ${period}`)
    }
    return slots
}

const TIME_SLOTS = generateTimeSlots()

export function RescheduleModal({ isOpen, onClose, booking, onReschedule, mode = 'reschedule' }: RescheduleModalProps) {
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [location, setLocation] = useState<string>("")

    // Fetch availability for the specific freelancer
    const [availabilityDays, setAvailabilityDays] = useState<DayAvailability[]>([])
    const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)

    // Reset state when modal opens/closes or booking changes
    useEffect(() => {
        if (isOpen && booking) {
            // Parse booking date string "YYYY-MM-DD" to Date object
            const [year, month, day] = booking.date.split('-').map(Number)
            setDate(new Date(year, month - 1, day))
            setSelectedTime(booking.time)
            setIsSuccess(false)
            setLocation(booking.location || "")

            // Fetch availability
            const fetchAvailability = async () => {
                if (!booking.freelancerId) return;
                setIsLoadingAvailability(true);
                try {
                    const res = await fetch(`/api/freelancer/availability?userId=${booking.freelancerId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setAvailabilityDays(data.availability || []);
                    }
                } catch (error) {
                    console.error("Failed to fetch freelancer availability", error);
                } finally {
                    setIsLoadingAvailability(false);
                }
            };
            fetchAvailability();
        }
    }, [isOpen, booking])

    const handleConfirm = async () => {
        if (!booking || !date || !selectedTime) return

        setIsSubmitting(true)
        try {
            // Format date to YYYY-MM-DD
            const formattedDate = format(date, "yyyy-MM-dd")
            await onReschedule(booking["#"], formattedDate, selectedTime, mode === 'book_again' ? location : undefined)
            setIsSuccess(true)

            // Close after a short delay to show success state
            setTimeout(() => {
                onClose()
                setIsSuccess(false)
            }, 1500)
        } catch (error) {
            console.error("Failed to reschedule:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Function to check if a date should be disabled
    const isDateDisabled = (date: Date) => {
        // Disable past dates
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (date < today) return true

        // If availability is loading or empty, default to disabled or let's say enabled? 
        // Safer to disable until loaded, or if empty array (not set), maybe default to available?
        // Let's assume unavailable if no data found to prompt setup, OR available if we want to be permissive.
        // Given user requirement "show only the dates... set by freelancer", we should be strict.
        if (availabilityDays.length === 0 && !isLoadingAvailability) return false; // Fallback if no availability set? Or true? Let's strictly follow requirement: "dates... set by freelancer". If not set, maybe unavailable. But better UX might be available. Let's return true (disabled) if we strictly follow "only dates set". But if they haven't set any, they might be fully blocked. Let's check `available` flag.

        // Check if freelancer works on this day of week
        const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const dayName = dayNames[dayOfWeek]

        const dayAvailability = availabilityDays.find(d => d.id === dayName)
        // If day not found in availability config, assume unavailable
        return !dayAvailability?.available
    }

    // Function to check if a time slot is available
    const isTimeSlotAvailable = (timeSlot: string): boolean => {
        if (!date) return false

        // Get day of week
        const dayOfWeek = date.getDay()
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        const dayName = dayNames[dayOfWeek]

        const dayAvailability = availabilityDays.find(d => d.id === dayName)
        if (!dayAvailability?.available) return false

        // Convert time slot to 24-hour format for comparison
        const [time, period] = timeSlot.split(' ')
        const [hourStr] = time.split(':')
        let hour = parseInt(hourStr)
        if (period === 'PM' && hour !== 12) hour += 12
        if (period === 'AM' && hour === 12) hour = 0

        // Check if this hour falls within any of the day's time slots
        return dayAvailability.timeSlots.some(slot => {
            const [startHour] = slot.start.split(':').map(Number)
            const [endHour] = slot.end.split(':').map(Number)
            return hour >= startHour && hour < endHour
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="w-[95vw] max-w-md max-h-[90vh] flex flex-col bg-[#1E1E1E] border-white/10 text-white p-0 gap-0 rounded-2xl [&>button]:text-white [&>button]:hover:text-white/80 [&>button]:top-5 [&>button]:right-5 [&>button]:z-50 [&>button]:pointer-events-auto">
                <DialogHeader className="p-5 pb-0 relative z-10">
                    <DialogTitle className="text-lg font-bold text-white mb-1">
                        {mode === 'book_again' ? 'Book Again' : 'Reschedule Session'}
                    </DialogTitle>
                    <DialogDescription className="text-white/60 text-sm">
                        {mode === 'book_again'
                            ? 'Select a date and time for your new session'
                            : 'Select a new date and time for your appointment'
                        }
                    </DialogDescription>
                </DialogHeader>

                {/* Booking Info */}
                {booking && (
                    <div className="mx-5 mt-4 mb-2 p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-purple-400 font-semibold text-sm">
                                    {booking.provider.charAt(0)}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-white leading-none mb-1 truncate">{booking.provider}</h3>
                                <p className="text-sm text-white/60 leading-none truncate">{booking.service}</p>
                                {mode === 'reschedule' && booking.date && (
                                    (() => {
                                        const [year, month, day] = booking.date.split('-').map(Number);
                                        const bookingDate = new Date(year, month - 1, day);
                                        return isValid(bookingDate) ? (
                                            <div className="flex items-center gap-2 mt-1 text-xs text-purple-300">
                                                <Clock className="w-3 h-3" />
                                                <span>Current: {format(bookingDate, "MMM d, yyyy")} • {booking.time}</span>
                                            </div>
                                        ) : null;
                                    })()
                                )}
                                {mode === 'book_again' && booking.price && (
                                    <div className="flex items-center gap-2 mt-1 text-xs text-green-400">
                                        <span>Price: {booking.price}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-5 pt-2 space-y-5">
                    {/* Date Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                            <CalendarIcon className="w-4 h-4 text-purple-400" />
                            <span>Select Date</span>
                        </div>
                        <div className="border border-white/10 rounded-xl p-3 bg-white/5">
                            <CustomCalendar
                                selected={date}
                                onSelect={setDate}
                                disabledDates={isDateDisabled}
                            />
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>Select Time</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {isLoadingAvailability ? (
                                <div className="col-span-3 text-center text-xs text-white/40 py-2">Loading availability...</div>
                            ) : TIME_SLOTS.map((time) => {
                                const isAvailable = isTimeSlotAvailable(time)
                                const isDisabled = !date || !isAvailable

                                return (
                                    <button
                                        key={time}
                                        onClick={() => !isDisabled && setSelectedTime(time)}
                                        disabled={isDisabled}
                                        className={cn(
                                            "px-1 py-2 text-xs font-medium rounded-xl border transition-all text-center",
                                            selectedTime === time
                                                ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_10px_rgba(147,51,234,0.3)]"
                                                : isDisabled
                                                    ? "bg-white/5 border-white/10 text-white/20 opacity-40 cursor-not-allowed"
                                                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {time}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Location Selection - Only for book_again mode */}
                    {mode === 'book_again' && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                                <MapPin className="w-4 h-4 text-purple-400" />
                                <span>Location</span>
                            </div>
                            <Input
                                type="text"
                                placeholder="Enter booking location..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-purple-500/30"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="p-5 pt-4 border-t border-white/10 bg-white/5 flex-shrink-0 flex-row gap-3 sm:gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting || isSuccess}
                        className="flex-1 border-white/10 hover:bg-white/10 hover:text-white text-white/70 h-10 sm:h-11"
                    >
                        Cancel
                    </Button>
                    <Button
                        className={cn(
                            "flex-1 bg-gradient-to-r from-purple-600 to-purple-400 border-0 hover:from-purple-700 hover:to-purple-500 text-white font-medium transition-all duration-300 h-10 sm:h-11",
                            isSuccess && "from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
                        )}
                        disabled={!date || !selectedTime || isSubmitting || (mode === 'book_again' && !location.trim())}
                        onClick={handleConfirm}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2 justify-center">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Processing...</span>
                            </div>
                        ) : isSuccess ? (
                            <div className="flex items-center gap-2 justify-center">
                                <Check className="w-4 h-4" />
                                <span>{mode === 'book_again' ? 'Confirmed!' : 'Rescheduled!'}</span>
                            </div>
                        ) : (
                            <span>{mode === 'book_again' ? 'Confirm Booking' : 'Confirm Change'}</span>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
