import mongoose from "mongoose";
import removeVietnameseTones from "../utils/productUtils.js";

const { Schema, model } = mongoose;

const product_schema = new Schema({
    TITLE: {
        type: String,
        required: true
    },
    SLUG: {
        type: String
    },
    LIST_PRICE: {
        type: Number,
        required: [true, "Vui lòng nhập giá tiền"],
        min: [0, "Giá tiền không được âm"]
    },
    SALE_PRICE: {
        type: Number,
        required: [true, "Vui lòng nhập giá tiền"],
        min: [0, "Giá tiền không được âm"]
    },
    DESCRIPTION: {
        type: String,
        trim: true
    },
    IMAGE_DETAIL: {
        type: [String]
    },
    IMAGE_CARD: {
        type: String
    },
    AUTHOR: {
        type: String,
        required: [true, "Vui lòng nhập tên tác giả"]
    },
    PUBLISHER: {
        type: String,
        required: [true, "Vui lòng nhập nhà xuất bản"]
    },
    PAGE_COUNT: {
        type: Number,
        required: [true, "Vui lòng nhập số trang"]
    },
    STOCK: {
        type: Number,
        required: [true]
    },
    CREATED_AT: {
        type: Date,
        default: () => Date.now()
    },
    VIEW_COUNT: {
        type: Number,
        default: 0
    },
    CATEGORY: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    }
});

product_schema.pre('save', function (next) {
    if (this.isModified('TITLE')) {
        this.SLUG = removeVietnameseTones(this.TITLE);
    }
    next();
});

const product = model('product', product_schema);
export default product;