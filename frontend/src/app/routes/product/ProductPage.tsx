import { useParams, useRouteError } from "react-router-dom"
import { useProduct } from "@/hooks/useProduct";
import { extractIdFromSlug } from "@/utils/createSlug";
import { useState } from "react";
import { addToCart } from "@/store/slices/cartSlice";
import { useDispatch } from "react-redux";

// TODO: Crear mensaje de error

export const ProductErrorBoundary = () => {
    const error = useRouteError();
    const message =
        error instanceof Error
            ? error.message
            : typeof error === 'string'
                ? error
                : 'Error desconocido';
    return (
        <div className="flex justify-center items-center min-h-screen bg-white">
            <div className="text-red-500 text-xl">Error: {message}</div>
        </div>
    )
}

export const ProductPage = () => {
    const { slug } = useParams();
    const productId = extractIdFromSlug(slug as string);
    const { product, isLoading, error } = useProduct(productId);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
    const dispatch = useDispatch();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Cargando producto...</div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Product not found</div>
            </div>
        );
    }

    const sizes = [2, 4, 6, 8, 10, 12];
    const discountedPrice = (product.price * 0.7).toFixed(2);

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const handleAddToCart = () => {
        dispatch(addToCart(product));
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Imagen del producto */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex justify-center">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-fit-conten  object-cover"
                        />
                    </div>
                </div>

                {/* Detalles del producto */}
                <div className="space-y-6">
                    {/* Etiqueta Final Sale */}
                    <div className="text-sm text-gray-600 tracking-widest">
                        FINAL SALE
                    </div>

                    {/* Título */}
                    <h1 className="text-2xl font-light tracking-wide uppercase">
                        {product.title}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className={i < Math.floor(product.rating.rate) ? "★" : "☆"}>
                                    ★
                                </span>
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">
                            {product.rating.count} REVIEWS
                        </span>
                    </div>

                    {/* Precio */}
                    <div className="flex items-center space-x-3">
                        <span className="text-xl font-medium">
                            ${discountedPrice} ARS
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                            ${product.price} ARS
                        </span>
                    </div>

                    {/* Descripción */}
                    <div className="text-gray-700 leading-relaxed">
                        {product.description}
                    </div>

                    {/* Material */}
                    <div className="text-sm text-gray-600">
                        Made from 100% cotton.
                    </div>

                    {/* Icono de algodón (placeholder) */}
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs">🌿</span>
                    </div>

                    {/* Selector de talla */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium tracking-wide">
                                US SIZE
                            </span>
                        </div>
                        <div className="flex space-x-2">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`w-12 h-12 border flex items-center justify-center text-sm transition-colors ${selectedSize === size
                                        ? 'border-black bg-black text-white'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Botón Add to Bag */}
                    <button
                        className="w-full bg-black text-white py-4 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors"
                        // disabled={!selectedSize}
                        onClick={handleAddToCart}
                    >
                        ADD TO BAG
                    </button>

                    {/* Secciones expandibles */}
                    <div className="space-y-4 border-t pt-6">
                        {/* Model is wearing */}
                        <div className="border-b pb-4">
                            <button
                                onClick={() => toggleSection('model')}
                                className="flex items-center justify-between w-full text-left text-sm font-medium tracking-wide"
                            >
                                MODEL IS WEARING
                                <span className="text-xl">
                                    {expandedSection === 'model' ? '−' : '+'}
                                </span>
                            </button>
                            {expandedSection === 'model' && (
                                <div className="mt-3 text-sm text-gray-600">
                                    Model is 5'8" and wearing size 4. Model's measurements: Bust 32", Waist 24", Hips 35".
                                </div>
                            )}
                        </div>

                        {/* Measurements & Fit Details */}
                        <div className="border-b pb-4">
                            <button
                                onClick={() => toggleSection('measurements')}
                                className="flex items-center justify-between w-full text-left text-sm font-medium tracking-wide"
                            >
                                MEASUREMENTS & FIT DETAILS
                                <span className="text-xl">
                                    {expandedSection === 'measurements' ? '−' : '+'}
                                </span>
                            </button>
                            {expandedSection === 'measurements' && (
                                <div className="mt-3 text-sm text-gray-600 space-y-2">
                                    <p>• Classic crew neckline</p>
                                    <p>• Long relaxed sleeves with rib cuffs</p>
                                    <p>• Regular fit</p>
                                    <p>• Length: 24" (size 4)</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};