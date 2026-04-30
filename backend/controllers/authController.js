import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, password, role, state, district, city, trade, company } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists',
      });
    }

    // Create user
    const userData = {
      name,
      email,
      phone,
      passwordHash: password,
      role,
      location: { state, district, city },
    };

    if (role === 'labour' && trade) {
      userData.trade = trade;
    }
    if (role === 'contractor' && company) {
      userData.company = company;
    }

    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        trade: user.trade,
        company: user.company,
        verified: user.verified,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user with passwordHash
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        trade: user.trade,
        company: user.company,
        verified: user.verified,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Send OTP for phone verification
// @route   POST /api/auth/send-otp
export const sendOTP = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    // In production, send actual SMS via Twilio
    // For development, generate a mock OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log(`OTP for ${phone}: ${otp}`); // Log for development

    // Store OTP in user document (temporary)
    await User.findOneAndUpdate(
      { phone },
      {
        $set: {
          resetPasswordToken: otp,
          resetPasswordExpire: Date.now() + 5 * 60 * 1000 // 5 minutes
        }
      }
    );

    res.json({
      success: true,
      message: 'OTP sent successfully to your phone',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Return OTP in dev for testing
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
export const verifyOTP = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    const user = await User.findOne({
      phone,
      resetPasswordToken: otp,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      });
    }

    // Mark user as verified
    user.verified = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Phone verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Generate reset token
    const resetToken = generateToken(user._id);

    // In production, send email with reset link
    // For development, return the token
    res.json({
      success: true,
      message: 'Password reset link generated',
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update password
    user.passwordHash = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(new AppError('Invalid or expired reset token', 400));
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        trade: user.trade,
        company: user.company,
        location: user.location,
        skills: user.skills,
        bio: user.bio,
        experience: user.experience,
        dailyRate: user.dailyRate,
        languages: user.languages,
        available: user.available,
        verified: user.verified,
        avatarUrl: user.avatarUrl,
        rating: user.rating,
        totalReviews: user.totalReviews,
        totalJobsDone: user.totalJobsDone,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
