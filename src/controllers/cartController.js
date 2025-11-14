import Cart from "../models/cart.js"
import Product from "../models/product.js"
import { isValidObjectId } from "mongoose"

// Lấy giỏ hàng của 1 user
export const getCartByUser = async (req, res) => {
  try {
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "userId không hợp lệ" })
    }

    const cart = await Cart.findOne({ USER: userId }).populate("CART_DETAIL.PRODUCT")
    if (!cart) return res.status(404).json({ message: "Giỏ hàng trống hoặc không tồn tại" })

    res.status(200).json(cart)
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy giỏ hàng" })
  }
}

// Thêm sản phẩm vào giỏ
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id
    const { productId, quantity } = req.body

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "ID không hợp lệ" })
    }

    const qty = parseInt(quantity)
    if (!qty || qty <= 0) {
      return res.status(400).json({ message: "Số lượng phải lớn hơn 0" })
    }

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" })

    // Kiểm tra tồn kho
    if (product.TONKHO < qty) {
      return res.status(400).json({ message: "Không đủ hàng trong kho" })
    }

    let cart = await Cart.findOne({ USER: userId })

    if (!cart) {
      cart = new Cart({
        USER: userId,
        CART_DETAIL: [{ PRODUCT: productId, QUANTITY: qty }]
      })
    } else {
      const itemIndex = cart.CART_DETAIL.findIndex(item => item.PRODUCT.equals(productId))
      if (itemIndex > -1) {
        const newQty = cart.CART_DETAIL[itemIndex].QUANTITY + qty
        if (newQty > product.TONKHO) {
          return res.status(400).json({ message: "Số lượng vượt quá tồn kho" })
        }
        cart.CART_DETAIL[itemIndex].QUANTITY = newQty
      } else {
        cart.CART_DETAIL.push({ PRODUCT: productId, QUANTITY: qty })
      }
    }

    await cart.save()
    const populatedCart = await Cart.findById(cart._id).populate("CART_DETAIL.PRODUCT")

    res.status(201).json({ message: "Đã thêm vào giỏ hàng", cart: populatedCart })
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi thêm sản phẩm vào giỏ hàng" })
  }
}

// Cập nhật số lượng sản phẩm trong giỏ
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?._id
    const { productId } = req.params
    const { quantity } = req.body

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "ID không hợp lệ" })
    }

    const qty = parseInt(quantity)
    if (isNaN(qty)) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" })
    }

    const cart = await Cart.findOne({ USER: userId })
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" })

    const itemIndex = cart.CART_DETAIL.findIndex(i => i.PRODUCT.equals(productId))
    if (itemIndex === -1) return res.status(404).json({ message: "Sản phẩm không có trong giỏ hàng" })

    // Nếu quantity = 0 → xóa luôn item
    if (qty === 0) {
      cart.CART_DETAIL.splice(itemIndex, 1)
    } else {
      const product = await Product.findById(productId)
      if (product && qty > product.TONKHO) {
        return res.status(400).json({ message: "Số lượng vượt quá tồn kho" })
      }
      cart.CART_DETAIL[itemIndex].QUANTITY = qty
    }

    await cart.save()
    const populatedCart = await Cart.findById(cart._id).populate("CART_DETAIL.PRODUCT")

    res.status(200).json({ message: "Đã cập nhật giỏ hàng", cart: populatedCart })
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi cập nhật giỏ hàng" })
  }
}

// Xóa 1 sản phẩm khỏi giỏ
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user?._id
    const { productId } = req.params

    if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
      return res.status(400).json({ message: "ID không hợp lệ" })
    }

    const cart = await Cart.findOne({ USER: userId })
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" })

    cart.CART_DETAIL = cart.CART_DETAIL.filter(i => !i.PRODUCT.equals(productId))
    await cart.save()
    const populatedCart = await Cart.findById(cart._id).populate("CART_DETAIL.PRODUCT")

    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ hàng", cart: populatedCart })
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xóa sản phẩm khỏi giỏ hàng" })
  }
}

// Xóa toàn bộ giỏ
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "userId không hợp lệ" })
    }

    const cart = await Cart.findOneAndDelete({ USER: userId })
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng để xóa" })

    res.status(200).json({ message: "Đã xóa toàn bộ giỏ hàng" })
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xóa toàn bộ giỏ hàng" })
  }
}
