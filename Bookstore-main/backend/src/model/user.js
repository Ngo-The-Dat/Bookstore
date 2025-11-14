// const mongoose = require("mongoose")
import mongoose from "mongoose"
const { Schema, model } = mongoose

const user_schema = new Schema({
    HOTEN: {
        type: String,
        required: true
    },
    PHAI: {
        type: String,
        required: true,
        enum: ['Nam', 'Nữ']
    },
    EMAIL: {
        type: String,
        required: [true, "Vui lòng nhập email"],
        unique: [true, "Email không được trùng"], // không được trùng trong database
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ!'],
        lowercase: true
    },
    PASSWORD: {
        type: String,
        required: [true, "Vui lòng nhập mật khẩu"],
        minlength: [8, 'Mật khẩu phải có ít nhất 8 ký tự!'],
        match: [
            /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
            'Mật khẩu phải có ít nhất 1 chữ hoa và 1 ký tự đặc biệt!'
        ]
    },
    SDT: {
        type: String,
        required: [true, "Vui lòng nhập số điện thoại"],
        match: [/^[0-9]{10}$/, 'Số điện thoại không hợp lệ']
    },
    NGAYSN: {
        type: Date, //yy/mm/dd
        required: true
    },
    ROLE: {
        type: String,
        // required: true,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    IS_ACTIVE: {
        type: Boolean,
        required: true,
        default: true
    }
},
    {
        timestamps: true
    }
)

const user = model('user', user_schema);
export default user


