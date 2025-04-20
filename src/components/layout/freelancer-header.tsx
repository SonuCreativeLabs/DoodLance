"use client"

import Image from "next/image"
import Link from "next/link"
import { useRole } from "@/contexts/role-context"
import { ArrowLeftCircle } from "lucide-react"

export function FreelancerHeader() {
  const { switchRole } = useRole()

  const handleSwitchToClient = () => {
    switchRole()
  }

  return (
    <header className="bg-white">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/client" onClick={handleSwitchToClient}>
              <ArrowLeftCircle className="h-6 w-6 text-gray-500" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Freelancer</p>
                <p className="text-sm font-medium">John Doe</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-[#FF8A3D]">
              Switch to Client
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 