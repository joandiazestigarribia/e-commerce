import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProduct } from '@/hooks/useProduct'

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

describe('useProduct', () => {
    it('fetches a product successfully', async () => {
        const { result } = renderHook(() => useProduct(1), {
            wrapper: createWrapper(),
        })

        // estado inicial
        expect(result.current.isLoading).toBe(true)
        expect(result.current.product).toBeUndefined()
        expect(result.current.error).toBeNull()

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        }, { timeout: 3000 })

        expect(result.current.product).toBeDefined()
        expect(result.current.product?.id).toBe(1)
        expect(result.current.product?.title).toBe('Test Product 1')
        expect(result.current.error).toBeNull()
    })

    it('exposes error when API returns 404', async () => {
        const { result } = renderHook(() => useProduct(999), {
            wrapper: createWrapper(),
        })

        // estado inicial
        expect(result.current.isLoading).toBe(true)
        expect(result.current.product).toBeUndefined()
        expect(result.current.error).toBeNull()

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false)
        }, { timeout: 3000 })

        expect(result.current.product).toBeUndefined()
        expect(result.current.error).toBeInstanceOf(Error)
        expect((result.current.error as Error).message).toMatch(/HTTP error!/i)
    })
})