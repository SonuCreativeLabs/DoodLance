"use client"

import { Button } from "@/components/ui/button"
import { Briefcase, User } from "lucide-react"

export default function RoleSelection({ onSelect }: { onSelect: (role: "client" | "freelancer") => void }) {
  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Choose your role
      </h2>
      <div className="space-y-4">
        <Button
          onClick={() => onSelect("client")}
          className="w-full h-24 bg-[#FF8A3D] hover:bg-[#ff7a24] text-white flex flex-col items-center justify-center gap-2"
        >
          <Briefcase className="w-8 h-8" />
          <span className="text-lg font-medium">Hire</span>
          <span className="text-sm opacity-80">Find skilled professionals</span>
        </Button>
        <Button
          onClick={() => onSelect("freelancer")}
          className="w-full h-24 bg-gray-100 hover:bg-gray-200 text-gray-900 flex flex-col items-center justify-center gap-2"
          variant="outline"
        >
          <User className="w-8 h-8" />
          <span className="text-lg font-medium">Work</span>
          <span className="text-sm opacity-80">Offer your services</span>
        </Button>
      </div>
    </div>
  )
} 