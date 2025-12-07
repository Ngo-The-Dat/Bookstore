import axiosClient from "@/api/axiosClient";

export const productService = {
  getAll: () => {
    return axiosClient.get("/products/get_all_products");
  },
  getDetail: (id) => {
    return axiosClient.get("/products/detail", { params: { id } });
  },
  searchByName: (keyword) => {
    // API: /products/search_products?name=abc
    return axiosClient.get("/products/search_products", { 
      params: { name: keyword } 
    });
  },
  getAuthors: () => {
    return axiosClient.get("/products/TACGIA");
  },
  getPublishers: () => {
    return axiosClient.get("/products/NXB");
  },
  filter: (params) => {
    // params: { TACGIA, NXB, minPrice, maxPrice, sort, order }
    return axiosClient.get("/products/filter_product", { params });
  },
};