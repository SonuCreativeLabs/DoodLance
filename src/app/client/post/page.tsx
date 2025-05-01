"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostJobForm from "@/components/job/post-job-form";

export default function PostPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Post a Job</h1>
      
      <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-6 rounded-xl border border-purple-100 shadow-lg mb-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-2">Post a Job</h2>
        <p className="text-purple-700">
          Describe your task and let skilled professionals apply to help you. Our AI will help categorize your job and suggest fair rates.
        </p>
      </div>
      
      <PostJobForm />
    </div>
  );
} 