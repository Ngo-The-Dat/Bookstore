import express from "express"
import {createOrder, getOrderHistory, getOrderById, updateOrderStatus, cancelOrder} from "../controllers/orderController.js"

const router = express.Router()

router.post("/:userId/create", createOrder) // Tạo đơn hàng
router.get("/:userId/history", getOrderHistory) // Lấy lịch sử đơn hàng của người dùng
router.get("/:orderId", getOrderById) // Lấy chi tiết 1 đơn hàng
router.put("/:orderId/update", updateOrderStatus) // Cập nhật trạng thái đơn hàng
router.put("/:orderId/cancel", cancelOrder) // Hủy đơn hàng

export default router
