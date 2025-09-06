// Test de ProductList

import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { render } from '@/testing/test-utils'
import { createProduct } from '@/testing/data-generators'
import { ProductList } from '../ProductList'

describe('ProductList', () => {
    it('renders all products', () => {
        const products = [
            createProduct({ title: 'Product 1' }),
            createProduct({ title: 'Product 2' }),
            createProduct({ title: 'Product 3' })
        ]

        render(<ProductList products={products} />)

        expect(screen.getByText(/Product 1/)).toBeInTheDocument()
        expect(screen.getByText(/Product 2/)).toBeInTheDocument()
        expect(screen.getByText(/Product 3/)).toBeInTheDocument()
    })

    it('renders empty list correctly', () => {
        render(<ProductList products={[]} />)

        const grid = document.querySelector('.grid')
        expect(grid).toBeInTheDocument()
        expect(grid?.children).toHaveLength(0)
    })
})