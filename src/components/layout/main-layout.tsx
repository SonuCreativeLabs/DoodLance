"use client"

import BottomNav from './bottom-nav'
import { Navbar } from './navbar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />
      <main className="pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  )
} 