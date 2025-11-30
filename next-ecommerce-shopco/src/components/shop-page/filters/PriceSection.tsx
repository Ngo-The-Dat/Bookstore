"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const PriceSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Mặc định 0 - 500k
  const [range, setRange] = useState([0, 500000]);

  const handleApplyPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", range[0].toString());
    params.set("maxPrice", range[1].toString());
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price Range (VND)
        </AccordionTrigger>
        <AccordionContent className="pt-4" contentClassName="overflow-visible">
          <div className="px-2">
            <Slider
              defaultValue={[0, 500000]}
              min={0}
              max={1000000} // Max 1 triệu
              step={10000}
              value={range}
              onValueChange={(val: any) => setRange(val)}
              className="my-6"
            />
          </div>
          <div className="flex justify-between items-center mb-3 text-sm font-medium">
            <span>{new Intl.NumberFormat('vi-VN').format(range[0])}đ</span>
            <span>{new Intl.NumberFormat('vi-VN').format(range[1])}đ</span>
          </div>
          <Button 
            onClick={handleApplyPrice}
            className="w-full h-8 rounded-full text-xs" 
            variant="outline"
          >
            Apply Price
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;