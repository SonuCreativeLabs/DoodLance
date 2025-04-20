"use client"

import { ReactNode } from "react"
import ClientLayout from "@/components/layouts/client-layout"

interface ClientRootLayoutProps {
  children: ReactNode
}

export default function ClientRootLayout({ children }: ClientRootLayoutProps) {
  return <ClientLayout>{children}</ClientLayout>
} 