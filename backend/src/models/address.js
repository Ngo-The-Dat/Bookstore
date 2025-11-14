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

const address = model('address', address_schema)
export default address