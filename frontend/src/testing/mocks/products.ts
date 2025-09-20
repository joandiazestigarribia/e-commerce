// Mock de API de productos

import { HttpResponse, http } from 'msw'
import { createProduct } from '../data-generators'

const API_URL = 'https://fakestoreapi.com'

// Generar productos de prueba con IDs específicos para testing
const mockProducts = [
    createProduct({ id: 1, title: 'Test Product 1' }),
    createProduct({ id: 2, title: 'Test Product 2' }),
    ...Array.from({ length: 4 }, (_, i) => createProduct({ id: i + 3 }))
]

export const productsHandlers = [
    http.get(`${API_URL}/products`, () => {
        return HttpResponse.json(mockProducts)
    }),

    http.get(`${API_URL}/products/:id`, ({ params }) => {
        const product = mockProducts.find(p => p.id === Number(params.id))
        if (!product) {
            return HttpResponse.json({ message: 'Product not found' }, { status: 404 })
        }
        return HttpResponse.json(product)
    })
]