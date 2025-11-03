import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Star,
  Briefcase,
  CheckCircle,
  FileText,
  PlusCircle
} from 'lucide-react';
import { Job } from '../types';
import { ClientProfile } from '@/components/freelancer/jobs/ClientProfile';

interface JobDetailsFullProps {
  job: Job;
  onBack: () => void;
  onApply: (jobId: string, proposal: string, rate: string, rateType: string, attachments: File[]) => void;
}

export default function JobDetailsFull({ job, onBack, onApply }: JobDetailsFullProps) {
  const [proposal, setProposal] = useState('');
  const [rate, setRate] = useState(job.budget ? job.budget.toString() : '');
  const [rateType, setRateType] = useState('project');
  const [attachments, setAttachments] = useState<File[]>([]);

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
      <header className="fixed top-0 left-0 right-0 w-screen z-[10000] bg-black/95 backdrop-blur-sm border-b border-gray-800/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onBack}
              className="flex items-center text-white/80 hover:text-white transition-all duration-200 p-2 -ml-2 rounded-full hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col ml-2">
              <h1 className="text-lg font-semibold text-white">Job Details</h1>
              <p className="text-sm font-medium text-gray-400">{job.category}</p>
            </div>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {jobId}
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
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">{job.title}</h1>
            <button
              type="button"
              onClick={() => {/* TODO: Add map functionality */}}
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
                    {job.budget.toLocaleString('en-IN')}
                    {job.duration === 'one-time' ? (
                      <span className="text-gray-400 text-sm font-normal ml-1">per job</span>
                    ) : (
                      <span className="text-gray-400 text-sm font-normal ml-1">
                        {job.duration === 'hourly' ? '/hr' : 
                         job.duration === 'daily' ? '/day' : 
                         job.duration === 'weekly' ? '/wk' : 
                         job.duration === 'monthly' ? '/mo' : ''}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-400">Work Mode</div>
                <div className="text-white font-medium capitalize">{job.workMode}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm text-gray-400">Posted</div>
                <div className="text-white font-medium">
                  {job.postedAt ? new Date(job.postedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  }) : 'Date not specified'}
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
        </div>

        {/* Job Details */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg mb-6">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/5 rounded-full blur-xl"></div>

          {/* Card content */}
          <div className="relative p-5">
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
          defaultExpanded={true}
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
                <h2 className="text-lg font-semibold text-white">Your Proposal</h2>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Cover Letter <span className="text-red-500">*</span></h3>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Explain why you're the best fit for this job, your relevant experience, and how you plan to deliver exceptional results."
                  className="w-full p-3 bg-[#111111] border border-gray-600 rounded-xl text-white resize-none text-sm"
                  rows={6}
                  maxLength={1500}
                  required
                />
                <p className="mt-1 text-xs text-gray-400 text-right">
                  {proposal.length}/1500 characters
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Your Rate <span className="text-red-500">*</span></h3>
                <div className="flex items-center space-x-3">
                  <input
                    id="rate"
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="₹400"
                    className="bg-[#111111] border border-gray-600 rounded px-3 py-2 text-white w-32 text-sm flex-1 max-w-[120px] placeholder:text-gray-500"
                    min="0"
                  />
                  <span className="text-sm text-gray-400">/</span>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value)}
                    className="bg-[#111111] border border-gray-600 rounded px-3 py-2 text-white text-sm w-28 appearance-none"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'white\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6,9 12,15 18,9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px', paddingRight: '2.5rem' }}
                  >
                    <option value="project">project</option>
                    <option value="hour">hour</option>
                    <option value="match">match</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Attachments</h3>
                  <label className="p-1.5 text-gray-400 hover:text-purple-400 rounded-full hover:bg-purple-500/10 transition-colors cursor-pointer" title="Add attachment">
                    <PlusCircle className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setAttachments(prev => [...prev, ...files]);
                        // Reset input
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
                <div 
                  className="space-y-2 cursor-pointer"
                  onClick={() => {
                    // Find the hidden input and trigger click
                    const input = document.querySelector('input[type="file"][accept*=".pdf"]') as HTMLInputElement;
                    input?.click();
                  }}
                >
                  {attachments.length > 0 ? (
                    attachments.map((file, index) => (
                      <div key={index} className="group flex items-center justify-between p-3 bg-[#1e1e1e] rounded-lg hover:bg-gray-500/30 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 bg-purple-500/10 rounded-md">
                            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-300 font-medium truncate max-w-[200px]">
                            {file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const newAttachments = attachments.filter((_, i) => i !== index);
                            setAttachments(newAttachments);
                          }}
                          className="p-1 text-gray-400 hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors"
                          title="Remove file"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/30">
                      <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-400">No attachments yet</p>
                      <p className="text-xs text-gray-500 mt-1">Upload files to support your proposal</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => onApply(job.id, proposal, rate, rateType, attachments)}
                disabled={!proposal.trim()}
                className="w-full h-10 bg-purple-600 hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50 text-white font-medium rounded-lg shadow-lg transition-all duration-200"
              >
                Send Proposal
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
