import axiosClient from "@/api/axiosClient";

export const orderService = {
  createOrder: (orderData) => {
    return axiosClient.post("/orders", orderData);
  },
  getHistory: () => {
    return axiosClient.get("/orders/history");
  },
  getById: (orderId) => {
    return axiosClient.get(`/orders/${orderId}`);
  },
  cancelOrder: (orderId) => {
    return axiosClient.put(`/orders/${orderId}/cancel`);
  },
};
