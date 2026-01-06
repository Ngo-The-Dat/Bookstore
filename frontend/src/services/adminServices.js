import axiosClient from "@/api/axiosClient";

export const adminService = {
    // User Management
    getAllUsers: () => {
        return axiosClient.get("/users/get_all_users");
    },
    deleteUser: (id) => {
        return axiosClient.delete(`/users/delete_user/${id}`);
    },
    updateUser: (id, data) => {
        return axiosClient.put(`/users/update_user/${id}`, data);
    },

    // Product Management
    getAllProducts: () => {
        return axiosClient.get("/products/get_all_products");
    },
    addProduct: (data) => {
        return axiosClient.post("/products/add_product", data);
    },
    updateProduct: (id, data) => {
        return axiosClient.put(`/products/update_product?id=${id}`, data);
    },
    deleteProduct: (id) => {
        return axiosClient.delete(`/products/delete_product?id=${id}`);
    },

    // Order Management
    getAllOrders: () => {
        return axiosClient.get("/orders/all");
    },
    updateOrderStatus: (orderId, statusData) => {
        return axiosClient.put(`/orders/${orderId}/update`, statusData);
    },

    // Category Management
    getAllCategories: () => {
        return axiosClient.get("/category");
    },

    // Dashboard Stats
    getDashboardStats: async () => {
        const [users, products, orders] = await Promise.all([
            axiosClient.get("/users/get_all_users"),
            axiosClient.get("/products/get_all_products"),
            axiosClient.get("/orders/all")
        ]);

        const totalRevenue = orders.reduce((sum, order) => {
            return order.PAYMENT_STATUS === 'PAID' ? sum + order.GRAND_TOTAL : sum;
        }, 0);

        return {
            totalUsers: users.length,
            totalProducts: products.length,
            totalOrders: orders.length,
            totalRevenue
        };
    }
};
