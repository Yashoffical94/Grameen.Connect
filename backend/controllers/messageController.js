import Message from '../models/Message.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Get all conversations
// @route   GET /api/messages/conversations
export const getConversations = async (req, res, next) => {
  try {
    // Get all unique users who have messaged with current user
    const sentMessages = await Message.find({ senderId: req.user.id })
      .select('receiverId')
      .distinct('receiverId');

    const receivedMessages = await Message.find({ receiverId: req.user.id })
      .select('senderId')
      .distinct('senderId');

    const allUserIds = [...new Set([...sentMessages, ...receivedMessages])];

    // Get last message and user info for each conversation
    const conversations = await Promise.all(
      allUserIds.map(async (userId) => {
        const lastMessage = await Message.findOne({
          $or: [
            { senderId: req.user.id, receiverId: userId },
            { senderId: userId, receiverId: req.user.id },
          ],
        }).sort({ createdAt: -1 }).populate('senderId', 'name avatarUrl');

        const user = await User.findById(userId).select('name role trade company avatarUrl verified');

        // Count unread messages
        const unreadCount = await Message.countDocuments({
          senderId: userId,
          receiverId: req.user.id,
          read: false,
        });

        return {
          user,
          lastMessage,
          unreadCount,
        };
      })
    );

    // Sort by last message date
    conversations.sort((a, b) => {
      const dateA = a.lastMessage?.createdAt || new Date(0);
      const dateB = b.lastMessage?.createdAt || new Date(0);
      return dateB - dateA;
    });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
export const getMessages = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id },
      ],
    }).sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { senderId: userId, receiverId: req.user.id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message
// @route   POST /api/messages
export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return next(new AppError('Receiver ID and message text are required', 400));
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return next(new AppError('User not found', 404));
    }

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      text,
    });

    // Emit socket event if using real-time
    if (req.app.get('io')) {
      const io = req.app.get('io');
      io.emit('receive_message', {
        senderId: req.user.id,
        message,
      });
    }

    // Create notification
    await import('../models/Notification.js').then(async ({ default: Notification }) => {
      await Notification.create({
        userId: receiverId,
        type: 'message',
        title: 'New Message',
        body: text.substring(0, 100),
        link: `/messages/${req.user.id}`,
      });
    });

    res.status(201).json({
      success: true,
      message: 'Message sent',
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as read
// @route   PATCH /api/messages/:userId/read
export const markMessagesRead = async (req, res, next) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      { senderId: userId, receiverId: req.user.id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error) {
    next(error);
  }
};
