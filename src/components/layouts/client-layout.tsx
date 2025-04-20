"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, Briefcase, PlusCircle, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"

interface ClientLayoutProps {
  children: ReactNode
  className?: string
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitchToFreelancer = () => {
    router.push('/freelancer');
  };

  return (
    <div className={cn("min-h-screen bg-background flex flex-col", className)}>
      <main className="flex-1 flex flex-col pb-16">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-12 items-center h-16">
            {/* Main Navigation Items */}
            <div className="col-span-9 flex justify-around px-4">
              <Link 
                href="/client" 
                className="flex flex-col items-center w-16"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  pathname === "/client" ? "text-[#FF8A3D]" : "text-gray-400"
                )}>
                  <Home className="h-6 w-6" />
                  <span className="text-[12px] mt-1 font-medium">Home</span>
                </div>
              </Link>

              <Link 
                href="/client/hires" 
                className="flex flex-col items-center w-16"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  pathname === "/client/hires" ? "text-[#FF8A3D]" : "text-gray-400"
                )}>
                  <Briefcase className="h-6 w-6" />
                  <span className="text-[12px] mt-1 font-medium">Hires</span>
                </div>
              </Link>

              <Link 
                href="/client/post" 
                className="flex flex-col items-center w-16"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  pathname === "/client/post" ? "text-[#FF8A3D]" : "text-gray-400"
                )}>
                  <PlusCircle className="h-6 w-6" />
                  <span className="text-[12px] mt-1 font-medium">Post</span>
                </div>
              </Link>

              <Link 
                href="/client/inbox" 
                className="flex flex-col items-center w-16"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  pathname === "/client/inbox" ? "text-[#FF8A3D]" : "text-gray-400"
                )}>
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-[12px] mt-1 font-medium">Inbox</span>
                </div>
              </Link>
            </div>
            
            {/* Work & Earn Button */}
            <div className="col-span-3">
              <button 
                onClick={handleSwitchToFreelancer}
                className="flex items-center h-16 w-full"
              >
                <div className="flex items-center justify-end h-full w-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-l-full px-4">
                  <div className="flex flex-col items-end">
                    <span className="text-[14px] font-medium text-white/90 leading-tight mb-[1px] pr-[1px]">Work &</span>
                    <div className="flex items-center">
                      <span className="text-[14px] font-medium text-white leading-tight">Earn</span>
                      <span className="text-[14px] ml-1">💰</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
} 