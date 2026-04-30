import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesRead,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/conversations', getConversations);
router.get('/:userId', getMessages);
router.post('/', sendMessage);
router.patch('/:userId/read', markMessagesRead);

export default router;
