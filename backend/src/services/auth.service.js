import User from '../models/user.js';
import UserAuth from '../models/user_authentication.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const signupUser = async ({ HOTEN, PHAI, EMAIL, PASSWORD, SDT, NGAYSN }) => {
    // 1. Khởi tạo session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2. Kiểm tra email tồn tại
        const existingUser = await User.findOne({ EMAIL: EMAIL }).session(session);
        if (existingUser) {
            throw new Error("EMAIL_ALREADY_EXISTS");
        }

        // 3. Tạo User MỚI
        const newUser = new User({
            HOTEN, PHAI, EMAIL, SDT, NGAYSN
        });
        await newUser.save({ session });

        // 4. Tạo UserAuth
        const newAuth = new UserAuth({
            USER: newUser._id,
            PROVIDER_NAME: 'LOCAL',
            CREDENTIAL: PASSWORD 
        });
        await newAuth.save({ session });

        // 5. Commit transaction nếu mọi thứ ổn
        await session.commitTransaction();

    } catch (error) {
        // Rollback nếu có lỗi
        await session.abortTransaction();
        throw error; // Ném lỗi tiếp để Controller xử lý response
    } finally {
        // Luôn luôn kết thúc session
        session.endSession();
    }
};

export const loginUser = async ({ EMAIL, PASSWORD }) => {
    // 1. Tìm user bằng email
    const user = await User.findOne({ EMAIL });
    if (!user) {
        throw new Error("LOGIN_FAILED"); // Ném lỗi chung để bảo mật
    }

    // 2. Tìm trong bảng UserAuth
    const auth = await UserAuth.findOne({
        USER: user._id,
        PROVIDER_NAME: 'LOCAL'
    });

    if (!auth) {
        throw new Error("LOGIN_FAILED");
    }

    // 3. So sánh mật khẩu
    const isMatch = await auth.comparePassword(PASSWORD);
    if (!isMatch) {
        throw new Error("LOGIN_FAILED");
    }

    // 4. Tạo JWT (Business Logic)
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Trả về cả token và user
    return { token, user };
};