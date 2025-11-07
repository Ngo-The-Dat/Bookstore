import mongoose from "mongoose";

const { Schema, model } = mongoose

const order_details_schema = new Schema({
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
})

order_details_schema.pre('save', function (next) {
    this.TOTAL = this.QUANTITY * this.PRICE_AT_PURCHASE;
    next();
})

const order_details = model('order details', order_details_schema)
export default order_details