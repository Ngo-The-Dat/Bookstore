import review from "../models/review.js";
import product from "../models/product.js";
import { Types } from "mongoose";

export const get_all_review = async () => {
    return review.find();
};

export const add_review = async (data) => {
    const newReview = new review(data);
    await newReview.save();
    return newReview;
};

export const update_review = async (id, data) => {
    return review.findByIdAndUpdate(id, data, { new: true });
};

export const delete_review = async (id) => {
    return review.findByIdAndDelete(id, { new: true });
};

export const get_book_review = async (bookId) => {
    return review.find({ PRODUCT: bookId });
};

export const get_user_review = async (userId) => {
    return review.find({ USER: userId });
};

export const get_book_average_rating = async (bookId) => {
    const id = new Types.ObjectId(bookId);
    const record = await review.aggregate([
        { $match: { PRODUCT: id } },
        {
            $group: {
                _id: "$PRODUCT",
                average_rating: { $avg: "$RATING" }
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product_info"
            }
        },
        { $unwind: "$product_info" },
        {
            $project: {
                PRODUCT_ID: "$product_info._id",
                PRODUCT_NAME: "$product_info.TENSACH",
                average: "$average_rating"
            }
        }
    ]);

    return record;
};
