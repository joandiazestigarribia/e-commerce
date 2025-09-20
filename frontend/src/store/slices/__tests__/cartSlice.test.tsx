import { configureStore } from '@reduxjs/toolkit'
import { addToCart, removeFromCart, toggleCart, updateQuantity } from '../cartSlice'
import cartReducer from '../cartSlice'
import { createProduct } from '@/testing/data-generators'
import { describe, expect, test } from 'vitest'

// Definir el tipo del estado del store de test
type TestStoreState = {
    cart: ReturnType<typeof cartReducer>
}

// Crear un store de test sin persistencia para evitar conflictos de tipos
export const createTestStore = () => configureStore<TestStoreState>({
    reducer: {
        cart: cartReducer
    }
})

// Testing de la lógica del slice
describe('cartSlice - Unit Tests', () => {
    test('should add product to cart', () => {
        const initialState = { items: [], total: 0, isOpen: false, itemCount: 0 }
        const product = createProduct()
        const action = addToCart(product)
        const newState = cartReducer(initialState, action)
        
        expect(newState.items).toHaveLength(1)
        expect(newState.total).toBe(product.price)
    })

    test('should update quantity correctly', () => {
        const initialState = { items: [], total: 0, isOpen: false, itemCount: 0 }
        const product = createProduct()
        
        // Primero agregar el producto al carrito
        const addAction = addToCart(product)
        const stateWithProduct = cartReducer(initialState, addAction)
        
        // Luego actualizar la cantidad
        const updateAction = updateQuantity({ id: product.id, quantity: 2 })
        const newState = cartReducer(stateWithProduct, updateAction)
        
        expect(newState.items).toHaveLength(1)
        expect(newState.items[0].quantity).toBe(2)
        expect(newState.total).toBe(product.price * 2)
    })
    
    test('should remove product from cart', () => {
        const initialState = { items: [], total: 0, isOpen: false, itemCount: 0 }
        const product = createProduct()
        
        // Primero agregar el producto
        const addAction = addToCart(product)
        const stateWithProduct = cartReducer(initialState, addAction)
        
        // Luego removerlo
        const removeAction = removeFromCart(product.id)
        const newState = cartReducer(stateWithProduct, removeAction)
        
        expect(newState.items).toHaveLength(0)
        expect(newState.total).toBe(0)
    })
    
    test('should toggle cart open/close state', () => {
        const initialState = { items: [], total: 0, isOpen: false, itemCount: 0 }
        const action = toggleCart()
        const newState = cartReducer(initialState, action)
        
        expect(newState.isOpen).toBe(true)
    })
})