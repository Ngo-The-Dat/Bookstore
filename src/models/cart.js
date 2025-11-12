import mongoose from "mongoose";

const { Schema, model } = mongoose

const cart_schema = new Schema({
    USER: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    CART_DETAIL: [{
        PRODUCT: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        QUANTITY: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        },
        ADDED_AT: {
            type: Date,
            default: () => Date.now()
        }
    }]
}, { timestamps: true })

const cart = model('cart', cart_schema)
export default cart