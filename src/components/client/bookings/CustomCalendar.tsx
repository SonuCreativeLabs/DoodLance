"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomCalendarProps {
    selected?: Date
    onSelect: (date: Date) => void
    disabledDates?: (date: Date) => boolean
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

export function CustomCalendar({ selected, onSelect, disabledDates }: CustomCalendarProps) {
    const [currentDate, setCurrentDate] = useState(selected || new Date())

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get first day of month (0 = Sunday, 6 = Saturday)
    const firstDayOfMonth = new Date(year, month, 1).getDay()

    // Get number of days in month
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    // Get days from previous month to fill the grid
    const daysInPrevMonth = new Date(year, month, 0).getDate()
    const prevMonthDays = Array.from(
        { length: firstDayOfMonth },
        (_, i) => daysInPrevMonth - firstDayOfMonth + i + 1
    )

    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

    // Next month days to fill the grid (ensure we have complete weeks)
    const totalCells = prevMonthDays.length + currentMonthDays.length
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
    const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => i + 1)

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1))
    }

    const goToNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1))
    }

    const isSelected = (day: number, isCurrentMonth: boolean) => {
        if (!selected || !isCurrentMonth) return false
        return (
            selected.getDate() === day &&
            selected.getMonth() === month &&
            selected.getFullYear() === year
        )
    }

    const isToday = (day: number, isCurrentMonth: boolean) => {
        if (!isCurrentMonth) return false
        const today = new Date()
        return (
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year
        )
    }

    const isDisabled = (day: number, monthOffset: number) => {
        const date = new Date(year, month + monthOffset, day)
        return disabledDates ? disabledDates(date) : false
    }

    const handleDateClick = (day: number, monthOffset: number) => {
        const date = new Date(year, month + monthOffset, day)
        if (!isDisabled(day, monthOffset)) {
            onSelect(date)
        }
    }

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-center relative mb-4">
                <button
                    onClick={goToPreviousMonth}
                    className="absolute left-1 h-7 w-7 bg-transparent p-0 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                >
                    <ChevronLeft className="h-4 w-4 text-white" />
                </button>
                <div className="text-base font-semibold text-white">
                    {MONTHS[month]} {year}
                </div>
                <button
                    onClick={goToNextMonth}
                    className="absolute right-1 h-7 w-7 bg-transparent p-0 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                >
                    <ChevronRight className="h-4 w-4 text-white" />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="w-full">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {WEEKDAYS.map((day) => (
                        <div
                            key={day}
                            className="text-white/50 text-[0.8rem] font-normal text-center h-9 flex items-center justify-center"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Dates Grid */}
                <div className="grid grid-cols-7 gap-y-1">
                    {/* Previous month days */}
                    {prevMonthDays.map((day) => (
                        <div
                            key={`prev-${day}`}
                            className="h-9 flex items-center justify-center"
                        >
                            <button
                                disabled
                                className="h-9 w-9 text-white/20 opacity-30 rounded-full cursor-not-allowed"
                            >
                                {day}
                            </button>
                        </div>
                    ))}

                    {/* Current month days */}
                    {currentMonthDays.map((day) => (
                        <div
                            key={`current-${day}`}
                            className="h-9 flex items-center justify-center"
                        >
                            <button
                                onClick={() => handleDateClick(day, 0)}
                                disabled={isDisabled(day, 0)}
                                className={cn(
                                    "h-9 w-9 rounded-full transition-all font-normal",
                                    isSelected(day, true)
                                        ? "bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]"
                                        : isToday(day, true)
                                            ? "bg-white/10 text-white font-bold border border-white/20"
                                            : isDisabled(day, 0)
                                                ? "text-white/10 opacity-30 cursor-not-allowed"
                                                : "text-white hover:bg-white/10"
                                )}
                            >
                                {day}
                            </button>
                        </div>
                    ))}

                    {/* Next month days */}
                    {nextMonthDays.map((day) => (
                        <div
                            key={`next-${day}`}
                            className="h-9 flex items-center justify-center"
                        >
                            <button
                                disabled
                                className="h-9 w-9 text-white/20 opacity-30 rounded-full cursor-not-allowed"
                            >
                                {day}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
