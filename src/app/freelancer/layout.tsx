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
    return pathname === path || pathname?.startsWith(path + '/')
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
      <nav className="border-b border-white/10 bg-[#111111]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/freelancer" className="text-white font-semibold">SkilledMice</Link>
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                      isActive(item.href)
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors">
                <Bell className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-medium text-white">2</span>
                </span>
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 backdrop-blur-md transition-colors">
                <Wallet className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <span className="text-[10px] font-medium text-purple-600">₹24.5K</span>
                </span>
              </button>
            </div>
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all duration-300 p-0.5">
              <img
                src="/images/profile-sonu.jpg"
                alt="Profile"
                className="w-full h-full rounded-full object-cover ring-2 ring-white/10 hover:ring-purple-400/50 transition-all duration-300"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#111111]/80 backdrop-blur-md z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 ${
                    isActive(item.href) ? 'text-white' : 'text-white/60'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <main className="pb-20 md:pb-0">{children}</main>
    </div>
  )
} 