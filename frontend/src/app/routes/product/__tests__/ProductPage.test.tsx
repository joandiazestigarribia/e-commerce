import { expect, test } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import { renderWithRouter } from "@/testing/test-utils"
import { ProductPage } from "../ProductPage"
import { server } from "@/testing/mocks/server"
import { http, HttpResponse } from "msw"
import { Routes, Route } from "react-router-dom"

// TODO: Revisar

test('carga producto individual por ID', async () => {
    renderWithRouter(
        <Routes>
            <Route path="/products/:slug" element={<ProductPage />} />
        </Routes>,
        {
            initialEntries: ['/products/test-product-1-1']
        }
    )

    await waitFor(() => {
        expect(screen.getByRole('heading', { 
            level: 1, 
            name: /test product 1/i 
        })).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verificar elementos específicos de la página de producto
    expect(screen.getByRole('img', { name: /test product 1/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add to bag/i })).toBeInTheDocument()
    
    // Verificar elementos únicos de la página de producto
    expect(screen.getByText(/final sale/i)).toBeInTheDocument()
    expect(screen.getByText(/reviews/i)).toBeInTheDocument()
    expect(screen.getByText(/us size/i)).toBeInTheDocument()
})

test('muestra 404 cuando el producto no existe', async () => {
    server.use(
        http.get('https://fakestoreapi.com/products/999', () => {
            return HttpResponse.json(
                { message: 'Product not found' },
                { status: 404 }
            )
        })
    )

    renderWithRouter(
        <Routes>
            <Route path="/products/:slug" element={<ProductPage />} />
        </Routes>,
        {
            initialEntries: ['/products/nonexistent-product-999']
        }
    )

    await waitFor(() => {
        expect(screen.getByText(/product not found/i)).toBeInTheDocument()
    }, { timeout: 3000 })
    
    expect(screen.queryByRole('button', { name: /add to bag/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/final sale/i)).not.toBeInTheDocument()
})