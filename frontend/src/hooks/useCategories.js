import { useState, useEffect } from "react";
import { categoryService } from "@/services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        const list = Array.isArray(data) ? data : (data.categories || []);
        setCategories(list);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};