export const fetchProducts = async () => {
    try {
        const url = 'https://fakestoreapi.com/products';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const fetchProduct = async (id: number) => {
    try {
        const url = `https://fakestoreapi.com/products/${id}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}