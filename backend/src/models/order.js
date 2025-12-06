import mongoose, { mongo } from "mongoose";
import product from "./product.js";
const { Schema, model } = mongoose

const order_schema = new Schema({
    USER: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    COUPON: {
        type: Schema.Types.ObjectId,
        ref: 'coupon'
    },
    SHIPPING_ADDRESS: {
        type: String,
        required: true
    },
    SUB_TOTAL: {
        type: Number,
        required: true
    },
    SHIPPING_FEE: {
        type: Number,
        required: true
    },
    DISCOUNT_AMOUNT: {
        type: Number,
        required: true
    },
    GRAND_TOTAL: {
        type: Number,
        required: true
    },
    STATUS: {
        type: String,
        enum: [
            "PENDING",
            "CONFIRMED",
            "PREPARING",
            "SHIPPING",
            "DELIVERED",
            "CANCELLED",
            "RETURNED",
            "FAILED",
            "REFUNDED"
        ],
        default: "PENDING"
    },
    PAYMENT_METHOD: {
        type: String,
        enum: [
            "CASH",
            "BANK_TRANSFER",
            "CREDIT_CARD",
            "DEBIT_CARD",
            "E_WALLET",
            "PAYPAL",
            "VNPAY",
            "STRIPE",
            "OTHER"
        ],
        default: "CASH"
    },
    PAYMENT_STATUS: {
        type: String,
        enum: [
            "PENDING",
            "PAID",
            "REFUNDED",
            "FAILED"
        ],
        default: "PENDING"
    },
    ITEM: [{
        PRODUCT: {
            type: Schema.Types.ObjectId,
            ref: 'product'
        },
        PRICE_AT_PURCHASE: {
            type: Number,
            required: true
        },
        QUANTITY: {
            type: Number,
            required: true
        },
        TOTAL: {
            type: Number,
        }
    }]
}, { timestamps: true }
)

const order = model('order', order_schema)
export default order

