import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

const user_authentication_schema = new Schema({
    USER: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    PROVIDER_NAME: {
        type: String,
        required: true,
        enum: ['LOCAL', 'GOOGLE', 'FACEBOOK'],
        default: 'LOCAL'
    },
    CREDENTIAL: {
        type: String,
        // Vẫn yêu cầu nếu là 'LOCAL'
        required: function () { return this.PROVIDER_NAME === 'LOCAL'; },
        select: false,

        // --- ĐÂY LÀ PHẦN BẠN CẦN THÊM VÀO ---
        validate: [
            {
                // Validator 1: Kiểm tra độ dài
                validator: function (value) {
                    // Nếu là Google/Facebook, bỏ qua
                    if (this.PROVIDER_NAME !== 'LOCAL') return true;
                    // Nếu là LOCAL, kiểm tra
                    return value && value.length >= 8;
                },
                message: 'Mật khẩu phải có ít nhất 8 ký tự!'
            },
            {
                // Validator 2: Kiểm tra Regex
                validator: function (value) {
                    // Nếu là Google/Facebook, bỏ qua
                    if (this.PROVIDER_NAME !== 'LOCAL') return true;
                    // Nếu là LOCAL, kiểm tra
                    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;
                    return regex.test(value);
                },
                message: 'Mật khẩu phải có ít nhất 1 chữ hoa và 1 ký tự đặc biệt!'
            }
        ]
        // --- KẾT THÚC PHẦN THÊM VÀO ---
    }
});

//Hash pass trước khu lưu
user_authentication_schema.pre("save", async function (next) {
    // Chỉ hash nếu PROVIDER là 'LOCAL'
    if (this.PROVIDER_NAME !== 'LOCAL') {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.CREDENTIAL = await bcrypt.hash(this.CREDENTIAL, salt);
        next();
    } catch (error) {
        next(error);
    }
});

user_authentication_schema.methods.comparePassword = async function (candidatePassword) {
    // Tìm 1 id trong DB ứng với id hiện tại và lấy CREDENTIAL
    const auth = await this.constructor.findOne({ _id: this._id }).select('+CREDENTIAL');
    if (!auth) return false;

    return await bcrypt.compare(candidatePassword, auth.CREDENTIAL);
};

const user_authentication = model('user_authentication', user_authentication_schema);
export default user_authentication