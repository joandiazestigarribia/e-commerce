// Setup basico para tests

import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from './mocks/server'

beforeAll(() => {
    // 1. CONFIGURAR MSW
    server.listen({ onUnhandledRequest: 'error' })
    
    // 2. MOCK DE localStorage para testing de persistencia
    const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    }
    vi.stubGlobal('localStorage', localStorageMock)
    
    // 3. MOCK de console.error para que no aparezcan en tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
    cleanup()
    
    // Resetear handlers de MSW entre tests
    server.resetHandlers()
    
    // Limpiar localStorage entre tests
    localStorage.clear()
    
    // Limpiar todos los mocks
    vi.clearAllMocks()
})

afterAll(() => {
    // Cerrar MSW
    server.close()
    
    // Restaurar mocks
    vi.restoreAllMocks()
})