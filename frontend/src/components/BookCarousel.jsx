import React from "react";
import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";

const BookCarousel = ({ title, books = [] }) => {
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <Link to={`/category/${title.replace(/\s+/g, '-').toLowerCase()}`}>
          <Button variant="ghost" className="text-primary hover:text-primary">
            Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div className="relative">
        <div className="flex pb-4 -mx-2 space-x-4 overflow-x-auto">
          {books.map((book) => (
            <BookCard key={book.productId} book={book} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookCarousel;