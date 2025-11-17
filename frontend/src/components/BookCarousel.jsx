import React, { useRef } from "react";
import { Link } from "react-router";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";

const SCROLL_AMOUNT = 600; 

const BookCarousel = ({ title, books = [] }) => {
  const scrollRef = useRef(null);

  const scroll = (amount) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          <Link to={`/category/${title.replace(/\s+/g, "-").toLowerCase()}`}>
            <Button variant="ghost" className="text-primary hover:text-primary">
              Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative group">
        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll(-SCROLL_AMOUNT)}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4"
        >
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => scroll(SCROLL_AMOUNT)}
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  );
};

export default BookCarousel;
