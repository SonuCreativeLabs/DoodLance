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
import { useAuth } from "@/contexts/AuthContext"
import { TutorialTour } from "@/components/common/tutorial/TutorialTour"
import { HelpCircle } from "lucide-react"
import { AppGuideModal } from "@/components/common/tutorial/AppGuideModal"
import { useState } from "react"

interface ClientLayoutProps {
  children: ReactNode
  className?: string
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isClientHome = !pathname || pathname === '/' || pathname === '/client' || pathname === '/client/';
  const isServicePage = pathname === '/client/services';
  const isBookingDetails = pathname?.startsWith('/client/bookings/') && pathname !== '/client/bookings';
  const shouldHideGlobalHeader = isClientHome || isServicePage || isBookingDetails;
  const { switchRole } = useRoleSwitch();
  const { isAuthenticated, user } = useAuth();
  const [showAppGuide, setShowAppGuide] = useState(false);

  const handleSwitchToFreelancer = () => {
    switchRole('freelancer');
  };

  const { isNavbarVisible } = useNavbar();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname === '/client' || pathname === '/client/';
    }
    return pathname?.startsWith(path);
  }

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/client/nearby/hirefeed', label: 'Hire', icon: Compass },
    { href: '/client/bookings', label: 'Bookings', icon: Calendar },
  ]

  return (
    <ChatViewProvider>
      <div className={cn("min-h-screen bg-[#111111] flex flex-col overflow-x-hidden", className)}>

        {/* Desktop Header */}
        {isNavbarVisible && !shouldHideGlobalHeader && (
          <nav className={cn(
            "hidden md:block fixed top-0 left-0 right-0 border-b border-white/10 z-[100] backdrop-blur-xl",
            isClientHome
              ? "bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69]"
              : "bg-[#111111]/95"
          )}>
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
              <div className="flex items-center">
                <Link href="/" className="flex items-center ml-[5%]">
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
                      id={`nav-${item.label.toLowerCase()}-desktop`}
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
                  id="nav-earn-desktop"
                  onClick={handleSwitchToFreelancer}
                  className="px-4 py-2 rounded-xl flex items-center space-x-1.5 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 text-black shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 border border-transparent"
                >
                  <span className="text-sm font-bold whitespace-nowrap">Earn</span>
                  <span className="text-sm">💰</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                {/* Unauthenticated State: Show Login Button */}
                {!isAuthenticated ? (
                  <Link
                    href="/welcome"
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                  >
                    Login
                  </Link>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      id="nav-account-desktop"
                      href="/client/profile"
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 cursor-pointer group overflow-hidden"
                      title="My Profile"
                    >
                      <Image
                        src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'}
                        alt="Profile"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </Link>
                    <button
                      onClick={() => setShowAppGuide(true)}
                      className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 cursor-pointer group"
                      title="App Guide"
                    >
                      <HelpCircle className="w-5 h-5 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
                    </button>
                    <div className="relative">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 cursor-pointer group">
                        <Bell className="w-5 h-5 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
                      </div>
                    </div>
                  </div>
                )}
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
                  href="/"
                  className="flex flex-col items-center justify-center p-2 min-w-[64px]"
                >
                  <div
                    id="nav-home"
                    className={cn(
                      "flex flex-col items-center justify-center transition-all duration-300 px-1 py-1.5 rounded-xl border border-transparent min-w-[64px]",
                      pathname === "/" || pathname === "/client" || pathname === "/client/"
                        ? "bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-white border-purple-500/30"
                        : "text-gray-400 hover:text-gray-300"
                    )}>
                    <Home className={cn("h-5 w-5", pathname === "/" || pathname === "/client" || pathname === "/client/" ? "text-purple-400" : "")} strokeWidth={2} />
                    <span className="text-[12px] mt-1 font-medium">Home</span>
                  </div>
                </Link>

                <Link
                  href="/client/nearby/hirefeed"
                  className="flex flex-col items-center justify-center p-2 min-w-[64px]"
                >
                  <div
                    id="nav-hire-mobile"
                    className={cn(
                      "flex flex-col items-center justify-center transition-all duration-300 px-1 py-1.5 rounded-xl border border-transparent min-w-[64px]",
                      pathname.startsWith("/client/nearby")
                        ? "bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-white border-purple-500/30"
                        : "text-gray-400 hover:text-gray-300"
                    )}>
                    <Compass className={cn("h-5 w-5", pathname.startsWith("/client/nearby") ? "text-purple-400" : "")} strokeWidth={2} />
                    <span className="text-[12px] mt-1 font-medium">Hire</span>
                  </div>
                </Link>

                <Link
                  href="/client/bookings"
                  className="flex flex-col items-center justify-center p-2 min-w-[64px]"
                >
                  <div
                    id="nav-bookings-mobile"
                    className={cn(
                      "flex flex-col items-center justify-center transition-all duration-300 px-1 py-1.5 rounded-xl border border-transparent min-w-[64px]",
                      pathname.startsWith("/client/bookings")
                        ? "bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-white border-purple-500/30"
                        : "text-gray-400 hover:text-gray-300"
                    )}>
                    <Calendar className={cn("h-5 w-5", pathname.startsWith("/client/bookings") ? "text-purple-400" : "")} strokeWidth={2} />
                    <span className="text-[12px] mt-1 font-medium">Bookings</span>
                  </div>
                </Link>

                <div className="flex items-center justify-center min-w-[64px]">
                  <div
                    id="nav-earn-mobile-final"
                    onClick={handleSwitchToFreelancer}
                    className="flex items-center justify-center group h-9 px-3 xs:px-4 bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 w-fit cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold text-black whitespace-nowrap">Earn</span>
                      <span className="text-[13px]">💰</span>
                      <svg className="h-4 w-4 text-black flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )
        }
      </div >
      <TutorialTour />
      <AppGuideModal isOpen={showAppGuide} onClose={() => setShowAppGuide(false)} />
    </ChatViewProvider >
  )
}