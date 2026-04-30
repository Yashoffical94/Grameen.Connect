import { validationResult } from 'express-validator';
import Review from '../models/Review.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Create a review
// @route   POST /api/reviews
export const createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { revieweeId, jobId, rating, reviewText } = req.body;

    // Check if reviewee exists
    const reviewee = await User.findById(revieweeId);
    if (!reviewee) {
      return next(new AppError('User not found', 404));
    }

    // Check if already reviewed this user for this job
    const existing = await Review.findOne({
      reviewerId: req.user.id,
      revieweeId,
      jobId,
    });

    if (existing) {
      return next(new AppError('You have already reviewed this user for this job', 400));
    }

    const review = await Review.create({
      reviewerId: req.user.id,
      revieweeId,
      jobId,
      rating,
      reviewText,
    });

    // Update reviewee's rating
    await reviewee.updateRating();
    await reviewee.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:id
export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ revieweeId: req.params.id })
      .populate('reviewerId', 'name avatarUrl role')
      .populate('jobId', 'title type')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new AppError('Review not found', 404));
    }

    if (review.reviewerId.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this review', 403));
    }

    await review.deleteOne();

    // Recalculate reviewee's rating
    const reviewee = await User.findById(review.revieweeId);
    if (reviewee) {
      await reviewee.updateRating();
      await reviewee.save();
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
