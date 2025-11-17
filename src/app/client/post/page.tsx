"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import Image from 'next/image' // Unused;
import { ArrowLeft } from 'lucide-react';
import PostJobForm from "@/components/job/post-job-form";
import { useNavbar } from '@/contexts/NavbarContext';

export default function PostPage() {
  const router = useRouter();
  const { setNavbarVisibility } = useNavbar();

  useEffect(() => {
    // Hide bottom navbar when component mounts
    setNavbarVisibility(false);

    // Show navbar again when component unmounts
    return () => {
      setNavbarVisibility(true);
    };
  }, [setNavbarVisibility]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col">
      {/* Sticky Header - Matching Profile Page Style */}
      <div className="sticky top-0 z-10 bg-[#0F0F0F] border-b border-white/5 pt-2">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
                <ArrowLeft className="h-4 w-4" />
              </div>
            </button>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-white">Post a Job</h1>
              <p className="text-white/50 text-xs">Find the perfect cricket professional for your needs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient separation line */}
      <div className="relative py-1">
        <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <PostJobForm />
          </div>
        </div>
      </div>
    </div>
  );
} 