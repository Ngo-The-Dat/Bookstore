import React from "react";
import Rating from "../ui/Rating";
import Link from "next/link";
import { Product } from "@/types/product.types";
import AsyncImage from "./AsyncImage"; // Import component vừa tạo

type ProductCardProps = {
  data: Product;
};

const ProductCard = ({ data }: ProductCardProps) => {
  return (
    <Link
      href={`/shop/product/${data.id}/${data.title.split(" ").join("-")}`}
      className="flex flex-col items-start aspect-auto group"
    >
      <div className="w-full mb-2.5 xl:mb-4 overflow-hidden rounded-[13px] lg:rounded-[20px]">
        {/* Sử dụng AsyncImage thay vì Image */}
        <AsyncImage
          src={data.srcUrl} // Truyền tên file (VD: "1_card.jpg")
          alt={data.title}
          width={295}
          height={298}
          className="aspect-square w-full"
        />
      </div>
      
      <strong className="text-black xl:text-xl line-clamp-2">{data.title}</strong>
      
      {/* Phần đánh giá và giá giữ nguyên */}
      <div className="flex items-end mb-1 xl:mb-2">
        <Rating
          initialValue={data.rating}
          allowFraction
          SVGclassName="inline-block"
          emptyClassName="fill-gray-50"
          size={19}
          readonly
        />
        <span className="text-black text-xs xl:text-sm ml-[11px] xl:ml-[13px] pb-0.5 xl:pb-0">
          {data.rating}/5
        </span>
      </div>
      
      <div className="flex items-center space-x-[5px] xl:space-x-2.5">
        <span className="font-bold text-black text-xl xl:text-2xl">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price)}
        </span>
        {data.discount.percentage > 0 && (
           <>
            <span className="font-bold text-black/40 line-through text-xl xl:text-2xl">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.price / (1 - data.discount.percentage / 100))}
            </span>
            <span className="font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
              -{data.discount.percentage}%
            </span>
           </>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;