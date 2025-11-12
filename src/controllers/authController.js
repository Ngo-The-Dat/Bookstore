import User from '../model/user.js';
import UserAuth from '../model/user_authentication.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { HOTEN, PHAI, EMAIL, PASSWORD, SDT, NGAYSN } = req.body;

        // 1. Kiểm tra email đã tồn tại trong bảng User chưa
        const existingUser = await User.findOne({ EMAIL: EMAIL });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }

        // 2. Tạo User MỚI
        const newUser = new User({
            HOTEN, PHAI, EMAIL, SDT, NGAYSN
        });
        // LƯU user để lấy được _id
        await newUser.save();

        // 3. Tạo bảo mật cho user này
        const newAuth = new UserAuth({
            USER: newUser._id, // Tham chiếu tới User vừa tạo
            PROVIDER_NAME: 'LOCAL',
            CREDENTIAL: PASSWORD
        });
        await newAuth.save();

        res.status(201).json({ message: "Đăng ký thành công!" });

    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { EMAIL, PASSWORD } = req.body;

        // 1. Tìm user bằng email (trong bảng User)
        const user = await User.findOne({ EMAIL: EMAIL });
        if (!user) {
            return res.status(401).json({ message: "Tài khoản không tồn tại." });
        }

        // 2. Dùng user này để tìm trong bảng UserAuth
        const auth = await UserAuth.findOne({
            USER: user._id,
            PROVIDER_NAME: 'LOCAL'
        });

        if (!auth) {
            // Có user nhưng không có pass (vd: đăng ký bằng Google)
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
        }

        // 3. So sánh mật khẩu
        const isMatch = await auth.comparePassword(PASSWORD);
        if (!isMatch) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Lưu token vào cookie trên trình duyệt
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({ message: "Đăng nhập thành công" });

    } catch (error) {
        res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
};

export const logout = (req, res) => {
    // Xóa cookie chứa token
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: "Đăng xuất thành công." });
};