import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin, Star, BadgeCheck, IndianRupee, Briefcase } from 'lucide-react';
import { usersAPI } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Avatar from '../components/shared/Avatar';
import StarRating from '../components/shared/StarRating';
import Badge from '../components/ui/Badge';
import { PageSkeleton } from '../components/ui/LoadingSkeleton';
import { useToast } from '../hooks/useToast';

const BrowseWorkers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });

  const [filters, setFilters] = useState({
    trade: searchParams.get('trade') || '',
    state: searchParams.get('state') || '',
    available: searchParams.get('available') || '',
    verified: searchParams.get('verified') || '',
    minRate: searchParams.get('minRate') || '',
    maxRate: searchParams.get('maxRate') || '',
    sortBy: searchParams.get('sortBy') || 'rating',
  });

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

  useEffect(() => {
    fetchWorkers();
  }, [searchParams]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page: searchParams.get('page') || 1,
        limit: 10,
      };
      const response = await usersAPI.getWorkers(params);
      setWorkers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load workers');
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
          <h1 className="text-3xl font-bold font-heading mb-2">Find Skilled Workers</h1>
          <p className="text-text-muted">Browse verified labourers across India</p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="sticky top-20 z-30 bg-surface border border-border rounded-xl p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or skill..."
                  className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <Select
              value={filters.trade}
              onChange={(e) => updateFilter('trade', e.target.value)}
              options={tradeOptions}
            />
            <Select
              value={filters.state}
              onChange={(e) => updateFilter('state', e.target.value)}
              options={stateOptions}
            />
            <Select
              value={filters.available}
              onChange={(e) => updateFilter('available', e.target.value)}
              options={[
                { value: '', label: 'All Workers' },
                { value: 'true', label: 'Available Now' },
              ]}
            />
            <Select
              value={filters.verified}
              onChange={(e) => updateFilter('verified', e.target.value)}
              options={[
                { value: '', label: 'All' },
                { value: 'true', label: 'Verified Only' },
              ]}
            />
            <Select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              options={[
                { value: 'rating', label: 'Top Rated' },
                { value: 'jobs', label: 'Most Jobs' },
                { value: 'rate', label: 'Rate: Low to High' },
                { value: 'newest', label: 'Newest First' },
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
            {(filters.minRate || filters.maxRate) && (
              <button
                onClick={() => {
                  updateFilter('minRate', '');
                  updateFilter('maxRate', '');
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <PageSkeleton />
        ) : workers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-surface2 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-text-muted" size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-2">No workers found</h3>
            <p className="text-text-muted mb-4">Try adjusting your filters</p>
            <Button onClick={() => {
              setFilters({ trade: '', state: '', available: '', verified: '', minRate: '', maxRate: '', sortBy: 'rating' });
              setSearchParams({});
            }}>
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workers.map((worker) => (
                <Link key={worker._id} to={`/workers/${worker._id}`}>
                  <div className="bg-surface border border-border rounded-xl p-5 hover:border-primary/30 transition-all h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar src={worker.avatarUrl} name={worker.name} verified={worker.verified} size="lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{worker.name}</h3>
                        <p className="text-primary font-medium">{worker.trade}</p>
                        {worker.verified && (
                          <Badge variant="success" className="mt-1">
                            <BadgeCheck size={12} className="mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <MapPin size={16} />
                        {worker.location?.district}, {worker.location?.state}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Briefcase size={16} />
                        {worker.experience || 0} years experience
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star size={16} className="text-accent fill-accent" />
                        <span className="font-medium">{worker.rating?.toFixed(1)}</span>
                        <span className="text-text-muted">({worker.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <IndianRupee size={16} className="text-primary" />
                        <span className="font-medium">{worker.dailyRate}/day</span>
                      </div>
                    </div>

                    {worker.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {worker.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="default">{skill}</Badge>
                        ))}
                        {worker.skills.length > 3 && (
                          <Badge variant="default">+{worker.skills.length - 3}</Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Badge variant={worker.available ? 'success' : 'warning'}>
                        {worker.available ? 'Available' : 'Busy'}
                      </Badge>
                      <span className="text-sm text-text-muted">
                        {worker.totalJobsDone} jobs done
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

export default BrowseWorkers;
