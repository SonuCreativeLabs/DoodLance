import { QueryClient } from '@tanstack/react-query'

// Create a client with sensible defaults for our use case
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data stays fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache data for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Don't refetch on window focus for POC (can enable later)
            refetchOnWindowFocus: false,
            // Do refetch on reconnect
            refetchOnReconnect: true,
            // Retry failed requests once
            retry: 1,
        },
    },
})
