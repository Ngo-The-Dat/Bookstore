import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const formatCurrency = (number) => {
  if (typeof number !== 'number') return '';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
};

const BookCard = ({ book }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchImageUrl = async () => {
      if (!book || !Array.isArray(book.IMG) || book.IMG.length === 0) {
        // không có ảnh: dùng placeholder
        if (isMounted) setImageUrl('https://via.placeholder.com/400x600.png?text=No+Image');
        return;
      }

      const coverImageName = book.IMG[0];
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "";
        const endpoint = `${API_BASE_URL}/images/urls`;

        // Gọi theo yêu cầu: ?names=1.jpg (names là tên query param)
        const res = await axios.get(endpoint, { params: { names: coverImageName } });

        if (!isMounted) return;

        // Xử lý các kiểu trả về khác nhau:
        // - server trả về trực tiếp string url
        // - server trả về array: [url1, url2]
        // - server trả về object: { url: '...', urls: ['...'] } hoặc { [name]: 'url' }
        let resolvedUrl = null;
        const data = res?.data;

        if (!data) {
          resolvedUrl = null;
        } else if (typeof data === "string") {
          resolvedUrl = data;
        } else if (Array.isArray(data)) {
          resolvedUrl = data[0] || null;
        } else if (typeof data === "object") {
          // kiểm tra một số trường phổ biến
          resolvedUrl =
            data.url ||
            (Array.isArray(data.urls) && data.urls[0]) ||
            data[coverImageName] || // ví dụ { "1.jpg": "http://..." }
            Object.values(data).find(v => typeof v === "string") ||
            null;
        }

        if (resolvedUrl) {
          setImageUrl(resolvedUrl);
        } else {
          // fallback nếu server trả về format khác
          console.warn("Không tìm thấy URL ảnh trong response:", data);
          setImageUrl('https://via.placeholder.com/400x600.png?text=Image+Unavailable');
        }
      } catch (error) {
        console.error(`Lỗi khi lấy ảnh '${coverImageName}':`, error?.response?.data ?? error.message);
        if (isMounted) {
          setImageUrl('https://via.placeholder.com/400x600.png?text=Image+Error');
        }
      }
    };

    fetchImageUrl();

    return () => { isMounted = false; };
  }, [book]); // phụ thuộc vào toàn bộ book để an toàn

  if (!book) return null;

  return (
    <div className="flex-shrink-0 w-48 group">
      <Card className="h-full border-transparent shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 overflow-hidden">
        <Link to={`/book/${book._id}`} className="block">
          <CardHeader className="p-0 relative bg-gray-100 h-60 overflow-hidden flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={book.TENSACH}
                className="h-full w-auto object-cover object-center block"
                draggable="false"
              />
            ) : (
              <div className="w-full h-full animate-pulse bg-gray-200" />
            )}
          </CardHeader>





          <div className="p-3 flex flex-col justify-between flex-grow h-36">
            <CardContent className="p-0">
              <CardTitle className="text-sm font-semibold leading-tight h-10 line-clamp-2">
                {book.TENSACH}
              </CardTitle>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-0 mt-2">
              <p className="text-base font-bold text-destructive">
                {formatCurrency(book.GIABAN)}
              </p>
              <p className="text-xs text-gray-400 line-through mt-0.5">
                {formatCurrency(book.GIABIA)}
              </p>
            </CardFooter>
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default BookCard;
