import { useState, useEffect } from 'react';
import { fetchProducts } from '@/lib/api-client';
import type { Product } from '@/types/api';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchProducts();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error cargando productos');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return { products, loading, error };
};