import React from "react";
import { notFound } from "next/navigation";
import { mapBookToProduct } from "@/lib/mapper";
import api from "@/lib/axios";
import { resolveRealImageUrls } from "@/lib/image-resolver";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import ProductListSec from "@/components/common/ProductListSec";

// 1. Get Book Detail
async function getBookDetail(id: string) {
  try {
    const res = await api.get("/products/detail", { params: { id } });
    return res.data;
  } catch (error) {
    console.error("Error fetching book detail:", error);
    return null;
  }
}

// 2. Get Reviews
async function getBookReviews(id: string) {
  try {
    const res = await api.get(`/reviews/product/${id}`);
    return res.data.map((r: any) => ({
      id: r._id,
      user: r.USER || "Anonymous User", // Dịch: Người dùng ẩn danh
      content: r.COMMENT,
      rating: r.RATING,
      // Đổi format ngày sang tiếng Anh (Month/Day/Year)
      date: new Date(r.createdAt).toLocaleDateString("en-US", {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }),
    }));
  } catch (error) {
    return [];
  }
}

// 3. Get Related Books
async function getRelatedBooks() {
  try {
    const res = await api.get("/products/get_all_products");
    const allBooks = res.data.map((book: any) => mapBookToProduct(book));
    return allBooks.slice(0, 4);
  } catch (error) {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const bookId = params.slug[0];

  const [rawBook, reviews, relatedProducts] = await Promise.all([
    getBookDetail(bookId),
    getBookReviews(bookId),
    getRelatedBooks(),
  ]);

  if (!rawBook) notFound();

  // --- DATA PROCESSING ---
  const productData = mapBookToProduct(rawBook);

  // Recalculate average rating
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((acc: number, r: any) => acc + r.rating, 0);
    productData.rating = parseFloat((totalRating / reviews.length).toFixed(1));
  } else {
    productData.rating = 0;
  }

  // Resolve Real Images
  const [realMainImg] = await resolveRealImageUrls([productData.srcUrl]);
  productData.srcUrl = realMainImg;

  if (productData.gallery && productData.gallery.length > 0) {
    const realGallery = await resolveRealImageUrls(productData.gallery);
    productData.gallery = realGallery;
  } else {
    productData.gallery = [realMainImg];
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        
        <BreadcrumbProduct title={productData.title} />
        
        <section className="mb-11">
          <Header data={productData} />
        </section>
        
        {/* Pass description and reviews to Tabs */}
        <Tabs description={productData.description} reviews={reviews} />
      </div>
      
      <div className="mb-[50px] sm:mb-20">
        {/* Dịch tiêu đề: Có thể bạn cũng thích -> You might also like */}
        <ProductListSec title="You might also like" data={relatedProducts} />
      </div>
    </main>
  );
}