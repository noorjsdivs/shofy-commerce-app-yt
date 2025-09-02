import { ProductType } from "../../type";
import ProductCard from "./ProductCard";

interface RelatedProductsProps {
  products: ProductType[];
  currentProductId: number;
  category: string;
}

const RelatedProducts = ({
  products,
  currentProductId,
  category,
}: RelatedProductsProps) => {
  // Filter products by same category and exclude current product
  const relatedProducts = products
    .filter(
      (product) =>
        product.category === category && product.id !== currentProductId
    )
    .slice(0, 4); // Show only 4 related products

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Related Products
        </h3>
        <p className="text-gray-600">You might also like these products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
