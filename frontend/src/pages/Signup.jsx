import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Phone, MapPin, User, Briefcase, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useToast } from '../hooks/useToast';

const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const { toast } = useToast();

  const [role, setRole] = useState(searchParams.get('role') || 'labour');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
    city: '',
    trade: '',
    company: '',
    acceptTerms: false,
  });

  const states = [
    { value: '', label: 'Select State' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Jharkhand', label: 'Jharkhand' },
    { value: 'West Bengal', label: 'West Bengal' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
    { value: 'Maharashtra', label: 'Maharashtra' },
  ];

  const trades = [
    { value: '', label: 'Select Your Trade' },
    { value: 'Masonry', label: 'Masonry (मिस्त्री)' },
    { value: 'Electrician', label: 'Electrician (इलेक्ट्रीशियन)' },
    { value: 'Plumbing', label: 'Plumbing (प्लंबर)' },
    { value: 'Carpentry', label: 'Carpentry (बढ़ई)' },
    { value: 'Painting', label: 'Painting (पेंटर)' },
    { value: 'Welding', label: 'Welding (वेल्डर)' },
    { value: 'Farm Labour', label: 'Farm Labour (किसान मजदूर)' },
    { value: 'Road & Civil', label: 'Road & Civil (सड़क निर्माण)' },
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const sendOTP = async () => {
    if (!formData.phone) {
      toast.error('Please enter phone number first');
      return;
    }
    // OTP sending would happen via API here
    setOtpSent(true);
    toast.info('OTP sent! (Check console in dev mode)');
    console.log('OTP for', formData.phone, ': 123456');
  };

  const verifyOTP = () => {
    if (otp === '123456') {
      setStep(2);
      toast.success('Phone verified!');
    } else {
      toast.error('Invalid OTP. Use 123456 for demo.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
        state: formData.state,
        district: formData.district,
        city: formData.city,
        trade: role === 'labour' ? formData.trade : undefined,
        company: role === 'contractor' ? formData.company : undefined,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">Create Account</h1>
          <p className="text-text-muted">
            Join Grameen Connect and start {role === 'labour' ? 'finding jobs' : 'hiring workers'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step >= 1 ? 'bg-primary text-background' : 'bg-surface2 text-text-muted'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-primary' : 'bg-surface2'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
              step >= 2 ? 'bg-primary text-background' : 'bg-surface2 text-text-muted'
            }`}>
              2
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          {/* Role Tabs */}
          {step === 1 && (
            <div className="flex mb-6 bg-surface2 rounded-lg p-1">
              <button
                onClick={() => setRole('labour')}
                className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-colors ${
                  role === 'labour'
                    ? 'bg-primary text-background'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                I'm a Worker
              </button>
              <button
                onClick={() => setRole('contractor')}
                className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-colors ${
                  role === 'contractor'
                    ? 'bg-primary text-background'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                I'm a Contractor
              </button>
            </div>
          )}

          {step === 1 ? (
            /* Step 1: Phone Verification */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Step 1: Verify Phone</h3>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                  <Button type="button" onClick={sendOTP} disabled={otpSent}>
                    {otpSent ? 'Sent ✓' : 'Send OTP'}
                  </Button>
                </div>
              </div>

              {otpSent && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1.5">
                      Enter OTP
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="flex-1 bg-surface border border-border rounded-lg px-4 py-2.5 text-text text-center tracking-widest text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <Button type="button" onClick={verifyOTP}>
                        Verify
                      </Button>
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Demo OTP: 123456 (check console)
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Step 2: Account Details */
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Step 2: Account Details</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="First"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Last"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {role === 'labour' ? (
                <Select
                  label="Your Trade"
                  value={formData.trade}
                  onChange={(e) => updateField('trade', e.target.value)}
                  options={trades}
                  required
                />
              ) : (
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Your Company Name"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <Select
                  label="State"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  options={states}
                  required
                />
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-text mb-1.5">
                    District
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => updateField('district', e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Your district"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="w-full bg-surface border border-border rounded-lg pl-10 pr-10 py-2.5 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Min 6 characters"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2.5 text-text focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => updateField('acceptTerms', e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary mt-0.5"
                />
                <span className="text-sm text-text-muted">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>

              <Button type="submit" loading={loading} className="w-full">
                Create Account
              </Button>
            </form>
          )}

          <p className="text-center mt-6 text-text-muted">
            Already have an account?{' '}
            <Link to={`/login?role=${role}`} className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
