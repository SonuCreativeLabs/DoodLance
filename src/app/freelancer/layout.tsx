"use client"

import { Bell, Wallet, Home, Inbox, Briefcase, User, Compass } from 'lucide-react'
import { useEffect, useState } from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChatViewProvider, useChatView } from '@/contexts/ChatViewContext';
import { useModal } from '@/contexts/ModalContext';
import { DateRangeProvider } from '@/contexts/DateRangeContext';
import { useLayout } from '@/contexts/LayoutContext';

interface FreelancerLayoutProps {
  children: React.ReactNode
}

// Wrapper component to handle the chat view context
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Use a ref to track if we're in a browser environment
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Always call the hook at the top level
  const chatView = useChatView();
  // Only access the context value after mount
  const fullChatView = isMounted ? chatView?.fullChatView || false : false;
  
  return (
    <FreelancerLayoutInner fullChatView={fullChatView} pathname={pathname}>
      {children}
    </FreelancerLayoutInner>
  );
}

// Inner layout component that receives fullChatView as a prop
function FreelancerLayoutInner({ 
  children, 
  fullChatView = false,
  pathname 
}: FreelancerLayoutProps & { fullChatView?: boolean; pathname: string }) {
  const { isHeaderVisible: contextHeaderVisible, isNavbarVisible: contextNavbarVisible } = useLayout();
  const { isModalOpen } = useModal();
  
  // Check if current path is a preview page
  const isPreviewPage = pathname?.startsWith('/freelancer/profile/preview');
  
  // Hide header and navbar for preview pages
  const isHeaderVisible = isPreviewPage ? false : contextHeaderVisible;
  const isNavbarVisible = isPreviewPage ? false : contextNavbarVisible;
  
  // Rest of the component logic remains the same

  const isActive = (path: string) => {
    // Handle home page specifically
    if (path === '/freelancer' || path === '/freelancer/') {
      return pathname === '/freelancer' || pathname === '/freelancer/';
    }
    // For other paths, check if current path starts with the nav item path
    return pathname?.startsWith(path);
  }

  const navItems = [
    { href: '/freelancer', label: 'Home', icon: Home },
    { href: '/freelancer/jobs', label: 'My Jobs', icon: Briefcase },
    { href: '/freelancer/feed', label: 'Feed', icon: Compass },
    { href: '/freelancer/inbox', label: 'Inbox', icon: Inbox },
    { href: '/freelancer/profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#111111] text-white relative">
      {/* Header */}
      {isHeaderVisible && !fullChatView && !isModalOpen && (
        <nav className="fixed top-0 left-0 right-0 border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl z-[100]">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link 
                href="/freelancer"
                className="flex items-center -ml-6"
              >
                <img
                  src="/images/LOGOS/ts wordmark LOGO.svg"
                  alt="DoodLance"
                  className="h-30 w-auto hover:opacity-80 transition-opacity duration-300"
                />
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-300 group ${
                        active
                          ? 'bg-gradient-to-r from-purple-600/20 to-purple-400/20 text-white border border-purple-500/30'
                          : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-colors duration-300 ${active ? 'text-purple-400' : 'group-hover:text-purple-400'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <a href="/freelancer/wallet" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-l from-purple-600 to-purple-400 hover:from-purple-500 hover:to-purple-300 transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 group">
                  <Wallet className="w-4 h-4 text-white transition-colors duration-300" />
                  <span className="text-sm font-medium text-white transition-colors duration-300">₹24,500</span>
                </a>
              </div>
              <div className="relative">
                <a href="/freelancer/notifications" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group relative">
                  <Bell className="w-5 h-5 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/20">
                    <span className="text-[10px] font-medium text-white">2</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </nav>
      )}
      {/* Mobile Navigation */}
      {isNavbarVisible && !fullChatView && !isModalOpen && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#111111]/95 backdrop-blur-lg z-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-5 items-center h-16">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-xl transition-all duration-300 ${
                      active 
                        ? 'text-purple-400' 
                        : 'text-white/60'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-colors duration-300 ${active ? 'text-purple-400' : ''}`} />
                    <span className="text-[12px] mt-1 font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
      {!fullChatView && !isModalOpen && isHeaderVisible && <div className="h-16" />}
      <main className={`flex flex-col relative z-10 ${isHeaderVisible ? 'min-h-[calc(100vh-4rem)]' : 'min-h-screen'}`}>
        {children}
      </main>
    </div>
  )
}

export default function FreelancerLayout(props: FreelancerLayoutProps) {
  return (
    <DateRangeProvider>
      <ChatViewProvider>
        <LayoutContent {...props} />
      </ChatViewProvider>
    </DateRangeProvider>
  );
}