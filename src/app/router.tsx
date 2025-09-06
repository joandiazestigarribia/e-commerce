import { MainLayout } from '@/components/layouts/MainLayout';
import { paths } from '@/config/paths';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootErrorBoundary } from './ErrorBoundary';
import { useMemo } from 'react';


const convertNamed = (queryClient: QueryClient, pick: (m: any) => any) => (m: any) => {
    return {
        loader: m.clientLoader?.(queryClient),
        action: m.clientAction?.(queryClient),
        Component: pick(m),
        ErrorBoundary: m.ErrorBoundary ?? m.HomeErrorBoundary ?? m.ProductErrorBoundary,
    };
};

export const createAppRouter = (queryClient: QueryClient) => createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        ErrorBoundary: RootErrorBoundary,
        children: [
            {
                index: true,
                lazy: () =>
                    import('@/components/layouts/Home/Home').then(
                        convertNamed(queryClient, (m) => m.Home)
                    )
            },
            {
                path: paths.product.path,
                lazy: () =>
                    import('./routes/product/ProductPage').then(
                        convertNamed(queryClient, (m) => m.ProductPage)
                    )
            }
        ]
    }
])

export const AppRouter = () => {
    const queryClient = useQueryClient();
    const router = useMemo(() => createAppRouter(queryClient), [queryClient]);
    return <RouterProvider router={router} />
}