import { setupServer } from 'msw/node'
import { productsHandlers } from './products'

export const server = setupServer(...productsHandlers)
