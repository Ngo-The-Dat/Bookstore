import React from "react";
import { Link } from "react-router";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
    const { cart, isLoading, updateQuantity, removeFromCart, cartTotal } = useCart();

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

    const cartItems = cart?.CART_DETAIL || [];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Tiếp tục mua sắm
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Giỏ hàng của bạn</h1>
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
                                    {/* Product Image - Placeholder if not available */}
                                    <div className="w-24 h-32 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden">
                                        {/* In a real app, we would fetch the image URL properly. 
                         Assuming item.PRODUCT has IMG_DETAIL or similar, but for list view we might need to fetch or it's populated.
                         The cart controller populates CART_DETAIL.PRODUCT.
                         Let's assume we can get a thumbnail or just show a placeholder.
                     */}
                                        <img
                                            src="https://via.placeholder.com/150"
                                            alt={item.PRODUCT?.TENSACH}
                                            className="w-full h-full object-cover"
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
                                                <span className="px-4 font-medium text-gray-700">{item.QUANTITY}</span>
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
