import React from "react";
import { mapBookToProduct } from "@/lib/mapper";
import api from "@/lib/axios";
import BreadcrumbShop from "@/components/shop-page/BreadcrumbShop";
import ProductCard from "@/components/common/ProductCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MobileFilters from "@/components/shop-page/filters/MobileFilters";
import Filters from "@/components/shop-page/filters";
import { FiSliders } from "react-icons/fi";
import { Product } from "@/types/product.types";
import Link from "next/link";
import { redirect } from "next/navigation";
import SortSelect from "@/components/shop-page/filters/SortSelect"
import PublisherSection from "@/components/shop-page/filters/PublisherSection"

// Số sản phẩm trên 1 trang
const ITEMS_PER_PAGE = 9;

// 1. Fetch dữ liệu từ API
async function getAllProducts() {
  try {
    const res = await api.get("/products/get_all_products");
    return res.data.map((book: any) => mapBookToProduct(book));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// 2. Component chính
export default async function ShopPage({
  searchParams,
}: {
  searchParams: { 
    page?: string; 
    sort?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    publisher?: string;
    author?: string;
  };
}) {
  // 1. Lấy tham số từ URL
  const currentPage = Number(searchParams.page) || 1;
  const sortBy = searchParams.sort || "most-popular";
  const categoryParam = searchParams.category;
  const minPrice = Number(searchParams.minPrice) || 0;
  const maxPrice = Number(searchParams.maxPrice) || 100000000;
  const publisherParam = searchParams.publisher;
  const authorParam = searchParams.author;

  // 2. Fetch dữ liệu thô
  let products: Product[] = await getAllProducts();

  // --- 3. LOGIC FILTER (SERVER SIDE) ---
  
  // Lọc theo Category (Giả định trường category trong Product, 
  // bạn cần map trường này trong hàm mapBookToProduct nếu API có trả về tên Category)
  // Nếu API chưa trả về tên Category dạng chữ, đoạn này tạm thời bỏ qua hoặc so sánh ID
  if (categoryParam) {
    // Ví dụ: products = products.filter(p => p.categoryName === categoryParam);
  }

  // Lọc theo Giá
  products = products.filter(p => p.price >= minPrice && p.price <= maxPrice);

  // Lọc theo Nhà xuất bản
  if (publisherParam) {
    products = products.filter(p => 
      p.publisher?.toLowerCase().includes(publisherParam.toLowerCase())
    );
  }

  // Lọc theo Tác giả
  if (authorParam) {
    products = products.filter(p => 
      p.author?.toLowerCase().includes(authorParam.toLowerCase())
    );
  }

  // --- 4. LOGIC SORT (Giữ nguyên) ---
  if (sortBy === "low-price") {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === "high-price") {
    products.sort((a, b) => b.price - a.price);
  } else if (sortBy === "most-popular") {
    products.sort((a, b) => b.rating - a.rating); 
  }

  // --- 5. LOGIC PHÂN TRANG (Giữ nguyên) ---
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Nếu page nhập vào URL lớn hơn tổng số page -> redirect về page 1
  if (currentPage > totalPages && totalPages > 0) {
    redirect("/shop?page=1");
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  // Helper tạo URL cho phân trang
  const createPageUrl = (pageNumber: number | string) => {
    return `/shop?page=${pageNumber}&sort=${sortBy}`;
  };

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbShop />
        
        <div className="flex md:space-x-5 items-start">
          {/* Sidebar Filter (Desktop) */}
          <div className="hidden md:block min-w-[295px] max-w-[295px] border border-black/10 rounded-[20px] px-5 md:px-6 py-5 space-y-5 md:space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black text-xl">Filters</span>
              <FiSliders className="text-2xl text-black/40" />
            </div>
            <Filters />
          </div>

          {/* Main Content */}
          <div className="flex flex-col w-full space-y-5">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between">
                <h1 className="font-bold text-2xl md:text-[32px]">All Books</h1>
                <MobileFilters />
              </div>
              
              <div className="flex flex-col sm:items-center sm:flex-row mt-4 lg:mt-0">
                <span className="text-sm md:text-base text-black/60 mr-3 mb-2 sm:mb-0">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} Products
                </span>
                
                {/* Sort Dropdown - Dùng Client Component bọc ngoài hoặc Form submit */}
                <div className="flex items-center">
                  <span className="mr-2 text-black/60">Sort by:</span>
                  <SortSelect /> 
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {currentProducts.length > 0 ? (
              <div className="w-full grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-5">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} data={product} />
                ))}
              </div>
            ) : (
              <div className="w-full text-center py-20 text-gray-500">
                No products found.
              </div>
            )}

            <hr className="border-t-black/10" />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination className="justify-between">
                <PaginationPrevious 
                  href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"} 
                  className={currentPage <= 1 ? "pointer-events-none opacity-50 border border-black/10" : "border border-black/10"}
                />
                
                <PaginationContent>
                  {/* Logic hiển thị số trang đơn giản */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Chỉ hiện trang đầu, trang cuối, và trang hiện tại +/- 1
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href={createPageUrl(page)}
                            isActive={page === currentPage}
                            className={page === currentPage ? "text-black bg-gray-100" : "text-black/50"}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return <PaginationEllipsis key={page} />;
                    }
                    return null;
                  })}
                </PaginationContent>

                <PaginationNext 
                  href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50 border border-black/10" : "border border-black/10"}
                />
              </Pagination>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}