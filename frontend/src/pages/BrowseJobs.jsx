import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, MapPin, IndianRupee, Users, Calendar, Briefcase, BadgeCheck } from 'lucide-react';
import { jobsAPI } from '../services/api';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import { PageSkeleton } from '../components/ui/LoadingSkeleton';
import { useToast } from '../hooks/useToast';

const BrowseJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    state: searchParams.get('state') || '',
    trade: searchParams.get('trade') || '',
    minRate: searchParams.get('minRate') || '',
    maxRate: searchParams.get('maxRate') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
  });

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Construction', label: 'Construction' },
    { value: 'Agriculture', label: 'Agriculture' },
    { value: 'Skilled Trade', label: 'Skilled Trade' },
    { value: 'Renovation', label: 'Renovation' },
    { value: 'Loading/Shifting', label: 'Loading/Shifting' },
    { value: 'Other', label: 'Other' },
  ];

  const stateOptions = [
    { value: '', label: 'All States' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Maharashtra', label: 'Maharashtra' },
  ];

  const tradeOptions = [
    { value: '', label: 'All Trades' },
    { value: 'Masonry', label: 'Masonry' },
    { value: 'Electrician', label: 'Electrician' },
    { value: 'Plumbing', label: 'Plumbing' },
    { value: 'Carpentry', label: 'Carpentry' },
    { value: 'Painting', label: 'Painting' },
    { value: 'Welding', label: 'Welding' },
    { value: 'Farm Labour', label: 'Farm Labour' },
    { value: 'Road & Civil', label: 'Road & Civil' },
  ];

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: searchParams.get('page') || 1,
        limit: 10,
      };
      const response = await jobsAPI.getJobs(params);
      setJobs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">Available Jobs</h1>
          <p className="text-text-muted">Find work opportunities across India</p>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-20 z-30 bg-surface border border-border rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <Select value={filters.type} onChange={(e) => updateFilter('type', e.target.value)} options={typeOptions} />
            <Select value={filters.state} onChange={(e) => updateFilter('state', e.target.value)} options={stateOptions} />
            <Select value={filters.trade} onChange={(e) => updateFilter('trade', e.target.value)} options={tradeOptions} />
            <Select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'rate', label: 'Highest Rate' },
              ]}
            />
          </div>

          {/* Rate Range */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <span className="text-sm text-text-muted">Daily Rate:</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minRate}
              onChange={(e) => updateFilter('minRate', e.target.value)}
              className="w-24 bg-surface border border-border rounded px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary"
            />
            <span className="text-text-muted">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxRate}
              onChange={(e) => updateFilter('maxRate', e.target.value)}
              className="w-24 bg-surface border border-border rounded px-3 py-1.5 text-sm text-text focus:outline-none focus:border-primary"
            />
            <span className="text-text-muted">₹</span>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <PageSkeleton />
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-surface2 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-text-muted" size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-text-muted">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link key={job._id} to={`/jobs/${job._id}`}>
                  <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-semibold">{job.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                              <Briefcase size={14} />
                              {job.contractorId?.company || job.contractorId?.name}
                              {job.contractorId?.verified && (
                                <BadgeCheck size={14} className="text-primary" />
                              )}
                            </div>
                          </div>
                          <Badge variant={job.status === 'active' ? 'success' : 'warning'}>
                            {job.status}
                          </Badge>
                        </div>

                        <p className="text-text-muted text-sm mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-text-muted">
                            <MapPin size={16} />
                            {job.location.district}, {job.location.state}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <IndianRupee size={16} className="text-primary" />
                            <span className="font-medium text-text">{job.dailyRate}/day</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-text-muted">
                            <Users size={16} />
                            {job.workersNeeded} workers needed
                          </div>
                          <div className="flex items-center gap-1.5 text-text-muted">
                            <Calendar size={16} />
                            {job.duration}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <Badge variant="default">{job.type}</Badge>
                          <Badge variant="info">{job.trade}</Badge>
                          {job.requiredSkills?.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="default">{skill}</Badge>
                          ))}
                          {job.accommodation !== 'none' && (
                            <Badge variant="success">
                              {job.accommodation === 'full' ? 'Free Stay' : 'Partial Stay'}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-border">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">₹{job.dailyRate}</div>
                          <div className="text-xs text-text-muted">per day</div>
                        </div>
                        <Button size="sm">View Details</Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-sm text-text-muted">
                      <div className="flex items-center gap-4">
                        <span>{job.views} views</span>
                        <span>{job.applicantsCount} applicants</span>
                      </div>
                      <span>
                        Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="secondary"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${pagination.page === i + 1
                        ? 'bg-primary text-background'
                        : 'bg-surface2 text-text-muted hover:text-text'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button
                  variant="secondary"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;
