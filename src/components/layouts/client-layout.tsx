"use client"

import React, { ReactNode } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { Home, Compass, Calendar, Briefcase, Bell } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { ChatViewProvider } from "@/contexts/ChatViewContext"
import { useNavbar } from "@/contexts/NavbarContext"
import { useRoleSwitch } from "@/contexts/RoleSwitchContext"

interface ClientLayoutProps {
  children: ReactNode
  className?: string
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isClientHome = pathname === '/client' || pathname === '/client/';
  const isServicePage = pathname === '/client/services';
  const isBookingDetails = pathname?.startsWith('/client/bookings/') && pathname !== '/client/bookings';
  const shouldHideGlobalHeader = isClientHome || isServicePage || isBookingDetails;
  const { switchRole } = useRoleSwitch();

  const handleSwitchToFreelancer = () => {
    switchRole('freelancer');
  };

  const { isNavbarVisible } = useNavbar();

  const isActive = (path: string) => {
    if (path === '/client') {
      return pathname === '/client' || pathname === '/client/';
    }
    return pathname?.startsWith(path);
  }

  const navItems = [
    { href: '/client', label: 'Home', icon: Home },
    { href: '/client/nearby/hirefeed', label: 'Hire', icon: Compass },
    { href: '/client/bookings', label: 'Bookings', icon: Calendar },
  ]

  return (
    <ChatViewProvider>
      <div className={cn("min-h-screen bg-[#111111] flex flex-col overflow-x-hidden", className)}>

        {/* Desktop Header */}
        {isNavbarVisible && !shouldHideGlobalHeader && (
          <nav className="hidden md:block fixed top-0 left-0 right-0 border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl z-[100]">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
              <div className="flex items-center">
                <Link href="/client" className="flex items-center ml-[5%]">
                  <div className="relative h-12 w-32">
                    <Image
                      src="/images/LOGOS/BAILS TG.png"
                      alt="BAILS"
                      fill
                      className="object-cover scale-110"
                    />
                  </div>
                </Link>
              </div>

              {/* Centered Navigation */}
              <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 group",
                        active
                          ? "bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-white border border-purple-500/30"
                          : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 transition-colors duration-300", active ? "text-purple-400" : "group-hover:text-purple-400")} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
                {/* Earn Button */}
                <button
                  onClick={handleSwitchToFreelancer}
                  className="px-4 py-2 rounded-xl flex items-center space-x-1.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 text-black shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-transparent"
                >
                  <span className="text-sm font-bold whitespace-nowrap">Earn</span>
                  <span className="text-sm">💰</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications Placeholder */}
                <div className="relative">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 cursor-pointer group">
                    <Bell className="w-5 h-5 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Padding for fixed header on desktop */}
        {!shouldHideGlobalHeader && <div className="hidden md:block h-16" />}

        <main className={cn("flex-1 flex flex-col w-full overflow-x-hidden", isNavbarVisible ? "pb-24 md:pb-6" : "pb-0")}>
          <div className="w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>

        {/* Bottom Navigation (Mobile Only) */}
        {isNavbarVisible && (
          <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111111] backdrop-blur-md border-t border-gray-800/50 z-50 w-full">
            <div className="max-w-screen-xl mx-auto">
              <div className="flex justify-around items-center h-16 px-2 sm:px-4">
                <Link
                  href="/client"
                  className="flex flex-col items-center justify-center p-2 min-w-[64px]"
                >
                  <div className={cn(
                    "flex flex-col items-center transition-all duration-300 px-3 py-1.5 rounded-xl",
                    pathname === "/client" || pathname === "/client/"
                      ? "text-[var(--purple)] bg-[var(--purple)]/10 font-bold"
                      : "text-gray-400 hover:text-gray-300"
                  )}>
                    <Home className="h-5 w-5" strokeWidth={2} />
                    <span className="text-[12px] mt-1 font-medium">Home</span>
                  </div>
                </Link>

                <Link
                  href="/client/nearby/hirefeed"
                  className="flex flex-col items-center justify-center p-2 min-w-[64px]"
                >
                  <div className={cn(
                    "flex flex-col items-center transition-all duration-300 px-3 py-1.5 rounded-xl",
                    pathname.startsWith("/client/nearby")
                      ? "text-[var(--purple)] bg-[var(--purple)]/10 font-bold"
                      : "text-gray-400 hover:text-gray-300"
                  )}>
                    <Compass className="h-5 w-5" strokeWidth={2} />
                    <span className="text-[12px] mt-1 font-medium">Hire</span>
                  </div>
                </Link>

                <Link
                  href="/client/bookings"
                  className="flex flex-col items-center justify-center p-2 min-w-[64px]"
                >
                  <div className={cn(
                    "flex flex-col items-center transition-all duration-300 px-3 py-1.5 rounded-xl",
                    pathname.startsWith("/client/bookings")
                      ? "text-[var(--purple)] bg-[var(--purple)]/10 font-bold"
                      : "text-gray-400 hover:text-gray-300"
                  )}>
                    <Calendar className="h-5 w-5" strokeWidth={2} />
                    <span className="text-[12px] mt-1 font-medium">Bookings</span>
                  </div>
                </Link>

                {/* Work & Earn Button - Centered in the last grid column */}
                <div className="flex items-center justify-center min-w-[64px]">
                  <button
                    onClick={handleSwitchToFreelancer}
                    className="flex items-center justify-center group h-9 px-3 xs:px-4 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 w-fit"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold text-black whitespace-nowrap">Earn</span>
                      <span className="text-[13px]">💰</span>
                      <svg className="h-4 w-4 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        )
        }
      </div >
    </ChatViewProvider >
  )
}