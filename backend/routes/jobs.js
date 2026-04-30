import express from 'express';
import { body } from 'express-validator';
import {
  getJobs,
  getMyJobs,
  getJob,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/my', protect, authorize('contractor'), getMyJobs);
router.get('/:id', getJob);

// Protected routes
router.use(protect);

// Contractor-only routes
router.get('/my', authorize('contractor'), getMyJobs);

router.post('/', authorize('contractor'), [
  body('title').notEmpty().trim().withMessage('Job title is required'),
  body('description').notEmpty().trim().withMessage('Job description is required'),
  body('type').isIn(['Construction', 'Agriculture', 'Skilled Trade', 'Renovation', 'Loading/Shifting', 'Other']).withMessage('Invalid job type'),
  body('trade').notEmpty().withMessage('Trade is required'),
  body('location.state').notEmpty().withMessage('State is required'),
  body('location.district').notEmpty().withMessage('District is required'),
  body('workersNeeded').isInt({ min: 1 }).withMessage('Workers needed must be at least 1'),
  body('dailyRate').isFloat({ min: 0 }).withMessage('Daily rate must be positive'),
  body('duration').notEmpty().withMessage('Duration is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
], createJob);

router.put('/:id', authorize('contractor'), updateJob);
router.patch('/:id/status', authorize('contractor'), updateJobStatus);
router.delete('/:id', authorize('contractor'), deleteJob);

export default router;