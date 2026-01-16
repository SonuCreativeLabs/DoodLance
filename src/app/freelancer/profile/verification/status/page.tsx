'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, FileText } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VerificationStatusPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  if (status === 'verified') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto py-8">
          {/* Header with Back Button */}
          <div className="flex items-center mb-0">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
              aria-label="Go back"
              type="button"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </button>
          </div>

          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-6">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Verification Complete!</h2>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Congratulations! Your identity has been successfully verified. You now have access to all verified freelancer features.
            </p>

            <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Verification Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Status:</span>
                  <span className="text-green-400 font-medium">Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Verification Type:</span>
                  <span className="text-white">ID Document + Selfie</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Verified On:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Verification Badge:</span>
                  <span className="text-white">Active</span>
                </div>
              </div>
            </div>

            <p className="text-white/50 text-sm mb-8">
              Your verified status will be displayed on your profile and gives clients confidence in your identity.
            </p>

            <div className="flex justify-center">
              <Button asChild className="min-w-[200px] bg-white text-black hover:bg-gray-200">
                <Link href="/freelancer/profile">
                  Back to Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'in_review') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
                aria-label="Go back"
                type="button"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </button>
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
            <h2 className="text-2xl font-bold text-white mb-4">Thank You!</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">
              We&apos;ve received your verification documents and they are currently under review.
              You&apos;ll receive a notification once your verification is complete.
              This usually takes 8-48 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-6">
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Verification Status</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Check the status of your identity verification here.
          </p>
          <Button asChild>
            <Link href="/freelancer/profile/verification" className="min-w-[180px]">
              Start Verification
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
