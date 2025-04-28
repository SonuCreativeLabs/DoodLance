"use client"

import { ReactNode } from "react"

interface NearbyLayoutProps {
  children: ReactNode
}

export default function NearbyLayout({ children }: NearbyLayoutProps) {
  return (
    <div className="min-h-screen bg-[#18181b]">
      {children}
    </div>
  );
} 