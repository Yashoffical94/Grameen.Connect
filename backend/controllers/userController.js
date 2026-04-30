import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Get all workers with filters
// @route   GET /api/users/workers
export const getWorkers = async (req, res, next) => {
  try {
    const { trade, state, district, available, verified, minRate, maxRate, sortBy, page = 1, limit = 10 } = req.query;

    const query = { role: 'labour' };

    if (trade) query.trade = trade;
    if (state) query['location.state'] = state;
    if (district) query['location.district'] = district;
    if (available !== undefined) query.available = available === 'true';
    if (verified !== undefined) query.verified = verified === 'true';
    if (minRate || maxRate) {
      query.dailyRate = {};
      if (minRate) query.dailyRate.$gte = Number(minRate);
      if (maxRate) query.dailyRate.$lte = Number(maxRate);
    }

    let sortOption = { rating: -1 };
    if (sortBy === 'rate') sortOption = { dailyRate: 1 };
    if (sortBy === 'jobs') sortOption = { totalJobsDone: -1 };
    if (sortBy === 'newest') sortOption = { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const workers = await User.find(query)
      .select('-passwordHash')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: workers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

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

// @desc    Get own profile
// @route   GET /api/users/me
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');

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

// @desc    Update own profile
// @route   PUT /api/users/me
export const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const allowedFields = ['name', 'phone', 'bio', 'skills', 'experience', 'dailyRate', 'languages', 'available', 'trade', 'company', 'location'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete account
// @route   DELETE /api/users/me
export const deleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user.id);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile photo
// @route   POST /api/users/me/avatar
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new AppError('Please upload a file', 400));
    }

    // In production, upload to Cloudinary here
    // For now, use local path
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarUrl },
      { new: true }
    ).select('-passwordHash');

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
};
