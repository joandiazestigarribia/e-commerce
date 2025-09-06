import { fireEvent, render, screen } from "@/testing/test-utils"
import { Provider } from "react-redux"
import { CartModal } from "../CartModal"
import { addToCart, toggleCart } from "@/store/slices/cartSlice"
import { createProduct } from "@/testing/data-generators"
import { describe, test, expect } from "vitest"
import { createTestStore } from "@/store/slices/__tests__/cartSlice.test"

// Testing del componente UI
describe('CartModal - Component Tests', () => {
    test('muestra productos en el CartModal', () => {
        const mockProduct = createProduct()
        const testStore = createTestStore()
        testStore.dispatch(addToCart(mockProduct))
        testStore.dispatch(toggleCart())

        render(
            <Provider store={testStore}>
                <CartModal />
            </Provider>
        )

        expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    })

    test('no renderiza cuando isOpen es false', () => {
        const testStore = createTestStore()
        
        render(
            <Provider store={testStore}>
                <CartModal />
            </Provider>
        )
        
        // El modal no debería renderizarse cuando isOpen es false
        expect(screen.queryByText('CARRITO DE COMPRAS')).not.toBeInTheDocument()
    })

    test('maneja clicks en botones de quantity', () => {
        const mockProduct = createProduct()
        const testStore = createTestStore()
        
        // Agregar producto al carrito y abrir modal
        testStore.dispatch(addToCart(mockProduct))
        testStore.dispatch(toggleCart())

        render(
            <Provider store={testStore}>
                <CartModal />
            </Provider>
        )

        const increaseButton = screen.getByRole('button', { name: 'Aumentar cantidad' })
        const decreaseButton = screen.getByRole('button', { name: 'Disminuir cantidad' })
        
        fireEvent.click(increaseButton)
        
        expect(increaseButton).toBeInTheDocument()
        expect(decreaseButton).toBeInTheDocument()
    })
})