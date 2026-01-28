import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
    
    const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    }
    vi.stubGlobal('localStorage', localStorageMock)
    
    vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
    cleanup()
    
    server.resetHandlers()
    
    localStorage.clear()
    
    vi.clearAllMocks()
})

afterAll(() => {
    server.close()
    
    vi.restoreAllMocks()
})