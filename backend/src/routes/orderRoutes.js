import express from "express"
import { createOrder, getOrderHistory, getOrderById, updateOrderStatus, cancelOrder, getAllOrders } from "../controllers/orderController.js"
import { protect, restrictTo } from "../middlewares/auth.js"

const router = express.Router()

router.get("/all", protect, restrictTo('admin'), getAllOrders) // Admin: Lấy tất cả đơn hàng
router.post("/", protect, createOrder) // Tạo đơn hàng
router.get("/history", protect, getOrderHistory) // Lấy lịch sử đơn hàng của người dùng
router.get("/:orderId", protect, getOrderById) // Lấy chi tiết 1 đơn hàng
router.put("/:orderId/update", protect, updateOrderStatus) // Cập nhật trạng thái đơn hàng
router.put("/:orderId/cancel", protect, cancelOrder) // Hủy đơn hàng

export default router
