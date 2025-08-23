import { ProductList } from '@/components/ui/ProductList/ProductList';
import { useProducts } from '@/hooks/useProducts';

export const Home = () => {
    const { products, loading, error } = useProducts();
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-xl">Cargando productos...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-500 text-xl">Error: {error}</div>
            </div>
        );
    }

    return (
        <ProductList products={products} />
    );
};