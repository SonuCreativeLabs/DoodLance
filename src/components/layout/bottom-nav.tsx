"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Calendar, MessageSquare, User, Briefcase } from 'lucide-react'
import { cn } from '@/lib/utils'
import ModeSwitch from '@/components/mode-switch'

const BottomNav = () => {
  const pathname = usePathname()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Discover', href: '/discover', icon: Search },
    { name: 'Hire', href: '/hire', icon: Briefcase },
    { name: 'Bookings', href: '/bookings', icon: Calendar },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const handleModeChange = (mode: 'client' | 'freelancer') => {
    console.log('Mode changed to:', mode)
    // Handle mode change logic here
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bottom-nav border-t">
      <div className="grid grid-cols-6 h-16">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 bottom-nav-item",
              pathname === item.href && "active"
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
        <ModeSwitch onModeChange={handleModeChange} />
      </div>
    </nav>
  )
}

export default BottomNav 