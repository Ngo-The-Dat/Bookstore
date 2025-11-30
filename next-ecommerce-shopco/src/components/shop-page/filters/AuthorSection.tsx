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

const authors = [
  "Nguyễn Nhật Ánh",
  "Paulo Coelho",
  "J.K. Rowling",
  "Haruki Murakami",
  "Rosie Nguyễn",
];

const AuthorSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedAuthor = searchParams.get("author");

  const handleSelect = (author: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedAuthor === author) {
      params.delete("author");
    } else {
      params.set("author", author);
    }
    params.set("page", "1");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <Accordion type="single" collapsible defaultValue="filter-author">
      <AccordionItem value="filter-author" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Authors
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-wrap gap-2">
            {authors.map((author, index) => (
              <button
                key={index}
                type="button"
                className={cn([
                  "bg-[#F0F0F0] px-4 py-2 text-xs rounded-full transition-all",
                  selectedAuthor === author ? "bg-black text-white" : "hover:bg-gray-200 text-black/60",
                ])}
                onClick={() => handleSelect(author)}
              >
                {author}
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AuthorSection;