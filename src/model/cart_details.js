import mongoose from "mongoose";

const { Schema, model } = mongoose

const cart_details_schema = new Schema({
    CART: {
        type: Schema.Types.ObjectId,
        ref: 'cart'
    },
    PRODUCT: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    QUANTITY: {
        type: Number,
        default: 0
    }
})

const cart_details = model('cart details', cart_details_schema)
export default cart_details