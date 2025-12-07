import { signupUser, loginUser } from '../services/auth.service.js';

export const signup = async (req, res) => {
    try {
        // 1. Lấy dữ liệu từ body
        const userData = req.body;

        // 2. Gọi Service để xử lý nghiệp vụ
        const newUser = await signupUser(userData);

        // 3. Trả về thành công
        return res.status(201).json({
            message: "Đăng ký thành công!",
            data: newUser
        });

    } catch (error) {
        // 4. Xử lý lỗi
        // Nếu là lỗi nghiệp vụ do mình ném ra (ví dụ: Email tồn tại)
        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }

        // Các lỗi hệ thống khác
        return res.status(500).json({ 
            message: "Đã có lỗi xảy ra", 
            error: error.message 
        });
    }
};

export const login = async (req, res) => {
    try {
        const { EMAIL, PASSWORD } = req.body;

        // Gọi Service
        const { token } = await loginUser({ EMAIL, PASSWORD });

        // Controller chịu trách nhiệm về giao thức HTTP (Cookie)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        });

        return res.status(200).json({ message: "Đăng nhập thành công" });

    } catch (error) {
        if (error.message === "LOGIN_FAILED") {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng." });
        }

        return res.status(500).json({ message: "Đã có lỗi xảy ra", error: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0) // Thu hồi cookie
    });
    
    res.status(200).json({ message: "Đăng xuất thành công." });
};