'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Star,
  CheckCircle,
  FileText,
  PlusCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { Job, getJobDurationLabel, getWorkModeLabel } from '../types';
import { ClientProfile } from '@/components/freelancer/jobs/ClientProfile';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface JobDetailsFullProps {
  job: Job;
  onBack: () => void;
  onApply: (jobId: string, proposal: string, rate: string, rateType: string, attachments: File[]) => void;
  isApplied?: boolean;
}

export default function JobDetailsFull({ job, onBack, onApply, isApplied = false }: JobDetailsFullProps) {
  const { user } = useAuth();
  const [proposal, setProposal] = useState('');
  const [rate, setRate] = useState(job.budget ? job.budget.toString() : '');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch application details if already applied
  useEffect(() => {
    if (isApplied && user?.id) {
      const fetchApplication = async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/applications?myApplications=true&userId=${user.id}&jobId=${job.id}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              const application = data[0];
              setProposal(application.coverLetter || '');
              setRate(application.proposedRate ? application.proposedRate.toString() : '');
            }
          }
        } catch (error) {
          console.error('Error fetching application details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchApplication();
    }
  }, [isApplied, job.id, user?.id]);

  // Generate stable job ID based on category and job ID
  const jobId = useMemo(() => {
    type CategoryCode = 'Sports' | 'Technology' | 'Business' | 'Education' | 'Healthcare' | 'Other';
    const categoryCodes: Record<CategoryCode, string> = {
      'Sports': 'SPT',
      'Technology': 'TEC',
      'Business': 'BUS',
      'Education': 'EDU',
      'Healthcare': 'HCR',
      'Other': 'OTH'
    };
    
    // Safely get the category code with a type assertion
    const code = (job.category in categoryCodes) 
      ? categoryCodes[job.category as CategoryCode] 
      : 'JOB';

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

  if (!job) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0A] z-[9999] flex items-center justify-center">
        <div className="text-white text-lg">Loading job details...</div>
      </div>
    );
  }

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
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Job ID: {jobId}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-32 px-4 w-full max-w-4xl mx-auto">
        {/* Rest of your JSX content */}
        {/* ... */}
      </main>
    </div>
  );
}
