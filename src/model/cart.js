import mongoose from "mongoose";

const { Schema, model } = mongoose

const cart_schema = new Schema({
    USER: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
})

const cart = model('cart', cart_schema)
export default cart