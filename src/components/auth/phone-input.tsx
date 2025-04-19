"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const countryCodes = [
  { code: "+1", country: "United States" },
  { code: "+44", country: "United Kingdom" },
  { code: "+91", country: "India" },
  { code: "+61", country: "Australia" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
]

export default function PhoneInput({ onNext }: { onNext: (phone: string) => void }) {
  const [selectedCode, setSelectedCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext(`${selectedCode}${phoneNumber}`)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Enter your phone number</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedCode} onValueChange={setSelectedCode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select code" />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.code} {country.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="flex-1"
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#FF8A3D] hover:bg-[#ff7a24] text-white"
          disabled={!phoneNumber}
        >
          Continue
        </Button>
      </form>
    </div>
  )
} 