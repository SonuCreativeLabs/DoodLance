"use client"

import { Bell, Wallet, Home, Inbox, Briefcase, User, Compass } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface FreelancerLayoutProps {
  children: React.ReactNode
}

export default function FreelancerLayout({ children }: FreelancerLayoutProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/freelancer') {
      return pathname === '/freelancer';
    }
    return pathname === path || pathname?.startsWith(path + '/');
  }

  const navItems = [
    { href: '/freelancer', label: 'Home', icon: Home },
    { href: '/freelancer/feed', label: 'Feed', icon: Compass },
    { href: '/freelancer/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/freelancer/inbox', label: 'Inbox', icon: Inbox },
    { href: '/freelancer/profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
      </div>
      {pathname !== '/freelancer/feed' && (
        <nav className="fixed top-0 left-0 right-0 border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl z-[100]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link 
              href="/freelancer" 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 font-bold text-lg hover:from-purple-500 hover:to-purple-700 transition-all duration-300"
            >
              SkilledMice
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
              <a href="/freelancer/wallet" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 group">
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

      {/* Mobile Navigation */}
      {pathname !== '/freelancer/feed' && (
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

      <div className="h-16" /> {/* Spacer for fixed header */}
      <main className="min-h-[calc(100vh-4rem)] overflow-y-auto relative z-10">{children}</main>
    </div>
  )
} 