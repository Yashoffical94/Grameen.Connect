import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://grameen-connect.onrender.com';

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setConnected(false);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    const token = localStorage.getItem('token');
    newSocket.on('connect', () => {
      console.log('Socket connected');
      newSocket.emit('authenticate', token);
    });

    newSocket.on('authenticated', (data) => {
      if (data.success) {
        setConnected(true);
      }
    });

    newSocket.on('online_status', (data) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        if (data.online) {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const sendMessage = useCallback((receiverId, message) => {
    if (socket) {
      socket.emit('send_message', { receiverId, message });
    }
  }, [socket]);

  const markRead = useCallback((senderId) => {
    if (socket) {
      socket.emit('mark_read', { senderId });
    }
  }, [socket]);

  const sendTyping = useCallback((receiverId, isTyping) => {
    if (socket) {
      socket.emit('typing', { receiverId, isTyping });
    }
  }, [socket]);

  const isUserOnline = useCallback((userId) => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  const value = {
    socket,
    connected,
    onlineUsers,
    sendMessage,
    markRead,
    sendTyping,
    isUserOnline,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
