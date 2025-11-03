import mongoose from "mongoose";

const { Schema, model } = mongoose

const categorySchema = new Schema({
    // CATEGORY_ID: {
    //     type: String,
    //     required: [true]
    // },
    TENDM: {
        type: String,
        required: [true]
    },
    PRODUCT: {
        type: Schema.Types.ObjectId,
        ref: 'product'
    }
})

const category = model('category', categorySchema)
export default category