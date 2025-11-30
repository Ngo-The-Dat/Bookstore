"use client";

import { Product } from "@/types/product.types";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const PhotoSection = ({ data }: { data: Product }) => {
  const [selected, setSelected] = useState<string>(data.srcUrl);

  return (
    <div className="flex flex-col-reverse lg:flex-row lg:space-x-3.5">
      {/* Thumbnails */}
      {data?.gallery && data.gallery.length > 0 && (
        <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3.5 w-full lg:w-fit items-center lg:justify-start justify-center mt-3 lg:mt-0">
          {data.gallery.map((photo, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "bg-[#F0EEED] rounded-[13px] xl:rounded-[20px] w-full max-w-[100px] xl:max-w-[152px] aspect-square overflow-hidden border-2",
                selected === photo ? "border-black" : "border-transparent"
              )}
              onClick={() => setSelected(photo)}
            >
              <Image
                src={photo}
                width={152}
                height={167}
                className="w-full h-full object-cover"
                alt={`${data.title} - ${index}`}
                priority
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex items-center justify-center bg-[#F0EEED] rounded-[13px] sm:rounded-[20px] w-full h-full min-h-[300px] lg:min-h-[500px] overflow-hidden">
        <Image
          src={selected}
          width={444}
          height={530}
          className="w-full h-full object-contain" // Dùng object-contain để hiển thị trọn vẹn sách
          alt={data.title}
          priority
          unoptimized
        />
      </div>
    </div>
  );
};

export default PhotoSection;