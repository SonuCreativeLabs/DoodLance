'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  if (status === 'in_review') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto py-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/freelancer/profile" 
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Verification Submitted</h1>
              <p className="text-white/60 text-sm mt-0.5">Your documents are under review</p>
            </div>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Thank you for submitting your ID. Our team is reviewing your documents.
            You'll receive a notification once your verification is complete.
          </p>
          <Button asChild>
            <Link href="/freelancer/profile" className="min-w-[180px]">Back to Profile</Link>
          </Button>
        </div>
        </div>
      </div>
    );
  }

  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-4">
            <Link 
              href="/freelancer/profile" 
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Identity Verification</h1>
              <p className="text-white/60 text-sm mt-0.5">Complete your identity verification to access all features</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl border border-white/10 p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-medium text-white">Verify Your Identity</h2>
            <p className="text-white/60 text-sm mt-1">
              To verify your identity, please upload a valid government-issued ID.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[#2A2A2A] rounded-lg border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1E1E1E] rounded-lg">
                <FileText className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Government ID</h3>
                <p className="text-xs text-white/60">Passport, Driver's License, or National ID</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/freelancer/profile/verification/upload">
                Start Verification
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
