import { useQuery } from "@tanstack/react-query";
import { fetchProduct } from "@/lib/api-client";

export const useProduct = (id: number) => {
    const { data: product, isLoading, error } = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
        retry: false // Importante para tests - no reintentar en caso de error
    })

    return { product, isLoading, error }
}
