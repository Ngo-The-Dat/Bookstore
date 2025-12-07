import * as paymentService from "../services/payment.service.js"

// Thanh toán đơn hàng (giả lập hoặc cập nhật trạng thái sau khi thanh toán thành công)
export const processPayment = async (req, res) => {
  try {
    const { orderId } = req.params
    const { paymentMethod, isSuccess } = req.body

    const result = await paymentService.processOrderPayment(orderId, {
      paymentMethod,
      isSuccess
    })

    if (result.success) {
      return res.status(200).json({ message: "Thanh toán thành công", order: result.order })
    } else {
      return res.status(400).json({ message: "Thanh toán thất bại", order: result.order })
    }
  } catch (err) {
    console.error(err)
    const statusCode = err.message.includes("không hợp lệ") || 
                       err.message.includes("đã được thanh toán") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi server khi xử lý thanh toán" })
  }
}

// Hoàn tiền đơn hàng (refund)
export const refundPayment = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await paymentService.refundOrderPayment(orderId)
    res.status(200).json({ message: "Hoàn tiền thành công", order })
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") || 
                       err.message.includes("Chỉ có thể") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi server khi hoàn tiền" })
  }
}

// Xem trạng thái thanh toán của đơn hàng
export const getPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const paymentStatus = await paymentService.getOrderPaymentStatus(orderId)
    res.status(200).json(paymentStatus)
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi khi lấy trạng thái thanh toán" })
  }
}