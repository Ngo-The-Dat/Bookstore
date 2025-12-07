import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';
import { validate, signupRules } from '../middlewares/validate.js';

const router = express.Router();

router.post('/signup', validate(signupRules), signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;