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

    // Adapter for RescheduleModal
    const mockBooking: any = {
        "#": application["#"],
        provider: application.freelancer.name,
        service: application.jobTitle,
        date: "2024-01-01", // Mock
        time: "10:00 AM",   // Mock
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

    return (
        <>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                role="button"
                tabIndex={0}
                onClick={handleOpenDetails}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        handleOpenDetails()
                    }
                }}
                className="p-5 rounded-xl bg-[#1E1E1E] border border-white/5 w-full shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2 focus:ring-offset-[#111111]"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {application.status === 'new' && (
                                <div className="bg-blue-500/10 text-blue-400 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/20 w-fit">
                                    New
                                </div>
                            )}
                            {application.status === 'accepted' && (
                                <div className="bg-green-500/10 text-green-400 text-xs font-medium px-3 py-1 rounded-full border border-green-500/20 w-fit">
                                    Accepted
                                </div>
                            )}
                            {application.status === 'rejected' && (
                                <div className="bg-red-500/10 text-red-400 text-xs font-medium px-3 py-1 rounded-full border border-red-500/20 w-fit">
                                    Rejected
                                </div>
                            )}
                            {application.status === 'pending' && (
                                <div className="bg-blue-500/10 text-blue-400 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/20 w-fit">
                                    New
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-white/60">
                            <span className="font-mono text-xs">{application["#"]}</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-base font-medium text-white line-clamp-2 mb-1">{application.jobTitle}</h3>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-3.5 h-3.5 text-purple-400">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>{application.freelancer.name}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-start gap-2 text-white/60">
                            <div className="flex-shrink-0 mt-0.5 flex flex-col items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star w-4 h-4 text-purple-400">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs text-white/40 mb-0.5">Rating</div>
                                <div className="text-sm text-white/90">
                                    <div className="flex items-center gap-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-3 h-3 text-yellow-400"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                        </svg>
                                        <span className="text-white/80 font-medium">{application.freelancer.rating}</span>
                                        <span className="text-white/50">•</span>
                                        <span className="text-white/60">{application.freelancer.completedJobs} jobs</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-white/60">
                            <div className="flex-shrink-0 mt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock w-4 h-4 text-purple-400">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <div className="text-xs text-white/40 mb-0.5">Response Time</div>
                                <div className="text-sm text-white/90 truncate">{application.freelancer.responseTime}</div>
                            </div>
                        </div>
                    </div>

                    {application.status === 'new' && (
                        <div className="flex gap-2 pt-2">
                            <Button
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                size="sm"
                                variant="outline"
                                disabled={isProcessing}
                                onClick={(e) => { e.stopPropagation(); setShowDeclineDialog(true); }}
                            >
                                Decline
                            </Button>
                            <Button
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                                disabled={isProcessing}
                                onClick={(e) => { e.stopPropagation(); setShowAcceptDialog(true); }}
                            >
                                Accept
                            </Button>
                        </div>
                    )}

                    {application.status === 'rejected' && (
                        <div className="flex gap-2 pt-2">
                            <Button
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                size="sm"
                                variant="outline"
                                disabled={isProcessing}
                                onClick={(e) => { e.stopPropagation(); setShowReconsiderDialog(true); }}
                            >
                                Reconsider
                            </Button>
                        </div>
                    )}

                    {application.status === 'accepted' && (
                        <div className="flex gap-2 pt-2">
                            <Button
                                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                                size="sm"
                                variant="outline"
                                disabled={isProcessing}
                                onClick={(e) => { e.stopPropagation(); setShowRejectDialog(true); }}
                            >
                                Reject
                            </Button>
                            <Button
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                                disabled={isProcessing}
                                onClick={(e) => { e.stopPropagation(); setShowReschedule(true); }}
                            >
                                Reschedule
                            </Button>
                        </div>
                    )}
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
                booking={mockBooking}
                onReschedule={handleRescheduleConfirm}
            />
        </>
    )
}
