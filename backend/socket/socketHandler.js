import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Store online users: Map<userId, socketId>
const onlineUsers = new Map();

export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Authenticate socket connection
    socket.on('authenticate', async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash');

        if (user) {
          socket.userId = decoded.id;
          onlineUsers.set(decoded.id, socket.id);

          socket.emit('authenticated', { success: true, user });

          // Broadcast online status
          io.emit('online_status', {
            userId: decoded.id,
            online: true,
            onlineCount: onlineUsers.size
          });

          console.log(`User ${user.name} authenticated, socket: ${socket.id}`);
        }
      } catch (error) {
        socket.emit('authenticated', { success: false, error: 'Invalid token' });
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      const { receiverId, message } = data;

      if (!socket.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      const receiverSocketId = onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', {
          senderId: socket.userId,
          ...message,
        });
      }
    });

    // Mark messages as read
    socket.on('mark_read', (data) => {
      const { senderId } = data;
      const senderSocketId = onlineUsers.get(senderId);

      if (senderSocketId) {
        io.to(senderSocketId).emit('messages_read', {
          readerId: socket.userId,
        });
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      const receiverSocketId = onlineUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', {
          userId: socket.userId,
          isTyping,
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);

        io.emit('online_status', {
          userId: socket.userId,
          online: false,
          onlineCount: onlineUsers.size,
        });
      }

      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export const getOnlineUsers = () => onlineUsers;
