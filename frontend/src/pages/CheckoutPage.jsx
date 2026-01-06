import React from "react";
import { Link } from "react-router";
import { ArrowLeft, CreditCard, Truck, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCheckout } from "@/hooks/useCheckout";

const CheckoutPage = () => {
    const {
        cart,
        cartTotal,
        shippingFee,
        finalTotal,
        formData,
        isProcessing,
        handleInputChange,
        setPaymentMethod,
        handleSubmit
    } = useCheckout();

    if (!cart || !cart.CART_DETAIL || cart.CART_DETAIL.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
                    <Link to="/">
                        <Button>Quay lại mua sắm</Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex items-center gap-2 mb-8">
                    <Link to="/cart" className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Shipping Information */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-blue-600" />
                                Thông tin giao hàng
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                    <Input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập họ tên người nhận"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng</label>
                                    <Input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Số nhà, tên đường, phường/xã"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
                                    <Input
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tỉnh/thành phố"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                                Đơn hàng của bạn
                            </h2>

                            <div className="divide-y divide-gray-100">
                                {cart.CART_DETAIL.map((item) => (
                                    <div key={item.PRODUCT._id} className="py-4 flex gap-4">
                                        <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            {/* Placeholder for small book image */}
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{item.PRODUCT.TENSACH}</h3>
                                            <p className="text-sm text-gray-500">x {item.QUANTITY}</p>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.PRODUCT.GIABAN * item.QUANTITY)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingFee)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-blue-600 pt-2 border-t">
                                    <span>Tổng cộng</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalTotal)}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="font-medium text-gray-900 mb-3">Phương thức thanh toán</h3>
                                <div
                                    className="flex items-center space-x-3 border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setPaymentMethod("CASH")}
                                >
                                    <input
                                        type="radio"
                                        id="cash"
                                        name="paymentMethod"
                                        value="CASH"
                                        checked={formData.paymentMethod === "CASH"}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="cash" className="flex-1 cursor-pointer font-medium text-sm">
                                        Thanh toán khi nhận hàng (COD)
                                    </label>
                                    <Truck className="text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={isProcessing}
                                className="w-full mt-6 py-6 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                            >
                                {isProcessing ? "Đang xử lý..." : "Đặt hàng ngay"}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;
