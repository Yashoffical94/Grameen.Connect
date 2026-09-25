import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Users, Briefcase, CheckCircle, MapPin, Star, Shield, Globe, Phone, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const Home = () => {
  const navigate = useNavigate();
  const [searchTrade, setSearchTrade] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTrade) params.set('trade', searchTrade);
    if (searchLocation) params.set('state', searchLocation);
    navigate(`/workers?${params.toString()}`);
  };

  const trades = [
    { name: 'Masonry', icon: '🧱', color: 'from-orange-500 to-red-500' },
    { name: 'Electrician', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
    { name: 'Plumbing', icon: '🔧', color: 'from-blue-500 to-cyan-500' },
    { name: 'Carpentry', icon: '🪚', color: 'from-amber-600 to-amber-800' },
    { name: 'Painting', icon: '🎨', color: 'from-purple-500 to-pink-500' },
    { name: 'Welding', icon: '🔥', color: 'from-red-600 to-orange-600' },
    { name: 'Farm Labour', icon: '🌾', color: 'from-green-500 to-emerald-600' },
    { name: 'Road & Civil', icon: '🛣️', color: 'from-gray-500 to-slate-600' },
  ];

  const stats = [
    { value: '18,000+', label: 'Verified Workers' },
    { value: '4,200+', label: 'Active Contractors' },
    { value: '32+', label: 'Districts Covered' },
    { value: '15,000+', label: 'Jobs Completed' },
  ];

  const testimonials = [
    {
      name: 'Ramesh Singh',
      role: 'Mason, Patna',
      text: 'मैंने इस ऐप से 3 महीने में 5 बड़े प्रोजेक्ट पाए। अब मुझे काम की कोई कमी नहीं है।',
      translation: '"I found 5 big projects in 3 months using this app. No shortage of work now."',
      rating: 5,
    },
    {
      name: 'Anil Sharma',
      role: 'Contractor, Gaya',
      text: 'यहाँ से मुझे तुरंत स्किल्ड लेबर मिल जाता है। वेरिफाइड वर्कर्स होने से भरोसा बढ़ता है।',
      translation: '"I get skilled labour immediately. Verified workers increase trust."',
      rating: 5,
    },
    {
      name: 'Santosh Kumar',
      role: 'Electrician, Varanasi',
      text: 'पहले काम ढूँढने में हफ्तों लगते थे। अब सीधा ऑनलाइन प्रोफाइल बनाई और काम मिल गया।',
      translation: '"Earlier it took weeks to find work. Now I made a profile online and got jobs."',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-14 sm:py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs sm:text-sm text-text-muted mb-5 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Trusted across 32+ districts
          </span>
          <div className="mb-5 sm:mb-6">
            <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3">Built for local work</p>
          </div>
          <h1 className="text-[2.35rem] sm:text-4xl md:text-6xl font-bold font-heading mb-5 sm:mb-6 leading-[1.08] tracking-tight">
            Connecting Rural Labour to
            <span className="text-gradient"> Contractors</span>
          </h1>
          <p className="text-base sm:text-xl text-text-muted mb-7 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Fast, Free, Verified. Find skilled workers or jobs across Bihar, UP, Jharkhand, Rajasthan, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto text-left">
            <form onSubmit={handleSearch} className="relative glass crystal rounded-[1.75rem] p-3 sm:p-4 shadow-2xl shadow-orange-950/20">
              <div className="hidden sm:flex items-center justify-between px-2 pb-3">
                <div>
                  <p className="text-sm font-semibold text-text">Find the right person for the job</p>
                  <p className="text-xs text-text-muted mt-0.5">Search verified workers near you</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-medium text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  Live network
                </span>
              </div>
              <div className="grid md:grid-cols-[1fr_1fr_auto] gap-2.5">
                <label className="group flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 transition-colors focus-within:border-primary/60 focus-within:bg-primary/5">
                  <Search size={19} className="shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">What do you need?</span>
                    <input
                      aria-label="Search by trade"
                      placeholder="Mason, electrician..."
                      value={searchTrade}
                      onChange={(e) => setSearchTrade(e.target.value)}
                      className="mt-0.5 w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted/70"
                    />
                  </span>
                </label>
                <label className="group flex min-h-14 items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 transition-colors focus-within:border-primary/60 focus-within:bg-primary/5">
                  <MapPin size={19} className="shrink-0 text-primary" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">Where?</span>
                    <input
                      aria-label="Search by location"
                      placeholder="City, district or state"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="mt-0.5 w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted/70"
                    />
                  </span>
                </label>
                <Button type="submit" className="min-h-14 rounded-2xl px-6 md:w-auto w-full">
                  <Search size={18} aria-hidden="true" />
                  <span>Search workers</span>
                </Button>
              </div>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-text-muted sm:justify-start sm:px-2">
              <span className="mr-1">Popular:</span>
              {['Mason', 'Electrician', 'Plumber', 'Carpenter'].map((trade) => (
                <button
                  key={trade}
                  type="button"
                  onClick={() => setSearchTrade(trade)}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  {trade}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-4 mt-4 sm:mt-6">
            <Link to="/signup?role=labour">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                I'm a Worker
              </Button>
            </Link>
            <Link to="/signup?role=contractor">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                I'm a Contractor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 sm:py-12 px-4 glass border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Create Profile</h3>
              <p className="text-text-muted">
                Sign up for free and create your profile with skills, experience, and location.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Find Jobs / Workers</h3>
              <p className="text-text-muted">
                Browse available jobs or search for skilled workers in your area.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Connect & Work</h3>
              <p className="text-text-muted">
                Chat directly, finalize details, and start working together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trade Categories */}
      <section className="py-14 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-8 sm:block sm:text-center sm:mb-12">
            <div>
              <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-2">Browse skills</p>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                Find Workers by Trade
              </h2>
            </div>
            <span className="text-xs text-text-muted sm:hidden">8 categories</span>
          </div>
          <p className="hidden sm:block text-text-muted text-center mb-12">
            Skilled labour across 8+ categories
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trades.map((trade) => (
              <Link
                key={trade.name}
                to={`/workers?trade=${trade.name}`}
                className="group glass glass-hover crystal p-6 rounded-2xl"
              >
                <div className={`text-4xl mb-3 bg-gradient-to-br ${trade.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto`}>
                  {trade.icon}
                </div>
                <h3 className="font-semibold text-center group-hover:text-primary transition-colors">
                  {trade.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold font-heading text-center mb-12">
            Why Choose Grameen Connect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass glass-hover crystal p-6 rounded-2xl">
              <Shield className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Aadhaar Verified</h3>
              <p className="text-text-muted">
                All workers are phone and Aadhaar verified for your safety and trust.
              </p>
            </div>
            <div className="glass glass-hover crystal p-6 rounded-2xl">
              <MapPin className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Hyperlocal Search</h3>
              <p className="text-text-muted">
                Find workers and jobs in your district and nearby areas.
              </p>
            </div>
            <div className="glass glass-hover crystal p-6 rounded-2xl">
              <Globe className="text-primary mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Local Language</h3>
              <p className="text-text-muted">
                Platform available in Hindi, Bengali, Bhojpuri, and English.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold font-heading text-center mb-4">
            What Our Users Say
          </h2>
          <p className="text-text-muted text-center mb-12">
            Real stories from workers and contractors
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass glass-hover p-6 rounded-2xl">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="fill-accent text-accent" size={16} />
                  ))}
                </div>
                <p className="text-lg mb-2">{t.text}</p>
                <p className="text-text-muted text-sm mb-4">{t.translation}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-text-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 md:p-12 text-center shadow-glow crystal">
          <h2 className="text-3xl font-bold font-heading mb-4 text-background">
            Ready to Get Started?
          </h2>
          <p className="text-background/80 mb-8 text-lg">
            Join thousands of workers and contractors already using Grameen Connect
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup?role=labour">
              <Button className="bg-background text-primary hover:bg-background/90">
                Join as Worker
              </Button>
            </Link>
            <Link to="/signup?role=contractor">
              <Button className="bg-background text-primary hover:bg-background/90">
                Join as Contractor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
