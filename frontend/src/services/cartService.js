import axiosClient from "@/api/axiosClient";

export const cartService = {
  getCart: () => {
    return axiosClient.get("/cart");
  },
  addToCart: (productId, quantity) => {
    return axiosClient.post("/cart/add", { productId, quantity });
  },
  updateQuantity: (productId, quantity) => {
    return axiosClient.post("/cart/update", { productId, quantity }); 
  },
  removeItem: (productId) => {
    return axiosClient.post("/cart/remove", { productId }); 
  },
  clearCart: () => {
    return axiosClient.delete("/cart"); 
  }
};