'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  X,
  MessageCircle,
  MapPin,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  FileText,
  Trash2,
  AlertCircle,
  User,
  Star,
  CheckCircle,
  XCircle,
  Phone,
  Eye,
  UploadCloud,
  PlusCircle,
  ArrowLeft,
  Briefcase,
  Calendar
} from 'lucide-react';
import { Application } from '@/components/freelancer/jobs/types';
import { ClientProfile } from '@/components/freelancer/jobs/ClientProfile';
import { SuccessMessage } from '@/components/ui/success-message';
import { getCategoryDisplayName } from '@/components/freelancer/jobs/utils';
import { CollapsibleTimeline, createTimelineItems } from '@/components/freelancer/jobs/CollapsibleTimeline';
import { getJobDurationLabel } from '@/app/freelancer/feed/types';

export default function ProposalDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [proposal, setProposal] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const yourProposalRef = useRef<HTMLDivElement>(null);

  // Success message state
  const [successMessage, setSuccessMessage] = useState<{
    message: string;
    description?: string;
    variant?: 'success' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    description: '',
    variant: 'success',
    isVisible: false
  });

  // Helper function to show success messages
  const showSuccessMessage = (message: string, description?: string, variant: 'success' | 'warning' | 'info' = 'success') => {
    setSuccessMessage({
      message,
      description,
      variant,
      isVisible: true
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setSuccessMessage(prev => ({ ...prev, isVisible: false }));
    }, 5000);
  };

  useEffect(() => {
    const loadApplication = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/applications/${id}`);
        if (!res.ok) {
          throw new Error('Failed to load application');
        }

        const data = await res.json();

        // Map API response to Application type
        const mappedProposal: Application = {
          "#": data.id,
          jobId: data.jobId,
          jobTitle: data.job?.title || 'Unknown Job',
          appliedDate: data.createdAt,
          status: data.status === 'WITHDRAWN' ? 'withdrawn' : (data.status.toLowerCase() as any),
          clientName: data.job?.client?.name || 'Unknown Client',
          budget: {
            min: data.job?.budget || 0,
            max: data.job?.budget || 0
          },
          progress: 0,
          location: data.job?.location || 'Remote',
          postedDate: data.job?.createdAt || new Date().toISOString(),
          scheduledAt: data.job?.scheduledAt,
          description: data.job?.description || '',
          clientId: data.job?.clientId || '',
          category: data.job?.category || 'OTHER',
          // Client stats
          rating: data.job?.client?.rating || 0,
          projectsCompleted: data.job?.client?.jobsCompleted || 0,
          clientSince: data.job?.client?.createdAt,
          clientImage: data.job?.client?.avatar || data.job?.client?.image,
          clientRating: data.job?.client?.rating,
          // Proposal details
          proposal: {
            coverLetter: data.coverLetter || '',
            proposedRate: data.proposedRate || 0,
            estimatedDays: data.estimatedDays || 1,
            skills: data.featuredSkills || [],
            attachments: data.attachments || []
          },
          // Extra mock-like fields
          clientViewedAt: data.clientViewedAt,
          moneySpent: 0,
          freelancersWorked: 0,
        };

        setProposal(mappedProposal);

        // Check if we should auto-enable edit mode (from card edit button)
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get('edit') === 'true') {
            setIsEditing(true);
            setEditedProposal(mappedProposal);

            // Auto-scroll to Your Proposal section after a short delay to ensure DOM is updated
            setTimeout(() => {
              if (yourProposalRef.current) {
                yourProposalRef.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                });
              }
            }, 500);
          }
        }
      } catch (error) {
        console.error('Error loading application:', error);
        setProposal(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadApplication();
    }
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const [editedProposal, setEditedProposal] = useState<Application | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProposal(proposal);

    // Scroll to Your Proposal section after a short delay to ensure DOM is updated
    setTimeout(() => {
      if (yourProposalRef.current) {
        yourProposalRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const handleSaveEdit = async () => {
    if (!editedProposal || !proposal) return;

    setIsWithdrawing(true);
    try {
      const response = await fetch(`/api/applications/${proposal["#"]}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coverLetter: editedProposal.proposal.coverLetter,
          proposedRate: editedProposal.proposal.proposedRate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update proposal');
      }

      showSuccessMessage('Proposal updated successfully!');

      // Update local state
      setProposal(editedProposal);
      setIsEditing(false);

    } catch (error) {
      console.error('Error updating proposal:', error);
      alert('Error updating proposal. Please check your connection and try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleChat = () => {
    if (proposal?.jobId) {
      // Navigate to inbox with specific job chat selection
      router.push(`/freelancer/inbox?jobId=${proposal.jobId}&role=freelancer`);
    } else {
      alert('Chat functionality will be implemented soon!');
    }
  };

  const handleCall = () => {
    if (proposal?.jobId) {
      // Ideally we would trigger a call action or show phone number
      alert('Call functionality will be implemented soon!');
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
    const allowedTypes = ['application/pdf', 'image/jpeg'];
    const currentAttachments = editedProposal?.proposal.attachments || [];

    const newFiles: string[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Only PDF and JPG files are allowed`);
        return;
      }

      // Check file size
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size must be less than 10MB`);
        return;
      }

      // Check if file already exists
      if (currentAttachments.includes(file.name)) {
        errors.push(`${file.name}: File already exists`);
        return;
      }

      newFiles.push(file.name);
    });

    if (errors.length > 0) {
      alert(`Upload failed:\n${errors.join('\n')}`);
      return;
    }

    if (newFiles.length > 0) {
      setEditedProposal(prev => prev ? {
        ...prev,
        proposal: {
          ...prev.proposal,
          attachments: [...currentAttachments, ...newFiles]
        }
      } : null);

      alert(`Successfully added ${newFiles.length} file(s)!`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProposal(null);
  };

  const handleRemoveFile = (fileName: string) => {
    setEditedProposal(prev => prev ? {
      ...prev,
      proposal: {
        ...prev.proposal,
        attachments: prev.proposal.attachments.filter(file => file !== fileName)
      }
    } : null);

    alert(`"${fileName}" has been removed from attachments.`);
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      console.log('Withdrawing proposal:', proposal?.["#"]);

      const response = await fetch(`/api/applications/${proposal?.["#"]}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to withdraw proposal');
      }

      // Close modal
      setShowWithdrawConfirm(false);

      // Show success message
      showSuccessMessage('Proposal withdrawn successfully!', undefined, 'warning');

      // Update local state
      setProposal(prev => prev ? { ...prev, status: 'withdrawn' } : null);

      // Navigate back to proposals page after a short delay
      setTimeout(() => {
        router.push('/freelancer/jobs?tab=applications&status=withdrawn');
      }, 1000);

    } catch (error) {
      console.error('Error withdrawing proposal:', error);
      alert('Error withdrawing proposal. Please check your connection and try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] text-white">
        <div className="bg-[#111111] min-h-screen flex items-center justify-center">
          Loading proposal details...
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-4 z-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Proposal Not Found</h1>
          <p className="text-white/60 mb-6">The proposal you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button
            onClick={() => router.push('/freelancer/jobs?tab=applications')}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Back to Proposals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#111111] to-[#0a0a0a] overflow-y-auto">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F0F] border-b border-white/5">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
                  aria-label="Go back"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                </button>
                <div className="ml-3">
                  <h1 className="text-lg font-semibold text-white">
                    {proposal.status === 'accepted' ? 'Accepted Proposal' :
                      proposal.status === 'rejected' ? 'Rejected Proposal' :
                        proposal.status === 'completed' ? 'Completed Job' :
                          proposal.status === 'cancelled' ? 'Cancelled Job' :
                            proposal.status === 'withdrawn' ? 'Withdrawn Proposal' :
                              'Pending Proposal'}
                  </h1>
                  <p className="text-white/50 text-xs">
                    {proposal.category ? getCategoryDisplayName(proposal.category) : 'Category not specified'}
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-white/60">{proposal["#"]}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="min-h-[100dvh] w-full pt-20 pb-24">
          <div className="max-w-3xl mx-auto p-4 md:p-6">
            <div className="space-y-6">

              {/* Withdrawal Info */}
              {proposal.status === 'withdrawn' && (
                <div className="rounded-xl bg-gray-500/10 border border-gray-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Proposal Withdrawn</h3>
                      <p className="text-sm text-gray-300/80 mb-2">
                        This proposal has been withdrawn.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rejection Info */}
              {proposal.status === 'rejected' && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <XCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-red-400 mb-1">Proposal Rejected</h3>
                      <p className="text-sm text-red-300/80 mb-2">
                        Unfortunately, your proposal was not selected.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Header Section */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg"></div>
                    <div className="relative p-4 rounded-full bg-gradient-to-br from-purple-500/10 to-purple-600/20 border border-purple-500/30">
                      <FileText className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-white">Proposal Details</h1>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                    Review your proposal submission and track its progress.
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <CollapsibleTimeline
                items={createTimelineItems('proposal', proposal)}
                title="Application Timeline"
                defaultExpanded={false}
              />

              {/* Job Title & Location */}
              <div className="mb-8">
                <div className="space-y-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                    {proposal.jobTitle}
                    <span className="inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-white/80 bg-white/10 border border-white/20 rounded-full whitespace-nowrap ml-2 align-middle">
                      On field
                    </span>
                  </h1>
                  <button
                    type="button"
                    onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(proposal.location)}`, '_blank')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  >
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span className="font-medium">{proposal.location}</span>
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
                          {['pending', 'rejected', 'withdrawn'].includes(proposal.status)
                            ? `₹${proposal.budget.max.toLocaleString('en-IN')}`
                            : `₹${proposal.budget.min.toLocaleString('en-IN')} - ₹${proposal.budget.max.toLocaleString('en-IN')}`
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">Duration</div>
                      <div className="text-white font-medium capitalize">{getJobDurationLabel(proposal as any)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">Scheduled</div>
                      <div className="text-white font-medium">
                        {proposal.scheduledAt ? new Date(proposal.scheduledAt).toLocaleDateString() : 'Date TBD'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-400">Experience</div>
                      <div className="text-white font-medium">{proposal.experienceLevel || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About the Job */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg mb-6">
                <div className="relative p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">About the Job</h2>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    {proposal.description && (
                      <p className="text-white/80 leading-relaxed mb-6">
                        {proposal.description}
                      </p>
                    )}

                    {proposal.proposal.skills && proposal.proposal.skills.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-white/5">
                        <h3 className="text-md font-semibold text-white mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {proposal.proposal.skills.map((skill: string, i: number) => (
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
                  name: proposal.clientName,
                  image: proposal.clientImage,
                  location: proposal.location,
                  memberSince: proposal.clientSince,
                  rating: proposal.clientRating,
                  moneySpent: proposal.moneySpent,
                  jobsCompleted: proposal.projectsCompleted,
                  freelancersWorked: proposal.freelancersWorked,
                  freelancerAvatars: proposal.freelancerAvatars,
                  experienceLevel: proposal.experienceLevel
                }}
                location={proposal.location}
                showCommunicationButtons={proposal.status === 'accepted'}
                onChat={handleChat}
                onCall={handleCall}
              />

              {/* Your Proposal */}
              <div ref={yourProposalRef} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg">
                <div className="relative p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-white/90">
                        {proposal.status === 'withdrawn' ? 'Withdrawn Proposal' : 'Your Proposal'}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {proposal.status === 'pending' && !isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400/50 transition-all"
                          onClick={handleEdit}
                        >
                          Edit Proposal
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Cover Letter</h3>
                      {isEditing ? (
                        <textarea
                          value={editedProposal?.proposal.coverLetter || ''}
                          onChange={(e) => setEditedProposal(prev => prev ? {
                            ...prev,
                            proposal: { ...prev.proposal, coverLetter: e.target.value }
                          } : null)}
                          className="w-full p-3 bg-[#111111] border border-gray-600 rounded-xl text-white resize-none text-sm"
                          rows={6}
                          placeholder="Explain why you're the best fit for this job..."
                        />
                      ) : (
                        <p className="text-gray-300 text-sm leading-relaxed">{proposal.proposal.coverLetter}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 border-gray-600/50 text-white/90 hover:bg-[#111111] hover:text-white hover:border-gray-500/50 transition-all duration-200"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 h-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200"
                    onClick={handleSaveEdit}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              ) : proposal.status === 'pending' ? (
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-10 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-400/50 transition-all hover:shadow-lg hover:shadow-red-500/10"
                    onClick={() => setShowWithdrawConfirm(true)}
                  >
                    Withdraw Proposal
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
        {showWithdrawConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#111111] via-[#0f0f0f] to-[#111111] border border-gray-600/30 shadow-lg p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-white">Withdraw Proposal</h3>
                <p className="mt-2 text-sm text-gray-400">
                  Are you sure you want to withdraw your proposal? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-center space-x-3">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-[#1e1e1e] hover:text-gray-200"
                    onClick={() => setShowWithdrawConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-500/10 hover:text-red-400"
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Success Message */}
        <SuccessMessage
          message={successMessage.message}
          description={successMessage.description}
          isVisible={successMessage.isVisible}
          variant={successMessage.variant}
          position="center"
          onClose={() => setSuccessMessage(prev => ({ ...prev, isVisible: false }))}
        />
      </div>
    </>
  );
}
