import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Home, Search, PlusCircle, Calendar, User } from "lucide-react"

interface ClientLayoutProps {
  children: ReactNode
  className?: string
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background flex flex-col", className)}>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="flex justify-around items-center">
            <Link href="/client" className="flex flex-col items-center">
              <Home className="w-5 h-5" />
              <span className="text-xs mt-0.5">Home</span>
            </Link>
            <Link href="/client/post" className="flex flex-col items-center">
              <PlusCircle className="w-5 h-5" />
              <span className="text-xs mt-0.5">Post</span>
            </Link>
            <Link href="/client/bookings" className="flex flex-col items-center">
              <Calendar className="w-5 h-5" />
              <span className="text-xs mt-0.5">Bookings</span>
            </Link>
            <Link href="/client/profile" className="flex flex-col items-center">
              <User className="w-5 h-5" />
              <span className="text-xs mt-0.5">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Add padding to account for fixed bottom nav */}
      <div className="h-14" />
    </div>
  )
} 