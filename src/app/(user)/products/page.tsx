import Container from "@/components/Container";
import EnhancedProductsSideNav from "@/components/products/EnhancedProductsSideNav";
import { getData } from "../helpers";
import InfiniteProductList from "@/components/products/InfiniteProductList";
import {
  getBestSellers,
  getNewArrivals,
  getOffers,
  searchProducts,
  getProductsByCategory,
} from "../helpers/productHelpers";
import Link from "next/link";

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    min_price?: string;
    max_price?: string;
    color?: string;
    sort?: string;
    page?: string;
  }>;
}

const ProductsPage = async ({ searchParams }: Props) => {
  // Await searchParams for Next.js 15 compatibility
  const params = await searchParams;

  // Fetch all products and categories
  const [productsData, categoriesData] = await Promise.all([
    getData(`https://dummyjson.com/products?limit=0`),
    getData(`https://dummyjson.com/products/categories`),
  ]);

  let { products } = productsData;
  const allProducts = [...products]; // Keep original for filters

  // Extract unique brands from all products
  const uniqueBrands = [
    ...new Set(allProducts.map((product: any) => product.brand)),
  ].sort();

  // Apply filters
  if (params.category) {
    switch (params.category) {
      case "bestsellers":
        products = getBestSellers(products);
        break;
      case "new":
        products = getNewArrivals(products);
        break;
      case "offers":
        products = getOffers(products);
        break;
      default:
        products = getProductsByCategory(products, params.category);
    }
  }

  // Filter by search term
  if (params.search) {
    products = searchProducts(products, params.search);
  }

  // Filter by brand
  if (params.brand) {
    products = products.filter(
      (product: any) =>
        product.brand &&
        product.brand.toLowerCase().includes(params.brand!.toLowerCase())
    );
  }

  // Filter by price range
  if (params.min_price || params.max_price) {
    const minPrice = params.min_price ? parseFloat(params.min_price) : 0;
    const maxPrice = params.max_price ? parseFloat(params.max_price) : Infinity;
    products = products.filter(
      (product: any) => product.price >= minPrice && product.price <= maxPrice
    );
  }

  // Filter by color
  if (params.color) {
    products = products.filter((product: any) => {
      const colorLower = params.color!.toLowerCase();
      // Check in tags
      if (product.tags && Array.isArray(product.tags)) {
        const hasColorInTags = product.tags.some((tag: string) =>
          tag.toLowerCase().includes(colorLower)
        );
        if (hasColorInTags) return true;
      }
      // Check in title
      return product.title.toLowerCase().includes(colorLower);
    });
  }

  // Get the page title based on category
  const getPageTitle = () => {
    if (params.category) {
      switch (params.category) {
        case "bestsellers":
          return "Best Sellers";
        case "new":
          return "New Arrivals";
        case "offers":
          return "Special Offers";
        default:
          return `${
            params.category.charAt(0).toUpperCase() + params.category.slice(1)
          } Products`;
      }
    }
    if (params.search) {
      return `Search Results for "${params.search}"`;
    }
    return "All Products";
  };

  return (
    <Container className="py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {getPageTitle()}
        </h1>
        <p className="text-gray-600 text-lg">
          {params.category || params.search
            ? `Found ${products.length} products`
            : `Discover our complete collection of ${products.length} products`}
        </p>

        {/* Breadcrumb */}
        <nav className="mt-4 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/products" className="hover:text-gray-700">
                Products
              </Link>
            </li>
            {params.category && (
              <>
                <li>/</li>
                <li className="text-gray-900 font-medium">{getPageTitle()}</li>
              </>
            )}
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/5">
          <EnhancedProductsSideNav
            categories={categoriesData}
            brands={uniqueBrands}
            allProducts={allProducts}
          />
        </div>

        {/* Products Section */}
        <div className="flex-1 min-w-0">
          <InfiniteProductList
            products={products}
            currentSort={params.sort || "default"}
          />
        </div>
      </div>
    </Container>
  );
};

export default ProductsPage;
