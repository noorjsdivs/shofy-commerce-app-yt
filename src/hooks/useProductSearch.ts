import { useState, useEffect, useRef } from "react";
import { getData } from "@/app/(user)/helpers";
import { ProductType } from "../../type";

interface UseProductSearchProps {
  debounceDelay?: number;
}

interface UseProductSearchReturn {
  search: string;
  setSearch: (value: string) => void;
  products: ProductType[];
  filteredProducts: ProductType[];
  suggestedProducts: ProductType[];
  isLoading: boolean;
  hasSearched: boolean;
  clearSearch: () => void;
}

export const useProductSearch = ({
  debounceDelay = 300,
}: UseProductSearchProps = {}): UseProductSearchReturn => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://dummyjson.com";

  // Fetch all products on hook initialization (fallback)
  useEffect(() => {
    const getProducts = async () => {
      const endpoint = `${API_BASE_URL}/products`;
      try {
        const data = await getData(endpoint);
        setProducts(data?.products || []);
        // Set first 10 products as suggested/trending products
        setSuggestedProducts((data?.products || []).slice(0, 10));
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    getProducts();
  }, [API_BASE_URL]);

  // Search function using API endpoint
  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Use API search endpoint for better results
      const searchEndpoint = `${API_BASE_URL}/products/search?q=${encodeURIComponent(
        searchTerm
      )}&limit=10`;
      const searchData = await getData(searchEndpoint);

      if (searchData?.products) {
        setFilteredProducts(searchData.products);
      } else {
        // Fallback to local filtering if API search fails
        const filtered = products
          .filter((item: ProductType) =>
            item?.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .slice(0, 10); // Limit results
        setFilteredProducts(filtered);
      }
    } catch (error) {
      console.error("Error performing search", error);
      // Fallback to local filtering on error
      const filtered = products
        .filter((item: ProductType) =>
          item?.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 10); // Limit results
      setFilteredProducts(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle search with debouncing
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      performSearch(search);
    }, debounceDelay);

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search, products, API_BASE_URL, debounceDelay]);

  const clearSearch = () => {
    setSearch("");
    setFilteredProducts([]);
    setHasSearched(false);
  };

  return {
    search,
    setSearch,
    products,
    filteredProducts,
    suggestedProducts,
    isLoading,
    hasSearched,
    clearSearch,
  };
};
