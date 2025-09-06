import { render, screen } from '@/testing/test-utils'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { addToCart, toggleCart } from '../cartSlice'
import cartReducer from '../cartSlice'
import { createProduct } from '@/testing/data-generators'
import { describe, expect, test, vi, beforeEach } from 'vitest'
import { CartModal } from '@/components/ui'

// Definir el tipo del estado del store de test
type TestStoreState = {
    cart: ReturnType<typeof cartReducer>
}

// Crear un store de test sin persistencia para evitar conflictos de tipos
const createTestStore = () => configureStore<TestStoreState>({
    reducer: {
        cart: cartReducer
    }
})

describe('Cart slice', () => {
    let testStore: ReturnType<typeof createTestStore>

    beforeEach(() => {
        testStore = createTestStore()
        vi.clearAllMocks()
    })

    test('agrega productos al carrito correctamente', () => {
        const mockProduct = createProduct()
        testStore.dispatch(addToCart(mockProduct))
        const state = testStore.getState()
        expect(state.cart.items).toHaveLength(1)
        expect(state.cart.items[0].title).toBe(mockProduct.title)
        expect(state.cart.total).toBe(mockProduct.price)
    })

    test('muestra productos en el CartModal', () => {
        const mockProduct = createProduct()
        testStore.dispatch(addToCart(mockProduct))
        testStore.dispatch(toggleCart())
        
        // Envolver el CartModal con el Provider del testStore
        render(
            <Provider store={testStore}>
                <CartModal />
            </Provider>
        )
        
        expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    })
})