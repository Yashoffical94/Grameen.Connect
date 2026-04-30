import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import {
  getWorkers,
  getUserProfile,
  getMyProfile,
  updateProfile,
  deleteAccount,
  uploadAvatar,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Public routes
router.get('/workers', getWorkers);
router.get('/:id', getUserProfile);

// Protected routes
router.use(protect);

router.get('/me', getMyProfile);

router.put('/me', [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('phone').optional().trim().notEmpty().withMessage('Phone cannot be empty'),
  body('experience').optional().isInt({ min: 0, max: 50 }).withMessage('Experience must be 0-50 years'),
  body('dailyRate').optional().isFloat({ min: 0 }).withMessage('Daily rate must be positive'),
], updateProfile);

router.post('/me/avatar', upload.single('avatar'), uploadAvatar);

router.delete('/me', authorize('labour', 'contractor'), deleteAccount);

export default router;
