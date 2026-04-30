import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, IndianRupee, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/shared/Avatar';
import { useToast } from '../hooks/useToast';

const Applications = () => {
  const { isLabour, isContractor } = useAuth();
  const { toast } = useToast();

  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let response;
      if (isLabour) {
        response = await applicationsAPI.getMyApplications(filter !== 'all' ? { status: filter } : {});
      } else {
        response = await applicationsAPI.getIncomingApplications(filter !== 'all' ? { status: filter } : {});
      }
      setApplications(response.data.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await applicationsAPI.updateApplication(id, status);
      toast.success(`Application ${status}`);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      await applicationsAPI.deleteApplication(id);
      toast.success('Application deleted');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to delete application');
    }
  };

  const tabs = [
    { value: 'all', label: 'All', icon: Briefcase },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'accepted', label: 'Accepted', icon: CheckCircle },
    { value: 'rejected', label: 'Rejected', icon: XCircle },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold font-heading mb-2">
          {isLabour ? 'My Applications' : 'Job Applications'}
        </h1>
        <p className="text-text-muted mb-6">
          {isLabour
            ? 'Track your job applications'
            : 'Review applications from workers'}
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${filter === tab.value
                    ? 'bg-primary text-background'
                    : 'bg-surface2 text-text-muted hover:text-text'
                  }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-border rounded-xl">
            <Briefcase className="mx-auto text-text-muted mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">No applications found</h3>
            <p className="text-text-muted mb-4">
              {isLabour
                ? "You haven't applied to any jobs yet"
                : "No applications for this filter"}
            </p>
            {isLabour && (
              <Link to="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-surface border border-border rounded-xl p-5"
              >
                {isLabour ? (
                  /* Labour View - Applications sent */
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Briefcase className="text-primary" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{app.jobId?.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-text-muted mt-1">
                          <span className="flex items-center gap-1">
                            <Briefcase size={14} />
                            {app.jobId?.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {app.jobId?.location?.district}, {app.jobId?.location?.state}
                          </span>
                          <span className="flex items-center gap-1">
                            <IndianRupee size={14} />
                            {app.jobId?.dailyRate}/day
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          app.status === 'accepted'
                            ? 'success'
                            : app.status === 'rejected'
                              ? 'danger'
                              : 'warning'
                        }
                      >
                        {app.status}
                      </Badge>
                      {app.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(app._id)}
                        >
                          Withdraw
                        </Button>
                      )}
                      <Link to={`/jobs/${app.jobId?._id}`}>
                        <Button variant="secondary" size="sm">
                          View Job
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Contractor View - Applications received */
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar
                        src={app.workerId?.avatarUrl}
                        name={app.workerId?.name}
                        verified={app.workerId?.verified}
                        size="md"
                      />
                      <div>
                        <h3 className="font-semibold">{app.workerId?.name}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-text-muted">
                          <span>{app.workerId?.trade}</span>
                          <span>•</span>
                          <span>{app.workerId?.experience} years exp</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <IndianRupee size={14} />
                            {app.workerId?.dailyRate}/day
                          </span>
                        </div>
                        {app.coverMessage && (
                          <p className="text-sm text-text-muted mt-2 line-clamp-1">
                            "{app.coverMessage}"
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          app.status === 'accepted'
                            ? 'success'
                            : app.status === 'rejected'
                              ? 'danger'
                              : 'warning'
                        }
                      >
                        {app.status}
                      </Badge>
                      {app.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(app._id, 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleStatusChange(app._id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Link to={`/workers/${app.workerId?._id}`}>
                        <Button variant="secondary" size="sm">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
