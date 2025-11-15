import express from "express"
import { getCartByUser, addToCart, updateCartItem, removeCartItem, clearCart } from "../controllers/cartController.js"
import { protect } from "../controllers/authMiddleware.js"

const router = express.Router()

router.get("/", protect, getCartByUser) // Lấy giỏ hàng của 1 người dùng
router.post("/add", protect, addToCart) // Thêm sản phẩm vào giỏ
router.put("/update/:productId", protect, updateCartItem) // Cập nhật số lượng sản phẩm trong giỏ
router.delete("/remove/:productId", protect, removeCartItem) // Xóa 1 sản phẩm khỏi giỏ
router.delete("/clear", protect, clearCart) // Xóa toàn bộ giỏ hàng của user

export default router