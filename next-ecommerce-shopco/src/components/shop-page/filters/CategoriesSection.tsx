"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

// Bạn có thể thay bằng danh sách Category thật từ DB
const categoriesData = [
  "Fiction", // Văn học
  "Science", // Khoa học
  "History", // Lịch sử
  "Children", // Thiếu nhi
  "Business", // Kinh tế
  "Self-help", // Kỹ năng sống
];

const CategoriesSection = () => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  return (
    <div className="flex flex-col space-y-0.5 text-black/60">
      {categoriesData.map((category, idx) => (
        <Link
          key={idx}
          // Khi click sẽ reload trang với param category
          href={`/shop?category=${encodeURIComponent(category)}`}
          className={cn(
            "flex items-center justify-between py-2 hover:text-black transition-colors",
            currentCategory === category && "text-black font-bold"
          )}
        >
          {category} <MdKeyboardArrowRight />
        </Link>
      ))}
    </div>
  );
};

export default CategoriesSection;