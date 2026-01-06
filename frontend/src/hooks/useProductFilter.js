import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { productService } from "@/services/productService";

const ITEMS_PER_PAGE = 24;

export const useProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    AUTHOR: "",
    PUBLISHER: "",
    sort: "",
    order: "asc"
  });

  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [resAuthors, resPublishers] = await Promise.all([
          productService.getAuthors(),
          productService.getPublishers()
        ]);
        setAuthors(resAuthors);
        setPublishers(resPublishers);
      } catch (error) { console.error(error); }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let data = [];
        if (query) {
          setFilters(prev => ({ ...prev, minPrice: "", maxPrice: "", AUTHOR: "", PUBLISHER: "" }));
          data = await productService.searchByName(query);
        } else {
          const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== "")
          );
          data = await productService.filter(cleanFilters);
        }
        setAllProducts(Array.isArray(data) ? data : []);
        setCurrentPage(1);
      } catch (error) {
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  const applyFilters = async () => {
    setSearchParams({});
    setLoading(true);
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );
      const data = await productService.filter(cleanFilters);
      setAllProducts(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allProducts, currentPage]);

  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

  return {
    products: paginatedProducts,
    totalCount: allProducts.length,
    authors,
    publishers,
    filters,
    loading,
    handleFilterChange,
    applyFilters,
    query,
    currentPage,
    totalPages,
    setCurrentPage
  };
};