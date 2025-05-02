import Link from "next/link"
import { Mouse } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 h-14">
      <div className="h-full px-4">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Mouse className="w-6 h-6 text-[#FF8A3D]" />
            <span className="text-lg font-semibold text-gray-800">SkilledMice</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-[#FF8A3D] transition-colors">
              Home
            </Link>
            <Link href="/client/bookings" className="text-gray-600 hover:text-[#FF8A3D] transition-colors">
              Bookings
            </Link>
            <Link href="/client/nearby/integrated-explore" className="text-gray-600 hover:text-[#FF8A3D] transition-colors">
              Hire
            </Link>
            <Link href="/inbox" className="text-gray-600 hover:text-[#FF8A3D] transition-colors">
              Inbox
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="border-gray-200 text-gray-700 hover:bg-gray-50">
              Sign In
            </Button>
            <Button size="sm" className="bg-[#FF8A3D] hover:bg-[#FF8A3D]/90 text-white">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 