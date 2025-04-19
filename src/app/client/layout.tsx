"use client"

import { ReactNode } from "react"
import ClientLayout from "@/components/layouts/client-layout"

interface RootLayoutProps {
  children: ReactNode
}

export default function Layout({ children }: RootLayoutProps) {
  return <ClientLayout>{children}</ClientLayout>
} 