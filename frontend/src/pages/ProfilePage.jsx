import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    User, Package, Star, ShoppingCart, Calendar, Phone, Mail,
    MapPin, Clock, Ban, Eye, Edit2, Trash2, ChevronRight
} from "lucide-react";
import axiosClient from "@/api/axiosClient";
import { orderService } from "@/services/orderService";
import { reviewService } from "@/services/reviewService";
import { productService } from "@/services/productService";
import { toast } from "sonner";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Order status translation and colors
const ORDER_STATUS = {
    PENDING: { label: "Chờ xác nhận", color: "bg-yellow-100 text-yellow-800" },
    CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-800" },
    PREPARING: { label: "Đang chuẩn bị", color: "bg-indigo-100 text-indigo-800" },
    SHIPPING: { label: "Đang giao hàng", color: "bg-purple-100 text-purple-800" },
    DELIVERED: { label: "Đã giao hàng", color: "bg-green-100 text-green-800" },
    CANCELLED: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
    RETURNED: { label: "Đã trả hàng", color: "bg-gray-100 text-gray-800" },
    FAILED: { label: "Thất bại", color: "bg-red-100 text-red-800" },
    REFUNDED: { label: "Đã hoàn tiền", color: "bg-orange-100 text-orange-800" },
};

const PAYMENT_STATUS = {
    PENDING: { label: "Chưa thanh toán", color: "bg-yellow-100 text-yellow-800" },
    PAID: { label: "Đã thanh toán", color: "bg-green-100 text-green-800" },
    REFUNDED: { label: "Đã hoàn tiền", color: "bg-orange-100 text-orange-800" },
    FAILED: { label: "Thất bại", color: "bg-red-100 text-red-800" },
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("account");

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (user?._id) {
            fetchOrders();
            fetchReviews();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            const res = await axiosClient.get("/users/get_current_user");
            if (res && res._id) {
                setUser(res);
            } else {
                toast.error("Vui lòng đăng nhập để xem hồ sơ");
                navigate("/login");
            }
        } catch (error) {
            toast.error("Vui lòng đăng nhập để xem hồ sơ");
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const data = await orderService.getHistory();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const data = await reviewService.getUserReviews(user._id);
            // Fetch product details for each review
            const reviewsWithProducts = await Promise.all(
                (Array.isArray(data) ? data : []).map(async (review) => {
                    try {
                        const product = await productService.getDetail(review.PRODUCT);
                        return { ...review, productInfo: product };
                    } catch {
                        return { ...review, productInfo: null };
                    }
                })
            );
            setReviews(reviewsWithProducts);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
        try {
            await orderService.cancelOrder(orderId);
            toast.success("Đã hủy đơn hàng thành công");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể hủy đơn hàng");
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
        try {
            await reviewService.deleteReview(reviewId);
            toast.success("Đã xóa đánh giá");
            fetchReviews();
        } catch (error) {
            toast.error("Không thể xóa đánh giá");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-[#f9fafb]">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                    <Skeleton height={200} />
                    <Skeleton count={3} className="mt-4" />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#f9fafb]">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 mb-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-10 h-10 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {user?.HOTEN || "Người dùng"}
                                </h1>
                                <p className="text-gray-600">{user?.EMAIL}</p>
                                <Badge variant="secondary" className="mt-2">
                                    {user?.ROLE === "admin" ? "Quản trị viên" : "Khách hàng"}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="account" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Tài khoản
                            </TabsTrigger>
                            <TabsTrigger value="orders" className="flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Đơn hàng ({orders.length})
                            </TabsTrigger>
                            <TabsTrigger value="reviews" className="flex items-center gap-2">
                                <Star className="w-4 h-4" />
                                Đánh giá ({reviews.length})
                            </TabsTrigger>
                        </TabsList>

                        {/* Account Tab */}
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin tài khoản</CardTitle>
                                    <CardDescription>
                                        Thông tin cá nhân của bạn
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <User className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-gray-500">Họ và tên</p>
                                                <p className="font-medium">{user?.HOTEN}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{user?.EMAIL}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Phone className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                                <p className="font-medium">{user?.SDT || "Chưa cập nhật"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày sinh</p>
                                                <p className="font-medium">
                                                    {user?.NGAYSN ? formatDate(user.NGAYSN) : "Chưa cập nhật"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <User className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-gray-500">Giới tính</p>
                                                <p className="font-medium">{user?.PHAI || "Chưa cập nhật"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                            <Clock className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-gray-500">Ngày đăng ký</p>
                                                <p className="font-medium">
                                                    {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Button
                                            variant="outline"
                                            onClick={() => navigate("/cart")}
                                            className="flex items-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Xem giỏ hàng
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Orders Tab */}
                        <TabsContent value="orders">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lịch sử đơn hàng</CardTitle>
                                    <CardDescription>
                                        Tất cả đơn hàng của bạn
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {ordersLoading ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <Skeleton key={i} height={120} />
                                            ))}
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div
                                                    key={order._id}
                                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                                                        <div>
                                                            <p className="text-sm text-gray-500">
                                                                Mã đơn hàng: <span className="font-mono">{order._id}</span>
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(order.createdAt)}
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge className={ORDER_STATUS[order.STATUS]?.color || "bg-gray-100"}>
                                                                {ORDER_STATUS[order.STATUS]?.label || order.STATUS}
                                                            </Badge>
                                                            <Badge className={PAYMENT_STATUS[order.PAYMENT_STATUS]?.color || "bg-gray-100"}>
                                                                {PAYMENT_STATUS[order.PAYMENT_STATUS]?.label || order.PAYMENT_STATUS}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2 mb-3">
                                                        {order.ITEM?.slice(0, 2).map((item, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 text-sm">
                                                                <span className="text-gray-600">
                                                                    {item.PRODUCT?.TENSACH || "Sản phẩm"} x {item.QUANTITY}
                                                                </span>
                                                                <span className="text-gray-400">-</span>
                                                                <span>{formatCurrency(item.TOTAL || item.PRICE_AT_PURCHASE * item.QUANTITY)}</span>
                                                            </div>
                                                        ))}
                                                        {order.ITEM?.length > 2 && (
                                                            <p className="text-sm text-gray-500">
                                                                +{order.ITEM.length - 2} sản phẩm khác
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap justify-between items-center pt-3 border-t">
                                                        <div>
                                                            <span className="text-sm text-gray-500">Tổng cộng: </span>
                                                            <span className="font-bold text-primary text-lg">
                                                                {formatCurrency(order.GRAND_TOTAL)}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            {order.STATUS === "PENDING" && (
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => handleCancelOrder(order._id)}
                                                                >
                                                                    <Ban className="w-4 h-4 mr-1" />
                                                                    Hủy đơn
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                                            <Button
                                                variant="outline"
                                                className="mt-4"
                                                onClick={() => navigate("/search")}
                                            >
                                                Mua sắm ngay
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Reviews Tab */}
                        <TabsContent value="reviews">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Đánh giá của bạn</CardTitle>
                                    <CardDescription>
                                        Các đánh giá sản phẩm bạn đã viết
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {reviewsLoading ? (
                                        <div className="space-y-4">
                                            {[...Array(3)].map((_, i) => (
                                                <Skeleton key={i} height={100} />
                                            ))}
                                        </div>
                                    ) : reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {reviews.map((review) => (
                                                <div
                                                    key={review._id}
                                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div
                                                            className="flex items-center gap-3 cursor-pointer hover:text-primary"
                                                            onClick={() => review.productInfo && navigate(`/book/${review.PRODUCT}`)}
                                                        >
                                                            {review.productInfo?.IMG_CARD && (
                                                                <img
                                                                    src={review.productInfo.IMG_CARD}
                                                                    alt={review.productInfo.TENSACH}
                                                                    className="w-12 h-16 object-cover rounded"
                                                                />
                                                            )}
                                                            <div>
                                                                <p className="font-medium">
                                                                    {review.productInfo?.TENSACH || "Sản phẩm"}
                                                                </p>
                                                                <div className="flex items-center gap-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <Star
                                                                            key={i}
                                                                            className={`w-4 h-4 ${i < review.RATING
                                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                                    : "text-gray-300"
                                                                                }`}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteReview(review._id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mt-2">
                                                        {review.COMMENT || "Không có nội dung đánh giá"}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-2">
                                                        {formatDate(review.createdAt)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Star className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500">Bạn chưa có đánh giá nào</p>
                                            <Button
                                                variant="outline"
                                                className="mt-4"
                                                onClick={() => navigate("/search")}
                                            >
                                                Khám phá sách
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfilePage;
