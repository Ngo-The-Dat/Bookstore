import axiosClient from "@/api/axiosClient";

export const orderService = {
  createOrder: (orderData) => {
    return axiosClient.post("/orders", orderData);
  }
};