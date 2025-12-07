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
                <Button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-full mt-6 py-6 text-lg bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
                    {isProcessing ? "Đang xử lý..." : "Đặt hàng ngay"}
                </Button>
            </main>
            <Footer />
        </div>
    );
};

export default CheckoutPage;