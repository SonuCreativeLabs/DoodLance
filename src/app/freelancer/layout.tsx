"use client"

import { FreelancerNav } from "@/components/layout/freelancer-nav"

interface FreelancerLayoutProps {
  children: React.ReactNode
}

export default function FreelancerLayout({ children }: FreelancerLayoutProps) {
  return (
    <div className="min-h-screen h-screen flex flex-col bg-gray-50">
      <main className="flex-1 relative">
        {children}
      </main>
      <FreelancerNav />
    </div>
  )
} 