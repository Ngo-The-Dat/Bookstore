import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Middleware này kiểm tra xem user đã đăng nhập chưa
export const protect = async (req, res, next) => {
    let token;

    // 1. Lấy token từ cookie
    if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập. Vui lòng đăng nhập." });
    }

    try {
        // 2. Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Tìm user dựa trên ID trong token
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ message: "Người dùng không còn tồn tại." });
        }

        // 4. Gắn thông tin user vào `req` để các hàm sau dùng
        req.user = currentUser;
        next(); // Cho đi tiếp

    } catch (error) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }
};

// Middleware này là một "hàm mẹ" (higher-order function)
// Nó nhận vào vai trò (role) và trả về một hàm middleware
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        // req.user được tạo ra từ middleware 'protect' ở trên
        // Kiểm tra xem 'roles' (vd: ['admin']) có chứa role của user không
        if (!roles.includes(req.user.ROLE)) {
            // 403 Forbidden: Tôi biết bạn là ai, nhưng bạn không có quyền
            return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này." });
        }

        next(); // Cho đi tiếp nếu là admin
    };
};