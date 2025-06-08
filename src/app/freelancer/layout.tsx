"use client"

import { Bell, Wallet, Home, Inbox, Briefcase, User, Compass } from 'lucide-react'
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChatViewProvider, useChatView } from '@/contexts/ChatViewContext';

interface FreelancerLayoutProps {
  children: React.ReactNode
}

// Wrapper component to handle the chat view context
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  let fullChatView = false;
  
  // Safely access the chat view context if available
  try {
    const chatView = useChatView();
    if (chatView) {
      fullChatView = chatView.fullChatView;
    }
  } catch (e) {
    // Context not available, use default value
    console.log('ChatView context not available, using default value');
  }
  
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
  // Rest of the component logic remains the same

  const isActive = (path: string) => {
    if (path === '/freelancer') {
      return pathname === '/freelancer';
    }
    return pathname === path || pathname?.startsWith(path + '/');
  }

  const navItems = [
    { href: '/freelancer', label: 'Home', icon: Home },
    { href: '/freelancer/jobs', label: 'My Jobs', icon: Briefcase },
    { href: '/freelancer/feed', label: 'Feed', icon: Compass },
    { href: '/freelancer/inbox', label: 'Inbox', icon: Inbox },
    { href: '/freelancer/profile', label: 'Profile', icon: User },
  ]

  // For feed, job details, and proposal details pages, we want a minimal layout with just the content and bottom nav
  if (pathname === '/freelancer/feed' || 
      pathname?.startsWith('/freelancer/jobs/') || 
      pathname?.startsWith('/freelancer/proposals/')) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    return (
      <div className="h-[100dvh] overflow-hidden">
        {children}
        {mounted && createPortal(
          <div id="modal-root" className="z-[9999]" />,
          document.body
        )}
        {/* Mobile Navigation - Show for feed page */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#111111]/95 backdrop-blur-lg z-50">
          <div className="flex items-center justify-around h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${
                    active ? 'text-purple-400' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-purple-400' : 'text-white/60'}`} />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </div>
      {!fullChatView && (
        <nav className="fixed top-0 left-0 right-0 border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl z-[100]">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link 
                href="/freelancer" 
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 font-bold text-lg hover:from-purple-500 hover:to-purple-700 transition-all duration-300"
              >
                DoodLance
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
                <a href="/freelancer/notifications" className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 group relative">
                  <Bell className="w-5 h-5 text-white/80 group-hover:text-purple-400 transition-colors duration-300" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/20">
                    <span className="text-[10px] font-medium text-white">2</span>
                  </span>
                </a>
              </div>
              <div className="relative">
                <a href="/freelancer/wallet" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6B46C1] to-[#4C1D95] hover:from-[#5B35B0] hover:to-[#3D1B7A] transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 group">
                  <Wallet className="w-4 h-4 text-white/90 group-hover:text-white transition-colors duration-300" />
                  <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">₹24,500</span>
                </a>
              </div>
              <button className="relative w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-lg transition-all duration-300 border border-white/5 hover:border-purple-500/30 p-0.5 group overflow-hidden">
                <img
                  src="/images/profile-sonu.jpg"
                  alt="Profile"
                  className="w-full h-full rounded-lg object-cover transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
              </button>
            </div>
          </div>
        </nav>
      )}
      {/* Mobile Navigation - Only show for non-feed pages and not in fullChatView */}
      {!fullChatView && pathname !== '/freelancer/feed' && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#111111]/95 backdrop-blur-lg z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex flex-col items-center space-y-1.5 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                      active 
                        ? 'text-purple-400 bg-purple-400/10 border border-purple-500/30' 
                        : 'text-white/60 border border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
      {!fullChatView && <div className="h-16" />}
      <main className="flex flex-col min-h-[calc(100vh-4rem)] relative z-10">{children}</main>
    </div>
  )
}

export default function FreelancerLayout(props: FreelancerLayoutProps) {
  return (
    <ChatViewProvider>
      <LayoutContent {...props} />
    </ChatViewProvider>
  );
}