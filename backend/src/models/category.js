import mongoose from "mongoose";

const { Schema, model } = mongoose

const category_schema = new Schema({
    NAME: {
        type: String,
        required: true
    },
    PRODUCTS: [
        {
            type: Schema.Types.ObjectId,
            ref: "product"
        }
    ]
});

const category = model('category', category_schema)
export default category