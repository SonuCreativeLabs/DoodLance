"use client"

import BottomNav from './bottom-nav'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <nav className="bg-black text-white py-4 px-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">SkilledMice</h1>
        </div>
      </nav>
      <main className="pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  )
} 