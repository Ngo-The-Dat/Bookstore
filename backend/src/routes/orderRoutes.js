import express from "express"
import { createOrder, getOrderHistory, getOrderById, updateOrderStatus, cancelOrder } from "../controllers/orderController.js"
import { protect } from "../controllers/authMiddleware.js"

const router = express.Router()

router.post("/", protect, createOrder) // Tạo đơn hàng
router.get("/history", protect, getOrderHistory) // Lấy lịch sử đơn hàng của người dùng
router.get("/:orderId", protect, getOrderById) // Lấy chi tiết 1 đơn hàng
router.put("/:orderId/update", protect, updateOrderStatus) // Cập nhật trạng thái đơn hàng
router.put("/:orderId/cancel", protect, cancelOrder) // Hủy đơn hàng

export default router