"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, Briefcase, PlusCircle, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { ChatViewProvider } from "@/contexts/ChatViewContext"

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

  // Hide navbar on nearby and services pages
  const shouldHideNavbar = pathname.includes('/client/nearby') || pathname.includes('/client/services');

  return (
    <ChatViewProvider>
      <div className={cn("min-h-screen bg-[#111111] flex flex-col", className)}>
        <main className={cn("flex-1 flex flex-col", !shouldHideNavbar && "pb-16")}>
          {children}
        </main>
    
      
      {/* Bottom Navigation */}
      {!shouldHideNavbar && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#111111] backdrop-blur-md border-t border-gray-800/50 z-50">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-5 items-center h-16">
              {/* Main Navigation Items */}
              <Link 
                href="/client" 
                className="flex flex-col items-center justify-center"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  pathname === "/client" ? "text-purple-500" : "text-gray-400"
                )}>
                  <Home className="h-6 w-6" strokeWidth={2} />
                  <span className="text-[13px] mt-1.5 font-medium">Home</span>
                </div>
              </Link>

              <Link 
                href="/client/bookings" 
                className="flex flex-col items-center justify-center"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  pathname === "/client/bookings" ? "text-purple-500" : "text-gray-400"
                )}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[13px] mt-1.5 font-medium">Bookings</span>
                </div>
              </Link>

              <Link 
                href="/client/nearby/integrated-explore" 
                className="flex flex-col items-center justify-center"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  pathname === "/client/nearby/integrated-explore" ? "text-purple-500" : "text-gray-400"
                )}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[13px] mt-1.5 font-medium">Hire</span>
                </div>
              </Link>

              <Link 
                href="/client/inbox" 
                className="flex flex-col items-center justify-center"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  pathname === "/client/inbox" ? "text-purple-500" : "text-gray-400"
                )}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span className="text-[13px] mt-1.5 font-medium">Inbox</span>
                </div>
              </Link>

              {/* Work & Earn Button */}
              <button 
                onClick={handleSwitchToFreelancer}
                className="flex flex-col items-center justify-center group relative"
              >
                <div className="relative flex flex-col items-center">
                  <div className="relative h-6 w-6 flex items-center justify-center">
                    <span className="text-xl group-hover:scale-110 transition-transform">💰</span>
                  </div>
                  <div className="relative mt-1.5">
                    <span className="text-[13px] font-bold bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-300 bg-clip-text text-transparent">EARN</span>
                  </div>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-2 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[11px] rounded-md whitespace-nowrap font-bold">
                    Switch to freelancer
                  </div>
                  <div className="w-2 h-2 bg-amber-500 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
              </button>
            </div>
          </div>
        </nav>
      )}
      </div>
    </ChatViewProvider>
  )
}