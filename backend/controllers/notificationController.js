import Notification from '../models/Notification.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Get user notifications
// @route   GET /api/notifications
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.user.id,
      read: false,
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PATCH /api/notifications/read
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark single notification as read
// @route   PATCH /api/notifications/:id/read
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return next(new AppError('Notification not found', 404));
    }

    if (notification.userId.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }

    notification.read = true;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};
