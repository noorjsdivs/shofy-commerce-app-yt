import Container from "@/components/Container";
import InfiniteCategoryGrid from "@/components/pages/categories/InfiniteCategoryGrid";
import { getData } from "../helpers";
import { getCategoriesWithCounts } from "../helpers/productHelpers";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product Categories | Shofy - Shop by Category",
  description:
    "Explore our wide range of product categories including electronics, fashion, home decor, beauty, and more. Find exactly what you're looking for with our organized collections.",
  keywords: [
    "product categories",
    "electronics",
    "fashion",
    "home decor",
    "beauty products",
    "clothing",
    "accessories",
    "shop by category",
  ],
  openGraph: {
    title: "Product Categories | Shofy",
    description:
      "Discover our wide range of product categories. Find exactly what you're looking for with our carefully curated collections.",
    url: "/categories",
    siteName: "Shofy",
    type: "website",
  },
  alternates: {
    canonical: "/categories",
  },
};

export default async function CategoriesPage() {
  // Fetch categories and all products data
  const [categoriesData, allProductsData] = await Promise.all([
    getData(`https://dummyjson.com/products/categories`),
    getData(`https://dummyjson.com/products?limit=0`), // Fetch all products
  ]);

  // Get categories with product counts
  const categoriesWithCounts = getCategoriesWithCounts(
    allProductsData?.products || []
  );

  // Combine API categories with counts
  const enrichedCategories =
    categoriesData?.map((category: any) => ({
      ...category,
      count:
        categoriesWithCounts.find((c) => c.slug === category.slug)?.count || 0,
    })) || [];

  return (
    <Container className="py-10">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Shop by Categories
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our wide range of product categories. Find exactly what
          you&apos;re looking for with our carefully curated collections.
        </p>

        {/* Breadcrumb */}
        <nav className="mt-6 text-sm">
          <ol className="flex items-center justify-center space-x-2 text-gray-500">
            <li>
              <Link href="/" className="hover:text-gray-700 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">Categories</li>
          </ol>
        </nav>
      </div>

      {/* Categories Grid */}
      <InfiniteCategoryGrid
        initialCategories={enrichedCategories}
        totalProducts={allProductsData?.total || 0}
      />
    </Container>
  );
}
