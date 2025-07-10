'use client';

import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { SkillsSection } from "@/components/freelancer/profile/SkillsSection";
import { useLayout } from '@/contexts/LayoutContext';

export default function SkillsPage() {
  const { hideHeader, hideNavbar, showHeader, showNavbar } = useLayout();

  useEffect(() => {
    // Hide header and navbar when component mounts
    hideHeader();
    hideNavbar();

    // Show header and navbar when component unmounts
    return () => {
      showHeader();
      showNavbar();
    };
  }, [hideHeader, hideNavbar, showHeader, showNavbar]);
  return (
    <div className="container mx-auto px-4 py-8 pb-24">
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
              <h1 className="text-xl font-bold">My Skills</h1>
              <p className="text-white/60 text-sm mt-0.5">
                List all your skills - every talent has value here. Turn what you love into opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 pb-8">
        <SkillsSection />
      </div>
    </div>
  );
}
