import Banner from "@/components/pages/home/Banner";
import ProductSection from "@/components/pages/home/ProductSection";
import DynamicFeaturedCategories from "@/components/pages/home/DynamicFeaturedCategories";
import SpecialOffersBanner from "@/components/pages/home/SpecialOffersBanner";
import SectionDivider from "@/components/ui/SectionDivider";
import { getData } from "./helpers";
import {
  getBestSellers,
  getNewArrivals,
  getOffers,
} from "./helpers/productHelpers";

export default async function Home() {
  const endpoint = `https://dummyjson.com/products?limit=0`; // Fetch all products
  const productData = await getData(endpoint);
  const allProducts = productData?.products || [];

  // Categorize products
  const bestSellers = getBestSellers(allProducts);
  const newArrivals = getNewArrivals(allProducts);
  const offers = getOffers(allProducts);

  return (
    <main>
      <Banner />

      {/* Featured Categories Section */}
      <DynamicFeaturedCategories />

      {/* Special Offers Banner */}
      <SpecialOffersBanner />

      <SectionDivider />

      {/* Best Sellers Section */}
      <ProductSection
        title="Best Sellers"
        subtitle="Our most popular products loved by customers"
        products={bestSellers}
        viewMoreLink="/products?category=bestsellers"
      />

      <SectionDivider />

      {/* New Arrivals Section */}
      <ProductSection
        title="New Arrivals"
        subtitle="Latest products just added to our collection"
        products={newArrivals}
        viewMoreLink="/products?category=new"
      />

      <SectionDivider />

      {/* Special Offers Section */}
      <ProductSection
        title="Special Offers"
        subtitle="Don't miss out on these amazing deals"
        products={offers}
        viewMoreLink="/offers"
      />
    </main>
  );
}
