import { createBrowserRouter } from 'react-router-dom';
import { paths } from '@/config/paths';
import { Home } from '@/components/layouts/Home/Home';
import { MainLayout } from '@/components/layouts/MainLayout';
import { ProductPage } from './routes/product/ProductPage';

// TODO: Agregar lazy loading cuando tenga pagina de autenticacion

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: paths.home.path,
                element: <Home />
            },
            {
                path: paths.product.path,
                element: <ProductPage />
            }
        ]
    },
]);

