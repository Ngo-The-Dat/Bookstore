import express from 'express';
import { signup, login, logout } from '../controllers/authController.js'; // (Tên file chứa hàm signup/login)

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;