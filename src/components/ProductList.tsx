import Container from "./Container";
import { ProductType } from "../../type";
import ProductCard from "./ProductCard";

interface Props {
  product: {
    products: ProductType[];
  };
}

const ProductList = ({ product }: Props) => {
  const productsArray = product?.products;

  return (
    <Container className="py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {productsArray?.map((item: ProductType) => (
        <ProductCard key={item?.id} product={item} />
      ))}
    </Container>
  );
};

export default ProductList;
