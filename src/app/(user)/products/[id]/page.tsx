import Container from "@/components/Container";
import { ProductType } from "../../../../../type";
import AddToCartButton from "@/components/AddToCartButton";
import { getData } from "@/app/(user)/helpers";
import ProductImages from "@/components/ProductImages";
import PriceFormat from "@/components/PriceFormat";
import { FaRegEye } from "react-icons/fa";
import { paymentImage } from "@/assets";
import { MdStar } from "react-icons/md";
import ProductPrice from "@/components/ProductPrice";
import ProductFeatures from "@/components/ProductFeatures";
import ProductSpecifications from "@/components/ProductSpecifications";
import RelatedProducts from "@/components/RelatedProducts";

interface Props {
  params: {
    id: string;
  };
}

const SingleProductPage = async ({ params }: Props) => {
  const { id } = await params;
  const endpoint = `https://dummyjson.com/products/${id}`;
  const product: ProductType = await getData(endpoint);

  // Fetch related products for the same category
  const allProductsEndpoint = "https://dummyjson.com/products?limit=0";
  const allProductsData = await getData(allProductsEndpoint);
  const allProducts: ProductType[] = allProductsData.products || [];

  const regularPrice = product?.price;
  const discountedPrice = product?.price + product?.discountPercentage / 100;

  return (
    <div>
      <Container className="grid grid-cols-1 md:grid-cols-2 gap-10 py-10">
        {/* Product Image */}
        <ProductImages images={product?.images} />
        {/* Product Details */}
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{product?.title}</h2>
          <div className="flex items-center justify-between">
            <ProductPrice
              regularPrice={regularPrice}
              discountedPrice={discountedPrice}
              product={product}
            />

            <div className="flex items-center gap-1">
              <div className="text-base text-light-text flex items-center">
                {Array?.from({ length: 5 })?.map((_, index) => {
                  const filled = index + 1 <= Math.floor(product?.rating);
                  const halfFilled =
                    index + 1 > Math.floor(product?.rating) &&
                    index < Math.ceil(product?.rating);

                  return (
                    <MdStar
                      key={index}
                      className={`${
                        filled
                          ? "text-[#fa8900]"
                          : halfFilled
                          ? "text-[#f7ca00]"
                          : "text-light-text"
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-base font-semibold">{`(${product?.rating?.toFixed(
                1
              )} reviews)`}</p>
            </div>
          </div>
          <p className="flex items-center">
            <FaRegEye className="mr-1" />{" "}
            <span className="font-semibold mr-1">250+</span> peoples are viewing
            this right now
          </p>
          <p>
            You are saving{" "}
            <span className="text-base font-semibold text-green-500">
              <PriceFormat amount={product?.discountPercentage / 100} />
            </span>{" "}
            upon purchase
          </p>
          <div>
            <p className="text-sm tracking-wide">{product?.description}</p>
            <p className="text-base">{product?.warrantyInformation}</p>
          </div>
          <p>
            Brand: <span className="font-medium">{product?.brand}</span>
          </p>
          <p>
            Category:{" "}
            <span className="font-medium capitalize">{product?.category}</span>
          </p>
          <p>
            Tags:{" "}
            {product?.tags?.map((item, index) => (
              <span key={index.toString()} className="font-medium capitalize">
                {item}
                {index < product?.tags?.length - 1 && ", "}
              </span>
            ))}
          </p>

          <AddToCartButton
            product={product}
            className=" rounded-md uppercase font-semibold"
          />

          <div className="bg-[#f7f7f7] p-5 rounded-md flex flex-col items-center justify-center gap-2">
            <img
              src={paymentImage.src}
              alt="payment"
              className="w-auto object-cover"
            />
            <p className="font-semibold">Guaranteed safe & secure checkout</p>
          </div>
        </div>

        {/* Product Specifications */}
        <div className="col-span-2">
          <ProductSpecifications product={product} />
        </div>

        {/* Reviews */}
        <div className="p-10 bg-[#f7f7f7] col-span-2 flex items-center flex-wrap gap-10">
          {product?.reviews?.map((item, index) => (
            <div
              key={index.toString()}
              className="bg-white/80 p-5 border border-amazonOrangeDark/50 rounded-md hover:border-amazonOrangeDark hover:bg-white duration-200 flex flex-col gap-1"
            >
              <p className="text-base font-semibold">{item?.comment}</p>
              <div className="text-xs">
                <p className="font-semibold">{item?.reviewerName}</p>
                <p className="">{item?.reviewerEmail}</p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {Array?.from({ length: 5 })?.map((_, index) => (
                    <MdStar
                      key={index}
                      className={`${
                        index < item?.rating
                          ? "text-yellow-500"
                          : "text-light-text"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Product Features Section */}
      <Container>
        <ProductFeatures />
      </Container>

      {/* Related Products Section */}
      <Container>
        <RelatedProducts
          products={allProducts}
          currentProductId={product?.id}
          category={product?.category}
        />
      </Container>
    </div>
  );
};

export default SingleProductPage;
