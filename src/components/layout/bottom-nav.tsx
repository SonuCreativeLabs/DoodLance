"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, PlusSquare, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/client', icon: Home },
  { name: 'Hires', href: '/client/hires', icon: Briefcase },
  { name: 'Post', href: '/client/post', icon: PlusSquare },
  { name: 'Inbox', href: '/client/inbox', icon: Inbox },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="px-4">
        <div className="grid grid-cols-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 transition-colors",
                pathname === item.href 
                  ? "text-[#FF8A3D]" 
                  : "text-gray-500 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-0.5 font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 