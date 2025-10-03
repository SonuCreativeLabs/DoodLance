import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar,
  MapPin,
  DollarSign,
  User,
  Star,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import { Job } from '../types';

interface JobDetailsFullProps {
  job: Job;
  onBack: () => void;
  onApply: (jobId: string, proposal: string) => void;
}

export default function JobDetailsFull({ job, onBack, onApply }: JobDetailsFullProps) {
  const [proposal, setProposal] = useState('');
  
  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-[9999] w-screen h-screen overflow-y-auto">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 w-screen z-[10000] bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-5 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-white/80 hover:text-white transition-all duration-200 p-2 -ml-2 rounded-full hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-white ml-2">Job Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-32 px-4 w-full max-w-4xl mx-auto">
        {/* Job Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">{job.title}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-purple-400 text-sm font-medium">
              {job.category}
            </span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-1.5" />
              {job.location}
            </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About the Job with Skills */}
            <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">About the Job</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-white/80 leading-relaxed mb-6">
                  {job.description}
                </p>
                
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h3 className="text-md font-semibold text-white mb-3">Skills Required</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-[#2D2D2D] text-white/90 border border-white/5 hover:bg-[#3D3D3D] transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About the Client */}
            <div className="bg-[#111111] rounded-xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Client Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    {job.client?.image || job.clientImage ? (
                      <img 
                        src={(job.client?.image || job.clientImage) as string} 
                        alt={job.client?.name || job.clientName || 'Client'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-medium text-white">{job.client?.name || job.clientName || 'Client'}</h2>
                    <p className="text-sm text-gray-400">{job.client?.location || job.location || 'Location not specified'}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xs font-medium text-gray-400 mb-1">Job Posted</h3>
                      <p className="text-sm text-white/90">
                        {new Date(job.postedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-medium text-gray-400 mb-1">Member Since</h3>
                      <p className="text-sm text-white/90">
                        {job.client?.memberSince ? 
                          new Date(job.client.memberSince).getFullYear() : 
                          new Date().getFullYear() - 1}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {job.client?.freelancerAvatars?.length ? (
                            job.client.freelancerAvatars.map((avatar: string, i: number) => (
                              <img 
                                key={i}
                                src={avatar}
                                alt={`Freelancer ${i + 1}`}
                                className="w-7 h-7 rounded-full border-2 border-[#111111] object-cover"
                              />
                            ))
                          ) : (
                            Array.from({ length: Math.min(3, job.client?.freelancersWorked || job.clientJobs || 1) }).map((_, i) => (
                              <div key={i} className="w-7 h-7 rounded-full bg-purple-500/20 border-2 border-[#111111] flex items-center justify-center">
                                <User className="w-3.5 h-3.5 text-purple-300" />
                              </div>
                            ))
                          )}
                          {(job.client?.freelancersWorked || job.clientJobs || 0) > 3 && (
                            <div className="w-7 h-7 rounded-full bg-purple-500/20 border-2 border-[#111111] flex items-center justify-center">
                              <span className="text-xs font-medium text-purple-300">
                                +{(job.client?.freelancersWorked || job.clientJobs || 0) - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-300 font-medium">
                            {job.client?.freelancersWorked || job.clientJobs || 0} Freelancers
                          </p>
                          <p className="text-xs text-gray-500">Worked with this client</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center space-x-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => {
                              const rating = typeof job.client?.rating === 'number' 
                                ? job.client.rating 
                                : typeof job.clientRating === 'number' 
                                  ? job.clientRating 
                                  : 5; // Default to 5 if no rating is available
                              return (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                                />
                              );
                            })}
                          </div>
                          <span className="text-sm font-medium text-white">
                            {typeof job.client?.rating === 'number' 
                              ? job.client.rating.toFixed(1)
                              : typeof job.clientRating === 'number'
                                ? job.clientRating.toFixed(1)
                                : '5.0'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Client Rating</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-medium text-gray-400 mb-1">Money Spent</h3>
                        <p className="text-sm font-medium text-white/90">
                          ₹{(
                            (job.client?.moneySpent && job.client.moneySpent > 0) 
                              ? job.client.moneySpent 
                              : Math.round(job.budget * 0.8) || 0
                          ).toLocaleString('en-IN')}+
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">On DoodLance</p>
                        <p className="text-xs text-green-400">
                          {job.client?.jobsCompleted || job.clientJobs || 1} {job.client?.jobsCompleted === 1 || job.clientJobs === 1 ? 'Project' : 'Projects'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-[#1E1E1E] rounded-2xl p-6 border border-white/5">
              <h2 className="text-lg font-semibold text-white mb-4">Safety Tips</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">Avoid sharing personal information</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">Never pay to apply for a job</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white/80">Meet in public spaces for interviews</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Apply Now Section */}
        <div className="mt-8 w-full">
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#161618] rounded-2xl p-6 border border-white/5 shadow-2xl w-full max-w-[360px] mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Apply Now</h3>
                <p className="text-xs text-white/60">1 position open</p>
              </div>
            </div>
            <p className="text-sm text-white/70 mb-5">
              Your profile and application will be shared with the client. Make a great first impression!
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="proposal" className="block text-sm font-medium text-white/80 mb-2">
                  Your Message
                </label>
                <textarea
                  id="proposal"
                  className="w-full min-h-[140px] bg-[#1A1A1D] border border-white/5 rounded-xl text-white p-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Explain why you're the best fit for this job..."
                  value={proposal}
                  onChange={e => setProposal(e.target.value)}
                  rows={5}
                />
                <p className="mt-1 text-xs text-white/50 text-right">
                  {proposal.length}/1000 characters
                </p>
              </div>
              
              <button
                onClick={() => onApply(job.id, proposal)}
                disabled={!proposal.trim()}
                className={`w-full py-3.5 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${!proposal.trim() 
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-0.5'}
                `}
              >
                <span>Apply Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <p className="text-xs text-center text-white/50 mt-4">
                By submitting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
