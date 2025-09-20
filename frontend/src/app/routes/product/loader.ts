import { LoaderFunctionArgs } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { extractIdFromSlug } from '@/utils/createSlug';
import { fetchProduct } from '@/lib/api-client';

export const clientLoader = (qc: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
    const slug = params.slug as string;
    const id = extractIdFromSlug(slug);
    await qc.ensureQueryData({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id)
    });
    return null;
};