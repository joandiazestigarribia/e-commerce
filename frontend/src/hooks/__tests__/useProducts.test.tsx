import { useProducts } from '@/hooks/useProducts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false, staleTime: 0, gcTime: 0 },
            mutations: { retry: false },
        },
    })

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}

describe('useProducts', () => {
    it('fetches products successfully', async () => {
        const { result } = renderHook(() => useProducts(), {
            wrapper: createWrapper(),
        })

        // estado inicial
        expect(result.current.loading).toBe(true)
        expect(result.current.products).toHaveLength(0)
        expect(result.current.error).toBeNull()

        await waitFor(() => {
            expect(result.current.loading).toBe(false)
        }, { timeout: 3000 })

        expect(result.current.products).toHaveLength(6)
        expect(result.current.error).toBeNull()
    })

    it('exposes error when API fails', async () => { 
        // TODO: Implementar test de error
    })
})