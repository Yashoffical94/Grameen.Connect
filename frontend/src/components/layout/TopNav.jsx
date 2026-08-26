import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, MessageSquare, User, LogOut, Briefcase, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/api';
import Avatar from '../shared/Avatar';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const TopNav = () => {
  const { user, logout, isLabour, isContractor } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    try {
      const response = await notificationsAPI.getNotifications();
      setNotificationCount(response.data.unreadCount);
    } catch (error) {
      // Silently fail - notification count is non-critical
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { href: '/workers', label: 'Find Workers' },
    { href: '/jobs', label: 'Find Jobs' },
  ];

  if (isContractor) {
    navLinks.push({ href: '/post-job', label: 'Post a Job' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Briefcase className="text-background" size={20} />
            </div>
            <span className="font-heading font-bold text-xl text-text">
              Grameen Connect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-text-muted hover:text-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 text-text-muted hover:text-text transition-colors"
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <Badge variant="danger" className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">
                      {notificationCount}
                    </Badge>
                  )}
                </Link>

                {/* Messages */}
                <Link
                  to="/messages"
                  className="p-2 text-text-muted hover:text-text transition-colors"
                >
                  <MessageSquare size={20} />
                </Link>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:bg-surface2 rounded-lg p-1.5 transition-colors"
                  >
                    <Avatar src={user?.avatarUrl} name={user?.name} verified={user?.verified} size="sm" />
                    <span className="hidden md:block text-sm font-medium text-text">
                      {user?.name}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl py-2 animate-slide-up">
                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-muted hover:text-text hover:bg-surface2 transition-colors"
                      >
                        <User size={16} />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-muted hover:text-text hover:bg-surface2 transition-colors"
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-muted hover:text-text hover:bg-surface2 transition-colors"
                      >
                        <Briefcase size={16} />
                        Settings
                      </Link>
                      <hr className="my-2 border-border" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-surface2 transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-text-muted hover:text-text"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-text-muted hover:text-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-text-muted hover:text-text transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-text-muted hover:text-text transition-colors"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-danger hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full mt-2">Login</Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;
