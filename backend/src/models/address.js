import mongoose from "mongoose";
import user from "./user.js";

const { Schema, model } = mongoose;

const address_schema = new Schema({
    USER: {
        type: Schema.Types.ObjectId,
        ref: user
    },
    DIACHI: {
        type: String,
        required: true
    },
    IS_DEFAULT: {
        type: Boolean,
        default: false
    }
})

address_schema.index(
    { USER: 1, IS_DEFAULT: 1 },
    {
        unique: true,
        partialFilterExpression: { IS_DEFAULT: true }
    }
)

const address = model('address', address_schema)
export default address