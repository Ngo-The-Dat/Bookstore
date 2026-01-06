import express from 'express';
import { get_all_users, delete_user, update_current_user, get_current_user, get_user_by_id, update_user_role } from '../controllers/userController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

// Request: Không có gì hết
// Phải đăng nhập và là admin mới được phép lấy danh sách tất cả user
router.get('/get_all_users', protect, restrictTo('admin'), get_all_users);

// Request: Param { id }
// Phải đăng nhập và là admin mới được phép xóa user khác
router.delete('/delete_user/:id', protect, restrictTo('admin'), delete_user);

// Request: Body { fields to update }
// Phải đăng nhập mới được phép cập nhật thông tin cá nhân
// Field bao gồm { FULL_NAME, GENDER, EMAIL, PHONE, DATE_OF_BIRTH }
router.put('/update_current_user', protect, update_current_user);

// Request: Param { id }
// Phải đăng nhập và là admin mới được phép lấy thông tin user khác
router.get('/get_user_by_id/:id', protect, restrictTo('admin'), get_user_by_id);

// Request: Param { id }, Body { role }
// Phải đăng nhập và là admin mới được phép cập nhật vai trò người dùng khác
router.put('/update_user_role/:id', protect, restrictTo('admin'), update_user_role);

// Request: Không có gì hết
// Phải đăng nhập mới được phép lấy thông tin cá nhân
router.get('/get_current_user', protect, get_current_user);

export default router;