"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, PlusCircle, MessageSquare, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRole } from '@/contexts/role-context'

const navigation = [
  { name: 'Home', href: '/client', icon: Home },
  { name: 'Hires', href: '/client/hires', icon: Briefcase },
  { name: 'Post', href: '/client/post', icon: PlusCircle },
  { name: 'Inbox', href: '/client/inbox', icon: MessageSquare },
]

export function BottomNav() {
  const pathname = usePathname()
  const { role, switchRole } = useRole()

  const handleWorkAndEarn = () => {
    if (role === "client") {
      switchRole()
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-5 gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-3 text-sm font-medium",
                  isActive ? "text-[#FF8A3D]" : "text-gray-500 hover:text-gray-700"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="mt-1">{item.name}</span>
              </Link>
            )
          })}
          <Link
            href="/freelancer"
            onClick={handleWorkAndEarn}
            className="flex flex-col items-center justify-center py-2"
          >
            <div className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
              role === "freelancer"
                ? "bg-[#FF8A3D] text-white"
                : "bg-[#e6e6e6] text-gray-700 hover:bg-gray-200"
            )}>
              Work & Earn
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  )
} 