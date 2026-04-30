import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many authentication attempts, please try again later',
});

router.post('/register', authLimiter, [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().trim().withMessage('Phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['labour', 'contractor']).withMessage('Invalid role'),
], register);

router.post('/login', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], login);

router.post('/logout', logout);

router.post('/send-otp', authLimiter, [
  body('phone').notEmpty().trim().withMessage('Phone number is required'),
], sendOTP);

router.post('/verify-otp', authLimiter, [
  body('phone').notEmpty().trim().withMessage('Phone number is required'),
  body('otp').notEmpty().trim().withMessage('OTP is required'),
], verifyOTP);

router.post('/forgot-password', authLimiter, [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
], forgotPassword);

router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], resetPassword);

router.get('/me', protect, getMe);

export default router;
