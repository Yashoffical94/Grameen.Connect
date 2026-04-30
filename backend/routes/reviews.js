import express from 'express';
import { body } from 'express-validator';
import {
  createReview,
  getUserReviews,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', [
  body('revieweeId').notEmpty().withMessage('Reviewee ID is required'),
  body('jobId').notEmpty().withMessage('Job ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
  body('reviewText').notEmpty().trim().withMessage('Review text is required'),
], createReview);

router.get('/user/:id', getUserReviews);
router.delete('/:id', deleteReview);

export default router;
