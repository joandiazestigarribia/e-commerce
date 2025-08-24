import { Product } from "@/types/api";
import { ProductCard } from "../ProductCard";

interface ProductListProps {
    products: Product[]
}

export const ProductList = ({ products }: ProductListProps) => {
    return (
        <div className="w-full py-[20px] px-4">
            <div className="grid grid-cols-3 grid-rows-1 gap-[60px] max-w-[1200px] mx-auto">
                {products.map((product: Product) => (
                    <div key={product.id} className="text-center">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};