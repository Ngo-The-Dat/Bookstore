import React, { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { toast } from "sonner";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const statusOptions = [
        { value: "PENDING", label: "Chờ xử lý", color: "amber" },
        { value: "CONFIRMED", label: "Đã xác nhận", color: "blue" },
        { value: "PREPARING", label: "Đang chuẩn bị", color: "purple" },
        { value: "SHIPPING", label: "Đang giao", color: "cyan" },
        { value: "DELIVERED", label: "Đã giao", color: "emerald" },
        { value: "CANCELLED", label: "Đã hủy", color: "red" },
        { value: "RETURNED", label: "Đã trả", color: "slate" },
        { value: "FAILED", label: "Thất bại", color: "red" },
        { value: "REFUNDED", label: "Đã hoàn tiền", color: "orange" },
    ];

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await adminService.getAllOrders();
            setOrders(data);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await adminService.updateOrderStatus(orderId, { status: newStatus });
            toast.success("Đã cập nhật trạng thái đơn hàng");
            loadOrders();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Lỗi khi cập nhật trạng thái");
        }
    };

    const handlePaymentStatusChange = async (orderId, newStatus) => {
        try {
            await adminService.updateOrderStatus(orderId, { paymentStatus: newStatus });
            toast.success("Đã cập nhật trạng thái thanh toán");
            loadOrders();
        } catch (error) {
            toast.error(error?.response?.data?.message || "Lỗi khi cập nhật trạng thái thanh toán");
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const option = statusOptions.find(s => s.value === status);
        return option?.color || "slate";
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.USER?.HOTEN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.USER?.EMAIL?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || order.STATUS === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openDetail = (order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm theo mã đơn, tên khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                    <option value="all">Tất cả trạng thái</option>
                    {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>

                <span className="text-white/60 text-sm">{filteredOrders.length} đơn hàng</span>
            </div>

            {/* Orders Table */}
            <div className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Mã đơn</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Tổng tiền</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Thanh toán</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-white/60 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-white/60 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-white font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white text-sm">{order.USER?.HOTEN || "N/A"}</p>
                                            <p className="text-white/50 text-xs">{order.USER?.EMAIL}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-cyan-400 font-semibold">{formatPrice(order.GRAND_TOTAL)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.STATUS}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`px-2 py-1 text-xs rounded-lg border bg-${getStatusColor(order.STATUS)}-500/20 border-${getStatusColor(order.STATUS)}-500/30 text-${getStatusColor(order.STATUS)}-300 focus:outline-none cursor-pointer`}
                                            style={{
                                                backgroundColor: `rgba(var(--${getStatusColor(order.STATUS)}-500), 0.2)`,
                                            }}
                                        >
                                            {statusOptions.map((s) => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${order.PAYMENT_STATUS === 'PAID'
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                                : order.PAYMENT_STATUS === 'PENDING'
                                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                            }`}>
                                            {order.PAYMENT_STATUS === 'PAID' ? 'Đã thanh toán' :
                                                order.PAYMENT_STATUS === 'PENDING' ? 'Chờ thanh toán' :
                                                    order.PAYMENT_STATUS === 'REFUNDED' ? 'Đã hoàn tiền' : 'Thất bại'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-white/60 text-sm">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openDetail(order)}
                                            className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-white/40">
                    Không tìm thấy đơn hàng nào
                </div>
            )}

            {/* Order Detail Modal */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-white">
                                Chi tiết đơn hàng #{selectedOrder._id.slice(-8).toUpperCase()}
                            </h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/5"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Customer Info */}
                        <div className="bg-white/5 rounded-xl p-4 mb-4">
                            <h4 className="text-white/60 text-sm mb-2">Thông tin khách hàng</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-white/50">Họ tên:</span>
                                    <span className="text-white ml-2">{selectedOrder.USER?.HOTEN}</span>
                                </div>
                                <div>
                                    <span className="text-white/50">SĐT:</span>
                                    <span className="text-white ml-2">{selectedOrder.USER?.SDT}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-white/50">Email:</span>
                                    <span className="text-white ml-2">{selectedOrder.USER?.EMAIL}</span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-white/50">Địa chỉ:</span>
                                    <span className="text-white ml-2">{selectedOrder.SHIPPING_ADDRESS}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white/5 rounded-xl p-4 mb-4">
                            <h4 className="text-white/60 text-sm mb-3">Sản phẩm đặt hàng</h4>
                            <div className="space-y-3">
                                {selectedOrder.ITEM?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                        <div className="w-12 h-16 bg-slate-700 rounded overflow-hidden flex-shrink-0">
                                            {item.PRODUCT?.IMG_CARD && (
                                                <img src={item.PRODUCT.IMG_CARD} alt="" className="w-full h-full object-cover" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm truncate">{item.PRODUCT?.TENSACH || "Sản phẩm"}</p>
                                            <p className="text-white/50 text-xs">SL: {item.QUANTITY} x {formatPrice(item.PRICE_AT_PURCHASE)}</p>
                                        </div>
                                        <div className="text-cyan-400 font-semibold text-sm">
                                            {formatPrice(item.TOTAL)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white/5 rounded-xl p-4 mb-4">
                            <h4 className="text-white/60 text-sm mb-3">Tổng kết đơn hàng</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Tạm tính:</span>
                                    <span className="text-white">{formatPrice(selectedOrder.SUB_TOTAL)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/60">Phí vận chuyển:</span>
                                    <span className="text-white">{formatPrice(selectedOrder.SHIPPING_FEE)}</span>
                                </div>
                                {selectedOrder.DISCOUNT_AMOUNT > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Giảm giá:</span>
                                        <span className="text-emerald-400">-{formatPrice(selectedOrder.DISCOUNT_AMOUNT)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t border-white/10">
                                    <span className="text-white font-medium">Tổng cộng:</span>
                                    <span className="text-cyan-400 font-bold text-lg">{formatPrice(selectedOrder.GRAND_TOTAL)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status Actions */}
                        <div className="bg-white/5 rounded-xl p-4">
                            <h4 className="text-white/60 text-sm mb-3">Cập nhật trạng thái</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-white/50 mb-1">Trạng thái đơn hàng</label>
                                    <select
                                        value={selectedOrder.STATUS}
                                        onChange={(e) => {
                                            handleStatusChange(selectedOrder._id, e.target.value);
                                            setSelectedOrder({ ...selectedOrder, STATUS: e.target.value });
                                        }}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                        {statusOptions.map((s) => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-white/50 mb-1">Trạng thái thanh toán</label>
                                    <select
                                        value={selectedOrder.PAYMENT_STATUS}
                                        onChange={(e) => {
                                            handlePaymentStatusChange(selectedOrder._id, e.target.value);
                                            setSelectedOrder({ ...selectedOrder, PAYMENT_STATUS: e.target.value });
                                        }}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    >
                                        <option value="PENDING">Chờ thanh toán</option>
                                        <option value="PAID">Đã thanh toán</option>
                                        <option value="FAILED">Thất bại</option>
                                        <option value="REFUNDED">Đã hoàn tiền</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDetailModal(false)}
                            className="w-full mt-4 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagement;
