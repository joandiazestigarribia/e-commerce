import { MainLayout } from '@/components/layouts/MainLayout';
import { paths } from '@/config/paths';
import type { QueryClient } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootErrorBoundary } from './ErrorBoundary';
import { useMemo } from 'react';

const createAppRouter = (queryClient: QueryClient) => createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        ErrorBoundary: RootErrorBoundary,
        children: [
            {
                index: true,
                lazy: () =>
                    Promise.all([
                        import('@/components/layouts/Home/Home'),
                        import('@/components/layouts/Home/loader'),
                    ]).then(([m, data]) => ({
                        loader: data.clientLoader?.(queryClient),
                        Component: m.Home,
                        ErrorBoundary: m.HomeErrorBoundary,
                    }))
            },
            {
                path: paths.product.path,
                lazy: () =>
                    Promise.all([
                        import('./routes/product/ProductPage'),
                        import('./routes/product/loader'),
                    ]).then(([m, data]) => ({
                        loader: data.clientLoader?.(queryClient),
                        Component: m.ProductPage,
                        ErrorBoundary: m.ProductErrorBoundary,
                    }))
            }
        ]
    }
])

export const AppRouter = () => {
    const queryClient = useQueryClient();
    const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
    return <RouterProvider router={router} />
}