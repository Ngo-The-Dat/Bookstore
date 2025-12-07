import express from 'express';
import { get_all_users, delete_user, update_user, get_current_user } from '../controllers/userController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

router.get('/get_all_users', protect, restrictTo('admin'), get_all_users);
router.delete('/delete_user/:id', protect, restrictTo('admin'), delete_user);
router.put('/update_user/:id', protect, restrictTo('admin'), update_user);
router.get('/get_current_user', protect, get_current_user);

export default router;