import * as cartService from "../services/cart.service.js"

// Lấy giỏ hàng của 1 user
export const getCartByUser = async (req, res) => {
  try {
    const userId = req.user?._id
    const cart = await cartService.getUserCart(userId)
    res.status(200).json(cart)
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") ? 400 :
                       err.message.includes("trống") || err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi server khi lấy giỏ hàng" })
  }
}

// Thêm sản phẩm vào giỏ
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id
    const { productId, quantity } = req.body

    const cart = await cartService.addProductToCart(userId, { productId, quantity })
    res.status(201).json({ message: "Đã thêm vào giỏ hàng", cart })
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") || 
                       err.message.includes("phải lớn hơn") ||
                       err.message.includes("kho") ||
                       err.message.includes("vượt quá") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi server khi thêm sản phẩm vào giỏ hàng" })
  }
}

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?._id
    const { productId } = req.params
    const { quantity } = req.body

    const cart = await cartService.updateCartItemQuantity(userId, productId, quantity)
    res.status(200).json({ message: "Đã cập nhật giỏ hàng", cart })
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") || 
                       err.message.includes("vượt quá") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi server khi cập nhật giỏ hàng" })
  }
}

// Xóa 1 sản phẩm khỏi giỏ
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user?._id
    const { productId } = req.params

    const cart = await cartService.removeProductFromCart(userId, productId)
    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng", cart })
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi server khi xóa sản phẩm khỏi giỏ hàng" })
  }
}

// Xóa toàn bộ giỏ
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id
    await cartService.clearUserCart(userId)
    res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng" })
  } catch (err) {
    const statusCode = err.message.includes("không hợp lệ") ? 400 :
                       err.message.includes("Không tìm thấy") ? 404 : 500
    res.status(statusCode).json({ message: err.message || "Lỗi server khi xóa toàn bộ giỏ hàng" })
  }
}
