// Mock de API de productos

import { HttpResponse, http } from 'msw'
import { createProduct } from '../data-generators'

const API_URL = 'http://localhost:3000/api'

const mockProducts = [
    createProduct({ id: 1, title: 'Test Product 1' }),
    createProduct({ id: 2, title: 'Test Product 2' }),
    ...Array.from({ length: 4 }, (_, i) => createProduct({ id: i + 3 }))
]

export const productsHandlers = [
    http.get(`${API_URL}/products`, () => {
        return HttpResponse.json({
            success: true,
            data: mockProducts,
            timestamp: new Date().toISOString()
        })
    }),

    http.get(`${API_URL}/products/:id`, ({ params }) => {
        const product = mockProducts.find(p => p.id === Number(params.id))
        if (!product) {
            return HttpResponse.json(
                {
                    success: false,
                    message: 'HTTP error! status: 404',
                    timestamp: new Date().toISOString()
                },
                { status: 404 }
            )
        }
        return HttpResponse.json({
            success: true,
            data: product,
            timestamp: new Date().toISOString()
        })
    })
]