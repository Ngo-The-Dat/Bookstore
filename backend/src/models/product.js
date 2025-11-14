import mongoose from "mongoose";
const { Schema, model } = mongoose;

const product_schema = new Schema({
    TENSACH: {
        type: String,
        required: true
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
        // required: [true, "Vui lòng nhập mô tả sách"],
        trim: true
    },
    IMG_URL: {
        type: String,
        required: [true, "Vui lòng nhập đường dẫn hình ảnh"]
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

const product = model('product', product_schema)
export default product