import Order from "../models/order.js"
import Coupon from "../models/coupon.js"
import { isValidObjectId } from "mongoose"

/**
 * Xử lý thanh toán đơn hàng
 */
export const processOrderPayment = async (orderId, { paymentMethod, isSuccess }) => {
  if (!isValidObjectId(orderId)) {
    throw new Error("orderId không hợp lệ")
  }

  const order = await Order.findById(orderId)
  if (!order) throw new Error("Không tìm thấy đơn hàng")

  // Nếu đơn hàng đã thanh toán
  if (order.PAYMENT_STATUS === "PAID") {
    throw new Error("Đơn hàng đã được thanh toán trước đó")
  }

  // Giả lập thanh toán
  if (isSuccess) {
    order.PAYMENT_STATUS = "PAID"
    order.PAYMENT_METHOD = paymentMethod || "CASH"
    order.STATUS = "CONFIRMED"

    await order.save()

    // Tăng lượt sử dụng coupon khi thanh toán thành công
    if (order.COUPON) {
      const coupon = await Coupon.findById(order.COUPON)
      if (coupon) {
        coupon.USAGE_COUNT = (coupon.USAGE_COUNT || 0) + 1
        await coupon.save()
      }
    }

    return { success: true, order }
  } else {
    order.PAYMENT_STATUS = "FAILED"
    await order.save()
    return { success: false, order }
  }
}

/**
 * Hoàn tiền đơn hàng (refund)
 */
export const refundOrderPayment = async (orderId) => {
  if (!isValidObjectId(orderId)) {
    throw new Error("orderId không hợp lệ")
  }

  const order = await Order.findById(orderId)
  if (!order) throw new Error("Không tìm thấy đơn hàng")

  if (order.PAYMENT_STATUS !== "PAID") {
    throw new Error("Chỉ có thể hoàn tiền đơn hàng đã thanh toán")
  }

  // Giả lập hoàn tiền
  order.PAYMENT_STATUS = "REFUNDED"
  order.STATUS = "REFUNDED"
  await order.save()

  // Nếu có dùng coupon thì giảm lượt sử dụng
  if (order.COUPON) {
    const coupon = await Coupon.findById(order.COUPON)
    if (coupon && coupon.USAGE_COUNT > 0) {
      coupon.USAGE_COUNT -= 1
      await coupon.save()
    }
  }

  return order
}

/**
 * Lấy trạng thái thanh toán của đơn hàng
 */
export const getOrderPaymentStatus = async (orderId) => {
  if (!isValidObjectId(orderId)) {
    throw new Error("orderId không hợp lệ")
  }

  const order = await Order.findById(orderId)
  if (!order) throw new Error("Không tìm thấy đơn hàng")

  return {
    orderId: order._id,
    status: order.PAYMENT_STATUS,
    method: order.PAYMENT_METHOD,
    updatedAt: order.updatedAt
  }
}
