"use client";

import React from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product.types";
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import AddToCardSection from "./AddToCardSection";

const formatCurrency = (amount: number) => {
  // Vẫn giữ VND vì bạn bán ở VN, nhưng có thể đổi sang USD nếu muốn
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const Header = ({ data }: { data: Product }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <PhotoSection data={data} />
      </div>

      <div>
        <h1
          className={cn([
            integralCF.className,
            "text-2xl md:text-[40px] md:leading-[40px] mb-3 md:mb-3.5 font-bold uppercase",
          ])}
        >
          {data.title}
        </h1>

        <div className="flex items-center mb-3 sm:mb-3.5">
          <Rating
            initialValue={data.rating}
            allowFraction
            SVGclassName="inline-block"
            emptyClassName="fill-gray-50"
            size={25}
            readonly
          />
          <span className="text-black text-xs sm:text-sm ml-[11px] sm:ml-[13px] pb-0.5 sm:pb-0">
            {data.rating}/5
          </span>
        </div>

        <div className="flex items-center space-x-2.5 sm:space-x-3 mb-5">
          <span className="font-bold text-black text-2xl sm:text-[32px]">
            {formatCurrency(data.price)}
          </span>
          
          {data.discount.percentage > 0 && (
            <>
              <span className="font-bold text-black/40 line-through text-2xl sm:text-[32px]">
                {formatCurrency(data.price / (1 - data.discount.percentage / 100))}
              </span>
              <span className="font-medium text-[10px] sm:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                -{data.discount.percentage}%
              </span>
            </>
          )}
        </div>

        {/* --- TRANSLATED SECTION --- */}
        <div className="text-sm sm:text-base text-black/60 mb-5 space-y-2 border-t border-b py-4 border-black/10">
          {data.author && (
            <p>
              <span className="font-semibold text-black">Author: </span>
              {data.author}
            </p>
          )}
          {data.publisher && (
            <p>
              <span className="font-semibold text-black">Publisher: </span>
              {data.publisher}
            </p>
          )}
          {data.stock !== undefined && (
            <p>
              <span className="font-semibold text-black">Status: </span>
              {data.stock > 0 ? (
                <span className="text-green-600 font-medium">In Stock ({data.stock})</span>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>
          )}
        </div>
        {/* --------------------------- */}

        <div className="mt-5">
            <AddToCardSection data={data} />
        </div>
      </div>
    </div>
  );
};

export default Header;