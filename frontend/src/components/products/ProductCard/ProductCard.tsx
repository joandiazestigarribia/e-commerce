import { Product } from "@/types/api";
import { addToCart } from "@/store/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createSlug } from "@/utils/createSlug";

interface ProductCardProps {
    product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
    const dispatch = useDispatch();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [imageTimeout, setImageTimeout] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setImageTimeout(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart(product));
    }

    const handleImageLoad = () => {
        setImageLoaded(true);
    }

    const handleImageError = () => {
        setImageError(true);
    }

    return (
        <div className="group cursor-pointer w-full" data-testid="product-card">
            <Link to={`/p/${createSlug(product.title, product.id)}`}>
                <div className="mb-[10px] overflow-hidden bg-gray-50 aspect-[3/4] relative content-center">
                    {/* Skeleton/Placeholder mientras carga */}
                    {!imageLoaded && !imageError && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                    )}

                    {imageError ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    ) : (
                        <img
                            src={product.image}
                            alt={product.title}
                            className={`w-fit-conent h-auto max-h-[398px] object-cover transition-all duration-300 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            loading="lazy"
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            decoding="async"
                        />
                    )}
                </div>
                <div className="text-center space-y-1 mb-[5px]">
                    <h3 className="text-[10px] md:text-[11px] font-normal text-black tracking-[1px] uppercase leading-tight" data-testid="product-title">
                        {product.title.length > 30 ? product.title.substring(0, 30) + '...' : product.title}
                    </h3>
                    <p className="text-[10px] md:text-[11px] font-normal text-black" data-testid="product-price">
                        ${product.price}
                    </p>
                </div>
            </Link>
            <button
                onClick={handleAddToCart}
                className="btn-primary"
                disabled={!imageLoaded && !imageError && !imageTimeout}
                data-testid="add-to-cart"
            >
                <span className="btn-primary-text">
                    Add to Cart
                </span>
            </button>
        </div>
    );
};