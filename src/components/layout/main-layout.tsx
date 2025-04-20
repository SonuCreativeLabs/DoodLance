"use client"

import BottomNav from './bottom-nav'
import { Navbar } from './navbar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <BottomNav />
    </div>
  )
} 