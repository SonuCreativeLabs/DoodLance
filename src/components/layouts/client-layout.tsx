"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, Briefcase, PlusCircle, MessageSquare, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface ClientLayoutProps {
  children: ReactNode
  className?: string
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  const router = useRouter();

  const handleSwitchToFreelancer = () => {
    router.push('/freelancer');
  };

  return (
    <div className={cn("min-h-screen bg-background flex flex-col", className)}>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="flex justify-around items-center">
            <Link href="/client" className="flex flex-col items-center">
              <Home className="w-5 h-5" />
              <span className="text-xs mt-0.5">Home</span>
            </Link>
            <Link href="/client/hires" className="flex flex-col items-center">
              <Briefcase className="w-5 h-5" />
              <span className="text-xs mt-0.5">Hires</span>
            </Link>
            <Link href="/client/post" className="flex flex-col items-center">
              <PlusCircle className="w-5 h-5" />
              <span className="text-xs mt-0.5">Post</span>
            </Link>
            <Link href="/client/inbox" className="flex flex-col items-center">
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs mt-0.5">Inbox</span>
            </Link>
            <button 
              onClick={handleSwitchToFreelancer}
              className="flex flex-col items-center"
            >
              <User className="w-5 h-5" />
              <span className="text-xs mt-0.5">Work & Earn</span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Add padding to account for fixed bottom nav */}
      <div className="h-14" />
    </div>
  )
} 