import mongoose from "mongoose";

const { Schema, model } = mongoose;

const addressSchema = new Schema({
    // ADDRESS_ID: {
    //     type: String,
    //     required: true
    // },
    USER_ID: {
        type: String,
        required: true
    },
    DIACHI: {
        type: String,
        required: true
    },
    IS_DEFAULT: {
        type: Boolean,
        required: true,
        default: true
    }
})

const address = model('address', addressSchema)
export default address