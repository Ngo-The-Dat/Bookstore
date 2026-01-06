import mongoose from "mongoose";
import removeVietnameseTones from "../utils/productUtils.js"

const { Schema, model } = mongoose;

const product_schema = new Schema({
    TENSACH: {
        type: String,
        required: true
    },
    TENKHONGDAU: {
        type: String
    },
    GIABIA: {
        type: Number,
        required: [true, "Vui lòng nhập giá tiền"],
        min: [0, "Giá tiền không được âm"]
    },
    GIABAN: {
        type: Number,
        required: [true, "Vui lòng nhập giá tiền"],
        min: [0, "Giá tiền không được âm"]
    },
    MOTA: {
        type: String,
        trim: true
    },
    IMG_DETAIL: {
        type: [String]
    },
    IMG_CARD: {
        type: String
    },
    TACGIA: {
        type: String,
        required: [true, "Vui lòng nhập tên tác giả"]
    },
    NXB: {
        type: String,
        required: [true, "Vui lòng nhập nhà xuất bản"]
    },
    SOTRANG: {
        type: Number,
        required: [true, "Vui lòng nhập số trang"]
    },
    TONKHO: {
        type: Number,
        required: [true]
    },
    CREATED_AT: {
        type: Date,
        default: () => Date.now()
    },
    VIEWCOUNT: {
        type: Number,
        default: 0
    },
    CATEGORY: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    }
})

product_schema.pre('save', function (next) {
    if (this.isModified('TENSACH')) {
        this.TENKHONGDAU = removeVietnameseTones(this.TENSACH)
    }
    next()
})

const product = model('product', product_schema)
export default product