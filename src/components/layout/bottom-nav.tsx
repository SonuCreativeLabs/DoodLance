"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, PlusCircle, MessageSquare, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRole } from '@/contexts/role-context'

const navigation = [
  { name: 'HOME', href: '/client', icon: Home },
  { name: 'Trips', href: '/client/hires', icon: Briefcase },
  { name: 'Post', href: '/client/post', icon: PlusCircle },
  { name: 'Profile', href: '/client/inbox', icon: MessageSquare },
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6 py-2">
        <div className="flex justify-between items-center">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex flex-col items-center min-w-[64px]"
              >
                <div className={cn(
                  "flex flex-col items-center",
                  isActive ? "text-[#FF8A3D]" : "text-gray-400"
                )}>
                  <item.icon className="h-6 w-6" />
                  <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                </div>
              </Link>
            )
          })}
          
          <Link
            href="/freelancer"
            onClick={handleWorkAndEarn}
            className={cn(
              "flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-all",
              role === "freelancer"
                ? "bg-[#FF8A3D] text-white"
                : "bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]"
            )}
          >
            <span className="text-xs">Work & Earn</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </nav>
  )
} 