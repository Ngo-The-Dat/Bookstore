import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, CreditCard, Truck, MapPin, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import { toast } from "sonner";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        paymentMethod: "CASH",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const shippingFee = 30000;
    const finalTotal = cartTotal + shippingFee;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName || !formData.phone || !formData.address) {
            toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
            return;
        }

        setIsProcessing(true);

        try {
            const orderData = {
                shippingAddress: `${formData.address}, ${formData.city}`,
                paymentMethod: formData.paymentMethod,
                // Backend expects shippingAddress as string, paymentMethod.
                // It uses current user from session.
            };

            await axios.post(`${API_BASE}/orders`, orderData, { withCredentials: true });

            toast.success("Đặt hàng thành công!");

            // Clear cart locally if needed, but backend usually handles it.
            // However, our context state needs to be refreshed.
            await clearCart();

            // Redirect to success or home
            navigate("/");

        } catch (error) {
            console.error("Order error:", error);
            toast.error(error.response?.data?.message || "Đặt hàng thất bại");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!cart || cart.CART_DETAIL.length === 0) {
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
                <div className="mb-6">
                    <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại giỏ hàng
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Thanh toán</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Shipping & Payment */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Info */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                <MapPin className="text-blue-600 w-6 h-6" />
                                <h2 className="text-xl font-bold text-gray-900">Thông tin giao hàng</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Họ và tên</label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Nguyễn Văn A"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Số điện thoại</label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="0912345678"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="address" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Địa chỉ nhận hàng</label>
                                    <Input
                                        id="address"
                                        name="address"
                                        placeholder="Số nhà, tên đường, phường/xã"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label htmlFor="city" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tỉnh/Thành phố</label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="Hà Nội, TP.HCM..."
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center gap-3 mb-6 border-b pb-4">
                                <CreditCard className="text-blue-600 w-6 h-6" />
                                <h2 className="text-xl font-bold text-gray-900">Phương thức thanh toán</h2>
                            </div>

                            <div className="space-y-4">
                                <div
                                    className="flex items-center space-x-3 border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "CASH" }))}
                                >
                                    <input
                                        type="radio"
                                        id="cash"
                                        name="paymentMethod"
                                        value="CASH"
                                        checked={formData.paymentMethod === "CASH"}
                                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="cash" className="flex-1 cursor-pointer font-medium text-sm">
                                        Thanh toán khi nhận hàng (COD)
                                    </label>
                                    <Truck className="text-gray-400 w-5 h-5" />
                                </div>
                                <div
                                    className="flex items-center space-x-3 border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "BANKING" }))}
                                >
                                    <input
                                        type="radio"
                                        id="banking"
                                        name="paymentMethod"
                                        value="BANKING"
                                        checked={formData.paymentMethod === "BANKING"}
                                        onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="banking" className="flex-1 cursor-pointer font-medium text-sm">
                                        Chuyển khoản ngân hàng (Sandbox)
                                    </label>
                                    <CreditCard className="text-gray-400 w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của bạn</h2>

                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                                {cart.CART_DETAIL.map((item) => (
                                    <div key={item._id} className="flex justify-between text-sm">
                                        <div className="flex-1 pr-4">
                                            <p className="font-medium text-gray-800 line-clamp-1">{item.PRODUCT?.TENSACH}</p>
                                            <p className="text-gray-500">x {item.QUANTITY}</p>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {(item.PRODUCT?.GIABAN * item.QUANTITY).toLocaleString()} đ
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Tạm tính</span>
                                    <span>{cartTotal.toLocaleString()} đ</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Phí vận chuyển</span>
                                    <span>{shippingFee.toLocaleString()} đ</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t mt-2">
                                    <span>Tổng thanh toán</span>
                                    <span className="text-blue-600">{finalTotal.toLocaleString()} đ</span>
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
