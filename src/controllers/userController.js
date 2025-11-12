import User from '../model/user.js';

export const get_all_users = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng", error: error.message });
    }
}

export const delete_user = async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "Người dùng đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa người dùng", error: error.message });
    }
}

export const update_user = async (req, res) => {
    try {
        const userId = req.params.id;
        const updateData = req.body;
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật người dùng", error: error.message });
    }           
}

export const get_current_user = async (req, res) => {
    try {
        const currentUser = req.user;
        res.status(200).json(currentUser);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng", error: error.message });
    }
}