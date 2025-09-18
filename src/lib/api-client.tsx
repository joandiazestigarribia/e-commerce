import { env } from "@/config/env";

const baseURL = env.API_BASE_URL;

export const fetchProducts = async () => {
    try {
        const url = `${baseURL}/products`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (env.ENABLE_DEBUG) {
            console.error('Error fetching products:', error);
        }
        throw error;
    }
};

export const fetchProduct = async (id: number) => {
    try {
        const url = `${baseURL}/products/${id}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (env.ENABLE_DEBUG) {
            console.error('Error fetching product:', error);
        }
        throw error;
    }
}