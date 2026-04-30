import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Search, Phone, Video, MoreVertical, Check, CheckCheck, Paperclip, Briefcase } from 'lucide-react';
import { messagesAPI, usersAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/shared/Avatar';
import Badge from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';

const Messages = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const { socket, connected, sendMessage, markRead, sendTyping, isUserOnline } = useSocket();
  const { toast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchMessages(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', handleReceiveMessage);
    socket.on('messages_read', handleMessagesRead);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('receive_message');
      socket.off('messages_read');
      socket.off('user_typing');
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await messagesAPI.getConversations();
      setConversations(response.data.data);
      if (userId && !selectedUser) {
        const conv = response.data.data.find((c) => c.user._id === userId);
        if (conv) setSelectedUser(conv.user);
      }
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (targetUserId) => {
    try {
      const response = await messagesAPI.getMessages(targetUserId);
      setMessages(response.data.data);
      const conv = conversations.find((c) => c.user._id === targetUserId);
      setSelectedUser(conv?.user || null);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const handleReceiveMessage = (data) => {
    if (
      (data.senderId === selectedUser?._id) ||
      (data.message?.receiverId === user?.id && data.senderId === selectedUser?._id)
    ) {
      setMessages((prev) => [...prev, data.message]);
      markRead(data.senderId);
    }
    fetchConversations();
  };

  const handleMessagesRead = (data) => {
    if (data.readerId === selectedUser?._id) {
      setMessages((prev) =>
        prev.map((m) => ({ ...m, read: true }))
      );
    }
  };

  const handleUserTyping = (data) => {
    if (data.userId === selectedUser?._id) {
      setIsTyping(data.isTyping);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      text: newMessage,
      createdAt: new Date().toISOString(),
      read: false,
    };

    try {
      await messagesAPI.sendMessage(selectedUser._id, newMessage);
      sendMessage(selectedUser._id, messageData);
      setMessages((prev) => [...prev, messageData]);
      setNewMessage('');
      fetchConversations();
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (!selectedUser) return;

    sendTyping(selectedUser._id, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(selectedUser._id, false);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Conversations List */}
      <div className={`w-full md:w-96 border-r border-border bg-surface ${userId ? 'hidden md:block' : ''}`}>
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold font-heading mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-surface2 border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary"
            />
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-primary' : 'bg-text-muted'}`} />
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="overflow-y-auto" style={{ height: 'calc(100vh - 200px)' }}>
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.user._id}
                onClick={() => fetchMessages(conv.user._id)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-surface2 transition-colors border-b border-border ${
                  selectedUser?._id === conv.user._id ? 'bg-surface2' : ''
                }`}
              >
                <Avatar
                  src={conv.user.avatarUrl}
                  name={conv.user.name}
                  verified={conv.user.verified}
                  size="md"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{conv.user.name}</span>
                    {conv.unreadCount > 0 && (
                      <Badge variant="primary" className="text-xs">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-text-muted truncate">
                    {conv.lastMessage?.text || 'Start a conversation'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!userId ? 'hidden md:flex' : ''}`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-surface flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => fetchMessages(null)}
                  className="md:hidden text-text-muted"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <Avatar
                  src={selectedUser.avatarUrl}
                  name={selectedUser.name}
                  verified={selectedUser.verified}
                  size="md"
                />
                <div>
                  <h2 className="font-semibold">{selectedUser.name}</h2>
                  <p className="text-xs text-text-muted">
                    {isUserOnline(selectedUser._id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-text-muted hover:text-text">
                  <Phone size={20} />
                </button>
                <button className="p-2 text-text-muted hover:text-text">
                  <Video size={20} />
                </button>
                <button className="p-2 text-text-muted hover:text-text">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ height: 'calc(100vh - 280px)' }}
            >
              {messages.map((msg, i) => {
                const isMine = msg.senderId === user?.id;
                return (
                  <div
                    key={msg._id || i}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        isMine
                          ? 'bg-primary text-background'
                          : 'bg-surface2 border border-border'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <span className="text-xs opacity-60">
                          {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {isMine && (
                          msg.read ? (
                            <CheckCheck size={14} className="opacity-60" />
                          ) : (
                            <Check size={14} className="opacity-60" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface2 border border-border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-border bg-surface"
            >
              <div className="flex items-center gap-3">
                <button type="button" className="p-2 text-text-muted hover:text-text">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-surface2 border border-border rounded-full px-4 py-2.5 text-text focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-3 bg-primary text-background rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            <div className="text-center">
              <div className="w-20 h-20 bg-surface2 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={40} />
              </div>
              <h3 className="text-lg font-semibold mb-2">No conversation selected</h3>
              <p className="text-sm">Select a conversation from the list or start a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
