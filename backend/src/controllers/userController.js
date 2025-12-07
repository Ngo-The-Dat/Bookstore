import * as userService from '../services/user.service.js';

// 1. GET ALL
export const get_all_users = async (req, res) => {
    try {
        const users = await userService.get_all_users();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error: error.message });
    }
};

// 2. GET BY ID (Admin xem user khác)
export const get_user_by_id = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userService.get_user_by_id(userId);
        res.status(200).json(user);
    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

// 3. GET CURRENT USER (Profile bản thân)
export const get_current_user = async (req, res) => {
    try {
        // Lấy ID từ token (đã được middleware giải mã và gắn vào req.user)
        const myId = req.user._id; 
        
        // Gọi lại hàm get_user_by_id của service để lấy dữ liệu mới nhất
        const user = await userService.get_user_by_id(myId);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin cá nhân", error: error.message });
    }
};

// 4. UPDATE
export const update_user = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        
        const updatedUser = await userService.update_user_by_id(userId, updateData);
        res.status(200).json(updatedUser);
    } catch (error) {
        if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({ message: "Người dùng không tồn tại để cập nhật" });
        }
        res.status(500).json({ message: "Lỗi khi cập nhật", error: error.message });
    }
};

// 5. DELETE
export const delete_user = async (req, res) => {
    try {
        const userId = req.params.id;
        await userService.delete_user_by_id(userId);
        res.status(200).json({ message: "Người dùng đã được xóa thành công" });
    } catch (error) {
         if (error.message === "USER_NOT_FOUND") {
            return res.status(404).json({ message: "Người dùng không tồn tại để xóa" });
        }
        res.status(500).json({ message: "Lỗi khi xóa", error: error.message });
    }
};