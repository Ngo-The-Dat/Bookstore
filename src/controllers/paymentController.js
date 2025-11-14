import Order from "../model/order.js"
import Coupon from "../model/coupon.js"

// Thanh toán đơn hàng (giả lập hoặc cập nhật trạng thái sau khi thanh toán thành công)
export const processPayment = async (req, res) => {
  try {
    const { orderId } = req.params
    const { paymentMethod, isSuccess } = req.body
    // paymentMethod: "CASH", "BANK_TRANSFER", "E_WALLET", "PAYPAL", "VNPAY", ...
    // isSuccess: true / false

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" })

    // Nếu đơn hàng đã thanh toán
    if (order.PAYMENT_STATUS === "PAID") {
      return res.status(400).json({ message: "Đơn hàng đã được thanh toán trước đó" })
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

      return res.status(200).json({ message: "Thanh toán thành công", order })
    } else {
      order.PAYMENT_STATUS = "FAILED"
      await order.save()
      return res.status(400).json({ message: "Thanh toán thất bại", order })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Lỗi server khi xử lý thanh toán" })
  }
}

// Hoàn tiền đơn hàng (refund)
export const refundPayment = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" })

    if (order.PAYMENT_STATUS !== "PAID") {
      return res.status(400).json({ message: "Chỉ có thể hoàn tiền đơn hàng đã thanh toán" })
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

    res.status(200).json({ message: "Hoàn tiền thành công", order })
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi hoàn tiền" })
  }
}

// Xem trạng thái thanh toán của đơn hàng
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await Order.findById(orderId)

    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" })

    res.status(200).json({
      orderId: order._id,
      status: order.PAYMENT_STATUS,
      method: order.PAYMENT_METHOD,
      updatedAt: order.updatedAt
    })
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy trạng thái thanh toán" })
  }
}