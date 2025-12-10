import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import { validate, signupRules } from '../middlewares/validate.js';

const router = express.Router();

// Request: Body { HOTEN, PHAI, EMAIL, PASSWORD, SDT, NGAYSN }
router.post('/signup', validate(signupRules), signup);

// Request: Body { EMAIL, PASSWORD }
router.post('/login', login);

// Không cần gì hết
router.post('/logout', logout);

export default router;