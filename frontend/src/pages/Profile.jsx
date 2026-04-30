import { useState, useEffect } from 'react';
import { Camera, MapPin, Phone, Mail, Briefcase, IndianRupee, Calendar, Globe, Edit2, Save, X } from 'lucide-react';
import { usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Avatar from '../components/shared/Avatar';
import Badge from '../components/ui/Badge';
import { useToast } from '../hooks/useToast';

const Profile = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    skills: '',
    experience: '',
    dailyRate: '',
    languages: '',
    available: true,
    trade: '',
    company: '',
    state: '',
    district: '',
    city: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: user.skills?.join(', ') || '',
        experience: user.experience?.toString() || '',
        dailyRate: user.dailyRate?.toString() || '',
        languages: user.languages?.join(', ') || '',
        available: user.available ?? true,
        trade: user.trade || '',
        company: user.company || '',
        state: user.location?.state || '',
        district: user.location?.district || '',
        city: user.location?.city || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updateData = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        languages: formData.languages.split(',').map((l) => l.trim()).filter(Boolean),
        experience: formData.experience ? parseInt(formData.experience) : undefined,
        dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : undefined,
        location: {
          state: formData.state,
          district: formData.district,
          city: formData.city,
        },
      };
      delete updateData.name;

      await updateUser(updateData);
      await refreshUser();
      toast.success('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const tradeOptions = [
    { value: '', label: 'Select Trade' },
    { value: 'Masonry', label: 'Masonry' },
    { value: 'Electrician', label: 'Electrician' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Carpentry', label: 'Carpentry' },
    { value: 'Painting', label: 'Painting' },
    { value: 'Welding', label: 'Welding' },
    { value: 'Farm Labour', label: 'Farm Labour' },
    { value: 'Road & Civil', label: 'Road & Civil' },
  ];

  const stateOptions = [
    { value: '', label: 'Select State' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Maharashtra', label: 'Maharashtra' },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cover Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-t-xl h-32 relative">
          <button className="absolute bottom-4 right-4 p-2 bg-surface/80 backdrop-blur rounded-full hover:bg-surface transition-colors">
            <Camera size={18} />
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-surface border border-border border-t-0 rounded-b-xl -mt-12 relative">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-end -mt-12 mb-6 gap-4">
              <div className="relative">
                <Avatar src={user?.avatarUrl} name={user?.name} verified={user?.verified} size="xl" className="border-4 border-surface" />
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-background rounded-full hover:bg-primary-dark transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <div className="flex-1 pt-12 md:pt-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold font-heading">{user?.name}</h1>
                  {user?.verified && (
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-primary font-medium">{user?.trade || user?.company}</p>
              </div>
              <div className="flex gap-2 pt-2 md:pt-0">
                {editing ? (
                  <>
                    <Button variant="secondary" onClick={() => setEditing(false)}>
                      <X size={18} />
                      Cancel
                    </Button>
                    <Button onClick={handleSave} loading={loading}>
                      <Save size={18} />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button variant="secondary" onClick={() => setEditing(true)}>
                    <Edit2 size={18} />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border mb-6">
              <div>
                <div className="text-2xl font-bold text-text">{user?.rating?.toFixed(1) || 'N/A'}</div>
                <div className="text-sm text-text-muted">Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">{user?.totalReviews || 0}</div>
                <div className="text-sm text-text-muted">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">{user?.totalJobsDone || 0}</div>
                <div className="text-sm text-text-muted">Jobs Done</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">{user?.experience || 0}</div>
                <div className="text-sm text-text-muted">Years Exp</div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {editing ? (
                <>
                  <Input
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                  <Select
                    label="State"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    options={stateOptions}
                  />
                  <Input
                    label="District"
                    value={formData.district}
                    onChange={(e) => updateField('district', e.target.value)}
                  />
                  {user?.role === 'labour' ? (
                    <Select
                      label="Trade"
                      value={formData.trade}
                      onChange={(e) => updateField('trade', e.target.value)}
                      options={tradeOptions}
                    />
                  ) : (
                    <Input
                      label="Company"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                    />
                  )}
                  <Input
                    label="Experience (years)"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => updateField('experience', e.target.value)}
                  />
                  <Input
                    label="Daily Rate (₹)"
                    type="number"
                    value={formData.dailyRate}
                    onChange={(e) => updateField('dailyRate', e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Availability
                    </label>
                    <select
                      value={formData.available ? 'true' : 'false'}
                      onChange={(e) => updateField('available', e.target.value === 'true')}
                      className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary"
                    >
                      <option value="true">Available for work</option>
                      <option value="false">Currently busy</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary min-h-[100px]"
                      placeholder="Tell about yourself, your skills, experience..."
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.skills}
                      onChange={(e) => updateField('skills', e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary"
                      placeholder="Brick laying, Concrete work, Plastering"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Languages (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.languages}
                      onChange={(e) => updateField('languages', e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary"
                      placeholder="Hindi, English, Bhojpuri"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-text-muted">
                      <Phone size={18} />
                      <span>{user?.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-muted">
                      <Mail size={18} />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-text-muted">
                      <MapPin size={18} />
                      <span>{user?.location?.city || user?.location?.district}, {user?.location?.state}</span>
                    </div>
                    {user?.bio && (
                      <div>
                        <h3 className="font-medium text-text mb-2">About</h3>
                        <p className="text-text-muted">{user.bio}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {user?.skills?.length > 0 && (
                      <div>
                        <h3 className="font-medium text-text mb-2 flex items-center gap-2">
                          <Briefcase size={18} />
                          Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.map((skill, i) => (
                            <Badge key={i} variant="default">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {user?.languages?.length > 0 && (
                      <div>
                        <h3 className="font-medium text-text mb-2 flex items-center gap-2">
                          <Globe size={18} />
                          Languages
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {user.languages.map((lang, i) => (
                            <Badge key={i} variant="info">{lang}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-text mb-2 flex items-center gap-2">
                        <IndianRupee size={18} />
                        Rate
                      </h3>
                      <p className="text-text-muted">₹{user?.dailyRate || 'Not set'} / day</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-text mb-2 flex items-center gap-2">
                        <Calendar size={18} />
                        Status
                      </h3>
                      <Badge variant={user?.available ? 'success' : 'warning'}>
                        {user?.available ? 'Available' : 'Busy'}
                      </Badge>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
