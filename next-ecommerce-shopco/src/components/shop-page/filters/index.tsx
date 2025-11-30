import React from "react";
import CategoriesSection from "./CategoriesSection";
import PriceSection from "./PriceSection";
import PublisherSection from "./PublisherSection";
import AuthorSection from "./AuthorSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Filters = () => {
  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection />
      <hr className="border-t-black/10" />
      <PriceSection />
      <hr className="border-t-black/10" />
      <PublisherSection />
      <hr className="border-t-black/10" />
      <AuthorSection />
      <hr className="border-t-black/10" />
      
      {/* Nút Reset Filter */}
      <Link href="/shop" className="w-full">
        <Button
          type="button"
          className="bg-black w-full rounded-full text-sm font-medium py-4 h-12 mt-5"
        >
          Reset All Filters
        </Button>
      </Link>
    </>
  );
};

export default Filters;