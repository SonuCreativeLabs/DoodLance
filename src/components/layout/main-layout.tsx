"use client"

import { ReactNode } from 'react'
import BottomNav from './bottom-nav'
import Header from './header'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-16">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

export default MainLayout 