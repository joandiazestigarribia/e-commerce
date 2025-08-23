import { Product } from "@/types/api";

interface ProductCardProps {
    product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-contain mb-4"
            />
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                {product.description}
            </p>
            <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-green-600">
                    ${product.price}
                </span>
                <span className="text-sm text-gray-500">
                    ⭐ {product.rating.rate}
                </span>
            </div>
        </div>
    )
}