import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  ClockIcon,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Star,
  CheckCircle,
  FileText,
  PlusCircle
} from 'lucide-react';
import { Job, getJobDurationLabel, getWorkModeLabel } from '../types';
import { ClientProfile } from '@/components/freelancer/jobs/ClientProfile';

interface JobDetailsFullProps {
  job: Job;
  onBack: () => void;
  onApply: (jobId: string, proposal: string, rate: string, rateType: string, attachments: File[]) => void;
  isApplied?: boolean;
}

export default function JobDetailsFull({ job, onBack, onApply, isApplied = false }: JobDetailsFullProps) {
  const [proposal, setProposal] = useState('');
  const [rate, setRate] = useState(job.budget ? job.budget.toString() : '');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch application details if already applied
  useEffect(() => {
    if (isApplied) {
      const fetchApplication = async () => {
        setLoading(true);
        try {
          const { getApplicationForJob } = await import('@/components/freelancer/jobs/mock-data');
          const application = await getApplicationForJob(job.id);

          if (application && application.proposal) {
            setProposal(application.proposal.coverLetter || '');
            setRate(application.proposal.proposedRate ? application.proposal.proposedRate.toString() : '');
            // Note: We can't easily restore File objects from strings/URLs in mock data
            // allowing attachments to remain empty for now in read-only mode
          }
        } catch (error) {
          console.error('Error fetching application details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchApplication();
    }
  }, [isApplied, job.id]);

  // Generate stable job ID based on category and job ID
  const jobId = useMemo(() => {
    const categoryCodes: Record<string, string> = {
      'Cricket': 'CRK',
      'Sports': 'SPT',
      'Technology': 'TEC',
      'Business': 'BUS',
      'Education': 'EDU',
      'Healthcare': 'HCR',
      'Other': 'OTH'
    };
    const code = categoryCodes[job.category] || 'JOB';

    // Create a simple hash from job.id for uniqueness
    let hash = 0;
    for (let i = 0; i < job.id.length; i++) {
      const char = job.id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const jobNum = Math.abs(hash).toString().slice(-4).padStart(4, '0');

    return `DL${code}${jobNum}`;
  }, [job.category, job.id]);

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-[9999] w-screen h-screen overflow-y-auto">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 w-screen z-[10000] bg-[#0F0F0F] border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
                </div>
              </button>
              <div className="ml-3">
                <h1 className="text-lg font-semibold text-white">Job Details</h1>
                <p className="text-white/50 text-xs">{job.category}</p>
              </div>
            </div>
            <div className="text-xs text-gray-400 font-mono">
              {jobId}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-32 px-4 w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center space-y-3 mb-8">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg"></div>
              <div className="relative p-4 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-600/20 border border-purple-500/30">
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-white">Job Details</h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
              Review job requirements and submit your proposal to get started.
            </p>
          </div>
        </div>

        {/* Job Header - Title and Location */}
        <div className="mb-8">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {job.title}
              {job.workMode && (
                <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-white/80 bg-white/10 border border-white/20 rounded-full whitespace-nowrap ml-2 align-middle">
                  {getWorkModeLabel(job.workMode)}
                </span>
              )}
            </h1>
            <button
              type="button"
              onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(job.location)}`, '_blank')}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4 text-purple-400" />
              <span className="font-medium">{job.location}</span>
            </button>
          </div>
        </div>

        {/* Job Highlights */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                <span className="text-gray-400 text-lg leading-none">₹</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-400 mb-0.5">Budget</div>
                <div className="text-white font-medium leading-tight">
                  <span className="whitespace-nowrap">
                    ₹{job.budget.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-400">Duration</div>
                <div className="text-white font-medium capitalize break-words whitespace-normal leading-tight">{getJobDurationLabel(job as any)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-400">Scheduled</div>
                <div className="text-white font-medium">
                  {job.scheduledAt ? (() => {
                    const scheduled = new Date(job.scheduledAt);
                    const month = scheduled.toLocaleDateString('en-US', { month: 'short' });
                    const day = scheduled.getDate();
                    const year = scheduled.getFullYear();
                    const time = scheduled.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                    return (
                      <>
                        {`${month} ${day}, ${year}`}
                        <br />
                        at {time}
                      </>
                    );
                  })() : (() => {
                    // Hardcoded date for consistent demo: November 14, 2025 at 3:30 PM
                    const demoDate = new Date('2025-11-14T15:30:00.000Z');
                    const month = demoDate.toLocaleDateString('en-US', { month: 'short' });
                    const day = demoDate.getDate();
                    const year = demoDate.getFullYear();
                    const time = demoDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                    return (
                      <>
                        {`${month} ${day}, ${year}`}
                        <br />
                        at {time}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-400">Experience</div>
                <div className="text-white font-medium">{job.experience}</div>
              </div>
            </div>
          </div>

          {/* People Needed - Second Row */}
          {(job as any).peopleNeeded && (job as any).peopleNeeded > 1 && (
            <div className="mt-4 flex items-start gap-3 bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <svg className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <div className="text-sm text-purple-300 font-medium">Hiring Multiple Freelancers</div>
                <div className="text-white font-semibold">{(job as any).peopleNeeded} people needed for this job</div>
              </div>
            </div>
          )}
        </div>

        {/* Job Details */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg mb-6">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/5 rounded-full blur-xl"></div>

          {/* Card content */}
          <div className="relative p-5">
            <div className="text-left mb-2">
              <div className="text-white/60 font-medium text-xs">
                {job.postedAt ? (() => {
                  const posted = new Date(job.postedAt);
                  const now = new Date();
                  const diffTime = Math.abs(now.getTime() - posted.getTime());
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                  const diffMinutes = Math.floor(diffTime / (1000 * 60));

                  if (diffMinutes < 60) {
                    return `${diffMinutes}m ago`;
                  } else if (diffHours < 24) {
                    return `${diffHours}h ago`;
                  } else if (diffDays < 7) {
                    return `${diffDays}d ago`;
                  } else if (diffDays < 30) {
                    const weeks = Math.floor(diffDays / 7);
                    return `${weeks}w ago`;
                  } else if (diffDays < 365) {
                    const months = Math.floor(diffDays / 30);
                    return `${months}mo ago`;
                  } else {
                    const years = Math.floor(diffDays / 365);
                    return `${years}y ago`;
                  }
                })() : 'Date not specified'}
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">About the Job</h2>
            </div>
            <div className="prose prose-invert max-w-none">
              {job.description && (
                <p className="text-white/80 leading-relaxed mb-6">
                  {job.description}
                </p>
              )}

              {job.skills && job.skills.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h3 className="text-md font-semibold text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#2D2D2D] text-white/90 border border-white/5 hover:bg-[#3D3D3D] transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client Profile */}
        <ClientProfile
          client={{
            name: job.client?.name || job.clientName,
            image: job.client?.image || job.clientImage,
            location: job.location,
            memberSince: job.client?.memberSince,
            rating: job.client?.rating,
            moneySpent: job.client?.moneySpent,
            jobsCompleted: job.client?.jobsCompleted,
            freelancersWorked: job.client?.freelancersWorked,
            freelancerAvatars: job.client?.freelancerAvatars
          }}
          location={job.location}
          defaultExpanded={false}
        />

        {/* Spacer */}
        <div className="mb-6"></div>

        {/* Apply Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg mb-6">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/5 rounded-full blur-xl"></div>

          {/* Card content */}
          <div className="relative p-5">

            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Apply for this Job</h2>
                {isApplied && (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/30 flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3" />
                    Applied
                  </span>
                )}
              </div>

              <div>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Explain why you're the best fit for this job. Mention your relevant experience, skills, and how you plan to deliver exceptional results."
                  className={`w-full p-3 bg-[#111111] border border-gray-600 rounded-xl text-white resize-none text-sm ${isApplied ? 'opacity-70 cursor-not-allowed' : ''}`}
                  rows={6}
                  maxLength={1500}
                  required
                  readOnly={isApplied}
                />
                {!isApplied && (
                  <p className="mt-1 text-xs text-gray-400 text-right">
                    {proposal.length}/1500 characters
                  </p>
                )}
              </div>



              <button
                onClick={() => onApply(job.id, proposal, job.budget.toString(), "project", [])}
                disabled={!proposal.trim() || isApplied}
                className={`w-full h-10 font-medium rounded-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${isApplied
                  ? 'bg-green-600/20 text-green-400 border border-green-600/50 cursor-default'
                  : 'bg-purple-600 hover:bg-purple-700 text-white disabled:cursor-not-allowed disabled:opacity-50'
                  }`}
              >
                {isApplied ? (
                  <>
                    <span>Application Submitted</span>
                    <CheckCircle className="w-4 h-4" />
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 rounded-full blur-xl"></div>

          {/* Card content */}
          <div className="relative p-5">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Safety Tips</h2>
            </div>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/80">Research client's reputation and verify their cricket coaching requirements</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/80">Never share personal contact details until you have a confirmed booking</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/80">Verify payment terms and cricket session details before accepting jobs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/80">Report suspicious job postings related to cricket coaching immediately</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/80">Keep records of all cricket coaching applications and communications</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
