"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SortSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "most-popular";

  const handleValueChange = (value: string) => {
    // Clone lại params hiện tại để giữ các filter khác (nếu có)
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.set("page", "1"); // Reset về trang 1 khi sort lại
    
    // Đẩy URL mới -> Server Component cha (ShopPage) sẽ re-render và fetch lại dữ liệu
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Select defaultValue={currentSort} onValueChange={handleValueChange}>
      <SelectTrigger className="font-medium text-sm px-1.5 sm:text-base w-[180px] text-black bg-transparent border-none focus:ring-0 focus:ring-offset-0 shadow-none">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="most-popular">Most Popular</SelectItem>
        <SelectItem value="low-price">Price: Low to High</SelectItem>
        <SelectItem value="high-price">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortSelect;