import React, { useRef, useCallback } from "react";
import { Link } from "react-router";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/BookCard";

const SCROLL_AMOUNT = 300; // px per click

const BookCarousel = ({ title, books = [] }) => {
  const scrollRef = useRef(null);

  const handleWheel = useCallback((event) => {
    const container = scrollRef.current;
    if (!container) return;

    // Shift + wheel OR true horizontal wheel -> handle horizontally
    const isHorizontalIntent =
      event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY);

    if (isHorizontalIntent) {
      // Use deltaY when shift-scrolling, deltaX when using tilt wheel
      const delta =
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

      container.scrollLeft += delta;
      event.preventDefault();
      event.stopPropagation();
    } else {
      return;
    }
  }, []);

  const scrollByAmount = (amount) => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  const scrollLeftClick = () => scrollByAmount(-SCROLL_AMOUNT);
  const scrollRightClick = () => scrollByAmount(SCROLL_AMOUNT);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <Link to={`/category/${title.replace(/\s+/g, "-").toLowerCase()}`}>
          <Button variant="ghost" className="text-primary hover:text-primary">
            Xem tất cả <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="relative">
        {/* Left button */}
        <button
          type="button"
          onClick={scrollLeftClick}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 rounded-full bg-white/80 shadow hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeft className="w-4 h-4 text-slate-700" />
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex pb-4 -mx-2 space-x-4 overflow-x-auto scrollbar-hide"
          onWheel={handleWheel}
        >
          {books.map((book) => (
            <BookCard key={book.productId} book={book} />
          ))}
        </div>

        {/* Right button */}
        <button
          type="button"
          onClick={scrollRightClick}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 h-8 rounded-full bg-white/80 shadow hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronRight className="w-4 h-4 text-slate-700" />
        </button>
      </div>
    </section>
  );
};

export default BookCarousel;
