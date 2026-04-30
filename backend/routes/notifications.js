import express from 'express';
import {
  getNotifications,
  markAllRead,
  markNotificationRead,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/read', markAllRead);
router.patch('/:id/read', markNotificationRead);

export default router;
