import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ClientLayoutProps {
  children: ReactNode
  className?: string
}

export default function ClientLayout({ children, className }: ClientLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <a className="mr-6 flex items-center space-x-2" href="/client">
              <span className="font-bold">Client Dashboard</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="/client/jobs" className="transition-colors hover:text-foreground/80">
                Jobs
              </a>
              <a href="/client/hire" className="transition-colors hover:text-foreground/80">
                Hire
              </a>
              <a href="/client/profile" className="transition-colors hover:text-foreground/80">
                Profile
              </a>
            </nav>
          </div>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
} 