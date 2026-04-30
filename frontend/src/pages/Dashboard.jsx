import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, CheckCircle, Clock, Star, IndianRupee, TrendingUp, MessageSquare } from 'lucide-react';
import { jobsAPI, applicationsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Avatar from '../components/shared/Avatar';
import { useToast } from '../hooks/useToast';

const Dashboard = () => {
  const { user, isLabour, isContractor } = useAuth();
  const { toast } = useToast();

  const [stats, setStats] = useState({
    jobs: 0,
    applications: 0,
    messages: 0,
    earnings: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (isLabour) {
        const [appsRes, jobsRes] = await Promise.all([
          applicationsAPI.getMyApplications(),
          jobsAPI.getJobs({ limit: 3 }),
        ]);
        setRecentApplications(appsRes.data.data.slice(0, 3));
        setRecentJobs(jobsRes.data.data);
        setStats({
          applications: appsRes.data.data.length,
          jobs: jobsRes.data.data.length,
        });
      } else {
        const [myJobsRes, appsRes] = await Promise.all([
          jobsAPI.getMyJobs(),
          applicationsAPI.getIncomingApplications(),
        ]);
        setRecentJobs(myJobsRes.data.data.slice(0, 3));
        setRecentApplications(appsRes.data.data.slice(0, 3));
        setStats({
          jobs: myJobsRes.data.data.length,
          applications: appsRes.data.data.length,
        });
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const labourStats = [
    { label: 'Applications Sent', value: stats.applications, icon: Briefcase, color: 'text-blue' },
    { label: 'Jobs Available', value: stats.jobs, icon: CheckCircle, color: 'text-primary' },
    { label: 'Profile Views', value: '24', icon: Users, color: 'text-accent' },
    { label: 'Avg Rating', value: user?.rating?.toFixed(1) || 'N/A', icon: Star, color: 'text-purple' },
  ];

  const contractorStats = [
    { label: 'Active Jobs', value: stats.jobs, icon: Briefcase, color: 'text-primary' },
    { label: 'Pending Applications', value: stats.applications, icon: Clock, color: 'text-accent' },
    { label: 'Total Workers Hired', value: '45', icon: Users, color: 'text-blue' },
    { label: 'Avg Rating', value: user?.rating?.toFixed(1) || 'N/A', icon: Star, color: 'text-purple' },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-text-muted">
            {isLabour
              ? 'Find your next job opportunity'
              : 'Manage your jobs and find skilled workers'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(isLabour ? labourStats : contractorStats).map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="text-center">
                <Icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
                <div className="text-2xl font-bold text-text mb-1">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Jobs */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  {isLabour ? 'Recommended Jobs' : 'Your Jobs'}
                </h2>
                <Link to={isLabour ? '/jobs' : '/post-job'}>
                  <Button variant="ghost" size="sm">
                    {isLabour ? 'View All' : 'Post New'}
                  </Button>
                </Link>
              </div>
              {recentJobs.length === 0 ? (
                <p className="text-text-muted text-center py-8">
                  {isLabour ? 'No jobs match your profile' : 'You haven\'t posted any jobs yet'}
                </p>
              ) : (
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <Link key={job._id} to={`/jobs/${job._id}`}>
                      <div className="p-4 bg-surface2 rounded-lg border border-border hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{job.title}</h3>
                            <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
                              <span className="flex items-center gap-1">
                                <Briefcase size={14} />
                                {job.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <IndianRupee size={14} />
                                {job.dailyRate}/day
                              </span>
                            </div>
                          </div>
                          <Badge variant={job.status === 'active' ? 'success' : 'warning'}>
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Applications */}
            {isContractor && recentApplications.length > 0 && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Applications</h2>
                  <Link to="/applications">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentApplications.map((app) => (
                    <div key={app._id} className="p-4 bg-surface2 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar src={app.workerId?.avatarUrl} name={app.workerId?.name} size="sm" />
                          <div>
                            <div className="font-medium">{app.workerId?.name}</div>
                            <div className="text-sm text-text-muted">{app.workerId?.trade}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={app.status === 'pending' ? 'warning' : app.status === 'accepted' ? 'success' : 'danger'}>
                            {app.status}
                          </Badge>
                          <Link to={`/workers/${app.workerId?._id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-2">
                {isLabour ? (
                  <>
                    <Link to="/jobs" className="block">
                      <Button variant="secondary" className="w-full justify-start">
                        <Briefcase size={18} />
                        Browse Jobs
                      </Button>
                    </Link>
                    <Link to="/profile" className="block">
                      <Button variant="secondary" className="w-full justify-start">
                        <Users size={18} />
                        Edit Profile
                      </Button>
                    </Link>
                    <Link to="/applications" className="block">
                      <Button variant="secondary" className="w-full justify-start">
                        <Clock size={18} />
                        My Applications
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/post-job" className="block">
                      <Button className="w-full justify-start">
                        <Briefcase size={18} />
                        Post a Job
                      </Button>
                    </Link>
                    <Link to="/workers" className="block">
                      <Button variant="secondary" className="w-full justify-start">
                        <Users size={18} />
                        Find Workers
                      </Button>
                    </Link>
                    <Link to="/applications" className="block">
                      <Button variant="secondary" className="w-full justify-start">
                        <CheckCircle size={18} />
                        Manage Applications
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </Card>

            {/* Unread Messages */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Link to="/messages">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="text-center py-8 text-text-muted">
                <MessageSquare className="mx-auto mb-2 opacity-50" size={32} />
                <p className="text-sm">No unread messages</p>
              </div>
            </Card>

            {/* Profile Completion */}
            <Card>
              <h2 className="text-lg font-semibold mb-4">Profile Completion</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-text-muted">Progress</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="h-2 bg-surface2 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-3/4 rounded-full" />
                </div>
              </div>
              <Link to="/profile">
                <Button variant="outline" className="w-full">Complete Profile</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
