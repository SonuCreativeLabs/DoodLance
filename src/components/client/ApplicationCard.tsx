'use client';

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useApplications, Application } from "@/contexts/ApplicationsContext"
import { usePostedJobs } from "@/contexts/PostedJobsContext"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { RescheduleModal } from "./bookings/RescheduleModal"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export const ApplicationCard = ({ application }: { application: Application }) => {
    const router = useRouter()
    const { acceptApplication, rejectApplication, reconsiderApplication } = useApplications()
    const { postedJobs, closeJob } = usePostedJobs()
    const [isProcessing, setIsProcessing] = useState(false)
    const [showReconsiderDialog, setShowReconsiderDialog] = useState(false)
    const [showRejectDialog, setShowRejectDialog] = useState(false)
    const [showReschedule, setShowReschedule] = useState(false)

    const [showAcceptDialog, setShowAcceptDialog] = useState(false)
    const [showDeclineDialog, setShowDeclineDialog] = useState(false)

    const handleOpenDetails = () => {
        router.push(`/client/bookings/applications/${encodeURIComponent(application["#"])}`)
    }

    // Convert application to booking format for RescheduleModal
    const bookingData: any = {
        "#": application["#"],
        provider: application.freelancer.name,
        service: application.jobTitle,
        date: new Date().toISOString().split('T')[0], // Use current date as placeholder
        time: "10:00 AM",
        location: application.freelancer.location,
        status: 'upcoming'
    }

    const handleAcceptConfirm = async () => {
        setIsProcessing(true)
        try {
            await acceptApplication(application["#"])

            // Check vacancy and close job if needed
            const job = postedJobs.find(j => j["#"] === application.jobId)
            if (job && job.acceptedCount + 1 >= job.peopleNeeded) {
                await closeJob(job["#"])
            }

            setShowAcceptDialog(false)
        } catch (error) {
            console.error("Failed to accept application:", error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRejectConfirm = async () => {
        setIsProcessing(true)
        try {
            await rejectApplication(application["#"])
            if (application.status === 'new') setShowDeclineDialog(false)
            else setShowRejectDialog(false)
        } catch (error) {
            console.error("Failed to reject application:", error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleReconsider = async (event: React.MouseEvent) => {
        event.stopPropagation()
        setIsProcessing(true)
        try {
            await reconsiderApplication(application["#"])
            setShowReconsiderDialog(false)
        } catch (error) {
            console.error("Failed to reconsider application:", error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRescheduleConfirm = async (id: string, newDate: string, newTime: string) => {
        console.log("Rescheduling application", id, newDate, newTime)
    }

    // Determine status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'text-green-400 border-green-500/20 bg-green-500/10';
            case 'rejected': return 'text-red-400 border-red-500/20 bg-red-500/10';
            case 'new': return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
            case 'pending': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
            default: return 'text-white/60 border-white/10 bg-white/5';
        }
    }

    return (
        <>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                role="button"
                tabIndex={0}
                onClick={handleOpenDetails}
                className="group bg-gradient-to-br from-[#1E1E1E] to-[#1A1A1A] rounded-2xl p-6 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 w-full border border-white/5 hover:border-white/10 relative cursor-pointer"
            >
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full border text-[10px] uppercase font-medium tracking-wide ${getStatusColor(application.status)}`}>
                    {application.status}
                </div>

                {/* Profile Picture Section */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="relative flex-shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-20 blur-md"></div>
                            <img
                                src={application.freelancer.image || 'https://via.placeholder.com/64x64?text=No+Image'}
                                alt={application.freelancer.name}
                                className="relative w-16 h-16 rounded-full border-2 border-purple-200/50 object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                                }}
                            />
                        </div>
                        {/* Rating Badge - Below Avatar */}
                        <div className="flex items-center justify-center gap-1 bg-yellow-400/10 rounded-full px-2 py-0.5 mt-2 w-fit mx-auto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-3.5 h-3.5 text-yellow-400">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            <span className="text-xs font-bold text-yellow-400">{application.freelancer.rating}</span>
                            <span className="text-[10px] text-yellow-300/80">(24)</span>
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-2 flex-1">
                                <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2 break-words">
                                    {application.freelancer.name}
                                </h3>
                            </div>
                        </div>
                        <p className="text-[13px] text-white/80 line-clamp-2 leading-relaxed">
                            {application.proposal}
                        </p>
                        <div className="flex items-center gap-4 text-[12px] text-white/60">
                            <div className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin w-3.5 h-3.5 flex-shrink-0">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>{application.freelancer.location}</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="flex items-center justify-end pt-3 border-t border-white/5 mt-3">
                    <div className="flex gap-2 w-full">
                        {application.status === 'new' && (
                            <>
                                <Button
                                    className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-all duration-200 border border-red-500/20"
                                    onClick={(e) => { e.stopPropagation(); setShowDeclineDialog(true); }}
                                >
                                    Decline
                                </Button>
                                <Button
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-lg"
                                    onClick={(e) => { e.stopPropagation(); setShowAcceptDialog(true); }}
                                >
                                    Accept
                                </Button>
                            </>
                        )}
                        {application.status === 'accepted' && (
                            <>
                                <Button
                                    className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-xs font-medium transition-all duration-200 border border-red-500/20"
                                    onClick={(e) => { e.stopPropagation(); setShowRejectDialog(true); }}
                                >
                                    Reject
                                </Button>
                                <Button
                                    className="flex-1 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 rounded-lg text-xs font-medium transition-all duration-200 border border-purple-500/20"
                                    onClick={(e) => { e.stopPropagation(); setShowReschedule(true); }}
                                >
                                    Reschedule
                                </Button>
                            </>
                        )}
                        {application.status === 'rejected' && (
                            <Button
                                className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-medium transition-all duration-200 border border-white/10"
                                onClick={(e) => { e.stopPropagation(); setShowReconsiderDialog(true); }}
                            >
                                Reconsider
                            </Button>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Accept Dialog */}
            <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">Accept Application</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to hire this freelancer? This will mark the application as accepted.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); setShowAcceptDialog(false); }}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAcceptConfirm}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            Confirm Acceptance
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Decline Dialog (for New) */}
            <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">Decline Application</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to decline this application? It will be moved to Rejected status.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); setShowDeclineDialog(false); }}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectConfirm}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Decline Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reconsider Dialog */}
            <Dialog open={showReconsiderDialog} onOpenChange={setShowReconsiderDialog}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">Reconsider Application</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to reconsider this application? It will be moved back to New status.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); setShowReconsiderDialog(false); }}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReconsider}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            Reconsider
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog (for Accepted) */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">Reject Application</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to reject this previously accepted application?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); setShowRejectDialog(false); }}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectConfirm}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Reject Application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <RescheduleModal
                isOpen={showReschedule}
                onClose={() => setShowReschedule(false)}
                booking={bookingData}
                onReschedule={handleRescheduleConfirm}
            />
        </>
    )
}
