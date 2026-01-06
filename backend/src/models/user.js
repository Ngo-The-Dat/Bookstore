// const mongoose = require("mongoose")
import mongoose from "mongoose"

const { Schema, model } = mongoose

const user_schema = new Schema({
    FULL_NAME: {
        type: String,
        required: true
    },
    GENDER: {
        type: String,
        enum: ['Nam', 'Nữ']
    },
    EMAIL: {
        type: String,
        required: [true, "Vui lòng nhập email"],
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ!'],
        lowercase: true
    },
    PHONE: {
        type: String,
        match: [/^[0-9]{10}$/, 'Số điện thoại không hợp lệ']
    },
    DATE_OF_BIRTH: {
        type: Date,
    },
    ROLE: {
        type: String,
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
);

const user = model('user', user_schema);
export default user;