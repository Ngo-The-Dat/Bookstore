import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { orderService } from '@/services/orderService';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const data = await orderService.getById(id);
            setOrder(data);
        } catch (error) {
            toast.error("Không tìm thấy đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
        try {
            await orderService.cancelOrder(id);
            toast.success("Đã hủy đơn hàng thành công");
            fetchOrder();
        } catch (error) {
            toast.error("Không thể hủy đơn hàng");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <Package size={64} className="mb-4 text-gray-300" />
                    <p className="text-xl font-medium">Không tìm thấy đơn hàng</p>
                    <Link to="/" className="mt-4 text-blue-600 hover:underline">Về trang chủ</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const steps = [
        { status: 'PENDING', label: 'Chờ xác nhận', icon: Clock },
        { status: 'CONFIRMED', label: 'Đã xác nhận', icon: CheckCircle },
        { status: 'SHIPPING', label: 'Đang giao', icon: Truck },
        { status: 'DELIVERED', label: 'Đã giao', icon: Package },
    ];

    const currentStepIndex = steps.findIndex(step => step.status === order.STATUS) > -1
        ? steps.findIndex(step => step.status === order.STATUS)
        : (order.STATUS === 'COMPLETED' ? 4 : -1);

    const isCancelled = order.STATUS === 'CANCELLED' || order.STATUS === 'FAILED' || order.STATUS === 'REFUNDED';

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <Link to="/profile" className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng #{order._id.slice(-8).toUpperCase()}</h1>
                    <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium
                        ${order.STATUS === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            order.STATUS === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                                order.STATUS === 'SHIPPING' ? 'bg-purple-100 text-purple-800' :
                                    order.STATUS === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                        order.STATUS === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                        }`}>
                        {order.STATUS === 'PENDING' ? 'Chờ xác nhận' :
                            order.STATUS === 'CONFIRMED' ? 'Đã xác nhận' :
                                order.STATUS === 'SHIPPING' ? 'Đang giao' :
                                    order.STATUS === 'DELIVERED' ? 'Đã giao hàng' :
                                        order.STATUS === 'CANCELLED' ? 'Đã hủy' : order.STATUS}
                    </span>
                </div>

                {/* Tracking Progress */}
                {!isCancelled && (
                    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                        <div className="relative flex justify-between">
                            {/* Progress Bar Background */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0" />
                            {/* Active Progress Bar */}
                            <div
                                className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500"
                                style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                            />

                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                return (
                                    <div key={step.status} className="relative z-10 flex flex-col items-center bg-white px-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                                            ${isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'}
                                        `}>
                                            <Icon size={16} />
                                        </div>
                                        <span className={`mt-2 text-xs font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Order Items & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                            <div className="p-4 border-b bg-gray-50 font-medium text-gray-700">
                                Sản phẩm ({order.ITEM.length})
                            </div>
                            <div className="divide-y divide-gray-100">
                                {order.ITEM.map((item, index) => (
                                    <div key={index} className="p-4 flex gap-4">
                                        <div className="w-20 h-28 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border">
                                            {item.PRODUCT?.IMG_CARD ? (
                                                <img src={item.PRODUCT.IMG_CARD} alt={item.PRODUCT.TENSACH} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 mb-1">{item.PRODUCT?.TENSACH || "Sản phẩm không tồn tại"}</h3>
                                            <p className="text-sm text-gray-500 mb-2">Tác giả: {item.PRODUCT?.TACGIA || "N/A"}</p>
                                            <div className="flex justify-between items-center mt-4">
                                                <p className="text-sm">Số lượng: <span className="font-semibold">{item.QUANTITY}</span></p>
                                                <p className="text-blue-600 font-semibold">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.PRICE_AT_PURCHASE)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info & Summary */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-blue-600" />
                                Thông tin nhận hàng
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs">Người nhận</p>
                                    <p className="font-medium text-gray-900">{order.USER?.HOTEN}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Số điện thoại</p>
                                    <p className="font-medium text-gray-900">{order.USER?.SDT}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Địa chỉ</p>
                                    <p className="font-medium text-gray-900">{order.SHIPPING_ADDRESS}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-blue-600" />
                                Thanh toán
                            </h3>
                            <div className="space-y-2 text-sm mb-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.SUB_TOTAL)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí vận chuyển</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.SHIPPING_FEE)}</span>
                                </div>
                                {order.DISCOUNT_AMOUNT > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Giảm giá</span>
                                        <span>-{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.DISCOUNT_AMOUNT)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-3 border-t font-bold text-lg text-blue-600">
                                    <span>Tổng tiền</span>
                                    <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.GRAND_TOTAL)}</span>
                                </div>
                            </div>

                            <div className="pt-2 border-t">
                                <p className="text-xs text-gray-500 mb-1">Phương thức thanh toán</p>
                                <p className="font-medium text-gray-800">
                                    {order.PAYMENT_METHOD === 'CASH' ? 'Thanh toán khi nhận hàng (COD)' : order.PAYMENT_METHOD}
                                </p>
                            </div>

                            <div className="pt-2">
                                <p className="text-xs text-gray-500 mb-1">Trạng thái thanh toán</p>
                                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                                    ${order.PAYMENT_STATUS === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                                `}>
                                    {order.PAYMENT_STATUS === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </span>
                            </div>

                            {order.STATUS === 'PENDING' && (
                                <button
                                    onClick={handleCancelOrder}
                                    className="w-full mt-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                                >
                                    Hủy đơn hàng
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default OrderDetailPage;
