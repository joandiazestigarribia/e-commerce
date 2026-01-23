import { env } from "@/config/env";
import { Product } from "@/types/api";

const baseURL = env.API_BASE_URL;

interface ApiResponse<T> {
    success: boolean;
    data: T;
    timestamp: string;
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('access_token');

    const headers: HeadersInit & { Authorization?: string } = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        throw new Error('No autorizado');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error en la petición' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response;
};

export const fetchProducts = async () => {
    try {
        const url = `${baseURL}/products`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiResponse: ApiResponse<Product[]> = await response.json();
        return apiResponse.data;
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

        const apiResponse: ApiResponse<Product> = await response.json();
        return apiResponse.data;
    } catch (error) {
        if (env.ENABLE_DEBUG) {
            console.error('Error fetching product:', error);
        }
        throw error;
    }
}

export const login = async (email: string, password: string) => {
    const response = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error al iniciar sesión' }));
        throw new Error(error.message || 'Error al iniciar sesión');
    }

    const apiResponse = await response.json();
    return apiResponse.data;
};

export const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) => {
    const response = await fetch(`${baseURL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Error al registrar' }));
        throw new Error(error.message || 'Error al registrar');
    }

    const apiResponse = await response.json();
    return apiResponse.data;
};

export const logout = async () => {
    const response = await fetchWithAuth(`${baseURL}/auth/logout`, {
        method: 'POST',
    });
    const apiResponse = await response.json();
    return apiResponse.data;
};

export const getCurrentUser = async () => {
    const response = await fetchWithAuth(`${baseURL}/auth/me`);
    const apiResponse = await response.json();
    return apiResponse.data;
};