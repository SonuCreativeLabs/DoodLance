"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, PlusSquare, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Hires', href: '/hires', icon: Briefcase },
  { name: 'Post', href: '/post', icon: PlusSquare },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white border-t border-white/10">
      <div className="container mx-auto">
        <div className="grid grid-cols-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 transition-colors",
                pathname === item.href 
                  ? "text-[#FF8A3D]" 
                  : "text-white/70 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 