import axiosClient from "@/api/axiosClient";

export const categoryService = {
  getAll: () => {
    return axiosClient.get("/categories");
  },
  // Find category by name from the list
  getByName: async (categoryName) => {
    const categories = await axiosClient.get("/categories");
    const list = Array.isArray(categories) ? categories : (categories.categories || []);
    return list.find(cat => cat.NAME === categoryName) || null;
  },
};
