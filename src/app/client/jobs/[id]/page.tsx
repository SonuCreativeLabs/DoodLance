'use client';

import { useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePostedJobs } from '@/contexts/PostedJobsContext';
import { useNavbar } from "@/contexts/NavbarContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function JobDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { postedJobs, closeJob, reopenJob } = usePostedJobs();
    const { setNavbarVisibility } = useNavbar();

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

    const handleStatusToggle = async () => {
        if (!job) return;
        if (job.status === 'open') {
            await closeJob(job["#"]);
        } else {
            await reopenJob(job["#"]);
        }
    };

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
                <p className="text-white/60">Loading job details...</p>
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
                                <h1 className="text-lg font-semibold text-white line-clamp-1 max-w-[200px]">{job.title}</h1>
                                <div className="flex items-center gap-2">
                                    <p className="text-white/50 text-xs">{job.category}</p>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${job.status === 'open'
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                        {job.status}
                                    </span>
                                </div>
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
                                <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-white/5 text-red-400 focus:text-red-300">
                                    <Trash2 className="w-4 h-4" />
                                    Delete Job
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-[90px] pb-[20px] px-4 space-y-6">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                        <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-2">
                            <Users className="w-4 h-4" />
                            <span>Applicants</span>
                        </div>
                        <div className="text-2xl font-bold">{job.applicationCount}</div>
                        <div className="text-xs text-white/40">Total proposals</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                        <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-2">
                            <Eye className="w-4 h-4" />
                            <span>Views</span>
                        </div>
                        <div className="text-2xl font-bold">{job.viewCount}</div>
                        <div className="text-xs text-white/40">Total impressions</div>
                    </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <div className="text-white/40 text-xs uppercase tracking-wider">Budget</div>
                        <div className="text-white font-medium flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-purple-400" />
                            {job.budget.replace('₹', '')}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-white/40 text-xs uppercase tracking-wider">Location</div>
                        <div className="text-white font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            {job.location}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-white/40 text-xs uppercase tracking-wider">Start Date</div>
                        <div className="text-white font-medium flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString() : 'Immediate'}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-white/40 text-xs uppercase tracking-wider">Time</div>
                        <div className="text-white font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            {job.scheduledAt ? new Date(job.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Flexible'}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-white/40 text-xs uppercase tracking-wider">Duration</div>
                        <div className="text-white font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            {job.duration}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-white/40 text-xs uppercase tracking-wider">Work Mode</div>
                        <div className="text-white font-medium capitalize flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-purple-400" />
                            {job.workMode}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-white/40 text-xs uppercase tracking-wider">People Needed</div>
                        <div className="text-white font-medium flex items-center gap-2">
                            <User className="w-4 h-4 text-purple-400" />
                            {job.acceptedCount || 0}/1 Person
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-white/40 text-xs uppercase tracking-wider">Experience Level</div>
                        <div className="text-white font-medium capitalize flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-purple-400" />
                            {job.experience}
                        </div>
                    </div>
                </div>

                {/* Skills */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white/90">Required Skills</h3>
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

                {/* Description */}
                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white/90">Description</h3>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                        {job.description}
                    </div>
                </div>
            </div>
        </div>
    );
}
