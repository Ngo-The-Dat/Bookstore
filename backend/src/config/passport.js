import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';

import User from '../models/user.js';
import UserAuth from '../models/user_authentication.js';

// --- 1. LOCAL STRATEGY (Đăng nhập User/Pass) ---
passport.use(new LocalStrategy(
    {
        usernameField: 'EMAIL', // Khai báo trường đăng nhập là EMAIL
        passwordField: 'PASSWORD'
    },
    async (email, password, done) => {
        try {
            // Logic tìm User giống hệt bài cũ, nhưng gói gọn vào đây
            const user = await User.findOne({ EMAIL: email });
            if (!user) return done(null, false, { message: 'Email không tồn tại' });

            const auth = await UserAuth.findOne({ USER: user._id, PROVIDER_NAME: 'LOCAL' });

            const isMatch = await auth.comparePassword(password);
            if (!isMatch) return done(null, false, { message: 'Sai mật khẩu' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// --- HÀM CHUNG XỬ LÝ SOCIAL (GG/FB) ---
// Hàm này dùng để tái sử dụng logic "Link Account" cho cả GG và FB
const handleSocialLogin = async (providerName, profile, done) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // 1. Check xem UserAuth đã tồn tại chưa (Dựa vào Social ID)
        let auth = await UserAuth.findOne({
            PROVIDER_NAME: providerName,
            CREDENTIAL: profile.id
        }).session(session);

        let user;

        if (auth) {
            // Case A: Đã từng đăng nhập -> Lấy user ra
            user = await User.findById(auth.USER).session(session);
        } else {
            // Case B: Chưa từng đăng nhập bằng kênh này
            // Check xem email đã có chưa để link account
            const email = profile.emails?.[0]?.value;
            user = await User.findOne({ EMAIL: email }).session(session);

            if (!user) {
                // Case C: User mới tinh -> Tạo User
                user = new User({
                    HOTEN: profile.displayName,
                    EMAIL: email,
                });
                await user.save({ session });
            }

            // Tạo UserAuth mới
            const newAuth = new UserAuth({
                USER: user._id,
                PROVIDER_NAME: providerName,
                CREDENTIAL: profile.id
            });
            await newAuth.save({ session });
        }

        await session.commitTransaction();
        return done(null, user); // Trả user về cho Controller
    } catch (err) {
        await session.abortTransaction();
        return done(err);
    } finally {
        session.endSession();
    }
};

// --- 2. GOOGLE STRATEGY ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback" // URL Google sẽ gọi lại sau khi user bấm OK
},
    async (accessToken, refreshToken, profile, done) => {
        // Gọi hàm chung ở trên
        await handleSocialLogin('GOOGLE', profile, done);
    }
));

export default passport;