import { ProductList } from '@/components/products/ProductList';
import { useProducts } from '@/hooks';
import { Link, useRouteError } from 'react-router-dom';

// TODO: Revisar
// TODO: Crear mensaje de error

export const HomeErrorBoundary = () => {
    const error = useRouteError();
    const message =
        error instanceof Error
            ? error.message
            : typeof error === 'string'
                ? error
                : 'Error desconocido';
    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="text-red-500 text-xl">
                Error cargando inicio: {message}
            </div>
        </div>
    )
}

export const Home = () => {
    const { products, loading, error } = useProducts();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="text-xl text-gray-600" data-testid="loading-spinner">Cargando productos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="text-red-500 text-xl" data-testid="error-message">Error cargando inicio: {error}</div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="flex justify-between items-center w-[88%] mx-auto">
                <div className="w-fit-content py-[10px]">
                    <nav className="flex justify-center">
                        <Link to="/new" className="text-gray-600 hover:text-gray-900 font-medium text-[11px] tracking-wide mr-[20px]">
                            NEW
                        </Link>
                        <Link to="/swim" className="text-gray-600 hover:text-gray-900 font-medium text-[11px] tracking-wide mr-[20px] border-b-2 border-gray-900 pb-[1px]">
                            SWIM
                        </Link>
                        <Link to="/apparel" className="text-gray-600 hover:text-gray-900 font-medium text-[11px] tracking-wide mr-[20px]">
                            APPAREL
                        </Link>
                        <Link to="/mini" className="text-gray-600 hover:text-gray-900 font-medium text-[11px] tracking-wide mr-[20px] border-b-2 border-gray-900 pb-[1px]">
                            MINI
                        </Link>
                        <Link to="/signatures" className="text-gray-600 hover:text-gray-900 font-medium text-[11px] tracking-wide mr-[20px]">
                            SIGNATURES
                        </Link>
                        <Link to="/sale" className="text-gray-600 hover:text-gray-900 font-medium text-[11px] tracking-wide">
                            SALE
                        </Link>
                    </nav>
                </div>
                <div className="">
                    <div className="w-full py-[8px]">
                        <div className="text-center">
                            <p className="text-[10px] text-gray-600 font-medium tracking-wide" data-testid="shipping-message">
                                FREE INTERNATIONAL SHIPPING FOR ORDERS OVER $150
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ProductList products={products} />
        </div>
    );
};