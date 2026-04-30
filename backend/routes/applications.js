import express from 'express';
import { body } from 'express-validator';
import {
  applyToJob,
  getMyApplications,
  getIncomingApplications,
  updateApplication,
  deleteApplication,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Labour-only routes
router.post('/',
  authorize('labour'),
  [
    body('jobId')
      .notEmpty()
      .withMessage('Job ID is required'),
    body('coverMessage')
      .optional()
      .isString()
      .withMessage('Cover message must be text'),
    body('expectedRate')
      .optional()
      .isNumeric()
      .withMessage('Expected rate must be a number'),
  ],
  applyToJob
);
router.get('/my', getMyApplications);

// Contractor-only routes
router.get('/incoming', getIncomingApplications);

// Both can update/delete their own applications
router.patch('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
