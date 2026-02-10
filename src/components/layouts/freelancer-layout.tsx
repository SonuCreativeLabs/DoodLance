import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import { AppGuideModal } from "@/components/common/tutorial/AppGuideModal"
import { HelpCircle } from "lucide-react"

interface FreelancerLayoutProps {
  children: ReactNode
  className?: string
}

export default function FreelancerLayout({ children, className }: FreelancerLayoutProps) {
  const [showAppGuide, setShowAppGuide] = useState(false);

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <a className="mr-6 flex items-center space-x-2" href="/freelancer">
              <span className="font-bold">Freelancer Dashboard</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a href="/freelancer/jobs" className="transition-colors hover:text-foreground/80">
                Jobs
              </a>
              <a href="/freelancer/profile" className="transition-colors hover:text-foreground/80">
                Profile
              </a>
            </nav>
          </div>
          <button
            onClick={() => setShowAppGuide(true)}
            className="flex items-center justify-center p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
            title="App Guide"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
      <AppGuideModal isOpen={showAppGuide} onClose={() => setShowAppGuide(false)} />
    </div>
  )
}
