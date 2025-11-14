import React from "react";
import { Link } from "react-router";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formatCurrency = (number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

const BookCard = ({ book }) => {
  
  if (!book) {
    return null;
  }

  return (
    <div className="flex-shrink-0 w-48 group">
      <Card className="h-full border-transparent shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden">
        <Link to={`/book/${book.productId}`} className="block">
          <CardHeader className="p-0 relative">
            <img
              src={book.img}
              alt={book.name}
              className="object-cover w-full h-60 transition-transform duration-300 group-hover:scale-105"
            />
          </CardHeader>
          <div className="p-3 flex flex-col justify-between flex-grow h-32">
            <CardContent className="p-0">
              {/* Sửa: Sử dụng book.name */}
              <CardTitle className="text-sm font-semibold leading-tight h-10 line-clamp-2">
                {book.name}
              </CardTitle>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-0 mt-2">
              {/* Sửa: Sử dụng book.price và định dạng lại */}
              <p className="text-base font-bold text-destructive">
                {formatCurrency(book.price)}
              </p>
            </CardFooter>
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default BookCard;