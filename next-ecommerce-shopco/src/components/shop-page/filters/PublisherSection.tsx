"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdCheckmark } from "react-icons/io";

const publishers = [
  "NXB Kim Đồng",
  "NXB Trẻ",
  "NXB Văn Học",
  "NXB Lao Động",
  "Nhã Nam",
];

const PublisherSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPublisher = searchParams.get("publisher");

  const handleSelect = (pub: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedPublisher === pub) {
      params.delete("publisher"); // Bỏ chọn
    } else {
      params.set("publisher", pub);
    }
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-publisher">
      <AccordionItem value="filter-publisher" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Publisher
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col space-y-2">
            {publishers.map((pub, index) => (
              <button
                key={index}
                type="button"
                className="flex items-center justify-between group"
                onClick={() => handleSelect(pub)}
              >
                <span className={cn("text-black/60 group-hover:text-black text-sm", selectedPublisher === pub && "text-black font-medium")}>
                  {pub}
                </span>
                {selectedPublisher === pub && (
                  <IoMdCheckmark className="text-black" />
                )}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PublisherSection;