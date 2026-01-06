import * as review_service from "../services/review.service.js";

export const get_all_review = async (req, res) => {
    try {
        const reviews = await review_service.get_all_review();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_all_review", error: error.message });
    }
};

export const add_review = async (req, res) => {
    try {
        const newReview = await review_service.add_review(req.body);
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: "Xảy ra lỗi viết đánh giá", error: error.message });
    }
};

export const update_a_review = async (req, res) => {
    try {
        const id = req.params.id;
        const updated = await review_service.update_review(id, req.body);
        res.status(201).json(updated);
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở update_review", error: error.message });
    }
};

export const delete_a_review = async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await review_service.delete_review(id);
        res.status(201).json(deleted);
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở delete_review", error: error.message });
    }
};

export const get_a_book_review = async (req, res) => {
    try {
        const id = req.params.id;
        const reviews = await review_service.get_book_review(id);
        res.status(201).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_a_book_review", error: error.message });
    }
};

export const get_user_review = async (req, res) => {
    try {
        const id = req.params.id;
        const reviews = await review_service.get_user_review(id);
        res.status(201).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_user_review", error: error.message });
    }
};

export const get_a_book_average_rating = async (req, res) => {
    try {
        const id = req.params.id;
        const record = await review_service.get_book_average_rating(id);
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_a_book_review", error: error.message });
    }
};