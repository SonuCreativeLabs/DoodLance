"use client"

import React, { ReactNode, useEffect } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, Briefcase, PlusCircle, MessageSquare } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { ChatViewProvider } from "@/contexts/ChatViewContext"
import { useNavbar } from "@/contexts/NavbarContext"

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

  const { isNavbarVisible } = useNavbar();

  return (
    <ChatViewProvider>
      <div className={cn("min-h-screen bg-[#111111] flex flex-col overflow-x-hidden", className)}>
        <main className={cn("flex-1 flex flex-col w-full overflow-x-hidden", isNavbarVisible ? "pb-2" : "pb-0")}>
          <div className="w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      
      {/* Bottom Navigation */}
      {isNavbarVisible && (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#111111] backdrop-blur-md border-t border-gray-800/50 z-50 w-full">
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-5 items-center h-16">
              {/* Main Navigation Items */}
              <Link 
                href="/client" 
                className="flex flex-col items-center justify-center"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  pathname === "/client" || pathname === "/client/" ? "text-white" : "text-gray-400"
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
                  pathname.startsWith("/client/bookings") ? "text-white" : "text-gray-400"
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
                  pathname.startsWith("/client/nearby") ? "text-white" : "text-gray-400"
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
                  pathname.startsWith("/client/inbox") ? "text-white" : "text-gray-400"
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
                className="flex items-center justify-center group relative h-10 px-4 bg-gradient-to-r from-purple-600 to-purple-500 rounded-l-full rounded-r-none shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ml-auto"
              >
                <div className="flex items-center gap-1">
                  <span className="text-[13px] font-bold text-white">EARN</span>
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
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