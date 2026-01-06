import User from '../models/user.js';
import UserAuth from '../models/user_authentication.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Hàm tạo token dùng chung
export const signToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const signupUser = async ({ FULL_NAME, GENDER, EMAIL, PASSWORD, PHONE, DATE_OF_BIRTH }) => {
    // 1. Khởi tạo session
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 2. Kiểm tra email tồn tại
        let user = await User.findOne({ EMAIL: EMAIL }).session(session);
        if (user) {
            // xác định phương thức đăng ký là local hay social
            const localAuth = await UserAuth.findOne({ USER: user._id, PROVIDER_NAME: 'LOCAL' }).session(session);
            if (localAuth) {
                throw new Error("EMAIL_ALREADY_IN_USE");
            } else {
                // Nếu đã có social, thêm thông tin cho user
                user.FULL_NAME = FULL_NAME;
                user.GENDER = GENDER;
                user.PHONE = PHONE;
                user.DATE_OF_BIRTH = DATE_OF_BIRTH;
                await user.save({ session });
            }
        } else {
            // 3. Tạo User MỚI
            user = new User({
                FULL_NAME, GENDER, EMAIL, PHONE, DATE_OF_BIRTH
            });
            await user.save({ session });
        }

        // 4. Tạo UserAuth
        const newAuth = new UserAuth({
            USER: user._id,
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