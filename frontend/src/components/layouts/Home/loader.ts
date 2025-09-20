import { QueryClient } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api-client';

export const clientLoader = (qc: QueryClient) => async () => {
    await qc.ensureQueryData({
        queryKey: ['products'],
        queryFn: fetchProducts
    });
    return null;
};