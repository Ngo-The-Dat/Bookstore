import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema({
    // PRODUCT_ID: {
    //     type: String,
    //     required: true
    // },
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
        required: [true, "Vui lòng nhập mô tả sách"],
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
        required: [true]
    },
    CATEGORY: {
        type: Schema.Types.ObjectId,
        ref: 'category'
    }
})

const product = model('product', productSchema)
export default product