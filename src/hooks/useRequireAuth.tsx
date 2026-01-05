'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useState, useCallback, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// localStorage keys for persistence across page navigations
const RETURN_TO_KEY = 'doodlance_return_to'
const PENDING_ACTION_KEY = 'doodlance_pending_action'

interface UseRequireAuthReturn {
    requireAuth: (actionId: string, options?: {
        skipProfileCheck?: boolean
        redirectTo?: string
    }) => void
    isAuthenticated: boolean
    authLoading: boolean
    isProfileComplete: boolean
    openLoginDialog: boolean
    setOpenLoginDialog: (open: boolean) => void
    clearPendingAction: () => void
    // Profile Dialog props
    openProfileDialog: boolean
    setOpenProfileDialog: (open: boolean) => void
    handleCompleteProfile: () => void
}

export function useRequireAuth(): UseRequireAuthReturn {
    const { isAuthenticated, user } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [openLoginDialog, setOpenLoginDialog] = useState(false)
    const [openProfileDialog, setOpenProfileDialog] = useState(false)
    const [pendingRedirectPath, setPendingRedirectPath] = useState<string | null>(null)
    const [pendingActionId, setPendingActionId] = useState<string | null>(null)

    // Check if profile is complete
    const checkProfileCompletion = useCallback((): boolean => {
        if (!user) return false

        const role = user.role || 'client'

        // Basic requirements for all users
        const hasBasicInfo = !!(user.name && user.location)

        if (role === 'client') {
            // Clients need: name, location, and profile picture
            return hasBasicInfo && !!user.profileImage
        } else {
            // Freelancers need: name, location, and profile picture
            return hasBasicInfo && !!user.profileImage
        }
    }, [user])

    const isProfileComplete = checkProfileCompletion()

    // Clear pending action from localStorage
    const clearPendingAction = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(PENDING_ACTION_KEY)
            localStorage.removeItem(RETURN_TO_KEY)
        }
    }, [])

    // Execute pending action if exists and user is authenticated + profile complete
    useEffect(() => {
        if (typeof window === 'undefined') return

        if (isAuthenticated && isProfileComplete) {
            const storedActionId = localStorage.getItem(PENDING_ACTION_KEY)
            const returnTo = localStorage.getItem(RETURN_TO_KEY)

            if (returnTo && pathname !== returnTo) {
                // Clear before navigating to prevent loops
                clearPendingAction()
                // Navigate to the intended destination
                router.push(returnTo)
            } else if (storedActionId) {
                // User is on the right page, clear the stored action
                // The page itself should handle re-executing the action if needed
                clearPendingAction()
            }
        }
    }, [isAuthenticated, isProfileComplete, pathname, clearPendingAction, router])

    const handleCompleteProfile = useCallback(() => {
        if (!pendingRedirectPath) return

        // Redirect to profile with return param
        // Determine context based on the return path - if user is trying to access freelancer pages, send to freelancer profile
        const isFreelancerContext = pendingRedirectPath.startsWith('/freelancer')
        const profilePath = isFreelancerContext
            ? '/freelancer/profile/personal'
            : '/client/profile/edit'

        const actionQuery = pendingActionId ? `&action=${pendingActionId}` : ''
        router.push(`${profilePath}?returnTo=${encodeURIComponent(pendingRedirectPath)}${actionQuery}`)
        setOpenProfileDialog(false)
    }, [pendingRedirectPath, pendingActionId, router])

    /**
     * Protect an action with authentication and profile completion checks
     * @param actionId - Unique identifier for the action (e.g., 'checkout', 'apply-job')
     * @param options - Additional options like skipProfileCheck or redirectTo
     */
    const requireAuth = useCallback((
        actionId: string,
        options?: {
            skipProfileCheck?: boolean
            redirectTo?: string
        }
    ) => {
        // If already authenticated
        if (isAuthenticated && user) {
            // Check profile completion unless skipped
            if (!options?.skipProfileCheck && !checkProfileCompletion()) {
                // Store action ID and return path in localStorage
                const returnPath = options?.redirectTo || pathname

                if (typeof window !== 'undefined') {
                    localStorage.setItem(PENDING_ACTION_KEY, actionId)
                    localStorage.setItem(RETURN_TO_KEY, returnPath)
                }

                // Instead of redirecting immediately, show the dialog
                setPendingRedirectPath(returnPath)
                setPendingActionId(actionId)
                setOpenProfileDialog(true)
                return
            }

            // Profile is complete - action can proceed
            // Don't execute here, just allow the calling code to continue
            return
        }

        // Not authenticated - store return path and show login
        if (typeof window !== 'undefined') {
            const returnPath = options?.redirectTo || pathname
            localStorage.setItem(PENDING_ACTION_KEY, actionId)
            localStorage.setItem(RETURN_TO_KEY, returnPath)
        }

        setOpenLoginDialog(true)
    }, [isAuthenticated, user, checkProfileCompletion, router, pathname])

    return {
        requireAuth,
        isAuthenticated,
        authLoading: useAuth().isLoading,
        isProfileComplete,
        openLoginDialog,
        setOpenLoginDialog,
        clearPendingAction,
        // Profile Dialog props
        openProfileDialog,
        setOpenProfileDialog,
        handleCompleteProfile
    }
}

// Helper to check if we should auto-trigger an action
export function usePendingActionCheck(actionId: string, callback: () => void) {
    useEffect(() => {
        if (typeof window === 'undefined') return

        const pendingActionId = localStorage.getItem(PENDING_ACTION_KEY)

        if (pendingActionId === actionId) {
            // Clear it first to prevent loops
            localStorage.removeItem(PENDING_ACTION_KEY)
            localStorage.removeItem(RETURN_TO_KEY)

            // Execute the callback after a tiny delay to ensure page is fully loaded
            setTimeout(() => {
                callback()
            }, 100)
        }
    }, [actionId, callback])
}
