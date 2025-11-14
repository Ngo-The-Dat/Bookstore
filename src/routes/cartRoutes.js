import express from "express"
import {getCartByUser, addToCart, updateCartItem, removeCartItem, clearCart} from "../controllers/cartController.js"

const router = express.Router()

router.get("/:userId", getCartByUser) // Lấy giỏ hàng của 1 người dùng
router.post("/:userId/add", addToCart) // Thêm sản phẩm vào giỏ
router.put("/:userId/update/:productId", updateCartItem) // Cập nhật số lượng sản phẩm trong giỏ
router.delete("/:userId/remove/:productId", removeCartItem) // Xóa 1 sản phẩm khỏi giỏ
router.delete("/:userId/clear", clearCart) // Xóa toàn bộ giỏ hàng của user

export default router