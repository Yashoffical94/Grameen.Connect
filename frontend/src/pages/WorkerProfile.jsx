import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Calendar, Star, BadgeCheck, Briefcase, IndianRupee, MessageSquare, Bookmark } from 'lucide-react';
import { usersAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/shared/Avatar';
import StarRating from '../components/shared/StarRating';
import { PageSkeleton } from '../components/ui/LoadingSkeleton';
import { useToast } from '../hooks/useToast';

const WorkerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const [userRes, reviewsRes] = await Promise.all([
        usersAPI.getUserProfile(id),
        reviewsAPI.getUserReviews(id),
      ]);
      setWorker(userRes.data.user);
      setReviews(reviewsRes.data.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile not found</h2>
          <Link to="/workers">
            <Button>Browse Workers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Cover Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-t-xl h-32" />

        {/* Profile Header */}
        <div className="bg-surface border border-border border-t-0 rounded-b-xl -mt-8 relative">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-end -mt-12 mb-4 gap-4">
              <Avatar src={worker.avatarUrl} name={worker.name} verified={worker.verified} size="xl" className="border-4 border-surface" />
              <div className="flex-1 pt-12 md:pt-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold font-heading">{worker.name}</h1>
                  {worker.verified && (
                    <BadgeCheck className="text-primary" size={24} />
                  )}
                </div>
                <p className="text-primary font-medium">{worker.trade}</p>
              </div>
              <div className="flex gap-2 pt-2 md:pt-0">
                <Button variant="secondary">
                  <Bookmark size={18} />
                  Save
                </Button>
                <Button>
                  <MessageSquare size={18} />
                  Contact
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-border">
              <div>
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Star size={16} className="text-accent fill-accent" />
                  <span>Rating</span>
                </div>
                <div className="font-semibold text-lg">{worker.rating?.toFixed(1)} / 5.0</div>
                <div className="text-sm text-text-muted">{worker.totalReviews} reviews</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Briefcase size={16} />
                  <span>Jobs Done</span>
                </div>
                <div className="font-semibold text-lg">{worker.totalJobsDone}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Calendar size={16} />
                  <span>Experience</span>
                </div>
                <div className="font-semibold text-lg">{worker.experience || 0} years</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <IndianRupee size={16} />
                  <span>Daily Rate</span>
                </div>
                <div className="font-semibold text-lg">₹{worker.dailyRate}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1.5 text-text-muted">
                <MapPin size={16} />
                {worker.location?.city || worker.location?.district}, {worker.location?.state}
              </div>
              {worker.phone && (
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Phone size={16} />
                  {worker.phone}
                </div>
              )}
              {worker.email && (
                <div className="flex items-center gap-1.5 text-text-muted">
                  <Mail size={16} />
                  {worker.email}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-text-muted">{worker.bio || 'No bio available'}</p>
            </div>

            {/* Skills */}
            {worker.skills?.length > 0 && (
              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill, i) => (
                    <Badge key={i} variant="default">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {worker.languages?.length > 0 && (
              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {worker.languages.map((lang, i) => (
                    <Badge key={i} variant="info">{lang}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Reviews ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <p className="text-text-muted">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-border pt-4 first:border-t-0 first:pt-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar src={review.reviewerId?.avatarUrl} name={review.reviewerId?.name} size="sm" />
                          <div>
                            <div className="font-medium">{review.reviewerId?.name}</div>
                            <div className="text-xs text-text-muted">{review.reviewerId?.role}</div>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-text-muted text-sm">{review.reviewText}</p>
                      <div className="text-xs text-text-muted mt-2">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Availability</h3>
              <Badge variant={worker.available ? 'success' : 'warning'} className="text-sm">
                {worker.available ? 'Available for work' : 'Currently busy'}
              </Badge>
            </div>

            {/* Verification */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Verification</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Phone Verified</span>
                  {worker.verified ? (
                    <BadgeCheck className="text-primary" size={20} />
                  ) : (
                    <span className="text-text-muted">Not verified</span>
                  )}
                </div>
              </div>
            </div>

            {/* Work Preferences */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Work Preferences</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Daily Rate</span>
                  <span className="font-medium">₹{worker.dailyRate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Experience</span>
                  <span className="font-medium">{worker.experience || 0} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Preferred Location</span>
                  <span className="font-medium">{worker.location?.state || 'Any'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
