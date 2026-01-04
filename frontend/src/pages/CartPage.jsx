import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { Minus, Plus, Trash2, ArrowLeft, XCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import axiosClient from "@/api/axiosClient";

const CartItemImage = ({ imageName, altText }) => {
    const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/150?text=Loading...");

    useEffect(() => {
        if (!imageName) {
            setImageUrl("https://via.placeholder.com/150?text=No+Image");
            return;
        }

        const fetchImage = async () => {
            try {
                const data = await axiosClient.get("/images/urls", {
                    params: { names: imageName }
                });

                let url = null;
                if (typeof data === "string") url = data;
                else if (Array.isArray(data)) url = data[0];
                else if (typeof data === "object" && data !== null) {
                    url =
                        data[imageName] ||
                        data.url ||
                        (Array.isArray(data.urls) && data.urls[0]) ||
                        Object.values(data).find(v => typeof v === "string" && v.startsWith("http")) ||
                        null;
                }

                if (url) setImageUrl(url);
                else setImageUrl("https://via.placeholder.com/150?text=Error");
            } catch (error) {
                console.error("Lỗi ảnh:", error);
                setImageUrl("https://via.placeholder.com/150?text=Error");
            }
        };

        fetchImage();
    }, [imageName]);

    return (
        <img
            src={imageUrl}
            alt={altText}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Error"; }}
        />
    );
};

const CartPage = () => {
    const { cartItems, isLoading, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Tiếp tục mua sắm
                    </Link>
                    <div className="flex items-center justify-between mt-4">
                        <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
                        {cartItems.length > 0 && (
                            <Button
                                onClick={clearCart}
                                variant="destructive"
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
                            >
                                <XCircle className="w-4 h-4" />
                                Xóa tất cả
                            </Button>
                        )}
                    </div>
                </div>

                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Giỏ hàng trống</h2>
                        <p className="text-gray-500 mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                        <Link to="/">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Khám phá sách ngay
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item._id} className="bg-white rounded-lg shadow-sm p-4 flex gap-4 transition-all hover:shadow-md">
                                    {/* Product Image Wrapper */}
                                    <div className="w-24 h-32 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden border">
                                        {/* Sử dụng Component CartItemImage thay vì thẻ img thường */}
                                        <CartItemImage
                                            imageName={item.PRODUCT?.IMG_CARD}
                                            altText={item.PRODUCT?.TENSACH}
                                        />
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                                                {item.PRODUCT?.TENSACH}
                                            </h3>
                                            <p className="text-gray-500 text-sm mt-1">{item.PRODUCT?.TACGIA}</p>
                                            <p className="text-blue-600 font-bold mt-1">
                                                {item.PRODUCT?.GIABAN?.toLocaleString()} đ
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center border rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.PRODUCT._id, item.QUANTITY - 1)}
                                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                    disabled={item.QUANTITY <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 font-medium text-gray-700 min-w-[2rem] text-center">{item.QUANTITY}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.PRODUCT._id, item.QUANTITY + 1)}
                                                    className="p-2 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.PRODUCT._id)}
                                                className="text-red-500 hover:text-red-700 p-2 transition-colors"
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Tổng đơn hàng</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tạm tính</span>
                                        <span>{cartTotal.toLocaleString()} đ</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Giảm giá</span>
                                        <span>0 đ</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                                        <span>Tổng cộng</span>
                                        <span className="text-blue-600">{cartTotal.toLocaleString()} đ</span>
                                    </div>
                                </div>

                                <Link to="/checkout" className="block w-full">
                                    <Button className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
                                        Tiến hành thanh toán
                                    </Button>
                                </Link>

                                <div className="mt-4 text-xs text-center text-gray-500">
                                    Phí vận chuyển sẽ được tính tại trang thanh toán.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default CartPage;
