import User from '../models/user.js';
import UserAuth from '../models/user_authentication.js';

// Lấy danh sách user
export const get_all_users = async () => {
    return await User.find();
};

// Lấy 1 user theo ID
export const get_user_by_id = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return user;
};

// Cập nhật User
export const update_user_by_id = async (userId, updateData) => {
    // { new: true }: trả về data mới
    // { runValidators: true }: check kỹ data đầu vào theo Model
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { 
        new: true, 
        runValidators: true 
    });
    
    if (!updatedUser) {
        throw new Error("USER_NOT_FOUND");
    }
    return updatedUser;
};

// Xóa User
export const delete_user_by_id = async (userId) => {

    const deletedUserAuths = await UserAuth.deleteMany({ USER: userId });
    if (!deletedUserAuths.deletedCount) {
        throw new Error("USER_AUTH_NOT_FOUND");
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new Error("USER_NOT_FOUND");
    }

};