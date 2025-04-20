"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Briefcase, MessageSquare, User } from "lucide-react"

const navigation = [
  {
    name: "Feed",
    href: "/freelancer",
    icon: Home,
  },
  {
    name: "Discover",
    href: "/freelancer/discover",
    icon: Search,
  },
  {
    name: "Jobs",
    href: "/freelancer/jobs",
    icon: Briefcase,
  },
  {
    name: "Inbox",
    href: "/freelancer/inbox",
    icon: MessageSquare,
  },
  {
    name: "Profile",
    href: "/freelancer/profile",
    icon: User,
  },
]

export function FreelancerNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive ? "text-[#FF8A3D]" : "text-gray-500"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 