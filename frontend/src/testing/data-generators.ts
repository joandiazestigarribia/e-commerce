// Generador de datos para tests (datos de Productos)

import {
    randProductCategory,
    randImg,
    randNumber,
    randText,
    randFloat,
    randProductName,
} from '@ngneat/falso'
import { Product } from '@/types/api'

const generateProduct = (): Product => ({
    id: randNumber({ min: 1, max: 10000 }),
    title: randProductName(), // Genera solo el nombre del producto
    description: randText({ charCount: 150 }),
    price: randFloat({ min: 10, max: 1000, fraction: 2 }), // Precio como número con 2 decimales
    image: randImg({ width: 400, height: 400 }),
    category: randProductCategory(), // Categoría de producto
    rating: {
        rate: randFloat({ min: 1, max: 5, fraction: 1 }), // Rating como número con 1 decimal
        count: randNumber({ min: 1, max: 500 }) // Count como número entero
    }
})

export const createProduct = <T extends Partial<Product>>(
    overrides?: T,
): Product => {
    return { ...generateProduct(), ...overrides }
}