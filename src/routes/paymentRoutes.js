import express from "express"
import {processPayment, refundPayment, getPaymentStatus} from "../controllers/paymentController.js"

const router = express.Router()

router.post("/:orderId/pay", processPayment) // Thanh toán đơn hàng
router.put("/:orderId/refund", refundPayment) // Hoàn tiền đơn hàng
router.get("/:orderId/status", getPaymentStatus) // Kiểm tra trạng thái thanh toán

export default router
