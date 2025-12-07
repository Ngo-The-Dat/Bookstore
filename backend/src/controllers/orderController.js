import * as orderService from "../services/order.service.js"

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?._id
    const { shippingAddress, couponCode, paymentMethod } = req.body

    const newOrder = await orderService.createNewOrder(userId, {
      shippingAddress,
      couponCode,
      paymentMethod
    })

    res.status(201).json({ message: "Tạo đơn hàng thành công", order: newOrder })
  } catch (err) {
    console.error(err)
    const statusCode = err.message.includes("không hợp lệ") || 
                       err.message.includes("trống") ||
                       err.message.includes("hết hạn") ||
                       err.message.includes("tối đa") ? 400 : 
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi server khi tạo đơn hàng" })
  }
}

// Lấy lịch sử đơn hàng của người dùng
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user?._id
    const orders = await orderService.getUserOrderHistory(userId)
    res.status(200).json(orders)
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") ? 400 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi khi lấy lịch sử đơn hàng" })
  }
}

// Lấy chi tiết 1 đơn hàng
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await orderService.getOrderDetails(orderId)
    res.status(200).json(order)
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi khi lấy chi tiết đơn hàng" })
  }
}

// Cập nhật trạng thái đơn hàng (admin hoặc thanh toán)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status, paymentStatus } = req.body

    const order = await orderService.updateOrderStatusService(orderId, {
      status,
      paymentStatus
    })

    return res.status(200).json({ message: "Cập nhật đơn hàng thành công", order })
  } catch (err) {
    console.error(err)
    const statusCode = err.message.includes("không hợp lệ") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    return res.status(statusCode).json({ message: err.message || "Lỗi khi cập nhật đơn hàng" })
  }
}

// Hủy đơn hàng (nếu còn PENDING)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    const order = await orderService.cancelOrderService(orderId)
    res.status(200).json({ message: "Đã hủy đơn hàng", order })
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi khi hủy đơn hàng" })
  }
}
