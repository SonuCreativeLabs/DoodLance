"use client"

import { FreelancerNav } from "@/components/layout/freelancer-nav"

interface FreelancerLayoutProps {
  children: React.ReactNode
}

export default function FreelancerLayout({ children }: FreelancerLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-16">
        {children}
      </main>
      <FreelancerNav />
    </div>
  )
} 