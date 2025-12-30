'use client';

import { useMemo, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    MapPin,
    Calendar,
    IndianRupee,
    Users,
    Briefcase,
    MoreVertical,
    Clock,
    Eye,
    Trash2,
    Power,
    User,
    GraduationCap,
    Pencil,
    Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePostedJobs } from '@/contexts/PostedJobsContext';
import { useNavbar } from "@/contexts/NavbarContext";
import { useApplications } from "@/contexts/ApplicationsContext";
import { ApplicationCard } from "@/components/client/ApplicationCard";
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
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { postedJobs, closeJob, reopenJob, deleteJob, updateJob } = usePostedJobs();
    const { setNavbarVisibility } = useNavbar();
    const { applications } = useApplications();
    const [filter, setFilter] = useState<'all' | 'new' | 'accepted' | 'rejected'>('all');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showCloseDialog, setShowCloseDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editField, setEditField] = useState<string>('');
    const [editValue, setEditValue] = useState<any>('');

    useEffect(() => {
        setNavbarVisibility(false);
        return () => setNavbarVisibility(true);
    }, [setNavbarVisibility]);

    const jobId = useMemo(() => {
        if (!params || typeof params.id === 'undefined') return '';
        return decodeURIComponent(Array.isArray(params.id) ? params.id[0] : params.id);
    }, [params]);

    const job = useMemo(
        () => postedJobs.find((j) => j["#"] === jobId),
        [postedJobs, jobId]
    );

    const jobApplications = useMemo(() => {
        if (!jobId) return [];
        // Show actual applications matching the job
        return applications.filter(app => app.jobId === jobId);
    }, [applications, jobId]);

    const handleStatusToggle = async () => {
        if (!job) return;
        if (job.status === 'open') {
            setShowCloseDialog(true);
        } else {
            // Reopening triggers immediately or can also verify. Assuming immediate for now as user only asked for "confirm close".
            await reopenJob(job["#"]);
        }
    };

    const handleCloseJob = async () => {
        if (!job) return;
        await closeJob(job["#"]);
        setShowCloseDialog(false);
    };

    const filteredJobApplications = useMemo(() => {
        return jobApplications.filter(app => filter === 'all' || app.status === filter);
    }, [jobApplications, filter]);

    const handleDeleteJob = async () => {
        if (!job) return;
        // Proceed with delete
        await deleteJob(job["#"]);
        router.push('/client/bookings?tab=applications');
    };

    const handleEditField = (cardType: string, job: any) => {
        setEditField(cardType);
        // Initialize form data based on card type
        if (cardType === 'keyDetails') {
            setEditValue({
                budget: job.budget.replace('₹', ''),
                category: job.category,
                scheduledAt: job.scheduledAt || '',
                duration: job.duration,
                workMode: job.workMode
            });
        } else if (cardType === 'jobDetails') {
            setEditValue({
                title: job.title,
                description: job.description,
                skills: job.skills ? job.skills.join(', ') : '',
                peopleNeeded: job.peopleNeeded || 1,
                experience: job.experience
            });
        }
        setShowEditDialog(true);
    };

    const handleSaveEdit = async () => {
        if (!job || !editField) return;
        try {
            let updateData: any = {};

            if (editField === 'keyDetails') {
                updateData = {
                    budget: editValue.budget,
                    category: editValue.category,
                    scheduledAt: editValue.scheduledAt,
                    duration: editValue.duration,
                    workMode: editValue.workMode
                };
            } else if (editField === 'jobDetails') {
                updateData = {
                    title: editValue.title,
                    description: editValue.description,
                    skills: editValue.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
                    peopleNeeded: parseInt(editValue.peopleNeeded),
                    experience: editValue.experience
                };
            }

            await updateJob(job["#"], updateData);
            setShowEditDialog(false);
        } catch (error) {
            console.error('Failed to update job:', error);
        }
    };

    if (!job && postedJobs.length === 0) {
        // Only show loading if we truly have no data yet (first load)
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
                <p className="text-white/60">Loading job details...</p>
            </div>
        );
    }

    if (!job) {
        // Job not found, but we have data
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white">
                <p className="text-white/60">Job not found</p>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#050505] text-white">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-30 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.back()}
                                className="inline-flex items-center p-0 hover:bg-transparent text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                                aria-label="Back"
                            >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                                    <ArrowLeft className="h-4 w-4" />
                                </div>
                            </Button>

                            <div className="ml-3">
                                <h1 className="text-lg font-semibold text-white">
                                    {job.status === 'open' ? 'Upcoming' : 'Ongoing'} Job
                                </h1>
                                <p className="text-white/50 text-xs">{job["#"]}</p>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-white/5">
                                    <MoreVertical className="w-4 h-4 text-white/60" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-[#1A1A1A] border-white/10 text-white">
                                <DropdownMenuItem onClick={handleStatusToggle} className="gap-2 cursor-pointer focus:bg-white/5">
                                    <Power className="w-4 h-4" />
                                    {job.status === 'open' ? 'Close Job' : 'Reopen Job'}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="gap-2 cursor-pointer focus:bg-white/5 text-red-400 focus:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                    Delete Job
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-[90px] pb-[20px] px-4 space-y-6">

                {/* Job Hero Section - Split Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Left Card: Job Info */}
                    <div className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent" />
                        <div className="relative p-6 h-full flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-2">
                                <p className="text-sm text-white/60">Posted Job</p>
                                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border",
                                    job.status === 'open' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-white/5 text-white/50 border-white/10"
                                )}>
                                    {job.status.toUpperCase()}
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-white tracking-tight mb-4 line-clamp-2">
                                {job.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-5 text-xs text-white/60">
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5 text-blue-400" />
                                    <span className="font-medium text-white/80">
                                        {jobApplications.length}
                                    </span>
                                    <span>Applicants</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Eye className="w-3.5 h-3.5 text-purple-400" />
                                    <span className="font-medium text-white/80">
                                        {job.viewCount || 124}
                                    </span>
                                    <span>Views</span>
                                </div>
                                <div className="flex items-center gap-1.5 hover:text-purple-300 transition-colors cursor-pointer">
                                    <MapPin className="w-3.5 h-3.5 text-pink-400" />
                                    <span>{job.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Package Info */}
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.2),transparent_70%)]" />
                        <div className="relative p-6 h-full flex flex-col justify-center items-end text-right">
                            <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Session Package</p>
                            <p className="text-3xl font-bold text-white tracking-tight">{job.budget}</p>
                            <div className="flex flex-col items-end gap-1 mt-2">
                                <p className="text-sm font-medium text-white/70">
                                    ₹{Math.round(parseInt(job.budget.replace(/[^0-9]/g, '') || '0') / (job.peopleNeeded || 1)).toLocaleString()} / person
                                </p>
                                <p className="text-xs text-white/40 flex justify-end items-center gap-1.5 mt-1">
                                    <Calendar className="w-3 h-3" />
                                    Posted {new Date(job.datePosted || Date.now()).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Key Details Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white/90">Key Details</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-white/10"
                            onClick={() => handleEditField('keyDetails', job)}
                        >
                            <Pencil className="h-3.5 w-3.5 text-white/50 hover:text-white" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                        <div className="space-y-1">
                            <div className="text-white/40 text-xs uppercase tracking-wider">Budget</div>
                            <div className="text-white font-medium">
                                {job.budget.replace('₹', '')}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-white/40 text-xs uppercase tracking-wider">Category</div>
                            <div className="text-white font-medium">{job.category}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-white/40 text-xs uppercase tracking-wider">Start Date</div>
                            <div className="text-white font-medium">
                                {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString() : 'Immediate'}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-white/40 text-xs uppercase tracking-wider">Time</div>
                            <div className="text-white font-medium">
                                {job.scheduledAt ? new Date(job.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Flexible'}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-white/40 text-xs uppercase tracking-wider">Duration</div>
                            <div className="text-white font-medium">
                                {job.duration}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-white/40 text-xs uppercase tracking-wider">Work Mode</div>
                            <div className="text-white font-medium capitalize">
                                {job.workMode}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Location Card */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="space-y-3">
                        <div className="text-white/40 text-xs uppercase tracking-wider">Location</div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-medium flex items-start gap-2 hover:text-purple-400 transition-colors cursor-pointer underline decoration-white/30 hover:decoration-purple-400"
                        >
                            <MapPin className="w-4 h-4 text-white/40 flex-shrink-0 mt-0.5" />
                            <span>{job.location}</span>
                        </a>
                    </div>
                </div>


                {/* Job Details Card - Merged Requirements and About Role */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white/90">Job Details</h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-white/10"
                            onClick={() => handleEditField('jobDetails', job)}
                        >
                            <Pencil className="h-3.5 w-3.5 text-white/50 hover:text-white" />
                        </Button>
                    </div>
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider">Title</h4>
                            <div className="text-sm text-white/70">{job.title}</div>
                        </div>

                        <div className="w-full h-px bg-white/5" />

                        {/* Description */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider">Description</h4>
                            <div className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5" />

                        {/* Skills */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-medium text-white/40 uppercase tracking-wider">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.skills && job.skills.length > 0 ? (
                                    job.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/80">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-white/40 text-sm">No specific skills listed</span>
                                )}
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/5" />

                        {/* People Needed and Experience at the end */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-6 text-sm">
                            <div className="space-y-1">
                                <div className="text-white/40 text-xs uppercase tracking-wider">People Needed</div>
                                <div className="text-white font-medium flex items-center gap-2">
                                    <User className="w-4 h-4 text-white/40" />
                                    {job.acceptedCount || 0}/{job.peopleNeeded || 1} Person
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-white/40 text-xs uppercase tracking-wider">Experience Level</div>
                                <div className="text-white font-medium capitalize flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-white/40 flex-shrink-0" />
                                    {job.experience}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applications Section */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-white/90">Applications</h3>
                        <span className="text-xs text-white/40">{filteredJobApplications.length} total</span>
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {['all', 'new', 'accepted', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border",
                                    filter === f
                                        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/80"
                                )}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredJobApplications.length > 0 ? (
                            filteredJobApplications.map((app) => (
                                <ApplicationCard key={app["#"]} application={app} />
                            ))
                        ) : (
                            <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center text-center space-y-3">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white/20" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-white font-medium">No {filter === 'all' ? '' : filter} applications</p>
                                    <p className="text-white/40 text-xs max-w-[200px]">
                                        {filter === 'all' ? "When freelancers apply to this job, they will appear here." : `No applications found with status '${filter}'.`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">Delete Job Posting</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to delete this job? This action cannot be undone and will move the job to the deleted folder.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteDialog(false)}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteJob}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Delete Job
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">Close Job Posting</DialogTitle>
                        <DialogDescription className="text-white/60">
                            Are you sure you want to close this job? You can reopen it anytime.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setShowCloseDialog(false)}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCloseJob}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            Close Job
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="bg-[#1A1A1A] border-white/10 text-white w-[95vw] max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            Edit {editField === 'keyDetails' ? 'Key Details' : 'Job Details'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        {editField === 'keyDetails' && editValue && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">Budget (₹)</label>
                                    <Input
                                        type="number"
                                        value={editValue.budget}
                                        onChange={(e) => setEditValue({ ...editValue, budget: e.target.value })}
                                        className="bg-black/50 border-white/20 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">Category</label>
                                    <Input
                                        value={editValue.category}
                                        onChange={(e) => setEditValue({ ...editValue, category: e.target.value })}
                                        className="bg-black/50 border-white/20 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">Start Date & Time</label>
                                    <Input
                                        type="datetime-local"
                                        value={editValue.scheduledAt ? new Date(editValue.scheduledAt).toISOString().slice(0, 16) : ''}
                                        onChange={(e) => setEditValue({ ...editValue, scheduledAt: e.target.value })}
                                        className="bg-black/50 border-white/20 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">Duration</label>
                                    <Input
                                        value={editValue.duration}
                                        onChange={(e) => setEditValue({ ...editValue, duration: e.target.value })}
                                        className="bg-black/50 border-white/20 text-white"
                                        placeholder="e.g., 3 hours, 2 days"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">Work Mode</label>
                                    <select
                                        value={editValue.workMode}
                                        onChange={(e) => setEditValue({ ...editValue, workMode: e.target.value })}
                                        className="w-full bg-black/50 border border-white/20 text-white rounded-md px-3 py-2"
                                    >
                                        <option value="onfield">Onfield</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>
                            </>
                        )}
                        {editField === 'jobDetails' && editValue && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">Title</label>
                                    <Input
                                        value={editValue?.title || ''}
                                        onChange={(e) => setEditValue({ ...editValue, title: e.target.value })}
                                        className="bg-black/50 border-white/20 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">Description</label>
                                    <Textarea
                                        value={editValue.description}
                                        onChange={(e) => setEditValue({ ...editValue, description: e.target.value })}
                                        className="bg-black/50 border-white/20 text-white min-h-[120px]"
                                        placeholder="Describe the role and requirements"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">Required Skills (comma separated)</label>
                                    <Input
                                        value={editValue.skills}
                                        onChange={(e) => setEditValue({ ...editValue, skills: e.target.value })}
                                        className="bg-black/50 border-white/20 text-white"
                                        placeholder="e.g., React, Node.js, TypeScript"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">People Needed</label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={editValue.peopleNeeded}
                                        onChange={(e) => setEditValue({ ...editValue, peopleNeeded: e.target.value })}
                                        className="bg-black/50 border-white/20 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-white/70">Experience Level</label>
                                    <select
                                        value={editValue.experience}
                                        onChange={(e) => setEditValue({ ...editValue, experience: e.target.value })}
                                        className="w-full bg-black/50 border border-white/20 text-white rounded-md px-3 py-2"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="ghost"
                            onClick={() => setShowEditDialog(false)}
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
