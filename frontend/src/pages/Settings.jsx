import { useState } from 'react';
import { User, Bell, Shield, Lock, Eye, EyeOff, Smartphone, Globe, Mail, Briefcase, Badge } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../hooks/useToast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    applications: true,
    messages: true,
    jobMatches: true,
    system: true,
  });

  const [privacy, setPrivacy] = useState({
    phoneVisible: false,
    publicProfile: true,
    allowMessages: true,
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // In a real app, verify current password first
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preferences updated');
  };

  const handlePrivacyToggle = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Privacy settings updated');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-heading mb-2">Settings</h1>
        <p className="text-text-muted mb-6">Manage your account settings and preferences</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text'
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-surface border border-border rounded-xl p-6">
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="flex-1 bg-surface2 border border-border rounded-lg px-4 py-2.5 text-text-muted"
                      disabled
                    />
                    <span className="text-xs text-text-muted">Verified</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Phone
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="tel"
                      defaultValue={user?.phone}
                      className="flex-1 bg-surface2 border border-border rounded-lg px-4 py-2.5 text-text-muted"
                      disabled
                    />
                    <span className="text-xs text-text-muted">Verified</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Role
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.role === 'labour' ? 'Worker' : 'Contractor'}
                    className="w-full bg-surface2 border border-border rounded-lg px-4 py-2.5 text-text-muted"
                    disabled
                  />
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <Button>Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email', icon: Mail },
                  { key: 'sms', label: 'SMS Notifications', desc: 'Receive updates via SMS', icon: Smartphone },
                  { key: 'applications', label: 'Application Updates', desc: 'Get notified when application status changes', icon: User },
                  { key: 'messages', label: 'New Messages', desc: 'Get notified when you receive a message', icon: Bell },
                  { key: 'jobMatches', label: 'Job Matches', desc: 'Get notified about relevant job opportunities', icon: Briefcase },
                  { key: 'system', label: 'System Updates', desc: 'Important announcements and updates', icon: Globe },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-surface2 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="text-text-muted" size={20} />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-text-muted">{item.desc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(item.key)}
                        className={`w-12 h-6 rounded-full transition-colors ${notifications[item.key] ? 'bg-primary' : 'bg-surface'
                          }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications[item.key] ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface2 rounded-lg">
                  <div>
                    <div className="font-medium">Phone Number Visibility</div>
                    <div className="text-sm text-text-muted">Show your phone number on public profile</div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('phoneVisible')}
                    className={`w-12 h-6 rounded-full transition-colors ${privacy.phoneVisible ? 'bg-primary' : 'bg-surface'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${privacy.phoneVisible ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface2 rounded-lg">
                  <div>
                    <div className="font-medium">Public Profile</div>
                    <div className="text-sm text-text-muted">Allow others to find and view your profile</div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('publicProfile')}
                    className={`w-12 h-6 rounded-full transition-colors ${privacy.publicProfile ? 'bg-primary' : 'bg-surface'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${privacy.publicProfile ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface2 rounded-lg">
                  <div>
                    <div className="font-medium">Allow Direct Messages</div>
                    <div className="text-sm text-text-muted">Let other users send you messages</div>
                  </div>
                  <button
                    onClick={() => handlePrivacyToggle('allowMessages')}
                    className={`w-12 h-6 rounded-full transition-colors ${privacy.allowMessages ? 'bg-primary' : 'bg-surface'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${privacy.allowMessages ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
                <div className="relative">
                  <Input
                    label="New Password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-9 text-text-muted hover:text-text"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <Input
                  label="Confirm New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                />
                <div className="pt-4">
                  <Button onClick={handlePasswordChange} loading={loading}>
                    Change Password
                  </Button>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="font-medium mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-surface2 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Smartphone className="text-primary" size={20} />
                      </div>
                      <div>
                        <div className="font-medium">Current Device</div>
                        <div className="text-sm text-text-muted">Last active: Now</div>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <Button variant="danger" onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    // Handle account deletion
                  }
                }}>
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
