import React from "react";
import { getData } from "@/app/(user)/helpers";
import { getCategoriesWithCounts } from "@/app/(user)/helpers/productHelpers";
import RoundedCategoriesCarousel from "./RoundedCategoriesCarousel";

// Category images mapping
const categoryImages: { [key: string]: string } = {
  beauty:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop&crop=center",
  fragrances:
    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=200&h=200&fit=crop&crop=center",
  furniture:
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=200&fit=crop&crop=center",
  groceries:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center",
  "home-decoration":
    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200&h=200&fit=crop&crop=center",
  "kitchen-accessories":
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop&crop=center",
  laptops:
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop&crop=center",
  "mens-shirts":
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&h=200&fit=crop&crop=center",
  "mens-shoes":
    "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop&crop=center",
  "mens-watches":
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&h=200&fit=crop&crop=center",
  "mobile-accessories":
    "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=200&h=200&fit=crop&crop=center",
  motorcycle:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop&crop=center",
  "skin-care":
    "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=200&h=200&fit=crop&crop=center",
  smartphones:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=200&fit=crop&crop=center",
  "sports-accessories":
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=center",
  sunglasses:
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=200&h=200&fit=crop&crop=center",
  tablets:
    "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=200&h=200&fit=crop&crop=center",
  tops: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop&crop=center",
  vehicle:
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop&crop=center",
  "womens-bags":
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop&crop=center",
  "womens-dresses":
    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&h=200&fit=crop&crop=center",
  "womens-jewellery":
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&h=200&fit=crop&crop=center",
  "womens-shoes":
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&h=200&fit=crop&crop=center",
  "womens-watches":
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&crop=center",
};

// Category descriptions
const categoryDescriptions: { [key: string]: string } = {
  beauty: "Premium beauty products and cosmetics",
  fragrances: "Luxurious fragrances and perfumes",
  furniture: "Stylish furniture for your home",
  groceries: "Fresh groceries and essentials",
  "home-decoration": "Beautiful home decor items",
  "kitchen-accessories": "Essential kitchen tools",
  laptops: "High-performance laptops",
  "mens-shirts": "Stylish shirts for men",
  "mens-shoes": "Comfortable and fashionable footwear",
  "mens-watches": "Elegant timepieces for men",
  "mobile-accessories": "Mobile device accessories",
  motorcycle: "Motorcycle gear and accessories",
  "skin-care": "Premium skincare products",
  smartphones: "Latest smartphones and devices",
  "sports-accessories": "Sports gear and equipment",
  sunglasses: "Stylish eyewear and sunglasses",
  tablets: "Tablets and digital accessories",
  tops: "Trendy tops and casual wear",
  vehicle: "Automotive accessories and parts",
  "womens-bags": "Fashionable bags and handbags",
  "womens-dresses": "Elegant dresses for every occasion",
  "womens-jewellery": "Beautiful jewelry and accessories",
  "womens-shoes": "Stylish footwear for women",
  "womens-watches": "Elegant watches for women",
};

interface ApiCategory {
  slug: string;
  name: string;
  url: string;
}

interface EnhancedCategory extends ApiCategory {
  image: string;
  itemCount: number;
  description: string;
}

const DynamicFeaturedCategories: React.FC = async () => {
  try {
    // Fetch categories and all products data
    const [categoriesData, allProductsData] = await Promise.all([
      getData(`https://dummyjson.com/products/categories`),
      getData(`https://dummyjson.com/products?limit=0`), // Fetch all products
    ]);

    // Get categories with product counts
    const categoriesWithCounts = getCategoriesWithCounts(
      allProductsData?.products || []
    );

    // Enhance categories with images, descriptions, and counts
    const enhancedCategories: EnhancedCategory[] =
      categoriesData
        ?.slice(0, 12) // Take max 12 categories for homepage
        ?.map((category: ApiCategory) => {
          const categorySlug = category.slug;
          const categoryCount =
            categoriesWithCounts.find((c) => c.slug === categorySlug)?.count ||
            0;

          return {
            ...category,
            image:
              categoryImages[categorySlug] ||
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center",
            itemCount: categoryCount,
            description:
              categoryDescriptions[categorySlug] ||
              `Discover amazing ${category.name} products`,
          };
        }) || [];

    return <RoundedCategoriesCarousel categories={enhancedCategories} />;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600">
            Unable to load categories at the moment. Please try again later.
          </p>
        </div>
      </section>
    );
  }
};

export default DynamicFeaturedCategories;
