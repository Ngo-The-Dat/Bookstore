import Order from "../models/order.js"
import Cart from "../models/cart.js"
import Coupon from "../models/coupon.js"
import User from "../models/user.js"
import { isValidObjectId } from "mongoose"

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?._id
    const { shippingAddress, couponCode, paymentMethod } = req.body

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "userId không hợp lệ" })
    }

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" })

    const cart = await Cart.findOne({ USER: userId }).populate("CART_DETAIL.PRODUCT")
    if (!cart || cart.CART_DETAIL.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" })
    }

    // Tính tổng tiền hàng
    const subTotal = cart.CART_DETAIL.reduce(
      (sum, item) => sum + item.PRODUCT.GIABAN * item.QUANTITY,
      0
    )

    // Áp dụng mã giảm giá (nếu có)
    let discountAmount = 0
    let coupon = null

    if (couponCode) {
      coupon = await Coupon.findOne({ CODE: couponCode })
      if (!coupon) return res.status(400).json({ message: "Mã giảm giá không hợp lệ" })
      if (coupon.EXPIRY_DATE < new Date()) return res.status(400).json({ message: "Mã đã hết hạn" })
      if (coupon.USAGE_COUNT >= coupon.USAGE_LIMIT)
        return res.status(400).json({ message: "Mã giảm giá đã được sử dụng tối đa" })

      discountAmount =
        coupon.DISCOUNT_TYPE === "PERCENTAGE"
          ? Math.round((subTotal * coupon.DISCOUNT_VALUE) / 100)
          : coupon.DISCOUNT_VALUE

      // Cập nhật số lần sử dụng mã
      coupon.USAGE_COUNT += 1
      await coupon.save()
    }

    // Phí giao hàng (giả sử tạm 30k)
    const shippingFee = 30000
    const grandTotal = Math.max(0, subTotal - discountAmount + shippingFee)

    // Tạo mảng ITEM từ giỏ hàng
    const items = cart.CART_DETAIL.map(item => ({
      PRODUCT: item.PRODUCT._id,
      NAME: item.PRODUCT.TENSACH,
      PRICE_AT_PURCHASE: item.PRODUCT.GIABAN,
      QUANTITY: item.QUANTITY,
      TOTAL: item.PRODUCT.GIABAN * item.QUANTITY
    }))

    // Tạo đơn hàng mới
    const newOrder = new Order({
      USER: userId,
      COUPON: coupon ? coupon._id : null,
      SHIPPING_ADDRESS: shippingAddress,
      SUB_TOTAL: subTotal,
      SHIPPING_FEE: shippingFee,
      DISCOUNT_AMOUNT: discountAmount,
      GRAND_TOTAL: grandTotal,
      PAYMENT_METHOD: paymentMethod || "CASH",
      PAYMENT_STATUS: paymentMethod === "CASH" || !paymentMethod ? "PAID" : "PENDING",
      ITEM: items,
    })

    await newOrder.save()

    // Chỉ clear giỏ hàng sau khi thanh toán thành công.
    if (newOrder.PAYMENT_STATUS === "PAID")
      await Cart.findOneAndDelete({ USER: userId })

    res.status(201).json({ message: "Tạo đơn hàng thành công", order: newOrder })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Lỗi server khi tạo đơn hàng" })
  }
}

// Lấy lịch sử đơn hàng của người dùng
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user?._id
    
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "userId không hợp lệ" })
    }

    const orders = await Order.find({ USER: userId })
      .sort({ createdAt: -1 })
      .populate("ITEM.PRODUCT")
      .populate("COUPON")

    res.status(200).json(orders)
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy lịch sử đơn hàng" })
  }
}

// Lấy chi tiết 1 đơn hàng
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params
    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: "orderId không hợp lệ" })
    }

    const order = await Order.findById(orderId)
      .populate("ITEM.PRODUCT")
      .populate("USER")
      .populate("COUPON")

    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" })
    res.status(200).json(order)
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết đơn hàng" })
  }
}

// Cập nhật trạng thái đơn hàng (admin hoặc thanh toán)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status, paymentStatus } = req.body

    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: "orderId không hợp lệ" })
    }

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" })

    // Kiểm soát cập nhật trạng thái thanh toán
    if (paymentStatus) {
      const allowedPayment = ["PENDING", "PAID", "FAILED", "REFUNDED"]
      if (!allowedPayment.includes(paymentStatus)) {
        return res.status(400).json({ message: "paymentStatus không hợp lệ" })
      }
      // Không cho chuyển sang REFUNDED nếu chưa PAID
      if (paymentStatus === "REFUNDED" && order.PAYMENT_STATUS !== "PAID") {
        return res.status(400).json({ message: "Chỉ hoàn tiền đơn đã thanh toán" })
      }
      order.PAYMENT_STATUS = paymentStatus
    }

    // Chỉ cho phép chuyển STATUS vượt PENDING nếu đã thanh toán
    if (status) {
      const allowedStatus = ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED", "REFUNDED"]
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status không hợp lệ" })
      }
      if (status !== "PENDING"
          && status !== "CANCELLED"
          && order.PAYMENT_STATUS !== "PAID") {
        return res.status(400).json({ message: "Không thể cập nhật trạng thái khi đơn chưa thanh toán" })
      }
      // Không cho hủy nếu đã vận chuyển / hoàn tất
      if (status === "CANCELLED" && !["PENDING", "CONFIRMED"].includes(order.STATUS)) {
        return res.status(400).json({ message: "Không thể hủy đơn hàng ở trạng thái hiện tại" })
      }
      order.STATUS = status
    }

    await order.save()
    return res.status(200).json({ message: "Cập nhật đơn hàng thành công", order })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "Lỗi khi cập nhật đơn hàng" })
  }
}

// Hủy đơn hàng (nếu còn PENDING)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    if (!isValidObjectId(orderId)) {
      return res.status(400).json({ message: "orderId không hợp lệ" })
    }

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" })

    if (order.STATUS !== "PENDING") {
      return res.status(400).json({ message: "Không thể hủy đơn hàng khi đã xử lý" })
    }

    order.STATUS = "CANCELLED"
    await order.save()
    res.status(200).json({ message: "Đã hủy đơn hàng", order })
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi hủy đơn hàng" })
  }
}
