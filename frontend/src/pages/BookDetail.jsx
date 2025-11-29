import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BookDetail = () => {
  const { id } = useParams();
  const API_BASE = import.meta.env.VITE_API_URL;

  const [book, setBook] = useState(null);
  const [images, setImages] = useState([]);          // list URL từ backend
  const [reviews, setReviews] = useState([]);      // đánh giá từ người dùng
  const [mainImage, setMainImage] = useState(null);  // ảnh lớn
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // 1) Lấy dữ liệu sách
  // ----------------------------
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${API_BASE}/products/detail`, {
          params: { id }
        });

        setBook(res.data);

        if (Array.isArray(res.data.IMG_DETAIL)) {
          fetchImages(res.data.IMG_DETAIL);
        }
        fetchReviews();
      } catch (err) {
        console.error("Lỗi tải chi tiết sách:", err);
      }
    };

    fetchBook();
  }, [id]);

  // ----------------------------
  // 2) Lấy URL từ từng tên ảnh
  // ----------------------------
  const fetchImages = async (imgNames) => {
    try {
      const urls = [];

      for (const name of imgNames) {
        const res = await axios.get(`${API_BASE}/images/urls`, {
          params: { names: name }
        });

        const data = res.data;
        let url = null;

        if (typeof data === "string") url = data;
        else if (Array.isArray(data)) url = data[0];
        else if (typeof data === "object" && data !== null) {
          url =
            data[name] ||
            data.url ||
            (Array.isArray(data.urls) && data.urls[0]) ||
            Object.values(data).find(
              (v) =>
                typeof v === "string" &&
                (v.startsWith("http://") || v.startsWith("https://"))
            ) ||
            null;
        }

        if (url) urls.push(url);
      }

      setImages(urls);
      setMainImage(urls[0] || null);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi tải ảnh:", err);
      setLoading(false);
    }
  };

  // ----------------------------
  // 3) Lấy dữ liệu đánh giá
  // ----------------------------
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API_BASE}/reviews/product/${id}`);

      setReviews(res.data);
      console.log("Đánh giá tải về:", reviews);
    } catch (err) {
      console.error("Lỗi tải đánh giá:", err);
    }
  };

  if (loading || !book) {
    return (
      <>
        <Header />
        <div className="container mx-auto p-6">
          <Skeleton className="w-full h-96" />
        </div>
        <Footer />
      </>
    );
  }
  // ----------------------------
  // 4) Giao diện trang chi tiết sách
  // ----------------------------
  return (
    <div className="flex flex-col min-h-screen relative bg-[#f9fafb] overflow-y-auto scrollbar-hide">

        {/* === BACKGROUND GRID của bạn === */}
        <div
        className="absolute inset-0 z-0"
        style={{
            backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
            WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
            maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
        }}
        ></div>

        {/* Nội dung phải nằm TRÊN background */}
        <div className="relative z-10">
        <Header />

        <div className="container mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* LEFT — Ảnh sách */}
            <div>
            <div className="w-full h-[500px] bg-white border flex items-center justify-center overflow-hidden rounded-lg">
                {mainImage ? (
                <img
                    src={mainImage}
                    alt="book"
                    className="h-full w-auto object-cover object-center"
                />
                ) : (
                <Skeleton className="w-full h-full" />
                )}
            </div>

            {/* Carousel */}
            <div className="flex gap-4 mt-5 overflow-x-auto scrollbar-hide py-2">
                {images.map((img, index) => (
                <div
                    key={index}
                    className={`border rounded-md w-24 h-32 flex-shrink-0 overflow-hidden cursor-pointer flex items-center justify-center transition-all duration-200 ${
                    mainImage === img ? "border-red-500 scale-105" : "border-gray-300"
                    }`}
                    onClick={() => setMainImage(img)}
                >
                    <img
                    src={img}
                    className="h-full w-auto object-cover object-center"
                    alt="thumbnail"
                    />
                </div>
                ))}
            </div>
            {/* Buttons Thêm vào giỏ hàng & Mua ngay */}
            <div className="flex gap-4 mt-5">
                <button
                    className="flex-1 py-3 rounded-md text-white font-semibold transition-colors duration-200"
                    style={{ backgroundColor: "hsl(263 69% 50%)" }}
                >
                    Thêm vào giỏ hàng
                </button>
                <button
                    className="flex-1 py-3 rounded-md text-white font-semibold transition-colors duration-200"
                    style={{ backgroundColor: "hsl(263 69% 50%)" }}
                >   
                    Mua ngay
                </button>
            </div>
            </div>

            {/* RIGHT — Thông tin sách */}
            <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">{book.TENSACH}</h1>

            <p className="text-gray-700 text-lg">
                Tác giả: <b>{book.TACGIA}</b>
            </p>

            <div className="text-xl">
                <span className="text-red-600 font-bold text-3xl">
                {book.GIABAN.toLocaleString()} đ
                </span>
                <span className="text-gray-400 line-through ml-3 text-lg">
                {book.GIABIA.toLocaleString()} đ
                </span>
            </div>

            <div className="border-t pt-4 text-gray-700">
                <h2 className="font-bold text-lg mb-2">Mô tả sản phẩm</h2>
                <p>{book.MOTA}</p>
            </div>

            <div className="border-t pt-4 text-gray-700">
                <h2 className="font-bold text-lg mb-2">Thông tin chi tiết</h2>
                <ul className="space-y-1">
                <li><b>Nhà xuất bản:</b> {book.NXB}</li>
                <li><b>Số trang:</b> {book.SOTRANG}</li>
                <li><b>Tồn kho:</b> {book.TONKHO}</li>
                </ul>
            </div>
            </div>
        </div>
            {/* === FULL-WIDTH REVIEW SECTION (kéo dài ra cả hai bên) === */}
            <div className="w-full px-6 py-10 bg-white/60 backdrop-blur-md border-t mt-5">
              <div className="max-w-[1200px] mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Đánh giá sản phẩm
                </h2>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b pb-6">
                  {/* CỘT TRÁI: ĐIỂM TRUNG BÌNH */}
                  <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <p className="text-5xl font-bold text-gray-800">
                      {/* Tính điểm trung bình */}
                      {reviews.length > 0
                        ? (reviews.reduce((acc, r) => acc + r.RATING, 0) / reviews.length).toFixed(1)
                        : '0'}
                      <span className="text-3xl text-gray-400">/5</span>
                    </p>
                    <div className="flex items-center my-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${i < Math.round(reviews.reduce((acc, r) => acc + r.RATING, 0) / reviews.length) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.365-2.44a1 1 0 00-1.175 0l-3.365 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-500">({reviews.length} đánh giá)</p>
                  </div>

                  {/* CỘT PHẢI: THANH TIẾN TRÌNH */}
                  <div className="col-span-2 w-full">
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(r => r.RATING === star).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2 text-sm">
                            <span className="text-gray-600">{star} sao</span>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-600 w-10 text-right">{Math.round(percentage)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* NÚT VIẾT ĐÁNH GIÁ */}
                <div className="flex justify-center md:justify-end my-6">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-6 py-2 border border-red-500 text-red-500 font-semibold rounded-md hover:bg-red-50 transition-colors"
                  >
                    Viết đánh giá
                  </button>
                </div>

                {/* DANH SÁCH CÁC REVIEW */}
                <div className="space-y-6">
                  {loading && (
                    <div className="space-y-6">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-4 border-b pb-4">
                          <div className="flex-1">
                            <Skeleton width="20%" height={20} />
                            <Skeleton width="10%" className="mt-2"/>
                            <Skeleton count={2} className="mt-2"/>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!loading && reviews.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Chưa có đánh giá nào cho sản phẩm này.</p>
                  )}

                  {!loading && reviews.length > 0 && (
                    reviews.map((review) => (
                      <div key={review._id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2">
                          {/* Tên người dùng được che */}
                          <p className="font-semibold text-gray-800">
                            {review.USER ? `${review.USER.substring(0, 2)}*****` : 'Ẩn danh'}
                          </p>
                          {/* Sao đánh giá */}
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-3 h-3 ${i < review.RATING ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.365-2.44a1 1 0 00-1.175 0l-3.365 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 my-2">
                          {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-gray-700 text-sm">
                          {review.COMMENT}
                        </p>
                      </div>
                    ))
                  )}
                </div>

                
                
              </div>
            </div>


        <Footer />
        </div>

    </div>
  );

};

export default BookDetail;
