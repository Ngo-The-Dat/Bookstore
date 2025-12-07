import { useState, useEffect } from "react";
import { productService } from "@/services/productService";
import { toast } from "sonner";

export const useHomeData = () => {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const bestSellerData = await productService.getAll();
        const newArrivalData = await productService.getAll();

        setBestSellers(bestSellerData);
        setNewArrivals(newArrivalData);
      } catch (error) {
        console.error("Lỗi tải dữ liệu trang chủ:", error);
        toast.error("Không thể tải danh sách sách.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { bestSellers, newArrivals, loading };
};