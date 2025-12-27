'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface RealtimeContextType {
    isConnected: boolean
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false)
    const { user } = useAuth()
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        if (!user) return

        // 1. Listen for new notifications
        const channel = supabase
            .channel('realtime-updates')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `userId=eq.${user.id}`,
                },
                (payload) => {
                    const newNotification = payload.new as any
                    toast.info(newNotification.title, {
                        description: newNotification.message,
                    })

                    // Refresh data if needed
                    router.refresh()
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    setIsConnected(true)
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [user, supabase, router])

    return (
        <RealtimeContext.Provider value={{ isConnected }}>
            {children}
        </RealtimeContext.Provider>
    )
}

export function useRealtime() {
    const context = useContext(RealtimeContext)
    if (context === undefined) {
        throw new Error('useRealtime must be used within a RealtimeProvider')
    }
    return context
}
