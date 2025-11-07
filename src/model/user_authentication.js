import mongoose from "mongoose";

const { Schema, model } = mongoose;

const user_authentication_schema = new Schema({
    USER: {
        type: Schema.Types.ObjectId
    },
    PROVIDER_NAME: {
        type: String,
        required: true,
        enum: ['LOCAL', 'GOOGLE', 'FACEBOOK']
    },
    CREDENTIAL: {
        type: String
    }
})

const user_authentication = model('user_authentication', user_authentication_schema);
export default user_authentication