import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, MessageSquare, Briefcase, User, Settings } from 'lucide-react';
import { notificationsAPI } from '../services/api';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';

const Notifications = () => {
  const { toast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsAPI.getNotifications();
      setNotifications(response.data.data);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markSingleRead = async (id) => {
    try {
      await notificationsAPI.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="text-blue" size={20} />;
      case 'application':
        return <Briefcase className="text-primary" size={20} />;
      case 'job_match':
        return <User className="text-accent" size={20} />;
      default:
        return <Settings className="text-text-muted" size={20} />;
    }
  };

  const getLink = (notification) => {
    switch (notification.type) {
      case 'message':
        return `/messages`;
      case 'application':
        return `/applications`;
      case 'job_match':
        return `/workers`;
      default:
        return '/notifications';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold font-heading mb-2">Notifications</h1>
            <p className="text-text-muted">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notifications`
                : "You're all caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" onClick={markAllRead}>
              <CheckCheck size={18} />
              Mark all read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-border rounded-xl">
            <Bell className="mx-auto text-text-muted mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">No notifications yet</h3>
            <p className="text-text-muted">
              We'll notify you when you have new messages, applications, or updates
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <Link
                key={notification._id}
                to={notification.link || '/notifications'}
                onClick={() => !notification.read && markSingleRead(notification._id)}
                className={`block p-4 rounded-xl border transition-all ${
                  notification.read
                    ? 'bg-surface border-border'
                    : 'bg-surface2 border-primary/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.read ? 'bg-surface' : 'bg-primary/20'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium">{notification.title}</h3>
                        <p className="text-sm text-text-muted mt-1">{notification.body}</p>
                      </div>
                      {!notification.read && (
                        <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <div className="text-xs text-text-muted mt-2">
                      {new Date(notification.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
