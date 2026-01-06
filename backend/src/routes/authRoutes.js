import express from 'express';
import { signup, logout, authResponse, authRedirect } from '../controllers/authController.js';
import { validate, signupRules } from '../middlewares/validate.js';
import passport from '../config/passport.js';

const router = express.Router();

// Request: Body { HOTEN, PHAI, EMAIL, PASSWORD, SDT, NGAYSN }
router.post('/signup', validate(signupRules), signup);

// Request: Body { EMAIL, PASSWORD }
// router.post('/login', login);

// Không cần gì hết
router.post('/logout', logout);

// 1. LOGIN LOCAL
// session: false vì ta dùng JWT, không dùng cookie session
router.post('/login', passport.authenticate('local', { session: false }), authResponse);

// 2. LOGIN GOOGLE
// Bước 2a: Client bấm vào link này -> Chuyển hướng sang Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Bước 2b: Google gọi lại link này (Callback)
// Sau khi set cookie, redirect về frontend
router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login-fail' }),
    authRedirect // Redirect về frontend sau khi set cookie
);

export default router;
