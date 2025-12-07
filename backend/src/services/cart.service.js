import Cart from "../models/cart.js"
import Product from "../models/product.js"
import { isValidObjectId } from "mongoose"

/**
 * Lấy giỏ hàng của 1 user
 */
export const getUserCart = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error("userId không hợp lệ")
  }

  const cart = await Cart.findOne({ USER: userId }).populate("CART_DETAIL.PRODUCT")
  if (!cart) throw new Error("Giỏ hàng trống hoặc không tồn tại")

  return cart
}

/**
 * Thêm sản phẩm vào giỏ
 */
export const addProductToCart = async (userId, { productId, quantity }) => {
  if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
    throw new Error("ID không hợp lệ")
  }

  const qty = parseInt(quantity)
  if (!qty || qty <= 0) {
    throw new Error("Số lượng phải lớn hơn 0")
  }

  const product = await Product.findById(productId)
  if (!product) throw new Error("Không tìm thấy sản phẩm")

  // Kiểm tra tồn kho
  if (product.TONKHO < qty) {
    throw new Error("Không đủ hàng trong kho")
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
        throw new Error("Số lượng vượt quá tồn kho")
      }
      cart.CART_DETAIL[itemIndex].QUANTITY = newQty
    } else {
      cart.CART_DETAIL.push({ PRODUCT: productId, QUANTITY: qty })
    }
  }

  await cart.save()
  const populatedCart = await Cart.findById(cart._id).populate("CART_DETAIL.PRODUCT")
  return populatedCart
}

/**
 * Cập nhật số lượng sản phẩm trong giỏ
 */
export const updateCartItemQuantity = async (userId, productId, quantity) => {
  if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
    throw new Error("ID không hợp lệ")
  }

  const qty = parseInt(quantity)
  if (isNaN(qty)) {
    throw new Error("Số lượng không hợp lệ")
  }

  const cart = await Cart.findOne({ USER: userId })
  if (!cart) throw new Error("Không tìm thấy giỏ hàng")

  const itemIndex = cart.CART_DETAIL.findIndex(i => i.PRODUCT.equals(productId))
  if (itemIndex === -1) throw new Error("Sản phẩm không có trong giỏ hàng")

  // Nếu quantity = 0 → xóa luôn item
  if (qty === 0) {
    cart.CART_DETAIL.splice(itemIndex, 1)
  } else {
    const product = await Product.findById(productId)
    if (product && qty > product.TONKHO) {
      throw new Error("Số lượng vượt quá tồn kho")
    }
    cart.CART_DETAIL[itemIndex].QUANTITY = qty
  }

  await cart.save()
  const populatedCart = await Cart.findById(cart._id).populate("CART_DETAIL.PRODUCT")
  return populatedCart
}

/**
 * Xóa 1 sản phẩm khỏi giỏ
 */
export const removeProductFromCart = async (userId, productId) => {
  if (!isValidObjectId(userId) || !isValidObjectId(productId)) {
    throw new Error("ID không hợp lệ")
  }

  const cart = await Cart.findOne({ USER: userId })
  if (!cart) throw new Error("Không tìm thấy giỏ hàng")

  cart.CART_DETAIL = cart.CART_DETAIL.filter(i => !i.PRODUCT.equals(productId))
  await cart.save()
  const populatedCart = await Cart.findById(cart._id).populate("CART_DETAIL.PRODUCT")
  return populatedCart
}

/**
 * Xóa toàn bộ giỏ
 */
export const clearUserCart = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error("userId không hợp lệ")
  }

  const cart = await Cart.findOneAndDelete({ USER: userId })
  if (!cart) throw new Error("Không tìm thấy giỏ hàng để xóa")
  return cart
}
