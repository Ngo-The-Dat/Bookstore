import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { productService } from "@/services/productService";

export const useSearchProducts = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        const data = await productService.searchByName(query);
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi tìm kiếm:", err);
        setError(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  return { products, loading, error, query };
};