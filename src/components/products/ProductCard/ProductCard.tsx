import { Product } from "@/types/api";

interface ProductCardProps {
    product: Product
}

export const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div className="group cursor-pointer w-full">
            <div className="mb-[10px] overflow-hidden bg-gray-50 aspect-[3/4] relative">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="text-center space-y-1">
                <h3 className="text-[10px] md:text-[11px] font-normal text-black tracking-[1px] uppercase leading-tight">
                    {product.title.length > 30 ? product.title.substring(0, 30) + '...' : product.title}
                </h3>
                <p className="text-[10px] md:text-[11px] font-normal text-black">
                    ${product.price}
                </p>
            </div>
        </div>
    );
};