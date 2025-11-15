import review from "../models/review.js";
import product from "../models/product.js"
import mongoose from "mongoose";
import { Types } from "mongoose";

export const get_all_review = async (req, res) => {
    try {
        res.status(200).json(await review.find())
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_all_review", error: error.message })
    }
}

export const add_review = async (req, res) => {
    try {
        const record = req.body;
        const new_review = new review(record)
        await new_review.save()
        res.status(201).json(new_review)
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở add_review", error: error.message })
    }
}

export const update_a_review = async (req, res) => {
    try {
        const record = req.body;
        const id = req.params.id;
        const result = await review.findByIdAndUpdate(id, record, { new: true })
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở update_review", error: error.message })
    }
}

export const delete_a_review = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await review.findByIdAndDelete(id, { new: true })
        res.status(201).json(result)
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở update_review", error: error.message })
    }
}

export const get_a_book_review = async (req, res) => {
    try {
        const id = req.params.id;
        res.status(201).json(await review.find({ PRODUCT: id }))
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_a_book_review", error: error.message })
    }
}

export const get_user_review = async (req, res) => {
    try {
        const id = req.params.id;
        res.status(201).json(await review.find({ USER: id }))
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_user_review", error: error.message })
    }
}

export const get_a_book_average_rating = async (req, res) => {
    try {
        const id = new Types.ObjectId(req.params.id);
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
        res.status(201).json(record)
    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra ở get_a_book_review", error: error.message })
    }
}