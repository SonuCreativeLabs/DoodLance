import Link from "next/link"
import { Mouse } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <nav className="bg-navy-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Mouse className="w-8 h-8 text-amber-500" />
            <span className="text-xl font-bold">SkilledMice</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-amber-500 transition-colors">
              Home
            </Link>
            <Link href="/hires" className="hover:text-amber-500 transition-colors">
              Hires
            </Link>
            <Link href="/post" className="hover:text-amber-500 transition-colors">
              Post
            </Link>
            <Link href="/inbox" className="hover:text-amber-500 transition-colors">
              Inbox
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 