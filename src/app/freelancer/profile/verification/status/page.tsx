'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerificationStatusPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const router = useRouter();

  if (status === 'in_review') {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto py-8">
          <div className="flex items-center mb-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 group"
                aria-label="Go back"
                type="button"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4" />
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
              We've received your verification documents and they are currently under review.
              You'll receive a notification once your verification is complete.
              This usually takes 1-2 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/freelancer/profile" className="min-w-[180px]">
                  Back to Profile
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/freelancer/dashboard" className="min-w-[180px]">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view if no status is provided
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
