import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import axiosClient from "@/api/axiosClient";
import { useCart } from "@/context/CartContext";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { addToCart } = useCart();

  const [book, setBook] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [user, setUser] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await axiosClient.get("/products/detail", {
          params: { id }
        });

        setBook(data);

        if (Array.isArray(data.IMG_DETAIL)) {
          fetchImages(data.IMG_DETAIL);
        }
        fetchReviews();
      } catch (err) {
        console.error("Lỗi tải chi tiết sách:", err);
        setLoading(false);
      }
    };

    fetchBook();
    checkLogin();
  }, [id]);

  const checkLogin = async () => {
    try {
      const data = await axiosClient.get("/users/get_current_user");
      if (data && data._id) {
        setUser(data);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const fetchImages = async (imgNames) => {
    try {
      const urls = [];

      for (const name of imgNames) {
        const data = await axiosClient.get("/images/urls", {
          params: { names: name }
        });

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
    } catch (err) {
      console.error("Lỗi tải ảnh:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await axiosClient.get(`/reviews/product/${id}`);
      setReviews(data);
    } catch (err) {
      console.error("Lỗi tải đánh giá:", err);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowAuthPopup(true);
      return;
    }
    addToCart(book._id, 1);
  };

  const handleWriteReview = () => {
    if (!user) {
      setShowAuthPopup(true);
      return;
    }
    setShowReviewForm(!showReviewForm);
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    try {
      await axiosClient.post("/reviews", {
        PRODUCT: book._id,
        RATING: reviewRating,
        COMMENT: reviewComment,
        USER: user._id,
      });
      
      toast.success("Đã gửi đánh giá");
      setShowReviewForm(false);
      setReviewComment("");
      fetchReviews();
    } catch (error) {
      const msg = error.response?.data?.message || "Gửi đánh giá thất bại";
      toast.error(msg);
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

  return (
    <div className="flex flex-col min-h-screen relative bg-[#f9fafb] overflow-y-auto scrollbar-hide">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #d1d5db 1px, transparent 1px), linear-gradient(to bottom, #d1d5db 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
          maskImage: "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
        }}
      ></div>

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

            <div className="flex gap-4 mt-5 overflow-x-auto scrollbar-hide py-2">
              {images.map((img, index) => (
                <div
                  key={index}
                  className={`border rounded-md w-24 h-32 flex-shrink-0 overflow-hidden cursor-pointer flex items-center justify-center transition-all duration-200 ${mainImage === img ? "border-red-500 scale-105" : "border-gray-300"}`}
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
            
            <div className="flex gap-4 mt-5">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-md text-white font-semibold transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: "hsl(263 69% 50%)" }}
              >
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-md text-white font-semibold transition-colors duration-200 hover:opacity-90"
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

        {/* REVIEW SECTION */}
        <div className="w-full px-6 py-10 bg-white/60 backdrop-blur-md border-t mt-5">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Đánh giá sản phẩm
            </h2>

            {/* Thống kê đánh giá */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b pb-6">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <p className="text-5xl font-bold text-gray-800">
                  {reviews.length > 0
                    ? (reviews.reduce((acc, r) => acc + r.RATING, 0) / reviews.length).toFixed(1)
                    : '0'}
                  <span className="text-3xl text-gray-400">/5</span>
                </p>
                <div className="flex items-center my-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-6 h-6 ${i < Math.round(reviews.reduce((acc, r) => acc + r.RATING, 0) / (reviews.length || 1)) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.365 2.44a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.365-2.44a1 1 0 00-1.175 0l-3.365 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.07 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-500">({reviews.length} đánh giá)</p>
              </div>
              <div className="col-span-2 w-full">
                {/* Progress bars - Giữ nguyên code cũ */}
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter(r => r.RATING === star).length;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="text-gray-600">{star} sao</span>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-gray-600 w-10 text-right">{Math.round(percentage)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-end my-6">
              <button
                type="button"
                onClick={handleWriteReview}
                className="flex items-center justify-center gap-2 px-6 py-2 border border-red-500 text-red-500 font-semibold rounded-md hover:bg-red-50 transition-colors"
              >
                Viết đánh giá
              </button>
            </div>

            {showReviewForm && (
              <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h3>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">Đánh giá:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl focus:outline-none ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <Textarea
                  placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="mb-4"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowReviewForm(false)}>Hủy</Button>
                  <Button onClick={handleSubmitReview}>Gửi đánh giá</Button>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {!loading && reviews.length === 0 && (
                <p className="text-gray-500 text-center py-4">Chưa có đánh giá nào cho sản phẩm này.</p>
              )}
              {!loading && reviews.length > 0 && (
                reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">
                        {review.USER ? `${review.USER.substring(0, 2)}*****` : 'Ẩn danh'}
                      </p>
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

      {/* Auth Popup */}
      <Dialog open={showAuthPopup} onOpenChange={setShowAuthPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
            <DialogDescription>
              Bạn cần đăng nhập hoặc tạo tài khoản để thực hiện chức năng này.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowAuthPopup(false)}>
              Hủy
            </Button>
            <Link to="/register" onClick={() => setShowAuthPopup(false)}>
              <Button variant="secondary">Đăng ký</Button>
            </Link>
            <Link to="/login" onClick={() => setShowAuthPopup(false)}>
              <Button>Đăng nhập</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookDetail;