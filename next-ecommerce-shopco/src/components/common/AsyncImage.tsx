"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/axios"; // File axios đã tạo ở bước trước
import { cn } from "@/lib/utils";

type AsyncImageProps = {
  src: string; // Đây là tên file (VD: "1_card.jpg")
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

const AsyncImage = ({ src, alt, width, height, className, priority = false }: AsyncImageProps) => {
  const [imgUrl, setImgUrl] = useState<string>("/images/placeholder.png"); // Ảnh mặc định nếu loading hoặc lỗi
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) return;

    // Nếu src đã là URL đầy đủ (http...) thì dùng luôn
    if (src.startsWith("http") || src.startsWith("/")) {
      setImgUrl(src);
      setIsLoading(false);
      return;
    }

    const fetchUrl = async () => {
      try {
        // Gọi API lấy URL theo logic cũ
        const res = await api.get("/images/urls", { params: { names: src } });
        const data = res.data;
        let finalUrl = null;

        // Logic xử lý response phức tạp từ backend cũ
        if (typeof data === "string") finalUrl = data;
        else if (Array.isArray(data)) finalUrl = data[0];
        else if (typeof data === "object" && data !== null) {
          finalUrl =
            data[src] ||
            data.url ||
            (Array.isArray(data.urls) && data.urls[0]) ||
            Object.values(data).find(
              (v) => typeof v === "string" && (v.startsWith("http") || v.startsWith("/"))
            );
        }

        if (finalUrl) setImgUrl(finalUrl);
      } catch (error) {
        console.error("Failed to load image:", src);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrl();
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-[#F0EEED]", className)} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <span className="text-xs text-gray-400">Loading...</span>
        </div>
      )}
      <Image
        src={imgUrl}
        alt={alt}
        width={width}
        height={height}
        className={cn("w-full h-full object-cover transition-all duration-500", !isLoading && "hover:scale-110")}
        priority={priority}
        unoptimized={true} // Quan trọng: Bỏ qua optimize của Next.js vì URL lấy từ nguồn ngoài
      />
    </div>
  );
};

export default AsyncImage;