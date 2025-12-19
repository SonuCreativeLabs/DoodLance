import { CricketLoader } from '@/components/ui/cricket-loader'

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center space-y-4">
        <CricketLoader size={64} />
        <p className="text-sm text-white/60 animate-pulse">Loading...</p>
      </div>
    </div>
  )
}
