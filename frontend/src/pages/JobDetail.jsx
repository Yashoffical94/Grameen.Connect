import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, IndianRupee, Users, Calendar, Briefcase, BadgeCheck, Clock, Mail, Phone, Share2, Flag } from 'lucide-react';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/shared/Avatar';
import Modal from '../components/ui/Modal';
import { useToast } from '../hooks/useToast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLabour } = useAuth();
  const { toast } = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverMessage, setCoverMessage] = useState('');
  const [expectedRate, setExpectedRate] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const response = await jobsAPI.getJob(id);
      setJob(response.data.data);
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationsAPI.apply({
        jobId: job._id,
        coverMessage,
        expectedRate: expectedRate ? Number(expectedRate) : job.dailyRate,
      });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      fetchJob();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleJobStatusChange = async (status) => {
    try {
      await jobsAPI.updateJobStatus(job._id, status);
      toast.success(`Job marked as ${status}`);
      fetchJob();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleApplicationStatusChange = async (applicationId, status) => {
    try {
      await applicationsAPI.updateApplication(applicationId, status);
      toast.success(`Application ${status}`);
      fetchJob();
    } catch (error) {
      toast.error('Failed to update application');
    }
  };

  if (loading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isOwner = user?.id === job.contractorId?._id;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={job.status === 'active' ? 'success' : 'warning'}>
                  {job.status}
                </Badge>
                <Badge variant="default">{job.type}</Badge>
              </div>
              <h1 className="text-3xl font-bold font-heading mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-text-muted">
                <div className="flex items-center gap-1.5">
                  <Briefcase size={16} />
                  {job.contractorId?.company || job.contractorId?.name}
                  {job.contractorId?.verified && (
                    <BadgeCheck size={16} className="text-primary" />
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={16} />
                  {job.location.district}, {job.location.state}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">₹{job.dailyRate}</div>
              <div className="text-sm text-text-muted">per day</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 py-4 border-y border-border">
            <div className="flex items-center gap-2">
              <Users className="text-text-muted" size={20} />
              <div>
                <div className="text-sm text-text-muted">Workers Needed</div>
                <div className="font-semibold">{job.workersNeeded}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-text-muted" size={20} />
              <div>
                <div className="text-sm text-text-muted">Duration</div>
                <div className="font-semibold">{job.duration}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="text-text-muted" size={20} />
              <div>
                <div className="text-sm text-text-muted">Total Budget</div>
                <div className="font-semibold">₹{job.dailyRate * job.workersNeeded}/day</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="text-text-muted" size={20} />
              <div>
                <div className="text-sm text-text-muted">Start Date</div>
                <div className="font-semibold">{new Date(job.startDate).toLocaleDateString('en-IN')}</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            {isLabour && job.status === 'active' && (
              <Button onClick={() => setShowApplyModal(true)}>
                Apply Now
              </Button>
            )}
            <Button variant="secondary">
              <Mail size={18} />
              Contact
            </Button>
            <Button variant="ghost">
              <Share2 size={18} />
              Share
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <p className="text-text-muted whitespace-pre-line">{job.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-text mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills?.map((skill, i) => (
                      <Badge key={i} variant="default">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text mb-2">Trade</h3>
                  <Badge variant="info">{job.trade}</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text mb-2">Accommodation</h3>
                  <Badge variant={job.accommodation === 'full' ? 'success' : job.accommodation === 'partial' ? 'warning' : 'default'}>
                    {job.accommodation === 'none' ? 'Not Provided' : job.accommodation === 'partial' ? 'Partial Provided' : 'Fully Provided'}
                  </Badge>
                </div>
                {job.languagePreference && (
                  <div>
                    <h3 className="text-sm font-medium text-text mb-2">Language Preference</h3>
                    <span className="text-text-muted">{job.languagePreference}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Applicants (Contractor Only) */}
            {isOwner && job.applicants && (
              <div className="bg-surface border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Applications ({job.applicants.length})</h2>
                {job.applicants.length === 0 ? (
                  <p className="text-text-muted">No applications yet</p>
                ) : (
                  <div className="space-y-3">
                    {job.applicants.map((app) => (
                      <div key={app._id} className="flex items-center justify-between p-4 bg-surface2 rounded-lg border border-border">
                        <div className="flex items-center gap-3">
                          <Avatar src={app.workerId?.avatarUrl} name={app.workerId?.name} size="md" />
                          <div>
                            <div className="font-medium">{app.workerId?.name}</div>
                            <div className="text-sm text-text-muted">{app.workerId?.trade} • {app.workerId?.experience} years exp</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>
                            {app.status}
                          </Badge>
                          {app.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleApplicationStatusChange(app._id, 'accepted')}
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleApplicationStatusChange(app._id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contractor Info */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Posted By</h3>
              <div className="flex items-center gap-3 mb-4">
                <Avatar src={job.contractorId?.avatarUrl} name={job.contractorId?.name} verified={job.contractorId?.verified} size="lg" />
                <div>
                  <div className="font-medium">{job.contractorId?.name}</div>
                  <div className="text-sm text-text-muted">{job.contractorId?.company}</div>
                </div>
              </div>
              {job.contractorId?.phone && (
                <div className="flex items-center gap-2 text-text-muted mb-2">
                  <Phone size={16} />
                  {job.contractorId.phone}
                </div>
              )}
              {job.contractorId?.email && (
                <div className="flex items-center gap-2 text-text-muted">
                  <Mail size={16} />
                  {job.contractorId.email}
                </div>
              )}
            </div>

            {/* Job Stats */}
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Job Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-muted">Views</span>
                  <span className="font-medium">{job.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Applicants</span>
                  <span className="font-medium">{job.applicantsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Status</span>
                  <Badge variant={job.status === 'active' ? 'success' : 'warning'}>{job.status}</Badge>
                </div>
              </div>
            </div>

            {/* Actions for Owner */}
            {isOwner && (
              <div className="bg-surface border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Manage Job</h3>
                <div className="space-y-2">
                  <Button
                    variant={job.status === 'active' ? 'secondary' : 'primary'}
                    className="w-full"
                    onClick={() => handleJobStatusChange(job.status === 'active' ? 'closed' : 'active')}
                  >
                    {job.status === 'active' ? 'Close Job' : 'Reopen Job'}
                  </Button>
                  <Button variant="secondary" className="w-full" onClick={() => navigate(`/post-job?edit=${job._id}`)}>
                    Edit Job
                  </Button>
                  <Button variant="danger" className="w-full" onClick={async () => {
                    if (confirm('Are you sure you want to delete this job?')) {
                      await jobsAPI.deleteJob(job._id);
                      toast.success('Job deleted');
                      navigate('/jobs');
                    }
                  }}>
                    Delete Job
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        title="Apply for this Job"
        actions={
          <>
            <Button variant="secondary" onClick={() => setShowApplyModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleApply} loading={applying}>
              Submit Application
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Cover Message
            </label>
            <textarea
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary min-h-[100px]"
              placeholder="Tell the contractor about your experience..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">
              Expected Daily Rate (₹)
            </label>
            <input
              type="number"
              value={expectedRate}
              onChange={(e) => setExpectedRate(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary"
              placeholder={job.dailyRate.toString()}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetail;
