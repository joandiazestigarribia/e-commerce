import { MainLayout } from '@/components/layouts/MainLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { paths } from '@/config/paths';
import type { QueryClient } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootErrorBoundary } from './ErrorBoundary';
import { useMemo } from 'react';

const createAppRouter = (queryClient: QueryClient) => createBrowserRouter([
    {
        path: paths.auth.login,
        lazy: () => import('./routes/auth/login/LoginPage').then(m => ({
            Component: m.LoginPage,
        }))
    },
    {
        path: paths.auth.register,
        lazy: () => import('./routes/auth/register/RegisterPage').then(m => ({
            Component: m.RegisterPage,
        }))
    },
    {
        path: paths.home.path,
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
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