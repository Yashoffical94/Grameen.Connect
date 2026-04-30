import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../hooks/useToast';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();

  const [role, setRole] = useState(searchParams.get('role') || 'labour');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(email, password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (type) => {
    if (type === 'labour') {
      setEmail('ramesh@gc.com');
      setPassword('test123');
    } else {
      setEmail('anil@gc.com');
      setPassword('test123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading mb-2">Welcome Back</h1>
          <p className="text-text-muted">
            Login to continue finding {role === 'labour' ? 'jobs' : 'workers'}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          {/* Role Tabs */}
          <div className="flex mb-6 bg-surface2 rounded-lg p-1">
            <button
              onClick={() => setRole('labour')}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-colors ${
                role === 'labour'
                  ? 'bg-primary text-background'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Worker
            </button>
            <button
              onClick={() => setRole('contractor')}
              className={`flex-1 py-2.5 px-4 rounded-md font-medium transition-colors ${
                role === 'contractor'
                  ? 'bg-primary text-background'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Contractor
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mb-6 p-4 bg-surface2 border border-border rounded-lg">
            <p className="text-sm text-text-muted mb-2">Demo Credentials:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoCredentials('labour')}
                className="text-xs px-3 py-1.5 bg-border rounded hover:bg-primary/20 hover:text-primary transition-colors"
              >
                Worker Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials('contractor')}
                className="text-xs px-3 py-1.5 bg-border rounded hover:bg-primary/20 hover:text-primary transition-colors"
              >
                Contractor Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2.5 text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface border border-border rounded-lg pl-10 pr-10 py-2.5 text-text placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="••••••••"
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

            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border bg-surface text-primary focus:ring-primary" />
                <span className="text-sm text-text-muted">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Login
            </Button>
          </form>

          <p className="text-center mt-6 text-text-muted">
            Don't have an account?{' '}
            <Link to={`/signup?role=${role}`} className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
