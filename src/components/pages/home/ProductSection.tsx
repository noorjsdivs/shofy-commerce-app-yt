import Link from "next/link";
import Container from "../../Container";
import { ProductType } from "../../../../type";
import ProductCard from "../../ProductCard";
import Button from "../../ui/Button";

interface Props {
  title: string;
  products: ProductType[];
  viewMoreLink: string;
  subtitle?: string;
}

const ProductSection = ({ title, products, viewMoreLink, subtitle }: Props) => {
  // Limit to 8 products for homepage display
  const displayProducts = products?.slice(0, 8) || [];

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 text-sm md:text-base">{subtitle}</p>
          )}
        </div>
        <Link href={viewMoreLink}>
          <Button
            variant="outline"
            size="md"
            className="transition-all duration-300"
          >
            View More
          </Button>
        </Link>
      </div>

      {displayProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayProducts.map((product: ProductType) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">
            No products available at the moment.
          </p>
        </div>
      )}
    </Container>
  );
};

export default ProductSection;
