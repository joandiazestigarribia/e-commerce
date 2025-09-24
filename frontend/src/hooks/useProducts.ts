import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api-client';

export const useProducts = () => {
    const {
        data: products = [],
        isLoading: loading,
        error,
        isError
    } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
        staleTime: 5 * 60 * 1000, // 5 minutos
        refetchOnWindowFocus: false,
        retry: false,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    });

    return { 
        products, 
        loading, 
        error: isError ? (error as Error)?.message || 'Error cargando productos' : null 
    };
};