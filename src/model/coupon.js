import mongoose from "mongoose";

const { Schema, model } = mongoose

const coupon_schema = new Schema({
    CODE: {
        type: String,
        required: true
    },
    DISCOUNT_VALUE: {
        type: Number,
        required: true
    },
    EXPIRY_DATE: {
        type: Date,
        required: true
    },
    DISCOUNT_TYPE: {
        type: String,
        required: true,
        enum: ["PERCENTAGE", "FIXED_AMOUNT"]
    },
    USAGE_LIMIT: {
        type: Number,
        default: 0
    }
})

const coupon = model('coupon', coupon_schema)
export default coupon