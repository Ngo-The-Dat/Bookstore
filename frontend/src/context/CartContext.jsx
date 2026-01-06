import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { cartService } from "@/services/cartService";
import { toast } from "sonner";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.log("Chưa có giỏ hàng hoặc chưa đăng nhập");
      setCart({ CART_DETAIL: [] });
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartItems = useMemo(() => cart?.CART_DETAIL || [], [cart]);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.QUANTITY, 0);
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.PRODUCT?.SALE_PRICE || 0) * item.QUANTITY, 0);
  }, [cartItems]);

  // Actions
  const addToCart = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      toast.success("Đã thêm vào giỏ hàng");
      await fetchCart();
    } catch (error) {
      toast.error("Lỗi khi thêm vào giỏ hàng");
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await cartService.updateQuantity(productId, newQuantity);
      await fetchCart();
    } catch (error) {
      toast.error("Không thể cập nhật số lượng");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartService.removeItem(productId);
      toast.success("Đã xóa sản phẩm");
      await fetchCart();
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      toast.success("Đã xóa toàn bộ giỏ hàng");
      setCart({ CART_DETAIL: [] });
    } catch (error) {
      toast.error("Lỗi khi xóa giỏ hàng");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );

};
