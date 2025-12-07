import axiosClient from "@/api/axiosClient";

export const categoryService = {
  getAll: () => {
    return axiosClient.get("/categories");
  },
};