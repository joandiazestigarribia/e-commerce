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
        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    }, { timeout: 3000 })

    // Verificar que el título del producto se muestra
    expect(screen.getByText(/Test Product 1/i)).toBeInTheDocument()
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
        expect(screen.getByText(/Product not found/)).toBeInTheDocument()
    }, { timeout: 3000 })
})