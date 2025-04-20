"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Briefcase, MessageSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Feed", href: "/freelancer", icon: Home },
  { name: "Discover", href: "/freelancer/discover", icon: Search },
  { name: "Jobs", href: "/freelancer/jobs", icon: Briefcase },
  { name: "Inbox", href: "/freelancer/inbox", icon: MessageSquare },
  { name: "Profile", href: "/freelancer/profile", icon: User },
]

export function FreelancerNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-5">
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
        </div>
      </div>
    </nav>
  )
} 