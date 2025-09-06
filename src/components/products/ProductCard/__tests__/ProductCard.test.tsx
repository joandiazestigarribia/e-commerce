import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { render } from '@/testing/test-utils'
import { createProduct } from '@/testing/data-generators'
import { ProductCard } from '../ProductCard'
import type { Product } from '@/types/api'

// Mock del useDispatch
const mockDispatch = vi.fn()
vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux')
    return {
        ...actual,
        useDispatch: () => mockDispatch,
    }
})

describe('ProductCard', () => {
    let testProduct: Product

    beforeEach(() => {
        vi.clearAllMocks()
        testProduct = createProduct({
            title: 'Test Product Premium',
            price: 199.99,
            description: 'Premium test product description',
            category: 'electronics',
            rating: { rate: 4.8, count: 150 }
        })
    })

    it('renders product information correctly', () => {
        render(<ProductCard product={testProduct} />)

        expect(screen.getByText('Test Product Premium')).toBeInTheDocument()
        expect(screen.getByText('$199.99')).toBeInTheDocument()
        expect(screen.getByAltText('Test Product Premium')).toBeInTheDocument()
    })

    it('handles add to cart interaction', async () => {
        const user = userEvent.setup()
        render(<ProductCard product={testProduct} />)

        const image = screen.getByAltText('Test Product Premium')
        fireEvent.load(image)

        const addButton = screen.getByRole('button', { name: /add to cart/i })
        await user.click(addButton)

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'cart/addToCart',
                payload: expect.objectContaining({
                    id: testProduct.id,
                    title: testProduct.title,
                    price: testProduct.price
                })
            })
        )
    })

    it('handles long titles appropriately', () => {
        const longTitleProduct = createProduct({
            title: 'A'.repeat(50) 
        })
        
        render(<ProductCard product={longTitleProduct} />)
        const titleElement = screen.getByRole('heading', { level: 3 })
        
        expect(titleElement.textContent).toMatch(/\.\.\.$/) 
        expect(titleElement.textContent?.length).toBeLessThan(longTitleProduct.title.length) 
        
        expect(titleElement.textContent).toContain(longTitleProduct.title.substring(0, 10))
    })

    it('disables button while image is loading', () => {
        render(<ProductCard product={testProduct} />)

        const addButton = screen.getByRole('button', { name: /add to cart/i })
        expect(addButton).toBeDisabled()
    })
})