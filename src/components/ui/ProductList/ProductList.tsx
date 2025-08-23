import { Product } from "@/types/api";
import { ProductCard } from "../ProductCard";

interface ProductListProps {
    products: Product[]
}

export const ProductList = ({ products }: ProductListProps) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Productos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: Product) => (
                    <div key={product.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}
