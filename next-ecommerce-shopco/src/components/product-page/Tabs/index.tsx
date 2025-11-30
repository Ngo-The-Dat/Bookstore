"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Review } from "@/types/review.types";

type TabsProps = {
  description?: string;
  reviews: Review[];
};

const Tabs = ({ description, reviews }: TabsProps) => {
  const [active, setActive] = useState<number>(1);

  return (
    <div>
      {/* Tab Buttons (Translated) */}
      <div className="flex items-center mb-6 sm:mb-8 border-b border-black/10">
        <Button
          variant="ghost"
          className={cn([
            active === 1 ? "border-b-2 border-black font-medium" : "text-black/60 font-normal",
            "p-4 sm:p-6 rounded-none flex-1 text-base sm:text-lg",
          ])}
          onClick={() => setActive(1)}
        >
          Product Details
        </Button>
        <Button
          variant="ghost"
          className={cn([
            active === 2 ? "border-b-2 border-black font-medium" : "text-black/60 font-normal",
            "p-4 sm:p-6 rounded-none flex-1 text-base sm:text-lg",
          ])}
          onClick={() => setActive(2)}
        >
          Rating & Reviews ({reviews.length})
        </Button>
      </div>

      <div className="mb-12 sm:mb-16">
        
        {/* TAB 1: DESCRIPTION */}
        {active === 1 && (
          <div className="text-black/80 leading-relaxed whitespace-pre-line">
            {description ? description : "No description available for this product."}
          </div>
        )}

        {/* TAB 2: REVIEWS */}
        {active === 2 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">All Reviews</h3>
            </div>
            
            {reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-[20px] p-6 space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="font-bold text-yellow-500">{review.rating} / 5 ★</span>
                       <span className="text-gray-400 text-sm">{review.date}</span>
                    </div>
                    <h4 className="font-bold text-lg">{review.user}</h4>
                    <p className="text-gray-600">"{review.content}"</p>
                  </div>
                ))}
              </div>
            ) : (
               <p className="text-center text-gray-500 py-10">No reviews yet.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default Tabs;