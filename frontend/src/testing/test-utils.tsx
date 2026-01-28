import { ReactElement } from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { BrowserRouter, MemoryRouter, MemoryRouterProps } from 'react-router-dom'
import { store } from '@/store'


const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: { retry: false, staleTime: 0, gcTime: 0 },
            mutations: { retry: false }
        }
    })

interface AllTheProvidersProps {
    children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
    const queryClient = createTestQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <BrowserRouter>
                    {children}
                </BrowserRouter>
            </Provider>
        </QueryClientProvider>
    )
}

interface MemoryRouterWrapperProps {
    children: React.ReactNode
    routerProps?: MemoryRouterProps
}

const MemoryRouterWrapper = ({ children, routerProps }: MemoryRouterWrapperProps) => {
    const queryClient = createTestQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <MemoryRouter {...routerProps}>
                    {children}
                </MemoryRouter>
            </Provider>
        </QueryClientProvider>
    )
}

const customRender = (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) => rtlRender(ui, { wrapper: AllTheProviders, ...options })

const renderWithRouter = (
    ui: ReactElement,
    routerProps?: MemoryRouterProps,
    options?: Omit<RenderOptions, 'wrapper'>
) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <MemoryRouterWrapper routerProps={routerProps}>
            {children}
        </MemoryRouterWrapper>
    )

    return rtlRender(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { customRender as render, renderWithRouter }