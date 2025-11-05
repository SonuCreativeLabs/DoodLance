"use client";

import { useRouter } from 'next/navigation';
// import Image from 'next/image' // Unused;
import { ArrowLeft } from 'lucide-react';
import PostJobForm from "@/components/job/post-job-form";

export default function PostPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      {/* Simple Header */}
      <div className="bg-[#111111] border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14">
            <button
              onClick={() => router.back()}
              aria-label="Go back"
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          <PostJobForm />
        </div>
      </div>
    </div>
  );
} 