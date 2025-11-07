import mongoose from "mongoose";
const { Schema, model } = mongoose

const review_schema = new Schema({
    USER: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    PRODUCT: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    RATING: {
        type: Number
    },
    COMMENT: {
        type: String
    }
})

const review = model('review', review_schema)
export default review