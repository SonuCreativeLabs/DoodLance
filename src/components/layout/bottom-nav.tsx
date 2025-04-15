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
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden">
      <div className="grid h-full grid-cols-6 mx-auto max-w-md">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'inline-flex flex-col items-center justify-center px-3 hover:bg-gray-50 dark:hover:bg-gray-800',
              pathname === item.href
                ? 'text-primary'
                : 'text-muted-foreground'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.name}</span>
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