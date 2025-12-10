import axiosClient from "@/api/axiosClient";

export const reviewService = {
    getUserReviews: (userId) => {
        return axiosClient.get(`/reviews/user/${userId}`);
    },
    addReview: (reviewData) => {
        return axiosClient.post("/reviews", reviewData);
    },
    updateReview: (reviewId, reviewData) => {
        return axiosClient.put(`/reviews/${reviewId}`, reviewData);
    },
    deleteReview: (reviewId) => {
        return axiosClient.delete(`/reviews/${reviewId}`);
    },
    getProductReviews: (productId) => {
        return axiosClient.get(`/reviews/product/${productId}`);
    },
};
